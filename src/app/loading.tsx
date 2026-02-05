import { Loader2, Warehouse } from 'lucide-react'

export default function Loading() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
            <div className="text-center">
                <div className="relative">
                    <div className="w-16 h-16 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-emerald-500/20">
                        <Warehouse className="w-8 h-8 text-white" />
                    </div>
                    <Loader2 className="w-6 h-6 animate-spin text-emerald-500 absolute -bottom-1 -right-1 bg-slate-900 rounded-full" />
                </div>
                <p className="text-slate-400 mt-4">Yükleniyor...</p>
            </div>
        </div>
    )
}
