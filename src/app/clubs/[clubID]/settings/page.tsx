'use client'
import Nav from '@/components/NavBar'
import { DialogUpdateClubLogo } from '@/components/DialogUpdateClubLogo'
import { DialogUpdateClubBanner } from '@/components/DialogUpdateClubBanner'

import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import UserAvatar from '@/components/userAvatar'
import { IClub, IClubMember } from '@/interface/club'
import useUserStore from '@/store/user'
import Image from 'next/image'
import Link from 'next/link'
import { useCallback, useEffect, useState } from 'react'
import { toast } from 'sonner'

function Page({ params }: { params: { clubID: number } }) {
	const { user } = useUserStore()
	const [club, setClub] = useState<IClub>()
	const [clubMembers, setClubMembers] = useState<IClubMember[]>()
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

		fetch(`http://localhost:5000/clubs/${params.clubID}/members?page=1&page_size=30`)
			.then(async (res) => {
				const data = await res.json()
				if (!res.ok) {
					toast.error('not found', {
						description: data.error,
					})

					throw new Error(data.error || 'Failed to Fetch club info')
				}

				setClubMembers(data.members)
			})
			.catch((error) => console.log(error.message))
	}, [params.clubID, user?.id])

	useEffect(() => {
		fetchClubInfo()
	}, [fetchClubInfo, params.clubID])
	return (
		<>
			<Nav />
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
						<div className="flex overflow-hidden">
							<div className="flex-1">
								<div className=" flex flex-wrap justify-center gap-6">
									<div
										style={{ backgroundImage: `url(${club?.banner_url ?? '/main_photo.jpeg'})` }}
										className="relative h-40 w-screen bg-center bg-no-repeat"
									/>

									{club && (
										<div className="flex justify-center gap-6">
											<Link href={`/clubs/${club?.id}`}>
												<Button variant={'outline'}>Club page</Button>
											</Link>
											<DialogUpdateClubLogo club={club} />
											<DialogUpdateClubBanner club={club} />
											<Link href={`/clubs/${club?.id}/join-request`}>
												<Button variant={'outline'}>Handle new members</Button>
											</Link>
										</div>
									)}
									{clubMembers &&
										clubMembers.map((member) => (
											<Link
												href={`/user/${member.id}`}
												className="flex w-full flex-row items-center space-x-3.5 px-4"
												key={member.id}
											>
												<UserAvatar user={member} />
												<p style={{ color: `#${club?.roles[0].color.toString(16)}` ?? '#fff' }}>
													{member.last_name} {member.first_name}
												</p>
											</Link>
										))}
								</div>
							</div>
						</div>
					</>
				)}
			</div>
		</>
	)
}

export default Page
