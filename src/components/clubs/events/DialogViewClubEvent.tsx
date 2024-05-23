'use client'
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useState } from 'react'
import { Event } from '@/types/event'

type DialogViewClubEventProps = {
	event: Event
}

export function DialogViewClubEvent({ event }: DialogViewClubEventProps) {
	const [isOpen, setIsOpen] = useState(false)
	const toggleDialog = () => {
		setIsOpen(!isOpen)
	}
	const closeDialog = () => {
		setIsOpen(false)
	}

	return (
		<Dialog open={isOpen} onOpenChange={setIsOpen}>
			<DialogTrigger asChild>
				<Button className="h-8" variant={'default'} onClick={toggleDialog}>
					View Event
				</Button>
			</DialogTrigger>
			<DialogContent className="p-8">
				<Card className="w-[450px]">
					<CardHeader>
						<CardTitle>{event.id}</CardTitle>
						<CardDescription>{event.status}</CardDescription>
					</CardHeader>
				</Card>
			</DialogContent>
		</Dialog>
	)
}
