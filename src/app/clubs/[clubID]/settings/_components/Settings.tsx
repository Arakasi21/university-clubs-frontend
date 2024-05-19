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
import { Separator } from '@/components/ui/separator'

// TODO MAKE CLUB INFO PATCH ( WRITE PATCH FOR UPDATING CLUB INFO )

export default function Settings(props: {
	memberPerms: Permissions
	club: Club | undefined
	clubMembers: ClubMember[] | undefined
}) {
	return (
		<div>
			<div className="flex min-h-[calc(100vh_-_theme(spacing.16))] w-full flex-1 flex-col flex-col gap-4 rounded-lg bg-muted/40 p-4 md:gap-8 md:p-10">
				<div className="mx-auto grid w-full max-w-6xl gap-2">
					<h1 className="text-3xl font-semibold">Settings</h1>
				</div>
				<div className="mx-auto grid w-full max-w-6xl items-start gap-6 md:grid-cols-[180px_1fr] lg:grid-cols-[250px_1fr]">
					<nav className="grid gap-4 text-sm " x-chunk="dashboard-04-chunk-0">
						<p className="text-lg font-semibold">General</p>

						<Link className="w-40" href="#">
							{props.club && <DialogUpdateClubLogo club={props.club} />}
						</Link>

						<Link className="w-40" href="#">
							{props.club && <DialogUpdateClubBanner club={props.club} />}
						</Link>
						<Link className="w-40" href={`/clubs/${props.club?.id}/events`}>
							<Button className="w-40">Create Event</Button>
						</Link>
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

						<Card className="border-red-900">
							<CardHeader>
								<CardTitle>Danger Zone</CardTitle>
								<CardDescription className="pb-2">Your responsibility</CardDescription>
								<Separator />
								<div className="flex items-center py-2">
									<Label className="text-sm text-muted-foreground">
										Transfer ownership of the club
									</Label>
									<Button
										className="ml-auto text-red-500 hover:bg-red-500 hover:text-white"
										variant="secondary"
									>
										Transfer
									</Button>
								</div>
								<Separator />
								<div className="flex items-center py-2">
									<Label className="text-sm text-muted-foreground ">Delete Club</Label>
									<Button
										className="ml-auto  text-red-500 hover:bg-red-500 hover:text-white"
										variant="secondary"
									>
										Delete Club
									</Button>
								</div>
							</CardHeader>
						</Card>
					</div>
				</div>
			</div>
		</div>
	)
}
