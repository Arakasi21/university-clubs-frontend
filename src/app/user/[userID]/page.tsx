'use client'
import { Button } from '@/components/ui/button'
import useUserStore from '@/store/user'
import { Club } from '@/types/club'
import { User } from '@/types/user'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import React, { useCallback, useEffect, useState } from 'react'
import { toast } from 'sonner'
import Layout from '@/components/Layout'
import UserAvatar from '@/components/user/userAvatar'

const UserPage = ({ params }: { params: { userID: number } }) => {
	const { user } = useUserStore()
	const [pageowner, setPageowner] = useState<User>()
	const [isOwner, setIsOwner] = useState(false)
	const [clubs, setClubs] = useState<Club[]>()
	const router = useRouter()

	const fetchUserInfo = useCallback(() => {
		fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/users/${params.userID}`)
			.then(async (res) => {
				const data = await res.json()
				if (!res.ok) {
					toast.error('not found', {
						description: data.error,
					})
					return
				}

				setPageowner(data.user)
				if (user?.id === data.user.id) {
					setIsOwner(true)
				}
			})
			.catch((error) => console.log(error.message))

		fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/users/${params.userID}/clubs`)
			.then(async (res) => {
				const data = await res.json()
				if (!res.ok) {
					throw new Error(data.error || 'Failed to fetch user clubs')
				}
				setClubs(data.clubs)
			})
			.catch((error) => console.log(error.message))
	}, [params.userID, user?.id])

	useEffect(() => {
		fetchUserInfo()
	}, [fetchUserInfo])

	return (
		<Layout>
			<div className="md:py -12 flex flex-col items-center justify-center bg-[#020817] px-4 py-8 text-white md:px-8">
				{pageowner ? (
					<div className="w-full max-w-xl rounded-lg bg-[#0c1125] p-6 shadow-lg md:p-8">
						<div className="flex items-center space-x-4">
							<div className="flex-shrink-0">
								<div className="h-176 w-176 overflow-hidden ">
									{pageowner.avatar_url ? (
										<Image
											className="object-cover"
											src={pageowner.avatar_url}
											alt={`${pageowner.first_name} profile picture`}
											width={250}
											height={80}
											style={{ aspectRatio: '200/200', objectFit: 'cover' }}
										/>
									) : (
										<UserAvatar user={pageowner} />
									)}
								</div>
							</div>
							<div className="flex-1">
								<h1 className="text-2xl font-bold">
									{pageowner.first_name} {pageowner.last_name}
								</h1>
								<p className="text-sm text-gray-400">{pageowner.email}</p>
								<div className="mt-2 flex items-center space-x-2">
									<div className="rounded-md bg-gray-700 px-2 py-1 text-xs">
										{pageowner.group_name}
									</div>
									<div className="rounded-md bg-gray-700 px-2 py-1 text-xs">
										User ID: {params.userID}
									</div>
								</div>
							</div>
							<div className="flex-shrink-0">
								<div className="w-15 h-20 overflow-hidden rounded">
									<div className="rounded-md bg-gray-700 px-2 py-1 text-xs">
										{pageowner.barcode}
									</div>
								</div>
							</div>
						</div>
						<div className="mt-6 md:mt-8">
							{isOwner && (
								<Button
									className="w-full"
									variant="default"
									onClick={() => router.push('/user/edit')}
								>
									Edit Profile
								</Button>
							)}
						</div>
					</div>
				) : (
					<p>Loading user info...</p>
				)}
				<div className="mt-6 w-full max-w-xl md:mt-8">
					<h2 className="mb-4 text-lg font-bold">Clubs</h2>
					<div className="rounded-lg bg-[#0c1125] p-6 shadow-lg md:p-8">
						{Number(clubs?.length) > 0 ? (
							<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
								{clubs?.map((club) => (
									<div
										key={club.id}
										className="flex cursor-pointer items-center space-x-4 rounded-lg  bg-gray-800 p-4 shadow-lg transition-transform duration-300 hover:scale-105 md:p-6 "
										onClick={() => router.push(`/clubs/${club.id}`)}
									>
										<div className="flex-shrink-0">
											<div className="h-12 w-12 overflow-hidden rounded-full">
												<Image
													src={club.logo_url ?? '/main_photo.jpeg'}
													alt={`Logo of ${club.name}`}
													width={48}
													height={48}
													className="object-cover"
													style={{ aspectRatio: '48/48', objectFit: 'cover' }}
												/>
											</div>
										</div>
										<div className="flex-1">
											<h3 className="text-lg font-bold">{club.name}</h3>
											<p className="text-sm text-gray-400">{club.club_type}</p>
										</div>
									</div>
								))}
							</div>
						) : (
							<p className="text-gray-400">User is not a member of any clubs.</p>
						)}
					</div>
				</div>
			</div>
		</Layout>
	)
}

export default UserPage
