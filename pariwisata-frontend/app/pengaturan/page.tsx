'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import {
    User,
    Bell,
    Shield,
    Globe,
    Moon,
    LogOut,
    Camera,
    Save,
    Mail,
    Smartphone,
    Check
} from 'lucide-react'
import { cn } from '@/lib/utils'

export default function PengaturanPage() {
    const [activeTab, setActiveTab] = useState('profile')
    const [loading, setLoading] = useState(false)

    const handleSave = () => {
        setLoading(true)
        setTimeout(() => setLoading(false), 1500)
    }

    const tabs = [
        { id: 'profile', label: 'Profil Akun', icon: User },
        { id: 'notifications', label: 'Notifikasi', icon: Bell },
        { id: 'security', label: 'Keamanan', icon: Shield },
        { id: 'system', label: 'Sistem', icon: Globe },
    ]

    return (
        <div className="max-w-5xl mx-auto space-y-8">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-slate-900">Pengaturan</h1>
                <p className="text-slate-500 mt-1">Kelola preferensi akun dan konfigurasi sistem.</p>
            </div>

            <div className="flex flex-col lg:flex-row gap-8">
                {/* Sidebar Tabs */}
                <div className="w-full lg:w-64 flex-shrink-0 space-y-1">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={cn(
                                "w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-sm font-medium",
                                activeTab === tab.id
                                    ? "bg-blue-50 text-blue-700 shadow-sm ring-1 ring-blue-200"
                                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                            )}
                        >
                            <tab.icon size={18} />
                            {tab.label}
                        </button>
                    ))}

                    <div className="pt-4 mt-4 border-t border-slate-200">
                        <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-600 hover:bg-red-50 transition-colors text-sm font-medium">
                            <LogOut size={18} />
                            Keluar
                        </button>
                    </div>
                </div>

                {/* Content Area */}
                <div className="flex-1">
                    <motion.div
                        key={activeTab}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                        className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden"
                    >
                        {activeTab === 'profile' && (
                            <div className="p-6 md:p-8 space-y-8">
                                <div className="flex items-center gap-6 pb-8 border-b border-slate-100">
                                    <div className="relative group cursor-pointer">
                                        <div className="w-24 h-24 rounded-full bg-slate-100 flex items-center justify-center text-3xl font-bold text-slate-400 overflow-hidden ring-4 ring-white shadow-lg">
                                            <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Admin" alt="Avatar" className="w-full h-full" />
                                        </div>
                                        <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                            <Camera className="text-white" size={24} />
                                        </div>
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-slate-900">Admin Utama</h3>
                                        <p className="text-slate-500">Super Administrator</p>
                                        <button className="mt-2 text-sm text-blue-600 font-medium hover:underline">
                                            Ubah Foto Profil
                                        </button>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-slate-700">Nama Lengkap</label>
                                        <input type="text" defaultValue="Admin Utama" className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-slate-700">Email</label>
                                        <div className="relative">
                                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                                            <input type="email" defaultValue="admin@jepara.go.id" className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm" />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-slate-700">Nomor Telepon</label>
                                        <div className="relative">
                                            <Smartphone className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                                            <input type="tel" defaultValue="+62 812 3456 7890" className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm" />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-slate-700">Jabatan</label>
                                        <input type="text" defaultValue="Kepala Seksi IT" className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm" />
                                    </div>
                                </div>

                                <div className="pt-4 flex justify-end">
                                    <button
                                        onClick={handleSave}
                                        disabled={loading}
                                        className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-500/25"
                                    >
                                        {loading ? (
                                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        ) : (
                                            <Save size={18} />
                                        )}
                                        Simpan Perubahan
                                    </button>
                                </div>
                            </div>
                        )}

                        {activeTab === 'notifications' && (
                            <div className="p-6 md:p-8 space-y-6">
                                <div className="flex justify-between items-center pb-6 border-b border-slate-100">
                                    <div>
                                        <h3 className="text-lg font-bold text-slate-900">Preferensi Notifikasi</h3>
                                        <p className="text-sm text-slate-500">Atur bagaimana Anda ingin menerima pemberitahuan.</p>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    {[
                                        { title: 'Laporan Baru', desc: 'Terima notifikasi saat ada laporan masuk.' },
                                        { title: 'Komentar Pengunjung', desc: 'Notifikasi unuk ulasan atau komentar baru.' },
                                        { title: 'Update Sistem', desc: 'Informasi pembaruan fitur aplikasi.' },
                                        { title: 'Ringkasan Mingguan', desc: 'Email ringkasan statistik mingguan.' },
                                    ].map((item, i) => (
                                        <div key={i} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                                            <div>
                                                <h4 className="font-medium text-slate-900">{item.title}</h4>
                                                <p className="text-xs text-slate-500">{item.desc}</p>
                                            </div>
                                            <label className="relative inline-flex items-center cursor-pointer">
                                                <input type="checkbox" className="sr-only peer" defaultChecked={i < 2} />
                                                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                                            </label>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {activeTab === 'system' && (
                            <div className="p-6 md:p-8 space-y-6">
                                <div>
                                    <h3 className="text-lg font-bold text-slate-900">Tampilan & Sistem</h3>
                                    <p className="text-sm text-slate-500">Sesuaikan tampilan aplikasi.</p>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="border-2 border-blue-500 bg-blue-50/50 p-4 rounded-xl cursor-pointer relative">
                                        <div className="absolute top-2 right-2 text-blue-600"><Check size={18} /></div>
                                        <div className="mb-3 w-full h-24 bg-white border border-slate-200 rounded-lg shadow-sm flex overflow-hidden">
                                            <div className="w-8 bg-slate-900 h-full"></div>
                                            <div className="flex-1 p-2 space-y-1">
                                                <div className="h-2 w-16 bg-slate-100 rounded"></div>
                                                <div className="h-12 w-full bg-slate-50 rounded"></div>
                                            </div>
                                        </div>
                                        <p className="font-medium text-center text-sm">Light Mode</p>
                                    </div>
                                    <div className="border border-slate-200 p-4 rounded-xl cursor-pointer hover:border-slate-300 transition-colors">
                                        <div className="mb-3 w-full h-24 bg-slate-900 border border-slate-800 rounded-lg shadow-sm flex overflow-hidden">
                                            <div className="w-8 bg-black/50 h-full"></div>
                                            <div className="flex-1 p-2 space-y-1">
                                                <div className="h-2 w-16 bg-slate-800 rounded"></div>
                                                <div className="h-12 w-full bg-slate-800/50 rounded"></div>
                                            </div>
                                        </div>
                                        <p className="font-medium text-center text-sm">Dark Mode</p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'security' && (
                            <div className="p-6 md:p-8 flex flex-col items-center justify-center py-16 text-center space-y-4">
                                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center text-slate-400">
                                    <Shield size={32} />
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-slate-900">Keamanan Akun</h3>
                                    <p className="text-slate-500 max-w-xs mx-auto text-sm mt-1">
                                        Pengaturan kata sandi dan autentikasi dua faktor dapat diakses melalui portal admin pusat.
                                    </p>
                                </div>
                                <button className="px-4 py-2 bg-slate-900 text-white rounded-lg text-sm font-medium">Buka Portal Keamanan</button>
                            </div>
                        )}
                    </motion.div>
                </div>
            </div>
        </div>
    )
}
