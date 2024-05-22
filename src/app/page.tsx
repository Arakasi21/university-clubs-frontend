'use client'
import Layout from '@/components/Layout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Club } from '@/types/club'
import { useRouter } from 'next/navigation'
import React, { useCallback, useEffect, useState } from 'react'
import { toast } from 'sonner'
import Sceleton from '@/components/user/Sceleton'
import {
	CalendarCheck,
	CalendarIcon,
	GraduationCap,
	GroupIcon,
	Users,
	UsersIcon,
} from 'lucide-react'
import ClubImage from '@/components/clubs/ClubImage'
import Image from 'next/image'
import { StatsComponent } from '@/components/StatsComponent'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import DropdownForLoggedIn from '@/components/ui/dropdown_for_logged_in'
import useUserStore from '@/store/user'

export default function Home() {
	const [clubs, setClubs] = useState<Club[]>()
	const [loading, setLoading] = useState(true)
	const [totalUsers, setTotalUsers] = useState(0)
	const [totalClubs, setTotalClubs] = useState(0)
	const router = useRouter()
	const { isLoggedIn, user, purgeUser } = useUserStore()

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
						<section className="bg-[#020817] pb-10 pt-10 text-gray-50">
							<div className="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
								<div className="grid grid-cols-1 gap-8 md:grid-cols-2">
									<div className="space-y-6">
										<h1 className="text-4xl font-bold tracking-tight md:text-5xl">
											Discover and Connect with Clubs
										</h1>
										<p className="text-lg leading-relaxed">
											UCMS is the ultimate platform for finding, joining, and engaging with clubs
											that match your interests. Explore a wide range of clubs, attend exciting
											events, and connect with like- minded individuals.
										</p>
										<div className="flex gap-4">
											{/*if logged in then join now button should appear*/}
											{isLoggedIn ? (
												<Link href={'explore/clubs'}>
													<Button variant="secondary">Explore Clubs</Button>
												</Link>
											) : (
												<>
													<Link href={'/sign-in'}>
														<Button className="hidden sm:inline-flex" variant="default">
															Join Now
														</Button>
													</Link>
													<Link href={'explore/clubs'}>
														<Button variant="secondary">Explore Clubs</Button>
													</Link>
												</>
											)}
										</div>
									</div>
									<div className="flex items-center justify-center">
										<Image
											alt="AITU LOGO"
											className="rounded-lg"
											height="400"
											src="/aitu-logo_white.png"
											style={{
												aspectRatio: '600/300',
												objectFit: 'cover',
											}}
											width="500"
										/>
									</div>
								</div>
							</div>
						</section>
						<section className="pt-20">
							<div className="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
								<div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
									<div className="space-y-4 rounded-lg bg-[#040a2f] p-6 shadow-md">
										<UsersIcon className="h-8 w-8 text-gray-50" />
										<h3 className="text-xl font-semibold">Discover Clubs</h3>
										<p className="pb-4 text-gray-400">
											Explore a diverse range of clubs that cater to your interests, hobbies, and
											passions.
										</p>
										<Link className="text-gray-50 hover:underline" href={'/explore/clubs'}>
											Browse Clubs
										</Link>
									</div>
									<div className="space-y-4 rounded-lg bg-[#040a2f] p-6 shadow-md">
										<CalendarIcon className="h-8 w-8 text-gray-50" />
										<h3 className="text-xl font-semibold">Attend Events</h3>
										<p className="pb-4 text-gray-400">
											Stay up-to-date with the latest club events and activities, and participate in
											them.
										</p>
										<Link className=" text-gray-50 hover:underline" href="#">
											View Events
										</Link>
									</div>
									<div className="space-y-4 rounded-lg bg-[#040a2f] p-6 shadow-md">
										<GroupIcon className="h-8 w-8 text-gray-50" />
										<h3 className="text-xl font-semibold">Connect with Members</h3>
										<p className="pb-4 text-gray-400">
											Engage with other club members, share ideas, and build meaningful connections.
										</p>
										<Link className="text-gray-50 hover:underline" href="#">
											Join the Community
										</Link>
									</div>
								</div>
							</div>
						</section>
					</>
				)}
			</Layout>
		</main>
	)
}
