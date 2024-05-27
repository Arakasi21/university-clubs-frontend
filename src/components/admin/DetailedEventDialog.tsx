import React from 'react'
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog'
import { Event } from '@/types/event'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useAxiosInterceptor } from '@/helpers/fetch_api'
import { toast } from 'sonner'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import Link from 'next/link'

type DetailedEventDialogProps = {
	event: Event | null
	isOpen: boolean
	onClose: () => void
	onDelete: () => void
}

export function DetailedEventDialog({
	event,
	isOpen,
	onClose,
	onDelete,
}: DetailedEventDialogProps) {
	const axiosAuth = useAxiosInterceptor()

	if (!event) return null

	const handleApproveEvent = async () => {
		try {
			const response = await axiosAuth.patch(
				`${process.env.NEXT_PUBLIC_BACKEND_URL}/events/${event.id}/approve`,
			)

			if (response.status.toString().startsWith('2')) {
				toast.success('Event approved successfully')
				onClose()
			} else {
				toast.error('Failed to approve event', { description: response.data.error })
			}
		} catch (error) {
			toast.error('Failed to approve event')
		}
	}

	const handleRejectEvent = async () => {
		try {
			const response = await axiosAuth.patch(
				`${process.env.NEXT_PUBLIC_BACKEND_URL}/events/${event.id}/reject`,
				{
					reason: 'because',
				},
			)

			if (response.status.toString().startsWith('2')) {
				toast.success('Event rejected successfully')
				onClose()
			} else {
				toast.error('Failed to reject event', { description: response.data.error })
			}
		} catch (error) {
			toast.error('Failed to reject event')
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
		<div>
			{/*{event.cover_images ? (*/}
			{/*	<img*/}
			{/*		alt="Event Cover"*/}
			{/*		className="  h-60 w-full rounded-xl object-cover"*/}
			{/*		src={event.cover_images[0].url}*/}
			{/*	/>*/}
			{/*) : (*/}
			{/*	<img*/}
			{/*		alt="Event Cover"*/}
			{/*		className="h-20 w-20 rounded-xl object-cover"*/}
			{/*		src="/placeholder.svg"*/}
			{/*	/>*/}
			{/*)}*/}
			<Dialog open={isOpen} onOpenChange={onClose}>
				<DialogContent className="sm:max-w-[800px]">
					<DialogHeader>
						<DialogTitle>{event.title}</DialogTitle>
						<DialogDescription>{event.id}</DialogDescription>
					</DialogHeader>
					<Tabs defaultValue="images" className="pt-4" activationMode="manual">
						<TabsList className="grid w-full grid-cols-4">
							<TabsTrigger value="images">Images</TabsTrigger>
							<TabsTrigger value="info">Event Info</TabsTrigger>
							<TabsTrigger value="organizers">Organizers</TabsTrigger>
							<TabsTrigger value="collaborators">Collaborator Clubs</TabsTrigger>
						</TabsList>

						{/* ============== INFO ============= */}

						<TabsContent value="info">
							<div className="grid gap-6 py-6">
								<div className="grid grid-cols-2 gap-4">
									<div className="space-y-2">
										<Label htmlFor="name">Name</Label>
										<Input
											id="name"
											className="cursor-default transition-colors duration-300 ease-in-out hover:bg-muted/50"
											readOnly
											value={event.title}
										/>
									</div>
									<div className="space-y-2">
										<Label htmlFor="type">Type</Label>
										<Input
											id="type"
											className="cursor-default transition-colors duration-300 ease-in-out hover:bg-muted/50"
											readOnly
											value={event.type}
										/>
									</div>
								</div>
								<div className="grid grid-cols-2 gap-4">
									<div className="space-y-2">
										<Label htmlFor="status">Status</Label>
										<Input
											id="status"
											className={`${eventStatus.color} text-md cursor-default text-white transition-colors duration-300 ease-in-out`}
											readOnly
											value={eventStatus.label}
										/>
									</div>
									<div className="space-y-2">
										<Label htmlFor="location">Location</Label>
										<Input
											id="location"
											className="cursor-default transition-colors duration-300 ease-in-out hover:bg-muted/50"
											readOnly
											value={event.location_university || event.location_link}
										/>
									</div>
								</div>
								<div className="grid grid-cols-2 gap-4">
									<div className="space-y-2">
										<Label htmlFor="start-date">Start Date</Label>
										<Input
											id="start-date"
											className="cursor-default transition-colors duration-300 ease-in-out hover:bg-muted/50"
											readOnly
											value={new Date(event.start_date).toLocaleString()}
										/>
									</div>
									<div className="space-y-2">
										<Label htmlFor="end-date">End Date</Label>
										<Input
											id="end-date"
											className="cursor-default transition-colors duration-300 ease-in-out hover:bg-muted/50"
											readOnly
											value={new Date(event.end_date).toLocaleString()}
										/>
									</div>
								</div>
								<div className="space-y-2">
									<Label htmlFor="description">Description</Label>
									<Textarea
										id="description"
										className="cursor-default transition-colors duration-300 ease-in-out hover:bg-muted/50"
										readOnly
										value={event.description}
									/>
								</div>
							</div>
						</TabsContent>

						{/* ============ IMAGES =========== */}

						<TabsContent value="images">
							<div className="gap-6">
								{event.cover_images ? (
									event.cover_images.map((image) => (
										<Card key={image.position}>
											<CardContent className="py-6">
												<img
													alt="Event Cover"
													className="h-96 w-full object-cover"
													src={image.url}
												/>
												<p className="text-center text-muted-foreground">cover image</p>
											</CardContent>
										</Card>
									))
								) : (
									<Card>
										<CardContent className="flex h-96 items-center justify-center">
											<p>No images</p>
										</CardContent>
									</Card>
								)}
							</div>
						</TabsContent>

						{/* ============ ORGANIZERS =========== */}
						<TabsContent value="organizers">
							<div className="grid gap-6 py-6">
								<div className="grid gap-4">
									<Label>Organizers</Label>
									<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
										{event.organizers.map((organizer) => (
											<Card key={organizer.id}>
												<Link href={`/user/${organizer.id}`}>
													<CardContent className="flex items-center gap-4 p-4">
														<Avatar className="h-12 w-12">
															<AvatarImage alt="Organizer 1" src={organizer.avatar_url} />
															<AvatarFallback>JD</AvatarFallback>
														</Avatar>
														<div>
															<div className="font-medium">
																{organizer.first_name} {organizer.last_name}
															</div>
															{organizer.id === event.owner_id ? (
																<div className="text-sm text-gray-500 dark:text-gray-400">
																	Lead Organizer
																</div>
															) : (
																<div className="text-sm text-gray-500 dark:text-gray-400">
																	Co-Organizer
																</div>
															)}
														</div>
													</CardContent>
												</Link>
											</Card>
										))}
									</div>
								</div>
							</div>
						</TabsContent>

						{/* ============ ORGANIZERS =========== */}
						<TabsContent value="collaborators">
							<div className="grid gap-6 py-6">
								<div className="grid gap-4">
									<Label>Collaborator Clubs</Label>
									<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
										{event.collaborator_clubs.map((club) => (
											<Card key={club.id}>
												<Link href={`/clubs/${club.id}`}>
													<CardContent className="flex items-center gap-4 p-4">
														<Avatar className="h-12 w-12">
															<AvatarImage alt="Club 1" src={club.logo_url} />
															<AvatarFallback>JD</AvatarFallback>
														</Avatar>
														<div>
															<div className="font-medium">{club.name}</div>
															{club.id === event.club_id ? (
																<div className="text-sm text-gray-500 dark:text-gray-400">
																	Lead Organizer
																</div>
															) : (
																<div className="text-sm text-gray-500 dark:text-gray-400">
																	Co-Organizer
																</div>
															)}
														</div>
													</CardContent>
												</Link>
											</Card>
										))}
									</div>
								</div>
							</div>
						</TabsContent>
					</Tabs>

					<DialogFooter>
						<Button className="mr-auto" variant={'destructive'} onClick={onDelete}>
							Delete Event
						</Button>
						{event.status === 'PENDING' && (
							<>
								<Button variant={'outline'} onClick={handleRejectEvent}>
									Reject Event
								</Button>
								<Button className="bg-green-500" variant={'default'} onClick={handleApproveEvent}>
									Approve Event
								</Button>
							</>
						)}
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</div>
	)
}
