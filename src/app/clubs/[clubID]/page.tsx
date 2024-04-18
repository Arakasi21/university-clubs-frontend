'use client'
import Nav from '@/components/NavBar'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Select } from '@/components/ui/select'
import { Skeleton } from '@/components/ui/skeleton'
import UserAvatar from '@/components/userAvatar'
import useClub from '@/hooks/useClub'
import useUserClubStatus from '@/hooks/useUserClubStatus'
import Image from 'next/image'
import Link from 'next/link'

function Page({ params }: { params: { clubID: number } }) {
	const { club, clubMembers, isOwner, loading } = useClub({ clubID: params.clubID })
	const { memberStatus, handleJoinRequest, handleLeaveClub } = useUserClubStatus({
		clubID: params.clubID,
	})

	return (
		<>
			<Nav />
			<div>
				{loading ? (
					<div className="flex flex-col space-y-3">
						<Skeleton className="h-[200px] w-[400px] rounded-xl" />
						<div className="space-y-2">
							<Skeleton className="h-4 w-[250px]" />
							<Skeleton className="h-4 w-[200px]" />
						</div>
					</div>
				) : (
					<>
						<div
							style={{ backgroundImage: `url(${club?.banner_url ?? '/main_photo.jpeg'})` }}
							className="relative h-40 w-screen bg-center bg-no-repeat"
						/>
						{/* BODY */}
						<div className="grid flex-1 items-start gap-4 p-4 sm:px-32 sm:py-8 md:gap-8">
							<div className="grid gap-4 md:grid-cols-[1fr_250px] lg:grid-cols-3 lg:gap-8">
								<div className="grid auto-rows-max items-start gap-4 lg:col-span-2 lg:gap-8">
									<Card x-chunk="dashboard-07-chunk-0">
										<CardHeader className="grid grid-cols-[auto,1fr] items-center gap-4">
											<div>
												<Image
													src={club?.logo_url ?? '/main_photo.jpeg'}
													width={100}
													height={100}
													alt={`banner of ${club?.name}`}
												/>
											</div>
											<div>
												<CardTitle>{club?.name}</CardTitle>
												<CardDescription>{club?.description}</CardDescription>
											</div>
										</CardHeader>
										<CardContent>
											<div className="grid gap-6">
												<div className="grid gap-3">
													{memberStatus == 'NOT_MEMBER' && (
														<Button onClick={handleJoinRequest} type="submit">
															Join request
														</Button>
													)}
													{memberStatus == 'PENDING' && <Button disabled>Pending</Button>}
													{/* TODO ЗДЕСЬ НУЖНО ПЕРЕПИСАТЬ => OWNER CHANGE TO CLUB ADMIN (with admin permissions) / DSVR */}
													{isOwner && (
														<div className="flex gap-3">
															<Link href={`/clubs/${club?.id}/settings`}>
																<Button>Settings</Button>
															</Link>
															<Link href={`/clubs/${club?.id}/todo`}>
																<Button>TODO</Button>
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
															clubMembers.map((member) => (
																<Link
																	href={`/user/${member.id}`}
																	className="flex w-full flex-row items-center space-x-3.5 px-2"
																	key={member.id}
																>
																	<UserAvatar user={member} />
																	<p
																		style={{
																			color: `#${club?.roles[0].color.toString(16)}` ?? '#fff',
																		}}
																	>
																		{member.last_name} {member.first_name}
																	</p>
																</Link>
															))}
													</Select>
												</div>
											</div>
										</CardContent>
									</Card>
								</div>
							</div>
						</div>
					</>
				)}
			</div>
		</>
	)
}

export default Page
