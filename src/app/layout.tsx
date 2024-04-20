'use client'
import { ThemeProvider } from '@/components/ThemeProvider'
import { Toaster as Sonner } from '@/components/ui/sonner'
import { Toaster } from '@/components/ui/toaster'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { SidebarContext } from '@/helpers/context'
import { useState } from 'react'

const inter = Inter({ subsets: ['latin'] })

// export const metadata: Metadata = {
// 	title: 'UCMS AITU',
// 	description: 'by students',
// }

export default function RootLayout({ children }: { children: React.ReactNode }) {
	const [expanded, setExpanded] = useState(false)
	return (
		<html lang="en">
			<body className={inter.className}>
				<ThemeProvider attribute="class" defaultTheme="system">
					<SidebarContext.Provider value={{ expanded, setExpanded }}>
						{children}
					</SidebarContext.Provider>
				</ThemeProvider>
				<Toaster />
				<Sonner />
			</body>
		</html>
	)
}
