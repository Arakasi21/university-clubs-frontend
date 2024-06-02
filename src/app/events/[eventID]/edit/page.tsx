'use client'

import React, { useCallback, useEffect, useState } from 'react'
import useEvent from '@/hooks/useEvent'
import useUserStore from '@/store/user'
import Nav from '@/components/NavBar'
import { AlertTriangle, XIcon } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { useAxiosInterceptor } from '@/helpers/fetch_api'
import { toast } from 'sonner'
import { CoverImage, Participant } from '@/types/event'
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import InviteOrganizerDialog from '@/components/events/inviteOrganizerDialog'
import InviteCollaboratorDialog from '@/components/events/InviteCollaboratorDialog'
import { CollaboratorInvite, OrganizerInvite } from '@/types/invite'
import { getEventStatus } from '@/lib/eventStatusUtils'
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import axios from 'axios'
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table'
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog'

type FormData = {
	title: string
	description: string
	start_date: string
	end_date: string
	location_uni: string
	location_link: string
	// max_participants: string
	cover_images: CoverImage[]
	type: string
	tags: string[]
	[key: string]: string | CoverImage[] | string[]
}

export default function EditEventPage({ params }: { params: { eventID: string } }) {
	const { user } = useUserStore()
	const { event, fetchEventInfo } = useEvent({ eventID: params.eventID, user })
	const isUserOrganizer = event?.organizers.some((organizer) => organizer.id === user?.id)
	const [participants, setParticipants] = useState([])

	const [isKickDialogOpen, setIsKickDialogOpen] = useState(false)
	const [isBanDialogOpen, setIsBanDialogOpen] = useState(false)

	const [isPendingReview, setIsPendingReview] = useState(event?.status === 'PENDING')
	const isEditable = ['DRAFT', 'REJECTED', 'APPROVED', 'IN_PROGRESS'].includes(event?.status || '')

	const [collaboratorInvites, setCollaboratorInvites] = useState<CollaboratorInvite[]>([])
	const [organizerInvites, setOrganizerInvites] = useState<OrganizerInvite[]>([])

	const [isContextMenuOpen, setIsContextMenuOpen] = useState<number | null>(null)
	const [banReason, setBanReason] = useState('')

	const axiosAuth = useAxiosInterceptor()
	const [imageFile, setImageFile] = useState<File | null>(null)

	const [selectedUserId, setSelectedUserId] = useState<number | null>(null)

	// ======== ПОЛЯ ФОРМЫ =========

	const [formData, setFormData] = useState<FormData>({
		title: event?.title || '',
		description: event?.description || '',
		start_date: event?.start_date ? event.start_date : '',
		end_date: event?.end_date ? event.end_date : '',
		location_uni: event?.location_university || '',
		location_link: event?.location_link || '',
		// max_participants: event?.max_participants?.toString() || '',
		cover_images: event?.cover_images || [],
		type: event?.type || '',
		tags: event?.tags || [],
	})

	// ======== ПРОВЕРКА НА ЗАПОЛНЕННОСТЬ ПОЛЕЙ (условно если ли это и может ли SEND TO REVIEW) =========

	const isEventReadyForReview =
		event?.cover_images &&
		event?.title &&
		event.description &&
		event.start_date &&
		event.end_date &&
		event.location_university &&
		event.type

	// const editableFields = [
	// 	'max_participants',
	// 	'location_link',
	// 	'location_university',
	// 	'start_date',
	// 	'end_date',
	// 	'is_hidden_for_non_members',
	// ]

	//  ==================== ТУТ МЫ ПРОСТО ЗАДАЕМ EVENT STATUS ЦВЕТА  ====================

	const eventStatus = getEventStatus(event?.status || 'DRAFT')

	// ====================	ДОБАВЛЯЕМ ТЕГИ ====================

	const [tags] = useState<string[]>(event?.tags || [])
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

	const confirmKickMember = useCallback(() => {
		if (selectedUserId !== null) {
			handleKickMember(selectedUserId)
		}
		setIsKickDialogOpen(false)
	}, [selectedUserId])

	const confirmBanMember = useCallback(() => {
		if (selectedUserId !== null) {
			handleBanMember(selectedUserId)
		}
		setIsBanDialogOpen(false)
	}, [selectedUserId])

	const openKickDialog = (userId: number) => {
		setSelectedUserId(userId)
		setIsKickDialogOpen(true)
	}

	const openBanDialog = (userId: number) => {
		setSelectedUserId(userId)
		setIsBanDialogOpen(true)
	}

	async function fetchParticipants(eventId: string) {
		if (!eventId) {
			return
		}
		try {
			const response = await axios.get(
				`${process.env.NEXT_PUBLIC_BACKEND_URL}/events/${eventId}/participants`,
			)
			if (response.status === 200) {
				return response.data.participants
			} else {
				console.error(`Failed to fetch participants: ${response.status}`)
				return []
			}
		} catch (error) {
			console.error(`Failed to fetch participants: ${error}`)
			return []
		}
	}

	useEffect(() => {
		if (!event?.id) {
			return
		}
		fetchParticipants(event.id).then(setParticipants)
	}, [event?.id])

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
			await fetchEventInfo()
		} catch (error) {
			toast.error('Failed to update event')
		}
	}

	const handleSendToReview = async () => {
		if (!event) {
			return
		}

		try {
			const response = await axiosAuth.patch(
				`${process.env.NEXT_PUBLIC_BACKEND_URL}/events/${event.id}/review`,
			)

			if (response.status === 200) {
				toast.success('Event sent to review')
				event.status = 'PENDING'
				await fetchEventInfo()
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
			return
		}

		try {
			const response = await axiosAuth.delete(
				`${process.env.NEXT_PUBLIC_BACKEND_URL}/events/${event.id}/review`,
			)

			if (response.status === 200) {
				toast.success('Review successfully revoked')
				event.status = 'DRAFT'
				await fetchEventInfo()
				setIsPendingReview(false)
			} else {
				toast.error('Failed to revoke review')
			}
		} catch (error) {
			console.error('There has been a problem with your fetch operation:', error)
		}
	}

	const fetchInvites = async () => {
		try {
			const [collaboratorsRes, organizersRes] = await Promise.all([
				axiosAuth.get(
					`${process.env.NEXT_PUBLIC_BACKEND_URL}/events/${params.eventID}/invites/collaborators`,
				),
				axiosAuth.get(
					`${process.env.NEXT_PUBLIC_BACKEND_URL}/events/${params.eventID}/invites/organizers`,
				),
			])

			if (collaboratorsRes.status === 200 && organizersRes.status === 200) {
				setCollaboratorInvites(collaboratorsRes.data.invites)
				setOrganizerInvites(organizersRes.data.invites)
			} else {
				toast.error('Failed to fetch invites')
			}
		} catch (error) {
			toast.error('Failed to fetch invites')
		}
	}

	useEffect(() => {
		fetchInvites()
	}, [])

	async function revokeInvite(inviteID: string, type: string) {
		try {
			const response = await axiosAuth.delete(
				`${process.env.NEXT_PUBLIC_BACKEND_URL}/events/invites/${inviteID}/${type}`,
			)

			if (response.status.toString().startsWith('2')) {
				toast.success('Invite revoked successfully')
				await fetchInvites() // Refresh the invites
			} else {
				toast.error('Failed to revoke invite', { description: response.data.error })
			}
		} catch (error) {
			toast.error('Failed to revoke invite')
		}
	}

	// ======================== HANDLE KICK REMOVE PARTICIPANTS

	const handleKickMember = async (userId: number) => {
		if (!event) {
			console.error('Event is null')
			return
		}
		try {
			await axiosAuth.delete(
				`${process.env.NEXT_PUBLIC_BACKEND_URL}/events/${event.id}/participants/${userId}`,
			)
			toast.success('Participant kicked')
			fetchParticipants(event.id).then(setParticipants)
		} catch (error) {
			toast.error('Failed to kick participant')
		}
	}

	const handleBanMember = async (userId: number) => {
		if (!event) {
			console.error('Event is null')
			return
		}
		try {
			await axiosAuth.post(
				`${process.env.NEXT_PUBLIC_BACKEND_URL}/events/${event.id}/participants/${userId}/ban`,
				{ reason: banReason },
			)
			fetchParticipants(event.id).then(setParticipants)
		} catch (error) {
			toast.error('Failed to ban participant')
		}
	}

	// ======================== HANDLE KICK REMOVE ORGANIZERS

	const handleKickOrganizer = async (userId: number) => {
		if (!event) {
			console.error('Event is null')
			return
		}
		try {
			await axiosAuth.delete(
				`${process.env.NEXT_PUBLIC_BACKEND_URL}/events/${event.id}/organizers/${userId}`,
			)
			toast.success('Organizer kicked')
		} catch (error) {
			toast.error('Failed to kick organizer')
		}
	}

	const handleRemoveCollaborator = async (clubId: number) => {
		if (!event) {
			console.error('Event is null')
			return
		}
		try {
			await axiosAuth.delete(
				`${process.env.NEXT_PUBLIC_BACKEND_URL}/events/${event.id}/collaborators/${clubId}`,
			)
			toast.success('Collaborator removed')
		} catch (error) {
			toast.error('Failed to remove collaborator')
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

		const updatedEvent: Partial<FormData> = {}

		for (const key in formData) {
			if (event && formData[key] !== event[key]) {
				updatedEvent[key] = formData[key]
			}
		}

		if (uploadedImage) {
			updatedEvent.cover_images = [uploadedImage].map((image, index) => ({
				...image,
				position: index + 1,
			}))
		}

		await fetchEventInfo()
		if (event) {
			await updateEvent(event.id, updatedEvent)
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
				start_date: new Date().toISOString().slice(0, 16) ? event.start_date : '',
				end_date: event.end_date ? event.end_date : '',
				location_uni: event.location_university || '',
				location_link: event.location_link || '',
				// max_participants: event.max_participants?.toString() || '',
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
					<div className="relative">
						{event.cover_images ? (
							<>
								<img
									alt="Event Cover"
									className="absolute inset-0 h-full w-full object-cover blur-lg filter"
									src={event.cover_images[0].url}
								/>
								<img
									alt="Event Cover"
									className="relative m-auto h-[500px] rounded-md object-scale-down drop-shadow-md"
									src={event.cover_images[0].url}
								/>
							</>
						) : (
							<img
								alt="Event Cover"
								className="aspect-[2/1] w-full rounded-xl object-cover"
								src="/main_photo.jpeg"
							/>
						)}
					</div>
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

							{/* =================== EVENT STATUS =================*/}

							{isUserOrganizer && (
								<div className="flex flex-row items-center gap-2">
									{event.status === 'DRAFT' ? (
										<div className="my-2 flex items-center space-x-2 text-xs">
											<AlertTriangle className="h-5 w-5 text-yellow-500" />
											<div className="rounded-md bg-yellow-500 px-2 py-2 text-xs text-white">
												{eventStatus.label}
											</div>
										</div>
									) : (
										<div className="my-2 flex items-center space-x-2 text-xs">
											<div
												className={`rounded-md px-2 py-2 text-xs text-white ${eventStatus.color}`}
											>
												{eventStatus.label}
											</div>
										</div>
									)}

									{/*CHECKING */}
									{isUserOrganizer && event.status !== 'PENDING' && (
										<Button className="h-8" variant="secondary" onClick={handleSubmit}>
											Update Event
										</Button>
									)}

									{isUserOrganizer &&
										isEventReadyForReview &&
										event.status == 'DRAFT' &&
										formData.type === 'UNIVERSITY' && (
											<Button className="h-8" variant="default" onClick={handleSendToReview}>
												Send to Review
											</Button>
										)}

									{isUserOrganizer &&
										isEventReadyForReview &&
										event.status == 'DRAFT' &&
										formData.type === 'INTRA_CLUB' && (
											<span className="w-40 text-xs">
												You now can publish event. Please, return to the event page to publish the
												event
											</span>
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
						<h3 className=" text-xl font-semibold">Cover Image</h3>
						<p className=" mb-4 text-sm text-gray-400"> Upload a cover image for your event.</p>

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
										<img className="h-[400px] w-[400] object-cover" src={image.url} alt="alt" />
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

				{/* ============================ ADD COLLABORATORS ============================ */}
				<section className="mb-4">
					<div className="rounded-lg bg-[#030a20] p-6 sm:p-8">
						<div className="kitems-center flex flex-col gap-4 sm:flex-row">
							<div>
								<h3 className="text-xl font-semibold">Invite Club Collaborators</h3>
								<p className="mb-4 text-sm text-gray-400">
									Manage the clubs that can access and edit this event.
								</p>
							</div>
							<InviteCollaboratorDialog
								eventID={params.eventID}
								fetchInvites={fetchInvites}
								invitedClubs={collaboratorInvites || []}
							/>
						</div>

						{Array.isArray(collaboratorInvites) && collaboratorInvites.length > 0 && (
							<div className="mt-4">
								<h4 className="text-lg font-semibold">Pending Club Invites</h4>
								<ul>
									{collaboratorInvites.map((invite) => (
										<li key={invite.id} className="flex items-center space-x-2">
											<div className="flex items-center py-2">
												<Link href={`/clubs/${invite.club.id}`}>
													<img
														src={invite.club?.logo_url || '/main_photo.jpeg'}
														alt={invite.club.name}
														className="w-10 rounded-full"
													/>
												</Link>
												<div className="px-2 font-medium">{invite.club.name} </div>
											</div>
											<div className="m-0 mt-0 flex items-center justify-center p-0">
												<Button
													size="sm"
													className="mt-0"
													variant="ghost"
													onClick={() => revokeInvite(invite.id, 'collaborators')}
												>
													<XIcon className="h-4 w-4" />
													<span className="sr-only">Revoke invite</span>
												</Button>
											</div>
										</li>
									))}
								</ul>
							</div>
						)}
					</div>
				</section>

				{/* ============================ ADD ORGANIZERS ============================ */}
				<section className="mb-4">
					<div className="rounded-lg bg-[#030a20] p-6 sm:p-8">
						<div className="flex flex-col items-center gap-4 sm:flex-row">
							<div>
								<h3 className="text-xl font-semibold">Add Organizers</h3>
								<p className="mb-4 text-sm text-gray-400">
									Manage the people who can access and edit this event.
								</p>
							</div>
							<InviteOrganizerDialog
								eventID={params.eventID}
								fetchInvites={fetchInvites}
								organizerInvites={organizerInvites || []}
							/>
						</div>
						{Array.isArray(organizerInvites) && organizerInvites.length > 0 && (
							<div className="mt-4">
								<h4 className="text-lg font-semibold">Pending Organizer Invites</h4>
								<ul className="items-center p-2">
									{organizerInvites.map((invite) => (
										<li
											key={invite.id}
											className="flex items-center justify-between space-x-2 space-y-6"
										>
											<div className="flex flex-row items-center gap-2 ">
												<Avatar className="h-12 w-12">
													<AvatarImage src={invite.user.avatar_url} alt={invite.user.first_name} />
													<AvatarFallback>{invite.user.first_name[0]}</AvatarFallback>
												</Avatar>
												<div>
													<div>
														{invite.user.first_name} {invite.user.last_name}
													</div>
													<div className="text-sm text-gray-500 dark:text-gray-400">
														{invite.user.barcode}
													</div>
												</div>
											</div>
											<div className="m-0 mt-0 flex items-center justify-center p-0">
												<Button
													size="sm"
													className="mt-0"
													variant="ghost"
													onClick={() => revokeInvite(invite.id, 'organizers')}
												>
													<XIcon className="h-4 w-4" />
													<span className="sr-only">Revoke invite</span>
												</Button>
											</div>
										</li>
									))}
								</ul>
							</div>
						)}
					</div>
				</section>
				{/*TODO Attach files section DO LATER*/}
				<section>
					<div className="rounded-lg bg-[#030a20] p-6 sm:p-8">
						<h3 className="text-xl font-semibold">Attach Files</h3>
						<p className="mb-4 text-sm text-gray-400">Attach files to your event.</p>
						<Input
							disabled={!isEditable}
							className="relative w-80"
							type="file"
							accept="application/pdf"
							// onChange={handleFileSelection}
						/>
					</div>
				</section>

				<section className="my-4">
					<Card className="bg-[#030a20]">
						<CardHeader>
							{' '}
							<CardTitle>Participants</CardTitle>
						</CardHeader>
						<CardContent>
							<Table>
								<TableHeader>
									<TableRow>
										<TableHead className="hidden sm:table-cell">Avatar</TableHead>
										<TableHead className="text-left">Name</TableHead>
										<TableHead className="text-left">Surname</TableHead>
										<TableHead className="hidden md:table-cell">Barcode</TableHead>
									</TableRow>
								</TableHeader>
								<TableBody>
									{participants &&
										participants.map((participant: Participant) => (
											<TableRow
												key={participant.id}
												onContextMenu={(e) => {
													e.preventDefault()
													setIsContextMenuOpen(participant.id)
												}}
												onClick={(e) => {
													e.preventDefault()
													setIsContextMenuOpen(participant.id)
												}}
											>
												<DropdownMenu
													open={isContextMenuOpen === participant.id}
													onOpenChange={(isOpen) =>
														setIsContextMenuOpen(isOpen ? participant.id : null)
													}
													modal={true}
												>
													<TableCell className="hidden sm:table-cell">
														<Avatar style={{ width: 44, height: 44 }}>
															<AvatarImage
																src={participant?.avatar_url}
																alt={`${participant?.first_name}'s profile picture`}
															/>
															<AvatarFallback style={{ fontSize: 44 / 4 }}>
																{participant?.first_name.slice(0, 1)}
															</AvatarFallback>
														</Avatar>
													</TableCell>
													<TableCell className="text-left">{participant.first_name}</TableCell>
													<TableCell className="text-left">{participant.last_name}</TableCell>
													<TableCell className="hidden md:table-cell">
														{participant.barcode}
													</TableCell>
													<DropdownMenuContent>
														<DropdownMenuItem>
															<Link href={`/user/${participant.id}`}>{participant.first_name}</Link>
														</DropdownMenuItem>
														{user?.id !== participant.id && (
															<>
																<DropdownMenuSeparator />
																<DropdownMenuItem onClick={() => openKickDialog(participant.id)}>
																	<p style={{ color: 'orange' }}>Kick</p>
																</DropdownMenuItem>
																<DropdownMenuItem onClick={() => openBanDialog(participant.id)}>
																	<p style={{ color: 'red' }}>Ban</p>
																</DropdownMenuItem>
															</>
														)}
													</DropdownMenuContent>
													<DropdownMenuTrigger></DropdownMenuTrigger>
												</DropdownMenu>
												<Dialog open={isKickDialogOpen} onOpenChange={setIsKickDialogOpen}>
													<DialogContent>
														<DialogHeader>
															<DialogTitle>Are you absolutely sure?</DialogTitle>
															<DialogDescription>
																This will permanently kick the user from the event.
															</DialogDescription>
														</DialogHeader>
														<Button variant={'destructive'} onClick={confirmKickMember}>
															Yes, kick the user
														</Button>
														<Button onClick={() => setIsKickDialogOpen(false)}>No, cancel</Button>
													</DialogContent>
												</Dialog>
												<Dialog open={isBanDialogOpen} onOpenChange={setIsBanDialogOpen}>
													<DialogContent>
														<DialogHeader>
															<DialogTitle>Are you absolutely sure?</DialogTitle>
															<DialogDescription>
																This will permanently ban the user from the event.
															</DialogDescription>
														</DialogHeader>
														<Input
															type="text"
															value={banReason}
															onChange={(e) => setBanReason(e.target.value)}
															placeholder="Enter ban reason"
														/>
														<Button variant={'destructive'} onClick={confirmBanMember}>
															Yes, ban the user
														</Button>
														<Button onClick={() => setIsBanDialogOpen(false)}>No, cancel</Button>
													</DialogContent>
												</Dialog>
											</TableRow>
										))}
								</TableBody>
							</Table>
						</CardContent>
					</Card>
				</section>
			</div>
		</>
	)
}
