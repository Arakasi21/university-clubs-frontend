'use client'
import Nav from '@/components/NavBar'
import Link from 'next/link'

import { File, ListFilter } from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from '@/components/ui/card'
import {
	DropdownMenu,
	DropdownMenuCheckboxItem,
	DropdownMenuContent,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import React, { useCallback, useEffect, useState } from 'react'
import { toast } from 'sonner'
import { IClub } from '@/interface/club'

export function Page({ params }: { params: { clubID: number } }) {
	const [club, setClub] = useState<IClub>()
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
			})
			.catch((error) => console.log(error.message))
	}, [params.clubID])

	useEffect(() => {
		fetchClubInfo()
	}, [fetchClubInfo, params.clubID])

	return (
		<>
			<Nav />
			<div>
				<div className="flex flex-wrap justify-center gap-6">
					<div
						style={{ backgroundImage: `url(${club?.banner_url ?? '/main_photo.jpeg'})` }}
						className="relative h-40 w-screen bg-center bg-no-repeat"
					/>

					<div className="grid auto-rows-max items-start gap-4 md:gap-8 lg:col-span-2">
						<div className="flex flex-wrap justify-center gap-6">
							<Link href={`/clubs/${club?.id}/settings/roles`}>
								<Button variant={'default'}>Return to roles</Button>
							</Link>
						</div>
					</div>
				</div>
			</div>
		</>
	)
}

export default Page
