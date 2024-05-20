import React, { useCallback, useState } from 'react'
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useAxiosInterceptor } from '@/helpers/fetch_api'
import { toast } from 'sonner'
import useUserStore from '@/store/user'
import { EventInfo } from '@/components/clubs/settings/EventInfo'

export type UseEventCreateProps = {
	clubID: number
}

export default function EventCreationComponent({ clubID }: UseEventCreateProps) {
	const axiosAuth = useAxiosInterceptor()
	const [responseData, setResponseData] = useState(null)
	const [isOpen, setIsOpen] = useState(false)

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
				toast.success('Request to create event successfully made!', {
					action: {
						label: 'X',
						onClick: () => {},
					},
				})
				setResponseData(response.data.event)
				setIsOpen(false)
			}
		} catch (e) {
			toast.error('ERROR', {
				description: 'An error occurred while trying to make request to create event.',
			})
			console.log(e)
		}
	}, [clubID])

	const toggleData = () => {
		setIsOpen(!isOpen)
	}

	return (
		<Card>
			<CardHeader>
				<CardTitle>Event Handler</CardTitle>
				<CardDescription>Click the button to create an event</CardDescription>
			</CardHeader>
			<CardContent>
				{responseData && (
					<>
						<Button variant="secondary" onClick={toggleData}>
							{isOpen ? 'Hide Event Info' : 'Show Event Info'}
						</Button>
						{isOpen && responseData && <EventInfo data={responseData} />}
					</>
				)}
			</CardContent>
			<CardFooter className="border-t px-6 py-4">
				<Button onClick={handleCreateEvent} type="submit">
					Create
				</Button>
			</CardFooter>
		</Card>
	)
}
