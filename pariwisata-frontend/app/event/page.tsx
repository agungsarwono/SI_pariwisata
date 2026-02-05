'use client'

import React from 'react'
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
    ChevronRight
} from 'lucide-react'
import { cn } from '@/lib/utils'

// Mock Data
const events = [
    {
        id: 1,
        title: 'Pesta Lomban Kupat',
        date: '20 Apr 2026',
        time: '08:00 - 14:00',
        location: 'Pantai Kartini',
        category: 'Budaya',
        attendees: '12K+',
        status: 'Upcoming',
        image: 'from-blue-500 to-indigo-500'
    },
    {
        id: 2,
        title: 'Jepara Jazz Festival',
        date: '15 May 2026',
        time: '19:00 - 23:00',
        location: 'Alun-Alun Jepara',
        category: 'Musik',
        attendees: '5K+',
        status: 'Upcoming',
        image: 'from-purple-500 to-pink-500'
    },
    {
        id: 3,
        title: 'Festival Ukir Internasional',
        date: '10 Jun 2026',
        time: '09:00 - 17:00',
        location: 'Sentra Ukir Mulyoharjo',
        category: 'Pameran',
        attendees: '3K+',
        status: 'Upcoming',
        image: 'from-amber-500 to-orange-500'
    },
    {
        id: 4,
        title: 'Baratan Ratu Kalinyamat',
        date: '25 Mar 2026',
        time: '18:30 - 21:00',
        location: 'Kalinyamatan',
        category: 'Budaya',
        attendees: '8K+',
        status: 'Past',
        image: 'from-emerald-500 to-teal-500'
    },
    {
        id: 5,
        title: 'Karimunjawa Culture Night',
        date: '05 Jul 2026',
        time: '19:00 - 22:00',
        location: 'Karimunjawa',
        category: 'Budaya',
        attendees: '2K+',
        status: 'Upcoming',
        image: 'from-cyan-500 to-blue-500'
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
    hidden: { opacity: 0, x: -20 },
    show: { opacity: 1, x: 0 }
}

export default function EventPage() {
    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900">Event & Budaya</h1>
                    <p className="text-slate-500 mt-1">Jadwal acara pariwisata dan kebudayaan daerah.</p>
                </div>

                <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-medium text-sm shadow-lg shadow-blue-500/25">
                    <Plus size={18} />
                    Buat Event Baru
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: Event List */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Filters */}
                    <div className="flex items-center gap-3 overflow-x-auto pb-2">
                        <button className="px-4 py-2 rounded-full bg-slate-900 text-white text-sm font-medium whitespace-nowrap">
                            Semua Event
                        </button>
                        <button className="px-4 py-2 rounded-full bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 text-sm font-medium whitespace-nowrap">
                            Budaya
                        </button>
                        <button className="px-4 py-2 rounded-full bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 text-sm font-medium whitespace-nowrap">
                            Musik & Seni
                        </button>
                        <button className="px-4 py-2 rounded-full bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 text-sm font-medium whitespace-nowrap">
                            Pameran
                        </button>
                    </div>

                    <motion.div
                        variants={container}
                        initial="hidden"
                        animate="show"
                        className="space-y-4"
                    >
                        {events.map((event) => (
                            <motion.div
                                key={event.id}
                                variants={item}
                                className="group bg-white p-5 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all flex flex-col md:flex-row gap-6 relative overflow-hidden"
                            >
                                {/* Decorative Gradient */}
                                <div className={cn("absolute left-0 top-0 bottom-0 w-1.5 bg-gradient-to-b", event.image)} />

                                {/* Date Badge */}
                                <div className="flex md:flex-col items-center justify-center gap-1 md:gap-0 bg-slate-50 rounded-xl p-4 min-w-[80px] text-center">
                                    <span className="text-2xl font-bold text-slate-900">{event.date.split(' ')[0]}</span>
                                    <span className="text-sm font-medium text-slate-500 uppercase">{event.date.split(' ')[1]}</span>
                                </div>

                                {/* Content */}
                                <div className="flex-1">
                                    <div className="flex justify-between items-start">
                                        <h3 className="text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                                            {event.title}
                                        </h3>
                                        <span className={cn(
                                            "px-2.5 py-1 rounded-full text-xs font-medium border",
                                            event.status === 'Upcoming'
                                                ? "bg-blue-50 text-blue-700 border-blue-200"
                                                : "bg-slate-100 text-slate-600 border-slate-200"
                                        )}>
                                            {event.status}
                                        </span>
                                    </div>

                                    <div className="flex flex-wrap items-center gap-4 mt-3 text-sm text-slate-500">
                                        <div className="flex items-center gap-1.5">
                                            <Clock size={16} className="text-slate-400" />
                                            {event.time}
                                        </div>
                                        <div className="flex items-center gap-1.5">
                                            <MapPin size={16} className="text-slate-400" />
                                            {event.location}
                                        </div>
                                        <div className="flex items-center gap-1.5">
                                            <Users size={16} className="text-slate-400" />
                                            {event.attendees}
                                        </div>
                                    </div>
                                </div>

                                {/* Action */}
                                <div className="flex items-center md:items-end justify-end">
                                    <button className="px-4 py-2 rounded-lg bg-slate-50 text-slate-600 font-medium text-sm hover:bg-blue-50 hover:text-blue-600 transition-colors">
                                        Detail
                                    </button>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>

                {/* Right Column: Mini Calendar & Highlights */}
                <div className="space-y-6">
                    <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="font-bold text-slate-900">Kalender</h3>
                            <div className="flex gap-2">
                                <button className="p-1 hover:bg-slate-100 rounded-lg"><ChevronLeft size={16} /></button>
                                <span className="text-sm font-medium">April 2026</span>
                                <button className="p-1 hover:bg-slate-100 rounded-lg"><ChevronRight size={16} /></button>
                            </div>
                        </div>

                        {/* Simple Calendar Grid Simulation */}
                        <div className="grid grid-cols-7 gap-1 text-center text-sm mb-2">
                            {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(d => (
                                <div key={d} className="text-slate-400 py-1">{d}</div>
                            ))}
                        </div>
                        <div className="grid grid-cols-7 gap-1 text-center text-sm font-medium">
                            {[...Array(30)].map((_, i) => {
                                const day = i + 1
                                const hasEvent = [20, 25].includes(day)
                                return (
                                    <div
                                        key={day}
                                        className={cn(
                                            "w-8 h-8 flex items-center justify-center rounded-full mx-auto cursor-pointer transition-colors",
                                            day === 20
                                                ? "bg-blue-600 text-white shadow-lg shadow-blue-500/30"
                                                : "hover:bg-slate-100 text-slate-700"
                                        )}
                                    >
                                        {day}
                                        {hasEvent && day !== 20 && (
                                            <div className="absolute w-1 h-1 bg-red-500 rounded-full translate-y-3" />
                                        )}
                                    </div>
                                )
                            })}
                        </div>
                    </div>

                    <div className="bg-gradient-to-br from-indigo-600 to-purple-700 p-6 rounded-2xl text-white shadow-xl">
                        <h3 className="font-bold text-lg mb-2">Event Highlight</h3>
                        <p className="text-indigo-100 text-sm mb-4">Jangan lewatkan festival terbesar tahun ini di Jepara!</p>

                        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 mb-4 border border-white/20">
                            <div className="font-bold text-lg">Jepara Jazz Festival</div>
                            <div className="text-indigo-200 text-sm mt-1">15 Mei 2026 • Alun-alun</div>
                        </div>

                        <button className="w-full py-2.5 bg-white text-indigo-600 rounded-xl font-bold text-sm hover:bg-indigo-50 transition-colors">
                            Lihat Selengkapnya
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
