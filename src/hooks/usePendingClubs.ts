import { useEffect, useState } from 'react'
import { useAxiosInterceptor } from '@/helpers/fetch_api'
import { toast } from 'sonner'

export default function usePendingClubs() {
	const [pendingClubs, setPendingClubs] = useState(0)
	const axiosAuth = useAxiosInterceptor()

	useEffect(() => {
		const fetchPendingClubs = async () => {
			try {
				const response = await axiosAuth(
					`${process.env.NEXT_PUBLIC_BACKEND_URL}/clubs/pending?page=1&page_size=25`,
					{},
				)
				if (response.status.toString().startsWith('2')) {
					if (response.data.metadata.total_records) {
						setPendingClubs(response.data.metadata.total_records)
					}
				}
			} catch (error) {
				if (typeof error === 'object' && error !== null && 'response' in error) {
					const axiosError = error as { response: { status: number } }
					if (axiosError.response.status === 401) {
						toast.error('Login again!')
					}
				}
			}
			fetchPendingClubs()
		}
	}, [])

	return pendingClubs
}
