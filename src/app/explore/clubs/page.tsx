'use client'
import React, { useCallback, useEffect, useState } from 'react'
import { toast } from 'sonner'
import { Club } from '@/types/club'
import { useRouter } from 'next/navigation'
import Layout from '@/components/Layout'

export default function Clubs() {
	const [clubs, setClubs] = useState<Club[]>()
	const router = useRouter()

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
			})
			.catch((error) => {
				console.log(error)
			})
	}, [])

	useEffect(() => {
		fetchClubs()
	}, [fetchClubs])

	return (
		<>
			<Layout />

			<main className="flex min-h-screen flex-col items-center bg-[#020817] py-0 text-white md:py-0 lg:py-0">
				<div className="container w-full max-w-6xl px-4 md:px-6 lg:px-8">
					<h1 className="mb-8 text-center text-3xl font-bold md:text-4xl lg:text-5xl">
						Discover Clubs
					</h1>
					<div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3">
						{clubs?.map((club) => (
							<div
								key={club.id}
								className="cursor-pointer overflow-hidden rounded-lg bg-gray-800 shadow-lg transition-transform duration-300 hover:scale-105"
								onClick={() => router.push(`/clubs/${club.id}`)}
							>
								<div className="flex items-center gap-4 p-4">
									<img
										src={club.logo_url ?? '/main_photo.jpeg'}
										alt={`Logo of club ${club.name}`}
										width={60}
										height={60}
										className="w-15 h-15 object-contain"
										style={{ aspectRatio: '60/60', objectFit: 'cover' }}
									/>
									<div>
										<h2 className="mb-2 text-xl font-semibold">{club.name}</h2>
										<p className="line-clamp-2 text-gray-400">{club.description}</p>
									</div>
								</div>
								<img
									src={club.banner_url ?? '/main_photo.jpeg'}
									alt={`Banner image of club ${club.name}`}
									className=" w-full object-cover"
									height={300}
									width={600}
									style={{ aspectRatio: '300/200', objectFit: 'cover' }}
								/>
							</div>
						))}
					</div>
				</div>
			</main>
		</>
	)
}
