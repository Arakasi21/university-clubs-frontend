'use client'
import Nav from '@/components/NavBar'
import { Button } from '@/components/ui/button'
import { IUser } from '@/interface/user'
import { IClub } from '@/interface/club'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useCallback, useEffect, useState } from 'react'
import { toast } from 'sonner'

const UserPage = ({ params }: { params: { userID: number } }) => {
	const [user, setUser] = useState(null as IUser | null)
	const [clubs, setClubs] = useState<IClub[] | null>(null)
	const [isOwner, setIsOwner] = useState(false)

	const router = useRouter()

	const fetchUserInfo = useCallback(() => {
		fetch(`http://localhost:5000/user/${params.userID}`)
			.then(async (res) => {
				const data = await res.json()
				if (!res.ok) {
					toast.error('not found', {
						description: data.error,
					})
					throw new Error(data.error || 'Failed to Fetch user info')
				}

				setUser(data.user)
				setIsOwner(data.user.id.toString() === params.userID.toString())

				console.log("Fetched user ID:", data.user.id); // Log fetched user ID
				console.log("Params user ID:", params.userID); // Log params user ID
				console.log("Type of fetched user ID:", typeof data.user.id); // Check type
				console.log("Type of params user ID:", typeof params.userID); // Check type


				const userClubsResponse = await fetch(`http://localhost:5000/user/${params.userID}/clubs`, { method: 'GET' })
				console.log(userClubsResponse)
				if (!userClubsResponse.ok) throw new Error('Failed to fetch user clubs')
				const userClubsData = await userClubsResponse.json()

				setClubs(userClubsData.clubs || [])
			})
			.catch((error) => console.log(error.message))
	}, [params.userID])

	useEffect(() => {
		fetchUserInfo()
	}, [fetchUserInfo])

	return (
		<div>
			<Nav />
			<div className="flex min-h-screen flex-col items-center justify-between p-24">
				{user ? (
					<div>
						<Image
							src={user.avatar_url!}
							alt={`${user.first_name} profile picture`}
							width={200}
							height={200}
						/>

						<p>
							Name: {user.first_name} {user.last_name}
						</p>
						<p>Barcode: {user.barcode}</p>
						<p>Email: {user.email}</p>
						<p>Group: {user.group_name}</p>
						<p>User ID: {params.userID}</p>
						{isOwner && (
							<Button onClick={() => router.push('/user/edit')}>
								Edit Profile
							</Button>
						)}
						<h2>Your Clubs</h2>
						{clubs?.length > 0 ? (
							<ul>{clubs?.map(club => <li key={club?.id}>{club?.name} - {club?.club_type}</li>)}</ul>
						) : <p>You are not the member of any clubs.</p>}
					</div>
				) : (
					<p>Loading user info...</p>
				)}
			</div>
		</div>
	)
}

export default UserPage
