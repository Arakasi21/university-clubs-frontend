import { TableCell, TableRow } from '@/components/ui/table'
import { useEffect, useState } from 'react'
import { DropdownMenu, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { useAxiosInterceptor } from '@/helpers/fetch_api'
import { Event } from '@/types/event'
import { Button } from '@/components/ui/button'

export type EventsRowProps = {
	onUpdate: () => void
	event: Event
}

function EventsRow({ onUpdate, event }: EventsRowProps) {
	const [isContextMenuOpen, setIsContextMenuOpen] = useState(false)
	const axiosAuth = useAxiosInterceptor()

	const deleteEvent = async () => {
		try {
			const response = await axiosAuth.delete(
				`${process.env.NEXT_PUBLIC_BACKEND_URL}/events/${event.id}`,
			)
			if (response.status.toString().startsWith('2')) {
				onUpdate()
			} else {
				console.error('Failed to delete event')
			}
		} catch (err) {
			console.error('Network Error: Unable to delete event')
		}
	}

	useEffect(() => {
		onUpdate()
	}, [])

	return (
		<TableRow
			key={event.id}
			onContextMenu={(e) => {
				e.preventDefault()
				setIsContextMenuOpen(true)
			}}
			onClick={(e) => {
				e.preventDefault()
				setIsContextMenuOpen(true)
			}}
		>
			<DropdownMenu open={isContextMenuOpen} onOpenChange={setIsContextMenuOpen} modal={true}>
				<TableCell>{event.id}</TableCell>
				<TableCell>{event.title}</TableCell>
				<TableCell>{event.description}</TableCell>
				<TableCell>{event.start_date}</TableCell>
				<TableCell>{event.end_date}</TableCell>
				<TableCell>{event.location_link || event.location_university}</TableCell>
				<TableCell>
					{event.organizers.map((organizer) => (
						<div key={organizer.id}>{organizer.first_name}</div>
					))}
				</TableCell>
				<TableCell>
					<Button variant="destructive" onClick={deleteEvent}>
						Delete Event
					</Button>
				</TableCell>
				<DropdownMenuTrigger />
			</DropdownMenu>
		</TableRow>
	)
}

export default EventsRow
