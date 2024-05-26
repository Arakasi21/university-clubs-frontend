'use client'

import React, { useState, useEffect } from 'react'
import useEvent from '@/hooks/useEvent'
import useUserStore from '@/store/user'
import Nav from '@/components/NavBar'
import { AlertTriangle, CalendarDaysIcon, FileIcon, LocateIcon } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import Link from 'next/link'
import { DateTimeFormatOptions } from 'intl'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { useAxiosInterceptor } from '@/helpers/fetch_api'
import { toast } from 'sonner'
import { format } from 'date-fns'

type FormData = {
	title: string
	description: string
	start_date: string
	end_date: string
	location_uni: string
	location_link: string
	// tags: string
	max_participants: string
}

export default function EditEventPage({ params }: { params: { eventID: string } }) {
	const { user } = useUserStore()
	const { event, fetchEventInfo } = useEvent({ eventID: params.eventID, user })
	const isUserOrganizer = event?.organizers.some((organizer) => organizer.id === user?.id)

	const axiosAuth = useAxiosInterceptor()
	const [imageFile, setImageFile] = useState<File | null>(null)

	const [formData, setFormData] = useState<FormData>({
		title: event?.title || '',
		description: event?.description || '',
		start_date: event?.start_date ? format(new Date(event.start_date), "yyyy-MM-dd'T'HH:mm") : '',
		end_date: event?.end_date ? format(new Date(event.end_date), "yyyy-MM-dd'T'HH:mm") : '',
		location_uni: event?.location_university || '',
		location_link: event?.location_link || '',
		// tags: event?.tags.join(', ') || '',
		max_participants: event?.max_participants?.toString() || '', // ensure this is a string
	})

	useEffect(() => {
		if (event) {
			setFormData({
				title: event.title || '',
				description: event.description || '',
				start_date: event.start_date
					? format(new Date(event.start_date), "yyyy-MM-dd'T'HH:mm")
					: '',
				end_date: event.end_date ? format(new Date(event.end_date), "yyyy-MM-dd'T'HH:mm") : '',
				location_uni: event.location_university || '',
				location_link: event.location_link || '',
				// tags: event.tags.join(', ') || '',
				max_participants: event.max_participants?.toString() || '',
			})
		}
	}, [event])

	async function updateEvent(eventId: string, updatedEvent: any) {
		try {
			const response = await axiosAuth.patch(
				`${process.env.NEXT_PUBLIC_BACKEND_URL}/events/${eventId}`,
				updatedEvent,
			)

			if (response.status !== 200) {
				toast.error('Failed to update event')
				return
			}

			toast.success('Event successfully updated!')
			fetchEventInfo()
		} catch (error) {
			toast.error('Failed to update event')
		}
	}

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

				<div className="flex h-24 flex-col items-center justify-center pt-20">
					<span>Event not found / No access to view the event</span>
				</div>
			</>
		)
	}

	const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (e.target.files && e.target.files.length > 0) {
			setImageFile(e.target.files[0])
		}
	}

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
		const { name, value } = e.target
		setFormData({
			...formData,
			[name]: value,
		})
	}

	const handleSubmit = () => {
		const updatedEvent = {
			...formData,

			start_date: '2024-05-23 14:51:08.465 +0000 UTC', // Mock start_date
			end_date: '2024-05-30 14:51:08.465 +0000 UTC', // Mock end_date
			max_participants: parseInt(formData.max_participants),
		}
		fetchEventInfo()
		updateEvent(event.id, updatedEvent)
	}

	return (
		<>
			<Nav />
			<div className="mx-auto max-w-4xl pt-10">
				<section className="mb-4">
					{event.attached_images ? (
						event.attached_images.map((image) => (
							<div key={image.name} className="overflow-hidden rounded-lg">
								<img className="h-[400px] w-full" src={image.url} />
							</div>
						))
					) : (
						<span>No images</span>
					)}
					<div className="rounded-lg bg-[#030a20] p-6 sm:p-8">
						<div className="mb-4 flex flex-col items-start justify-between sm:flex-row sm:items-center">
							<div>
								<h2 className="mb-1 text-2xl font-semibold">
									<Input
										type="text"
										name="title"
										value={formData.title}
										onChange={handleInputChange}
										className="w-full"
									/>
								</h2>
								<p className="text-sm text-gray-400">
									<Textarea
										name="description"
										value={formData.description}
										onChange={handleInputChange}
										className="w-full"
									/>
								</p>
							</div>
							<div className="mt-4 flex items-center gap-4 sm:mt-0">
								<div className="flex items-center gap-2">
									<Input
										type="datetime-local"
										name="start_date"
										value={formData.start_date}
										onChange={handleInputChange}
										className="text-sm"
									/>
								</div>
								<div className="flex items-center gap-2">
									<Input
										type="datetime-local"
										name="end_date"
										value={formData.end_date}
										onChange={handleInputChange}
										className="text-sm"
									/>
								</div>
								<div className="flex items-center gap-2">
									<LocateIcon className="h-5 w-5 text-gray-400" />
									<Input
										type="text"
										name="location_uni"
										value={formData.location_uni} // Make it a controlled input
										onChange={handleInputChange}
										className="text-sm"
									/>
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
								{event.organizers.map((organizer) => (
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
									<Button className="h-8" variant="default" onClick={handleSubmit}>
										Update Event
									</Button>
								</div>
							)}
						</div>
					</div>
				</section>
				<section className="mb-4">
					<div className="rounded-lg bg-[#030a20] p-6 sm:p-8">
						<h3 className="mb-4 text-xl font-semibold">Cover Image</h3>

						{/* Image preview */}
						{imageFile ? (
							<img
								src={URL.createObjectURL(imageFile)}
								alt="Preview"
								className="mb-4 h-[200px] w-full rounded-lg object-cover"
							/>
						) : event.attached_images?.length > 0 ? (
							event.attached_images.map((image) => (
								<div key={image.name} className="overflow-hidden rounded-lg">
									<img className="h-[400px] w-full" src={image.url} />
								</div>
							))
						) : (
							<span>No images</span>
						)}

						{/* File input */}
						<input type="file" accept="image/*" onChange={handleImageUpload} />
					</div>
				</section>
			</div>
		</>
	)
}
