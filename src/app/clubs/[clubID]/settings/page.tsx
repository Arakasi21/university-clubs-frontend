'use client'
import Nav from '@/components/NavBar'
import { DialogUpdateClubLogo } from '@/components/DialogUpdateClubLogo'
import { DialogUpdateClubBanner } from '@/components/DialogUpdateClubBanner'

import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import UserAvatar from '@/components/userAvatar'
import { IClub, IClubMember, IClubRole } from '@/interface/club'
import useUserStore from '@/store/user'
import Link from 'next/link'
import React, { useCallback, useEffect, useState } from 'react'
import { toast } from 'sonner'
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
	DropdownMenu,
	DropdownMenuCheckboxItem,
	DropdownMenuContent,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { File, ListFilter } from 'lucide-react'
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table'
import Image from 'next/image'
import MemberRolesRow from '@/components/memberRolesRow'

// TODO MAKE CLUB INFO PATCH ( WRITE PATCH FOR UPDATING CLUB INFO )

function Page({ params }: { params: { clubID: number } }) {
	const { user } = useUserStore()
	const [club, setClub] = useState<IClub>()
	const [clubMembers, setClubMembers] = useState<IClubMember[]>()
	const [loading, setLoading] = useState(true)
	const [isOwner, setIsOwner] = useState(false)

	const fetchClubInfo = useCallback(() => {
		fetch(`http://localhost:5000/clubs/${params.clubID}`)
			.then(async (res) => {
				const data = await res.json()
				if (!res.ok) {
					toast.error('not found', {
						description: data.error,
					})

					throw new Error(data.error || 'Failed to Fetch club info')
				}

				setClub(data.club)
				setIsOwner(data.club.owner_id == user?.id)
				setLoading(false)
			})
			.catch((error) => console.log(error.message))

		fetch(`http://localhost:5000/clubs/${params.clubID}/members?page=1&page_size=30`)
			.then(async (res) => {
				const data = await res.json()
				if (!res.ok) {
					toast.error('not found', {
						description: data.error,
					})

					throw new Error(data.error || 'Failed to Fetch club info')
				}

				setClubMembers(data.members)
			})
			.catch((error) => console.log(error.message))
	}, [params.clubID, user?.id])

	useEffect(() => {
		fetchClubInfo()
	}, [fetchClubInfo, params.clubID])
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
						<div className="flex overflow-hidden">
							<div className="flex-1">
								<div className="flex flex-wrap justify-center gap-6">
									<div
										style={{ backgroundImage: `url(${club?.banner_url ?? '/main_photo.jpeg'})` }}
										className="relative h-40 w-screen bg-center bg-no-repeat"
									/>
									<div className="flex w-full justify-center gap-3">
										<Link href={`/clubs/${club?.id}`}>
											<Button variant={'outline'}>
												<Image
													src={club?.logo_url ?? '/main_photo.jpeg'}
													width={32}
													height={32}
													alt={`banner of ${club?.name}`}
												/>
												Club page
											</Button>
										</Link>
										<Link href={`/clubs/${club?.id}/join-request`}>
											<Button variant={'outline'}>Handle new members</Button>
										</Link>
									</div>
									<div>
										<div className="grid gap-4 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3">
											<Card className="sm:col-span-2" x-chunk="dashboard-05-chunk-0">
												<CardHeader className="pb-3">
													<CardTitle>Club Roles</CardTitle>
													<CardDescription className="max-w-lg text-balance leading-relaxed">
														Introducing our new role management
													</CardDescription>
												</CardHeader>
												<CardFooter>
													<Link href={`/clubs/${club?.id}/settings/roles`}>
														<Button variant={'default'}>Roles settings</Button>
													</Link>
												</CardFooter>
											</Card>
											<Card x-chunk="dashboard-05-chunk-1">
												<CardHeader className="pb-3">
													<CardDescription>Update your logo/banner</CardDescription>
												</CardHeader>
												<CardContent>
													{club && (
														<div className="flex gap-3">
															<DialogUpdateClubLogo club={club} />
															<DialogUpdateClubBanner club={club} />
														</div>
													)}
												</CardContent>
											</Card>
										</div>
										<Tabs defaultValue="week">
											<TabsContent value="week">
												<Card x-chunk="dashboard-05-chunk-3">
													<CardHeader className="px-7">
														<CardTitle>Members</CardTitle>
													</CardHeader>
													<CardContent>
														<Table>
															<TableHeader>
																<TableRow>
																	<TableHead className="hidden sm:table-cell">Avatar</TableHead>
																	<TableHead className="text-left">Name</TableHead>
																	<TableHead className="text-left">Surname</TableHead>
																	<TableHead className="hidden md:table-cell">Role</TableHead>
																	<TableHead className="hidden md:table-cell">Email</TableHead>
																	<TableHead className="hidden md:table-cell">Barcode</TableHead>
																</TableRow>
															</TableHeader>
															<TableBody>
																{clubMembers &&
																	clubMembers.map((member) => (
																		<MemberRolesRow member={member} roles={club?.roles} />
																	))}
															</TableBody>
														</Table>
													</CardContent>
												</Card>
											</TabsContent>
										</Tabs>
									</div>
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
