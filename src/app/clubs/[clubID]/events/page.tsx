'use client'
import { Bird, CornerDownLeft, Mic, Paperclip, Rabbit, Settings, Turtle } from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
	Drawer,
	DrawerContent,
	DrawerDescription,
	DrawerHeader,
	DrawerTitle,
	DrawerTrigger,
} from '@/components/ui/drawer'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import Nav from '@/components/NavBar'
import BackgroundClubImage from '@/components/st/BackgroundClubImage'
import React from 'react'
import useClub from '@/hooks/useClub'
import Link from 'next/link'
import ClubImage from '@/components/st/ClubImage'

const CreateEventsPage = ({ params }: { params: { clubID: number } }) => {
	// @ts-ignore
	const { club } = useClub({ clubID: params.clubID })
	return (
		<>
			<Nav />
			<BackgroundClubImage club={club} />
			<div className="flex w-full justify-center gap-3 py-4">
				<Link href={`/clubs/${club?.id}/settings`}>
					<Button variant={'outline'}>Back to Settings</Button>
				</Link>
			</div>
			<div className="w-full justify-items-center px-96">
				<div className="flex flex-col">
					<main className="grid flex-1 gap-4 overflow-auto p-4 md:grid-cols-1 lg:grid-cols-1">
						<div
							className="relative hidden flex-col items-start gap-8 md:flex"
							x-chunk="dashboard-03-chunk-0"
						>
							<form className="grid w-full items-start gap-6">
								<fieldset className="grid gap-6 rounded-lg border p-4">
									<legend className="-ml-1 px-1 text-sm font-medium">Event Settings</legend>
									<div className="grid gap-3">
										<Label htmlFor="model">Event organizer</Label>
										<Select>
											<SelectTrigger
												id="model"
												className="items-start [&_[data-description]]:hidden"
											>
												<SelectValue placeholder="Select an event model" />
											</SelectTrigger>
											<SelectContent>
												<SelectItem value="system">Club</SelectItem>
												<SelectItem value="user">AITUSA</SelectItem>
												<SelectItem value="assistant">UNIVERSITY - DSBR</SelectItem>
											</SelectContent>
										</Select>
									</div>
									<div className="grid gap-3">
										<Label htmlFor="name">Event Name</Label>
										<Input id="name" placeholder="Event Name" />
									</div>
									<div className="grid grid-cols-2 gap-4">
										<div className="grid gap-3">
											<Label htmlFor="date">Event Date</Label>
											<Input id="date" type="date" />
										</div>
										<div className="grid gap-3">
											<Label htmlFor="time">Event Time</Label>
											<Input id="time" type="time" />
										</div>
									</div>
								</fieldset>
								<fieldset className="grid gap-6 rounded-lg border p-4">
									<legend className="-ml-1 px-1 text-sm font-medium">Event Content</legend>

									<div className="grid gap-3">
										<Label htmlFor="content">Event Content</Label>
										<Textarea id="content" placeholder="You are a..." className="min-h-[9.5rem]" />
									</div>

									<div className="grid gap-3">
										<Label htmlFor="content">Event Image</Label>
										<Input id="content" type="file" />
									</div>

									<div className="grid gap-3">
										<Label htmlFor="content">Event Link</Label>
										<Input id="content" placeholder="https://www.example.com" />
									</div>

									<div className="grid gap-3">
										<Label htmlFor="content">Event Location</Label>
										<Input id="content" placeholder="Location" />
									</div>

									<div className="grid gap-3">
										<Label htmlFor="content">Event Description</Label>
										<Textarea id="content" placeholder="Description" className="min-h-[9.5rem]" />
									</div>
								</fieldset>
							</form>
						</div>
					</main>
					<div className="flex w-full justify-center gap-3 py-4">
						<Button variant={'default'}>Create Event</Button>
					</div>
				</div>
			</div>
		</>
	)
}
export default CreateEventsPage
