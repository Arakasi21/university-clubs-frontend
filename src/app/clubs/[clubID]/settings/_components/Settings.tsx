import { DialogUpdateClubBanner } from '@/components/clubs/DialogUpdateClubBanner'
import { DialogUpdateClubLogo } from '@/components/clubs/DialogUpdateClubLogo'
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from '@/components/ui/card'
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
import { CircleUser, Menu, Package2, Search } from 'lucide-react'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Checkbox } from '@/components/ui/checkbox'

// TODO MAKE CLUB INFO PATCH ( WRITE PATCH FOR UPDATING CLUB INFO )

export default function Settings(props: {
	memberPerms: Permissions
	club: Club | undefined
	clubMembers: ClubMember[] | undefined
}) {
	return (
		<div>
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
			<div className="flex min-h-screen w-full flex-col">
				<main className="flex min-h-[calc(100vh_-_theme(spacing.16))] flex-1 flex-col gap-4 bg-muted/40 p-4 md:gap-8 md:p-10">
					<div className="mx-auto grid w-full max-w-6xl gap-2">
						<h1 className="text-3xl font-semibold">Settings</h1>
					</div>
					<div className="mx-auto grid w-full max-w-6xl items-start gap-6 md:grid-cols-[180px_1fr] lg:grid-cols-[250px_1fr]">
						<nav
							className="grid gap-4 text-sm text-muted-foreground"
							x-chunk="dashboard-04-chunk-0"
						>
							<Link href="#" className="font-semibold text-primary">
								General
							</Link>
							<Link href="#">{props.club && <DialogUpdateClubLogo club={props.club} />}</Link>
							<Link href="#">{props.club && <DialogUpdateClubBanner club={props.club} />}</Link>
							<Link href={`/clubs/${props.club?.id}/events`}>
								<Button>Create Event</Button>
							</Link>
							<Link href="#">Organizations</Link>
							<Link href="#">Advanced</Link>
						</nav>
						<div className="grid gap-6">
							<Card x-chunk="dashboard-04-chunk-1">
								<CardHeader>
									<CardTitle>Store Name</CardTitle>
									<CardDescription>Used to identify your store in the marketplace.</CardDescription>
								</CardHeader>
								<CardContent>
									<form>
										<Input placeholder="Store Name" />
									</form>
								</CardContent>
								<CardFooter className="border-t px-6 py-4">
									<Button>Save</Button>
								</CardFooter>
							</Card>
							<Card x-chunk="dashboard-04-chunk-2">
								<CardHeader>
									<CardTitle>Plugins Directory</CardTitle>
									<CardDescription>
										The directory within your project, in which your plugins are located.
									</CardDescription>
								</CardHeader>
								<CardContent>
									<form className="flex flex-col gap-4">
										<Input placeholder="Project Name" defaultValue="/content/plugins" />
										<div className="flex items-center space-x-2">
											<Checkbox id="include" defaultChecked />
											<label
												htmlFor="include"
												className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
											>
												Allow administrators to change the directory.
											</label>
										</div>
									</form>
								</CardContent>
								<CardFooter className="border-t px-6 py-4">
									<Button>Save</Button>
								</CardFooter>
							</Card>
						</div>
					</div>
				</main>
			</div>
		</div>
	)
}
