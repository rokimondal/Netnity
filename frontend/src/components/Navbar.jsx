import React from 'react'
import useAuthUser from '../hooks/useAuthUser';
import { Link, useLocation } from 'react-router-dom';
import { BellIcon, Languages, LogOutIcon } from 'lucide-react';
import useLogout from '../hooks/useLogout';
import ThemeSelector from './ThemeSelector';

const Navbar = () => {
    const { logoutMutation } = useLogout()
    const { authUser } = useAuthUser();
    const location = useLocation();
    const isChatPath = location.pathname?.startsWith("/chat");
    return (
        <nav className='bg-base-200 sticky top-0 z-30 h-16 flex items-center '>
            <div className='container mx-auto'>
                <div className='flex items-center w-full px-4 md:px-6'>
                    <div>
                        {isChatPath && <Link to={"/"} className='flex items-center justify-start gap-2'>
                            <Languages className="size-9 text-primary" />
                            <span className="text-3xl font-bold font-mono bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary tracking-wider">
                                Netnity
                            </span>
                        </Link>
                        }
                    </div>
                    <div className='flex items-center justify-center gap-4 md:gap-3 ml-auto'>
                        <Link to={"/notification"}>
                            <button className="btn btn-ghost btn-circle">
                                <BellIcon className="h-6 w-6 text-base-content opacity-70" />
                            </button>
                        </Link>
                        <ThemeSelector />
                        <div className='avatar w-9 h-9 rounded-full overflow-hidden gap-4 hover:shadow-md transition-shadow'>
                            <Link to={"/profile"} className='w-full h-full'>
                                <img src={authUser?.profilePic} alt="User Avatar" className='w-full object-cover h-full' rel="noreferrer" />
                            </Link>
                        </div>
                        <button className="btn btn-ghost btn-circle" onClick={logoutMutation}>
                            <LogOutIcon className="h-6 w-6 text-base-content opacity-70" />
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    )
}

export default Navbar