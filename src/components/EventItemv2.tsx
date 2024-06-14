import React from 'react'
import { CalendarIcon, LocateIcon } from 'lucide-react'
import { Event } from '@/types/event'
import { useRouter } from 'next/navigation'
import useUserRolesStore from '@/store/useUserRoles'

export type EventItemv2Props = {
	event: Event
}

function EventItemv2({ event }: EventItemv2Props) {
	const router = useRouter()
	const { resetUserRoles } = useUserRolesStore()

	const handleEventClick = (eventID: string) => {
		resetUserRoles()
		router.push(`/events/${eventID}`)
	}

	return (
		<div
			className="cursor-pointer overflow-hidden rounded-lg bg-gray-200/70 shadow-lg dark:bg-gray-900"
			onClick={() => handleEventClick(event.id)}
		>
			{event.cover_images ? (
				<div className="relative w-full rounded-xl">
					{/*<img
						src={event.cover_images[0].url}
						alt="Event Cover"
						className="object-cover transition-transform duration-300 hover:scale-105"
						height={400}
						width={600}
						style={{ aspectRatio: '1/1', objectFit: 'cover' }}
					/>*/}
					<div className="absolute inset-0 h-full w-full overflow-hidden rounded-xl">
						<img
							src={event.cover_images[0].url}
							alt={event.cover_images[0].name}
							className="absolute inset-0 h-full w-full rounded-xl object-cover blur-2xl filter"
							style={{
								transform: 'scale(1.1)',
							}}
						/>
						<div className="absolute inset-0 h-full w-full bg-black opacity-50"></div>{' '}
					</div>
					<img
						src={event.cover_images[0].url}
						alt={event.cover_images[0].name}
						className="relative z-10 h-full max-h-[500px] w-full rounded-xl object-scale-down"
					/>
				</div>
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
				<p className="mb-4 text-gray-500 dark:text-gray-400 ">
					{event.description?.substring(0, 60)}
					{event.description?.length > 60 ? '...' : ''}
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
								className="rounded-full bg-blue-200 px-3 py-1 text-sm font-medium dark:bg-gray-800"
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
	)
}

export default EventItemv2
