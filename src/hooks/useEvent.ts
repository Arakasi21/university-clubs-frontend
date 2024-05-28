import { User } from '@/types/user'
import { useCallback, useEffect, useState } from 'react'
import { toast } from 'sonner'
import useEventStore from '@/store/event'
import { useAxiosInterceptor } from '@/helpers/fetch_api'
import { Event, EventParticipationStatus, EventUserStatus } from '@/types/event'

export type useEventProps = {
	eventID: string
	user: User | null
}

export default function useEvent({ eventID, user }: useEventProps) {
	const [event, setEvent] = useState<Event | null>(null)
	const [loading, setLoading] = useState(true)
	const [isOwner, setIsOwner] = useState(false)
	const [participantStatus, setParticipantStatus] = useState<EventParticipationStatus>('UNKNOWN')
	const [eventUserStatus, setEventUserStatus] = useState<EventUserStatus>('UNKNOWN')

	const axiosAuth = useAxiosInterceptor()
	const { setEventStore } = useEventStore()

	const fetchEventInfo = useCallback(async () => {
		try {
			const response = await axiosAuth(`${process.env.NEXT_PUBLIC_BACKEND_URL}/events/${eventID}`, {
				method: 'GET',
			})
			if (response.status.toString().startsWith('2')) {
				setEvent(response.data.event)
				setIsOwner(response.data.event.owner_id == user?.id)
				setLoading(false)
				setParticipantStatus(response.data.participation_status)
				setEventUserStatus(response.data.event_user_status)
				setEventStore(response.data.event, response.data.event.owner_id == user?.id, fetchEventInfo)
			} else {
				toast.error('not found', {
					description: response.data.error,
				})
				throw new Error(response.data.error || 'Failed to Fetch event info')
			}
		} catch (err) {
			console.log(err)
		}
	}, [eventID])

	useEffect(() => {
		fetchEventInfo()
	}, [fetchEventInfo])

	return { event, loading, isOwner, fetchEventInfo, participantStatus, eventUserStatus }
}
