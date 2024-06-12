'use client'
import React, { useCallback, useEffect, useState } from 'react'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { PlusIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import useUserRolesStore from '@/store/useUserRoles'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import { Club } from '@/types/club'

function Clubs() {
	const [loadingClubs, setLoadingClubs] = useState(true)
	const [clubs, setClubs] = useState<Club[]>()
	const router = useRouter()

	const { resetUserRoles } = useUserRolesStore()

	const fetchClubs = useCallback(() => {
		fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/clubs/?page=1&page_size=30`, { method: 'GET' })
			.then(async (res) => {
				const data = await res.json()
				if (!res.ok) {
					toast.error('not found', {
						description: data.error,
					})
					return
				}
				setClubs(data.clubs)
				setLoadingClubs(false)
			})
			.catch((error) => {
				console.log(error)
			})
	}, [])

	useEffect(() => {
		fetchClubs()
	}, [fetchClubs])

	const handleClubClick = (clubID: number) => {
		resetUserRoles()
		router.push(`/clubs/${clubID}`)
	}

	return (
		<div className="overflow-auto bg-gray-100 p-4 dark:bg-gray-900">
			<h2 className="mb-4 text-lg font-semibold">Clubs</h2>
			<div className="grid gap-4">
				{loadingClubs ? (
					<div>Loading...</div>
				) : (
					clubs?.map((club) => (
						<div key={club.id} onClick={() => handleClubClick(club.id)}>
							<Card>
								<CardHeader>
									<div className="flex items-center gap-3">
										<img
											src={club.logo_url}
											alt="Club Logo"
											width={40}
											height={40}
											className="rounded-full"
										/>
										<div className="font-medium">{club.name}</div>
									</div>
								</CardHeader>
								<CardContent>
									<div className="flex items-center justify-between">
										<div className="rounded-md bg-gray-100 px-2 py-1 text-xs font-medium text-gray-500 dark:bg-gray-800 dark:text-gray-400">
											{club.num_of_members} members
										</div>
										<Button variant="ghost" size="icon">
											<PlusIcon className="h-4 w-4" />
											<span className="sr-only">Join</span>
										</Button>
									</div>
								</CardContent>
							</Card>
						</div>
					))
				)}
			</div>
		</div>
	)
}

export default Clubs
