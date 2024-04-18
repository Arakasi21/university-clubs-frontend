'use client'
import Nav from '@/components/NavBar'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Skeleton } from '@/components/ui/skeleton'
import { Table, TableBody, TableCell, TableHeader, TableRow } from '@/components/ui/table'
import { Tabs, TabsContent } from '@/components/ui/tabs'
import { decimalToRgb } from '@/helpers/helper'
import useClub from '@/hooks/useClub'
import { ClubRole } from '@/types/club'
import { MoreHorizontal } from 'lucide-react'
import Link from 'next/link'
import { useCallback } from 'react'
import { toast } from 'sonner'

function Page({ params }: { params: { clubID: number } }) {
	const { club, clubMembers, isOwner, loading, fetchClubInfo } = useClub({ clubID: params.clubID })

	const handleDeleteClub = useCallback(
		async (roleID: number) => {
			const apiUrl = `http://localhost:5000/clubs/${params.clubID}/roles/${roleID}`
			try {
				const response = await fetch(apiUrl, {
					method: 'DELETE',
					credentials: 'include',
				})

				if (!response.ok) {
					let errorData = await response.json()

					toast.error('Failed to delete role', {
						description: errorData.error,
					})
					return
				}

				fetchClubInfo()

				toast.success('Role deleted!', {
					action: {
						label: 'X',
						onClick: () => {},
					},
				})
			} catch (e) {
				toast.error('ERROR', {
					description: 'An error occurred while trying to make request to delete role.',
				})
				console.log(e)
			}
		},
		[fetchClubInfo, params.clubID],
	)

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
							</div>

							<TabsContent value="all">
								<Card x-chunk="dashboard-06-chunk-0">
									<CardHeader>
										<CardTitle>Club Roles</CardTitle>
										<CardDescription>
											<div className="flex items-center justify-between">
												{' '}
												<p>
													Manage club roles. You can edit roles, create new one, delete and etc.
												</p>
												<Link href={`/clubs/${club?.id}/settings/roles/create`}>
													<Button variant={'default'}>Create new role</Button>
												</Link>
											</div>
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
														.sort((role, role2) => role2.position - role.position)
														.map((role: ClubRole) => (
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
																	<p>{role.permissions ?? 'Do not have any permissions'}</p>
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
																			{role.name !== 'member' && (
																				<DropdownMenuItem
																					onClick={() => handleDeleteClub(role.id)}
																					style={{ color: 'red' }}
																				>
																					Delete
																				</DropdownMenuItem>
																			)}
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
