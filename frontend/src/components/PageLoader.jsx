import React from 'react'
import { useThemeStore } from '../store/useThemeStore'

const PageLoader = () => {
    const { theme } = useThemeStore();
    return (
        <div className="fixed inset-0 flex items-center justify-center bg-base-100 z-50 animate-fade-in-out transition-opacity duration-700" data-theme={theme}>
            <span className="loading loading-dots loading-2xl text-primary"></span>
        </div>
    )
}

export default PageLoader