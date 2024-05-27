'use client'

import React, { useEffect, useState } from 'react'
import useEvent from '@/hooks/useEvent'
import useUserStore from '@/store/user'
import Nav from '@/components/NavBar'
import { AlertTriangle } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import Link from 'next/link'
import { DateTimeFormatOptions } from 'intl'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { useAxiosInterceptor } from '@/helpers/fetch_api'
import { toast } from 'sonner'
import { format } from 'date-fns'
import { CoverImage } from '@/types/event'
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { CardTitle } from '@/components/ui/card'

type FormData = {
	title: string
	description: string
	start_date: string
	end_date: string
	location_uni: string
	location_link: string
	max_participants: string
	cover_images: CoverImage[]
	type: string
	tags: string[]
}

export default function EditEventPage({ params }: { params: { eventID: string } }) {
	const { user } = useUserStore()
	const { event, fetchEventInfo } = useEvent({ eventID: params.eventID, user })
	const isUserOrganizer = event?.organizers.some((organizer) => organizer.id === user?.id)
	const [isPendingReview, setIsPendingReview] = useState(event?.status === 'PENDING')
	const isEditable = ['DRAFT', 'REJECTED'].includes(event?.status || '')

	const axiosAuth = useAxiosInterceptor()
	const [imageFile, setImageFile] = useState<File | null>(null)

	// ======== ПОЛЯ ФОРМЫ =========

	const [formData, setFormData] = useState<FormData>({
		title: event?.title || '',
		description: event?.description || '',
		start_date: event?.start_date ? format(new Date(event.start_date), "yyyy-MM-dd'T'HH:mm") : '',
		end_date: event?.end_date ? format(new Date(event.end_date), "yyyy-MM-dd'T'HH:mm") : '',
		location_uni: event?.location_university || '',
		location_link: event?.location_link || '',
		max_participants: event?.max_participants?.toString() || '',
		cover_images: event?.cover_images || [],
		type: event?.type || '',
		tags: event?.tags || [],
	})

	// ======== ПРОВЕРКА НА ЗАПОЛНЕННОСТЬ ПОЛЕЙ (условно если ли это и может ли SEND TO REVIEW) =========

	const isEventReadyForReview =
		event?.cover_images &&
		event?.title &&
		event.start_date &&
		event.end_date &&
		event.location_university &&
		event.type

	//  ==================== ТУТ МЫ ПРОСТО ЗАДАЕМ EVENT STATUS ЦВЕТА  ====================

	type EventStatusMapping = {
		[key: string]: { color: string; label: string }
	}

	const eventStatusMapping: EventStatusMapping = {
		DRAFT: { color: 'bg-gray-500', label: 'Draft' },
		PENDING: { color: 'bg-yellow-500', label: 'Pending' },
		APPROVED: { color: 'bg-blue-500', label: 'Approved' },
		REJECTED: { color: 'bg-red-500', label: 'Rejected' },
		IN_PROGRESS: { color: 'bg-green-500', label: 'In Progress' },
	}

	const eventStatus = eventStatusMapping[event?.status || 'DRAFT'] || {
		color: 'bg-gray-500',
		label: 'Unknown',
	}

	// ==================== ФОРМАТИРОВАНИЕ	ДАТЫ В ФОРМАТЕ 23 мая 2024 г. в 19:51 ====================

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

	// ====================	ДОБАВЛЯЕМ ТЕГИ ====================

	const [tags, setTags] = useState<string[]>(event?.tags || [])
	const [newTagInput, setNewTagInput] = useState<string>('')

	const handleAddTag = () => {
		if (newTagInput.trim() !== '') {
			setFormData((prevState) => ({
				...prevState,
				tags: [...prevState.tags, newTagInput],
			}))
			setNewTagInput('') // Очищаем ввод для следующего тега
		}
	}

	const handleRemoveTag = (tagToRemove: string) => {
		setFormData((prevState) => ({
			...prevState,
			tags: prevState.tags.filter((tag) => tag !== tagToRemove),
		}))
	}

	// ========  ПРИ ИЗМЕНЕНИИ ТЕГОВ В ФОРМЕ, МЕНЯЕМ ИХ В СТЕЙТЕ  =========

	useEffect(() => {
		setFormData((prevState) => ({
			...prevState,
			tags: tags,
		}))
	}, [tags])

	// ==================== ВСЕ ФУНКЦИИ ====================
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

	const handleSendToReview = async () => {
		if (!event) {
			toast.error('Event is not defined')
			return
		}

		try {
			const response = await axiosAuth.patch(
				`${process.env.NEXT_PUBLIC_BACKEND_URL}/events/${event.id}/review`,
			)

			if (response.status === 200) {
				toast.success('Event sent to review')
				event.status = 'PENDING'
				fetchEventInfo()
				setIsPendingReview(true)
			} else {
				toast.error('Failed to send event to review')
			}
		} catch (error) {
			console.error('There has been a problem with your fetch operation:', error)
		}
	}

	const handleRevokeReview = async () => {
		if (!event) {
			toast.error('Event is not defined')
			return
		}

		try {
			const response = await axiosAuth.delete(
				`${process.env.NEXT_PUBLIC_BACKEND_URL}/events/${event.id}/review`,
			)

			if (response.status === 200) {
				toast.success('Review successfully revoked')
				event.status = 'DRAFT'
				fetchEventInfo()
				setIsPendingReview(false)
			} else {
				toast.error('Failed to revoke review')
			}
		} catch (error) {
			console.error('There has been a problem with your fetch operation:', error)
		}
	}

	// ==================== HANDLE Функции ====================
	const handleFileSelection = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0]
		if (!file) {
			toast.error('No image selected')
			return
		}
		setImageFile(file)
	}

	async function handleImageUpload() {
		if (!imageFile) {
			toast.error('No image selected')
			return
		}
		const formData = new FormData()
		formData.append('image', imageFile)

		try {
			const response = await axiosAuth.post(
				`${process.env.NEXT_PUBLIC_BACKEND_URL}/events/${params.eventID}/upload/images`,
				formData,
				{
					headers: {
						'Content-Type': 'multipart/form-data',
					},
				},
			)

			if (response.status !== 200) {
				toast.error('Failed to upload image')
				return
			}

			toast.success('Image successfully uploaded!')
			return response.data
		} catch (error) {
			toast.error('Failed to upload image')
		}
	}

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
		const { name, value } = e.target
		setFormData({
			...formData,
			[name]: value,
		})
	}

	const handleSubmit = async () => {
		let uploadedImage
		if (imageFile) {
			uploadedImage = await handleImageUpload()
		}
		const updatedEvent = {
			...formData,
			cover_images: uploadedImage
				? [uploadedImage].map((image, index) => ({ ...image, position: index + 1 }))
				: [],
			start_date: '2024-05-23 14:51:08.465 +0000 UTC',
			end_date: '2024-05-30 14:51:08.465 +0000 UTC',
			max_participants: parseInt(formData.max_participants),
		}
		fetchEventInfo()
		if (event) {
			updateEvent(event.id, updatedEvent)
		} else {
			console.error('Event is null')
		}
	}

	//  ======== ПОЛУЧАЕМ ДАННЫЕ ИЗ БЭКЕНДА И ЗАПОЛНЯЕМ ПОЛЯ ФОРМЫ  =========

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
				max_participants: event.max_participants?.toString() || '',
				cover_images: event.cover_images || [],
				type: event.type || '',
				tags: event.tags || [],
			})
		}
		setIsPendingReview(event?.status === 'PENDING')
	}, [event, event?.status])

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
			<div className="mx-auto max-w-4xl pt-10">
				<section className="mb-4">
					{event.cover_images ? (
						event.cover_images.map((image) => (
							<div key={image.name} className="overflow-hidden rounded-lg">
								<img className="h-[600px] w-full" src={image.url} />
							</div>
						))
					) : (
						<span>No images</span>
					)}
					<div className="rounded-lg bg-[#030a20] p-6 sm:p-8">
						<CardTitle className="mb-2 flex items-center justify-center">EDIT EVENT</CardTitle>
						{/*<Separator />*/}
						<div className="mb-4 mt-2">
							<label className="text-sm text-gray-400">Title:</label>
							<Input
								type="text"
								name="title"
								value={formData.title}
								onChange={handleInputChange}
								className="w-full"
								disabled={!isEditable}
							/>
						</div>
						<div className="mb-2">
							<label className="text-sm text-gray-400">Description:</label>
							<Textarea
								name="description"
								value={formData.description}
								onChange={handleInputChange}
								className="w-full"
								disabled={!isEditable}
							/>
						</div>
						<div className="mb-2">
							<label className="text-sm text-gray-400">Type:</label>
							<Select
								name="type"
								value={formData.type}
								disabled={!isEditable}
								onValueChange={(value) => setFormData({ ...formData, type: value })}
							>
								<SelectTrigger className="w-[180px]">
									<SelectValue placeholder="Type" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="UNIVERSITY">UNIVERSITY</SelectItem>
									<SelectItem value="INTRA_CLUB">CLUB</SelectItem>
								</SelectContent>
							</Select>
						</div>
						<div className="mb-4">
							<label className="text-sm text-gray-400">Start Date:</label>
							<Input
								type="datetime-local"
								name="start_date"
								value={formData.start_date}
								onChange={handleInputChange}
								className="w-full"
								disabled={!isEditable}
							/>
						</div>
						<div className="mb-4">
							<label className="text-sm text-gray-400">End Date:</label>
							<Input
								type="datetime-local"
								name="end_date"
								value={formData.end_date}
								onChange={handleInputChange}
								className="w-full"
								disabled={!isEditable}
							/>
						</div>
						<div className="mb-4">
							<label className="text-sm text-gray-400">Location:</label>
							<Input
								type="text"
								name="location_uni"
								value={formData.location_uni}
								onChange={handleInputChange}
								className="w-full"
								disabled={!isEditable}
							/>
						</div>
						{/* ===================  ТЕГИ  ================*/}
						<div className="mb-4">
							<Label className="text-sm text-gray-400" htmlFor="tags">
								Tags:
							</Label>
							<div className="mt-2 flex flex-wrap gap-2 ">
								{formData.tags.map((tag, index) => (
									<div
										key={index}
										className="flex items-center rounded-lg  border-2 px-1 py-1 text-sm font-medium"
									>
										<span>{tag}</span>
										<Button
											disabled={!isEditable}
											variant="ghost"
											size="icon"
											onClick={() => handleRemoveTag(tag)}
											className="ml-2 h-2 w-2 text-red-500"
										>
											&times;
										</Button>
									</div>
								))}
								<div className="flex items-center gap-2">
									<Input
										disabled={!isEditable}
										type="text"
										id="tags"
										value={newTagInput}
										onChange={(e) => setNewTagInput(e.target.value)}
										className="rounded-md px-2 py-1 text-sm"
										placeholder="Enter new tag"
									/>
									<Button variant="default" disabled={!isEditable} onClick={handleAddTag}>
										Add Tag
									</Button>
								</div>
							</div>
						</div>

						{/*==================== COLLABORATORS =================*/}

						<div className="flex flex-col items-center justify-between sm:flex-row">
							<div className="flex items-center gap-2">
								{event.collaborator_clubs.map((club) => (
									<div key={club.id} className="flex items-center space-x-4 pb-2">
										<Avatar>
											<Link href={`/clubs/${club.id}`}>
												<AvatarImage src={club.logo_url || '/main_photo.jpeg'} alt={club.name} />
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
									{isUserOrganizer && event.status !== 'PENDING' && (
										<Button className="h-8" variant="secondary" onClick={handleSubmit}>
											Update Event
										</Button>
									)}

									{isUserOrganizer && isEventReadyForReview && event.status !== 'PENDING' && (
										<Button className="h-8" variant="default" onClick={handleSendToReview}>
											Send to Review
										</Button>
									)}
									{isPendingReview && (
										<Button
											className="h-8"
											variant="destructive"
											size="sm"
											onClick={handleRevokeReview}
										>
											Revoke Review
										</Button>
									)}
								</div>
							)}
						</div>
					</div>
				</section>

				{/* ================ COVER IMAGE ===============  */}

				<section className="mb-4">
					<div className="rounded-lg bg-[#030a20] p-6 sm:p-8">
						<h3 className="mb-4 text-xl font-semibold">Cover Image</h3>
						{imageFile ? (
							<img
								src={URL.createObjectURL(imageFile)}
								alt="Preview"
								className="mb-4 h-[400px] w-[400] rounded-lg object-cover"
							/>
						) : event.cover_images ? (
							event.cover_images
								.sort((a, b) => a.position - b.position)
								.map((image) => (
									<div key={image.position} className="overflow-hidden rounded-lg">
										<img className="h-[400px] w-[400] object-cover" src={image.url} />
									</div>
								))
						) : (
							<span>No images</span>
						)}
						<Input
							disabled={!isEditable}
							className="relative w-80"
							type="file"
							accept="image/*"
							onChange={handleFileSelection}
						/>
					</div>
				</section>
			</div>
		</>
	)
}
