'use client'
import { useAxiosInterceptor } from '@/helpers/fetch_api'
import React, { useCallback, useEffect, useState } from 'react'
import { Event } from '@/types/event'
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import DraftEventDialog from '@/components/admin/DraftEventDialog'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import Link from 'next/link'

export default function ListEvents() {
	const axiosAuth = useAxiosInterceptor()
	const [events, setEvents] = useState<Event[]>([])
	const [dialogOpen, setDialogOpen] = useState(false)
	const [error, setError] = useState<string | null>(null)
	const [selectedEvent, setSelectedEvent] = useState<Event | null>(null)

	const handleCardClick = (event: Event) => {
		console.log('Event:', event)
		setSelectedEvent(event)
		setEvents(events)
		setDialogOpen(true)
	}
	const closeDialog = () => {
		setDialogOpen(false)
	}
	const handleEventClick = (event: Event) => {
		setSelectedEvent(event)
		setDialogOpen(true)
	}

	const fetchEvents = useCallback(async () => {
		try {
			const response = await axiosAuth(
				`${process.env.NEXT_PUBLIC_BACKEND_URL}/events/admin?page=1&page_size=30&type=&clubId=&userId=&status=&tags=`,
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
	}, [])

	useEffect(() => {
		fetchEvents()
	}, [])

	return (
		<div className="grid grid-cols-4">
			{events?.map((event) => (
				<div key={event.id} className="m-4 cursor-pointer">
					<Card className="w-[300px] rounded-lg bg-muted/40" onClick={() => handleCardClick(event)}>
						<CardHeader>
							<CardTitle>
								{event.collaborator_clubs.map((club) => {
									if (club.id === event.club_id) {
										return (
											<div key={club.id} className="flex items-center space-x-4 pb-2">
												<Avatar>
													<Link href={`/clubs/${club.id}`}>
														<AvatarImage src={club.logo_url} alt={club.name} />
													</Link>
													<AvatarFallback>{club.name.charAt(0)}</AvatarFallback>
												</Avatar>
												<p>
													<Link href={`/clubs/${club.id}`}>
														<span className="font-medium">{club.name}</span>{' '}
													</Link>
												</p>
											</div>
										)
									}
								})}
							</CardTitle>
							<CardDescription className="space-x-2">
								<Badge variant="default">{event.id}</Badge>
								{/*<Badge variant="default">Status: {event.status}</Badge>*/}
							</CardDescription>
						</CardHeader>
					</Card>
				</div>
			))}
			<DraftEventDialog
				event={selectedEvent}
				isOpen={dialogOpen}
				onClose={closeDialog}
				onEventClick={handleEventClick}
			/>
		</div>
	)
}
