'use client'

export const dynamic = 'force-dynamic'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
    Users,
    Search,
    Loader2,
    RefreshCw,
    Trash2
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog'

interface UserProfile {
    id: string
    email: string
    full_name: string | null
    role: 'user' | 'admin'
    created_at: string
}

export default function AdminUsersPage() {
    const router = useRouter()
    const supabase = createClient()
    const [users, setUsers] = useState<UserProfile[]>([])
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState('')
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
    const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null)
    const [actionLoading, setActionLoading] = useState<string | null>(null)

    const fetchUsers = async () => {
        setLoading(true)
        const { data, error } = await supabase
            .from('user_profiles')
            .select('id, email, full_name, role, created_at')
            .order('created_at', { ascending: false })

        if (error) {
            toast.error('Kullanıcılar yüklenemedi', { description: error.message })
        } else {
            setUsers(data || [])
        }
        setLoading(false)
    }

    useEffect(() => {
        fetchUsers()
    }, [])

    const handleDelete = async () => {
        if (!selectedUser) return
        setActionLoading(selectedUser.id)

        try {
            const response = await fetch('/api/admin/delete-user', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId: selectedUser.id }),
            })

            const result = await response.json()

            if (!response.ok) {
                toast.error('Silme başarısız', { description: result.error })
            } else {
                toast.success('Kullanıcı silindi', {
                    description: `${selectedUser.email} başarıyla silindi.`,
                })
                fetchUsers()
            }
        } catch (error) {
            toast.error('Bir hata oluştu', { description: 'Lütfen tekrar deneyin.' })
        }

        setDeleteDialogOpen(false)
        setSelectedUser(null)
        setActionLoading(null)
    }

    const filteredUsers = users.filter(user => {
        return user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (user.full_name?.toLowerCase().includes(searchTerm.toLowerCase()))
    })

    return (
        <div className="p-4 md:p-6 space-y-4 md:space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                        <Users className="h-6 w-6 text-purple-400" />
                        Kullanıcı Yönetimi
                    </h1>
                    <p className="text-slate-400 text-sm">
                        Kayıtlı kullanıcıları görüntüleyin ve yönetin
                    </p>
                </div>
                <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30 text-lg px-4 py-2">
                    {users.length} Kullanıcı
                </Badge>
            </div>

            {/* Search */}
            <Card className="bg-slate-800/50 border-slate-700/50">
                <CardContent className="p-4">
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="flex-1 relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                            <Input
                                placeholder="E-posta veya isim ile ara..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10 bg-slate-700/50 border-slate-600 text-white"
                            />
                        </div>
                        <Button
                            variant="outline"
                            onClick={fetchUsers}
                            className="border-slate-600 text-slate-300 hover:bg-slate-700"
                        >
                            <RefreshCw className="h-4 w-4 mr-2" />
                            Yenile
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* Users Table */}
            <Card className="bg-slate-800/50 border-slate-700/50">
                <CardHeader>
                    <CardTitle className="text-white">Kullanıcılar</CardTitle>
                    <CardDescription className="text-slate-400">
                        Toplam {filteredUsers.length} kullanıcı
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {loading ? (
                        <div className="flex items-center justify-center py-12">
                            <Loader2 className="h-8 w-8 animate-spin text-emerald-400" />
                        </div>
                    ) : (
                        <>
                            {/* Mobile Card View */}
                            <div className="md:hidden space-y-3">
                                {filteredUsers.map((user) => (
                                    <div
                                        key={user.id}
                                        className="p-4 bg-slate-700/30 rounded-lg space-y-3"
                                    >
                                        <div className="flex items-start justify-between gap-2">
                                            <div className="min-w-0 flex-1">
                                                <p className="text-white font-medium text-sm truncate">{user.email}</p>
                                                <p className="text-slate-400 text-xs mt-0.5">{user.full_name || '-'}</p>
                                            </div>
                                            <Badge variant="outline" className="text-slate-400 border-slate-600">
                                                {user.role === 'admin' ? 'Admin' : 'Kullanıcı'}
                                            </Badge>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-slate-500 text-xs">
                                                {new Date(user.created_at).toLocaleDateString('tr-TR')}
                                            </span>
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                onClick={() => {
                                                    setSelectedUser(user)
                                                    setDeleteDialogOpen(true)
                                                }}
                                                disabled={actionLoading === user.id}
                                                className="bg-red-500/10 text-red-400 hover:bg-red-500/20 border-red-500/30"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                                {filteredUsers.length === 0 && (
                                    <p className="text-center text-slate-500 py-8">Kullanıcı bulunamadı</p>
                                )}
                            </div>

                            {/* Desktop Table View */}
                            <div className="hidden md:block overflow-x-auto">
                                <Table>
                                    <TableHeader>
                                        <TableRow className="border-slate-700 hover:bg-transparent">
                                            <TableHead className="text-slate-400">E-posta</TableHead>
                                            <TableHead className="text-slate-400">İsim</TableHead>
                                            <TableHead className="text-slate-400">Rol</TableHead>
                                            <TableHead className="text-slate-400">Kayıt Tarihi</TableHead>
                                            <TableHead className="text-slate-400 text-right">İşlemler</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {filteredUsers.map((user) => (
                                            <TableRow key={user.id} className="border-slate-700 hover:bg-slate-700/30">
                                                <TableCell className="text-white font-medium">{user.email}</TableCell>
                                                <TableCell className="text-slate-300">{user.full_name || '-'}</TableCell>
                                                <TableCell>
                                                    <Badge variant="outline" className="text-slate-400 border-slate-600">
                                                        {user.role === 'admin' ? 'Admin' : 'Kullanıcı'}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="text-slate-400 text-sm">
                                                    {new Date(user.created_at).toLocaleDateString('tr-TR')}
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        onClick={() => {
                                                            setSelectedUser(user)
                                                            setDeleteDialogOpen(true)
                                                        }}
                                                        disabled={actionLoading === user.id}
                                                        className="bg-red-500/10 text-red-400 hover:bg-red-500/20 border-red-500/30"
                                                    >
                                                        <Trash2 className="h-4 w-4 mr-1" />
                                                        Sil
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                        {filteredUsers.length === 0 && (
                                            <TableRow>
                                                <TableCell colSpan={5} className="text-center py-12 text-slate-400">
                                                    Kullanıcı bulunamadı
                                                </TableCell>
                                            </TableRow>
                                        )}
                                    </TableBody>
                                </Table>
                            </div>
                        </>
                    )}
                </CardContent>
            </Card>

            {/* Delete Dialog */}
            <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <DialogContent className="bg-slate-800 border-slate-700 text-white">
                    <DialogHeader>
                        <DialogTitle className="text-red-400">Kullanıcıyı Sil</DialogTitle>
                        <DialogDescription className="text-slate-400">
                            <span className="font-semibold text-white">{selectedUser?.email}</span> kullanıcısını kalıcı olarak silmek istediğinize emin misiniz?
                        </DialogDescription>
                    </DialogHeader>
                    <div className="py-2">
                        <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3">
                            <p className="text-xs text-red-300">
                                <strong>⚠️ Dikkat:</strong> Bu işlem geri alınamaz. Kullanıcı hesabı ve profili kalıcı olarak silinecektir.
                            </p>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => {
                                setDeleteDialogOpen(false)
                                setSelectedUser(null)
                            }}
                            className="border-slate-600 text-slate-300"
                        >
                            İptal
                        </Button>
                        <Button
                            onClick={handleDelete}
                            disabled={actionLoading === selectedUser?.id}
                            className="bg-red-600 hover:bg-red-700 text-white"
                        >
                            {actionLoading === selectedUser?.id ? (
                                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                            ) : (
                                <Trash2 className="h-4 w-4 mr-2" />
                            )}
                            Kalıcı Olarak Sil
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}
