'use client'

import useEvent from '@/hooks/useEvent'
import useUserStore from '@/store/user'
import Nav from '@/components/NavBar'
import { CheckIcon, PlusIcon } from 'lucide-react'
import React from 'react'
import { Organizer } from '@/types/event'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import Link from 'next/link'
import { DateTimeFormatOptions } from 'intl'
import { Button } from '@/components/ui/button'
import useUserClubStatus from '@/hooks/useUserClubStatus'

export default function Page({ params }: { params: { eventID: string } }) {
	const { user } = useUserStore()
	const { event } = useEvent({ eventID: params.eventID, user })
	const isUserOrganizer = event?.organizers.some(
		(organizer: Organizer) => organizer.id === user?.id,
	)

	const { memberStatus } = useUserClubStatus({
		clubID: event?.club_id || 0,
	})
	const isMember = (clubId: number) => {
		return memberStatus[clubId] === 'member'
	}

	type EventStatusMapping = {
		[key: string]: { color: string; label: string }
	}

	const eventStatusMapping: EventStatusMapping = {
		DRAFT: { color: 'bg-gray-500', label: 'Draft' },
		PENDING: { color: 'bg-yellow-500', label: 'Pending' },
		APPROVED: { color: 'bg-green-500', label: 'Approved' },
		REJECTED: { color: 'bg-red-500', label: 'Rejected' },
		IN_PROGRESS: { color: 'bg-green-500', label: 'In Progress' },
	}

	const eventStatus = eventStatusMapping[event?.status || 'DRAFT'] || {
		color: 'bg-gray-500',
		label: 'Unknown',
	}

	const startDate = event?.start_date ? new Date(event.start_date) : null

	const options: DateTimeFormatOptions = {
		year: 'numeric',
		month: 'long',
		day: 'numeric',
		hour: 'numeric',
		minute: 'numeric',
	}
	const formattedStartDate = startDate
		? startDate.toLocaleDateString(undefined, options)
		: 'No start date available'

	if (!event) {
		return (
			<>
				<Nav />
				<div className="flex h-24 flex-col items-center justify-center pt-20">
					<span>Event not found / No access to view the event</span>
				</div>
			</>
		)
	}

	return (
		<>
			<Nav />
			<div className="flex min-h-screen flex-col bg-[#030a20] text-gray-50">
				<main className="container mx-auto flex-1 px-4 py-12 md:px-6 md:py-16 lg:px-8 lg:py-24">
					<div className="grid gap-8 md:grid-cols-[1fr_300px] lg:gap-12">
						<div>
							<div className="relative">
								{event.cover_images ? (
									<>
										<img
											alt="Event Cover"
											className="absolute inset-0 h-full w-full object-cover blur-lg filter"
											src={event.cover_images[0].url}
										/>
										<img
											alt="Event Cover"
											className="relative m-auto h-[500px] rounded-md object-scale-down drop-shadow-md"
											src={event.cover_images[0].url}
										/>
									</>
								) : (
									<img
										alt="Event Cover"
										className="aspect-[2/1] w-full rounded-xl object-cover"
										src="/placeholder.svg"
									/>
								)}
							</div>
							<div className="mt-8 space-y-2">
								<h1 className="text-3xl font-bold md:text-4xl lg:text-5xl">
									{event.title || event.id}
								</h1>

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

								<div className="prose max-w-[800px] text-gray-300">
									<p>{event.description || 'No event description'}</p>
								</div>
							</div>
						</div>
						<div className="flex h-fit flex-col  space-y-6 rounded-xl bg-gray-800 p-6">
							<div className="space-y-2">
								<div className="text-sm font-medium text-gray-400">When</div>
								<div>
									<div className="text-lg font-medium">{formattedStartDate}</div>
								</div>
							</div>
							<div className="space-y-2">
								<div className="text-sm font-medium text-gray-400">Where</div>
								<div>
									<div className="text-lg font-medium">
										{event.location_university || 'Location not specified'}
									</div>
								</div>
							</div>
							<div className="space-y-2">
								<div>
									<div className="pb-2 text-sm font-medium text-gray-400">Club Collaborators</div>
									{event.collaborator_clubs.map((club) => (
										<div key={club.id} className="flex items-center gap-2 pb-2">
											<div className="flex items-center justify-between rounded-full bg-gray-700 px-2 py-1">
												<div className="flex-shrink-0  rounded-full">
													<img
														className="h-10 w-10 rounded-full object-cover"
														src={club.logo_url || '/placeholder.svg'}
														alt={club.name}
													/>
												</div>
												<div className="ml-2 text-sm font-medium">{club.name}</div>
												<Link href={`/clubs/${club.id}`}>
													<Button
														className="text-gray-400 hover:bg-gray-700 hover:text-gray-50"
														size="icon"
														variant="ghost"
													>
														{isMember(club.id) ? (
															<PlusIcon className="h-4 w-4" />
														) : (
															<CheckIcon className="h-4 w-4 text-green-500" />
														)}
													</Button>
												</Link>
											</div>
										</div>
									))}
								</div>
								<div className="text-sm font-medium text-gray-400">Organizers</div>
								<div className="flex-col items-center gap-4">
									{event.organizers.map((organizer: Organizer) => (
										<div key={organizer.id} className="flex items-center gap-2 pb-2">
											<Avatar style={{ width: 44, height: 44 }}>
												<AvatarImage
													src={organizer?.avatar_url}
													alt={`${organizer?.first_name}'s profile picture`}
												/>
												<AvatarFallback style={{ fontSize: 44 / 4 }}>
													{organizer?.first_name.slice(0, 1)}
												</AvatarFallback>
											</Avatar>
											<div className="text-sm font-medium">
												{organizer.first_name} {organizer.last_name}
											</div>
										</div>
									))}
								</div>
							</div>
							<div className="inline-block align-bottom">
								<div className="space-y-2">
									<div className="my-2 flex items-center space-x-2 text-xs">
										<div
											className={`rounded-md  px-2 py-2 text-xs text-white ${eventStatus.color}`}
										>
											{eventStatus.label}
										</div>
									</div>
								</div>
								{isUserOrganizer && (
									<div className="flex gap-2">
										<Link href={`/events/${event.id}/edit`}>
											<Button className="flex-1" variant="default">
												Edit Event
											</Button>
										</Link>
									</div>
								)}
							</div>
						</div>
					</div>
				</main>
			</div>
		</>
	)
}
