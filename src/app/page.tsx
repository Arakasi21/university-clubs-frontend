'use client'
import Footer from '@/components/footer'
import Nav from '@/components/nav'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { IClub } from '@/interface/club'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useCallback, useEffect, useState } from 'react'
import { toast } from 'sonner'

export default function Home() {
	const [clubs, setClubs] = useState<IClub[]>()
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
			<Nav />

			{/* <div className="m-32 flex max-h-96 items-center justify-center">
				<Carousel>
					<CarouselContent>
						<CarouselItem>
							<Image src="/main_photo.jpeg" alt=" " width="900" height="1080"></Image>
						</CarouselItem>
					</CarouselContent>
					<CarouselPrevious />
					<CarouselNext />
				</Carousel>
			</div> */}
			<div className="flex">
				<div className="flex-1">
					<div className="mx-60 my-10 flex flex-wrap justify-center gap-6">
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
							clubs?.map((club) => (
								<Card
									className="flex flex-col space-y-3 transition-transform group-hover:scale-110"
									key={club.id}
									onClick={() => {
										router.push(`/clubs/${club.id}`)
									}}
								>
									<CardTitle>
										<Image
											src={club.banner_url ?? '/main_photo.jpeg'}
											width="500"
											height="250"
											alt={`banner image of club ${club.name}`}
										/>
									</CardTitle>
									<CardContent>
										<p>{club.name}</p>
										<p>{club.description}</p>
									</CardContent>
								</Card>
							))
						)}
					</div>
				</div>
				<div className="sticky right-0 isolate order-last w-80 border-l border-solid">
					<div className=" overflow-x-hidden overflow-y-scroll ">
						<Card className="w-100">
							<CardHeader>
								<CardTitle>Volunteer clubs</CardTitle>
								<CardDescription className="text-md">
									For someone who loves to help others
								</CardDescription>
							</CardHeader>

							<CardContent>
								<Link href="/club_pages/volunteer_clubs/cooking_club">
									<p className="py-3 hover:text-blue-500">Cooking club</p>
								</Link>

								<Link href="/club_pages/volunteer_clubs/charity_club">
									<p className="py-3 hover:text-blue-500">AITU Charity</p>
								</Link>

								<Link href="/club_pages/volunteer_clubs/volunteer_club">
									<p className="py-3 hover:text-blue-500">AITU Volunteers</p>
								</Link>
							</CardContent>
						</Card>

						<Card className="w-100">
							<CardHeader>
								<CardTitle>Gaming clubs</CardTitle>
								<CardDescription>We think that descriptions are unnecessary</CardDescription>
							</CardHeader>

							<CardContent>
								<Link href="/">
									<p className="py-3 hover:text-blue-500">AITU Gaming club</p>
								</Link>

								<Link href="/">
									<p className="py-3 hover:text-blue-500">Board Games</p>
								</Link>

								<Link href="/">
									<p className="py-3 hover:text-blue-500">GameDev club</p>
								</Link>
							</CardContent>
						</Card>

						<Card className="w-100">
							<CardHeader>
								<CardTitle>For Athletes</CardTitle>
								<CardDescription>
									Do you like to win and love physical activity? Then we think these clubs will suit
									you
								</CardDescription>
							</CardHeader>

							<CardContent>
								<Link href="/">
									<p className="py-3 hover:text-blue-500">Basketball</p>
								</Link>

								<Link href="/">
									<p className="py-3 hover:text-blue-500">Volleyball</p>
								</Link>

								<Link href="/">
									<p className="py-3 hover:text-blue-500">Football</p>
								</Link>
							</CardContent>
						</Card>

						<Card className="w-80">
							<CardHeader>
								<CardTitle>Dance & Music</CardTitle>
								<CardDescription>Card Description</CardDescription>
							</CardHeader>

							<CardContent>
								<Link href="/">
									<p className="py-3 hover:text-blue-500">AITU Dance</p>
								</Link>

								<Link href="/">
									<p className="py-3 hover:text-blue-500">KCA club</p>
								</Link>

								<Link href="/">
									<p className="py-3 hover:text-blue-500">AITU Music</p>
								</Link>
							</CardContent>
						</Card>

						<Card className="w-100">
							<CardHeader>
								<CardTitle>Speaking clubs</CardTitle>
								<CardDescription>Card Description</CardDescription>
							</CardHeader>
							<CardContent className="text-lg">
								<Link href="/">
									<p className="py-3 hover:text-blue-500">SPQR</p>
								</Link>

								<Link href="/">
									<p className="py-3 hover:text-blue-500">Debate club</p>
								</Link>

								<Link href="/">
									<p className="py-3 hover:text-blue-500">Oratory club</p>
								</Link>

								<Link href="/">
									<p className="py-3 hover:text-blue-500">AITU Orchestra</p>
								</Link>
							</CardContent>
						</Card>
					</div>
				</div>
			</div>

			<Footer />
		</main>
	)
}
