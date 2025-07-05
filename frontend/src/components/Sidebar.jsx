import { BellIcon, HomeIcon, Languages, UsersIcon } from 'lucide-react';
import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import useAuthUser from '../hooks/useAuthUser';

const Sidebar = () => {
    const { authUser } = useAuthUser();
    const location = useLocation();
    const currentPath = location.pathname;

    return (
        <aside className='w-64 bg-base-200 hidden lg:flex flex-col h-screen sticky top-0'>
            <div className='p-5'>
                <Link to={"/"} className='flex items-center justify-start gap-2'>
                    <Languages className="size-9 text-primary" />
                    <span className="text-3xl font-bold font-mono bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary tracking-wider">
                        Netnity
                    </span>
                </Link>
            </div>
            <nav className='flex flex-1 p-4 space-y-1 flex-col'>
                <Link to={"/"} className={`btn btn-ghost justify-start w-full gap-3 px-3 normal-case rounded-md ${currentPath === "/" && "btn-active"}`}>
                    <HomeIcon className="size-5 text-base-content opacity-70" />
                    <span>Home</span>
                </Link>
                <Link to={"/friends"} className={`btn btn-ghost justify-start w-full gap-3 px-3 normal-case rounded-md ${currentPath === "/friends" && "btn-active"}`}>
                    <UsersIcon className="size-5 text-base-content opacity-70" />
                    <span>Friends</span>
                </Link>
                <Link to={"/notifications"} className={`btn btn-ghost justify-start w-full gap-3 px-3 normal-case rounded-md ${currentPath === "/notifications" && "btn-active"}`}>
                    <BellIcon className="size-5 text-base-content opacity-70" />
                    <span>Notifications</span>
                </Link>
            </nav>

            <div className='p-4 flex items-center gap-3'>
                <div className='avatar w-9 h-9 rounded-full overflow-hidden gap-4 hover:shadow-md transition-shadow'>
                    <Link to={"/profile"} className='w-full h-full'>
                        <img src={authUser?.profilePic} alt="User Avatar" className='w-full object-cover h-full' rel="noreferrer" />
                    </Link>
                </div>
                <div className='flex-1' >
                    <Link to={"/profile"}>
                        <p className='font-semibold txet-sm text-base-content'>{authUser?.fullName}</p>
                        <p className='text-xs text-success flex items-center gap-1'>
                            <span className='size-2 rounded-full bg-success inline-block' />Online</p>
                    </Link>
                </div >
            </div >
        </aside >
    )
}

export default Sidebar