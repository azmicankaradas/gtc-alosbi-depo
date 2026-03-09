'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'

export type UserRole = 'admin' | 'user'

interface UseUserRoleReturn {
    role: UserRole | null
    isAdmin: boolean
    isObserver: boolean
    loading: boolean
    userEmail: string
    userName: string
    userId: string
}

export function useUserRole(): UseUserRoleReturn {
    const [role, setRole] = useState<UserRole | null>(null)
    const [loading, setLoading] = useState(true)
    const [userEmail, setUserEmail] = useState('')
    const [userName, setUserName] = useState('')
    const [userId, setUserId] = useState('')
    const supabase = createClient()

    useEffect(() => {
        const fetchRole = async () => {
            try {
                const { data: { user } } = await supabase.auth.getUser()
                if (!user) {
                    setLoading(false)
                    return
                }

                setUserEmail(user.email || '')
                setUserId(user.id)

                const { data: profile } = await supabase
                    .from('user_profiles')
                    .select('role, full_name')
                    .eq('id', user.id)
                    .single()

                if (profile) {
                    setRole(profile.role as UserRole)
                    setUserName(profile.full_name || user.email?.split('@')[0] || '')
                } else {
                    // Profil yoksa varsayılan user (observer)
                    setRole('user')
                    setUserName(user.email?.split('@')[0] || '')
                }
            } catch (error) {
                console.error('Error fetching user role:', error)
                setRole('user')
            } finally {
                setLoading(false)
            }
        }

        fetchRole()
    }, [supabase])

    return {
        role,
        isAdmin: role === 'admin',
        isObserver: role === 'user',
        loading,
        userEmail,
        userName,
        userId,
    }
}
