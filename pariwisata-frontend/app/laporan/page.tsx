'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import {
    FileText,
    Download,
    Calendar,
    Filter,
    Search,
    ChevronDown,
    MoreHorizontal,
    CheckCircle,
    Clock,
    AlertCircle
} from 'lucide-react'
import { cn } from '@/lib/utils'

// Mock Data
const reports = [
    {
        id: 'RPT-001',
        title: 'Laporan Kunjunguan Bulanan - Januari 2026',
        category: 'Statistik',
        date: '31 Jan 2026',
        author: 'Adi Nugroho',
        status: 'Published',
        size: '2.4 MB'
    },
    {
        id: 'RPT-002',
        title: 'Evaluasi Kebersihan Pantai Kartini',
        category: 'Operasional',
        date: '28 Jan 2026',
        author: 'Siti Aminah',
        status: 'Review',
        size: '1.2 MB'
    },
    {
        id: 'RPT-003',
        title: 'Audit Keuangan Tiket Masuk Q4 2025',
        category: 'Keuangan',
        date: '15 Jan 2026',
        author: 'Budi Santoso',
        status: 'Draft',
        size: '4.8 MB'
    },
    {
        id: 'RPT-004',
        title: 'Laporan Insiden Keamanan - Karimunjawa',
        category: 'Insiden',
        date: '12 Jan 2026',
        author: 'Security Team',
        status: 'Published',
        size: '850 KB'
    },
    {
        id: 'RPT-005',
        title: 'Proposal Pengembangan Fasilitas Museum',
        category: 'Perencanaan',
        date: '05 Jan 2026',
        author: 'Dinas Pariwisata',
        status: 'Review',
        size: '5.6 MB'
    },
    {
        id: 'RPT-006',
        title: 'Rekapitulasi Event Budaya 2025',
        category: 'Event',
        date: '02 Jan 2026',
        author: 'Event Organizer',
        status: 'Published',
        size: '3.1 MB'
    }
]

const container = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.05
        }
    }
}

const item = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0 }
}

export default function LaporanPage() {
    const [filterStatus, setFilterStatus] = useState('All')

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900">Kelola Laporan</h1>
                    <p className="text-slate-500 mt-1">Arsip dan manajemen dokumen laporan pariwisata.</p>
                </div>

                <div className="flex items-center gap-3">
                    <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-xl hover:bg-slate-50 transition-colors font-medium text-sm">
                        <Calendar size={16} />
                        Jan 2026
                        <ChevronDown size={14} className="text-slate-400" />
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-medium text-sm shadow-lg shadow-blue-500/25">
                        <FileText size={18} />
                        Buat Laporan Baru
                    </button>
                </div>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
                    <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
                        <FileText size={24} />
                    </div>
                    <div>
                        <p className="text-sm text-slate-500 font-medium">Total Laporan</p>
                        <h3 className="text-2xl font-bold text-slate-900">142 Dokumen</h3>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
                    <div className="p-3 bg-green-50 text-green-600 rounded-xl">
                        <CheckCircle size={24} />
                    </div>
                    <div>
                        <p className="text-sm text-slate-500 font-medium">Terpublikasi</p>
                        <h3 className="text-2xl font-bold text-slate-900">128 Laporan</h3>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
                    <div className="p-3 bg-amber-50 text-amber-600 rounded-xl">
                        <Clock size={24} />
                    </div>
                    <div>
                        <p className="text-sm text-slate-500 font-medium">Menunggu Review</p>
                        <h3 className="text-2xl font-bold text-slate-900">14 Laporan</h3>
                    </div>
                </div>
            </div>

            {/* Filters & Table */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                {/* Table Toolbar */}
                <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="relative max-w-sm w-full">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input
                            type="text"
                            placeholder="Cari judul laporan..."
                            className="w-full pl-10 pr-4 py-2 bg-slate-50 border-transparent rounded-lg focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all outline-none text-sm"
                        />
                    </div>

                    <div className="flex items-center gap-2">
                        <div className="flex items-center bg-slate-100 rounded-lg p-1">
                            {['All', 'Published', 'Draft'].map((status) => (
                                <button
                                    key={status}
                                    onClick={() => setFilterStatus(status)}
                                    className={cn(
                                        "px-3 py-1.5 text-xs font-medium rounded-md transition-all",
                                        filterStatus === status
                                            ? "bg-white text-slate-900 shadow-sm"
                                            : "text-slate-500 hover:text-slate-700"
                                    )}
                                >
                                    {status}
                                </button>
                            ))}
                        </div>
                        <button className="p-2 text-slate-500 hover:bg-slate-50 hover:text-slate-900 rounded-lg border border-transparent hover:border-slate-200 transition-all">
                            <Filter size={18} />
                        </button>
                        <button className="p-2 text-slate-500 hover:bg-slate-50 hover:text-slate-900 rounded-lg border border-transparent hover:border-slate-200 transition-all">
                            <Download size={18} />
                        </button>
                    </div>
                </div>

                {/* Table Content */}
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-slate-50 text-slate-500 font-medium">
                            <tr>
                                <th className="px-6 py-4">Judul Dokumen</th>
                                <th className="px-6 py-4">Kategori</th>
                                <th className="px-6 py-4">Tanggal dibuat</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4 text-right">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {reports.map((report) => (
                                <motion.tr
                                    key={report.id}
                                    initial="hidden"
                                    whileInView="show"
                                    viewport={{ once: true }}
                                    variants={item}
                                    className="hover:bg-slate-50 transition-colors group"
                                >
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                                                <FileText size={18} />
                                            </div>
                                            <div>
                                                <p className="font-medium text-slate-900">{report.title}</p>
                                                <p className="text-xs text-slate-500">{report.size} • Oleh {report.author}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 text-xs font-medium border border-slate-200">
                                            {report.category}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-slate-500">
                                        {report.date}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className={cn(
                                            "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border",
                                            report.status === 'Published' && "bg-green-50 text-green-700 border-green-200",
                                            report.status === 'Review' && "bg-amber-50 text-amber-700 border-amber-200",
                                            report.status === 'Draft' && "bg-slate-100 text-slate-600 border-slate-200",
                                        )}>
                                            {report.status === 'Published' && <CheckCircle size={12} />}
                                            {report.status === 'Review' && <AlertCircle size={12} />}
                                            {report.status === 'Draft' && <Clock size={12} />}
                                            {report.status}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                                            <MoreHorizontal size={18} />
                                        </button>
                                    </td>
                                </motion.tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-between text-sm text-slate-500">
                    <p>Showing <span className="font-medium text-slate-900">1-6</span> of <span className="font-medium text-slate-900">142</span> results</p>
                    <div className="flex gap-2">
                        <button className="px-3 py-1 border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-50">Previous</button>
                        <button className="px-3 py-1 border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-50">Next</button>
                    </div>
                </div>
            </div>
        </div>
    )
}
