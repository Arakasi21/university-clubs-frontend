import React from 'react'
import Nav from '@/components/NavBar'
import Layout from '@/components/Layout'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import Students from '@/app/admin-dashboard/dashboard/_components/Students'
import Clubs from '@/app/admin-dashboard/dashboard/_components/Clubs'
import Events from '@/app/admin-dashboard/dashboard/_components/Events'
import Reports from '@/app/admin-dashboard/dashboard/_components/Reports'

function Page() {
	return (
		<>
			<Nav />

			<div>
				<Tabs
					defaultValue="students"
					className="grid flex-1 items-start gap-4 p-4 sm:px-64 sm:py-8 md:gap-8"
				>
					<div>
						<span className="self-center whitespace-nowrap text-xl font-semibold dark:text-white">
							UCMS AITUSA DASHBOARD
						</span>
					</div>
					<TabsList className="grid w-full grid-cols-4">
						<TabsTrigger value="students">Students</TabsTrigger>
						<TabsTrigger value="clubs">Clubs</TabsTrigger>
						<TabsTrigger value="events">Events</TabsTrigger>
						<TabsTrigger value="reports">Reports</TabsTrigger>
					</TabsList>
					<TabsContent value="students">
						<Students />
					</TabsContent>
					<TabsContent value="clubs">
						<Clubs />
					</TabsContent>
					<TabsContent value="events">
						<Events />
					</TabsContent>
					<TabsContent value="reports">
						<Reports />
					</TabsContent>
				</Tabs>
			</div>
		</>
	)
}

export default Page
