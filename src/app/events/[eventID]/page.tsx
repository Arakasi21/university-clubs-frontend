'use client'

import useEvent from '@/hooks/useEvent'
import useUserStore from '@/store/user'
import Nav from '@/components/NavBar'
import { CalendarDaysIcon, LocateIcon } from 'lucide-react'
import React from 'react'
import { Organizer } from '@/types/event'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import Link from 'next/link'
import { DateTimeFormatOptions } from 'intl'

export default function Page({ params }: { params: { eventID: string } }) {
	const { user } = useUserStore()
	const { event } = useEvent({ eventID: params.eventID, user })

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
				<section className="mb-8">
					<div className="rounded-lg bg-[#030a20] p-6 sm:p-8">
						<div className="mb-4 flex flex-col items-start justify-between sm:flex-row sm:items-center">
							<div>
								<h2 className="mb-1 text-2xl font-semibold">{event.title || event.id}</h2>
								<p className="text-sm text-gray-400">
									{event.description || 'No event description'}
								</p>
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
					</div>
				</section>
				<section className="mb-8">
					<div className="rounded-lg bg-[#030a20] p-6 sm:p-8">
						<h3 className="mb-4 text-xl font-semibold">Event Media</h3>
						<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
							<div className="grid grid-cols-2 gap-4"></div>
						</div>
					</div>
				</section>
			</div>
		</>
	)
}
