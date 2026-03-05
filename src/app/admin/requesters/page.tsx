'use client'

export const dynamic = 'force-dynamic'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
    UserPlus,
    Loader2,
    Trash2,
    Plus,
    ToggleLeft,
    ToggleRight,
    Users,
    Edit3,
    Check,
    X
} from 'lucide-react'
import { toast } from 'sonner'

interface Requester {
    id: string
    name: string
    is_active: boolean
    created_at: string
    updated_at: string
}

export default function RequestersPage() {
    const [requesters, setRequesters] = useState<Requester[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [newName, setNewName] = useState('')
    const [isAdding, setIsAdding] = useState(false)
    const [editingId, setEditingId] = useState<string | null>(null)
    const [editName, setEditName] = useState('')
    const supabase = createClient()

    useEffect(() => {
        fetchRequesters()
    }, [])

    const fetchRequesters = async () => {
        try {
            const { data, error } = await supabase
                .from('requesters')
                .select('*')
                .order('name')

            if (error) throw error
            setRequesters(data || [])
        } catch (error: any) {
            toast.error('Yüklenirken hata oluştu', { description: error.message })
        } finally {
            setIsLoading(false)
        }
    }

    const handleAdd = async () => {
        const trimmed = newName.trim()
        if (!trimmed) {
            toast.error('İsim boş olamaz')
            return
        }

        setIsAdding(true)
        try {
            const { error } = await supabase
                .from('requesters')
                .insert({ name: trimmed })

            if (error) {
                if (error.code === '23505') {
                    toast.error('Bu isim zaten mevcut')
                } else {
                    throw error
                }
                return
            }

            toast.success('Talep eden eklendi', { description: trimmed })
            setNewName('')
            fetchRequesters()
        } catch (error: any) {
            toast.error('Eklenirken hata oluştu', { description: error.message })
        } finally {
            setIsAdding(false)
        }
    }

    const handleToggleActive = async (requester: Requester) => {
        try {
            const { error } = await supabase
                .from('requesters')
                .update({ is_active: !requester.is_active })
                .eq('id', requester.id)

            if (error) throw error

            toast.success(
                requester.is_active ? 'Pasif yapıldı' : 'Aktif yapıldı',
                { description: requester.name }
            )
            fetchRequesters()
        } catch (error: any) {
            toast.error('Güncellenirken hata oluştu', { description: error.message })
        }
    }

    const handleDelete = async (requester: Requester) => {
        if (!confirm(`"${requester.name}" silinecek. Emin misiniz?`)) return

        try {
            const { error } = await supabase
                .from('requesters')
                .delete()
                .eq('id', requester.id)

            if (error) throw error

            toast.success('Silindi', { description: requester.name })
            fetchRequesters()
        } catch (error: any) {
            toast.error('Silinirken hata oluştu', { description: error.message })
        }
    }

    const handleStartEdit = (requester: Requester) => {
        setEditingId(requester.id)
        setEditName(requester.name)
    }

    const handleSaveEdit = async (id: string) => {
        const trimmed = editName.trim()
        if (!trimmed) {
            toast.error('İsim boş olamaz')
            return
        }

        try {
            const { error } = await supabase
                .from('requesters')
                .update({ name: trimmed })
                .eq('id', id)

            if (error) {
                if (error.code === '23505') {
                    toast.error('Bu isim zaten mevcut')
                } else {
                    throw error
                }
                return
            }

            toast.success('Güncellendi')
            setEditingId(null)
            fetchRequesters()
        } catch (error: any) {
            toast.error('Güncellenirken hata oluştu', { description: error.message })
        }
    }

    const activeCount = requesters.filter(r => r.is_active).length
    const totalCount = requesters.length

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="w-8 h-8 animate-spin text-purple-500" />
            </div>
        )
    }

    return (
        <div className="p-4 md:p-8 space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-white flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-cyan-400 to-cyan-600 rounded-xl flex items-center justify-center">
                        <UserPlus className="w-5 h-5 text-white" />
                    </div>
                    Talep Eden Yönetimi
                </h1>
                <p className="text-slate-400 mt-1">
                    Stok çıkışlarında kullanılan talep eden kişileri yönetin
                </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-4">
                <Card className="bg-cyan-500/10 border-cyan-500/20">
                    <CardContent className="p-4 flex items-center gap-3">
                        <div className="w-10 h-10 bg-cyan-500/20 rounded-xl flex items-center justify-center">
                            <Users className="w-5 h-5 text-cyan-400" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-white">{totalCount}</p>
                            <p className="text-xs text-slate-400">Toplam</p>
                        </div>
                    </CardContent>
                </Card>
                <Card className="bg-emerald-500/10 border-emerald-500/20">
                    <CardContent className="p-4 flex items-center gap-3">
                        <div className="w-10 h-10 bg-emerald-500/20 rounded-xl flex items-center justify-center">
                            <Check className="w-5 h-5 text-emerald-400" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-white">{activeCount}</p>
                            <p className="text-xs text-slate-400">Aktif</p>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Add New */}
            <Card className="bg-slate-800/50 border-slate-700/50">
                <CardHeader className="pb-3">
                    <CardTitle className="text-white text-base flex items-center gap-2">
                        <Plus className="w-5 h-5 text-cyan-400" />
                        Yeni Talep Eden Ekle
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex gap-2">
                        <Input
                            type="text"
                            placeholder="İsim soyisim..."
                            value={newName}
                            onChange={(e) => setNewName(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
                            className="bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-500"
                        />
                        <Button
                            onClick={handleAdd}
                            disabled={isAdding || !newName.trim()}
                            className="bg-cyan-500 hover:bg-cyan-600 text-white shrink-0"
                        >
                            {isAdding ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                                <>
                                    <Plus className="w-4 h-4 mr-1" />
                                    Ekle
                                </>
                            )}
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* List */}
            <Card className="bg-slate-800/50 border-slate-700/50">
                <CardHeader>
                    <CardTitle className="text-white text-base flex items-center gap-2">
                        <Users className="w-5 h-5 text-slate-400" />
                        Talep Edenler
                    </CardTitle>
                    <CardDescription className="text-slate-400">
                        {totalCount} kayıt bulundu
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                    {requesters.length === 0 ? (
                        <div className="text-center py-8 text-slate-500">
                            <Users className="w-12 h-12 mx-auto mb-3 opacity-50" />
                            <p>Henüz talep eden yok</p>
                        </div>
                    ) : (
                        requesters.map((requester) => (
                            <div
                                key={requester.id}
                                className={`flex items-center justify-between p-3 rounded-lg border transition-colors ${requester.is_active
                                        ? 'bg-slate-700/30 border-slate-600/30'
                                        : 'bg-slate-700/10 border-slate-700/20 opacity-60'
                                    }`}
                            >
                                <div className="flex items-center gap-3 flex-1 min-w-0">
                                    {editingId === requester.id ? (
                                        <div className="flex items-center gap-2 flex-1">
                                            <Input
                                                type="text"
                                                value={editName}
                                                onChange={(e) => setEditName(e.target.value)}
                                                onKeyDown={(e) => {
                                                    if (e.key === 'Enter') handleSaveEdit(requester.id)
                                                    if (e.key === 'Escape') setEditingId(null)
                                                }}
                                                className="bg-slate-600/50 border-slate-500 text-white h-8 text-sm"
                                                autoFocus
                                            />
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-8 w-8 text-emerald-400 hover:text-emerald-300"
                                                onClick={() => handleSaveEdit(requester.id)}
                                            >
                                                <Check className="w-4 h-4" />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-8 w-8 text-slate-400 hover:text-white"
                                                onClick={() => setEditingId(null)}
                                            >
                                                <X className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    ) : (
                                        <>
                                            <span className="text-white font-medium truncate">
                                                {requester.name}
                                            </span>
                                            <Badge className={`shrink-0 ${requester.is_active
                                                    ? 'bg-emerald-500/20 text-emerald-400'
                                                    : 'bg-slate-500/20 text-slate-400'
                                                }`}>
                                                {requester.is_active ? 'Aktif' : 'Pasif'}
                                            </Badge>
                                        </>
                                    )}
                                </div>

                                {editingId !== requester.id && (
                                    <div className="flex items-center gap-1 ml-3 shrink-0">
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-8 w-8 text-slate-400 hover:text-white"
                                            onClick={() => handleStartEdit(requester)}
                                            title="Düzenle"
                                        >
                                            <Edit3 className="w-4 h-4" />
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className={`h-8 w-8 ${requester.is_active
                                                    ? 'text-emerald-400 hover:text-emerald-300'
                                                    : 'text-slate-500 hover:text-slate-300'
                                                }`}
                                            onClick={() => handleToggleActive(requester)}
                                            title={requester.is_active ? 'Pasif yap' : 'Aktif yap'}
                                        >
                                            {requester.is_active ? (
                                                <ToggleRight className="w-5 h-5" />
                                            ) : (
                                                <ToggleLeft className="w-5 h-5" />
                                            )}
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-8 w-8 text-red-400 hover:text-red-300 hover:bg-red-500/10"
                                            onClick={() => handleDelete(requester)}
                                            title="Sil"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                    </div>
                                )}
                            </div>
                        ))
                    )}
                </CardContent>
            </Card>
        </div>
    )
}
