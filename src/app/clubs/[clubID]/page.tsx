'use client'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import useClub from '@/hooks/useClub'
import useUserClubStatus from '@/hooks/useUserClubStatus'
import useMemberRoles from '@/hooks/useMemberRoles'
import useUserStore from '@/store/user'
import useUserRolesStore from '@/store/useUserRoles'
import ClubImage from '@/components/clubs/ClubImage'
import Nav from '@/components/NavBar'
import React, { useEffect, useState, useCallback } from 'react'
import SceletonClub from '@/components/Skeletons/SkeletonClub'
import { Calendar, Inbox, Medal } from 'lucide-react'
import { Event } from '@/types/event'
import ClubMembersCard from '@/components/clubs/ClubMembersCard'
import ClubMembersDialog from '@/components/clubs/ClubMembersDialog'
import ClubPageButtons from '@/components/clubs/ClubPageButtons'
import BackgroundClubImage from '@/components/clubs/BackgroundClubImage'

function Page({ params }: { params: { clubID: number } }) {
	const { isLoggedIn, user } = useUserStore()
	const { club, clubMembers, isOwner, loading } = useClub({ clubID: params.clubID, user })
	const { fetchUserClubStatus, handleJoinRequest, handleLeaveClub, memberStatus } =
		useUserClubStatus({
			clubID: params.clubID,
		})

	const { permissions } = useUserRolesStore()

	useMemberRoles({
		club: club || null,
		user: user,
		userStatus: memberStatus,
		shouldFetch: memberStatus === 'MEMBER',
	})

	const [isDialogOpen, setIsDialogOpen] = useState(false)
	const openClubMembersDialog = () => setIsDialogOpen(true)
	const closeDialog = () => setIsDialogOpen(false)
	const [clubEvents, setClubEvents] = useState<Event[] | null>([])

	const fetchClubEvents = useCallback(async () => {
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
				console.log('There is no fetched events')
			}
		} catch (err) {
			console.error('Network Error: Unable to fetch events')
		}
	}, [params.clubID])

	useEffect(() => {
		fetchClubEvents()
	}, [])

	return (
		<>
			<Nav />

			<div className="flex min-h-screen flex-col bg-white text-white dark:bg-[#020817]">
				{loading ? (
					<SceletonClub />
				) : (
					<div className="relative">
						<div className="absolute h-[320px] w-full overflow-hidden rounded-sm shadow-2xl shadow-[#020817]/40">
							<img
								className="z-1 h-full w-full object-cover object-center "
								height={600}
								src={club?.banner_url}
								style={{
									aspectRatio: '1920/600',
									objectFit: 'cover',
								}}
								width={1920}
							/>
							<div className="z-1 absolute inset-0 bg-gradient-to-b from-transparent/30 to-[#020817]/80" />
							<div className="z-1 absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-[#020817]/90" />
						</div>

						<div className="relative z-30 mx-auto max-w-[800px] pt-14">
							<BackgroundClubImage club={club} />
							<div className="z-50 rounded-lg bg-[#0c1125]">
								<div className="flex items-center justify-between gap-4 p-6">
									<div className="flex items-center gap-2">
										<div className="hidden aspect-square shrink-0 overflow-hidden rounded-full sm:flex">
											<ClubImage club={club} width={84} height={84} />
										</div>
										<div className="pl-4">
											<CardTitle>{club?.name}</CardTitle>
											<CardDescription>{club?.description}</CardDescription>
											<CardDescription
												className="cursor-pointer pt-2"
												onClick={openClubMembersDialog}
											>
												{club?.num_of_members} members
											</CardDescription>
										</div>
									</div>
									<ClubPageButtons
										memberPerms={permissions}
										club={club as any}
										loggedIn={isLoggedIn}
										loading={loading}
										memberStatus={memberStatus}
										onClick={handleJoinRequest}
										owner={isOwner}
										onClick1={handleLeaveClub}
									/>
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
															<Button className="bg-gray-900" variant="outline">
																View
															</Button>
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
			<ClubMembersDialog
				isOpen={isDialogOpen}
				onClose={closeDialog}
				club={club}
				clubMembers={clubMembers}
			/>
		</>
	)
}

export default Page
