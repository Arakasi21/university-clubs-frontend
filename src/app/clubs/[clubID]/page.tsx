'use client'
import { Skeleton } from '@/components/ui/skeleton'
import { IClub } from '@/interface/club'
import useUserStore from '@/store/user'
import Image from 'next/image'
import { useCallback, useEffect, useState } from 'react'
import { toast } from 'sonner'

function Page({ params }: { params: { clubID: number } }) {
	const { user } = useUserStore()
	const [club, setClub] = useState<IClub>()
	const [loading, setLoading] = useState(true)
	const [isOwner, setIsOwner] = useState(false)

	const fetchClubInfo = useCallback(() => {
		fetch(`http://localhost:5000/clubs/${params.clubID}`)
			.then(async (res) => {
				const data = await res.json()
				if (!res.ok) {
					toast.error('not found', {
						description: data.error,
					})

					throw new Error(data.error || 'Failed to Fetch club info')
				}

				setClub(data.club)
				setIsOwner(data.club.owner_id == user?.id)
				setLoading(false)
			})
			.catch((error) => console.log(error.message))
	}, [params.clubID, user?.id])

	useEffect(() => {
		fetchClubInfo()
	}, [fetchClubInfo, params.clubID])
	return (
		<div>
			{loading ? (
				<div className="flex flex-col space-y-3">
					<Skeleton className="h-[200px] w-[400px] rounded-xl" />
					<div className="space-y-2">
						<Skeleton className="h-4 w-[250px]" />
						<Skeleton className="h-4 w-[200px]" />
					</div>
				</div>
			) : (
				<>
					<div
						style={{ backgroundImage: `url(${club?.banner_url ?? '/main_photo.jpeg'})` }}
						className="relative h-40 w-screen bg-cover bg-center bg-no-repeat"
					/>
					<div className="flex flex-row space-y-3">
						<Image
							src={club?.logo_url ?? '/main_photo.jpeg'}
							width={100}
							height={100}
							alt={`banner of ${club?.name}`}
						/>
						<div className="space-y-2 p-3">
							<p>{club?.name}</p>
							<p>{club?.description}</p>
						</div>
					</div>
				</>
			)}
		</div>
	)
}

export default Page
