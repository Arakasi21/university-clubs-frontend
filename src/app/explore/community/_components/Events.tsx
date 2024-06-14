'use client'
import React, { useCallback, useEffect, useState } from 'react'
import { toast } from 'sonner'
import { Event } from '@/types/event'
import EventItem from '@/components/EventItem'

function Events() {
	const [loadingEvents, setLoadingEvents] = useState(true)
	const [events, setEvents] = useState<Event[]>()

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

	return (
		<div className="overflow-auto bg-gray-100 p-4 dark:bg-gray-900">
			<h2 className="mb-4 text-lg font-semibold">Events</h2>
			<div className="grid gap-4">
				{loadingEvents ? (
					<div>Loading...</div>
				) : (
					events?.map((event) => <EventItem event={event} key={event.id} />)
				)}
			</div>
		</div>
	)
}

export default Events
