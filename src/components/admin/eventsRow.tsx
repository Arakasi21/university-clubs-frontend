import { TableCell, TableRow } from '@/components/ui/table'
import React, { useState } from 'react'
import { useAxiosInterceptor } from '@/helpers/fetch_api'
import { Event } from '@/types/event'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog'
import { DetailedEventDialog } from '@/components/admin/DetailedEventDialog'

export type EventsRowProps = {
	onUpdate: () => void
	event: Event
}

function EventsRow({ onUpdate, event }: EventsRowProps) {
	const axiosAuth = useAxiosInterceptor()

	const [isDetailedDialogOpen, setIsDetailedDialogOpen] = useState(false)
	const [isDeleteConfirmationDialogOpen, setIsDeleteConfirmationDialogOpen] = useState(false)

	const handleRowClick = () => {
		setIsDetailedDialogOpen(true)
	}

	const handleDeleteEvent = async (eventId: string) => {
		try {
			const response = await axiosAuth.delete(
				`${process.env.NEXT_PUBLIC_BACKEND_URL}/events/${eventId}`,
			)

			if (response.status.toString().startsWith('2')) {
				toast.success('Event deleted successfully')
				onUpdate()
				setIsDetailedDialogOpen(false)
				setIsDeleteConfirmationDialogOpen(false)
			} else {
				toast.error('Failed to delete event', { description: response.data.error })
			}
		} catch (error) {
			toast.error('Failed to delete event')
		}
	}

	// COLOR
	type EventStatusMapping = {
		[key: string]: { color: string; label: string }
	}

	const eventStatusMapping: EventStatusMapping = {
		DRAFT: { color: 'bg-gray-700 hover:bg-gray-900', label: 'Draft' },
		PENDING: { color: 'bg-yellow-700 hover:bg-yellow-900', label: 'Pending' },
		APPROVED: { color: 'bg-green-700 hover:bg-green-900', label: 'Approved' },
		REJECTED: { color: 'bg-red-700 hover:bg-red-900', label: 'Rejected' },
		IN_PROGRESS: { color: 'bg-blue-700 hover:bg-blue-700', label: 'In Progress' },
	}

	const eventStatus = eventStatusMapping[event?.status || 'DRAFT'] || {
		color: 'bg-gray-500',
		label: 'Unknown',
	}

	return (
		<>
			<TableRow key={event.id} onClick={handleRowClick} className="cursor-default">
				<TableCell>{event.id}</TableCell>
				<TableCell>{event.title}</TableCell>
				<TableCell>
					{event?.description?.length > 100
						? event.description.slice(0, 100) + '...'
						: event.description}
				</TableCell>
				<TableCell>
					{event.organizers.map((organizer) => (
						<div key={organizer.id}>{organizer.first_name}</div>
					))}
				</TableCell>
				<TableCell>
					<div className={`${eventStatus.color} rounded-lg px-2 py-1 text-center`}>
						{eventStatus.label}
					</div>
				</TableCell>
			</TableRow>

			{isDetailedDialogOpen && (
				<DetailedEventDialog
					event={event}
					isOpen={isDetailedDialogOpen}
					onClose={() => setIsDetailedDialogOpen(false)}
					onDelete={() => setIsDeleteConfirmationDialogOpen(true)}
				/>
			)}

			<Dialog
				open={isDeleteConfirmationDialogOpen}
				onOpenChange={setIsDeleteConfirmationDialogOpen}
			>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Are you absolutely sure?</DialogTitle>
						<DialogDescription>This will permanently delete the event.</DialogDescription>
					</DialogHeader>
					<Button onClick={() => handleDeleteEvent(event.id)} variant={'destructive'}>
						Yes, delete the event
					</Button>
					<Button onClick={() => setIsDeleteConfirmationDialogOpen(false)}>No, cancel</Button>
				</DialogContent>
			</Dialog>
		</>
	)
}

export default EventsRow
