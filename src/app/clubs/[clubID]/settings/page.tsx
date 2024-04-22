'use client'
import { DialogUpdateClubBanner } from '@/components/DialogUpdateClubBanner'
import { DialogUpdateClubLogo } from '@/components/DialogUpdateClubLogo'
import Nav from '@/components/NavBar'

import MemberRolesRow from '@/components/memberRolesRow'
import { Button } from '@/components/ui/button'
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from '@/components/ui/card'
import { Table, TableBody, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Tabs, TabsContent } from '@/components/ui/tabs'
import useClub from '@/hooks/useClub'
import Link from 'next/link'
import useUserStore from '@/store/user'
import useUserClubStatus from '@/hooks/useUserClubStatus'
import useUserRolesStore from '@/store/useUserRoles'
import { hasPermission } from '@/helpers/permissions'
import { Permissions } from '@/types/permissions'
import Error from 'next/error'
import useMemberRoles from '@/hooks/useMemberRoles'
import BackgroundClubImage from '@/components/st/BackgroundClubImage'
import ClubImage from '@/components/st/ClubImage'
import Sceleton from '@/components/st/Sceleton'

// TODO MAKE CLUB INFO PATCH ( WRITE PATCH FOR UPDATING CLUB INFO )

function Page({ params }: { params: { clubID: number } }) {
	const { user } = useUserStore()
	const { club, clubMembers, loading, fetchClubInfo } = useClub({
		clubID: params.clubID,
		user: user,
	})
	const { memberStatus } = useUserClubStatus({
		clubID: params.clubID,
	})
	useMemberRoles({
		clubID: params.clubID,
		user: user,
		userStatus: memberStatus,
	})

	const { permissions } = useUserRolesStore()
	//if do not have any permissions or not owner return nonauth
	if (!hasPermission(permissions, Permissions.ALL) && !loading) {
		return <Error statusCode={401} />
	}
	// TODO ASSIGN ROLE
	return (
		<>
			<Nav />
			<div>
				{loading ? (
					<Sceleton />
				) : (
					<>
						<div className="flex overflow-hidden">
							<div className="flex-1">
								<div className="flex flex-wrap justify-center gap-6">
									<BackgroundClubImage club={club} />
									<div className="flex w-full justify-center gap-3">
										<Link href={`/clubs/${club?.id}`}>
											<Button variant={'outline'}>
												<ClubImage club={club} width={32} height={32} />
												Club page
											</Button>
										</Link>
										{hasPermission(permissions, Permissions.manage_membership) && (
											<Link href={`/clubs/${club?.id}/join-request`}>
												<Button variant={'outline'}>Handle new members</Button>
											</Link>
										)}
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
												{hasPermission(permissions, Permissions.manage_roles) && (
													<CardFooter>
														<Link href={`/clubs/${club?.id}/settings/roles`}>
															<Button variant={'default'}>Roles settings</Button>
														</Link>
													</CardFooter>
												)}
											</Card>
											{hasPermission(permissions, Permissions.manage_club) && (
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
											)}
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
																		<MemberRolesRow
																			onUpdate={() => fetchClubInfo()}
																			member={member}
																			roles={club?.roles ?? []}
																			clubId={club?.id ?? 0}
																			key={member.id}
																		/>
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
