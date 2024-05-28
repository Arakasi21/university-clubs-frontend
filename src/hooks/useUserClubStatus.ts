import { UserClubStatus } from '@/types/club'
import { useCallback, useEffect, useState } from 'react'
import { toast } from 'sonner'
import { useAxiosInterceptor } from '@/helpers/fetch_api'
import { useRouter } from 'next/navigation'

export type UseUserClubStatusProps = {
	clubID: number
}

export default function useUserClubStatus({ clubID }: UseUserClubStatusProps) {
	const [memberStatus, setMemberStatus] = useState<UserClubStatus>('NOT_MEMBER')
	const axiosAuth = useAxiosInterceptor()
	const router = useRouter()
	// Disable eslint for the specific line
	// eslint-disable-next-line react-hooks/exhaustive-deps
	const fetchUserClubStatus = useCallback(async () => {
		try {
			const response = await axiosAuth(
				`${process.env.NEXT_PUBLIC_BACKEND_URL}/clubs/${clubID}/join/status`,
			)
			if (!response.status.toString().startsWith('2')) {
				toast.error('Failed to fetch member join status', { description: response.data.error })
				throw new Error(response.data.error || 'Failed to fetch member join status')
			}
			setMemberStatus(response.data.status)
		} catch (error) {
			console.error(error)
		}
	}, [clubID])
	// Disable eslint for the specific line
	// eslint-disable-next-line react-hooks/exhaustive-deps
	const handleJoinRequest = useCallback(async () => {
		try {
			const apiUrl = `${process.env.NEXT_PUBLIC_BACKEND_URL}/clubs/${clubID}/join`
			const response = await axiosAuth(apiUrl, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				withCredentials: true,
			})

			if (!response.status.toString().startsWith('2')) {
				toast.error('Failed to make request to join club', { description: response.data.error })
			} else {
				toast.success('Request to join club successfully made!', {
					action: {
						label: 'Close',
						onClick: () => {},
					},
				})
			}
		} catch (error) {
			toast.error('ERROR', { description: 'An error occurred while trying to join the club.' })
			console.error(error)
		}
		await fetchUserClubStatus()
	}, [fetchUserClubStatus, clubID])

	// Disable eslint for the specific line
	// eslint-disable-next-line react-hooks/exhaustive-deps
	const handleLeaveClub = useCallback(async () => {
		try {
			const apiUrl = `${process.env.NEXT_PUBLIC_BACKEND_URL}/clubs/${clubID}/members`
			const response = await axiosAuth(apiUrl, {
				method: 'DELETE',
				withCredentials: true,
			})

			if (!response.status.toString().startsWith('2')) {
				toast.error('Failed to leave club', { description: response.data.error })
			} else {
				toast.success('Left club successfully')
				router.push('/explore/clubs')
			}
		} catch (error) {
			toast.error('ERROR', { description: 'An error occurred while trying to leave the club.' })
			console.error(error)
		}
		await fetchUserClubStatus()
	}, [clubID, fetchUserClubStatus])

	useEffect(() => {
		fetchUserClubStatus()
	}, [fetchUserClubStatus])

	return { fetchUserClubStatus, handleJoinRequest, handleLeaveClub, memberStatus }
}
