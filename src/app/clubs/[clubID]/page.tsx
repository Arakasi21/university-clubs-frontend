'use client'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Select } from '@/components/ui/select'
import UserAvatar from '@/components/user/userAvatar'
import useClub from '@/hooks/useClub'
import useUserClubStatus from '@/hooks/useUserClubStatus'
import Link from 'next/link'
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

function Page({ params }: { params: { clubID: number } }) {
	const [isLoading, setIsLoading] = useState(true)

	const { user } = useUserStore()
	const { club, clubMembers, isOwner } = useClub({ clubID: params.clubID, user: user })
	const { memberStatus, handleJoinRequest, handleLeaveClub } = useUserClubStatus({
		clubID: params.clubID,
	})
	const membersWithoutPresident = clubMembers?.filter((member) => {
		const memberRole = club?.roles.find((role) => role.id === member.roles[1])
		return memberRole?.name !== 'President'
	})
	const membersCount = membersWithoutPresident?.length

	const { permissions } = useUserRolesStore()
	const { isLoggedIn } = useUserStore()
	useMemberRoles({
		clubID: params.clubID,
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
		<>
			<Nav />
			<div>
				<>
					<BackgroundClubImage club={club} />
					{/* BODY */}
					<div className="grid flex-1 items-start gap-4 p-4 sm:px-32 sm:py-8 md:gap-8">
						<div className="grid gap-4 md:grid-cols-[1fr_250px] lg:grid-cols-3 lg:gap-8">
							<div className="grid auto-rows-max items-start gap-4 lg:col-span-2 lg:gap-8">
								<Card x-chunk="dashboard-07-chunk-0">
									<CardHeader className="grid grid-cols-[auto,1fr] items-center gap-4">
										<div>
											<ClubImage club={club} width={100} height={100} />
										</div>
										<div>
											<CardTitle>{club?.name}</CardTitle>
											<CardDescription>{club?.description}</CardDescription>
										</div>
									</CardHeader>
									<CardContent>
										<div className="grid gap-6">
											<div className="grid gap-3">
												{isLoggedIn && (
													<React.Fragment>
														{memberStatus === 'NOT_MEMBER' && ( // Check membership status
															<Button onClick={handleJoinRequest} type="submit">
																Join request
															</Button>
														)}
														{memberStatus === 'PENDING' && <Button disabled>Pending</Button>}
														{memberStatus === 'BANNED' && (
															<Button disabled variant={'destructive'}>
																You are banned
															</Button>
														)}
													</React.Fragment>
												)}
												{/* TODO ЗДЕСЬ НУЖНО ПЕРЕПИСАТЬ => OWNER CHANGE TO CLUB ADMIN (with admin permissions) / DSVR */}
												{hasPermission(permissions, Permissions.ALL) && (
													<div className="flex gap-3">
														<Link href={`/clubs/${club?.id}/settings`}>
															<Button>Settings</Button>
														</Link>
														<Link href={`/clubs/${club?.id}/todo`}>
															<Button>Notion Link</Button>
														</Link>
													</div>
												)}
												{memberStatus == 'MEMBER' && !isOwner && (
													<div>
														<Button
															variant={'destructive'}
															onClick={handleLeaveClub}
															type={'submit'}
														>
															Leave Club
														</Button>
													</div>
												)}
											</div>
										</div>
									</CardContent>
								</Card>
							</div>
							<div className="grid items-start gap-1 sm:gap-4">
								<Card x-chunk="dashboard-01-chunk-1">
									<CardHeader>
										<CardTitle>Club Members</CardTitle>
									</CardHeader>
									<CardContent>
										<div className="grid gap-6">
											<div className="grid gap-3">
												<Select>
													{clubMembers &&
														clubMembers
															.sort((a, b) => {
																const roleA = club?.roles.find((role) => role.id === a.roles[1])
																const roleB = club?.roles.find((role) => role.id === b.roles[1])
																return (roleB?.position ?? 0) - (roleA?.position ?? 0)
															})
															.map((member) => {
																const memberRole = club?.roles.find(
																	(role) => role.id === member.roles[1],
																)
																if (memberRole?.name === 'President') {
																	return (
																		<>
																			<h2>President</h2>
																			<Link
																				href={`/user/${member.id}`}
																				className="flex w-full flex-row items-center space-x-3.5 px-2"
																				key={member.id}
																			>
																				<UserAvatar user={member} />
																				<p
																					style={{
																						color: `#${memberRole.color.toString(16)}` ?? '#fff',
																					}}
																				>
																					{member.last_name} {member.first_name}
																				</p>
																			</Link>
																			<Separator />
																			<h1>Members - {membersCount} </h1>
																		</>
																	)
																} else {
																	return (
																		<>
																			<Link
																				href={`/user/${member.id}`}
																				className="flex w-full flex-row items-center space-x-3.5 px-2"
																				key={member.id}
																			>
																				<UserAvatar user={member} />
																				<p
																					style={{
																						color: `#${memberRole?.color.toString(16)}` ?? '#fff',
																					}}
																				>
																					{member.last_name} {member.first_name}
																				</p>
																			</Link>
																		</>
																	)
																}
															})}
												</Select>
											</div>
										</div>
									</CardContent>
								</Card>
							</div>
							<div>
								<Card x-chunk="dashboard-07-chunk-2">
									<CardHeader>
										<CardTitle>Club Events</CardTitle>
									</CardHeader>
									<CardContent>
										<div className="grid gap-6">
											<div className="grid gap-3">
												{/*	CURRENT EVENTS THAT IS ACTIVE FOR CLUB*/}
												<div>
													<p className=" text-muted-foreground" style={{ color: 'gray' }}>
														There are no events for this club yet.
													</p>
												</div>
											</div>
										</div>
									</CardContent>
								</Card>
								{/*CLUB NEWS*/}
							</div>
							<div>
								<Card x-chunk="dashboard-07-chunk-3">
									<CardHeader>
										<CardTitle>Club Posts</CardTitle>
									</CardHeader>
									<CardContent>
										<div className="grid gap-6">
											<div className="grid gap-3">
												{/*	NEWS FOR CLUB*/}
												<div>
													{/*MUTED*/}
													<p className=" text-muted-foreground" style={{ color: 'gray' }}>
														There are no Posts for this club yet.
													</p>
												</div>
											</div>
										</div>
									</CardContent>
								</Card>
							</div>
							<div>
								{/*	Club Achievements*/}
								<Card x-chunk="dashboard-07-chunk-4">
									<CardHeader>
										<CardTitle>Club Achievements</CardTitle>
									</CardHeader>
									<CardContent>
										<div className="grid gap-6">
											<div className="grid gap-3">
												{/*	ACHIEVEMENTS FOR CLUB*/}
												<div>
													<p className=" text-muted-foreground" style={{ color: 'gray' }}>
														There are no achievements for this club yet.
													</p>
												</div>
											</div>
										</div>
									</CardContent>
								</Card>
							</div>
						</div>
					</div>
				</>
			</div>
		</>
	)
}

export default Page
