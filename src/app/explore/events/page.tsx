'use client'
import React, { useCallback, useEffect, useState } from 'react'
import Nav from '@/components/NavBar'
import SkeletonClubs from '@/components/Skeletons/SkeletonClubs'
import { Event } from '@/types/event'
import useUserRolesStore from '@/store/useUserRoles'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { CalendarIcon, LocateIcon } from 'lucide-react'

export default function Events() {
	const [loading, setLoading] = useState(true)
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
				setLoading(false)
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
		<>
			<Nav />

			{loading ? (
				<SkeletonClubs />
			) : (
				<div className="container w-full max-w-6xl px-4 py-10 md:px-6 lg:px-8">
					<h1 className="mb-8 text-center text-3xl font-bold dark:text-white md:text-4xl lg:text-5xl">
						Discover Events
					</h1>

					<div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
						{events?.map((event) => (
							<div
								key={event.id}
								className="cursor-pointer overflow-hidden rounded-lg bg-gray-900 shadow-lg"
								onClick={() => handleEventClick(event.id)}
							>
								{event.cover_images ? (
									<img
										src={event.cover_images[0].url}
										alt="Event Cover"
										className="transition-transform duration-300 hover:scale-105"
										style={{
											aspectRatio: '100/50',
										}}
									/>
								) : (
									<img
										alt="Event Cover"
										className="aspect-[2/1] w-full rounded-xl object-cover"
										src="/placeholder.svg"
									/>
								)}

								<div className="p-6">
									<h2 className="text-xl font-semibold">{event.title}</h2>
									{event.collaborator_clubs?.map((club) => {
										if (club.id === event.collaborator_clubs[0].id) {
											return (
												<div
													key={club.id}
													className="mb-2 flex items-center gap-1 italic text-muted-foreground"
												>
													by
													<h3 className="font-semibold">{club.name}</h3>
													<p className="text-sm text-gray-400">{club.club_type}</p>
												</div>
											)
										}
									})}
									<p className="mb-4 text-gray-400 ">
										{event.description.substring(0, 60)}
										{event.description.length > 60 ? '...' : ''}
									</p>
									<div className="mb-4 flex items-center">
										<CalendarIcon className="mr-2 h-5 w-5" />
										<span>{new Date(event.start_date).toISOString().slice(0, 10)}</span>
									</div>
									<div className="mb-4 flex items-center">
										<LocateIcon className="mr-2 h-5 w-5" />
										<span>{event.location_university}</span>
									</div>
									<div className="flex flex-wrap gap-2 pb-2">
										{event.tags ? (
											event.tags.map((tag) => (
												<div
													key={tag}
													className="rounded-full bg-gray-800 px-3 py-1 text-sm font-medium"
												>
													{tag}
												</div>
											))
										) : (
											<span>No tags</span>
										)}
									</div>
								</div>
							</div>
						))}
					</div>
				</div>
			)}
		</>
	)
}
