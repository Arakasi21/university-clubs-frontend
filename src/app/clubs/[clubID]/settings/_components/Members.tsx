import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Tabs, TabsContent } from '@/components/ui/tabs'
import { Permissions } from '@/types/permissions'
import { Club, ClubMember } from '@/types/club'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import usePendingJoinRequests from '@/hooks/usePendingJoinRequests'
import { hasPermission } from '@/helpers/permissions'

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
					<Card x-chunk="dashboard-05-chunk-3">
						<CardHeader className="px-7">
							<CardTitle>Members</CardTitle>
							{/*todo button to right side, show the number of new requests in the button */}

							{hasPermission(memberPerms, Permissions.manage_membership) ? (
								<Button variant={`outline`}>
									<Link href={`/clubs/${club?.id}/join-request`}>
										Handle new members{' '}
										{pendingRequests > 0 && (
											<span
												className={pendingRequests > 0 ? 'text-red-500' : ''}
											>{`(+${pendingRequests})`}</span>
										)}
									</Link>
								</Button>
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
