'use client'
import Layout from '@/components/Layout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Club } from '@/types/club'
import { useRouter } from 'next/navigation'
import React, { useCallback, useEffect, useState } from 'react'
import { toast } from 'sonner'
import Sceleton from '@/components/user/Sceleton'
import { CalendarCheck, GraduationCap, Users } from 'lucide-react'
import ClubImage from '@/components/clubs/ClubImage'
import Image from 'next/image'
import { StatsComponent } from '@/components/StatsComponent'

export default function Home() {
	const [clubs, setClubs] = useState<Club[]>()
	const [loading, setLoading] = useState(true)
	const [totalUsers, setTotalUsers] = useState(0)
	const [totalClubs, setTotalClubs] = useState(0)
	const router = useRouter()

	const fetchTotalUsers = useCallback(() => {
		fetch('http://localhost:5000/users/search?query=&page=1&page_size=50')
			.then(async (res) => {
				const data = await res.json()
				if (!res.ok) {
					toast.error('Failed to fetch users', {
						description: data.error,
					})
				}

				setTotalUsers(data.metadata.total_records)
			})
			.catch((error) => {
				console.log(error)
			})
	}, [])

	const fetchClubs = useCallback(() => {
		fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/clubs/?page=1&page_size=30`, { method: 'GET' })
			.then(async (res) => {
				const data = await res.json()
				if (!res.ok) {
					toast.error('not found', {
						description: data.error,
					})
				}

				setClubs(data.clubs)
				setTotalClubs(data.metadata.total_records)
				setLoading(false)
			})
			.catch((error) => {
				console.log(error)
			})
	}, [])

	useEffect(() => {
		fetchClubs()
		fetchTotalUsers()
	}, [fetchClubs, fetchTotalUsers])

	return (
		<main>
			<Layout>
				{loading ? (
					<Sceleton />
				) : (
					<>
						<div className="mx-40 grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-3">
							<StatsComponent totalUsers={totalUsers} totalClubs={totalClubs} />

							{clubs?.map((club) => (
								<div className="flex justify-center" key={club.id}>
									<Card
										className="max-w-1xl flex cursor-pointer flex-col space-y-1 rounded-xl transition-transform"
										key={club.id}
										onClick={() => {
											router.push(`/clubs/${club.id}`)
										}}
									>
										<CardTitle>
											<Image
												src={club.banner_url ?? '/main_photo.jpeg'}
												alt={`banner image of club ${club.name}`}
												width={5000}
												height={200}
												className=" rounded-xl"
											/>
										</CardTitle>
										<CardContent className="relative grid grid-cols-[auto,1fr] items-center gap-4 pt-4 ">
											<div>
												<img
													src={club.logo_url ?? '/main_photo.jpeg'}
													alt={`banner image of club ${club.name}`}
													width={80}
													height={50}
													className="aspect-square"
												/>
												{/*<ClubImage club={club} width={100} height={20} />*/}
											</div>
											<div className="w-full">
												<h1 className="font-bold" style={{ fontSize: '1vw', objectFit: 'contain' }}>
													{club?.name}
												</h1>
												<CardDescription style={{ fontSize: '0.9vw', objectFit: 'contain' }}>
													{club?.description}
												</CardDescription>
											</div>
										</CardContent>
									</Card>
								</div>
							))}
						</div>
					</>
				)}
			</Layout>
		</main>
	)
}
