'use client'
import { Club } from '@/types/club'
import { useRouter } from 'next/navigation'
import React, { useCallback, useEffect, useState } from 'react'
import { toast } from 'sonner'
import SceletonMain from '@/components/Skeletons/SkeletonMain'
import { CalendarIcon, GroupIcon, UsersIcon } from 'lucide-react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import useUserStore from '@/store/user'
import Nav from '@/components/NavBar'

export default function Home() {
	const [loading, setLoading] = useState(true)
	const { isLoggedIn, user, purgeUser } = useUserStore()

	const fetchClubs = useCallback(() => {
		fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/clubs/?page=1&page_size=30`, { method: 'GET' })
			.then(async (res) => {
				const data = await res.json()
				if (!res.ok) {
					toast.error('not found', {
						description: data.error,
					})
				}
				setLoading(false)
			})
			.catch((error) => {
				console.log(error)
			})
	}, [])

	useEffect(() => {
		fetchClubs()
	}, [])

	return (
		<main>
			<Nav />
			{loading ? (
				<SceletonMain />
			) : (
				<>
					<section className="pb-10 pt-20 dark:bg-[#020817] dark:text-gray-50">
						<div className="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
							<div className="grid grid-cols-1 gap-8 md:grid-cols-2">
								<div className="space-y-6">
									<h1 className="text-4xl font-bold tracking-tight md:text-5xl">
										Discover and Connect with Clubs
									</h1>
									<p className="text-lg leading-relaxed">
										UCMS is the ultimate platform for finding, joining, and engaging with clubs that
										match your interests. Explore a wide range of clubs, attend exciting events, and
										connect with like- minded individuals.
									</p>
									<div className="flex gap-4">
										{isLoggedIn ? (
											<Link href={'explore/clubs'}>
												<Button
													className="invert-[.2] dark:text-white dark:invert-0"
													variant={'secondary'}
												>
													Explore Clubs
												</Button>
											</Link>
										) : (
											<>
												<Link href={'/sign-in'}>
													<Button
														className="hidden invert dark:text-white dark:invert-0 sm:inline-flex"
														variant={'secondary'}
													>
														Join Now
													</Button>
												</Link>
												<Link href={'explore/clubs'}>
													<Button variant={'dark' ? 'secondary' : 'default'}>Explore Clubs</Button>
												</Link>
											</>
										)}
									</div>
								</div>
								<div className="flex items-center justify-center">
									<Image
										alt="AITU LOGO"
										className="rounded-lg invert dark:invert-0"
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
								<div className="hover: space-y-4 rounded-lg bg-[#0c1125] p-6 shadow-md transition duration-300 hover:bg-[#0c1125]/80">
									<UsersIcon className="h-8 w-8 text-gray-50" />
									<h3 className="text-xl font-semibold text-white">Discover Clubs</h3>
									<p className="pb-4 text-gray-400">
										Explore a diverse range of clubs that cater to your interests, hobbies, and
										passions.
									</p>
									<Link className="text-gray-50 hover:underline" href={'/explore/clubs'}>
										Browse Clubs
									</Link>
								</div>
								<div className="space-y-4 rounded-lg bg-[#0c1125] p-6 shadow-md transition duration-300 hover:bg-[#0c1125]/80">
									<CalendarIcon className="h-8 w-8 text-gray-50" />
									<h3 className="text-xl font-semibold text-white">Attend Events</h3>
									<p className="pb-4 text-gray-400">
										Stay up-to-date with the latest club events and activities, and participate in
										them.
									</p>
									<Link className=" text-gray-50 hover:underline" href="#">
										View Events
									</Link>
								</div>
								<div className="space-y-4 rounded-lg bg-[#0c1125] p-6 shadow-md transition duration-300 hover:bg-[#0c1125]/80">
									<GroupIcon className="h-8 w-8 text-gray-50" />
									<h3 className="text-xl font-semibold text-white">Connect with Members</h3>
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
		</main>
	)
}
