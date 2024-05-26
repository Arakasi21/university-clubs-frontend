import { Permissions } from '@/types/permissions'
import { hasPermission } from '@/helpers/permissions'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import React from 'react'
import { Club } from '@/types/club'

export default function ClubPageButtons(props: {
	memberPerms: Permissions
	club: Club
	loggedIn: boolean
	loading: boolean
	memberStatus: 'NOT_MEMBER' | 'PENDING' | 'MEMBER' | 'BANNED'
	onClick: () => Promise<void>
	owner: boolean
	onClick1: () => Promise<void>
}) {
	return (
		<div className="flex flex-row gap-3 ">
			{hasPermission(props.memberPerms, Permissions.ALL) && (
				<div className="flex gap-3">
					<Link href={`/clubs/${props.club?.id}/settings`}>
						<Button variant="default">Settings</Button>
					</Link>
					<Link href={`/clubs/${props.club?.id}/todo`}>
						<Button>Notion Link</Button>
					</Link>
				</div>
			)}
			{props.loggedIn && !props.loading && (
				<div>
					{props.memberStatus === 'NOT_MEMBER' && (
						<Button onClick={props.onClick}>Join Club</Button>
					)}
					{props.memberStatus === 'PENDING' && <Button disabled>Pending</Button>}
					{props.memberStatus === 'BANNED' && (
						<Button disabled variant="destructive">
							You are banned
						</Button>
					)}
					{!props.owner && props.memberStatus === 'MEMBER' && (
						<Button variant="destructive" onClick={props.onClick1}>
							Leave Club
						</Button>
					)}
				</div>
			)}
		</div>
	)
}
