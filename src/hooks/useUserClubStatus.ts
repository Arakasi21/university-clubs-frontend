import { UserClubStatus } from '@/types/club'
import { useCallback, useEffect, useState } from 'react'
import { toast } from 'sonner'
import useUserStore from '@/store/user'
import { FetchWithAuth } from '@/helpers/fetch_api'

export type UseUserClubStatusProps = {
	clubID: number
}

export default function useUserClubStatus({ clubID }: UseUserClubStatusProps) {
	const [memberStatus, setMemberStatus] = useState<UserClubStatus>('NOT_MEMBER')
	const { jwt_token, setUser } = useUserStore()

	const fetchUserClubStatus = useCallback(async () => {
		try {
			const response = await FetchWithAuth(
				`${process.env.NEXT_PUBLIC_BACKEND_URL}/clubs/${clubID}/join/status`,
				{
					credentials: 'include',
				},
				jwt_token,
				setUser,
			)
			const data = await response.json()
			if (!response.ok) {
				toast.error('Failed to fetch member join status', { description: data.error })
				throw new Error(data.error || 'Failed to fetch member join status')
			}
			setMemberStatus(data.status)
		} catch (error) {
			console.error(error)
		}
	}, [clubID, jwt_token])

	const handleJoinRequest = useCallback(async () => {
		try {
			if (!jwt_token) {
				throw new Error('JWT token is missing')
			}
			const apiUrl = `${process.env.NEXT_PUBLIC_BACKEND_URL}/clubs/${clubID}/join`
			const response = await FetchWithAuth(
				apiUrl,
				{
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					credentials: 'include',
				},
				jwt_token,
				setUser,
			)

			if (!response.ok) {
				const errorData = await response.json()
				toast.error('Failed to make request to join club', { description: errorData.error })
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
	}, [clubID, jwt_token, fetchUserClubStatus])

	const handleLeaveClub = useCallback(async () => {
		try {
			const apiUrl = `${process.env.NEXT_PUBLIC_BACKEND_URL}/clubs/${clubID}/members`
			const response = await fetch(apiUrl, {
				method: 'DELETE',
				credentials: 'include',
			})

			if (!response.ok) {
				const errorData = await response.json()
				toast.error('Failed to leave club', { description: errorData.error })
			} else {
				toast.success('Left club successfully')
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
