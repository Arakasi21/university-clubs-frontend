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
import { Event } from '@/types/event'
import Link from 'next/link'

export function EventInfo({ data }: { data: Event }) {
	return (
		<>
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
									<span className="font-medium">Event Id: {data.id}</span>
								</p>
								<p>
									<span className="font-medium">Club Id: {data.club_id}</span>
								</p>
								<p>
									<span className="font-medium">Owner Id: {data.owner_id}</span>
								</p>
							</CardContent>
						</Card>
						<Card>
							<CardHeader>
								<CardTitle>Collaborators</CardTitle>
							</CardHeader>
							<CardContent>
								{data.collaborator_clubs.map((club) => (
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
										{club.id === data.club_id && <Badge variant="default">Owner</Badge>}
									</div>
								))}
							</CardContent>
						</Card>

						<Card>
							<CardHeader>
								<CardTitle>Organizers</CardTitle>
							</CardHeader>
							<CardContent>
								{data.organizers.map((organizer) => (
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
										{organizer.club_id === data.club_id && organizer.id === data.owner_id && (
											<Badge variant="default">Owner</Badge>
										)}
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
									<span className="font-medium">Created At Date:</span> {data.created_at}
								</p>
								<p>
									<span className="font-medium">Start Date:</span> {data.start_date}
								</p>
								<p>
									<span className="font-medium">End Date:</span> {data.end_date}
								</p>
							</CardContent>
						</Card>
					</div>
				</CardContent>
				<CardFooter>
					<Badge variant="default">Status: {data.status}</Badge>
				</CardFooter>
			</Card>
		</>
	)
}
