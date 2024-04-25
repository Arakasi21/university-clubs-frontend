'use client'
import { DialogUpdateClubBanner } from '@/components/DialogUpdateClubBanner'
import { DialogUpdateClubLogo } from '@/components/DialogUpdateClubLogo'
import { Card, CardContent, CardDescription, CardHeader } from '@/components/ui/card'
import { hasPermission } from '@/helpers/permissions'
import { Permissions } from '@/types/permissions'
import { Club, ClubMember } from '@/types/club'

// TODO MAKE CLUB INFO PATCH ( WRITE PATCH FOR UPDATING CLUB INFO )

export default function Settings(props: {
	memberPerms: Permissions
	club: Club | undefined
	clubMembers: ClubMember[] | undefined
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
		</div>
	)
}
