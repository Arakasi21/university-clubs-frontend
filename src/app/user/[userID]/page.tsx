'use client'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import useUserStore from '@/store/user'
import { Club } from '@/types/club'
import { User } from '@/types/user'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useCallback, useEffect, useState } from 'react'
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
			<div className="n">
				{pageowner ? (
					<div className="flex flex-col items-center justify-between p-16">
						<Card x-chunk="dashboard-01-chunk-2" className="border-0 ">
							<CardContent>
								<div className="grid gap-3  sm:grid-cols-2">
									<div className="grid gap-3 ">
										{pageowner.avatar_url ? (
											<div className="relative h-[300px] w-[300px]">
												<Image
													className=" rounded-full border-2 border-white"
													src={pageowner.avatar_url}
													alt={`${pageowner.first_name} profile picture`}
													fill={true}
													objectFit={'cover'}
												/>
											</div>
										) : (
											<div className="w-fit rounded-full border-2 border-white">
												<UserAvatar user={pageowner} size={350} />
											</div>
										)}
										<p>
											{pageowner.first_name} {pageowner.last_name}
										</p>
										{isOwner && (
											<div className="w-32">
												<Button onClick={() => router.push('/user/edit')}>Edit Profile</Button>
											</div>
										)}
										<p>Barcode: {pageowner.barcode}</p>
										<p>Email: {pageowner.email}</p>
										<p>Group: {pageowner.group_name}</p>
										<p>User ID: {params.userID}</p>
									</div>
									<div className="grid gap-3">
										<div>
											<br />
											<Button variant={'secondary'} disabled={true}>
												Clubs
											</Button>
											{Number(clubs?.length) > 0 ? (
												<ul className="border-1">
													{clubs?.map((club) => (
														<li
															key={club?.id}
															onClick={() => {
																router.push(`/clubs/${club.id}`)
															}}
															className="border-r-1 relative my-4 cursor-pointer rounded-3xl hover:bg-accent"
														>
															<div className="flex flex-row items-center space-x-2 ">
																<Image
																	src={club?.logo_url ?? '/main_photo.jpeg'}
																	width={64}
																	height={64}
																	alt={`banner of ${club?.name}`}
																	className="rounded-md"
																/>
																<p>
																	{club?.name} - {club?.club_type}
																</p>
															</div>
														</li>
													))}
												</ul>
											) : (
												<p>User is not the member of any clubs.</p>
											)}
										</div>
									</div>
								</div>
							</CardContent>
						</Card>
					</div>
				) : (
					<p>Loading user info...</p>
				)}
			</div>
		</Layout>
	)
}

export default UserPage
