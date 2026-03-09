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
    Trash2,
    Shield,
    ShieldOff,
    Eye
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
import { useUserRole } from '@/lib/hooks/useUserRole'

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
    const { userId: currentUserId } = useUserRole()
    const [users, setUsers] = useState<UserProfile[]>([])
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState('')
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
    const [roleDialogOpen, setRoleDialogOpen] = useState(false)
    const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null)
    const [pendingRole, setPendingRole] = useState<'admin' | 'user'>('user')
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

    const handleRoleChange = async () => {
        if (!selectedUser) return
        setActionLoading(selectedUser.id)

        try {
            const response = await fetch('/api/admin/update-role', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId: selectedUser.id, role: pendingRole }),
            })

            const result = await response.json()

            if (!response.ok) {
                toast.error('Rol değiştirme başarısız', { description: result.error })
            } else {
                toast.success('Rol güncellendi', {
                    description: `${selectedUser.email} → ${pendingRole === 'admin' ? 'Admin' : 'Gözlemci'}`,
                })
                fetchUsers()
            }
        } catch (error) {
            toast.error('Bir hata oluştu', { description: 'Lütfen tekrar deneyin.' })
        }

        setRoleDialogOpen(false)
        setSelectedUser(null)
        setActionLoading(null)
    }

    const openRoleDialog = (user: UserProfile) => {
        setSelectedUser(user)
        setPendingRole(user.role === 'admin' ? 'user' : 'admin')
        setRoleDialogOpen(true)
    }

    const filteredUsers = users.filter(user => {
        return user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (user.full_name?.toLowerCase().includes(searchTerm.toLowerCase()))
    })

    const getRoleBadge = (role: string, isSelf: boolean) => {
        if (role === 'admin') {
            return (
                <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30">
                    <Shield className="w-3 h-3 mr-1" />
                    Admin
                    {isSelf && <span className="ml-1 text-[10px]">(Siz)</span>}
                </Badge>
            )
        }
        return (
            <Badge className="bg-slate-500/20 text-slate-400 border-slate-500/30">
                <Eye className="w-3 h-3 mr-1" />
                Gözlemci
            </Badge>
        )
    }

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
                        Kullanıcı rollerini yönetin ve hesapları kontrol edin
                    </p>
                </div>
                <div className="flex gap-2">
                    <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30 text-sm px-3 py-1.5">
                        {users.filter(u => u.role === 'admin').length} Admin
                    </Badge>
                    <Badge className="bg-slate-500/20 text-slate-400 border-slate-500/30 text-sm px-3 py-1.5">
                        {users.filter(u => u.role === 'user').length} Gözlemci
                    </Badge>
                </div>
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
                                {filteredUsers.map((user) => {
                                    const isSelf = user.id === currentUserId
                                    return (
                                        <div
                                            key={user.id}
                                            className="p-4 bg-slate-700/30 rounded-lg space-y-3"
                                        >
                                            <div className="flex items-start justify-between gap-2">
                                                <div className="min-w-0 flex-1">
                                                    <p className="text-white font-medium text-sm truncate">{user.email}</p>
                                                    <p className="text-slate-400 text-xs mt-0.5">{user.full_name || '-'}</p>
                                                </div>
                                                {getRoleBadge(user.role, isSelf)}
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <span className="text-slate-500 text-xs">
                                                    {new Date(user.created_at).toLocaleDateString('tr-TR')}
                                                </span>
                                                <div className="flex gap-1">
                                                    {!isSelf && (
                                                        <Button
                                                            size="sm"
                                                            variant="outline"
                                                            onClick={() => openRoleDialog(user)}
                                                            disabled={actionLoading === user.id}
                                                            className={user.role === 'admin'
                                                                ? 'bg-slate-500/10 text-slate-400 hover:bg-slate-500/20 border-slate-500/30'
                                                                : 'bg-purple-500/10 text-purple-400 hover:bg-purple-500/20 border-purple-500/30'
                                                            }
                                                        >
                                                            {user.role === 'admin' ? (
                                                                <><ShieldOff className="h-4 w-4 mr-1" /> Gözlemci Yap</>
                                                            ) : (
                                                                <><Shield className="h-4 w-4 mr-1" /> Admin Yap</>
                                                            )}
                                                        </Button>
                                                    )}
                                                    {!isSelf && (
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
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    )
                                })}
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
                                        {filteredUsers.map((user) => {
                                            const isSelf = user.id === currentUserId
                                            return (
                                                <TableRow key={user.id} className="border-slate-700 hover:bg-slate-700/30">
                                                    <TableCell className="text-white font-medium">{user.email}</TableCell>
                                                    <TableCell className="text-slate-300">{user.full_name || '-'}</TableCell>
                                                    <TableCell>
                                                        {getRoleBadge(user.role, isSelf)}
                                                    </TableCell>
                                                    <TableCell className="text-slate-400 text-sm">
                                                        {new Date(user.created_at).toLocaleDateString('tr-TR')}
                                                    </TableCell>
                                                    <TableCell className="text-right">
                                                        {!isSelf && (
                                                            <div className="flex items-center gap-2 justify-end">
                                                                <Button
                                                                    size="sm"
                                                                    variant="outline"
                                                                    onClick={() => openRoleDialog(user)}
                                                                    disabled={actionLoading === user.id}
                                                                    className={user.role === 'admin'
                                                                        ? 'bg-slate-500/10 text-slate-400 hover:bg-slate-500/20 border-slate-500/30'
                                                                        : 'bg-purple-500/10 text-purple-400 hover:bg-purple-500/20 border-purple-500/30'
                                                                    }
                                                                >
                                                                    {user.role === 'admin' ? (
                                                                        <><ShieldOff className="h-4 w-4 mr-1" /> Gözlemci Yap</>
                                                                    ) : (
                                                                        <><Shield className="h-4 w-4 mr-1" /> Admin Yap</>
                                                                    )}
                                                                </Button>
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
                                                            </div>
                                                        )}
                                                        {isSelf && (
                                                            <span className="text-xs text-slate-500">Kendi hesabınız</span>
                                                        )}
                                                    </TableCell>
                                                </TableRow>
                                            )
                                        })}
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

            {/* Role Change Dialog */}
            <Dialog open={roleDialogOpen} onOpenChange={setRoleDialogOpen}>
                <DialogContent className="bg-slate-800 border-slate-700 text-white">
                    <DialogHeader>
                        <DialogTitle className="text-purple-400 flex items-center gap-2">
                            <Shield className="w-5 h-5" />
                            Rol Değiştir
                        </DialogTitle>
                        <DialogDescription className="text-slate-400">
                            <span className="font-semibold text-white">{selectedUser?.email}</span> kullanıcısının rolünü değiştirmek istediğinize emin misiniz?
                        </DialogDescription>
                    </DialogHeader>
                    <div className="py-2">
                        <div className="bg-purple-500/10 border border-purple-500/20 rounded-lg p-4 space-y-2">
                            <div className="flex items-center gap-2 text-sm">
                                <span className="text-slate-400">Mevcut Rol:</span>
                                {selectedUser?.role === 'admin' ? (
                                    <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30">
                                        <Shield className="w-3 h-3 mr-1" /> Admin
                                    </Badge>
                                ) : (
                                    <Badge className="bg-slate-500/20 text-slate-400 border-slate-500/30">
                                        <Eye className="w-3 h-3 mr-1" /> Gözlemci
                                    </Badge>
                                )}
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                                <span className="text-slate-400">Yeni Rol:</span>
                                {pendingRole === 'admin' ? (
                                    <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30">
                                        <Shield className="w-3 h-3 mr-1" /> Admin
                                    </Badge>
                                ) : (
                                    <Badge className="bg-slate-500/20 text-slate-400 border-slate-500/30">
                                        <Eye className="w-3 h-3 mr-1" /> Gözlemci
                                    </Badge>
                                )}
                            </div>
                        </div>
                        {pendingRole === 'admin' && (
                            <p className="text-xs text-amber-400 mt-2">
                                ⚠️ Admin kullanıcılar stok giriş/çıkış yapabilir, kullanıcıları yönetebilir ve tüm sistem ayarlarına erişebilir.
                            </p>
                        )}
                        {pendingRole === 'user' && (
                            <p className="text-xs text-slate-400 mt-2">
                                ℹ️ Gözlemci kullanıcılar sadece stok bilgilerini görüntüleyebilir, hiçbir değişiklik yapamaz.
                            </p>
                        )}
                    </div>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => {
                                setRoleDialogOpen(false)
                                setSelectedUser(null)
                            }}
                            className="border-slate-600 text-slate-300"
                        >
                            İptal
                        </Button>
                        <Button
                            onClick={handleRoleChange}
                            disabled={actionLoading === selectedUser?.id}
                            className="bg-purple-600 hover:bg-purple-700 text-white"
                        >
                            {actionLoading === selectedUser?.id ? (
                                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                            ) : (
                                <Shield className="h-4 w-4 mr-2" />
                            )}
                            Rolü Değiştir
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}
