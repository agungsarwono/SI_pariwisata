'use client'

import React, { useEffect, useState } from 'react'
import { ArrowLeft, Calendar, Clock, MapPin, Users, Tag } from 'lucide-react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { cn } from '@/lib/utils'

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
    description?: string
}

export default function EventDetailPage() {
    const params = useParams()
    const [event, setEvent] = useState<Event | null>(null)
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const fetchEvent = async () => {
            try {
                const res = await fetch(`http://localhost:4000/events/${params.id}`)
                if (res.ok) {
                    const data = await res.json()
                    setEvent(data)
                }
            } catch (error) {
                console.error('Failed to fetch event', error)
            } finally {
                setIsLoading(false)
            }
        }
        fetchEvent()
    }, [params.id])

    if (isLoading) return <div className="flex h-96 items-center justify-center">Loading...</div>
    if (!event) return <div className="flex h-96 items-center justify-center">Event not found</div>

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <Link
                href="/event"
                className="inline-flex items-center gap-2 text-slate-500 hover:text-blue-600 transition-colors"
            >
                <ArrowLeft size={20} />
                Kembali ke Event
            </Link>

            <div className="bg-white rounded-3xl overflow-hidden shadow-sm border border-slate-100">
                {/* Hero Image */}
                <div className={cn(
                    "h-64 md:h-96 w-full relative",
                    event.image.startsWith('data:') ? '' : `bg-gradient-to-r ${event.image}`
                )}>
                    {event.image.startsWith('data:') && (
                        <img
                            src={event.image}
                            alt={event.title}
                            className="w-full h-full object-cover"
                        />
                    )}
                    <div className="absolute inset-0 bg-black/20" />

                    <div className="absolute bottom-0 left-0 p-8 text-white">
                        <div className="inline-block px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-sm font-medium mb-3 border border-white/30">
                            {event.category}
                        </div>
                        <h1 className="text-3xl md:text-5xl font-bold mb-2">{event.title}</h1>
                        <div className="flex items-center gap-2 text-white/90">
                            <MapPin size={18} />
                            {event.location}
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className="p-8 grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="md:col-span-2 space-y-6">
                        <div>
                            <h2 className="text-xl font-bold text-slate-900 mb-3">Tentang Event</h2>
                            <p className="text-slate-600 leading-relaxed whitespace-pre-line">
                                {event.description || 'Tidak ada deskripsi untuk event ini.'}
                            </p>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div className="bg-slate-50 p-6 rounded-2xl space-y-4">
                            <h3 className="font-bold text-slate-900">Detail Waktu</h3>

                            <div className="flex items-start gap-3">
                                <div className="p-2 bg-white rounded-lg text-blue-600 shadow-sm">
                                    <Calendar size={20} />
                                </div>
                                <div>
                                    <div className="text-xs text-slate-500 uppercase font-semibold">Tanggal</div>
                                    <div className="font-medium text-slate-900">{event.date}</div>
                                </div>
                            </div>

                            <div className="flex items-start gap-3">
                                <div className="p-2 bg-white rounded-lg text-blue-600 shadow-sm">
                                    <Clock size={20} />
                                </div>
                                <div>
                                    <div className="text-xs text-slate-500 uppercase font-semibold">Waktu</div>
                                    <div className="font-medium text-slate-900">{event.time}</div>
                                </div>
                            </div>

                            <div className="flex items-start gap-3">
                                <div className="p-2 bg-white rounded-lg text-blue-600 shadow-sm">
                                    <Users size={20} />
                                </div>
                                <div>
                                    <div className="text-xs text-slate-500 uppercase font-semibold">Peserta</div>
                                    <div className="font-medium text-slate-900">{event.attendees} going</div>
                                </div>
                            </div>
                        </div>


                    </div>
                </div>
            </div>
        </div>
    )
}
