'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
    Users,
    Check,
    X,
    Clock,
    Shield,
    ShieldCheck,
    Search,
    Loader2,
    RefreshCw
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
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog'
import { Textarea } from '@/components/ui/textarea'

interface UserProfile {
    id: string
    email: string
    full_name: string | null
    is_approved: boolean
    status: 'pending' | 'approved' | 'rejected'
    role: 'user' | 'admin'
    rejected_reason: string | null
    created_at: string
    approved_at: string | null
}

export default function AdminUsersPage() {
    const router = useRouter()
    const supabase = createClient()
    const [users, setUsers] = useState<UserProfile[]>([])
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState('')
    const [statusFilter, setStatusFilter] = useState<string>('all')
    const [rejectDialogOpen, setRejectDialogOpen] = useState(false)
    const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null)
    const [rejectReason, setRejectReason] = useState('')
    const [actionLoading, setActionLoading] = useState<string | null>(null)

    const fetchUsers = async () => {
        setLoading(true)
        const { data, error } = await supabase
            .from('user_profiles')
            .select('*')
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

    const handleApprove = async (user: UserProfile) => {
        setActionLoading(user.id)
        const { data: { user: currentUser } } = await supabase.auth.getUser()

        const { error } = await supabase
            .from('user_profiles')
            .update({
                is_approved: true,
                status: 'approved',
                approved_by: currentUser?.id,
                approved_at: new Date().toISOString()
            })
            .eq('id', user.id)

        if (error) {
            toast.error('Onaylama başarısız', { description: error.message })
        } else {
            toast.success('Kullanıcı onaylandı', { description: user.email })
            fetchUsers()
        }
        setActionLoading(null)
    }

    const handleReject = async () => {
        if (!selectedUser) return
        setActionLoading(selectedUser.id)

        const { error } = await supabase
            .from('user_profiles')
            .update({
                is_approved: false,
                status: 'rejected',
                rejected_reason: rejectReason || null
            })
            .eq('id', selectedUser.id)

        if (error) {
            toast.error('Reddetme başarısız', { description: error.message })
        } else {
            toast.success('Kullanıcı reddedildi', { description: selectedUser.email })
            fetchUsers()
        }
        setRejectDialogOpen(false)
        setSelectedUser(null)
        setRejectReason('')
        setActionLoading(null)
    }

    const handleRoleChange = async (user: UserProfile, newRole: 'user' | 'admin') => {
        setActionLoading(user.id)

        const { error } = await supabase
            .from('user_profiles')
            .update({ role: newRole })
            .eq('id', user.id)

        if (error) {
            toast.error('Rol değiştirme başarısız', { description: error.message })
        } else {
            toast.success('Rol güncellendi', { description: `${user.email} artık ${newRole === 'admin' ? 'Admin' : 'Kullanıcı'}` })
            fetchUsers()
        }
        setActionLoading(null)
    }

    const filteredUsers = users.filter(user => {
        const matchesSearch = user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (user.full_name?.toLowerCase().includes(searchTerm.toLowerCase()))
        const matchesStatus = statusFilter === 'all' || user.status === statusFilter
        return matchesSearch && matchesStatus
    })

    const statusBadge = (status: string) => {
        switch (status) {
            case 'approved':
                return <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30">Onaylı</Badge>
            case 'rejected':
                return <Badge className="bg-red-500/20 text-red-400 border-red-500/30">Reddedildi</Badge>
            default:
                return <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/30">Bekliyor</Badge>
        }
    }

    const roleBadge = (role: string) => {
        if (role === 'admin') {
            return <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30"><ShieldCheck className="w-3 h-3 mr-1" />Admin</Badge>
        }
        return <Badge variant="outline" className="text-slate-400 border-slate-600"><Shield className="w-3 h-3 mr-1" />Kullanıcı</Badge>
    }

    const pendingCount = users.filter(u => u.status === 'pending').length

    return (
        <div className="p-6 space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                        <Users className="h-6 w-6 text-purple-400" />
                        Kullanıcı Yönetimi
                    </h1>
                    <p className="text-slate-400 text-sm">
                        Kullanıcı hesaplarını yönetin ve onaylayın
                    </p>
                </div>
                {pendingCount > 0 && (
                    <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/30 text-lg px-4 py-2">
                        <Clock className="w-4 h-4 mr-2" />
                        {pendingCount} Bekleyen Onay
                    </Badge>
                )}
            </div>

            {/* Filters */}
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
                        <Select value={statusFilter} onValueChange={setStatusFilter}>
                            <SelectTrigger className="w-full md:w-48 bg-slate-700/50 border-slate-600 text-white">
                                <SelectValue placeholder="Durum Filtresi" />
                            </SelectTrigger>
                            <SelectContent className="bg-slate-800 border-slate-700">
                                <SelectItem value="all">Tümü</SelectItem>
                                <SelectItem value="pending">Bekleyen</SelectItem>
                                <SelectItem value="approved">Onaylı</SelectItem>
                                <SelectItem value="rejected">Reddedilen</SelectItem>
                            </SelectContent>
                        </Select>
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
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow className="border-slate-700 hover:bg-transparent">
                                        <TableHead className="text-slate-400">E-posta</TableHead>
                                        <TableHead className="text-slate-400">İsim</TableHead>
                                        <TableHead className="text-slate-400">Durum</TableHead>
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
                                            <TableCell>{statusBadge(user.status)}</TableCell>
                                            <TableCell>{roleBadge(user.role)}</TableCell>
                                            <TableCell className="text-slate-400 text-sm">
                                                {new Date(user.created_at).toLocaleDateString('tr-TR')}
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    {user.status === 'pending' && (
                                                        <>
                                                            <Button
                                                                size="sm"
                                                                onClick={() => handleApprove(user)}
                                                                disabled={actionLoading === user.id}
                                                                className="bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 border border-emerald-500/30"
                                                            >
                                                                {actionLoading === user.id ? (
                                                                    <Loader2 className="h-4 w-4 animate-spin" />
                                                                ) : (
                                                                    <Check className="h-4 w-4 mr-1" />
                                                                )}
                                                                Onayla
                                                            </Button>
                                                            <Button
                                                                size="sm"
                                                                variant="outline"
                                                                onClick={() => {
                                                                    setSelectedUser(user)
                                                                    setRejectDialogOpen(true)
                                                                }}
                                                                className="bg-red-500/10 text-red-400 hover:bg-red-500/20 border-red-500/30"
                                                            >
                                                                <X className="h-4 w-4 mr-1" />
                                                                Reddet
                                                            </Button>
                                                        </>
                                                    )}
                                                    {user.status === 'approved' && (
                                                        <Select
                                                            value={user.role}
                                                            onValueChange={(value) => handleRoleChange(user, value as 'user' | 'admin')}
                                                        >
                                                            <SelectTrigger className="w-32 h-8 text-xs bg-slate-700/50 border-slate-600">
                                                                <SelectValue />
                                                            </SelectTrigger>
                                                            <SelectContent className="bg-slate-800 border-slate-700">
                                                                <SelectItem value="user">Kullanıcı</SelectItem>
                                                                <SelectItem value="admin">Admin</SelectItem>
                                                            </SelectContent>
                                                        </Select>
                                                    )}
                                                    {user.status === 'rejected' && (
                                                        <Button
                                                            size="sm"
                                                            onClick={() => handleApprove(user)}
                                                            disabled={actionLoading === user.id}
                                                            className="bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 border border-emerald-500/30"
                                                        >
                                                            {actionLoading === user.id ? (
                                                                <Loader2 className="h-4 w-4 animate-spin" />
                                                            ) : (
                                                                <Check className="h-4 w-4 mr-1" />
                                                            )}
                                                            Onayla
                                                        </Button>
                                                    )}
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                    {filteredUsers.length === 0 && (
                                        <TableRow>
                                            <TableCell colSpan={6} className="text-center py-12 text-slate-400">
                                                Kullanıcı bulunamadı
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Reject Dialog */}
            <Dialog open={rejectDialogOpen} onOpenChange={setRejectDialogOpen}>
                <DialogContent className="bg-slate-800 border-slate-700 text-white">
                    <DialogHeader>
                        <DialogTitle>Kullanıcıyı Reddet</DialogTitle>
                        <DialogDescription className="text-slate-400">
                            {selectedUser?.email} kullanıcısını reddetmek istediğinize emin misiniz?
                        </DialogDescription>
                    </DialogHeader>
                    <div className="py-4">
                        <Textarea
                            placeholder="Red sebebi (isteğe bağlı)"
                            value={rejectReason}
                            onChange={(e) => setRejectReason(e.target.value)}
                            className="bg-slate-700/50 border-slate-600 text-white"
                        />
                    </div>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setRejectDialogOpen(false)}
                            className="border-slate-600 text-slate-300"
                        >
                            İptal
                        </Button>
                        <Button
                            onClick={handleReject}
                            disabled={actionLoading === selectedUser?.id}
                            className="bg-red-500 hover:bg-red-600 text-white"
                        >
                            {actionLoading === selectedUser?.id ? (
                                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                            ) : null}
                            Reddet
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}
