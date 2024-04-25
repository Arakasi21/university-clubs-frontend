'use client'
import AvatarEditForm from '@/components/st/avatarEditForm'
import Nav from '@/components/NavBar'
import useUserStore from '@/store/user'
import { User } from '@/types/user'
import { useCallback, useEffect, useState } from 'react'

const Page = () => {
	const store = useUserStore()
	const [user, setUser] = useState(null as User | null)

	const fetchUserInfo = useCallback(() => {
		fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/users/${store.user?.id}`)
			.then(async (res) => {
				const data = await res.json()
				if (!res.ok) {
					throw new Error(data.error || 'Failed to Fetch user info')
				}

				setUser(data.user)
			})
			.catch((error) => console.log(error.message))
	}, [store.user?.id])

	useEffect(() => {
		fetchUserInfo()
	}, [store.user?.id, fetchUserInfo])
	return (
		<>
			<Nav />
			<div className="flex min-h-screen flex-col items-center justify-between p-24">
				<AvatarEditForm user={user} className="flex min-h-screen flex-col justify-between p-24" />
			</div>
		</>
	)
}

export default Page
