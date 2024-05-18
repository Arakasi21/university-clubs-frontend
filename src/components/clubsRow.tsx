import { TableCell, TableRow } from '@/components/ui/table'
import { useState } from 'react'
import { Club } from '@/types/club'
import { toast } from 'sonner'
import { useAxiosInterceptor } from '@/helpers/fetch_api'
import { DetailedClubDialog } from './DetailedClubDialog'

export type ClubsRowProps = {
	onUpdate: () => void
	club: Club
}

function ClubsRow({ onUpdate, club }: ClubsRowProps) {
	const axiosAuth = useAxiosInterceptor()

	const [isDetailedDialogOpen, setIsDetailedDialogOpen] = useState(false)
	const [selectedClub, setSelectedClub] = useState<Club | null>(null)

	const handleRowClick = () => {
		setSelectedClub(club)
		setIsDetailedDialogOpen(true)
	}

	const handleDeleteClub = async (clubId: number) => {
		const response = await axiosAuth(`${process.env.NEXT_PUBLIC_BACKEND_URL}/clubs/${clubId}`, {
			method: 'DELETE',
			headers: {
				'Content-Type': 'application/json',
			},
		})

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
					<img src={club.logo_url} alt={club.name} className="h-10 w-10 rounded-full" />
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
					onDelete={() => handleDeleteClub(selectedClub.id)}
				/>
			)}
		</>
	)
}

export default ClubsRow
