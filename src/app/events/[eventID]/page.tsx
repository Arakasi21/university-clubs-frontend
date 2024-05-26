'use client'

import useEvent from '@/hooks/useEvent'
import useUserStore from '@/store/user'
import Nav from '@/components/NavBar'
import { AlertTriangle, CalendarDaysIcon, FileIcon, LocateIcon } from 'lucide-react'
import React from 'react'
import { Organizer } from '@/types/event'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import Link from 'next/link'
import { DateTimeFormatOptions } from 'intl'
import { Button } from '@/components/ui/button'

export default function Page({ params }: { params: { eventID: string } }) {
	const { user } = useUserStore()
	const { event } = useEvent({ eventID: params.eventID, user })
	const isUserOrganizer = event?.organizers.some(
		(organizer: Organizer) => organizer.id === user?.id,
	)

	type EventStatusMapping = {
		[key: string]: { color: string; label: string }
	}

	const eventStatusMapping: EventStatusMapping = {
		draft: { color: 'bg-gray-500', label: 'Draft' },
		pending: { color: 'bg-yellow-500', label: 'Pending' },
		'in progress': { color: 'bg-green-500', label: 'In Progress' },
		archive: { color: 'bg-red-500', label: 'Archive' },
	}

	const eventStatus = eventStatusMapping[event?.status || 'draft']

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

				<div className="flex h-24 flex-col items-center justify-center pt-20 ">
					<span>Event not found / No access to view the event</span>
				</div>
			</>
		)
	}

	return (
		<>
			<Nav />
			<div className="mx-auto max-w-4xl pt-10">
				<section className="mb-4">
					{event.attached_images ? (
						event.attached_images.map((image) => (
							<div key={image.name} className="overflow-hidden rounded-lg">
								<img className="h-[400px] w-full " src={image.url} />
							</div>
						))
					) : (
						<span>No images</span>
					)}
					<div className="rounded-lg bg-[#030a20] p-6 sm:p-8">
						<div className="mb-4 flex flex-col items-start justify-between sm:flex-row sm:items-center">
							<div>
								<h2 className="mb-1 text-2xl font-semibold">{event.title || event.id}</h2>
								<p className="text-sm text-gray-400">
									{event.description || 'No event description'}
								</p>
								{event.tags ? (
									event.tags.map((tag) => (
										<span key={tag} className="text-xs text-gray-400">
											#{tag}
										</span>
									))
								) : (
									<span>No tags</span>
								)}
							</div>
							<div className="mt-4 flex items-center gap-4 sm:mt-0">
								<div className="flex items-center gap-2">
									<CalendarDaysIcon className="h-5 w-5 text-gray-400" />
									<span className="text-sm">{formattedStartDate}</span>
								</div>
								<div className="flex items-center gap-2">
									<LocateIcon className="h-5 w-5 text-gray-400" />
									<span className="text-sm">{event.location_university}</span>
								</div>
							</div>
						</div>
						<div className="flex items-center justify-between">
							<div className="flex items-center gap-2">
								{event.collaborator_clubs.map((club) => (
									<div key={club.id} className="flex items-center space-x-4 pb-2">
										<Avatar>
											<Link href={`/clubs/${club.id}`}>
												<AvatarImage src={club.logo_url} alt={club.name} />
											</Link>
											<AvatarFallback>{club.name.charAt(0)}</AvatarFallback>
										</Avatar>
									</div>
								))}
								<div className="text-sm text-gray-400">Organized by:</div>
								{event.organizers.map((organizer: Organizer) => (
									<div key={organizer.id}>
										<div className="text-sm font-medium">
											{organizer.first_name} {organizer.last_name}
										</div>
									</div>
								))}
							</div>
							{isUserOrganizer && (
								<div className="flex flex-row items-center gap-2">
									{event.status === 'DRAFT' ? (
										<div className="my-2 flex items-center space-x-2 text-xs">
											<AlertTriangle className="h-5 w-5 text-yellow-500" />
											<div className="rounded-md bg-yellow-500 px-2 py-2 text-xs text-white">
												{event.status}
											</div>
										</div>
									) : (
										<div className="my-2 flex items-center space-x-2 text-xs">
											<div className="rounded-md bg-green-900 px-2 py-1 text-xs text-white">
												{event.status}
											</div>
										</div>
									)}
									<Link href={`/events/${event.id}/edit`}>
										<Button className="h-8" variant="default">
											Edit
										</Button>
									</Link>
								</div>
							)}
						</div>
					</div>
				</section>
				<section className="mb-4">
					<div className="rounded-lg bg-[#030a20] p-6 sm:p-8">
						<h3 className="mb-4 text-xl font-semibold">Cover Image</h3>
						<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
							<div className="grid grid-cols-2 gap-4">
								{event.cover_images ? (
									event.cover_images
										.sort((a, b) => a.position - b.position)
										.map((image) => (
											<div key={image.position} className="overflow-hidden rounded-lg">
												<img className="h-40 w-full object-cover" src={image.url} />
											</div>
										))
								) : (
									<span>No images</span>
								)}
							</div>
						</div>
					</div>
				</section>
				<section className="mb-4">
					<div className="rounded-lg bg-[#030a20] p-6 sm:p-8">
						<h3 className="mb-4 text-xl font-semibold">Attached Images</h3>
						<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
							{event.attached_images ? (
								event.attached_images.map((image, index) => (
									<div key={index} className="overflow-hidden rounded-lg">
										<img className="h-40 w-full object-cover" src={image.url} />
									</div>
								))
							) : (
								<span>No attached images</span>
							)}
						</div>
					</div>
				</section>
				<section className="mb-8">
					<div className="rounded-lg bg-[#030a20] p-6 sm:p-8">
						<h3 className="mb-4 text-xl font-semibold">Attached Files</h3>
						<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
							{event.attached_files ? (
								event.attached_files.map((file, index) => (
									<div key={index} className="w-20 overflow-hidden rounded-lg">
										<a key={index} href={file.url} target="_blank" rel="noopener noreferrer">
											<div className="flex flex-col items-center justify-center space-y-2 rounded-lg bg-gray-800 p-4">
												<FileIcon className="h-8 w-8" />
												{file.name}
											</div>
										</a>
									</div>
								))
							) : (
								<span>No attached files</span>
							)}
						</div>
					</div>
				</section>
			</div>
		</>
	)
}
