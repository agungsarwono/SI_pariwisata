"use client"

import { useParams } from "next/navigation"
import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { ArrowLeft, MapPin, Tag, Users } from "lucide-react"
import Link from "next/link"

export default function DestinationDetailPage() {
    const { slug } = useParams()
    const [destination, setDestination] = useState<any>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(false)

    useEffect(() => {
        if (!slug) return

        const fetchDetail = async () => {
            try {
                const res = await fetch(`http://localhost:4000/destinasi/${slug}`)
                if (res.ok) {
                    const data = await res.json()
                    setDestination(data)
                } else {
                    setError(true)
                }
            } catch (err) {
                console.error(err)
                setError(true)
            } finally {
                setLoading(false)
            }
        }

        fetchDetail()
    }, [slug])

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        )
    }

    if (error || !destination) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
                <h1 className="text-2xl font-bold text-slate-800">Destinasi Tidak Ditemukan</h1>
                <p className="text-slate-500">Halaman yang Anda cari mungkin sudah dihapus atau slug salah.</p>
                <Link href="/dashboard" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                    Kembali ke Dashboard
                </Link>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            {/* Header / Breadcrumb */}
            <div className="flex items-center gap-2 text-sm text-slate-500">
                <Link href="/dashboard" className="hover:text-blue-600">Dashboard</Link>
                <span>/</span>
                <Link href="/destinasi" className="hover:text-blue-600">Destinasi</Link>
                <span>/</span>
                <span className="text-slate-800 font-medium">{destination.label}</span>
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden"
            >
                {/* Hero / Cover Image Placeholder */}
                <div className="h-64 bg-slate-100 w-full relative overflow-hidden">
                    {destination.image ? (
                        <img
                            src={destination.image}
                            alt={destination.label}
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <div className="absolute inset-0 flex items-center justify-center text-slate-400">
                            Topography / Image Placeholder
                        </div>
                    )}
                </div>

                <div className="p-8">
                    <div className="flex items-start justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-slate-900 mb-2">{destination.label}</h1>
                            <div className="flex items-center gap-4 text-slate-500 text-sm">
                                <div className="flex items-center gap-1">
                                    <MapPin size={16} />
                                    Jepara, Jawa Tengah
                                </div>
                                <div className="flex items-center gap-1">
                                    <Users size={16} />
                                    {destination.users}00+ Visitors
                                </div>
                            </div>
                        </div>
                        <div className="flex gap-2">
                            {destination.tags?.map((tag: string) => (
                                <span key={tag} className="px-3 py-1 bg-slate-100 text-slate-600 text-xs font-semibold rounded-full uppercase tracking-wide">
                                    {tag}
                                </span>
                            ))}
                        </div>
                    </div>

                    <div className="mt-8 border-t border-slate-100 pt-8">
                        <h2 className="text-lg font-semibold text-slate-800 mb-4">About Destination</h2>
                        <p className="text-slate-600 leading-relaxed max-w-4xl">
                            {destination.description || "Belum ada deskripsi untuk destinasi ini."}
                        </p>
                    </div>
                </div>
            </motion.div>
        </div>
    )
}
