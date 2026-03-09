import { createClient } from '@supabase/supabase-js'
import { cookies } from 'next/headers'
import { createServerClient } from '@supabase/ssr'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
    try {
        const { userId, role } = await request.json()

        if (!userId || !role) {
            return NextResponse.json(
                { error: 'userId ve role gerekli' },
                { status: 400 }
            )
        }

        if (!['admin', 'user'].includes(role)) {
            return NextResponse.json(
                { error: 'Geçersiz rol. admin veya user olmalı.' },
                { status: 400 }
            )
        }

        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
        const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
        const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

        if (!supabaseUrl || !serviceRoleKey || !supabaseAnonKey) {
            return NextResponse.json(
                { error: 'Sunucu yapılandırma hatası: Environment variable eksik' },
                { status: 500 }
            )
        }

        // Auth check - mevcut kullanıcının admin olduğunu doğrula
        const cookieStore = await cookies()
        const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
            cookies: {
                getAll() { return cookieStore.getAll() },
                setAll() { },
            },
        })

        const { data: { user: currentUser }, error: authError } = await supabase.auth.getUser()

        if (authError || !currentUser) {
            return NextResponse.json(
                { error: 'Yetkilendirme gerekli. Lütfen tekrar giriş yapın.' },
                { status: 401 }
            )
        }

        // Service role client ile admin kontrolü
        const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey, {
            auth: { autoRefreshToken: false, persistSession: false }
        })

        // Mevcut kullanıcının admin olduğunu doğrula
        const { data: currentProfile } = await supabaseAdmin
            .from('user_profiles')
            .select('role')
            .eq('id', currentUser.id)
            .single()

        if (!currentProfile || currentProfile.role !== 'admin') {
            return NextResponse.json(
                { error: 'Bu işlem için admin yetkisi gerekli.' },
                { status: 403 }
            )
        }

        // Kendi rolünü değiştirmeye çalışıyorsa engelle
        if (currentUser.id === userId) {
            return NextResponse.json(
                { error: 'Kendi rolünüzü değiştiremezsiniz.' },
                { status: 400 }
            )
        }

        // Rolü güncelle
        const { error: updateError } = await supabaseAdmin
            .from('user_profiles')
            .update({ role })
            .eq('id', userId)

        if (updateError) {
            console.error('Role update error:', updateError.message)
            return NextResponse.json(
                { error: `Güncelleme hatası: ${updateError.message}` },
                { status: 500 }
            )
        }

        console.log(`[AUDIT] Role changed: ${userId} -> ${role} by ${currentUser.email}`)
        return NextResponse.json({ success: true, role })
    } catch (error: any) {
        console.error('Update role API error:', error?.message || error)
        return NextResponse.json(
            { error: `Sunucu hatası: ${error?.message || 'Bilinmeyen hata'}` },
            { status: 500 }
        )
    }
}
