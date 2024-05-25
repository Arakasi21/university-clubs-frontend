import React, { useState } from 'react'
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Event } from '@/types/event'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { File, XIcon } from 'lucide-react'
import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { useAxiosInterceptor } from '@/helpers/fetch_api'
import { Input } from '@/components/ui/input'

type DialogViewClubEventProps = {
	event: Event
}

export function DialogViewClubEvent({ event }: DialogViewClubEventProps) {
	const [isOpen, setIsOpen] = useState(false)
	const [isEditing, setIsEditing] = useState(false)
	const [editedEvent, setEditedEvent] = useState(event)
	const axiosAuth = useAxiosInterceptor()

	async function updateEvent(eventId: string, updatedEvent: any) {
		try {
			const changes = Object.keys(updatedEvent).reduce((acc, key) => {
				if (updatedEvent[key as keyof Event] !== event[key as keyof Event]) {
					acc[key as keyof typeof acc] = updatedEvent[key as keyof Event]
				}
				return acc
			}, {} as Partial<Event>)
			const response = await axiosAuth(`${process.env.NEXT_PUBLIC_BACKEND_URL}/events/${eventId}`, {
				method: 'PATCH',
				data: JSON.stringify(changes),
			})

			if (response.status !== 200) {
				console.error('Update event error', response.data.error)
				return
			}

			console.log('Event successfully updated!')
		} catch (error) {
			console.error('An error occurred while updating the event:', error)
		}
	}

	const saveChanges = async () => {
		try {
			const response = await updateEvent(event.id, editedEvent)
			setIsEditing(false)
		} catch (error) {
			console.error('An error occurred while saving the changes:', error)
		}
	}

	const toggleDialog = () => {
		setIsOpen(!isOpen)
	}

	const toggleEditing = () => {
		setIsEditing(!isEditing)
	}

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setEditedEvent({
			...editedEvent,
			[e.target.name]: e.target.value,
		})
	}

	const closeDialog = () => {
		setIsOpen(false)
	}

	return (
		<Dialog open={isOpen} onOpenChange={setIsOpen}>
			<DialogTrigger asChild>
				<Button className="h-8" variant={'default'} onClick={toggleDialog}>
					View Event
				</Button>
			</DialogTrigger>
			<DialogContent className="sm:max-w-[600px]">
				<DialogHeader className="rounded-lg bg-gray-900 px-6 py-4 text-white">
					<div className="flex flex-col">
						<DialogTitle>
							<h1>{event.title || event.id}</h1>
						</DialogTitle>
						<DialogDescription>
							<p>{event.description || 'No event description provided'}</p>
						</DialogDescription>
					</div>
				</DialogHeader>
				<div className="space-y-4 p-6">
					<div className="grid grid-cols-2 gap-4">
						<div>
							<p className="text-sm font-medium text-gray-500 dark:text-gray-400">Start Date</p>
							{isEditing ? (
								<Input
									type="datetime-local"
									value={new Date(editedEvent.start_date).toISOString().substring(0, 16)}
									onChange={(e) =>
										setEditedEvent({
											...editedEvent,
											start_date: new Date(e.target.value).toISOString(),
										})
									}
								/>
							) : (
								<p className="text-base font-medium">
									{new Date(event.start_date).toLocaleString()}
								</p>
							)}
						</div>
						<div>
							<p className="text-sm font-medium text-gray-500 dark:text-gray-400">End Date</p>
							{isEditing ? (
								<Input
									type="datetime-local"
									value={new Date(editedEvent.end_date).toISOString().substring(0, 16)}
									onChange={(e) =>
										setEditedEvent({
											...editedEvent,
											end_date: new Date(e.target.value).toISOString(),
										})
									}
								/>
							) : (
								<p className="text-base font-medium">{new Date(event.end_date).toLocaleString()}</p>
							)}
						</div>
					</div>
					<div>
						<p className="text-sm font-medium text-gray-500 dark:text-gray-400">Location</p>
						{isEditing ? (
							<Input
								type="text"
								value={editedEvent.location_university || editedEvent.location_link || ''}
								onChange={(e) =>
									setEditedEvent({ ...editedEvent, location_university: e.target.value })
								}
							/>
						) : (
							<p className="text-base font-medium">
								{event.location_university || event.location_link || 'no location'}
							</p>
						)}
					</div>
					<div>
						<p className="text-sm font-medium text-gray-500 dark:text-gray-400">Participants</p>
						{isEditing ? (
							<Input
								type="number"
								value={editedEvent.max_participants || 0}
								onChange={(e) =>
									setEditedEvent({ ...editedEvent, max_participants: parseInt(e.target.value, 10) })
								}
							/>
						) : (
							<p className="text-base font-medium">{event.max_participants || '0'}</p>
						)}
					</div>
					<div>
						<p className="text-sm font-medium text-gray-500 dark:text-gray-400">Organizer</p>
						{event.organizers.map((organizer) => (
							<div key={organizer.id} className="flex items-center gap-4">
								<Avatar>
									<Link href={`/user/${organizer.id}`}>
										<AvatarImage src={organizer.avatar_url} alt={organizer.first_name} />
									</Link>
									<AvatarFallback>{organizer.first_name.charAt(0)}</AvatarFallback>
								</Avatar>
								<div className="my-2">
									<p className="text-base font-medium">
										<Link href={`/user/${organizer.id}`}>
											{organizer.first_name} {organizer.last_name}
										</Link>
									</p>
									<p className="text-sm text-gray-500 dark:text-gray-400">
										Club ID: {organizer.club_id}
									</p>
								</div>
								{organizer.club_id === event.club_id && organizer.id === event.owner_id && (
									<Badge variant="default">Owner</Badge>
								)}
							</div>
						))}
					</div>
					<div>
						<p className="text-sm font-medium text-gray-500 dark:text-gray-400">Attached Files</p>
						<div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
							{event.attached_files?.map((file) => (
								<div key={file.url} className="flex items-center gap-2">
									<File className="h-6 w-6" />
									<p className="text-sm font-medium">{file.name}</p>
									<XIcon className="h-4 w-4 cursor-pointer" onClick={closeDialog} />
								</div>
							)) || (
								<div className="my-2 flex flex-row items-center">
									<File className="h-6 w-6 text-muted-foreground" />{' '}
									<p className="text-sm text-muted-foreground ">No Files</p>
								</div>
							)}
						</div>
					</div>
					<div>
						<p className="text-sm font-medium text-gray-500 dark:text-gray-400">Attached Images</p>
						<div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
							{event.attached_images?.map((image) => (
								<div key={image.url} className="flex items-center gap-2">
									<File className="h-6 w-6" />
									<p className="text-sm font-normal">{image.name}</p>
									<XIcon className="h-4 w-4 cursor-pointer" onClick={closeDialog} />
								</div>
							)) || (
								<div className="my-2 flex flex-row items-center">
									<File className="h-6 w-6 text-muted-foreground" />{' '}
									<p className="text-sm text-muted-foreground ">No Images</p>
								</div>
							)}
						</div>
					</div>
				</div>
				<DialogFooter className="flex justify-end gap-2 rounded-lg bg-gray-900 px-6 py-4 text-white">
					{isEditing ? (
						<>
							<Button
								className="text-white hover:bg-white/10"
								variant="outline"
								onClick={toggleEditing}
							>
								Cancel
							</Button>
							<Button className="bg-white text-[#020817] hover:bg-gray-100" onClick={saveChanges}>
								Save Changes
							</Button>
						</>
					) : (
						<Button className="bg-white text-[#020817] hover:bg-gray-100" onClick={toggleEditing}>
							Edit
						</Button>
					)}
				</DialogFooter>
			</DialogContent>
		</Dialog>
	)
}
