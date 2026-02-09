'use client'

import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import {
    Calendar as CalendarIcon,
    MapPin,
    Clock,
    Users,
    Plus,
    Search,
    Filter,
    ChevronLeft,
    ChevronRight,
    Trash2
} from 'lucide-react'
import { cn } from '@/lib/utils'
import Link from 'next/link'
import { Toast as CustomToast } from '@/components/ui/custom-toast'
import { Modal } from '@/components/ui/modal'

interface Event {
    id: string
    title: string
    date: string
    time: string
    location: string
    category: string
    attendees: string
    status: 'Upcoming' | 'Past'
    image: string
}

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
    hidden: { opacity: 0, x: -20 },
    show: { opacity: 1, x: 0 }
}

export default function EventPage() {
    const [events, setEvents] = useState<Event[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [showToast, setShowToast] = useState(false)
    const [selectedCategory, setSelectedCategory] = useState("Semua Event")

    const filteredEvents = selectedCategory === "Semua Event"
        ? events
        : events.filter(e => e.category === selectedCategory || (selectedCategory === "Musik & Seni" && (e.category === "Musik" || e.category === "Seni")))

    const categories = ["Semua Event", "Budaya", "Musik & Seni", "Pameran"]

    const [deleteId, setDeleteId] = useState<string | null>(null)
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)

    const fetchEvents = async () => {
        try {
            const res = await fetch('http://localhost:4000/events')
            const data = await res.json()
            setEvents(data)
        } catch (error) {
            console.error('Failed to fetch events', error)
        } finally {
            setIsLoading(false)
        }
    }

    const confirmDelete = (id: string) => {
        setDeleteId(id)
        setIsDeleteModalOpen(true)
    }

    const handleDelete = async () => {
        if (!deleteId) return

        try {
            await fetch(`http://localhost:4000/events/${deleteId}`, { method: 'DELETE' })
            fetchEvents()
            setShowToast(true)
            setIsDeleteModalOpen(false)
            setDeleteId(null)
        } catch (error) {
            console.error('Failed to delete event', error)
        }
    }

    useEffect(() => {
        fetchEvents()
    }, [])

    return (
        <div className="space-y-8">
            {showToast && (
                <CustomToast
                    message="Event berhasil dihapus"
                    onClose={() => setShowToast(false)}
                />
            )}

            {/* Delete Confirmation Modal */}
            <Modal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                title="Hapus Event"
                className="max-w-md"
            >
                <div className="space-y-4">
                    <p className="text-slate-600">
                        Apakah Anda yakin ingin menghapus event ini?
                        Tindakan ini tidak dapat dibatalkan.
                    </p>
                    <div className="flex justify-end gap-3 pt-2">
                        <button
                            onClick={() => setIsDeleteModalOpen(false)}
                            className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg font-medium transition-colors"
                        >
                            Batal
                        </button>
                        <button
                            onClick={handleDelete}
                            className="px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors shadow-lg shadow-red-500/30"
                        >
                            Hapus
                        </button>
                    </div>
                </div>
            </Modal>

            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Event & Budaya</h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-1">Jadwal acara pariwisata dan kebudayaan daerah.</p>
                </div>

                <Link
                    href="/event/tambah"
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-medium text-sm shadow-lg shadow-blue-500/25"
                >
                    <Plus size={18} />
                    Buat Event Baru
                </Link>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: Event List */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Filters */}
                    <div className="flex items-center gap-3 overflow-x-auto pb-2">
                        {categories.map((cat) => (
                            <button
                                key={cat}
                                onClick={() => setSelectedCategory(cat)}
                                className={cn(
                                    "px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors",
                                    selectedCategory === cat
                                        ? "bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900"
                                        : "bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
                                )}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>

                    {isLoading ? (
                        <div className="text-center py-10 dark:text-slate-400">Loading events...</div>
                    ) : (
                        <motion.div
                            key={selectedCategory}
                            variants={container}
                            initial="hidden"
                            animate="show"
                            className="space-y-4"
                        >
                            {filteredEvents.length > 0 ? (
                                filteredEvents.map((event) => (
                                    <motion.div
                                        key={event.id}
                                        variants={item}
                                        className="group bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-md transition-all flex flex-col md:flex-row gap-6 relative overflow-hidden"
                                    >
                                        {/* Decorative Gradient */}
                                        <div className={cn("absolute left-0 top-0 bottom-0 w-1.5 bg-gradient-to-b", event.image.startsWith('data:') ? 'from-blue-500 to-indigo-500' : event.image)} />

                                        {/* Date Badge */}
                                        <div className="flex md:flex-col items-center justify-center gap-1 md:gap-0 bg-slate-50 dark:bg-slate-800 rounded-xl p-4 min-w-[80px] text-center">
                                            <span className="text-2xl font-bold text-slate-900 dark:text-white">{event.date.split(' ')[0]}</span>
                                            <span className="text-sm font-medium text-slate-500 dark:text-slate-400 uppercase">{event.date.split(' ')[1]}</span>
                                        </div>

                                        {/* Content */}
                                        <div className="flex-1">
                                            <div className="flex justify-between items-start">
                                                <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                                    {event.title}
                                                </h3>
                                                <span className={cn(
                                                    "px-2.5 py-1 rounded-full text-xs font-medium border",
                                                    event.status === 'Upcoming'
                                                        ? "bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-800"
                                                        : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700"
                                                )}>
                                                    {event.status}
                                                </span>
                                            </div>

                                            <div className="flex flex-wrap items-center gap-4 mt-3 text-sm text-slate-500 dark:text-slate-400">
                                                <div className="flex items-center gap-1.5">
                                                    <Clock size={16} className="text-slate-400 dark:text-slate-500" />
                                                    {event.time}
                                                </div>
                                                <div className="flex items-center gap-1.5">
                                                    <MapPin size={16} className="text-slate-400 dark:text-slate-500" />
                                                    {event.location}
                                                </div>
                                                <div className="flex items-center gap-1.5">
                                                    <Users size={16} className="text-slate-400 dark:text-slate-500" />
                                                    {event.attendees}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Action */}
                                        <div className="flex items-center md:items-end justify-end gap-2">
                                            <button
                                                onClick={() => confirmDelete(event.id)}
                                                className="px-3 py-2 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 font-medium text-sm hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                            <Link
                                                href={`/event/${event.id}`}
                                                className="px-4 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-medium text-sm hover:bg-blue-50 dark:hover:bg-blue-900/30 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                                            >
                                                Detail
                                            </Link>
                                        </div>
                                    </motion.div>
                                ))
                            ) : (
                                <div className="text-center py-12 text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800">
                                    <p>Tidak ada event untuk kategori ini.</p>
                                </div>
                            )}
                        </motion.div>
                    )}
                </div>

                {/* Right Column: Mini Calendar & Highlights */}
                <div className="space-y-6">
                    <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="font-bold text-slate-900 dark:text-white">Kalender</h3>
                            <div className="flex gap-2">
                                <button className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg dark:text-slate-400"><ChevronLeft size={16} /></button>
                                <span className="text-sm font-medium dark:text-slate-200">
                                    {new Date().toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })}
                                </span>
                                <button className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg dark:text-slate-400"><ChevronRight size={16} /></button>
                            </div>
                        </div>

                        {/* Calendar Grid */}
                        <div className="grid grid-cols-7 gap-1 text-center text-sm mb-2">
                            {['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'].map(d => (
                                <div key={d} className="text-slate-400 dark:text-slate-500 py-1 text-xs font-semibold">{d}</div>
                            ))}
                        </div>
                        <div className="grid grid-cols-7 gap-1 text-center text-sm font-medium">
                            {/* Empty cells for start of month - simplified for now assuming start on Wed/Thu */}
                            {[...Array(new Date(new Date().getFullYear(), new Date().getMonth(), 1).getDay())].map((_, i) => (
                                <div key={`empty-${i}`} />
                            ))}

                            {/* Days of current month */}
                            {[...Array(new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).getDate())].map((_, i) => {
                                const day = i + 1
                                const today = new Date().getDate()
                                const isToday = day === today

                                return (
                                    <button
                                        key={day}
                                        className={cn(
                                            "w-8 h-8 flex items-center justify-center rounded-full mx-auto transition-colors text-sm",
                                            isToday
                                                ? "bg-blue-600 text-white shadow-lg shadow-blue-500/30"
                                                : "hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300"
                                        )}
                                    >
                                        {day}
                                    </button>
                                )
                            })}
                        </div>
                    </div>

                    {(() => {
                        const getHighlightEvent = () => {
                            if (events.length === 0) return null

                            // Find events that are in the future
                            const today = new Date()
                            today.setHours(0, 0, 0, 0)

                            const upcomingEvents = events.filter(e => {
                                // Parse date "DD MMM YYYY"
                                const parts = e.date.split(' ')
                                if (parts.length < 3) return false
                                const eventDate = new Date(`${parts[1]} ${parts[0]}, ${parts[2]}`)
                                return eventDate >= today
                            }).sort((a, b) => {
                                const partsA = a.date.split(' ')
                                const dateA = new Date(`${partsA[1]} ${partsA[0]}, ${partsA[2]}`)
                                const partsB = b.date.split(' ')
                                const dateB = new Date(`${partsB[1]} ${partsB[0]}, ${partsB[2]}`)
                                return dateA.getTime() - dateB.getTime()
                            })

                            return upcomingEvents.length > 0 ? upcomingEvents[0] : events[0]
                        }

                        const highlightEvent = getHighlightEvent()

                        if (!highlightEvent) return null

                        return (
                            <div className="bg-gradient-to-br from-indigo-600 to-purple-700 p-6 rounded-2xl text-white shadow-xl">
                                <h3 className="font-bold text-lg mb-2">Event Highlight</h3>
                                <p className="text-indigo-100 text-sm mb-4">Jangan lewatkan event seru terdekat di Jepara!</p>

                                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 mb-4 border border-white/20">
                                    <div className="font-bold text-lg">{highlightEvent.title}</div>
                                    <div className="text-indigo-200 text-sm mt-1">{highlightEvent.date} • {highlightEvent.location}</div>
                                </div>

                                <Link
                                    href={`/event/${highlightEvent.id}`}
                                    className="block w-full text-center py-2.5 bg-white text-indigo-600 rounded-xl font-bold text-sm hover:bg-indigo-50 transition-colors"
                                >
                                    Lihat Selengkapnya
                                </Link>
                            </div>
                        )
                    })()}
                </div>
            </div>
        </div>
    )
}
