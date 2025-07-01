import React from 'react'
import Sidebar from './Sidebar'
import Navbar from './Navbar'

const Layout = ({ children, showSidebar = false }) => {
    return (
        <div className='min-h-screen'>
            <div className='flex'>
                {showSidebar && <Sidebar />}
                <div className='flex-1 flex flex-col'>
                    <Navbar />
                    <div className='flex-1 overflow-auto'>
                        {children}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Layout