import { Event } from '@/types/event'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import React from 'react'
import Link from 'next/link'
import { getEventStatus } from '@/lib/eventStatusUtils'

export default function ClubEvent(props: { event: Event }) {
	const eventStatusMapping = getEventStatus(props.event?.status || 'DRAFT')

	return (
		<Card>
			<CardContent className="flex w-full flex-wrap items-center justify-between gap-2 overflow-hidden rounded-lg p-4 dark:bg-gray-700 sm:flex-nowrap sm:gap-4">
				<div className="flex flex-col">
					<h3 className="text-md font-medium">{props.event.title}</h3>
					<p className="text-sm font-normal text-muted-foreground">
						{new Date(props.event.start_date).toLocaleString()}
					</p>
				</div>
				<div className="my-2 flex items-center space-x-2 text-xs">
					<div className={`rounded-md px-2 py-2 text-xs text-white ${eventStatusMapping.color}`}>
						{eventStatusMapping.label}
					</div>
				</div>
				<div className="flex flex-row items-end">
					<Link href={`/events/${props.event.id}`}>
						<Button
							className="bg-blue-200 text-gray-900 hover:bg-blue-200/70 dark:bg-gray-900 dark:text-white dark:hover:bg-gray-900/90"
							variant="outline"
						>
							View
						</Button>
					</Link>
				</div>
			</CardContent>
		</Card>
	)
}
