import React from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import Students from '@/app/admin-dashboard/dashboard/_components/Students'
import Clubs from '@/app/admin-dashboard/dashboard/_components/Clubs'
import Reports from '@/app/admin-dashboard/dashboard/_components/Reports'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function Events() {
	return (
		<div>
			<Tabs
				defaultValue="students"
				className="grid flex-1 items-start gap-4 p-4 sm:px-64 sm:py-8 md:gap-8"
			>
				<Button variant={`outline`}>
					<Link href="" className="w-full">
						Approve Event{' '}
					</Link>
				</Button>
				<TabsList className="grid w-full grid-cols-2">
					<TabsTrigger value="students">Active Events</TabsTrigger>
					<TabsTrigger value="clubs">Archive Events</TabsTrigger>
				</TabsList>
				<TabsContent value="students"></TabsContent>
				<TabsContent value="clubs"></TabsContent>
			</Tabs>
		</div>
	)
}
