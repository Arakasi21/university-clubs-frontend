'use client'
import React, { useCallback, useEffect, useState } from 'react'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { CalendarIcon } from 'lucide-react'
import useUserRolesStore from '@/store/useUserRoles'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import { Event } from '@/types/event'

function Events() {
	const [loadingEvents, setLoadingEvents] = useState(true)
	const [events, setEvents] = useState<Event[]>()
	const router = useRouter()

	const { resetUserRoles } = useUserRolesStore()

	const fetchEvents = useCallback(() => {
		fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/events?page=1&page_size=30`, { method: 'GET' })
			.then(async (res) => {
				const data = await res.json()
				if (!res.ok) {
					toast.error('not found', {
						description: data.error,
					})
					return
				}
				setEvents(data.events)
				setLoadingEvents(false)
			})
			.catch((error) => {
				console.log(error)
			})
	}, [])

	useEffect(() => {
		fetchEvents()
	}, [fetchEvents])

	const handleEventClick = (eventID: string) => {
		resetUserRoles()
		router.push(`/events/${eventID}`)
	}

	return (
		<div className="overflow-auto bg-gray-100 p-4 dark:bg-gray-900">
			<h2 className="mb-4 text-lg font-semibold">Events</h2>
			<div className="grid gap-4">
				{loadingEvents ? (
					<div>Loading...</div>
				) : (
					events?.map((event) => (
						<div key={event.id} onClick={() => handleEventClick(event.id)}>
							<Card>
								<CardHeader>
									<img
										src={event.cover_images[0].url}
										alt="Event Cover"
										width={100}
										height={400}
										className="h-40 w-full rounded-t-lg object-cover"
									/>
								</CardHeader>
								<CardContent className="p-4">
									<div className="mb-2 flex items-center gap-2">
										<div className="rounded-md bg-gray-100 px-2 py-1 text-xs font-medium text-gray-500 dark:bg-gray-800 dark:text-gray-400">
											Hosted by {event.collaborator_clubs.map((club) => club.name).join(', ')}
										</div>
									</div>
									<h3 className="mb-2 text-xl font-semibold">{event.title}</h3>
									<p className="mb-4 text-gray-500 dark:text-gray-400">{event.description}</p>
									<div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
										<CalendarIcon className="h-4 w-4" />
										<span>{new Date(event.start_date).toISOString().slice(0, 10)}</span>
									</div>
								</CardContent>
							</Card>
						</div>
					))
				)}
			</div>
		</div>
	)
}

export default Events
