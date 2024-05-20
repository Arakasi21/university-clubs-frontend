import React from 'react'
import { DialogUpdateClubBanner } from '@/components/clubs/settings/DialogUpdateClubBanner'
import { DialogUpdateClubLogo } from '@/components/clubs/settings/DialogUpdateClubLogo'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { hasPermission } from '@/helpers/permissions'

import { Club } from '@/types/club'
import { Permissions } from '@/types/permissions'

export default function GeneralSettings({
	club,
	permissions,
}: {
	club: Club
	permissions: Permissions
}) {
	return (
		<nav className="grid gap-4 text-sm">
			<p className="text-lg font-semibold">General</p>
			{hasPermission(permissions, Permissions.manage_club) ? (
				<div className="grid gap-4">
					<Link className="w-40" href="#">
						{club && <DialogUpdateClubLogo club={club} />}
					</Link>
					<Link className="w-40" href="#">
						{club && <DialogUpdateClubBanner club={club} />}
					</Link>
					<Link className="w-40" href={`/clubs/${club?.id}/events`}>
						<Button className="w-40">Create Event</Button>
					</Link>
				</div>
			) : (
				<div className="grid gap-4">
					<Button className="w-40" variant="outline" disabled>
						Update Club Logo
					</Button>
					<Button className="w-40" variant="outline" disabled>
						Update Club Banner
					</Button>
					<Button className="w-40" variant="outline" disabled>
						Create Event
					</Button>
				</div>
			)}
		</nav>
	)
}
