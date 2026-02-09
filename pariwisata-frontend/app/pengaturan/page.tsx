'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useTheme } from "next-themes"
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
    const { setTheme, theme } = useTheme()
    const [activeTab, setActiveTab] = useState('profile')
    const [loading, setLoading] = useState(false)
    const [showToast, setShowToast] = useState(false)
    const [mounted, setMounted] = useState(false)

    // Profile State
    const [profile, setProfile] = useState({
        name: 'Admin Utama',
        email: 'admin@jepara.go.id',
        phone: '+62 812 3456 7890',
        job: 'Kepala Seksi IT',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Admin'
    })

    const fileInputRef = React.useRef<HTMLInputElement>(null)

    // Handle Hydration Mismatch for Theme
    useEffect(() => {
        setMounted(true)
    }, [])

    // Load from LocalStorage on Mount
    useEffect(() => {
        const savedProfile = localStorage.getItem('user_profile')
        if (savedProfile) {
            setProfile(JSON.parse(savedProfile))
        }
    }, [])

    const handleSave = () => {
        setLoading(true)
        // Simulate API call
        setTimeout(() => {
            localStorage.setItem('user_profile', JSON.stringify(profile))
            setLoading(false)
            setShowToast(true)
            setTimeout(() => setShowToast(false), 3000)
        }, 1000)
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setProfile(prev => ({ ...prev, [name]: value }))
    }

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            const reader = new FileReader()
            reader.onloadend = () => {
                setProfile(prev => ({ ...prev, avatar: reader.result as string }))
            }
            reader.readAsDataURL(file)
        }
    }

    const tabs = [
        { id: 'profile', label: 'Profil Akun', icon: User },
        { id: 'notifications', label: 'Notifikasi', icon: Bell },
        { id: 'security', label: 'Keamanan', icon: Shield },
        { id: 'system', label: 'Sistem', icon: Globe },
    ]

    if (!mounted) {
        return null // Avoid hydration mismatch
    }

    return (
        <div className="max-w-5xl mx-auto space-y-8">
            {showToast && (
                <div className="fixed top-4 right-4 z-50 bg-green-600 text-white px-4 py-2 rounded-lg shadow-lg flex items-center gap-2 animate-in slide-in-from-right fade-in duration-300">
                    <Check size={18} />
                    <span className="text-sm font-medium">Perubahan berhasil disimpan!</span>
                </div>
            )}

            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Pengaturan</h1>
                <p className="text-slate-500 dark:text-slate-400 mt-1">Kelola preferensi akun dan konfigurasi sistem.</p>
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
                                    ? "bg-blue-50 text-blue-700 shadow-sm ring-1 ring-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:ring-blue-800"
                                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-200"
                            )}
                        >
                            <tab.icon size={18} />
                            {tab.label}
                        </button>
                    ))}

                    <div className="pt-4 mt-4 border-t border-slate-200 dark:border-slate-800">
                        <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-600 hover:bg-red-50 transition-colors text-sm font-medium dark:hover:bg-red-900/20">
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
                        className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden"
                    >
                        {activeTab === 'profile' && (
                            <div className="p-6 md:p-8 space-y-8">
                                <div className="flex items-center gap-6 pb-8 border-b border-slate-100 dark:border-slate-800">
                                    <div
                                        onClick={() => fileInputRef.current?.click()}
                                        className="relative group cursor-pointer"
                                    >
                                        <div className="w-24 h-24 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-3xl font-bold text-slate-400 overflow-hidden ring-4 ring-white dark:ring-slate-800 shadow-lg">
                                            <img src={profile.avatar} alt="Avatar" className="w-full h-full object-cover" />
                                        </div>
                                        <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                            <Camera className="text-white" size={24} />
                                        </div>
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-slate-900 dark:text-white">{profile.name}</h3>
                                        <p className="text-slate-500 dark:text-slate-400">Super Administrator</p>
                                        <input
                                            type="file"
                                            ref={fileInputRef}
                                            onChange={handleImageUpload}
                                            accept="image/*"
                                            className="hidden"
                                        />
                                        <button
                                            onClick={() => fileInputRef.current?.click()}
                                            className="mt-2 text-sm text-blue-600 dark:text-blue-400 font-medium hover:underline"
                                        >
                                            Ubah Foto Profil
                                        </button>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Nama Lengkap</label>
                                        <input
                                            type="text"
                                            name="name"
                                            value={profile.name}
                                            onChange={handleChange}
                                            className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm dark:text-white"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Email</label>
                                        <div className="relative">
                                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                                            <input
                                                type="email"
                                                name="email"
                                                value={profile.email}
                                                onChange={handleChange}
                                                className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm dark:text-white"
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Nomor Telepon</label>
                                        <div className="relative">
                                            <Smartphone className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                                            <input
                                                type="tel"
                                                name="phone"
                                                value={profile.phone}
                                                onChange={handleChange}
                                                className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm dark:text-white"
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Jabatan</label>
                                        <input
                                            type="text"
                                            name="job"
                                            value={profile.job}
                                            onChange={handleChange}
                                            className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm dark:text-white"
                                        />
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
                                <div className="flex justify-between items-center pb-6 border-b border-slate-100 dark:border-slate-800">
                                    <div>
                                        <h3 className="text-lg font-bold text-slate-900 dark:text-white">Preferensi Notifikasi</h3>
                                        <p className="text-sm text-slate-500 dark:text-slate-400">Atur bagaimana Anda ingin menerima pemberitahuan.</p>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    {[
                                        { title: 'Laporan Baru', desc: 'Terima notifikasi saat ada laporan masuk.' },
                                        { title: 'Komentar Pengunjung', desc: 'Notifikasi unuk ulasan atau komentar baru.' },
                                        { title: 'Update Sistem', desc: 'Informasi pembaruan fitur aplikasi.' },
                                        { title: 'Ringkasan Mingguan', desc: 'Email ringkasan statistik mingguan.' },
                                    ].map((item, i) => (
                                        <div key={i} className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800 rounded-xl">
                                            <div>
                                                <h4 className="font-medium text-slate-900 dark:text-white">{item.title}</h4>
                                                <p className="text-xs text-slate-500 dark:text-slate-400">{item.desc}</p>
                                            </div>
                                            <label className="relative inline-flex items-center cursor-pointer">
                                                <input type="checkbox" className="sr-only peer" defaultChecked={i < 2} />
                                                <div className="w-11 h-6 bg-slate-200 dark:bg-slate-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                                            </label>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {activeTab === 'system' && (
                            <div className="p-6 md:p-8 space-y-6">
                                <div>
                                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">Tampilan & Sistem</h3>
                                    <p className="text-sm text-slate-500 dark:text-slate-400">Sesuaikan tampilan aplikasi.</p>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div
                                        onClick={() => setTheme("light")}
                                        className={cn(
                                            "border-2 p-4 rounded-xl cursor-pointer relative transition-all",
                                            theme === 'light'
                                                ? "border-blue-500 bg-blue-50/50 dark:bg-blue-900/20"
                                                : "border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600"
                                        )}
                                    >
                                        {theme === 'light' && (
                                            <div className="absolute top-2 right-2 text-blue-600"><Check size={18} /></div>
                                        )}
                                        <div className="mb-3 w-full h-24 bg-white border border-slate-200 rounded-lg shadow-sm flex overflow-hidden">
                                            <div className="w-8 bg-slate-900 h-full"></div>
                                            <div className="flex-1 p-2 space-y-1">
                                                <div className="h-2 w-16 bg-slate-100 rounded"></div>
                                                <div className="h-12 w-full bg-slate-50 rounded"></div>
                                            </div>
                                        </div>
                                        <p className="font-medium text-center text-sm text-slate-900 dark:text-slate-300">Light Mode</p>
                                    </div>

                                    <div
                                        onClick={() => setTheme("dark")}
                                        className={cn(
                                            "border-2 p-4 rounded-xl cursor-pointer relative transition-all",
                                            theme === 'dark'
                                                ? "border-blue-500 bg-slate-800"
                                                : "border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600"
                                        )}
                                    >
                                        {theme === 'dark' && (
                                            <div className="absolute top-2 right-2 text-blue-500"><Check size={18} /></div>
                                        )}
                                        <div className="mb-3 w-full h-24 bg-slate-900 border border-slate-800 rounded-lg shadow-sm flex overflow-hidden">
                                            <div className="w-8 bg-black/50 h-full"></div>
                                            <div className="flex-1 p-2 space-y-1">
                                                <div className="h-2 w-16 bg-slate-800 rounded"></div>
                                                <div className="h-12 w-full bg-slate-800/50 rounded"></div>
                                            </div>
                                        </div>
                                        <p className="font-medium text-center text-sm text-slate-900 dark:text-white">Dark Mode</p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'security' && (
                            <div className="p-6 md:p-8 flex flex-col items-center justify-center py-16 text-center space-y-4">
                                <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center text-slate-400">
                                    <Shield size={32} />
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">Keamanan Akun</h3>
                                    <p className="text-slate-500 dark:text-slate-400 max-w-xs mx-auto text-sm mt-1">
                                        Pengaturan kata sandi dan autentikasi dua faktor dapat diakses melalui portal admin pusat.
                                    </p>
                                </div>
                                <button className="px-4 py-2 bg-slate-900 text-white rounded-lg text-sm font-medium hover:bg-slate-800">Buka Portal Keamanan</button>
                            </div>
                        )}
                    </motion.div>
                </div>
            </div>
        </div>
    )
}
