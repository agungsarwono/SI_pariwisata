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
    AlertCircle,
    Trash2
} from 'lucide-react'
import { cn } from '@/lib/utils'

// Mock Data
import { useRouter } from 'next/navigation'

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

import { Modal } from '@/components/ui/modal'

export default function LaporanPage() {
    const router = useRouter()
    const [filterStatus, setFilterStatus] = useState('All')
    const [reports, setReports] = useState<any[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [selectedReport, setSelectedReport] = useState<any>(null)

    // Fetch Reports
    const fetchReports = async () => {
        try {
            const res = await fetch('http://localhost:4000/laporan')
            if (res.ok) {
                const data = await res.json()
                setReports(data)
            }
        } catch (error) {
            console.error(error)
        } finally {
            setIsLoading(false)
        }
    }

    React.useEffect(() => {
        fetchReports()
    }, [])

    const handleDelete = async (id: string) => {
        if (!confirm('Hapus laporan ini?')) return
        try {
            await fetch(`http://localhost:4000/laporan/${id}`, { method: 'DELETE' })
            fetchReports()
        } catch (e) { console.error(e) }
    }

    const downloadFile = (report: any) => {
        if (!report.fileData) return

        // Create virtual link
        const link = document.createElement('a')
        link.href = report.fileData

        // Determine extension
        let extension = 'bin'
        if (report.fileData.startsWith('data:image/png')) extension = 'png'
        else if (report.fileData.startsWith('data:image/jpeg')) extension = 'jpg'
        else if (report.fileData.startsWith('data:application/pdf')) extension = 'pdf'
        else if (report.fileData.startsWith('data:application/vnd.openxmlformats-officedocument.wordprocessingml.document')) extension = 'docx'

        link.download = `${report.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.${extension}`
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
    }

    const [selectedMonth, setSelectedMonth] = useState('All Time')
    const [showMonthPicker, setShowMonthPicker] = useState(false)
    const [searchQuery, setSearchQuery] = useState('')

    // Filter Logic
    const filteredReports = reports.filter(r => {
        const matchesStatus = filterStatus === 'All' || r.status === filterStatus
        const matchesMonth = selectedMonth === 'All Time' || r.date.includes(selectedMonth)
        const matchesSearch = r.title.toLowerCase().includes(searchQuery.toLowerCase())
        return matchesStatus && matchesMonth && matchesSearch
    })

    // Pagination Logic
    const [currentPage, setCurrentPage] = useState(1)
    const itemsPerPage = 5
    const totalPages = Math.ceil(filteredReports.length / itemsPerPage)

    // Reset page when filter changes
    React.useEffect(() => {
        setCurrentPage(1)
    }, [filterStatus, selectedMonth, searchQuery])

    const paginatedReports = filteredReports.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    )

    if (isLoading) return <div className="flex h-96 items-center justify-center">Loading...</div>

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Kelola Laporan</h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-1">Arsip dan manajemen dokumen laporan pariwisata.</p>
                </div>

                <div className="flex items-center gap-3 relative">
                    <button
                        onClick={() => setShowMonthPicker(!showMonthPicker)}
                        className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors font-medium text-sm"
                    >
                        <Calendar size={16} />
                        {selectedMonth}
                        <ChevronDown size={14} className="text-slate-400" />
                    </button>

                    {showMonthPicker && (
                        <div className="absolute top-12 left-0 w-48 bg-white dark:bg-slate-900 rounded-xl shadow-xl border border-slate-100 dark:border-slate-800 py-1 z-20">
                            {['All Time', 'Jan 2026', 'Feb 2026', 'Dec 2025'].map((month) => (
                                <button
                                    key={month}
                                    onClick={() => {
                                        setSelectedMonth(month)
                                        setShowMonthPicker(false)
                                    }}
                                    className={cn(
                                        "w-full text-left px-4 py-2 text-sm hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors",
                                        selectedMonth === month ? "text-blue-600 dark:text-blue-400 font-medium bg-blue-50 dark:bg-blue-900/30" : "text-slate-600 dark:text-slate-300"
                                    )}
                                >
                                    {month}
                                </button>
                            ))}
                        </div>
                    )}
                    <button
                        onClick={() => router.push('/laporan/tambah')}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-medium text-sm shadow-lg shadow-blue-500/25"
                    >
                        <FileText size={18} />
                        Buat Laporan Baru
                    </button>
                </div>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm flex items-center gap-4">
                    <div className="p-3 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-xl">
                        <FileText size={24} />
                    </div>
                    <div>
                        <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">Total Laporan</p>
                        <h3 className="text-2xl font-bold text-slate-900 dark:text-white">142 Dokumen</h3>
                    </div>
                </div>
                <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm flex items-center gap-4">
                    <div className="p-3 bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-xl">
                        <CheckCircle size={24} />
                    </div>
                    <div>
                        <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">Terpublikasi</p>
                        <h3 className="text-2xl font-bold text-slate-900 dark:text-white">128 Laporan</h3>
                    </div>
                </div>
                <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm flex items-center gap-4">
                    <div className="p-3 bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 rounded-xl">
                        <Clock size={24} />
                    </div>
                    <div>
                        <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">Menunggu Review</p>
                        <h3 className="text-2xl font-bold text-slate-900 dark:text-white">14 Laporan</h3>
                    </div>
                </div>
            </div>

            {/* Filters & Table */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden">
                {/* Table Toolbar */}
                <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="relative max-w-sm w-full">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input
                            type="text"
                            placeholder="Cari judul laporan..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border-transparent rounded-lg focus:bg-white dark:focus:bg-slate-900 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all outline-none text-sm dark:text-white dark:placeholder-slate-400"
                        />
                    </div>

                    <div className="flex items-center gap-2">
                        <div className="flex items-center bg-slate-100 dark:bg-slate-800 rounded-lg p-1">
                            {['All', 'Published', 'Draft', 'Review'].map((status) => (
                                <button
                                    key={status}
                                    onClick={() => setFilterStatus(status)}
                                    className={cn(
                                        "px-3 py-1.5 text-xs font-medium rounded-md transition-all",
                                        filterStatus === status
                                            ? "bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm"
                                            : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
                                    )}
                                >
                                    {status}
                                </button>
                            ))}
                        </div>
                        <button className="p-2 text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-200 rounded-lg border border-transparent hover:border-slate-200 dark:hover:border-slate-700 transition-all">
                            <Filter size={18} />
                        </button>
                        <button className="p-2 text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-200 rounded-lg border border-transparent hover:border-slate-200 dark:hover:border-slate-700 transition-all">
                            <Download size={18} />
                        </button>
                    </div>
                </div>

                {/* Table Content */}
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 font-medium">
                            <tr>
                                <th className="px-6 py-4">Judul Dokumen</th>
                                <th className="px-6 py-4">Kategori</th>
                                <th className="px-6 py-4">Tanggal dibuat</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4 text-right">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                            {paginatedReports.map((report) => (
                                <motion.tr
                                    key={report.id}
                                    initial="hidden"
                                    whileInView="show"
                                    viewport={{ once: true }}
                                    variants={item}
                                    onClick={() => setSelectedReport(report)}
                                    className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group cursor-pointer"
                                >
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-lg">
                                                <FileText size={18} />
                                            </div>
                                            <div>
                                                <p className="font-medium text-slate-900 dark:text-slate-200">{report.title}</p>
                                                <p className="text-xs text-slate-500 dark:text-slate-400">{report.size} • Oleh {report.author}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-medium border border-slate-200 dark:border-slate-700">
                                            {report.category}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-slate-500 dark:text-slate-400">
                                        {report.date}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className={cn(
                                            "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border",
                                            report.status === 'Published' && "bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800",
                                            report.status === 'Review' && "bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800",
                                            report.status === 'Draft' && "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700",
                                        )}>
                                            {report.status === 'Published' && <CheckCircle size={12} />}
                                            {report.status === 'Review' && <AlertCircle size={12} />}
                                            {report.status === 'Draft' && <Clock size={12} />}
                                            {report.status}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            {/* Download Button */}
                                            {report.fileData && (
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation()
                                                        downloadFile(report)
                                                    }}
                                                    className="p-2 text-slate-400 dark:text-slate-500 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                                                    title="Download File"
                                                >
                                                    <Download size={18} />
                                                </button>
                                            )}

                                            <button className="p-2 text-slate-400 dark:text-slate-500 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors">
                                                <MoreHorizontal size={18} />
                                            </button>
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation()
                                                    handleDelete(report.id)
                                                }}
                                                className="p-2 text-slate-400 dark:text-slate-500 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </motion.tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="px-6 py-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-sm text-slate-500 dark:text-slate-400">
                    <p>Showing <span className="font-medium text-slate-900 dark:text-white">{(currentPage - 1) * itemsPerPage + 1}-{Math.min(currentPage * itemsPerPage, filteredReports.length)}</span> of <span className="font-medium text-slate-900 dark:text-white">{filteredReports.length}</span> results</p>
                    <div className="flex gap-2">
                        <button
                            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                            disabled={currentPage === 1}
                            className="px-3 py-1 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed dark:text-slate-300"
                        >
                            Previous
                        </button>
                        <button
                            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                            disabled={currentPage === totalPages}
                            className="px-3 py-1 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed dark:text-slate-300"
                        >
                            Next
                        </button>
                    </div>
                </div>
            </div>

            {/* Detail Modal */}
            <Modal
                isOpen={!!selectedReport}
                onClose={() => setSelectedReport(null)}
                title="Detail Dokumen"
                className="max-w-xl"
            >
                {selectedReport && (
                    <div className="space-y-6">
                        {/* Header Info */}
                        <div className="flex items-start gap-4">
                            <div className="p-3 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-xl shrink-0">
                                <FileText size={32} />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-slate-900 dark:text-white leading-tight mb-1">
                                    {selectedReport.title}
                                </h3>
                                <p className="text-sm text-slate-500 dark:text-slate-400">
                                    Diupload oleh <span className="font-medium text-slate-700 dark:text-slate-300">{selectedReport.author}</span> pada {selectedReport.date}
                                </p>
                            </div>
                        </div>

                        {/* Metadata Grid */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl space-y-1">
                                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium uppercase tracking-wider">Kategori</p>
                                <p className="font-semibold text-slate-900 dark:text-white">{selectedReport.category}</p>
                            </div>
                            <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl space-y-1">
                                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium uppercase tracking-wider">Ukuran File</p>
                                <p className="font-semibold text-slate-900 dark:text-white">{selectedReport.size}</p>
                            </div>
                            <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl space-y-1 col-span-2">
                                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium uppercase tracking-wider mb-2">Status Dokumen</p>
                                <div className={cn(
                                    "inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium border w-full",
                                    selectedReport.status === 'Published' && "bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800",
                                    selectedReport.status === 'Review' && "bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800",
                                    selectedReport.status === 'Draft' && "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700",
                                )}>
                                    {selectedReport.status === 'Published' && <CheckCircle size={16} />}
                                    {selectedReport.status === 'Review' && <AlertCircle size={16} />}
                                    {selectedReport.status === 'Draft' && <Clock size={16} />}
                                    {selectedReport.status}
                                </div>
                            </div>
                        </div>

                        {/* File Preview */}
                        {selectedReport.fileData && (
                            <div className="space-y-2">
                                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium uppercase tracking-wider">Preview File</p>
                                <div className="w-full rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden bg-slate-50 dark:bg-slate-800">
                                    {selectedReport.fileData.startsWith('data:image') ? (
                                        <img
                                            src={selectedReport.fileData}
                                            alt="Preview"
                                            className="w-full max-h-[300px] object-contain"
                                        />
                                    ) : selectedReport.fileData.startsWith('data:application/pdf') ? (
                                        <iframe
                                            src={selectedReport.fileData}
                                            className="w-full h-[300px]"
                                            title="PDF Preview"
                                        />
                                    ) : (
                                        <div className="h-32 flex flex-col items-center justify-center text-slate-400 dark:text-slate-500 gap-2">
                                            <FileText size={32} className="opacity-50" />
                                            <p className="text-sm">Preview tidak tersedia untuk format ini</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Actions */}
                        <div className="pt-2 flex gap-3">
                            <button
                                onClick={() => setSelectedReport(null)}
                                className="flex-1 py-2.5 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 font-medium rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                            >
                                Tutup
                            </button>
                            {selectedReport.fileData ? (
                                <button
                                    onClick={() => downloadFile(selectedReport)}
                                    className="flex-[2] flex items-center justify-center gap-2 py-2.5 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 shadow-lg shadow-blue-500/25 transition-colors"
                                >
                                    <Download size={18} />
                                    Download Dokumen
                                </button>
                            ) : (
                                <div className="flex-[2] py-2.5 bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 font-medium rounded-xl border border-slate-200 dark:border-slate-700 text-center cursor-not-allowed text-sm flex items-center justify-center gap-2">
                                    <AlertCircle size={16} />
                                    File Arsip Tidak Tersedia
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </Modal>
        </div >
    )
}
