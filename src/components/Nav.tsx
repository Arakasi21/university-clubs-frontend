'use client'
import Link from 'next/link'
import {ModeToggle} from "@/components/ui/toggle-mode"


export default function Nav() {
    return (
        <header>
            <nav>
                <ul className="flex justify-between">
                    <Link href="/pages">Testing</Link>
                    <Link href="/pages/loginpage">Login</Link>
                    <li className="right-4"><ModeToggle/></li>
                </ul>
            </nav>
        </header>
    )
}
