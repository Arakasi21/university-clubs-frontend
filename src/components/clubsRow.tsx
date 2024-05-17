import { TableCell, TableRow } from '@/components/ui/table'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Club } from '@/types/club'
import { toast } from 'sonner'
import { useAxiosInterceptor } from '@/helpers/fetch_api'
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'

export type ClubsRowProps = {
	onUpdate: () => void
	club: Club
}

function ClubsRow({ onUpdate, club }: ClubsRowProps) {
	const axiosAuth = useAxiosInterceptor()

	const [isContextMenuOpen, setIsContextMenuOpen] = useState(false)
	const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
	const [clubToDelete, setClubToDelete] = useState<number | null>(null)

	const handleDeleteClub = (clubId: number) => {
		setClubToDelete(clubId)
		setIsDeleteDialogOpen(true)
	}

	const confirmDeleteClub = async () => {
		if (clubToDelete !== null) {
			await deleteClub(clubToDelete || 0)
		}
		setIsDeleteDialogOpen(false)
	}

	const deleteClub = async (clubId: number) => {
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
	}

	console.log('Rendering club:', club)

	useEffect(() => {
		console.log('Rendering club:', club)
	}, [club])
	return (
		<TableRow
			key={club.id}
			onContextMenu={(e) => {
				e.preventDefault()
				setIsContextMenuOpen(true)
			}}
			onClick={(e) => {
				e.preventDefault()
				setIsContextMenuOpen(true)
			}}
		>
			<DropdownMenu open={isContextMenuOpen} onOpenChange={setIsContextMenuOpen} modal={true}>
				<TableCell>
					<img src={club.logo_url} alt={club.name} className="h-10 w-10 rounded-full" />
				</TableCell>
				<TableCell>{club.name}</TableCell>
				<TableCell>{club.description}</TableCell>
				<TableCell>{club.club_type}</TableCell>
				<TableCell>{club.num_of_members}</TableCell>
				<DropdownMenuContent>
					<DropdownMenuItem>
						<Link href={`/clubs/${club.id}`}>{club.name}</Link>
					</DropdownMenuItem>
					<DropdownMenuSeparator />
					<DropdownMenuItem onClick={() => handleDeleteClub(club.id)}>
						<p style={{ color: 'red' }}>DeleteClub</p>
					</DropdownMenuItem>
				</DropdownMenuContent>
				<DropdownMenuTrigger></DropdownMenuTrigger>
			</DropdownMenu>
			<Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Are you absolutely sure?</DialogTitle>
						<DialogDescription>This will permanently delete the club.</DialogDescription>
					</DialogHeader>
					<Button variant={'destructive'} onClick={confirmDeleteClub}>
						Yes, delete the club
					</Button>
					<Button onClick={() => setIsDeleteDialogOpen(false)}>No, cancel</Button>
				</DialogContent>
			</Dialog>
		</TableRow>
	)
}

export default ClubsRow
