'use client'

import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts'

interface StockChartProps {
    textileCount: number
    shoesCount: number
    totalStock: number
    locationsFilled: number
    totalLocations: number
}

const COLORS = {
    textile: '#10b981',  // emerald
    shoes: '#3b82f6',    // blue
    filled: '#8b5cf6',   // purple
    empty: '#334155'     // slate
}

export function StockPieChart({ textileCount, shoesCount }: { textileCount: number, shoesCount: number }) {
    const data = [
        { name: 'Tekstil', value: textileCount, color: COLORS.textile },
        { name: 'Ayakkabı', value: shoesCount, color: COLORS.shoes }
    ]

    if (textileCount === 0 && shoesCount === 0) {
        return (
            <div className="h-[200px] flex items-center justify-center text-slate-500 text-sm">
                Henüz ürün yok
            </div>
        )
    }

    return (
        <div className="h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                    <Pie
                        data={data}
                        cx="50%"
                        cy="50%"
                        innerRadius={50}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                        label={({ name, value }) => `${name}: ${value}`}
                        labelLine={false}
                    >
                        {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                    </Pie>
                    <Tooltip
                        contentStyle={{
                            backgroundColor: '#1e293b',
                            border: '1px solid #334155',
                            borderRadius: '8px',
                            color: '#fff'
                        }}
                    />
                </PieChart>
            </ResponsiveContainer>
        </div>
    )
}

export function LocationChart({ filled, total }: { filled: number, total: number }) {
    const empty = total - filled
    const data = [
        { name: 'Dolu', value: filled, color: COLORS.filled },
        { name: 'Boş', value: empty, color: COLORS.empty }
    ]

    const percentage = total > 0 ? Math.round((filled / total) * 100) : 0

    return (
        <div className="h-[200px] relative">
            <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                    <Pie
                        data={data}
                        cx="50%"
                        cy="50%"
                        innerRadius={50}
                        outerRadius={80}
                        paddingAngle={2}
                        dataKey="value"
                    >
                        {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                    </Pie>
                    <Tooltip
                        contentStyle={{
                            backgroundColor: '#1e293b',
                            border: '1px solid #334155',
                            borderRadius: '8px',
                            color: '#fff'
                        }}
                    />
                </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                    <span className="text-2xl font-bold text-white">{percentage}%</span>
                    <p className="text-xs text-slate-400">Doluluk</p>
                </div>
            </div>
        </div>
    )
}

interface CategoryData {
    name: string
    count: number
}

export function CategoryBarChart({ data }: { data: CategoryData[] }) {
    if (data.length === 0 || data.every(d => d.count === 0)) {
        return (
            <div className="h-[200px] flex items-center justify-center text-slate-500 text-sm">
                Veri yok
            </div>
        )
    }

    return (
        <div className="h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data} layout="vertical">
                    <XAxis type="number" hide />
                    <YAxis
                        dataKey="name"
                        type="category"
                        width={80}
                        tick={{ fill: '#94a3b8', fontSize: 12 }}
                        axisLine={false}
                        tickLine={false}
                    />
                    <Tooltip
                        contentStyle={{
                            backgroundColor: '#1e293b',
                            border: '1px solid #334155',
                            borderRadius: '8px',
                            color: '#fff'
                        }}
                        formatter={(value) => [`${value ?? 0} ürün`, 'Sayı']}
                    />
                    <Bar
                        dataKey="count"
                        fill="#10b981"
                        radius={[0, 4, 4, 0]}
                        barSize={20}
                    />
                </BarChart>
            </ResponsiveContainer>
        </div>
    )
}
