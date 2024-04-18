import { UserClubStatus } from '@/types/club'
import { useCallback, useEffect, useState } from 'react'
import { toast } from 'sonner'

export type useUserClubStatusProps = {
	clubID: number
}

export default function useUserClubStatus({ clubID }: useUserClubStatusProps) {
	const [memberStatus, setMemberStatus] = useState<UserClubStatus>('NOT_MEMBER' as UserClubStatus)

	const handleJoinRequest = useCallback(async () => {
		const apiUrl = `http://localhost:5000/clubs/${clubID}/join`
		try {
			const response = await fetch(apiUrl, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				credentials: 'include',
			})

			if (!response.ok) {
				let errorData = await response.json()

				toast.error('Failed to make request to join club', {
					description: errorData.error,
				})
			}

			toast.success('Request to join club successfully made!', {
				action: {
					label: 'X',
					onClick: () => {},
				},
			})
		} catch (e) {
			toast.error('ERROR', {
				description: 'An error occurred while trying to make request to join club.',
			})
			console.log(e)
		}
		fetchUserClubStatus()
	}, [clubID])

	const handleLeaveClub = useCallback(async () => {
		const apiUrl = `http://localhost:5000/clubs/${clubID}/members`
		try {
			const response = await fetch(apiUrl, {
				method: 'DELETE',
				credentials: 'include',
			})

			if (!response.ok) {
				let errorData = await response.json()

				toast.error('Failed to make request to leave club', {
					description: errorData.error,
				})
				return
			}

			toast.success('Leaved club!', {
				action: {
					label: 'X',
					onClick: () => {},
				},
			})
		} catch (e) {
			toast.error('ERROR', {
				description: 'An error occurred while trying to make request to leave club.',
			})
			console.log(e)
		}
		fetchUserClubStatus()
	}, [clubID])

	const fetchUserClubStatus = useCallback(() => {
		fetch(`http://localhost:5000/clubs/${clubID}/join/status`, { credentials: 'include' })
			.then(async (res) => {
				const data = await res.json()
				if (!res.ok) {
					toast.error('not found', {
						description: data.error,
					})

					throw new Error(data.error || 'Failed to Fetch member join status info')
				}

				setMemberStatus(data.status)
			})
			.catch((error) => console.log(error.message))
	}, [clubID])

	useEffect(() => {
		fetchUserClubStatus()
	}, [fetchUserClubStatus, handleJoinRequest, handleLeaveClub])

	return { fetchUserClubStatus, handleJoinRequest, handleLeaveClub, memberStatus }
}
