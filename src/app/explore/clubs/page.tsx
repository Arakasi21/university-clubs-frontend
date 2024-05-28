'use client'
import React, { useCallback, useEffect, useState } from 'react'
import { toast } from 'sonner'
import { Club } from '@/types/club'
import { useRouter } from 'next/navigation'
import SkeletonClubs from '@/components/Skeletons/SkeletonClubs'
import Nav from '@/components/NavBar'
import { Badge } from '@/components/ui/badge'
import Image from 'next/image'
import useUserRolesStore from '@/store/useUserRoles'
import { UsersIcon } from 'lucide-react'

export default function Clubs() {
	const [clubs, setClubs] = useState<Club[]>()
	const [loading, setLoading] = useState(true)
	const router = useRouter()
	const { resetUserRoles } = useUserRolesStore()

	const fetchClubs = useCallback(() => {
		fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/clubs/?page=1&page_size=30`, { method: 'GET' })
			.then(async (res) => {
				const data = await res.json()
				if (!res.ok) {
					toast.error('not found', {
						description: data.error,
					})
					return
				}
				setClubs(data.clubs)
				setLoading(false)
			})
			.catch((error) => {
				console.log(error)
			})
	}, [])

	useEffect(() => {
		fetchClubs()
	}, [fetchClubs])

	const handleClubClick = (clubID: number) => {
		resetUserRoles()
		router.push(`/clubs/${clubID}`)
	}

	return (
		<>
			<Nav />

			{loading ? (
				<SkeletonClubs />
			) : (
				<main className="flex min-h-screen flex-col items-center overflow-hidden dark:bg-[#020817]">
					<div className="container w-full max-w-6xl px-4 py-10 md:px-6 lg:px-8">
						<h1 className="mb-8 text-center text-3xl font-bold dark:text-white md:text-4xl lg:text-5xl">
							Discover Clubs
						</h1>
						<div className="grid grid-cols-1 gap-6 text-white sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3">
							{clubs?.map((club) => (
								<div
									key={club.id}
									className="cursor-pointer overflow-hidden rounded-lg bg-gray-900 shadow-lg transition-transform duration-300 hover:scale-105"
									onClick={() => handleClubClick(club.id)}
								>
									<Image
										src={club.banner_url ?? '/main_photo.jpeg'}
										alt={`Banner image of club ${club.name}`}
										className="w-full object-cover"
										height={400}
										width={600}
										priority={true}
										style={{ aspectRatio: '30/15', objectFit: 'cover' }}
									/>
									<div className="space-y-2 p-4">
										<div className="flex items-center gap-2">
											<Image
												src={club.logo_url ?? '/main_photo.jpeg'}
												alt={`Logo of club ${club.name}`}
												width={70}
												height={70}
												priority={true}
												className="rounded-full object-contain"
												style={{
													aspectRatio: '70/70',
													objectFit: 'cover',
												}}
											/>
											<div>
												<h3 className="font-semibold">{club.name}</h3>
												<p className="text-sm text-gray-400">{club.club_type}</p>
											</div>
										</div>
										<p className="line-clamp-2 text-sm text-gray-400">{club.description}</p>
										<div className="flex items-center justify-between  text-sm text-gray-400">
											<div className="flex ">
												<UsersIcon className="mr-2 h-4 w-4" />
												<span>{club.num_of_members} members</span>
											</div>

											<Badge variant="default">Active</Badge>
										</div>
									</div>
								</div>
							))}
						</div>
					</div>
				</main>
			)}
		</>
	)
}
