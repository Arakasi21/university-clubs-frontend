import { TableCell, TableRow } from '@/components/ui/table'
import React, { useState } from 'react'
import { Club } from '@/types/club'
import { toast } from 'sonner'
import { useAxiosInterceptor } from '@/helpers/fetch_api'
import { DetailedClubDialog } from '../clubs/DetailedClubDialog'
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import Image from 'next/image'

export type ClubsRowProps = {
	onUpdate: () => void
	club: Club
}

function ClubsRow({ onUpdate, club }: ClubsRowProps) {
	const axiosAuth = useAxiosInterceptor()

	const [isDetailedDialogOpen, setIsDetailedDialogOpen] = useState(false)
	const [isDeleteConfirmationDialogOpen, setIsDeleteConfirmationDialogOpen] = useState(false)
	const [selectedClub, setSelectedClub] = useState<Club | null>(null)
	const [clubMembers, setClubMembers] = useState<any[]>([])

	const handleRowClick = async () => {
		try {
			const clubResponse = await axiosAuth.get(
				`${process.env.NEXT_PUBLIC_BACKEND_URL}/clubs/${club.id}`,
			)
			setSelectedClub(clubResponse.data.club)

			const membersResponse = await axiosAuth.get(
				`${process.env.NEXT_PUBLIC_BACKEND_URL}/clubs/${club.id}/members?page=1&page_size=25`,
			)
			setClubMembers(membersResponse.data.members)
		} catch (error) {
			console.error('Failed to fetch club info:', error)
		}

		setIsDetailedDialogOpen(true)
	}

	const handleDeleteClub = async (clubId: number) => {
		const response = await axiosAuth(`${process.env.NEXT_PUBLIC_BACKEND_URL}/clubs/${clubId}`, {
			method: 'DELETE',
			headers: {
				'Content-Type': 'application/json',
			},
		})

		if (response.status.toString().startsWith('2')) {
			toast.success('Club deleted successfully')
		}

		if (!response.status.toString().startsWith('2')) {
			toast.error('Failed to delete club', { description: response.data.error })
			return
		}
		onUpdate()
		setIsDetailedDialogOpen(false)
	}

	return (
		<>
			<TableRow key={club.id} onClick={handleRowClick} className="cursor-pointer">
				<TableCell>
					<Image
						src={club.logo_url}
						alt={club.name}
						className="rounded-full"
						width={73}
						height={23}
					/>
				</TableCell>
				<TableCell>{club.name}</TableCell>
				<TableCell>{club.description}</TableCell>
				<TableCell>{club.club_type}</TableCell>
				<TableCell>{club.num_of_members}</TableCell>
			</TableRow>

			{selectedClub && (
				<DetailedClubDialog
					club={selectedClub}
					isOpen={isDetailedDialogOpen}
					onClose={() => setIsDetailedDialogOpen(false)}
					onDelete={() => setIsDeleteConfirmationDialogOpen(true)}
					clubMembers={clubMembers}
				/>
			)}

			<Dialog
				open={isDeleteConfirmationDialogOpen}
				onOpenChange={setIsDeleteConfirmationDialogOpen}
			>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Are you absolutely sure?</DialogTitle>
						<DialogDescription>This will permanently delete the club.</DialogDescription>
					</DialogHeader>
					<Button
						onClick={() => selectedClub && handleDeleteClub(selectedClub.id)}
						variant={'destructive'}
					>
						Yes, delete the club
					</Button>
					<Button onClick={() => setIsDeleteConfirmationDialogOpen(false)}>No, cancel</Button>
				</DialogContent>
			</Dialog>
		</>
	)
}

export default ClubsRow
