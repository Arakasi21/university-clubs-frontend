'use client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Tabs, TabsContent } from '@/components/ui/tabs'
import { Permissions } from '@/types/permissions'
import { Club, ClubMember } from '@/types/club'

export default function Members(props: {
	memberPerms: Permissions
	club: Club | undefined
	clubMembers: ClubMember[] | undefined
	callbackfn: (member: ClubMember) => JSX.Element
}) {
	return (
		<div>
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
