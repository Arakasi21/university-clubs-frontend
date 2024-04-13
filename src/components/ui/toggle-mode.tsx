'use client'

import { useTheme } from 'next-themes'
import React, { useEffect, useState } from 'react'

import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { MoonIcon } from 'lucide-react'

export function ModeToggle() {
	const { theme, setTheme } = useTheme()
	const [isDarkMode, setIsDarkMode] = useState(theme === 'dark')

	useEffect(() => {
		setIsDarkMode(theme === 'dark')
	}, [theme])

	const handleToggle = (newCheckedState: boolean) => {
		const newTheme = newCheckedState ? 'dark' : 'light'
		setTheme(newTheme)
	}

	return (
		<div className="flex w-full items-center justify-between">
			<div className="flex flex-row items-center space-x-4">
				<MoonIcon />
				<Label htmlFor="theme-mode">Dark Mode</Label>
			</div>

			<Switch id="theme-mode" checked={isDarkMode} onCheckedChange={handleToggle} />
		</div>
	)
}
