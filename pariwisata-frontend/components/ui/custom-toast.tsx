"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Check, X, AlertCircle } from "lucide-react"

export interface ToastProps {
    message: string
    type?: "success" | "error" | "warning" | "info"
    duration?: number
    onClose: () => void
}

export function Toast({ message, type = "success", duration = 4000, onClose }: ToastProps) {
    const [progress, setProgress] = useState(100)

    // Auto dismiss logic
    useEffect(() => {
        const intervalTime = 100 // update every 100ms
        const step = 100 / (duration / intervalTime)

        const timer = setInterval(() => {
            setProgress((prev) => {
                if (prev <= 0) return 0
                return prev - step
            })
        }, intervalTime)

        return () => clearInterval(timer)
    }, [duration])

    // Close when progress hits 0
    useEffect(() => {
        if (progress <= 0) {
            onClose()
        }
    }, [progress, onClose])

    const variants = {
        hidden: { opacity: 0, y: -20, scale: 0.95 },
        visible: { opacity: 1, y: 0, scale: 1 },
        exit: { opacity: 0, scale: 0.9, transition: { duration: 0.2 } }
    }

    const iconMap = {
        success: <div className="w-5 h-5 rounded-full border border-green-500 flex items-center justify-center"><Check size={12} className="text-green-500" /></div>,
        error: <div className="w-5 h-5 rounded-full border border-red-500 flex items-center justify-center"><X size={12} className="text-red-500" /></div>,
        warning: <div className="w-5 h-5 rounded-full border border-amber-500 flex items-center justify-center"><AlertCircle size={12} className="text-amber-500" /></div>,
        info: <div className="w-5 h-5 rounded-full border border-blue-500 flex items-center justify-center"><AlertCircle size={12} className="text-blue-500" /></div>
    }

    return (
        <div className="fixed top-24 right-8 z-[99999]">
            <motion.div
                layout
                initial="hidden"
                animate="visible"
                exit="exit"
                variants={variants}
                className="bg-white dark:bg-slate-900 rounded-xl shadow-2xl border border-slate-100 dark:border-slate-800 p-4 min-w-[320px] relative overflow-hidden"
            >
                <div className="flex items-start gap-3">
                    {iconMap[type]}
                    <div className="flex-1">
                        <h4 className="text-sm font-semibold text-slate-800 dark:text-white">
                            {type === 'success' ? 'Changes saved' : type === 'error' ? 'Error' : 'Notification'}
                        </h4>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                            {message}
                        </p>
                        <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-2">
                            This message will close in {Math.ceil((progress / 100) * (duration / 1000))} seconds. <button onClick={onClose} className="text-slate-700 dark:text-slate-300 font-medium underline">Click to stop.</button>
                        </p>
                    </div>
                    <button onClick={onClose} className="text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300">
                        <X size={16} />
                    </button>
                </div>

                {/* Progress Bar */}
                <div className="absolute bottom-0 left-0 h-1 bg-slate-100 dark:bg-slate-800 w-full">
                    <motion.div
                        className={`h-full ${type === 'success' ? 'bg-green-500' : type === 'error' ? 'bg-red-500' : 'bg-blue-500'}`}
                        style={{ width: `${progress}%` }}
                    />
                </div>
            </motion.div>
        </div>
    )
}
