'use client'
import { DialogUpdateClubBanner } from '@/components/DialogUpdateClubBanner'
import { DialogUpdateClubLogo } from '@/components/DialogUpdateClubLogo'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Tabs, TabsContent } from '@/components/ui/tabs'
import { hasPermission } from '@/helpers/permissions'
import { Permissions } from '@/types/permissions'
import { Club, ClubMember } from '@/types/club'

// TODO MAKE CLUB INFO PATCH ( WRITE PATCH FOR UPDATING CLUB INFO )

export default function Settings(props: {
	memberPerms: Permissions
	club: Club | undefined
	clubMembers: ClubMember[] | undefined
	callbackfn: (member: ClubMember) => JSX.Element
}) {
	return (
		<div>
			<div className="grid gap-2 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2">
				{hasPermission(props.memberPerms, Permissions.manage_club) && (
					<Card x-chunk="dashboard-05-chunk-1">
						<CardHeader className="pb-3">
							<CardDescription>Update your logo</CardDescription>
						</CardHeader>
						<CardContent>{props.club && <DialogUpdateClubLogo club={props.club} />}</CardContent>
					</Card>
				)}
				{hasPermission(props.memberPerms, Permissions.manage_club) && (
					<Card x-chunk="dashboard-05-chunk-1">
						<CardHeader className="pb-3">
							<CardDescription>Update your banner</CardDescription>
						</CardHeader>
						<CardContent>{props.club && <DialogUpdateClubBanner club={props.club} />}</CardContent>
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
									{props.clubMembers && props.clubMembers.map(props.callbackfn)}
								</TableBody>
							</Table>
						</CardContent>
					</Card>
				</TabsContent>
			</Tabs>
		</div>
	)
}
