import React, { useCallback, useState } from 'react'
import { Button } from '@/components/ui/button'
import { useAxiosInterceptor } from '@/helpers/fetch_api'
import { toast } from 'sonner'

export type UseEventCreateProps = {
	clubID: number | undefined
	onEventCreated: () => void
}

export default function EventCreationComponent({ clubID, onEventCreated }: UseEventCreateProps) {
	const axiosAuth = useAxiosInterceptor()

	const handleCreateEvent = useCallback(async () => {
		try {
			const apiUrl = `${process.env.NEXT_PUBLIC_BACKEND_URL}/clubs/${clubID}/events`
			const response = await axiosAuth(apiUrl, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
			})

			if (!response.status.toString().startsWith('2')) {
				toast.error('Failed to make request to create event', {
					description: response.data.error,
				})
			} else {
				toast.success('Event successfully created!', {
					action: {
						label: 'X',
						onClick: () => {},
					},
				})

				setIsOpen(false)
				onEventCreated()
			}
		} catch (e) {
			toast.error('ERROR', {
				description: 'An error occurred while trying to make request to create event.',
			})
			console.log(e)
		}
	}, [clubID, onEventCreated])

	return (
		<Button onClick={handleCreateEvent} type="submit">
			Create
		</Button>
	)
}
