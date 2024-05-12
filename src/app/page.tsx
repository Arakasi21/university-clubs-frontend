'use client'
import Layout from '@/components/Layout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Club } from '@/types/club'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useCallback, useEffect, useState } from 'react'
import { toast } from 'sonner'
import Sceleton from '@/components/st/Sceleton'
import { CalendarCheck, GraduationCap, Users } from 'lucide-react'

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
		<main className="overflow-hidden">
			<Layout>
				{loading ? (
					<Sceleton />
				) : (
					<>
						<div className="mx-40 grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-3">
							<Card x-chunk="dashboard-01-chunk-1">
								<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
									<CardTitle className="text-sm font-medium">Number of UCMS Users</CardTitle>
									<Users className="h-4 w-4 text-muted-foreground" />
								</CardHeader>
								<CardContent>
									<div
										style={{
											display: 'flex',
											flexDirection: 'column',
											justifyContent: 'center',
											alignItems: 'center',
										}}
										className="text-2xl font-bold"
									>
										{totalUsers}
									</div>
									<p className="mt-3 text-xs text-green-500 text-muted-foreground">{`+${0}% from last month`}</p>
								</CardContent>
							</Card>
							<Card x-chunk="dashboard-01-chunk-2">
								<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
									<CardTitle className="text-sm font-medium">Number of Clubs</CardTitle>
									<GraduationCap className="h-4 w-4 text-muted-foreground" />
								</CardHeader>
								<CardContent>
									<div
										style={{
											display: 'flex',
											flexDirection: 'column',
											justifyContent: 'center',
											alignItems: 'center',
										}}
										className="text-2xl font-bold"
									>
										{totalClubs}
									</div>
									<p className="mt-3 text-xs text-green-500 text-muted-foreground">
										+0% from last year
									</p>
								</CardContent>
							</Card>
							<Card x-chunk="dashboard-01-chunk-3">
								<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
									<CardTitle className="text-sm font-medium">Active Events</CardTitle>
									<CalendarCheck className="h-4 w-4 text-muted-foreground" />
								</CardHeader>
								<CardContent>
									<div
										style={{
											display: 'flex',
											flexDirection: 'column',
											justifyContent: 'center',
											alignItems: 'center',
										}}
										className="text-2xl font-bold"
									>
										0
									</div>
									<p className="mt-3 text-xs text-muted-foreground">+0 since last week</p>
								</CardContent>
							</Card>
							{clubs?.map((club) => (
								<div className="flex justify-center">
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
												width="600"
												height="50"
												alt={`banner image of club ${club.name}`}
												className=" rounded-xl"
											/>
										</CardTitle>
										<CardContent className="flex flex-row space-x-2 pt-5">
											<Image
												src={club.logo_url ?? '/main_photo.jpeg'}
												width="75"
												height="20"
												alt={`banner image of club ${club.name}`}
											/>
											<div className="flex flex-col">
												<p>{club.name}</p>
												<p>{club.description}</p>
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
