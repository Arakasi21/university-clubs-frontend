import React from 'react'
import { Event } from '@/types/event'
import { CalendarIcon, MapPinIcon, TagIcon } from 'lucide-react'
import Link from 'next/link'

export type EventItemHorizontalProps = {
	event: Event
}

export default function EventItemHorizontal({ event }: EventItemHorizontalProps) {
	return (
		<div className="mx-auto w-full max-w-6xl px-4 py-2 md:px-6 md:py-4 lg:py-5">
			<div className="grid items-start gap-8 md:grid-cols-2">
				<div className="relative aspect-[21/9] overflow-hidden rounded-lg">
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
				<div className="grid gap-4">
					<div className="grid gap-2">
						<Link href={`/events/${event.id}`}>
							<h2 className="text-2xl font-bold text-black dark:text-foreground">{event.title}</h2>
						</Link>
						<p className="line-clamp-3 text-gray-500 dark:text-gray-400">{event.description}</p>
					</div>
					<div className="grid gap-2">
						{(event.location_link || event.location_university) && (
							<div className="flex items-center gap-2">
								<MapPinIcon className="h-5 w-5 text-gray-500 dark:text-gray-400" />
								<span className="text-gray-500 dark:text-gray-400">
									{event.location_link || event.location_university}
								</span>
							</div>
						)}
						<div className="flex items-center gap-2">
							<CalendarIcon className="h-5 w-5 text-gray-500 dark:text-gray-400" />
							<span className="text-gray-500 dark:text-gray-400">
								<span>{new Date(event.start_date).toISOString().slice(0, 10)}</span> -{' '}
								<span>{new Date(event.end_date).toISOString().slice(0, 10)}</span>
							</span>
						</div>
					</div>
					<div className="flex flex-wrap gap-2">
						{event.tags.map((tag, index) => (
							<div
								className="inline-flex items-center gap-2 rounded-full bg-gray-100 px-3 py-1 text-sm text-gray-500 dark:bg-gray-800 dark:text-gray-400"
								key={index}
							>
								<TagIcon className="h-4 w-4" />
								{tag}
							</div>
						))}
					</div>
				</div>
			</div>
		</div>
	)
}
