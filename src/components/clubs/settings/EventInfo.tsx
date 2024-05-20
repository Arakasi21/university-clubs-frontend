import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import React from 'react'

interface Club {
	id: number
	name: string
	logo_url: string
}

interface Organizer {
	id: number
	first_name: string
	last_name: string
	avatar_url: string
	club_id: number
}

interface Event {
	id: string
	club_id: number
	owner_id: number
	collaborator_clubs: Club[]
	organizers: Organizer[]
	start_date: string
	end_date: string
	created_at: string
	updated_at: string
	deleted_at: string
	status: string
}

interface ResponseData {
	event: Event
}

export function EventInfo({ data }: { data: ResponseData }) {
	return (
		// TODO get event
		<Card className="mt-4 p-4 text-sm">
			<CardHeader>
				<CardTitle>Event Details</CardTitle>
				<CardDescription>Comprehensive information about the event</CardDescription>
			</CardHeader>
			<CardContent>
				<div className="space-y-4">
					<Card>
						<CardHeader>
							<CardTitle>General Information</CardTitle>
						</CardHeader>
						<CardContent>
							<p>
								<span className="font-medium">Even Id:</span> {data.event.id}
							</p>
							<p>
								<span className="font-medium">Club Id:</span> {data.event.club_id}
							</p>
							<p>
								<span className="font-medium">Owner Id:</span> {data.event.owner_id}
							</p>
						</CardContent>
					</Card>
					<Card>
						<CardHeader>
							<CardTitle>Collaborators</CardTitle>
						</CardHeader>
						<CardContent>
							{data.event.collaborator_clubs.map((club) => (
								<div key={club.id} className="flex items-center space-x-4">
									<Avatar>
										<AvatarImage src={club.logo_url} alt={club.name} />
										<AvatarFallback>{club.name.charAt(0)}</AvatarFallback>
									</Avatar>
									<p>
										<span className="font-medium">Name:</span> {club.name}
									</p>
									{club.id === data.event.club_id && <Badge variant="default">Owner</Badge>}
								</div>
							))}
						</CardContent>
					</Card>

					<Card>
						<CardHeader>
							<CardTitle>Organizers</CardTitle>
						</CardHeader>
						<CardContent>
							{data.event.organizers.map((organizer) => (
								<div key={organizer.id} className="flex items-center space-x-4">
									<Avatar>
										<AvatarImage src={organizer.avatar_url} alt={organizer.first_name} />
										<AvatarFallback>{organizer.first_name.charAt(0)}</AvatarFallback>
									</Avatar>
									<p>
										<span className="font-medium">Name:</span> {organizer.first_name}{' '}
										{organizer.last_name}
									</p>
									{organizer.club_id === data.event.club_id &&
										organizer.id === data.event.owner_id && <Badge variant="default">Owner</Badge>}
								</div>
							))}
						</CardContent>
					</Card>

					<Card>
						<CardHeader>
							<CardTitle>Event Dates</CardTitle>
						</CardHeader>
						<CardContent>
							<p>
								<span className="font-medium">Created At Date:</span> {data.event.created_at}
							</p>
							<p>
								<span className="font-medium">Start Date:</span> {data.event.start_date}
							</p>
							<p>
								<span className="font-medium">End Date:</span> {data.event.end_date}
							</p>
						</CardContent>
					</Card>
				</div>
			</CardContent>
			<CardFooter>
				<Badge variant="default">Status: {data.event.status}</Badge>
			</CardFooter>
		</Card>
	)
}
