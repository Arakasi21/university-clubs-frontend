'use client';
import Link from 'next/link';
import Image from "next/image";
import {ModeToggle} from "@/components/ui/toggle-mode";
import React, {useEffect, useState} from 'react';
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {Search} from "lucide-react";

/*function getCookie(name: string): string | null {
    const nameEQ = name + "=";
    const ca = document.cookie.split(';');
    for(let i=0;i < ca.length;i++) {
        let c = ca[i].trim();
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
}*/

export default function Nav() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        //todo: нужно по другому логику реализовать
        /*const token = getCookie("session_token")
        console.log(token)
        setIsAuthenticated(!!token);*/
    }, []);

    return (
        <header>
            <nav className="bg-white border-gray-200 dark:bg-gray-900">
                <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">

                    <Link href="../" className="flex items-center space-x-3 rtl:space-x-reverse">
                        <Image src="" className="h-8" alt=""/>
                        <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">UCMS AITU</span>
                    </Link>

                    <div className="flex md:order-2 space-x-3 md:space-x-0 rtl:space-x-reverse">

                        <Link href={"/sign-in"}>
                            <Button>
                                Log in
                            </Button>
                        </Link>

                    </div>


                    <div className="items-center justify-items-stretch hidden w-full md:flex max-w-xl md:order-1 " id="navbar-cta">
                        <div className="w-full max-w-[700px] flex items-center relative ">
                            <Search size={20} className=" absolute left-3  text-muted-foreground" />
                            <Input
                                className=" w-full pl-10 focus-visible:ring-blue-600 rounded-full"
                                placeholder="Search"
                            />
                        </div>

                    </div>
                </div>
            </nav>
        </header>
    );
}


