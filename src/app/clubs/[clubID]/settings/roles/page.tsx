'use client'
import Nav from '@/components/NavBar'
import { Table, TableBody, TableCell, TableHeader, TableRow } from '@/components/ui/table'
import { IClub, IClubMember, IClubRole } from '@/interface/club'
import React, { useCallback, useEffect, useState } from 'react'
import useUserStore from '@/store/user'
import { toast } from 'sonner'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent } from '@/components/ui/tabs'
import { Skeleton } from '@/components/ui/skeleton'
import { DialogUpdateClubLogo } from '@/components/DialogUpdateClubLogo'
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { MoreHorizontal } from 'lucide-react'
import { decimalToRgb } from '@/helpers/helper'

function Page({ params }: { params: { clubID: number } }) {
	const [club, setClub] = useState<IClub>()
	const [loading, setLoading] = useState(true)
	const { user } = useUserStore()
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
				console.log(club?.roles)
			})
			.catch((error) => console.log(error.message))
	}, [params.clubID])

	useEffect(() => {
		fetchClubInfo()
	}, [fetchClubInfo, params.clubID, user?.id])

	// if (!isOwner) {
	// 	return null
	// }

	return (
		<>
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
						<Nav />
						<div
							style={{ backgroundImage: `url(${club?.banner_url ?? '/main_photo.jpeg'})` }}
							className="relative h-40 w-screen bg-center bg-no-repeat"
						/>
						<Tabs
							className="grid flex-1 items-start gap-4 p-4 sm:px-64 sm:py-8 md:gap-8"
							defaultValue="all"
						>
							<div className="flex flex-wrap justify-center gap-6">
								<Link href={`/clubs/${club?.id}/settings`}>
									<Button variant={'outline'}>Return to settings</Button>
								</Link>
								<Link href={`/clubs/${club?.id}/settings/roles/create`}>
									<Button variant={'default'}>Create new role</Button>
								</Link>
							</div>

							<TabsContent value="all">
								<Card x-chunk="dashboard-06-chunk-0">
									<CardHeader>
										<CardTitle>Club Roles</CardTitle>
										<CardDescription>
											Manage club roles. You can edit roles, create new one, delete and etc.
										</CardDescription>
									</CardHeader>
									<CardContent>
										<Table>
											<TableHeader>
												<TableRow>
													<TableCell>Name</TableCell>
													<TableCell>Permissions</TableCell>
													<TableCell>Action</TableCell>
												</TableRow>
											</TableHeader>
											<TableBody>
												{club &&
													club.roles
														.sort((role, role2) => role.position < role2.position)
														.map((role: IClubRole) => (
															<TableRow key={role.position}>
																<TableCell>
																	<p
																		style={{
																			color: `${decimalToRgb(role.color)}`,
																		}}
																	>
																		{role.name}
																	</p>
																</TableCell>
																<TableCell>
																	{role.permissions &&
																		role.permissions.map((permission) => <p>{permission}</p>)}
																</TableCell>
																<TableCell>
																	<DropdownMenu>
																		<DropdownMenuTrigger asChild>
																			<Button aria-haspopup="true" size="icon" variant="ghost">
																				<MoreHorizontal className="h-4 w-4" />
																				<span className="sr-only">Toggle menu</span>
																			</Button>
																		</DropdownMenuTrigger>
																		<DropdownMenuContent align="end">
																			<DropdownMenuItem>Edit</DropdownMenuItem>
																			<DropdownMenuItem>Delete</DropdownMenuItem>
																		</DropdownMenuContent>
																	</DropdownMenu>
																</TableCell>
															</TableRow>
														))}
											</TableBody>
										</Table>
									</CardContent>
								</Card>
							</TabsContent>
						</Tabs>
					</>
				)}
			</div>
		</>
	)
}

export default Page
