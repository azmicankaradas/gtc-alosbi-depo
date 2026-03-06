import { createClient } from '@supabase/supabase-js'
import { cookies } from 'next/headers'
import { createServerClient } from '@supabase/ssr'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
    try {
        const { userId } = await request.json()

        if (!userId) {
            return NextResponse.json(
                { error: 'userId gerekli' },
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

        // Auth check
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

        if (currentUser.id === userId) {
            return NextResponse.json(
                { error: 'Kendinizi silemezsiniz' },
                { status: 400 }
            )
        }

        // Service role client - bypasses all RLS
        const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey, {
            auth: { autoRefreshToken: false, persistSession: false }
        })

        // Clear ALL foreign key references to this user across ALL tables
        // 1. user_profiles.approved_by
        await supabaseAdmin
            .from('user_profiles')
            .update({ approved_by: null })
            .eq('approved_by', userId)

        // 2. stock_movements.user_id
        await supabaseAdmin
            .from('stock_movements')
            .update({ user_id: null })
            .eq('user_id', userId)

        // 3. stock_counts.started_by (if table exists)
        try {
            await supabaseAdmin
                .from('stock_counts')
                .update({ started_by: null })
                .eq('started_by', userId)
        } catch {
            // Ignore if table doesn't exist
        }

        // 4. Delete user profile explicitly
        await supabaseAdmin
            .from('user_profiles')
            .delete()
            .eq('id', userId)

        // 5. Now delete from auth.users
        const { error } = await supabaseAdmin.auth.admin.deleteUser(userId)

        if (error) {
            console.error('User deletion error:', error.message)
            return NextResponse.json(
                { error: `Silme hatası: ${error.message}` },
                { status: 500 }
            )
        }

        console.log(`[AUDIT] User deleted: ${userId} by ${currentUser.email}`)
        return NextResponse.json({ success: true })
    } catch (error: any) {
        console.error('Delete user API error:', error?.message || error)
        return NextResponse.json(
            { error: `Sunucu hatası: ${error?.message || 'Bilinmeyen hata'}` },
            { status: 500 }
        )
    }
}
