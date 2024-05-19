import { DialogUpdateClubBanner } from '@/components/clubs/DialogUpdateClubBanner'
import { DialogUpdateClubLogo } from '@/components/clubs/DialogUpdateClubLogo'
import { Card, CardContent, CardDescription, CardHeader } from '@/components/ui/card'
import { Permissions } from '@/types/permissions'
import { Club, ClubMember } from '@/types/club'
import ClubImage from '@/components/clubs/ClubImage'
import React from 'react'
import Image from 'next/image'
import { Label } from '@/components/ui/label'
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

// TODO MAKE CLUB INFO PATCH ( WRITE PATCH FOR UPDATING CLUB INFO )

export default function Settings(props: {
	memberPerms: Permissions
	club: Club | undefined
	clubMembers: ClubMember[] | undefined
}) {
	return (
		<div>
			{props.club && <DialogUpdateClubLogo club={props.club} />}

			{props.club && <DialogUpdateClubBanner club={props.club} />}

			<Link href={`/clubs/${props.club?.id}/events`}>
				<Button>Create Event</Button>
			</Link>

			{/*<div className="grid grid-cols-4 gap-10 ">*/}
			{/*	<Card x-chunk="dashboard-05-chunk-1">*/}
			{/*		<CardHeader className="pb-3">*/}
			{/*			<CardDescription>Update your logo</CardDescription>*/}
			{/*			<ClubImage club={props.club} width={150} height={50} />*/}
			{/*		</CardHeader>*/}

			{/*		<CardContent>{props.club && <DialogUpdateClubLogo club={props.club} />}</CardContent>*/}
			{/*	</Card>*/}

			{/*	<Card x-chunk="dashboard-05-chunk-1">*/}
			{/*		<CardHeader className="pb-5">*/}
			{/*			<CardDescription>Update your banner</CardDescription>*/}
			{/*			<Image*/}
			{/*				src={props.club?.banner_url ?? '/main_photo.jpeg'}*/}
			{/*				width={250}*/}
			{/*				height={50}*/}
			{/*				alt={`banner of ${props.club?.name}`}*/}
			{/*			/>*/}
			{/*		</CardHeader>*/}
			{/*		<CardContent>{props.club && <DialogUpdateClubBanner club={props.club} />}</CardContent>*/}
			{/*	</Card>*/}
		</div>
	)
}
