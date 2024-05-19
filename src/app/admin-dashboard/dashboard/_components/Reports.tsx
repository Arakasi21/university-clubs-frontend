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
		const mockEvents: Record<string, Event[]> = {
			March: [
				{
					_id: '1',
					club_id: 14,
					user_id: 8,
					status: 'DRAFT',
					is_approve: false,
					created_at: '2024-05-17T12:24:22.417Z',
					updated_at: '2024-05-17T12:24:22.417Z',
					deleted_at: '0001-01-01T00:00:00.000Z',
					attachedfiles: [],
					attachedimages: ['https://via.placeholder.com/200'],
					club: { _id: 14, name: 'AITU GAMING', logo_url: '' },
					collaboratorclubs: null,
					coverimages: [],
					createdat: '2024-05-17T12:24:22.417Z',
					deletedat: '0001-01-01T00:00:00.000Z',
					description:
						'The Gaming club was created to expand the opportunities of students interested in esports to take part in various events on the topic of esports. And now, students are enthusiastically gaining experience in such disciplines as Counter-Strike, Global Offensive and Dota 2.Our task is to perform at tournaments in Kazakhstan on behalf of our university, thereby attracting more young people, both to our Astana IT University and to our Gaming Club.',
					enddate: '2024-05-31T19:07:38.000Z',
					id: '66474c7669073c23b823df93',
					locationlink: 'https://yandex.kz/maps/ru/-/CDb8UR-7',
					locationuniversity: '',
					maxparticipants: 100,
					organizers: null,
					participantscount: 50,
					startdate: '2024-03-15T12:00:00Z',
					tags: ['gaming', 'tournament'],
					title: 'Gaming Tournament',
					type: 'university',
					updatedat: '2024-05-17T12:26:07.635Z',
					user: {
						_id: 8,
						first_name: 'Arman',
						last_name: 'Zhunissov',
						barcode: '211427',
						avatar_url: '',
					},
				},
				{
					_id: '2',
					club_id: 14,
					user_id: 8,
					status: 'DRAFT',
					is_approve: false,
					created_at: '2024-05-17T12:24:22.417Z',
					updated_at: '2024-05-17T12:24:22.417Z',
					deleted_at: '0001-01-01T00:00:00.000Z',
					attachedfiles: [],
					attachedimages: ['https://via.placeholder.com/150'],
					club: { _id: 14, name: 'AITU GAMING', logo_url: '' },
					collaboratorclubs: null,
					coverimages: [],
					createdat: '2024-05-17T12:24:22.417Z',
					deletedat: '0001-01-01T00:00:00.000Z',
					description: 'Live streaming event to raise funds for charity.',
					enddate: '2024-05-31T19:07:38.000Z',
					id: '66474c7669073c23b823df93',
					locationlink: 'https://yandex.kz/maps/ru/-/CDb8UR-7',
					locationuniversity: '',
					maxparticipants: 50,
					organizers: null,
					participantscount: 30,
					startdate: '2024-03-18T12:00:00Z',
					tags: ['charity', 'streaming'],
					title: 'Charity Stream',
					type: 'university',
					updatedat: '2024-05-17T12:26:07.635Z',
					user: {
						_id: 8,
						first_name: 'Arman',
						last_name: 'Zhunissov',
						barcode: '211427',
						avatar_url: '',
					},
				},
				{
					_id: '3',
					club_id: 14,
					user_id: 8,
					status: 'DRAFT',
					is_approve: false,
					created_at: '2024-05-17T12:24:22.417Z',
					updated_at: '2024-05-17T12:24:22.417Z',
					deleted_at: '0001-01-01T00:00:00.000Z',
					attachedfiles: [],
					attachedimages: ['https://via.placeholder.com/150'],
					club: { _id: 14, name: 'AITU GAMING', logo_url: '' },
					collaboratorclubs: null,
					coverimages: [],
					createdat: '2024-05-17T12:24:22.417Z',
					deletedat: '0001-01-01T00:00:00.000Z',
					description: 'Workshop on the basics of game development.',
					enddate: '2024-05-31T19:07:38.000Z',
					id: '66474c7669073c23b823df93',
					locationlink: 'https://yandex.kz/maps/ru/-/CDb8UR-7',
					locationuniversity: '',
					maxparticipants: 30,
					organizers: null,
					participantscount: 20,
					startdate: '2024-03-20T12:00:00Z',
					tags: ['workshop', 'game development'],
					title: 'Game Development Workshop',
					type: 'university',
					updatedat: '2024-05-17T12:26:07.635Z',
					user: {
						_id: 8,
						first_name: 'Arman',
						last_name: 'Zhunissov',
						barcode: '211427',
						avatar_url: '',
					},
				},
			],
			April: [
				{
					_id: '4',
					club_id: 14,
					user_id: 8,
					status: 'DRAFT',
					is_approve: false,
					created_at: '2024-05-17T12:24:22.417Z',
					updated_at: '2024-05-17T12:24:22.417Z',
					deleted_at: '0001-01-01T00:00:00.000Z',
					attachedfiles: [],
					attachedimages: ['https://via.placeholder.com/150'],
					club: { _id: 14, name: 'AITU GAMING', logo_url: '' },
					collaboratorclubs: null,
					coverimages: [],
					createdat: '2024-05-17T12:24:22.417Z',
					deletedat: '0001-01-01T00:00:00.000Z',
					description: 'LAN party to enjoy multiplayer games.',
					enddate: '2024-05-31T19:07:38.000Z',
					id: '66474c7669073c23b823df93',
					locationlink: 'https://yandex.kz/maps/ru/-/CDb8UR-7',
					locationuniversity: '',
					maxparticipants: 60,
					organizers: null,
					participantscount: 40,
					startdate: '2024-04-10T12:00:00Z',
					tags: ['LAN party', 'gaming'],
					title: 'Spring LAN Party',
					type: 'university',
					updatedat: '2024-05-17T12:26:07.635Z',
					user: {
						_id: 8,
						first_name: 'Arman',
						last_name: 'Zhunissov',
						barcode: '211427',
						avatar_url: '',
					},
				},
				{
					_id: '5',
					club_id: 14,
					user_id: 8,
					status: 'DRAFT',
					is_approve: false,
					created_at: '2024-05-17T12:24:22.417Z',
					updated_at: '2024-05-17T12:24:22.417Z',
					deleted_at: '0001-01-01T00:00:00.000Z',
					attachedfiles: [],
					attachedimages: ['https://via.placeholder.com/150'],
					club: { _id: 14, name: 'AITU GAMING', logo_url: '' },
					collaboratorclubs: null,
					coverimages: [],
					createdat: '2024-05-17T12:24:22.417Z',
					deletedat: '0001-01-01T00:00:00.000Z',
					description: 'Bootcamp for aspiring e-sports athletes.',
					enddate: '2024-05-31T19:07:38.000Z',
					id: '66474c7669073c23b823df93',
					locationlink: 'https://yandex.kz/maps/ru/-/CDb8UR-7',
					locationuniversity: '',
					maxparticipants: 50,
					organizers: null,
					participantscount: 25,
					startdate: '2024-04-15T12:00:00Z',
					tags: ['e-sports', 'bootcamp'],
					title: 'E-Sports Bootcamp',
					type: 'university',
					updatedat: '2024-05-17T12:26:07.635Z',
					user: {
						_id: 8,
						first_name: 'Arman',
						last_name: 'Zhunissov',
						barcode: '211427',
						avatar_url: '',
					},
				},
				{
					_id: '6',
					club_id: 14,
					user_id: 8,
					status: 'DRAFT',
					is_approve: false,
					created_at: '2024-05-17T12:24:22.417Z',
					updated_at: '2024-05-17T12:24:22.417Z',
					deleted_at: '0001-01-01T00:00:00.000Z',
					attachedfiles: [],
					attachedimages: ['https://via.placeholder.com/150'],
					club: { _id: 14, name: 'AITU GAMING', logo_url: '' },
					collaboratorclubs: null,
					coverimages: [],
					createdat: '2024-05-17T12:24:22.417Z',
					deletedat: '0001-01-01T00:00:00.000Z',
					description: 'An evening dedicated to classic retro games.',
					enddate: '2024-05-31T19:07:38.000Z',
					id: '66474c7669073c23b823df93',
					locationlink: 'https://yandex.kz/maps/ru/-/CDb8UR-7',
					locationuniversity: '',
					maxparticipants: 30,
					organizers: null,
					participantscount: 15,
					startdate: '2024-04-20T12:00:00Z',
					tags: ['retro gaming', 'social'],
					title: 'Retro Gaming Night',
					type: 'university',
					updatedat: '2024-05-17T12:26:07.635Z',
					user: {
						_id: 8,
						first_name: 'Arman',
						last_name: 'Zhunissov',
						barcode: '211427',
						avatar_url: '',
					},
				},
			],
			May: [
				{
					_id: '7',
					club_id: 14,
					user_id: 8,
					status: 'DRAFT',
					is_approve: false,
					created_at: '2024-05-17T12:24:22.417Z',
					updated_at: '2024-05-17T12:24:22.417Z',
					deleted_at: '0001-01-01T00:00:00.000Z',
					attachedfiles: [],
					attachedimages: ['https://via.placeholder.com/150'],
					club: { _id: 14, name: 'AITU GAMING', logo_url: '' },
					collaboratorclubs: null,
					coverimages: [],
					createdat: '2024-05-17T12:24:22.417Z',
					deletedat: '0001-01-01T00:00:00.000Z',
					description: 'Showcase of indie games developed by local creators.',
					enddate: '2024-05-31T19:07:38.000Z',
					id: '66474c7669073c23b823df93',
					locationlink: 'https://yandex.kz/maps/ru/-/CDb8UR-7',
					locationuniversity: '',
					maxparticipants: 20,
					organizers: null,
					participantscount: 10,
					startdate: '2024-05-05T12:00:00Z',
					tags: ['indie games', 'showcase'],
					title: 'Indie Game Showcase',
					type: 'university',
					updatedat: '2024-05-17T12:26:07.635Z',
					user: {
						_id: 8,
						first_name: 'Arman',
						last_name: 'Zhunissov',
						barcode: '211427',
						avatar_url: '',
					},
				},
				{
					_id: '8',
					club_id: 14,
					user_id: 8,
					status: 'DRAFT',
					is_approve: false,
					created_at: '2024-05-17T12:24:22.417Z',
					updated_at: '2024-05-17T12:24:22.417Z',
					deleted_at: '0001-01-01T00:00:00.000Z',
					attachedfiles: [],
					attachedimages: ['https://via.placeholder.com/150'],
					club: { _id: 14, name: 'AITU GAMING', logo_url: '' },
					collaboratorclubs: null,
					coverimages: [],
					createdat: '2024-05-17T12:24:22.417Z',
					deletedat: '0001-01-01T00:00:00.000Z',
					description: 'Experience the latest in virtual reality technology.',
					enddate: '2024-05-31T19:07:38.000Z',
					id: '66474c7669073c23b823df93',
					locationlink: 'https://yandex.kz/maps/ru/-/CDb8UR-7',
					locationuniversity: '',
					maxparticipants: 40,
					organizers: null,
					participantscount: 20,
					startdate: '2024-05-10T12:00:00Z',
					tags: ['virtual reality', 'technology'],
					title: 'VR Experience Day',
					type: 'university',
					updatedat: '2024-05-17T12:26:07.635Z',
					user: {
						_id: 8,
						first_name: 'Arman',
						last_name: 'Zhunissov',
						barcode: '211427',
						avatar_url: '',
					},
				},
				{
					_id: '9',
					club_id: 14,
					user_id: 8,
					status: 'DRAFT',
					is_approve: false,
					created_at: '2024-05-17T12:24:22.417Z',
					updated_at: '2024-05-17T12:24:22.417Z',
					deleted_at: '0001-01-01T00:00:00.000Z',
					attachedfiles: [],
					attachedimages: ['https://via.placeholder.com/150'],
					club: { _id: 14, name: 'AITU GAMING', logo_url: '' },
					collaboratorclubs: null,
					coverimages: [],
					createdat: '2024-05-17T12:24:22.417Z',
					deletedat: '0001-01-01T00:00:00.000Z',
					description: 'Tournament for competitive strategy games.',
					enddate: '2024-05-31T19:07:38.000Z',
					id: '66474c7669073c23b823df93',
					locationlink: 'https://yandex.kz/maps/ru/-/CDb8UR-7',
					locationuniversity: '',
					maxparticipants: 50,
					organizers: null,
					participantscount: 30,
					startdate: '2024-05-20T12:00:00Z',
					tags: ['strategy games', 'tournament'],
					title: 'Competitive Strategy Games',
					type: 'university',
					updatedat: '2024-05-17T12:26:07.635Z',
					user: {
						_id: 8,
						first_name: 'Arman',
						last_name: 'Zhunissov',
						barcode: '211427',
						avatar_url: '',
					},
				},
			],
		}

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
