import { Event } from '@/types/event'
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import React from 'react'

interface DraftEventDialogProps {
	event: Event | null
	isOpen: boolean
	onClose: () => void
	onEventClick: (event: Event) => void
}

export default function DraftEventDialog({ event, isOpen, onClose }: DraftEventDialogProps) {
	if (!event) return null
	return (
		<Dialog open={isOpen} onOpenChange={onClose}>
			<DialogContent className="sm:max-w-[525px]">
				<DialogHeader>
					<DialogTitle>Event Details</DialogTitle>
					<DialogDescription></DialogDescription>
				</DialogHeader>
				<div className="grid gap-4 ">
					<Card>
						<CardHeader>
							<CardTitle>Collaborators</CardTitle>
						</CardHeader>
						<CardContent>
							{event.collaborator_clubs.map((club) => (
								<div key={club.id} className="flex items-center space-x-4 pb-2">
									<Avatar>
										<Link href={`/clubs/${club.id}`}>
											<AvatarImage src={club.logo_url} alt={club.name} />
										</Link>
										<AvatarFallback>{club.name.charAt(0)}</AvatarFallback>
									</Avatar>
									<p>
										<Link href={`/clubs/${club.id}`}>
											<span className="font-medium">{club.name}</span>{' '}
										</Link>
									</p>
									{club.id === event.club_id && <Badge variant="default">Owner</Badge>}
								</div>
							))}
						</CardContent>
					</Card>

					<Card>
						<CardHeader>
							<CardTitle>Organizers</CardTitle>
						</CardHeader>
						<CardContent>
							{event.organizers.map((organizer) => (
								<div key={organizer.id} className="flex items-center space-x-4 pb-2">
									<Avatar>
										<Link href={`/user/${organizer.id}`}>
											<AvatarImage src={organizer.avatar_url} alt={organizer.first_name} />
										</Link>
										<AvatarFallback>{organizer.first_name.charAt(0)}</AvatarFallback>
									</Avatar>
									<p>
										<span className="font-medium">
											<Link href={`/user/${organizer.id}`}>
												{organizer.first_name} {organizer.last_name}
											</Link>
										</span>
									</p>
									{organizer.club_id === event.club_id && organizer.id === event.owner_id && (
										<Badge variant="default">Owner</Badge>
									)}
								</div>
							))}
						</CardContent>
					</Card>
					<Card>
						<CardHeader>
							<CardTitle>General Information</CardTitle>
						</CardHeader>
						<CardContent>
							<p>
								<span className="font-medium">Event Id: {event.id}</span>
							</p>
							<p>
								<span className="font-medium">Club Id: {event.club_id}</span>
							</p>
							<p>
								<span className="font-medium">Owner Id: {event.owner_id}</span>
							</p>
						</CardContent>
					</Card>
				</div>
			</DialogContent>
		</Dialog>
	)
}
