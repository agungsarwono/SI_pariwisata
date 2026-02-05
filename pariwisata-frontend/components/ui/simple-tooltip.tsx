"use client"

import React, { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"

interface SimpleTooltipProps {
    children: React.ReactNode
    content: string
    side?: "right" | "top" | "bottom" | "left"
}

export function SimpleTooltip({ children, content, side = "right" }: SimpleTooltipProps) {
    const [isVisible, setIsVisible] = useState(false)

    return (
        <div
            className="relative flex items-center"
            onMouseEnter={() => setIsVisible(true)}
            onMouseLeave={() => setIsVisible(false)}
        >
            {children}
            <AnimatePresence>
                {isVisible && (
                    <motion.div
                        initial={{ opacity: 0, x: side === "right" ? -10 : 0, scale: 0.9 }}
                        animate={{ opacity: 1, x: 0, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{ duration: 0.15 }}
                        className={`absolute z-50 px-2 py-1 text-xs font-medium text-white bg-slate-900 rounded-md whitespace-nowrap shadow-xl
              ${side === "right" ? "left-full ml-2" : ""}
              ${side === "left" ? "right-full mr-2" : ""}
              ${side === "top" ? "bottom-full mb-2 left-1/2 -translate-x-1/2" : ""}
              ${side === "bottom" ? "top-full mt-2 left-1/2 -translate-x-1/2" : ""}
            `}
                    >
                        {content}
                        <div
                            className={`absolute w-0 h-0 border-[4px] border-transparent
                    ${side === "right" ? "border-r-slate-900 right-full top-1/2 -translate-y-1/2" : ""}
                    ${side === "left" ? "border-l-slate-900 left-full top-1/2 -translate-y-1/2" : ""}
                    ${side === "top" ? "border-t-slate-900 top-full left-1/2 -translate-x-1/2" : ""}
                    ${side === "bottom" ? "border-b-slate-900 bottom-full left-1/2 -translate-x-1/2" : ""}
                `}
                        />
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}
