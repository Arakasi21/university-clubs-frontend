import { useEffect, useState } from 'react'
import { useAxiosInterceptor } from '@/helpers/fetch_api'
import { OrganizerInvite } from '@/types/invite'

export default function usePendingClubInvites(userID: number) {
	const [pendingUserInvites, setPendingUserInvites] = useState(0)
	const [eventInvites, setEventInvites] = useState<OrganizerInvite[] | null>([])
	const axiosAuth = useAxiosInterceptor()
	const fetchPendingUserInvites = async () => {
		const response = await axiosAuth(
			`${process.env.NEXT_PUBLIC_BACKEND_URL}/users/events/invites`,
			{
				withCredentials: true,
			},
		)

		if (response.status.toString().startsWith('2')) {
			if (response.data && response.data.invites) {
				setPendingUserInvites(response.data.invites ? response.data.invites.length : 0)
				setEventInvites(response.data.invites)
			}
		}
	}
	useEffect(() => {
		fetchPendingUserInvites()
	}, [userID])

	return {
		fetchPendingUserInvites,
		pendingUserInvites,
		eventInvites,
		setPendingUserInvites,
		setEventInvites,
	}
}
