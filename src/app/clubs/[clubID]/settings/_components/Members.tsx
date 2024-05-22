import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Tabs, TabsContent } from '@/components/ui/tabs'
import { Permissions } from '@/types/permissions'
import { Club, ClubMember } from '@/types/club'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import usePendingJoinRequests from '@/hooks/usePendingJoinRequests'
import { hasPermission } from '@/helpers/permissions'
import React from 'react'
import { Badge } from '@/components/ui/badge'

export default function Members({
	club,
	clubMembers,
	callbackfn,
	memberPerms,
}: {
	memberPerms: Permissions
	club: Club | undefined
	clubMembers: ClubMember[] | undefined
	callbackfn: (member: ClubMember) => JSX.Element
}) {
	const pendingRequests = usePendingJoinRequests(club?.id ?? 0)
	return (
		<div>
			<Tabs defaultValue="week">
				<TabsContent value="week">
					<Card className="bg-muted/40" x-chunk="dashboard-05-chunk-3 ">
						<CardHeader className="flex gap-4 p-4">
							<div className="flex items-center justify-between gap-4 p-6">
								<div className="flex items-center">
									<div>
										<CardTitle>Members</CardTitle>
										<CardDescription>
											There are {clubMembers?.length} members in this club. You can manage members.
										</CardDescription>
									</div>
								</div>
								<div className="flex flex-row gap-3 ">
									{hasPermission(memberPerms, Permissions.manage_membership) ? (
										<div className="flex gap-3">
											<Button variant={`secondary`} className="right-0 w-60">
												{' '}
												<Link
													className="right-0 w-full font-bold"
													href={`/clubs/${club?.id}/join-request`}
												>
													Handle new members{' '}
													{pendingRequests > 0 && (
														<span
															className={pendingRequests > 0 ? 'text-red-500' : ''}
														>{`(+${pendingRequests})`}</span>
													)}
												</Link>
											</Button>
										</div>
									) : (
										<Button variant={`outline`} disabled>
											<Link href={`/clubs/${club?.id}/join-request`}>
												Handle new members{' '}
												{pendingRequests > 0 && (
													<span
														className={pendingRequests > 0 ? 'text-red-500' : ''}
													>{`(+${pendingRequests})`}</span>
												)}
											</Link>
										</Button>
									)}
								</div>
							</div>
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
								<TableBody>{clubMembers && clubMembers.map(callbackfn)}</TableBody>
							</Table>
						</CardContent>
					</Card>
				</TabsContent>
			</Tabs>
		</div>
	)
}
