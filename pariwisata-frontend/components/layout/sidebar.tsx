'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion } from 'framer-motion'
import {
    LayoutDashboard,
    MapPin,
    FileText,
    Sparkles,
    Settings,
    ChevronLeft,
    ChevronRight
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useUIStore } from '@/lib/store'
import { AnimatePresence } from 'framer-motion'
import { SimpleTooltip } from '@/components/ui/simple-tooltip'

const menuItems = [
    {
        icon: LayoutDashboard,
        label: 'Dashboard',
        href: '/dashboard',
        color: '#3b82f6' // blue
    },
    {
        icon: MapPin,
        label: 'Kelola Destinasi',
        href: '/destinasi',
        color: '#10b981' // green
    },
    {
        icon: FileText,
        label: 'Kelola Laporan',
        href: '/laporan',
        color: '#f59e0b' // amber
    },
    {
        icon: Sparkles,
        label: 'Event & Budaya',
        href: '/event',
        color: '#ec4899' // pink
    },
    {
        icon: Settings,
        label: 'Pengaturan',
        href: '/pengaturan',
        color: '#8b5cf6' // purple
    }
]

export function Sidebar() {
    const pathname = usePathname()
    const { sidebarOpen, closeSidebar, isCollapsed, toggleCollapse, setCollapsed } = useUIStore()
    const [isMobile, setIsMobile] = React.useState(false)

    // Handle Resize
    React.useEffect(() => {
        const checkMobile = () => {
            const mobile = window.innerWidth < 768
            setIsMobile(mobile)
            if (mobile) {
                setCollapsed(false) // Always expanded on mobile drawer
            }
        }
        checkMobile()
        window.addEventListener('resize', checkMobile)
        return () => window.removeEventListener('resize', checkMobile)
    }, [setCollapsed])

    // Automatically close sidebar when route changes
    React.useEffect(() => {
        if (isMobile) {
            closeSidebar()
        }
    }, [pathname, closeSidebar, isMobile])

    const sidebarWidth = isCollapsed ? 80 : 280

    return (
        <>
            {/* Mobile Backdrop */}
            <AnimatePresence>
                {sidebarOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={closeSidebar}
                        className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 md:hidden"
                    />
                )}
            </AnimatePresence>

            {/* Sidebar Container */}
            <motion.aside
                initial={false}
                animate={{
                    width: isMobile ? 280 : sidebarWidth,
                    x: isMobile ? (sidebarOpen ? 0 : -280) : 0,
                }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className={cn(
                    "fixed left-0 top-0 h-screen flex-col bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white z-[50] shadow-sm",
                    "md:translate-x-0 md:flex",
                    isMobile ? "shadow-2xl" : ""
                )}
            >
                {/* Header Section */}
                <div className={cn("p-6 flex items-center h-[80px]", isCollapsed ? "justify-center px-0" : "justify-between")}>
                    <motion.div
                        className="flex items-center gap-3 overflow-hidden whitespace-nowrap"
                    >
                        <div className="w-8 h-8 min-w-8 min-h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold">
                            SJ
                        </div>
                        {!isCollapsed && (
                            <motion.h1
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400"
                            >
                                SID-Jepara
                            </motion.h1>
                        )}
                    </motion.div>
                </div>

                {/* Navigation Links */}
                <nav className={cn("flex-1 px-3 space-y-2 py-4 overflow-y-auto overflow-x-hidden")}>
                    {menuItems.map((item, index) => {
                        const isActive = pathname === item.href || pathname?.startsWith(item.href + '/')

                        const LinkContent = (
                            <div
                                className={cn(
                                    "relative flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 group cursor-pointer",
                                    isActive
                                        ? "bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400"
                                        : "text-slate-500 hover:bg-slate-50 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-200",
                                    isCollapsed ? "justify-center" : ""
                                )}
                            >
                                <item.icon
                                    size={22}
                                    className={cn(
                                        "transition-colors duration-200",
                                        isActive ? "text-blue-600 dark:text-blue-400" : "text-slate-400 group-hover:text-slate-600 dark:text-slate-500 dark:group-hover:text-slate-300"
                                    )}
                                />

                                {!isCollapsed && (
                                    <motion.span
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="font-medium text-[15px] whitespace-nowrap"
                                    >
                                        {item.label}
                                    </motion.span>
                                )}

                                {isCollapsed && isActive && (
                                    <div className="absolute right-1 top-1 w-2 h-2 rounded-full bg-blue-600 dark:bg-blue-500" />
                                )}
                            </div>
                        )

                        return (
                            <Link key={item.href} href={item.href} className="block">
                                {isCollapsed ? (
                                    <SimpleTooltip content={item.label} side="right">
                                        {LinkContent}
                                    </SimpleTooltip>
                                ) : (
                                    LinkContent
                                )}
                            </Link>
                        )
                    })}
                </nav>

                {/* Footer / Toggle Section */}
                <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
                    <button
                        onClick={toggleCollapse}
                        className={cn(
                            "hidden md:flex items-center justify-center w-full p-2 rounded-lg text-slate-400 hover:bg-white hover:shadow-sm hover:text-slate-600 dark:hover:bg-slate-800 dark:hover:text-slate-300 transition-all",
                            isCollapsed ? "" : "ml-auto w-8 h-8 p-0"
                        )}
                    >
                        {isCollapsed ? (
                            <ChevronRight size={20} />
                        ) : (
                            <ChevronLeft size={20} />
                        )}
                    </button>

                    <div className={cn("flex items-center gap-3 mt-4", isCollapsed ? "justify-center" : "")}>
                        <div className="w-9 h-9 min-w-[36px] rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center font-bold text-slate-600 dark:text-slate-300 text-sm">
                            AD
                        </div>
                        {!isCollapsed && (
                            <div className="overflow-hidden">
                                <p className="text-sm font-semibold text-slate-700 dark:text-slate-200 truncate">Admin</p>
                                <p className="text-xs text-slate-400 dark:text-slate-500 truncate">admin@jepara.go.id</p>
                            </div>
                        )}
                    </div>
                </div>
            </motion.aside>
        </>
    )
}
