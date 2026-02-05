import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
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

    const pathname = request.nextUrl.pathname

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

