'use client'
import React, { useCallback, useState } from 'react'
import { useAxiosInterceptor } from '@/helpers/fetch_api'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Event } from '@/types/event'
import { EventInfo } from '@/components/clubs/settings/EventInfo'

function GetEventComponent() {
	const axiosAuth = useAxiosInterceptor()
	const [eventId, setEventId] = useState('')
	const [event, setEvent] = useState<Event | null>(null)
	const [isOpen, setIsOpen] = useState(false)

	const handleGetEvent = useCallback(async () => {
		try {
			const apiUrl = `${process.env.NEXT_PUBLIC_BACKEND_URL}/events/${eventId}`
			const response = await axiosAuth(apiUrl, {
				method: 'GET',
			})

			console.log(response.status / 100)
			if (response.status / 100 != 2) {
				toast.error('Failed to fetch event info', {
					description: response.data.error,
				})
				return
			}

			setEvent(response.data.club)
			setIsOpen(true)
		} catch (e) {
			console.error(e)
		}
	}, [eventId])

	const toggleData = () => {
		setIsOpen(!isOpen)
	}

	return (
		<div>
			<Input
				type="text"
				value={eventId}
				onChange={(e) => setEventId(e.target.value)}
				placeholder="Enter event ID"
			/>
			<Button variant="secondary" onClick={handleGetEvent} type="submit" className="mr-2 mt-2">
				Get Event Info
			</Button>
			{event && (
				<>
					<Button variant="secondary" onClick={toggleData}>
						{isOpen ? 'Hide Event Info' : 'Show Event Info'}
					</Button>
					{isOpen && event && <EventInfo data={event} />}
				</>
			)}
		</div>
	)
}

export default GetEventComponent
