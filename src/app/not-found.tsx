import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { FileQuestion, Home, Search } from 'lucide-react'
import Link from 'next/link'

export default function NotFound() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
            <Card className="max-w-md w-full bg-slate-800/50 border-slate-700/50">
                <CardHeader className="text-center">
                    <div className="mx-auto w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center mb-4">
                        <FileQuestion className="w-8 h-8 text-blue-400" />
                    </div>
                    <CardTitle className="text-white text-xl">Sayfa Bulunamadı</CardTitle>
                    <CardDescription className="text-slate-400">
                        Aradığınız sayfa mevcut değil veya taşınmış olabilir.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <p className="text-6xl font-bold text-center text-slate-600">404</p>
                    <div className="grid grid-cols-2 gap-3">
                        <Link href="/">
                            <Button className="w-full bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700">
                                <Home className="mr-2 h-4 w-4" />
                                Ana Sayfa
                            </Button>
                        </Link>
                        <Link href="/search">
                            <Button
                                variant="outline"
                                className="w-full border-slate-600 text-slate-300 hover:bg-slate-700"
                            >
                                <Search className="mr-2 h-4 w-4" />
                                Stok Ara
                            </Button>
                        </Link>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
