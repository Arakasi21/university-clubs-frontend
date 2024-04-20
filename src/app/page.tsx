'use client'
import Layout from '@/components/Layout'
import { Card, CardContent, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Club } from '@/types/club'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useCallback, useEffect, useState } from 'react'
import { toast } from 'sonner'

export default function Home() {
	const [clubs, setClubs] = useState<Club[]>()
	const [loading, setLoading] = useState(true)

	const router = useRouter()

	const fetchClubs = useCallback(() => {
		fetch(`http://localhost:5000/clubs/?page=1&page_size=30`, { method: 'GET' })
			.then(async (res) => {
				const data = await res.json()
				if (!res.ok) {
					toast.error('not found', {
						description: data.error,
					})
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

	return (
		<main>
			<Layout>
				{loading ? (
					<div className="flex flex-col space-y-3">
						<div className="flex flex-col space-y-3">
							<Skeleton className="h-[200px] w-[400px] rounded-xl" />
							<div className="space-y-2">
								<Skeleton className="h-4 w-[250px]" />
								<Skeleton className="h-4 w-[200px]" />
							</div>
						</div>
						<div className="flex flex-col space-y-3">
							<Skeleton className="h-[200px] w-[400px] rounded-xl" />
							<div className="space-y-2">
								<Skeleton className="h-4 w-[250px]" />
								<Skeleton className="h-4 w-[200px]" />
							</div>
						</div>
						<div className="flex flex-col space-y-3">
							<Skeleton className="h-[200px] w-[400px] rounded-xl" />
							<div className="space-y-2">
								<Skeleton className="h-4 w-[250px]" />
								<Skeleton className="h-4 w-[200px]" />
							</div>
						</div>
						<div className="flex flex-col space-y-3">
							<Skeleton className="h-[200px] w-[400px] rounded-xl" />
							<div className="space-y-2">
								<Skeleton className="h-4 w-[250px]" />
								<Skeleton className="h-4 w-[200px]" />
							</div>
						</div>
					</div>
				) : (
					<div className="col-span-2 grid auto-rows-max grid-cols-2 items-start gap-4">
						{clubs?.map((club) => (
							<div className="m-0 flex justify-center">
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
											width="100"
											height="50"
											alt={`banner image of club ${club.name}`}
											sizes="(min-width: 1415px) 750px, (min-width: 768px) 50vw, 100vw"
											className="max-h-[540px] w-full rounded-xl"
										/>
									</CardTitle>
									<CardContent className="flex flex-row space-x-2">
										<Image
											src={club.logo_url ?? '/main_photo.jpeg'}
											width="55"
											height="70"
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
				)}
			</Layout>
		</main>
	)
}
