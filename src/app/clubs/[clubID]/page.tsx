'use client'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import UserAvatar from '@/components/user/userAvatar'
import useClub from '@/hooks/useClub'
import useUserClubStatus from '@/hooks/useUserClubStatus'
import useMemberRoles from '@/hooks/useMemberRoles'
import useUserStore from '@/store/user'
import useUserRolesStore from '@/store/useUserRoles'
import { hasPermission } from '@/helpers/permissions'
import { Permissions } from '@/types/permissions'
import ClubImage from '@/components/clubs/ClubImage'
import Nav from '@/components/NavBar'
import React, { useEffect, useState } from 'react'
import { decimalToRgb } from '@/helpers/helper'
import SceletonClub from '@/components/Sceletons/SkeletonClub'
import SceletonMain from '@/components/Sceletons/SkeletonMain'
import { Calendar, CalendarIcon, Inbox, Medal } from 'lucide-react'
import { Event } from '@/types/event'
import ClubMembersCard from '@/components/clubs/ClubMembersCard'

function Page({ params }: { params: { clubID: number } }) {
	const [isLoading, setIsLoading] = useState(true)

	const { user } = useUserStore()
	const { club, clubMembers, isOwner } = useClub({ clubID: params.clubID, user })
	const { memberStatus, handleJoinRequest, handleLeaveClub } = useUserClubStatus({
		clubID: params.clubID,
	})
	const { permissions } = useUserRolesStore()
	const { isLoggedIn } = useUserStore()

	const membersWithoutPresident = clubMembers?.filter((member) => {
		const memberRole = club?.roles?.find((role) => role.id === member.roles[1])
		return memberRole?.name !== 'President'
	})
	const membersCount = membersWithoutPresident?.length

	const [clubEvents, setClubEvents] = useState<Event[] | null>()

	const fetchClubEvents = async () => {
		try {
			const response = await fetch(
				`${process.env.NEXT_PUBLIC_BACKEND_URL}/clubs/${params.clubID}/events?page=1&page_size=30`,
				{
					method: 'GET',
				},
			)

			if (response.ok) {
				const data = await response.json()
				setClubEvents(data.events)
			} else {
				console.error('Failed to fetch events')
			}
		} catch (err) {
			console.error('Network Error: Unable to fetch events')
		}
	}

	useEffect(() => {
		fetchClubEvents()
	}, [])

	useMemberRoles({
		club: club || null,
		user: user,
		userStatus: memberStatus,
		shouldFetch: memberStatus === 'MEMBER',
	})

	useEffect(() => {
		if (club) {
			setIsLoading(false)
		}
	}, [club])

	if (isLoading) {
		return <SceletonClub />
	}

	return (
		<>
			<Nav />

			<div className="flex min-h-screen flex-col bg-[#020817] text-white">
				{isLoading ? (
					<SceletonMain />
				) : (
					<div className="bg-[#020817] px-6 py-12">
						<div className="mx-auto max-w-6xl">
							<div className=" rounded-lg bg-[#0c1125]">
								<div
									style={{ backgroundImage: `url(${club?.banner_url ?? '/main_photo.jpeg'})` }}
									className="h-40 w-full rounded-t-lg bg-cover bg-center"
								/>
								<div className="flex items-center justify-between gap-4 p-6">
									<div className="flex items-center gap-2">
										<div className="flex shrink-0 overflow-hidden rounded-full ">
											<ClubImage club={club} width={84} height={84} />
										</div>
										<div className="pl-4">
											<CardTitle>{club?.name}</CardTitle>
											<CardDescription>{club?.description}</CardDescription>
											<CardDescription className="pt-2">
												{club?.num_of_members} members
											</CardDescription>
										</div>
									</div>
									<div className="flex flex-row gap-3 ">
										{hasPermission(permissions, Permissions.ALL) && (
											<div className="flex gap-3">
												<Link href={`/clubs/${club?.id}/settings`}>
													<Button variant="default">Settings</Button>
												</Link>
												<Link href={`/clubs/${club?.id}/todo`}>
													<Button>Notion Link</Button>
												</Link>
											</div>
										)}
										{isLoggedIn && (
											<>
												{memberStatus === 'NOT_MEMBER' && (
													<Button onClick={handleJoinRequest}>Join Club</Button>
												)}
												{memberStatus === 'PENDING' && <Button disabled>Pending</Button>}
												{memberStatus === 'BANNED' && (
													<Button disabled variant="destructive">
														You are banned
													</Button>
												)}
												{!isOwner && memberStatus === 'MEMBER' && (
													<Button variant="destructive" onClick={handleLeaveClub}>
														Leave Club
													</Button>
												)}
											</>
										)}
									</div>
								</div>
							</div>
							{/*CLUBS MEMBERS CARD*/}
							<ClubMembersCard club={club!} clubMembers={clubMembers!} />
							<div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-2 ">
								<Card className=" bg-[#0c1125]">
									<CardHeader>
										<CardTitle>Club Events</CardTitle>
									</CardHeader>
									<CardContent className="overflow-hidden">
										{clubEvents?.length ? (
											clubEvents.map((event) => (
												<Card key={event.id}>
													<CardContent className="flex w-full items-center justify-between gap-4 overflow-hidden rounded-lg bg-gray-900 p-4">
														<div className="flex flex-col">
															<h3 className="text-nd font-medium text-white">{event.title}</h3>
															<p className="text-sm font-normal text-muted-foreground">
																{new Date(event.start_date).toLocaleString()}
															</p>
														</div>
														<div className="items-end">
															{/*<Link href={`/clubs/${club.id}/events/${event.id}`}>*/}
															<Button className="bg-gray-900" variant="outline">
																View
															</Button>
															{/*</Link>*/}
														</div>
													</CardContent>
												</Card>
											))
										) : (
											<p className="flex flex-col items-center justify-items-center text-gray-400 text-muted-foreground">
												<Calendar className="h-14 w-14 border-gray-400 pb-2" />
												No events.
											</p>
										)}
									</CardContent>
								</Card>
								<Card className=" bg-[#0c1125]">
									<CardHeader>
										<CardTitle>Club Posts</CardTitle>
									</CardHeader>
									<CardContent>
										<p className="flex flex-col items-center justify-items-center text-gray-400 text-muted-foreground">
											<Inbox className="h-14 w-14 border-gray-400 pb-2" />
											No posts
										</p>
									</CardContent>
								</Card>
								<Card className=" bg-[#0c1125]">
									<CardHeader>
										<CardTitle>Club Achievements</CardTitle>
									</CardHeader>
									<CardContent>
										<p className="flex flex-col items-center justify-items-center text-gray-400 text-muted-foreground">
											<Medal className="h-14 w-14 border-gray-400 pb-2" />
											No achievements
										</p>
									</CardContent>
								</Card>
							</div>
						</div>
					</div>
				)}
			</div>
		</>
	)
}

export default Page
