'use client'

import React from 'react'
import { Bell, Search, Menu, ChevronDown } from 'lucide-react'
import { motion } from 'framer-motion'
import { usePathname } from 'next/navigation'
import { useUIStore } from '@/lib/store'
import { CommandPalette } from '@/components/ui/command-palette'

export function Header() {
    const pathname = usePathname()
    const { toggleSidebar } = useUIStore()

    // Simple breadcrumb logic
    const breadcrumbs = pathname?.split('/').filter(Boolean) || []
    const [showPalette, setShowPalette] = React.useState(false)

    React.useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
                e.preventDefault()
                setShowPalette(true)
            }
        }
        window.addEventListener('keydown', handleKeyDown)
        return () => window.removeEventListener('keydown', handleKeyDown)
    }, [])

    return (
        <header className="h-[72px] sticky top-0 z-40 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 shadow-sm px-6 flex items-center justify-between">
            {/* Left Section: Mobile Menu & Breadcrumb */}
            <div className="flex items-center gap-4">
                <button
                    onClick={toggleSidebar}
                    className="md:hidden p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-600 dark:text-slate-400"
                >
                    <Menu size={24} />
                </button>

                <nav className="hidden md:flex items-center gap-2 text-sm">
                    <span className="text-slate-400 dark:text-slate-500">Home</span>
                    {breadcrumbs.map((crumb, index) => (
                        <React.Fragment key={crumb}>
                            <span className="text-slate-300 dark:text-slate-600">/</span>
                            <span className={`capitalize ${index === breadcrumbs.length - 1 ? 'font-medium text-slate-900 dark:text-slate-100' : 'text-slate-600 dark:text-slate-400'}`}>
                                {crumb}
                            </span>
                        </React.Fragment>
                    ))}
                </nav>
            </div>

            {/* Center Section: Search (Hidden on Mobile) */}
            <div className="hidden md:block flex-1 max-w-md mx-4">
                <button
                    onClick={() => setShowPalette(true)}
                    className="w-full relative group flex items-center"
                >
                    <Search className="absolute left-3 text-slate-400 dark:text-slate-500 group-hover:text-blue-500 dark:group-hover:text-blue-400 transition-colors" size={18} />
                    <div className="w-full pl-10 pr-4 py-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-white dark:hover:bg-slate-900 border border-transparent hover:border-blue-200 dark:hover:border-blue-800 rounded-xl transition-all text-sm text-left text-slate-400 max-w-full flex justify-between items-center group-hover:shadow-sm">
                        <span>Search...</span>
                        <div className="flex items-center gap-1">
                            <span className="text-[10px] font-bold bg-white dark:bg-slate-700 px-1.5 py-0.5 rounded border border-slate-200 dark:border-slate-600 text-slate-500 dark:text-slate-400">⌘</span>
                            <span className="text-[10px] font-bold bg-white dark:bg-slate-700 px-1.5 py-0.5 rounded border border-slate-200 dark:border-slate-600 text-slate-500 dark:text-slate-400">K</span>
                        </div>
                    </div>
                </button>
            </div>

            {/* Right Section: Profile & Actions */}
            <div className="flex items-center gap-4">
                <button className="p-2 text-slate-400 dark:text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-blue-600 dark:hover:text-blue-400 rounded-full transition-colors relative">
                    <Bell size={20} />
                    <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white dark:ring-slate-900"></span>
                </button>

                <div className="h-8 w-[1px] bg-slate-200 dark:bg-slate-800 mx-1"></div>

                <button className="flex items-center gap-3 pl-2 pr-1 py-1 rounded-full hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                    <div className="text-right hidden sm:block">
                        <p className="text-sm font-medium text-slate-900 dark:text-slate-100 leading-tight">Admin User</p>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">Super Admin</p>
                    </div>
                    <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-600 flex items-center justify-center text-white font-semibold shadow-lg shadow-blue-500/20">
                        AD
                    </div>
                    <ChevronDown size={16} className="text-slate-400 dark:text-slate-500" />
                </button>
            </div>

            <CommandPalette isOpen={showPalette} onClose={() => setShowPalette(false)} />
        </header >
    )
}
