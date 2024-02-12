'use client';
import Link from 'next/link';
import Image from "next/image";
import {ModeToggle} from "@/components/ui/toggle-mode";
import { Separator } from "@/components/ui/separator";
import React, { useState, useEffect } from 'react';

export default function Nav() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {

        const token = localStorage.getItem('sessionToken');
        setIsAuthenticated(!!token);
    }, []);

    return (
        <header>
            <nav className="bg-white border-gray-200 dark:bg-gray-900">
                <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
                    <Link href="../" className="flex items-center space-x-3 rtl:space-x-reverse">
                        <Image src="" className="h-8" alt=""/>
                        <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">UMS AITU</span>
                    </Link>
                    <div className="flex md:order-2 space-x-3 md:space-x-0 rtl:space-x-reverse">
                        <ModeToggle/>
                    </div>
                    <div className="items-center justify-between hidden w-full md:flex md:w-auto md:order-1" id="navbar-cta">
                        <ul className="flex flex-col font-medium p-4 md:p-0 mt-4 border border-gray-100 rounded-lg bg-gray-50 md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0 md:bg-white dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700">
                            <li>
                                <Link href="../">
                                    <p>Home</p>
                                </Link>
                            </li>
                            <li>
                                <Link href="/pages/upcoming">
                                    <p>Upcoming Events</p>
                                </Link>
                            </li>
                            {!isAuthenticated && (
                                <>
                                    <li>
                                        <Link href="/pages/loginpage">
                                            <p className="nav-link">Login</p>
                                        </Link>
                                    </li>
                                    <li>
                                        <Link href="/pages/signup">
                                            <p className="nav-link">Sign Up</p>
                                        </Link>
                                    </li>
                                </>
                            )}
                        </ul>
                    </div>
                </div>
            </nav>
        </header>
    );
}
