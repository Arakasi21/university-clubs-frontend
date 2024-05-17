import { useEffect, useState } from 'react'
import useUserStore from '@/store/user'
import { useAxiosInterceptor } from '@/helpers/fetch_api'

export default function usePendingJoinRequests(clubID: number) {
	const [pendingRequests, setPendingRequests] = useState(0)
	const userStore = useUserStore()
	const axiosAuth = useAxiosInterceptor()

	useEffect(() => {
		const fetchPendingRequests = async () => {
			if (!userStore.jwt_token) {
				console.error('JWT token is missing')
				return
			}
			const response = await axiosAuth(
				`${process.env.NEXT_PUBLIC_BACKEND_URL}/clubs/${clubID}/join?page=1&page_size=25`,
			)
			if (response.status.toString().startsWith('2')) {
				setPendingRequests(response.data.metadata.total_records)
			}
		}

		fetchPendingRequests()
	}, [clubID, userStore.jwt_token])

	return pendingRequests
}
