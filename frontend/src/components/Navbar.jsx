import React, { useState } from 'react'
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
                        <div className="dropdown dropdown-end">
                            <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
                                <div className="w-9 h-9 rounded-full overflow-hidden">
                                    <img src={authUser?.profilePic} alt="profile" />
                                </div>
                            </div>
                            <ul
                                tabIndex={0}
                                className=" z-[1] shadow-xl menu menu-sm dropdown-content bg-base-200 rounded-box w-52"
                            >
                                <li>
                                    <Link to="/edit-profile" className="text-sm">Edit Profile</Link>
                                </li>
                                <li>
                                    <Link to="/forgot-password" className="text-sm">Forgot Password</Link>
                                </li>
                                <li>
                                    <button
                                        onClick={logoutMutation}
                                        className="text-error text-sm hover:text-error-content"
                                    >
                                        Logout
                                    </button>
                                </li>
                            </ul>
                        </div>

                    </div>
                </div>
            </div>
        </nav>
    )
}

export default Navbar