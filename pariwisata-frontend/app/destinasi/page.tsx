'use client'

import React from 'react'
import { motion } from 'framer-motion'
import {
    MapPin,
    Star,
    Heart,
    Eye,
    Edit,
    Trash2,
    Plus,
    Filter,
    ArrowUpDown
} from 'lucide-react'

import Link from 'next/link'

// Mock Data
const destinations = [
    {
        id: 1,
        title: 'Pantai Kartini',
        slug: 'pantai-kartini',
        category: 'Bahari',
        location: 'Bulu, Jepara',
        rating: 4.8,
        views: '12.5K',
        likes: '850',
        image: 'from-blue-400 to-cyan-300'
    },
    {
        id: 2,
        title: 'Pulau Panjang',
        slug: 'pulau-panjang',
        category: 'Alam',
        location: 'Ujung Batu, Jepara',
        rating: 4.9,
        views: '8.2K',
        likes: '2.1K',
        image: 'from-emerald-400 to-teal-300'
    },
    {
        id: 3,
        title: 'Museum R.A Kartini',
        slug: 'museum-ra-kartini',
        category: 'Sejarah',
        location: 'Panggang, Jepara',
        rating: 4.7,
        views: '5.3K',
        likes: '420',
        image: 'from-amber-400 to-orange-300'
    },
    {
        id: 4,
        title: 'Benteng Portugis',
        slug: 'benteng-portugis',
        category: 'Sejarah',
        location: 'Donorojo, Jepara',
        rating: 4.6,
        views: '4.1K',
        likes: '350',
        image: 'from-stone-400 to-stone-300'
    },
    {
        id: 5,
        title: 'Air Terjun Songgolangit',
        slug: 'air-terjun-songgo-langit',
        category: 'Alam',
        location: 'Kembang, Jepara',
        rating: 4.5,
        views: '3.8K',
        likes: '290',
        image: 'from-cyan-400 to-blue-300'
    },
    {
        id: 6,
        title: 'Karimunjawa National Park',
        slug: 'karimunjawa',
        category: 'Bahari',
        location: 'Karimunjawa',
        rating: 5.0,
        views: '45K',
        likes: '12K',
        image: 'from-indigo-400 to-violet-300'
    }
]

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
    hidden: { opacity: 0, scale: 0.9 },
    show: { opacity: 1, scale: 1 }
}

import { Toast } from "@/components/ui/custom-toast"
import { AnimatePresence } from "framer-motion"

export default function DestinasiPage() {
    const [destinations, setDestinations] = React.useState<any[]>([])
    const [isLoading, setIsLoading] = React.useState(true)
    const [showToast, setShowToast] = React.useState(false)
    const [toastMessage, setToastMessage] = React.useState("")

    // Filter & Sort State
    const [filterCategory, setFilterCategory] = React.useState("Semua")
    const [sortBy, setSortBy] = React.useState("terbaru")
    const [activeDropdown, setActiveDropdown] = React.useState<"filter" | "sort" | null>(null)

    // Derived State
    const filteredDestinations = React.useMemo(() => {
        let result = [...destinations]

        // 1. Filter
        if (filterCategory !== "Semua") {
            result = result.filter(d =>
                d.category?.toLowerCase() === filterCategory.toLowerCase() ||
                d.tags?.some((t: string) => t.toLowerCase() === filterCategory.toLowerCase())
            )
        }

        // 2. Sort
        switch (sortBy) {
            case "nama_asc":
                result.sort((a, b) => a.label.localeCompare(b.label))
                break
            case "nama_desc":
                result.sort((a, b) => b.label.localeCompare(a.label))
                break
            case "rating":
                result.sort((a, b) => (b.rating || 0) - (a.rating || 0))
                break
            case "views":
                // Parse "4.5K" to number if needed, strictly for this mock data let's assume simple sort or parse
                // For simplicity, let's just sort by user count or similar mock metric if available, 
                // or parse the string k/m. 
                // Given the type is unknown but mock data has string like '4.1K', we need a parser.
                // Or just fallback to users count map.
                // Let's rely on 'users' field from backend mock if available or just string compare for now.
                // Actually the Backend Type has `users: number`, but frontend mock array had string views.
                // The fetched data comes from Backend which has `users: number`.
                result.sort((a, b) => (b.users || 0) - (a.users || 0))
                break
            case "terbaru":
            default:
                // Assume default order is newest (last added)
                // If backend returns in inserted order, reversing might behave like "Newest first" 
                // if we pushed to end.
                result.reverse()
                break
        }

        return result
    }, [destinations, filterCategory, sortBy])

    // Click outside handler
    React.useEffect(() => {
        const handleClickOutside = () => setActiveDropdown(null)
        window.addEventListener('click', handleClickOutside)
        return () => window.removeEventListener('click', handleClickOutside)
    }, [])

    const fetchDestinations = async () => {
        setIsLoading(true)
        try {
            const res = await fetch('http://localhost:4000/search')
            if (res.ok) {
                const data = await res.json()
                setDestinations(data)
            }
        } catch (error) {
            console.error("Failed to fetch destinations", error)
        } finally {
            setIsLoading(false)
        }
    }

    React.useEffect(() => {
        fetchDestinations()
    }, [])

    const handleDelete = async (id: string, name: string) => {
        if (!confirm(`Apakah Anda yakin ingin menghapus "${name}"?`)) return

        try {
            const res = await fetch(`http://localhost:4000/destinasi/${id}`, {
                method: 'DELETE'
            })

            if (res.ok) {
                setToastMessage(`Destinasi "${name}" berhasil dihapus.`)
                setShowToast(true)
                // Refresh list
                fetchDestinations()
            } else {
                alert("Gagal menghapus data")
            }
        } catch (error) {
            console.error(error)
            alert("Terjadi kesalahan saat menghapus")
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
        <div className="space-y-8">
            <AnimatePresence>
                {showToast && (
                    <Toast
                        message={toastMessage}
                        type="success"
                        onClose={() => setShowToast(false)}
                    />
                )}
            </AnimatePresence>

            {/* Page Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Kelola Destinasi</h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-1">Manajemen data lokasi wisata di Jepara.</p>
                </div>

                <div className="flex items-center gap-3">
                    {/* Filter Dropdown */}
                    <div className="relative" onClick={e => e.stopPropagation()}>
                        <button
                            onClick={() => setActiveDropdown(activeDropdown === 'filter' ? null : 'filter')}
                            className={`flex items-center gap-2 px-4 py-2 border rounded-xl transition-colors font-medium text-sm ${filterCategory !== 'Semua' ? 'bg-blue-50 border-blue-200 text-blue-700 dark:bg-blue-900/30 dark:border-blue-800 dark:text-blue-400' : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800'}`}
                        >
                            <Filter size={16} />
                            {filterCategory === 'Semua' ? 'Filter' : filterCategory}
                        </button>

                        <AnimatePresence>
                            {activeDropdown === 'filter' && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: 10 }}
                                    className="absolute top-full mt-2 right-0 w-48 bg-white dark:bg-slate-900 rounded-xl shadow-xl border border-slate-100 dark:border-slate-800 p-2 z-50"
                                >
                                    {["Semua", "Alam", "Bahari", "Sejarah", "Religi", "Kuliner", "Hotel"].map((cat) => (
                                        <button
                                            key={cat}
                                            onClick={() => {
                                                setFilterCategory(cat)
                                                setActiveDropdown(null)
                                            }}
                                            className={`w-full text-left px-3 py-2 rounded-lg text-sm mb-1 ${filterCategory === cat ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 font-medium' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'}`}
                                        >
                                            {cat}
                                        </button>
                                    ))}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Sort Dropdown */}
                    <div className="relative" onClick={e => e.stopPropagation()}>
                        <button
                            onClick={() => setActiveDropdown(activeDropdown === 'sort' ? null : 'sort')}
                            className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors font-medium text-sm"
                        >
                            <ArrowUpDown size={16} />
                            Sort
                        </button>

                        <AnimatePresence>
                            {activeDropdown === 'sort' && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: 10 }}
                                    className="absolute top-full mt-2 right-0 w-56 bg-white dark:bg-slate-900 rounded-xl shadow-xl border border-slate-100 dark:border-slate-800 p-2 z-50"
                                >
                                    {[
                                        { label: "Terbaru", value: "terbaru" },
                                        { label: "Nama (A-Z)", value: "nama_asc" },
                                        { label: "Nama (Z-A)", value: "nama_desc" },
                                        { label: "Rating Tertinggi", value: "rating" },
                                        { label: "Paling Populer", value: "views" },
                                    ].map((opt) => (
                                        <button
                                            key={opt.value}
                                            onClick={() => {
                                                setSortBy(opt.value)
                                                setActiveDropdown(null)
                                            }}
                                            className={`w-full text-left px-3 py-2 rounded-lg text-sm mb-1 ${sortBy === opt.value ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 font-medium' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'}`}
                                        >
                                            {opt.label}
                                        </button>
                                    ))}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                    <Link href="/destinasi/tambah" className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-medium text-sm shadow-lg shadow-blue-500/25">
                        <Plus size={18} />
                        Tambah Destinasi
                    </Link>
                </div>
            </div>

            {/* Grid */}
            <motion.div
                key={filterCategory + sortBy}
                variants={container}
                initial="hidden"
                animate="show"
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
                {filteredDestinations.map((dest) => (
                    <motion.div
                        key={dest.id}
                        variants={item}
                        className="group bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 relative"
                    >
                        <Link href={dest.href || '#'} className="block h-full">
                            {/* Image Section */}
                            <div className={`h-48 w-full bg-gradient-to-br from-blue-400 to-cyan-300 relative overflow-hidden`}>
                                {dest.image && (dest.image.startsWith('data:image') || dest.image.startsWith('http')) ? (
                                    <img
                                        src={dest.image}
                                        alt={dest.label}
                                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                    />
                                ) : (
                                    <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-cyan-300" />
                                )}

                                <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors" />
                                <div className="absolute top-4 left-4">
                                    <span className="px-3 py-1 bg-white/90 backdrop-blur-md text-xs font-bold text-slate-900 rounded-lg shadow-sm">
                                        {dest.category || dest.tags?.[0] || 'Wisata'}
                                    </span>
                                </div>
                            </div>

                            {/* Content Section */}
                            <div className="p-5 pb-16">
                                <div className="flex justify-between items-start mb-2">
                                    <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-1">
                                        {dest.label}
                                    </h3>
                                </div>

                                <div className="flex items-center gap-1 text-slate-500 dark:text-slate-400 text-sm mb-4">
                                    <MapPin size={14} className="text-slate-400 dark:text-slate-500" />
                                    {dest.location || 'Jepara, Jawa Tengah'}
                                </div>

                                <div className="flex items-center gap-4 border-t border-slate-50 dark:border-slate-800 pt-4">
                                    <div className="flex items-center gap-1 font-bold text-slate-700 dark:text-slate-300 text-sm">
                                        <Star size={14} className="text-amber-400 fill-amber-400" />
                                        4.5
                                    </div>
                                    <div className="flex items-center gap-1 text-slate-400 dark:text-slate-500 text-xs">
                                        <Eye size={14} />
                                        {dest.users}k
                                    </div>
                                </div>
                            </div>
                        </Link>

                        {/* Actions */}
                        <div className="absolute bottom-5 right-5 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity translate-y-2 group-hover:translate-y-0 duration-300">
                            <Link
                                href={`/destinasi/edit/${dest.id}`}
                                onClick={(e) => { e.stopPropagation(); }}
                                className="p-2 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/30 hover:text-blue-600 dark:hover:text-blue-400 transition-colors z-10"
                            >
                                <Edit size={16} />
                            </Link>
                            <button
                                onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    handleDelete(dest.id, dest.label)
                                }}
                                className="p-2 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/30 hover:text-red-600 dark:hover:text-red-400 transition-colors z-10"
                            >
                                <Trash2 size={16} />
                            </button>
                        </div>
                    </motion.div>
                ))}
            </motion.div>
        </div>
    )
}
