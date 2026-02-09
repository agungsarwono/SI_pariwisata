"use client"

import React, { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
    Search,
    X,
    Clock,
    FileText,
    Hash,
    User,
    CornerDownLeft,
    ArrowUp,
    ArrowDown
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useRouter } from "next/navigation"
import Fuse from "fuse.js"

interface CommandPaletteProps {
    isOpen: boolean
    onClose: () => void
}





export function CommandPalette({ isOpen, onClose }: CommandPaletteProps) {
    const [search, setSearch] = useState("")
    const [selectedIndex, setSelectedIndex] = useState(0)
    const [recentItems, setRecentItems] = useState([
        { id: 'r1', label: 'Neoma', type: 'recent' },
        { id: 'r2', label: 'Perspective', type: 'recent' },
        { id: 'r3', label: 'Neumorphism', type: 'recent' },
    ])
    const [fileItems, setFileItems] = useState<any[]>([])

    const [userItems, setUserItems] = useState([
        { id: 'u1', name: 'Filona Arbeloa', handle: '@fionaaae_', location: 'Bangkok, Thailand', avatar: 'bg-orange-200 text-orange-700' },
        { id: 'u2', name: 'Luka Filna', handle: '@lkfilna_', location: 'Manchester, UK', avatar: 'bg-blue-200 text-blue-700' },
        { id: 'u3', name: 'Filmora Noah', handle: '@filnoah_443', location: 'NYC, US', avatar: 'bg-green-200 text-green-700' },
    ])

    // Configurable state for filtered items
    const [filteredFiles, setFilteredFiles] = useState<any[]>([])
    const [filteredUsers, setFilteredUsers] = useState(userItems)
    const [isLoading, setIsLoading] = useState(false)

    const router = useRouter()

    // Fetch from Backend
    useEffect(() => {
        if (!isOpen) return // Only fetch when open

        const fetchDestinations = async () => {
            setIsLoading(true)
            try {
                // Fetch all initially (or based on search if you want server-side filtering strictly)
                // Here we fetch all to keep Fuse.js client-side fuzzy search fast
                const res = await fetch('http://localhost:4000/search')
                if (res.ok) {
                    const data = await res.json()
                    setFileItems(data)
                }
            } catch (error) {
                console.error("Failed to fetch search data", error)
            } finally {
                setIsLoading(false)
            }
        }
        fetchDestinations()
    }, [isOpen])

    const removeRecent = (e: React.MouseEvent, id: string) => {
        e.stopPropagation()
        setRecentItems(prev => prev.filter(item => item.id !== id))
    }

    const removeFile = (e: React.MouseEvent, id: string) => {
        e.stopPropagation()
        setFileItems(prev => prev.filter(item => item.id !== id))
    }

    const removeUser = (e: React.MouseEvent, id: string) => {
        e.stopPropagation()
        setUserItems(prev => prev.filter(item => item.id !== id))
    }

    // Fuzzy Search Effect
    useEffect(() => {
        // If searching, use Fuse
        if (search.trim()) {
            const fuseFileOptions = { keys: ['label', 'tags'], threshold: 0.4 }
            const fuseUserOptions = { keys: ['name', 'handle', 'location'], threshold: 0.4 }

            const fuseFiles = new Fuse(fileItems, fuseFileOptions)
            const fuseUsers = new Fuse(userItems, fuseUserOptions)

            setFilteredFiles(fuseFiles.search(search).map(r => r.item))
            setFilteredUsers(fuseUsers.search(search).map(r => r.item))
        } else {
            // If empty, show full list (or empty if you prefer)
            setFilteredFiles(fileItems)
            setFilteredUsers(userItems)
        }
    }, [search, fileItems, userItems])

    // Flatten all items for keyboard navigation (Dynamic based on search)
    const allItems = [
        ...(search === "" ? recentItems : []),
        ...filteredFiles,
        ...filteredUsers
    ]

    // Reset selection when opening or searching
    useEffect(() => {
        setSelectedIndex(0)
    }, [isOpen, search])

    // Keyboard Navigation
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (!isOpen) return

            if (e.key === 'ArrowDown') {
                e.preventDefault()
                setSelectedIndex(prev => (prev + 1) % allItems.length)
            } else if (e.key === 'ArrowUp') {
                e.preventDefault()
                setSelectedIndex(prev => (prev - 1 + allItems.length) % allItems.length)
            } else if (e.key === 'Enter') {
                e.preventDefault()
                const item = allItems[selectedIndex]
                if (item) {
                    handleSelect(item)
                }
            } else if (e.key === 'Escape') {
                e.preventDefault()
                onClose()
            }
        }

        window.addEventListener('keydown', handleKeyDown)
        return () => window.removeEventListener('keydown', handleKeyDown)
    }, [isOpen, selectedIndex, allItems, onClose])

    const handleSelect = (item: any) => {
        console.log("Selected:", item)

        // Add to history logic
        const newItem = {
            id: `history-${item.id}-${Date.now()}`,
            label: item.label || item.name,
            type: 'recent',
            href: item.href
        }

        // Avoid duplicates by label/name
        setRecentItems(prev => {
            const filtered = prev.filter(p => p.label !== newItem.label)
            return [newItem, ...filtered].slice(0, 5)
        })

        onClose()
        if (item.href) {
            router.push(item.href)
        }
    }

    if (!isOpen) return null

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-[9999]"
                    />

                    {/* Palette Container */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: -20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: -20 }}
                        transition={{ duration: 0.2 }}
                        className="fixed top-[15%] left-1/2 -translate-x-1/2 w-full max-w-2xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl z-[10000] overflow-hidden flex flex-col border border-slate-100 dark:border-slate-800"
                    >
                        {/* Header / Input */}
                        <div className="flex items-center px-4 py-4 border-b border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900">
                            <Search className="text-slate-400 mr-3" size={20} />
                            <input
                                autoFocus
                                type="text"
                                placeholder={isLoading ? "Loading data..." : "Search for files, users, and more..."}
                                className="flex-1 bg-transparent outline-none text-lg text-slate-700 dark:text-slate-200 placeholder:text-slate-400 dark:placeholder:text-slate-500"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                            <div className="flex items-center gap-2">
                                <span className="text-xs font-medium text-slate-400 dark:text-slate-500 border border-slate-200 dark:border-slate-700 rounded px-1.5 py-0.5">⌘ + K</span>
                                <button onClick={onClose} className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md transition-colors text-slate-400 dark:text-slate-500">
                                    <X size={18} />
                                </button>
                            </div>
                        </div>

                        {/* Content */}
                        <div className="overflow-y-auto max-h-[60vh] p-2 custom-scrollbar">

                            {/* Recent Search (Only show if no search term) */}
                            {search === "" && (
                                <div className="mb-4">
                                    <h4 className="text-xs font-semibold text-slate-400 dark:text-slate-500 px-3 py-2">Recent Search</h4>
                                    {recentItems.map((item, index) => {
                                        const globalIndex = index
                                        const isSelected = selectedIndex === globalIndex
                                        return (
                                            <div
                                                key={item.id}
                                                onClick={() => handleSelect(item)}
                                                className={cn(
                                                    "flex items-center justify-between px-3 py-2.5 rounded-xl cursor-pointer transition-colors group",
                                                    isSelected ? "bg-slate-100 dark:bg-slate-800" : "hover:bg-slate-50 dark:hover:bg-slate-800/50"
                                                )}
                                            >
                                                <div className="flex items-center">
                                                    <Clock size={16} className="text-slate-400 dark:text-slate-500 mr-3" />
                                                    <span className="text-slate-700 dark:text-slate-300 font-medium">{item.label}</span>
                                                </div>
                                                <button
                                                    onClick={(e) => removeRecent(e, item.id)}
                                                    className="p-1 text-slate-400 dark:text-slate-500 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg opacity-0 group-hover:opacity-100 transition-all"
                                                >
                                                    <X size={14} />
                                                </button>
                                            </div>
                                        )
                                    })}
                                </div>
                            )}

                            {/* Files */}
                            <div className="mb-4">
                                <div className="flex items-center justify-between px-3 py-2">
                                    <h4 className="text-xs font-semibold text-slate-400 dark:text-slate-500">File</h4>
                                </div>
                                {filteredFiles.map((item, index) => {
                                    const globalIndex = (search === "" ? recentItems.length : 0) + index
                                    const isSelected = selectedIndex === globalIndex
                                    return (
                                        <div
                                            key={item.id}
                                            onClick={() => handleSelect(item)}
                                            className={cn(
                                                "flex items-center justify-between px-3 py-3 rounded-xl cursor-pointer transition-colors group",
                                                isSelected ? "bg-slate-100 dark:bg-slate-800" : "hover:bg-slate-50 dark:hover:bg-slate-800/50"
                                            )}
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className="p-2 bg-slate-100 dark:bg-slate-800 rounded-lg text-slate-500 dark:text-slate-400 group-hover:bg-white dark:group-hover:bg-slate-700 group-hover:shadow-sm transition-all">
                                                    <FileText size={18} />
                                                </div>
                                                <div>
                                                    <span className="text-slate-900 dark:text-slate-200 font-medium block">{item.label}</span>
                                                    <div className="flex gap-2 mt-1">
                                                        {item.tags?.map((tag: string) => (
                                                            <span key={tag} className="text-[10px] bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400 px-1.5 py-0.5 rounded flex items-center gap-1">
                                                                <Hash size={8} /> {tag}
                                                            </span>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-4">
                                                <div className="flex items-center -space-x-2">
                                                    {[...Array(item.users)].map((_, i) => (
                                                        <div key={i} className={`w-6 h-6 rounded-full border-2 border-white dark:border-slate-900 flex items-center justify-center text-[8px] font-bold text-white ${['bg-red-400', 'bg-blue-400', 'bg-amber-400'][i % 3]}`}>
                                                            {String.fromCharCode(65 + i)}
                                                        </div>
                                                    ))}
                                                    <span className="text-xs text-slate-400 dark:text-slate-500 ml-3">+{item.users} people</span>
                                                </div>
                                                <button
                                                    onClick={(e) => removeFile(e, item.id)}
                                                    className="p-1 text-slate-400 dark:text-slate-500 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg opacity-0 group-hover:opacity-100 transition-all"
                                                >
                                                    <X size={14} />
                                                </button>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>

                            {/* Users */}
                            <div className="mb-2">
                                <h4 className="text-xs font-semibold text-slate-400 dark:text-slate-500 px-3 py-2">User</h4>
                                {filteredUsers.map((item, index) => {
                                    const globalIndex = (search === "" ? recentItems.length : 0) + filteredFiles.length + index
                                    const isSelected = selectedIndex === globalIndex
                                    return (
                                        <div
                                            key={item.id}
                                            onClick={() => handleSelect(item)}
                                            className={cn(
                                                "flex items-center justify-between px-3 py-3 rounded-xl cursor-pointer transition-colors group",
                                                isSelected ? "bg-slate-100 dark:bg-slate-800" : "hover:bg-slate-50 dark:hover:bg-slate-800/50"
                                            )}
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className={cn("w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm", item.avatar)}>
                                                    {item.name.substring(0, 2).toUpperCase()}
                                                </div>
                                                <div>
                                                    <span className="text-slate-900 dark:text-slate-200 font-medium block">{item.name}</span>
                                                    <span className="text-xs text-blue-500 block">{item.handle}</span>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-4">
                                                <div className="flex items-center gap-2 text-slate-400 dark:text-slate-500 text-xs">
                                                    <MapPinIcon size={12} />
                                                    {item.location}
                                                </div>
                                                <button
                                                    onClick={(e) => removeUser(e, item.id)}
                                                    className="p-1 text-slate-400 dark:text-slate-500 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg opacity-0 group-hover:opacity-100 transition-all"
                                                >
                                                    <X size={14} />
                                                </button>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="px-4 py-3 bg-slate-50 dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                            <div className="flex items-center gap-4">
                                <div className="flex items-center gap-1">
                                    <span className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded px-1 py-0.5 shadow-sm"><CornerDownLeft size={10} /></span>
                                    <span>Enter</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <span className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded px-1 py-0.5 shadow-sm"><ArrowUp size={10} /></span>
                                    <span className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded px-1 py-0.5 shadow-sm"><ArrowDown size={10} /></span>
                                    <span>Select</span>
                                </div>
                            </div>
                            <div className="flex items-center gap-1">
                                <span className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded px-1 py-0.5 shadow-sm">Esc</span>
                                <span>Exit</span>
                            </div>
                        </div>

                    </motion.div>
                </>
            )}
        </AnimatePresence>
    )
}

function MapPinIcon({ size, className }: { size?: number, className?: string }) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={className}
        >
            <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
            <circle cx="12" cy="10" r="3" />
        </svg>
    )
}
