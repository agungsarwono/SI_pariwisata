'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { MapPin, Users, Star, Calendar, ArrowUp, ArrowDown, FileText } from 'lucide-react'
import { Modal } from '@/components/ui/modal'
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    BarChart,
    Bar
} from 'recharts'
import { cn } from '@/lib/utils'

// Data
const recentActivities = [
    { id: 1, user: 'Budi Santoso', action: 'Menambahkan destinasi baru', target: 'Pantai Bandengan', time: '2 mins ago', icon: MapPin },
    { id: 2, user: 'Siti Aminah', action: 'Mengupdate jadwal event', target: 'Pesta Lomban', time: '1 hour ago', icon: Calendar },
    { id: 3, user: 'Admin User', action: 'Memverifikasi ulasan', target: 'Karimunjawa', time: '3 hours ago', icon: Star },
    { id: 4, user: 'System', action: 'Backup database otomatis', target: 'Weekly Backup', time: '1 day ago', icon: Settings }, // Settings undefined, using map helper below
]

// Animation Variants
const container = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1
        }
    }
}

const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
}

import { Settings } from 'lucide-react'

import { useTheme } from 'next-themes'

const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-xl border border-slate-100 dark:border-slate-700">
                <p className="text-sm font-bold text-slate-900 dark:text-white mb-1">{label}</p>
                <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-blue-500" />
                    <p className="text-sm font-medium text-slate-600 dark:text-slate-300">
                        {payload[0].value.toLocaleString()}
                        <span className="text-slate-400 dark:text-slate-500 text-xs ml-1">
                            {payload[0].name === 'uv' ? 'Kunjungan' : 'Pengunjung'}
                        </span>
                    </p>
                </div>
            </div>
        )
    }
    return null
}

export default function DashboardPage() {
    const [dashboardData, setDashboardData] = useState<any>(null)
    const [isLoading, setIsLoading] = useState(true)

    React.useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const res = await fetch('http://localhost:4000/dashboard/metrics')
                if (res.ok) {
                    const data = await res.json()
                    setDashboardData(data)
                }
            } catch (error) {
                console.error("Failed to fetch dashboard metrics", error)
            } finally {
                setIsLoading(false)
            }
        }

        fetchDashboardData()
    }, [])

    const stats = [
        {
            label: 'Total Destinasi',
            value: (dashboardData?.stats.destinations || 0) + ' Lokasi',
            change: '+2 bulan ini',
            increase: true,
            icon: MapPin,
            color: 'from-blue-500 to-blue-600',
            iconBg: 'bg-blue-50 text-blue-600'
        },
        {
            label: 'Total Kunjungan',
            value: (dashboardData?.stats.visits.toLocaleString() || '...'),
            change: '+18% vs last month',
            increase: true,
            icon: Users,
            color: 'from-green-500 to-emerald-600',
            iconBg: 'bg-green-50 text-green-600'
        },
        {
            label: 'Laporan Masuk',
            value: (dashboardData?.stats.reports || 0) + ' Laporan',
            change: '+5 perlu tindakan',
            increase: false,
            icon: FileText,
            color: 'from-orange-500 to-red-600',
            iconBg: 'bg-orange-50 text-orange-600'
        },
        {
            label: 'Event Aktif',
            value: (dashboardData?.stats.events || 0) + ' Event',
            change: '3 upcoming',
            increase: true,
            icon: Calendar,
            color: 'from-purple-500 to-violet-600',
            iconBg: 'bg-purple-50 text-purple-600'
        }
    ]

    const visitorData = dashboardData?.visitorData || []
    const topDestinations = dashboardData?.topDestinations || []

    const [selectedActivity, setSelectedActivity] = useState<typeof recentActivities[0] | null>(null)
    const { theme } = useTheme()
    const isDark = theme === 'dark'

    // Chart Colors
    const gridColor = isDark ? '#1e293b' : '#f1f5f9' // slate-800 : slate-100
    const axisColor = isDark ? '#94a3b8' : '#64748b' // slate-400 : slate-500
    const cursorColor = isDark ? '#334155' : '#cbd5e1' // slate-700 : slate-300
    const barCursorFill = isDark ? '#1e293b' : '#f8fafc' // slate-800 : slate-50

    return (
        <div className="space-y-8">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Dashboard Overview</h1>
                <p className="text-slate-500 dark:text-slate-400 mt-2">Selamat datang kembali, berikut ringkasan statistik pariwisata Jepara.</p>
            </div>

            {/* Stats Cards */}
            <motion.div
                variants={container}
                initial="hidden"
                animate="show"
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
            >
                {stats.map((stat, i) => (
                    <motion.div
                        key={i}
                        variants={item}
                        whileHover={{ y: -4 }}
                        className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm hover:shadow-md transition-all border border-slate-100 dark:border-slate-800"
                    >
                        <div className="flex justify-between items-start mb-4">
                            <div className={cn("p-3 rounded-xl", stat.iconBg, "dark:bg-opacity-20")}>
                                <stat.icon size={24} />
                            </div>
                            <div className={cn(
                                "flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full",
                                "text-green-600 bg-green-50 dark:bg-green-900/30 dark:text-green-400"
                            )}>
                                {stat.increase ? <ArrowUp size={12} /> : <ArrowDown size={12} />}
                                {stat.change}
                            </div>
                        </div>
                        <div>
                            <h3 className="text-3xl font-bold text-slate-900 dark:text-white">{stat.value}</h3>
                            <p className="text-sm text-slate-500 dark:text-slate-400 font-medium mt-1">{stat.label}</p>
                        </div>
                    </motion.div>
                ))}
            </motion.div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Visitor Trend */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800"
                >
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6">Tren Pengunjung</h3>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={visitorData}>
                                <defs>
                                    <linearGradient id="colorVisits" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1} />
                                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid vertical={false} strokeDasharray="3 3" stroke={gridColor} />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: axisColor, fontSize: 12 }} dy={10} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: axisColor, fontSize: 12 }} />
                                <Tooltip
                                    content={<CustomTooltip />}
                                    cursor={{ stroke: cursorColor, strokeWidth: 1, strokeDasharray: '4 4' }}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="value"
                                    name="visitors"
                                    stroke="#3b82f6"
                                    strokeWidth={3}
                                    fillOpacity={1}
                                    fill="url(#colorVisits)"
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </motion.div>

                {/* Top Destinations */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                    className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800"
                >
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6">Destinasi Terpopuler</h3>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart layout="vertical" data={topDestinations}>
                                <CartesianGrid horizontal={false} strokeDasharray="3 3" stroke={gridColor} />
                                <XAxis type="number" hide />
                                <YAxis dataKey="name" type="category" width={120} axisLine={false} tickLine={false} tick={{ fill: axisColor, fontWeight: 500, fontSize: 13 }} />
                                <Tooltip
                                    cursor={{ fill: barCursorFill, radius: 4 }}
                                    content={<CustomTooltip />}
                                />
                                <Bar dataKey="uv" name="uv" fill="#10b981" radius={[0, 6, 6, 0]} barSize={24} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </motion.div>
            </div>

            {/* Recent Activities */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 overflow-hidden"
            >
                <div className="p-6 border-b border-slate-100 dark:border-slate-800">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">Aktivitas Terkini</h3>
                </div>
                <div className="divide-y divide-slate-50 dark:divide-slate-800">
                    {recentActivities.map((activity) => (
                        <div key={activity.id} className="p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors flex items-center gap-4">
                            <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-400">
                                <activity.icon size={18} />
                            </div>
                            <div className="flex-1">
                                <p className="text-sm font-medium text-slate-900 dark:text-slate-200">
                                    <span className="font-bold">{activity.user}</span> {activity.action} <span className="text-blue-600 dark:text-blue-400">{activity.target}</span>
                                </p>
                                <p className="text-xs text-slate-500 dark:text-slate-500 mt-0.5">{activity.time}</p>
                            </div>
                            <button
                                onClick={() => setSelectedActivity(activity)}
                                className="text-xs font-medium text-slate-400 dark:text-slate-500 hover:text-slate-900 dark:hover:text-slate-300"
                            >
                                Details
                            </button>
                        </div>
                    ))}
                </div>
            </motion.div>

            {/* Details Modal */}
            <Modal
                isOpen={!!selectedActivity}
                onClose={() => setSelectedActivity(null)}
                title="Detail Aktivitas"
            >
                {selectedActivity && (
                    <div className="space-y-4">
                        <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl">
                            <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                                <selectedActivity.icon size={24} />
                            </div>
                            <div>
                                <h4 className="font-bold text-slate-900">{selectedActivity.user}</h4>
                                <p className="text-sm text-slate-500">{selectedActivity.time}</p>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <div>
                                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Activity</label>
                                <p className="text-slate-900">{selectedActivity.action}</p>
                            </div>
                            <div>
                                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Target</label>
                                <p className="font-medium text-blue-600">{selectedActivity.target}</p>
                            </div>
                            <div>
                                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</label>
                                <div className="mt-1 inline-flex items-center px-2 py-1 rounded-full bg-green-100 text-green-700 text-xs font-medium">
                                    Success
                                </div>
                            </div>
                        </div>

                        <div className="pt-4 flex justify-end">
                            <button
                                onClick={() => setSelectedActivity(null)}
                                className="px-4 py-2 bg-slate-900 text-white rounded-lg text-sm font-medium hover:bg-slate-800 transition-colors"
                            >
                                Tutup
                            </button>
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    )
}
