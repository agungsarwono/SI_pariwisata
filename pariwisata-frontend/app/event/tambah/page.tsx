'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowLeft, Save, Upload, Calendar, Clock, MapPin, Tag } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'
import { Toast as CustomToast } from '@/components/ui/custom-toast'

export default function AddEventPage() {
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)
    const [showToast, setShowToast] = useState(false)
    const [formData, setFormData] = useState({
        title: '',
        date: '',
        time: '',
        location: '',
        category: 'Budaya',
        description: '',
        image: ''
    })

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            const reader = new FileReader()
            reader.onloadend = () => {
                setFormData(prev => ({ ...prev, image: reader.result as string }))
            }
            reader.readAsDataURL(file)
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)

        // Format date from YYYY-MM-DD to DD MMM YYYY
        const dateObj = new Date(formData.date)
        const formattedDate = dateObj.toLocaleDateString('en-GB', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
        }).replace(/ /g, ' ')

        const payload = {
            ...formData,
            date: formattedDate
        }

        try {
            const res = await fetch('http://localhost:4000/events', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            })

            if (res.ok) {
                setShowToast(true)
                setTimeout(() => {
                    router.push('/event')
                }, 2000)
            }
        } catch (error) {
            console.error('Failed to create event', error)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="max-w-4xl mx-auto">
            {showToast && (
                <CustomToast
                    message="Event berhasil dibuat!"
                    onClose={() => setShowToast(false)}
                />
            )}

            <div className="mb-6">
                <Link
                    href="/event"
                    className="inline-flex items-center gap-2 text-slate-500 hover:text-blue-600 transition-colors mb-4"
                >
                    <ArrowLeft size={20} />
                    Kembali ke Event
                </Link>
                <h1 className="text-3xl font-bold text-slate-900">Buat Event Baru</h1>
                <p className="text-slate-500 mt-1">Tambahkan jadwal acara pariwisata atau kebudayaan baru.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Left Column: Image Upload */}
                    <div className="space-y-4">
                        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                            <label className="block text-sm font-medium text-slate-700">Cover Event</label>

                            <div className="relative group">
                                <div className={cn(
                                    "w-full h-64 rounded-xl border-2 border-dashed border-slate-300 flex flex-col items-center justify-center bg-slate-50 transition-all overflow-hidden",
                                    !formData.image && "hover:border-blue-500 hover:bg-blue-50"
                                )}>
                                    {formData.image ? (
                                        <img
                                            src={formData.image}
                                            alt="Preview"
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <div className="text-center p-6">
                                            <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-3">
                                                <Upload size={24} />
                                            </div>
                                            <p className="text-sm font-medium text-slate-700">Klik untuk upload gambar</p>
                                            <p className="text-xs text-slate-500 mt-1">PNG, JPG up to 5MB</p>
                                        </div>
                                    )}

                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageUpload}
                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                            <label className="block text-sm font-medium text-slate-700">Waktu & Tempat</label>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-xs font-semibold text-slate-500 uppercase">Tanggal</label>
                                    <div className="relative">
                                        <Calendar size={16} className="absolute left-3 top-3 text-slate-400" />
                                        <input
                                            type="date"
                                            value={formData.date}
                                            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                            className="w-full pl-9 pr-4 py-2 bg-slate-50 border-transparent rounded-lg focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all outline-none text-sm text-slate-600"
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-semibold text-slate-500 uppercase">Jam</label>
                                    <div className="relative">
                                        <Clock size={16} className="absolute left-3 top-3 text-slate-400" />
                                        <input
                                            type="text"
                                            placeholder="08:00 - 14:00"
                                            value={formData.time}
                                            onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                                            className="w-full pl-9 pr-4 py-2 bg-slate-50 border-transparent rounded-lg focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all outline-none text-sm"
                                            required
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-semibold text-slate-500 uppercase">Lokasi</label>
                                <div className="relative">
                                    <MapPin size={16} className="absolute left-3 top-3 text-slate-400" />
                                    <input
                                        type="text"
                                        placeholder="Lokasi event..."
                                        value={formData.location}
                                        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                        className="w-full pl-9 pr-4 py-2 bg-slate-50 border-transparent rounded-lg focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all outline-none text-sm"
                                        required
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Details */}
                    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
                        <div className="space-y-4">
                            <label className="block text-sm font-medium text-slate-700">Detail Event</label>

                            <div className="space-y-2">
                                <label className="text-xs font-semibold text-slate-500 uppercase">Nama Event</label>
                                <input
                                    type="text"
                                    placeholder="Masukkan nama event..."
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    className="w-full px-4 py-2 bg-slate-50 border-transparent rounded-lg focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all outline-none text-sm"
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-semibold text-slate-500 uppercase">Kategori</label>
                                <div className="grid grid-cols-3 gap-2">
                                    {['Budaya', 'Musik', 'Pameran'].map((cat) => (
                                        <button
                                            key={cat}
                                            type="button"
                                            onClick={() => setFormData({ ...formData, category: cat })}
                                            className={cn(
                                                "py-2 text-xs font-medium rounded-lg border transition-all",
                                                formData.category === cat
                                                    ? "bg-blue-50 text-blue-600 border-blue-200"
                                                    : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
                                            )}
                                        >
                                            {cat}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-semibold text-slate-500 uppercase">Deskripsi</label>
                                <textarea
                                    rows={5}
                                    placeholder="Jelaskan detail acara..."
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    className="w-full px-4 py-3 bg-slate-50 border-transparent rounded-lg focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all outline-none text-sm resize-none"
                                />
                            </div>
                        </div>

                        <div className="pt-4 border-t border-slate-100 flex gap-3">
                            <Link
                                href="/event"
                                className="flex-1 py-2.5 border border-slate-200 text-slate-600 font-medium rounded-xl hover:bg-slate-50 transition-colors text-center text-sm"
                            >
                                Batal
                            </Link>
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="flex-[2] py-2.5 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 shadow-lg shadow-blue-500/25 transition-colors text-sm flex items-center justify-center gap-2 disabled:opacity-70"
                            >
                                {isLoading ? 'Menyimpan...' : (
                                    <>
                                        <Save size={18} />
                                        Simpan Event
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    )
}
