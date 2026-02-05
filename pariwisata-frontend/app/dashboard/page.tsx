'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { MapPin, Users, Star, Calendar, ArrowUp, ArrowDown } from 'lucide-react'
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
const stats = [
    {
        label: 'Total Destinasi',
        value: '127 Lokasi',
        change: '+12 bulan ini',
        increase: true,
        icon: MapPin,
        color: 'from-blue-500 to-blue-600',
        iconBg: 'bg-blue-50 text-blue-600'
    },
    {
        label: 'Total Kunjungan',
        value: '45.2K',
        change: '+18% vs last month',
        increase: true,
        icon: Users,
        color: 'from-green-500 to-emerald-600',
        iconBg: 'bg-green-50 text-green-600'
    },
    {
        label: 'Rating Rata-rata',
        value: '4.8/5.0',
        change: '+0.3 improvement',
        increase: true,
        icon: Star,
        color: 'from-amber-500 to-orange-600',
        iconBg: 'bg-amber-50 text-amber-600'
    },
    {
        label: 'Event Aktif',
        value: '8 Event',
        change: '3 upcoming',
        increase: true,
        icon: Calendar,
        color: 'from-purple-500 to-violet-600',
        iconBg: 'bg-purple-50 text-purple-600'
    }
]

const visitorData = [
    { name: 'Jan', value: 4000 },
    { name: 'Feb', value: 3000 },
    { name: 'Mar', value: 2000 },
    { name: 'Apr', value: 2780 },
    { name: 'May', value: 1890 },
    { name: 'Jun', value: 2390 },
    { name: 'Jul', value: 3490 },
]

const topDestinations = [
    { name: 'Pantai Kartini', uv: 4000 },
    { name: 'Pulau Panjang', uv: 3000 },
    { name: 'Benteng Portugis', uv: 2000 },
    { name: 'Museum Kartini', uv: 2780 },
]

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

export default function DashboardPage() {
    const [selectedActivity, setSelectedActivity] = useState<typeof recentActivities[0] | null>(null)

    return (
        <div className="space-y-8">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-slate-900">Dashboard Overview</h1>
                <p className="text-slate-500 mt-2">Selamat datang kembali, berikut ringkasan statistik pariwisata Jepara.</p>
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
                        className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-md transition-all border border-slate-100"
                    >
                        <div className="flex justify-between items-start mb-4">
                            <div className={cn("p-3 rounded-xl", stat.iconBg)}>
                                <stat.icon size={24} />
                            </div>
                            <div className={cn(
                                "flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full",
                                "text-green-600 bg-green-50"
                            )}>
                                {stat.increase ? <ArrowUp size={12} /> : <ArrowDown size={12} />}
                                {stat.change}
                            </div>
                        </div>
                        <div>
                            <h3 className="text-3xl font-bold text-slate-900">{stat.value}</h3>
                            <p className="text-sm text-slate-500 font-medium mt-1">{stat.label}</p>
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
                    className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100"
                >
                    <h3 className="text-lg font-bold text-slate-900 mb-6">Tren Pengunjung</h3>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={visitorData}>
                                <defs>
                                    <linearGradient id="colorVisits" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1} />
                                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="#f1f5f9" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} dy={10} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                                <Tooltip
                                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                                    cursor={{ stroke: '#cbd5e1', strokeWidth: 1, strokeDasharray: '4 4' }}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="value"
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
                    className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100"
                >
                    <h3 className="text-lg font-bold text-slate-900 mb-6">Destinasi Terpopuler</h3>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart layout="vertical" data={topDestinations}>
                                <CartesianGrid horizontal={false} strokeDasharray="3 3" stroke="#f1f5f9" />
                                <XAxis type="number" hide />
                                <YAxis dataKey="name" type="category" width={120} axisLine={false} tickLine={false} tick={{ fill: '#0f172a', fontWeight: 500, fontSize: 13 }} />
                                <Tooltip
                                    cursor={{ fill: '#f8fafc' }}
                                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                                />
                                <Bar dataKey="uv" fill="#10b981" radius={[0, 6, 6, 0]} barSize={24} />
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
                className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden"
            >
                <div className="p-6 border-b border-slate-100">
                    <h3 className="text-lg font-bold text-slate-900">Aktivitas Terkini</h3>
                </div>
                <div className="divide-y divide-slate-50">
                    {recentActivities.map((activity) => (
                        <div key={activity.id} className="p-4 hover:bg-slate-50 transition-colors flex items-center gap-4">
                            <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-600">
                                <activity.icon size={18} />
                            </div>
                            <div className="flex-1">
                                <p className="text-sm font-medium text-slate-900">
                                    <span className="font-bold">{activity.user}</span> {activity.action} <span className="text-blue-600">{activity.target}</span>
                                </p>
                                <p className="text-xs text-slate-500 mt-0.5">{activity.time}</p>
                            </div>
                            <button
                                onClick={() => setSelectedActivity(activity)}
                                className="text-xs font-medium text-slate-400 hover:text-slate-900"
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
