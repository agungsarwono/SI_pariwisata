import { create } from 'zustand'

interface UIState {
    sidebarOpen: boolean
    isCollapsed: boolean
    toggleSidebar: () => void
    closeSidebar: () => void
    openSidebar: () => void
    toggleCollapse: () => void
    setCollapsed: (value: boolean) => void
}

export const useUIStore = create<UIState>((set) => ({
    sidebarOpen: false,
    isCollapsed: false,
    toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
    closeSidebar: () => set({ sidebarOpen: false }),
    openSidebar: () => set({ sidebarOpen: true }),
    toggleCollapse: () => set((state) => ({ isCollapsed: !state.isCollapsed })),
    setCollapsed: (value) => set({ isCollapsed: value }),
}))
