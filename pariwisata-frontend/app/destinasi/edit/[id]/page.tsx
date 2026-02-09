"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowLeft, Save, Upload, MapPin, Tag } from "lucide-react"
import Link from "next/link"
import { useRouter, useParams } from "next/navigation"
import { Toast } from "@/components/ui/custom-toast"

export default function EditDestinasiPage() {
    const router = useRouter()
    const params = useParams()
    const { id } = params

    const [formData, setFormData] = useState({
        title: "",
        category: "Bahari",
        location: "",
        description: "",
        tags: ""
    })
    const [imagePreview, setImagePreview] = useState<string | null>(null)

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            const reader = new FileReader()
            reader.onloadend = () => {
                const base64String = reader.result as string
                setImagePreview(base64String)
            }
            reader.readAsDataURL(file)
        }
    }

    const [showToast, setShowToast] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [isLoading, setIsLoading] = useState(true)

    // Fetch existing data
    useEffect(() => {
        if (!id) return

        const fetchDestination = async () => {
            try {
                const res = await fetch(`http://localhost:4000/destinasi/id/${id}`)
                if (res.ok) {
                    const data = await res.json()
                    setFormData({
                        title: data.label,
                        category: data.category || "Bahari",
                        location: data.location || "",
                        description: data.description || "",
                        tags: data.tags?.join(", ") || ""
                    })
                    if (data.image) {
                        setImagePreview(data.image)
                    }
                } else {
                    alert("Destinasi tidak ditemukan")
                    router.push('/destinasi')
                }
            } catch (error) {
                console.error(error)
            } finally {
                setIsLoading(false)
            }
        }
        fetchDestination()
    }, [id, router])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSubmitting(true)

        try {
            const res = await fetch(`http://localhost:4000/destinasi/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...formData, image: imagePreview })
            })

            if (res.ok) {
                setShowToast(true)
                // Redirect logic
                setTimeout(() => {
                    router.push('/destinasi')
                }, 3000)
            } else {
                alert("Gagal memperbarui data")
            }
        } catch (error) {
            console.error(error)
            alert("Terjadi kesalahan")
        } finally {
            setIsSubmitting(false)
        }
    }

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        )
    }

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <AnimatePresence>
                {showToast && (
                    <Toast
                        message="Perubahan berhasil disimpan."
                        type="success"
                        onClose={() => {
                            setShowToast(false)
                            router.push('/destinasi')
                        }}
                    />
                )}
            </AnimatePresence>

            {/* Header */}
            <div className="flex items-center gap-4 mb-8">
                <Link href="/destinasi" className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors text-slate-500 dark:text-slate-400">
                    <ArrowLeft size={20} />
                </Link>
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Edit Destinasi</h1>
                    <p className="text-slate-500 dark:text-slate-400 text-sm">Perbarui informasi destinasi wisata.</p>
                </div>
            </div>

            <motion.form
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                onSubmit={handleSubmit}
                className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm p-6 space-y-8"
            >
                {/* General Info */}
                <div className="space-y-4">
                    <h2 className="text-lg font-semibold text-slate-800 dark:text-white border-b border-slate-50 dark:border-slate-800 pb-2">Informasi Umum</h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Nama Destinasi</label>
                            <input
                                required
                                type="text"
                                placeholder="Contoh: Pantai Kartini"
                                className="w-full px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder:text-slate-300 dark:text-white dark:bg-slate-800 dark:placeholder-slate-500"
                                value={formData.title}
                                onChange={e => setFormData({ ...formData, title: e.target.value })}
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Kategori</label>
                            <select
                                className="w-full px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all bg-white dark:bg-slate-800 dark:text-white"
                                value={formData.category}
                                onChange={e => setFormData({ ...formData, category: e.target.value })}
                            >
                                <option value="Bahari">Bahari</option>
                                <option value="Alam">Alam</option>
                                <option value="Sejarah">Sejarah</option>
                                <option value="Kuliner">Kuliner</option>
                                <option value="Religi">Religi</option>
                            </select>
                        </div>

                        <div className="space-y-2 md:col-span-2">
                            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Lokasi Lengkap</label>
                            <div className="relative">
                                <MapPin className="absolute left-3 top-2.5 text-slate-400 dark:text-slate-500" size={18} />
                                <input
                                    required
                                    type="text"
                                    placeholder="Contoh: Jl. Pantai Kartini, Bulu, Kec. Jepara"
                                    className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder:text-slate-300 dark:text-white dark:bg-slate-800 dark:placeholder-slate-500"
                                    value={formData.location}
                                    onChange={e => setFormData({ ...formData, location: e.target.value })}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Details */}
                <div className="space-y-4">
                    <h2 className="text-lg font-semibold text-slate-800 dark:text-white border-b border-slate-50 dark:border-slate-800 pb-2">Detail & Deskripsi</h2>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Deskripsi Singkat</label>
                        <textarea
                            rows={4}
                            placeholder="Jelaskan daya tarik destinasi ini..."
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder:text-slate-300 resize-none dark:text-white dark:bg-slate-800 dark:placeholder-slate-500"
                            value={formData.description}
                            onChange={e => setFormData({ ...formData, description: e.target.value })}
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Tags (Pisahkan dengan koma)</label>
                        <div className="relative">
                            <Tag className="absolute left-3 top-2.5 text-slate-400 dark:text-slate-500" size={18} />
                            <input
                                type="text"
                                placeholder="pantai, sunset, keluarga"
                                className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder:text-slate-300 dark:text-white dark:bg-slate-800 dark:placeholder-slate-500"
                                value={formData.tags}
                                onChange={e => setFormData({ ...formData, tags: e.target.value })}
                            />
                        </div>
                    </div>
                </div>

                {/* Media Upload */}
                <div className="space-y-4">
                    <h2 className="text-lg font-semibold text-slate-800 dark:text-white border-b border-slate-50 dark:border-slate-800 pb-2">Foto Destinasi</h2>
                    <div
                        onClick={() => document.getElementById('fileInput')?.click()}
                        className="border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-xl p-8 flex flex-col items-center justify-center text-slate-400 dark:text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800 hover:border-slate-300 dark:hover:border-slate-600 transition-all cursor-pointer relative overflow-hidden"
                    >
                        {imagePreview ? (
                            <img src={imagePreview} alt="Preview" className="absolute inset-0 w-full h-full object-cover" />
                        ) : (
                            <>
                                <div className="p-3 bg-slate-100 dark:bg-slate-800 rounded-full mb-3">
                                    <Upload size={24} className="text-slate-500 dark:text-slate-400" />
                                </div>
                                <p className="font-medium text-slate-600 dark:text-slate-300">Klik untuk ubah foto</p>
                                <p className="text-xs">PNG, JPG up to 5MB</p>
                            </>
                        )}
                        <input
                            id="fileInput"
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={handleImageChange}
                        />
                    </div>
                    {imagePreview && (
                        <button
                            type="button"
                            onClick={(e) => { e.stopPropagation(); setImagePreview(null); }}
                            className="text-red-500 text-sm font-medium hover:text-red-600"
                        >
                            Hapus Foto
                        </button>
                    )}
                </div>

                {/* Actions */}
                <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-50 dark:border-slate-800">
                    <Link
                        href="/destinasi"
                        className="px-6 py-2.5 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 font-medium rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                    >
                        Batal
                    </Link>
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 transition-colors shadow-lg shadow-blue-500/25 disabled:opacity-50"
                    >
                        <Save size={18} />
                        {isSubmitting ? 'Menyimpan...' : 'Simpan Perubahan'}
                    </button>
                </div>

            </motion.form>
        </div>
    )
}
