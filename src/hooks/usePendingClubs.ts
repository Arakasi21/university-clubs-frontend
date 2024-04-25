import { useEffect, useState } from 'react'
import useUserStore from '@/store/user'
import { FetchWithAuth } from '@/helpers/fetch_api'

export default function usePendingClubs() {
	const [pendingClubs, setPendingClubs] = useState(0)
	const userStore = useUserStore()

	useEffect(() => {
		const fetchPendingClubs = async () => {
			if (!userStore.jwt_token) {
				console.error('JWT token is missing')
				return
			}
			const response = await FetchWithAuth(
				`${process.env.NEXT_PUBLIC_BACKEND_URL}/clubs/pending?page=1&page_size=25`,
				{
					credentials: 'include',
				},
				userStore.jwt_token,
				userStore.setUser,
			)
			const data = await response.json()
			if (response.ok) {
				setPendingClubs(data.metadata.total_records)
			}
		}

		fetchPendingClubs()
	}, [userStore.jwt_token])

	return pendingClubs
}
