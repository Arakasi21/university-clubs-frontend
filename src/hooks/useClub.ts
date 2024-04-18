import useUserStore from '@/store/user'
import { Club, ClubMember } from '@/types/club'
import { useCallback, useEffect, useState } from 'react'
import { toast } from 'sonner'
import { User } from '@/types/user'

export type useClubProps = {
	clubID: number
	user: User | null
}

export default function useClub({ clubID, user }: useClubProps) {
	const [club, setClub] = useState<Club>()
	const [clubMembers, setClubMembers] = useState<ClubMember[]>()
	const [loading, setLoading] = useState(true)
	const [isOwner, setIsOwner] = useState(false)

	const fetchClubInfo = useCallback(() => {
		fetch(`http://localhost:5000/clubs/${clubID}`)
			.then(async (res) => {
				const data = await res.json()
				if (!res.ok) {
					toast.error('not found', {
						description: data.error,
					})

					throw new Error(data.error || 'Failed to Fetch club info')
				}

				setClub(data.club)
				setIsOwner(data.club.owner_id == user?.id)
				setLoading(false)
			})
			.catch((error) => console.log(error.message))

		fetch(`http://localhost:5000/clubs/${clubID}/members?page=1&page_size=30`)
			.then(async (res) => {
				const data = await res.json()
				if (!res.ok) {
					toast.error('not found', {
						description: data.error,
					})

					throw new Error(data.error || 'Failed to Fetch club info')
				}

				setClubMembers(data.members)
			})
			.catch((error) => console.log(error.message))
	}, [clubID, user?.id])

	useEffect(() => {
		fetchClubInfo()
	}, [fetchClubInfo, clubID])

	return { club, clubMembers, loading, isOwner, fetchClubInfo }
}
