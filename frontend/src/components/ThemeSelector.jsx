import { PaletteIcon } from 'lucide-react'
import React from 'react'
import { THEMES } from '../constants'
import { useThemeStore } from '../store/useThemeStore'

const ThemeSelector = () => {
    const { theme, setTheme } = useThemeStore();
    return (
        <div className='dropdown dropdown-end'>
            <button tabIndex={0} className='btn btn-ghost btn-circle'>
                <PaletteIcon className='size-5' />
            </button>
            <div tabIndex={0} className='dropdown-content mt-2 p-1 shadow-2xl bg-base-200 backdrop-blur-lg rounded-md w-56 max-h-80 overflow-y-auto'>
                <div className='space-y-1'>
                    {THEMES.map((themeOption) => (
                        <button key={themeOption.name} className={`w-full px-4 py-3 flex items-center gap-3 transition-colors rounded-md ${theme === themeOption.name ? "bg-primary/10 text-primary" : "hover:bg-base-content/10"}`} onClick={() => setTheme(themeOption.name)}>
                            <PaletteIcon className='size-5' />
                            <span className='text-sm font-medium'>{themeOption.label}</span>
                            <div className='ml-auto flex gap-1'>
                                {themeOption.colors.map((color, i) => (<span key={i} className='size-2 rounded-full' style={{ backgroundColor: color }} />))}
                            </div>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default ThemeSelector