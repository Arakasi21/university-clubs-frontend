'use client'
import React, { useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { EventDialog } from '@/components/admin/DialogViewMonthEvent'
import { DetailedEventDialog } from '@/components/admin/DetailedEventDialog'
import { Event } from '@/types/event'

export default function Reports() {
	const [selectedMonth, setSelectedMonth] = useState<string | null>(null)
	const [events, setEvents] = useState<Event[]>([])
	const [dialogOpen, setDialogOpen] = useState(false)
	const [selectedEvent, setSelectedEvent] = useState<Event | null>(null)
	const [eventDialogOpen, setEventDialogOpen] = useState(false)

	const handleCardClick = (month: string) => {
		const mockEvents: Record<string, Event[]> = {}

		setSelectedMonth(month)
		setEvents(mockEvents[month] || [])
		setDialogOpen(true)
	}

	const closeDialog = () => {
		setDialogOpen(false)
	}

	const handleEventClick = (event: Event) => {
		setSelectedEvent(event)
		setEventDialogOpen(true)
	}

	const closeEventDialog = () => {
		setEventDialogOpen(false)
	}

	return (
		<div>
			<Tabs defaultValue="volunteer" className="grid flex-1 items-start">
				<TabsList className="grid w-full grid-cols-2">
					<TabsTrigger value="volunteer">Volunteering</TabsTrigger>
					<TabsTrigger value="sport">Sports</TabsTrigger>
				</TabsList>
				<TabsContent value="volunteer">
					{/* Cards with club name and last three months */}
					<div className="grid grid-cols-4 gap-10 pt-4">
						<Card className="bg-black/15">
							<CardHeader className="pb-3">
								<CardTitle className="text-2xl">AITU GAMING</CardTitle>
							</CardHeader>
							<CardContent>
								{['March', 'April', 'May'].map((month) => (
									<Card
										key={month}
										className="m-4 cursor-pointer bg-muted/70"
										onClick={() => handleCardClick(month)}
									>
										<CardHeader className="pb-3">
											<CardTitle className="text-center text-lg">{month}</CardTitle>
										</CardHeader>
										<CardContent>
											<p className="text-center">3 events organized</p>
										</CardContent>
									</Card>
								))}
							</CardContent>
						</Card>

						<Card className="bg-black/15">
							<CardHeader className="pb-3">
								<CardTitle className="text-2xl">AITU CINEPHILE</CardTitle>
							</CardHeader>
							<CardContent>
								{['March', 'April', 'May'].map((month) => (
									<Card
										key={month}
										className="m-4 cursor-pointer bg-muted/70"
										onClick={() => handleCardClick(month)}
									>
										<CardHeader className="pb-3">
											<CardTitle className="text-center text-lg">{month}</CardTitle>
										</CardHeader>
										<CardContent>
											<p className="text-center">3 events organized</p>
										</CardContent>
									</Card>
								))}
							</CardContent>
						</Card>

						<Card className="bg-black/15">
							<CardHeader className="pb-3">
								<CardTitle className="text-2xl">AITU DANCE</CardTitle>
							</CardHeader>
							<CardContent>
								{['March', 'April', 'May'].map((month) => (
									<Card
										key={month}
										className="m-4 cursor-pointer bg-muted/70"
										onClick={() => handleCardClick(month)}
									>
										<CardHeader className="pb-3">
											<CardTitle className="text-center text-lg">{month}</CardTitle>
										</CardHeader>
										<CardContent>
											<p className="text-center">3 events organized</p>
										</CardContent>
									</Card>
								))}
							</CardContent>
						</Card>

						<Card className="bg-black/15">
							<CardHeader className="pb-3">
								<CardTitle className="text-2xl">AITU VOLUNTEERING</CardTitle>
							</CardHeader>
							<CardContent>
								{['March', 'April', 'May'].map((month) => (
									<Card
										key={month}
										className="m-4 cursor-pointer bg-muted/70"
										onClick={() => handleCardClick(month)}
									>
										<CardHeader className="pb-3">
											<CardTitle className="text-center text-lg">{month}</CardTitle>
										</CardHeader>
										<CardContent>
											<p className="text-center">3 events organized</p>
										</CardContent>
									</Card>
								))}
							</CardContent>
						</Card>
					</div>
				</TabsContent>
				<TabsContent value="sport"></TabsContent>
			</Tabs>
			<EventDialog
				month={selectedMonth}
				events={events}
				isOpen={dialogOpen}
				onClose={closeDialog}
				onEventClick={handleEventClick}
			/>
			<DetailedEventDialog
				event={selectedEvent}
				isOpen={eventDialogOpen}
				onClose={closeEventDialog}
			/>
		</div>
	)
}
