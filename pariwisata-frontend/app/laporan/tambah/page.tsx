'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowLeft, Save, Upload, FileText, CheckCircle } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Toast } from '@/components/ui/custom-toast'

export default function TambahLaporanPage() {
    const router = useRouter()
    interface FormData {
        title: string
        category: string
        status: string
        fileName?: string
        size?: string
        fileData?: string
    }

    const [formData, setFormData] = useState<FormData>({
        title: "",
        category: "Umum",
        status: "Draft"
    })
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [showToast, setShowToast] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSubmitting(true)

        try {
            const res = await fetch('http://localhost:4000/laporan', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            })

            if (res.ok) {
                setShowToast(true)
                setTimeout(() => {
                    router.push('/laporan')
                }, 1500)
            }
        } catch (error) {
            console.error('Submit error:', error)
            setIsSubmitting(false)
        }
    }

    return (
        <div className="max-w-2xl mx-auto space-y-8 pb-20">
            {showToast && (
                <div className="fixed top-6 right-6 z-50 animate-in slide-in-from-top-5 fade-in duration-300">
                    <div className="bg-emerald-500 text-white px-6 py-4 rounded-2xl shadow-xl flex items-center gap-3">
                        <CheckCircle size={24} className="text-white/80" />
                        <div>
                            <h3 className="font-bold">Berhasil Disimpan!</h3>
                            <p className="text-emerald-50 text-sm">Laporan baru telah ditambahkan.</p>
                        </div>
                    </div>
                </div>
            )}

            {/* Header */}
            <div>
                <Link href="/laporan" className="inline-flex items-center gap-2 text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors mb-4">
                    <ArrowLeft size={18} />
                    Kembali ke Laporan
                </Link>
                <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Buat Laporan Baru</h1>
                <p className="text-slate-500 dark:text-slate-400 mt-2">Isi formulir di bawah untuk membuat laporan baru.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm space-y-6">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Judul Laporan</label>
                        <input
                            type="text"
                            required
                            placeholder="Contoh: Laporan Bulanan Januari 2026"
                            className="w-full px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 dark:bg-slate-800 dark:text-white dark:placeholder-slate-500"
                            value={formData.title}
                            onChange={e => setFormData({ ...formData, title: e.target.value })}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Kategori</label>
                            <select
                                className="w-full px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 dark:bg-slate-800 dark:text-white"
                                value={formData.category}
                                onChange={e => setFormData({ ...formData, category: e.target.value })}
                            >
                                <option value="Umum">Umum</option>
                                <option value="Statistik">Statistik</option>
                                <option value="Keuangan">Keuangan</option>
                                <option value="Insiden">Insiden</option>
                                <option value="Event">Event</option>
                            </select>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Status</label>
                            <select
                                className="w-full px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 dark:bg-slate-800 dark:text-white"
                                value={formData.status}
                                onChange={e => setFormData({ ...formData, status: e.target.value })}
                            >
                                <option value="Draft">Draft</option>
                                <option value="Published">Published</option>
                                <option value="Review">Review</option>
                            </select>
                        </div>
                    </div>

                    <div className="pt-4 border-t border-slate-50 dark:border-slate-800">
                        <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 block">Upload Dokumen</label>
                        <div className="relative border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-xl p-8 flex flex-col items-center justify-center text-slate-400 dark:text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800 hover:border-slate-300 dark:hover:border-slate-600 transition-colors group cursor-pointer">
                            <input
                                type="file"
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-50"
                                accept=".pdf,.doc,.docx,.xls,.xlsx"
                                onChange={(e) => {
                                    const file = e.target.files?.[0]
                                    if (file) {
                                        // Calculate size
                                        const fileSize = file.size < 1024 * 1024
                                            ? (file.size / 1024).toFixed(1) + ' KB'
                                            : (file.size / (1024 * 1024)).toFixed(1) + ' MB'

                                        // Read file content
                                        const reader = new FileReader()
                                        reader.onloadend = () => {
                                            setFormData(prev => ({
                                                ...prev,
                                                fileName: file.name,
                                                size: fileSize,
                                                fileData: reader.result as string
                                            }))
                                        }
                                        reader.readAsDataURL(file)
                                    }
                                }}
                            />
                            {formData.fileName ? (
                                <div className="text-center">
                                    <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg flex items-center justify-center mx-auto mb-3">
                                        <FileText size={24} />
                                    </div>
                                    <p className="text-slate-900 dark:text-white font-medium">{formData.fileName}</p>
                                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{formData.size}</p>
                                    <p className="text-xs text-blue-600 dark:text-blue-400 mt-2 font-medium">Klik untuk ganti file</p>
                                </div>
                            ) : (
                                <div className="text-center group-hover:scale-105 transition-transform">
                                    <Upload size={32} className="mb-2 text-slate-300 dark:text-slate-500 mx-auto group-hover:text-blue-500 dark:group-hover:text-blue-400 transition-colors" />
                                    <p className="text-sm font-medium text-slate-600 dark:text-slate-300">Klik untuk upload file</p>
                                    <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">PDF, DOCX, XLSX (Maks. 10MB)</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="flex justify-end gap-3">
                    <Link
                        href="/laporan"
                        className="px-6 py-2.5 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 font-medium rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800"
                    >
                        Batal
                    </Link>
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 shadow-lg shadow-blue-500/25 disabled:opacity-50"
                    >
                        <Save size={18} />
                        {isSubmitting ? 'Menyimpan...' : 'Simpan Laporan'}
                    </button>
                </div>
            </form>
        </div>
    )
}
