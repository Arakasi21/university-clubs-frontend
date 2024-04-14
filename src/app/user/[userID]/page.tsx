'use client'
import Nav from '@/components/NavBar'
import { Button } from '@/components/ui/button'
import { IUser } from '@/interface/user'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useCallback, useEffect, useState } from 'react'
import { toast } from 'sonner'

const UserPage = ({ params }: { params: { userID: number } }) => {
	const [user, setUser] = useState(null as IUser | null)
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
				setIsOwner(data.user.id == params.userID)
			})
			.catch((error) => console.log(error.message))
	}, [params.userID])

	useEffect(() => {
		fetchUserInfo()
	}, [fetchUserInfo, params.userID])

	return (
		<div>
			<Nav />
			<div>
				<Image
					src={user?.avatar_url!}
					alt={`${user?.first_name} profile picture`}
					width={300}
					height={300}
				/>

				<p>
					{user?.first_name} {user?.last_name}
				</p>
				<p>Barcode: {user?.barcode}</p>
				{isOwner && (
					<Button
						onClick={() => {
							router.push('/user/edit')
						}}
					>
						Edit Profile
					</Button>
				)}
			</div>
		</div>
	)
}

export default UserPage
