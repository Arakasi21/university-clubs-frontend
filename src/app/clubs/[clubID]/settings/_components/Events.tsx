'use client'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { AlertTriangle, Search } from 'lucide-react'
import DropdownMenuEvent from '@/components/clubs/events/DropdownMenuEvent'
import React, { useCallback, useEffect, useState } from 'react'
import { Event } from '@/types/event'
import { useAxiosInterceptor } from '@/helpers/fetch_api'
import useClubStore from '@/store/club'
import Link from 'next/link'
import EventCreationComponent from '@/components/clubs/settings/EventCreationComponent'
import useUserStore from '@/store/user'

export default function EventsContent() {
	const user = useUserStore()
	const [events, setEvents] = useState<Event[]>()
	const [dialogOpen, setDialogOpen] = useState(false)
	const [error, setError] = useState<string | null>(null)
	const [selectedEvent, setSelectedEvent] = useState<Event | null>(null)
	const isEventOwner = (event: Event) => {
		return event.owner_id === user.user?.id
	}

	const { club } = useClubStore()
	const axiosAuth = useAxiosInterceptor()

	async function updateEvent(eventId: number, updatedEvent: any) {
		try {
			const response = await axiosAuth(
				`${process.env.NEXT_PUBLIC_BACKEND_URL}/events/${eventId}`,
				updatedEvent,
			)

			if (response.status !== 200) {
				console.error('Update event error', response.data.error)
				return
			}

			console.log('Event successfully updated!')
		} catch (error) {
			console.error('An error occurred while updating the event:', error)
		}
	}

	const fetchClubEvents = useCallback(async () => {
		try {
			const response = await axiosAuth(
				`${process.env.NEXT_PUBLIC_BACKEND_URL}/clubs/${club?.id}/events/manage?page=1&page_size=30`,
				{
					method: 'GET',
				},
			)

			if (response.status.toString().startsWith('2')) {
				setEvents(response.data.events)
			} else {
				setError('Failed to fetch events')
			}
		} catch (err) {
			setError('Network Error: Unable to fetch events')
		}
	}, [club?.id])

	useEffect(() => {
		fetchClubEvents()
	}, [])

	return (
		<main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6">
			<div className="flex items-center">
				<h1 className="text-lg font-semibold md:text-2xl">Events</h1>
				<div className="ml-auto flex items-center gap-4">
					<div className="relative w-full max-w-md">
						<Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500 dark:text-gray-400" />
						<Input
							className="h-9 w-full rounded-md border border-gray-200 bg-white pl-8 pr-4 text-sm shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary dark:border-gray-800 dark:bg-gray-950 dark:text-gray-50"
							placeholder="Search events..."
							type="search"
						/>
					</div>
					<DropdownMenuEvent />
					<EventCreationComponent clubID={club?.id} />
				</div>
			</div>
			<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
				{events?.map((event) => (
					<div
						key={event.id}
						className="rounded-lg border border-gray-200 p-4 shadow-sm dark:border-gray-800"
					>
						<h3 className="text-lg font-medium">{event.title || 'No Title'}</h3>
						<p className="text-sm text-gray-500 dark:text-gray-400">
							{new Date(event.created_at).toLocaleString()}
						</p>
						{event.status === 'DRAFT' ? (
							<div className="my-2 flex items-center space-x-2 text-xs">
								<div className="rounded-md bg-yellow-500 px-2 py-1 text-xs text-white">
									{event.status}
								</div>
								<AlertTriangle className="h-4 w-4 text-yellow-500" />
							</div>
						) : (
							<div className="my-2 flex items-center space-x-2 text-xs">
								<div className="rounded-md bg-green-900 px-2 py-1 text-xs text-white">
									{event.status}
								</div>
							</div>
						)}

						<div className="flex items-center justify-between">
							{/* TODO ADD CONDITION IF EVENT STATUS ! DRAFT, THE USER HAVE PERMISSIONS AND ETC	*/}
							{isEventOwner(event) && (
								<Link href={`/events/${event.id}`}>
									<Button>View Event</Button>
								</Link>
							)}
						</div>
					</div>
				))}
			</div>
		</main>
	)
}
