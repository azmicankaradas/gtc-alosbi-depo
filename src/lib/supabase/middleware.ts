import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

// ============================================================
// Rate Limiting (Bellek içi, Edge Runtime uyumlu)
// ============================================================
const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000 // 15 dakika
const MAX_LOGIN_ATTEMPTS = 5

interface RateLimitEntry {
    count: number
    firstAttempt: number
}

const loginAttempts = new Map<string, RateLimitEntry>()

// Eski kayıtları temizle (bellek sızıntısını önle)
function cleanupRateLimits() {
    const now = Date.now()
    for (const [key, entry] of loginAttempts.entries()) {
        if (now - entry.firstAttempt > RATE_LIMIT_WINDOW_MS) {
            loginAttempts.delete(key)
        }
    }
}

// Rate limit kontrolü
function checkRateLimit(ip: string): { allowed: boolean; retryAfterSeconds: number } {
    cleanupRateLimits()
    const now = Date.now()
    const entry = loginAttempts.get(ip)

    if (!entry) {
        loginAttempts.set(ip, { count: 1, firstAttempt: now })
        return { allowed: true, retryAfterSeconds: 0 }
    }

    // Pencere süresi dolmuşsa sıfırla
    if (now - entry.firstAttempt > RATE_LIMIT_WINDOW_MS) {
        loginAttempts.set(ip, { count: 1, firstAttempt: now })
        return { allowed: true, retryAfterSeconds: 0 }
    }

    // Limit aşıldı mı?
    if (entry.count >= MAX_LOGIN_ATTEMPTS) {
        const retryAfter = Math.ceil((RATE_LIMIT_WINDOW_MS - (now - entry.firstAttempt)) / 1000)
        return { allowed: false, retryAfterSeconds: retryAfter }
    }

    entry.count++
    return { allowed: true, retryAfterSeconds: 0 }
}

export async function updateSession(request: NextRequest) {
    const pathname = request.nextUrl.pathname

    // Login sayfasına POST isteklerinde rate limiting uygula
    if (pathname === '/login' && request.method === 'POST') {
        const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
            || request.headers.get('x-real-ip')
            || 'unknown'
        const { allowed, retryAfterSeconds } = checkRateLimit(ip)

        if (!allowed) {
            return new NextResponse(
                JSON.stringify({
                    error: 'Çok fazla deneme. Lütfen daha sonra tekrar deneyin.',
                    retryAfter: retryAfterSeconds
                }),
                {
                    status: 429,
                    headers: {
                        'Content-Type': 'application/json',
                        'Retry-After': retryAfterSeconds.toString()
                    }
                }
            )
        }
    }

    let supabaseResponse = NextResponse.next({
        request,
    })

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() {
                    return request.cookies.getAll()
                },
                setAll(cookiesToSet) {
                    cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
                    supabaseResponse = NextResponse.next({
                        request,
                    })
                    cookiesToSet.forEach(({ name, value, options }) =>
                        supabaseResponse.cookies.set(name, value, options)
                    )
                },
            },
        }
    )

    // IMPORTANT: Avoid writing any logic between createServerClient and
    // supabase.auth.getUser(). A simple mistake could make it very hard to debug
    // issues with users being randomly logged out.

    const {
        data: { user },
    } = await supabase.auth.getUser()

    // pathname already declared above

    // Public routes that don't require authentication
    const publicRoutes = ['/login', '/auth', '/pending-approval', '/access-denied']
    const isPublicRoute = publicRoutes.some(route => pathname.startsWith(route))

    // Protected routes - redirect to login if not authenticated
    if (!user && !isPublicRoute) {
        const url = request.nextUrl.clone()
        url.pathname = '/login'
        return NextResponse.redirect(url)
    }

    // If user is authenticated, check approval status
    if (user && !isPublicRoute) {
        const { data: profile } = await supabase
            .from('user_profiles')
            .select('is_approved, status, role')
            .eq('id', user.id)
            .single()

        // If profile doesn't exist, treat as pending (security fix)
        if (!profile) {
            const url = request.nextUrl.clone()
            url.pathname = '/pending-approval'
            return NextResponse.redirect(url)
        }

        // Rejected users go to access-denied
        if (profile.status === 'rejected') {
            const url = request.nextUrl.clone()
            url.pathname = '/access-denied'
            return NextResponse.redirect(url)
        }

        // Pending users go to pending-approval
        if (!profile.is_approved || profile.status === 'pending') {
            const url = request.nextUrl.clone()
            url.pathname = '/pending-approval'
            return NextResponse.redirect(url)
        }

        // Admin routes - only for admins
        if (pathname.startsWith('/admin') && profile.role !== 'admin') {
            const url = request.nextUrl.clone()
            url.pathname = '/'
            return NextResponse.redirect(url)
        }
    }

    // Redirect logged-in and approved users from login/pending/denied pages to dashboard
    if (user && isPublicRoute && pathname !== '/login') {
        const { data: profile } = await supabase
            .from('user_profiles')
            .select('is_approved, status')
            .eq('id', user.id)
            .single()

        if (profile?.is_approved && profile?.status === 'approved') {
            const url = request.nextUrl.clone()
            url.pathname = '/'
            return NextResponse.redirect(url)
        }
    }

    // Redirect logged-in users from login page
    if (user && pathname.startsWith('/login')) {
        const { data: profile } = await supabase
            .from('user_profiles')
            .select('is_approved, status')
            .eq('id', user.id)
            .single()

        if (profile) {
            const url = request.nextUrl.clone()
            if (profile.status === 'rejected') {
                url.pathname = '/access-denied'
            } else if (!profile.is_approved || profile.status === 'pending') {
                url.pathname = '/pending-approval'
            } else {
                url.pathname = '/'
            }
            return NextResponse.redirect(url)
        }
    }

    // IMPORTANT: You *must* return the supabaseResponse object as it is.
    return supabaseResponse
}

