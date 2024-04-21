'use client'
import Nav from '@/components/NavBar'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import useUserStore from '@/store/user'
import { Club } from '@/types/club'
import { User } from '@/types/user'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useCallback, useEffect, useState } from 'react'
import { toast } from 'sonner'

const UserPage = ({ params }: { params: { userID: number } }) => {
	const { user } = useUserStore()
	const [pageowner, setPageowner] = useState(null as User | null)
	const [clubs, setClubs] = useState<Club[] | null>(null)
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

				setPageowner(data.user)
				setIsOwner(data.user?.id === user?.id)

				const userClubsResponse = await fetch(`http://localhost:5000/user/${params.userID}/clubs`, {
					method: 'GET',
				})

				if (!userClubsResponse.ok) throw new Error('Failed to fetch user clubs')
				const userClubsData = await userClubsResponse.json()
				setClubs(userClubsData.clubs)
			})
			.catch((error) => console.log(error.message))
	}, [params.userID, user])

	useEffect(() => {
		fetchUserInfo()
	}, [fetchUserInfo])

	return (
		<div className="overflow-hidden">
			<Nav />
			{pageowner ? (
				<div className="flex flex-col items-center justify-between p-16">
					<Card x-chunk="dashboard-01-chunk-2" className="border-0">
						<CardContent>
							<div className="grid gap-3 sm:grid-cols-2">
								<div className="grid gap-3">
									{pageowner.avatar_url ? (
										<div className="overflow-hidden rounded-full border-4 border-white">
											<Image
												className="rounded-full"
												src={pageowner.avatar_url}
												alt={`${pageowner.first_name} profile picture`}
												width={300}
												height={300}
											/>
										</div>
									) : (
										<div className=" overflow-hidden rounded-full border-4 border-white">
											<Image
												src={'/aitu-logo-3-400x205.png'}
												alt={'non - image'}
												width={200}
												height={200}
											/>
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
														className="border-r-1 relative my-4 rounded-3xl hover:bg-accent"
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
	)
}

export default UserPage
