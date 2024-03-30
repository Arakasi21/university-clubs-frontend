"use client"
import Link from 'next/link';
import Image from "next/image";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {Search} from "lucide-react";
import useUserStore from "@/store/user";
import DropdownForLoggedIn from '@/components/ui/dropdown_for_logged_in'


export default function Nav() {
    const { isLoggedIn, user, purgeUser } = useUserStore();


    const logOutHandle = async () => {
        await fetch('http://localhost:5000/auth/logout', {
            method: "POST",
            credentials: "include"
        }).then(() => {
            purgeUser();
        }).catch((error) => {
            console.log(error)
        })

    }

    return (
        <header>
            <nav className=" ">
                {/* <nav className="bg-white border-gray-200 dark:bg-gray-900 ">*/}
                <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-3">

                    <Link href="../" className="flex items-center space-x-3 rtl:space-x-reverse">
                        <Image src="" className="h-8" alt=""/>
                        <span
                            className="self-center text-xl font-semibold whitespace-nowrap dark:text-white">UCMS AITU</span>
                    </Link>


                    <div className="items-center justify-items-stretch hidden w-full md:flex max-w-xl md:order-1"
                         id="navbar-cta">
                        <div className="w-full max-w-[700px] flex items-center relative ">
                            <Search size={20} className=" absolute left-3  text-muted-foreground"/>
                            <Input
                                className=" w-full pl-10 focus-visible:ring-blue-600 rounded-full"
                                placeholder="Search"
                            />
                        </div>
                    </div>

                    <div className="flex md:order-2 space-x-3 md:space-x-0 rtl:space-x-reverse">

                        {isLoggedIn ? (
                            <DropdownForLoggedIn user={user!} logout={logOutHandle}/>
                        ) : (
                            <Link href={"/sign-in"}>
                                <Button>
                                    Log in
                                </Button>
                            </Link>
                        )}
                    </div>
                </div>
            </nav>
        </header>
    );
}


