import { useEffect, useState } from 'react'
import { useAxiosInterceptor } from '@/helpers/fetch_api'

export default function usePendingClubs() {
	const [pendingClubs, setPendingClubs] = useState(0)
	const axiosAuth = useAxiosInterceptor()

	useEffect(() => {
		const fetchPendingClubs = async () => {
			const response = await axiosAuth(
				`${process.env.NEXT_PUBLIC_BACKEND_URL}/clubs/pending?page=1&page_size=25`,
				{},
			)
			if (response.status.toString().startsWith('2')) {
				if (response.data.metadata.total_records) {
					setPendingClubs(response.data.metadata.total_records)
				}
			}
		}

		fetchPendingClubs()
	}, [])

	return pendingClubs
}
