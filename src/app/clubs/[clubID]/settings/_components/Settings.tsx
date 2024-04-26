import { DialogUpdateClubBanner } from '@/components/DialogUpdateClubBanner'
import { DialogUpdateClubLogo } from '@/components/DialogUpdateClubLogo'
import { Card, CardContent, CardDescription, CardHeader } from '@/components/ui/card'
import { Permissions } from '@/types/permissions'
import { Club, ClubMember } from '@/types/club'
import ClubImage from '@/components/st/ClubImage'
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

// TODO MAKE CLUB INFO PATCH ( WRITE PATCH FOR UPDATING CLUB INFO )

export default function Settings(props: {
	memberPerms: Permissions
	club: Club | undefined
	clubMembers: ClubMember[] | undefined
}) {
	return (
		<div>
			<div className="grid grid-cols-4 gap-10 ">
				<Card x-chunk="dashboard-05-chunk-1">
					<CardHeader className="pb-3">
						<CardDescription>Update your logo</CardDescription>
						<ClubImage club={props.club} width={150} height={50} />
					</CardHeader>

					<CardContent>{props.club && <DialogUpdateClubLogo club={props.club} />}</CardContent>
				</Card>

				<Card x-chunk="dashboard-05-chunk-1">
					<CardHeader className="pb-5">
						<CardDescription>Update your banner</CardDescription>
						<Image
							src={props.club?.banner_url ?? '/main_photo.jpeg'}
							width={250}
							height={50}
							alt={`banner of ${props.club?.name}`}
						/>
					</CardHeader>
					<CardContent>{props.club && <DialogUpdateClubBanner club={props.club} />}</CardContent>
				</Card>

				<Card x-chunk="dashboard-05-chunk-1">
					<CardHeader className="pb-5">
						<CardDescription>Update your club info</CardDescription>
					</CardHeader>
					<CardContent>
						<div className="grid w-full items-center gap-4">
							<div className="flex flex-col space-y-1.5">
								<Label htmlFor="name">Club Name</Label>
								<Input id="name" placeholder="Change name of your club" />
							</div>
							<div className="flex flex-col space-y-1.5">
								<Label htmlFor="name">Club Description</Label>
								<Input id="name" placeholder="Change description of your club" />
							</div>
							<div className="flex flex-col space-y-1.5">
								<Label htmlFor="framework">Club type</Label>
								<Select>
									<SelectTrigger id="framework">
										<SelectValue placeholder="Select club type" />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="Volunteer">Volunteer</SelectItem>
										<SelectItem value="Gaming">Gaming</SelectItem>
										<SelectItem value="Athletic">Athletic</SelectItem>
										<SelectItem value="Dance & Music">Dance & Music</SelectItem>
										<SelectItem value="Speaking">Speaking</SelectItem>
									</SelectContent>
								</Select>
							</div>
						</div>
					</CardContent>
				</Card>
			</div>
		</div>
	)
}
