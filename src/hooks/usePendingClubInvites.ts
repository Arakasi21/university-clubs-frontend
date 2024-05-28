import { useEffect, useState } from 'react'
import { useAxiosInterceptor } from '@/helpers/fetch_api'
import { CollaboratorInvite } from '@/types/invite'

export default function usePendingClubInvites(clubID: number) {
	const [pendingClubInvites, setPendingRequests] = useState(0)
	const [eventInvites, setEventInvites] = useState<CollaboratorInvite[] | null>([])
	const axiosAuth = useAxiosInterceptor()
	const fetchPendingInvites = async () => {
		const response = await axiosAuth(
			`${process.env.NEXT_PUBLIC_BACKEND_URL}/clubs/${clubID}/invites`,
		)
		if (response.status.toString().startsWith('2')) {
			if (response.data && response.data.invites) {
				setPendingRequests(response.data.invites ? response.data.invites.length : 0)
				setEventInvites(response.data.invites)
			} else {
				console.warn('Unexpected response structure', response.data)
			}
		}
	}
	useEffect(() => {
		fetchPendingInvites()
	}, [clubID])

	return {
		fetchPendingInvites,
		pendingClubInvites,
		eventInvites,
		setPendingRequests,
		setEventInvites,
	}
}
