'use client'
import Link from 'next/link'
import {ModeToggle} from "@/components/ui/toggle-mode";
export default function Nav() {
    return (
        <header>
            <nav>
                <ul className="flex items-center justify-between">
                    <Link href="/pages">Testing</Link>
                    <li><ModeToggle/></li>
                </ul>
            </nav>
        </header>
    )
}
