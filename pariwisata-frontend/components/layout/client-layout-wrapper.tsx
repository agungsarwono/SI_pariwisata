"use client"

import React from "react"
import { useUIStore } from "@/lib/store"
import { cn } from "@/lib/utils"

export function ClientLayoutWrapper({ children }: { children: React.ReactNode }) {
    const { isCollapsed } = useUIStore()
    const [isMobile, setIsMobile] = React.useState(false) // Default to desktop logic for SSR hydration match if possible, or handle via effect

    // Handle Resize for logic consitency
    React.useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768)
        }
        checkMobile()
        window.addEventListener('resize', checkMobile)
        return () => window.removeEventListener('resize', checkMobile)
    }, [])

    return (
        <div
            className={cn(
                "flex-1 flex flex-col min-h-screen transition-all duration-300 ease-in-out",
                isMobile ? "pl-0" : (isCollapsed ? "pl-[80px]" : "pl-[280px]")
            )}
        >
            {children}
        </div>
    )
}
