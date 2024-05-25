'use client'
import React from 'react'
import { useAxiosInterceptor } from '@/helpers/fetch_api'
import Nav from '@/components/NavBar'

export default function UpdateEventPage({ params }: { params: { eventID: number } }) {
	const axiosAuth = useAxiosInterceptor()

	async function updateEvent(eventId: number, updatedEvent: any) {
		try {
			const response = await axiosAuth(
				`${process.env.NEXT_PUBLIC_BACKEND_URL}/events/${eventId}`,
				updatedEvent,
			)

			if (response.status !== 200) {
				console.error('Update event error', response.data.error)
				return
			}

			console.log('Event successfully updated!')
		} catch (error) {
			console.error('An error occurred while updating the event:', error)
		}
	}

	return (
		<>
			<Nav />
		</>
	)
}
