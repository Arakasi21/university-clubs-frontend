'use client'
import React from 'react'
import { CalendarIcon, GroupIcon, UsersIcon } from 'lucide-react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import useUserStore from '@/store/user'
import Nav from '@/components/NavBar'

export default function Home() {
	const { isLoggedIn } = useUserStore()

	return (
		<main>
			<Nav />
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
											className="bg-blue-200 text-gray-900 hover:bg-blue-200/70 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-800/70"
											variant={'secondary'}
										>
											Explore Clubs
										</Button>
									</Link>
								) : (
									<>
										<Link href={'/sign-in'}>
											<Button
												className="bg-blue-200 text-gray-900 hover:bg-blue-200/70 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-800/70"
												variant={'secondary'}
											>
												Join Now
											</Button>
										</Link>
										<Link href={'explore/clubs'}>
											<Button
												className="bg-blue-200 text-gray-900 hover:bg-blue-200/70 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-800/70"
												variant={'secondary'}
											>
												Explore Clubs
											</Button>
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
						<div className="space-y-4 rounded-lg bg-blue-200 p-6 shadow-md transition duration-300 hover:bg-blue-200/70 dark:bg-[#0c1125] dark:hover:bg-[#0c1125]/60">
							<UsersIcon className="h-8 w-8 dark:text-white" />
							<h3 className="text-xl font-semibold dark:text-white">Discover Clubs</h3>
							<p className="pb-4 text-neutral-600 dark:text-gray-400">
								Explore a diverse range of clubs that cater to your interests, hobbies, and
								passions.
							</p>
							<Link className="hover:underline dark:text-white" href={'/explore/clubs'}>
								Browse Clubs
							</Link>
						</div>
						<div className="space-y-4 rounded-lg bg-blue-200 p-6 shadow-md transition duration-300 hover:bg-blue-200/70 dark:bg-[#0c1125] dark:hover:bg-[#0c1125]/60">
							<CalendarIcon className="h-8 w-8 dark:text-white" />
							<h3 className="text-xl font-semibold dark:text-white">Attend Events</h3>
							<p className="pb-4 text-neutral-600 dark:text-gray-400">
								Stay up-to-date with the latest club events and activities, and participate in them.
							</p>
							<Link className="hover:underline dark:text-white" href={'/explore/events'}>
								View Events
							</Link>
						</div>
						<div className="space-y-4 rounded-lg bg-blue-200 p-6 shadow-md transition duration-300 hover:bg-blue-200/70 dark:bg-[#0c1125] dark:hover:bg-[#0c1125]/60">
							<GroupIcon className="h-8 w-8 dark:text-white" />
							<h3 className="text-xl font-semibold dark:text-white">Connect with Members</h3>
							<p className="pb-4 text-neutral-600 dark:text-gray-400">
								Engage with other club members, share ideas, and build meaningful connections.
							</p>
							<Link className="hover:underline dark:text-white" href="#">
								Join the Community
							</Link>
						</div>
					</div>
				</div>
			</section>
		</main>
	)
}
