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
import BackgroundClubImage from '@/components/clubs/BackgroundClubImage'
import ClubImage from '@/components/clubs/ClubImage'
import Nav from '@/components/NavBar'
import React, { useEffect, useState } from 'react'
import { Separator } from '@/components/ui/separator'
import { decimalToRgb } from '@/helpers/helper'

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
		return <div>Loading...</div>
	}

	return (
		<div className="flex min-h-screen flex-col bg-[#020817] text-white">
			<Nav />
			<div className="bg-[#020817] px-6 py-12">
				<div className="mx-auto max-w-6xl">
					<div className=" rounded-lg bg-[#0c1125]">
						<div
							style={{ backgroundImage: `url(${club?.banner_url ?? '/main_photo.jpeg'})` }}
							className="h-40 w-full rounded-t-lg bg-cover bg-center"
						/>
						<div className="flex items-center justify-between gap-4 p-6">
							<div className="flex items-center">
								<div className="flex shrink-0">
									<ClubImage club={club} width={84} height={84} />
								</div>
								<div className="pl-4">
									<CardTitle>{club?.name}</CardTitle>
									<CardDescription>{club?.description}</CardDescription>
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
										{memberStatus === 'MEMBER' && !isOwner && (
											<Button variant="destructive" onClick={handleLeaveClub}>
												Leave Club
											</Button>
										)}
									</>
								)}
							</div>
						</div>
					</div>

					<div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
						<Card>
							<CardHeader>
								<CardTitle>
									Club Members <span className="text-base"> - {club?.num_of_members}</span>
								</CardTitle>
							</CardHeader>
							<CardContent>
								<div className="flex flex-col gap-4">
									{clubMembers &&
										clubMembers
											.sort((a, b) => {
												const roleA = club?.roles?.find((role) => role.id === a.roles[1])
												const roleB = club?.roles?.find((role) => role.id === b.roles[1])
												return (roleB?.position ?? 0) - (roleA?.position ?? 0)
											})
											.map((member) => {
												const memberRole = club?.roles?.find((role) => role.id === member.roles[1])
												return (
													<div key={member.id} className="flex items-center gap-4">
														<UserAvatar user={member} />
														<div>
															<Link
																href={`/user/${member.id}`}
																className="font-medium hover:underline"
															>
																{member.last_name} {member.first_name}
															</Link>
															<p
																style={{
																	color: `${decimalToRgb(memberRole?.color ?? 0)}`,
																}}
																className="font-semibold"
															>
																{memberRole?.name}
															</p>
														</div>
													</div>
												)
											})}
								</div>
							</CardContent>
						</Card>
						<Card>
							<CardHeader>
								<CardTitle>Club Events</CardTitle>
							</CardHeader>
							<CardContent>
								<p className="text-gray-400 text-muted-foreground">
									There are no events for this club yet.
								</p>
							</CardContent>
						</Card>
						<Card>
							<CardHeader>
								<CardTitle>Club Posts</CardTitle>
							</CardHeader>
							<CardContent>
								<p className="text-gray-400 text-muted-foreground">
									There are no posts for this club yet.
								</p>
							</CardContent>
						</Card>
						<Card>
							<CardHeader>
								<CardTitle>Club Achievements</CardTitle>
							</CardHeader>
							<CardContent>
								<p className="text-gray-400 text-muted-foreground">
									There are no achievements for this club yet.
								</p>
							</CardContent>
						</Card>
					</div>
				</div>
			</div>
		</div>
	)
}

export default Page
