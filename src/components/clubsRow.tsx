import { TableCell, TableRow } from '@/components/ui/table'
import { useState } from 'react'
import Link from 'next/link'
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Club } from '@/types/club'

export type ClubsRowProps = {
	onUpdate: () => void
	club: Club
}

function ClubsRow({ onUpdate, club }: ClubsRowProps) {
	const [isContextMenuOpen, setIsContextMenuOpen] = useState(false)

	console.log('Rendering club:', club)

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
				{/*<TableCell>*/}
				{/*	<img src={club.logo_url} alt={club.name} className="h-10 w-10 rounded-full" />*/}
				{/*</TableCell>*/}
				<TableCell>{club.name}</TableCell>
				{/*<TableCell>{club.description}</TableCell>*/}
				{/*<TableCell>{club.club_type}</TableCell>*/}
				{/*<TableCell>{club.number_of_members}</TableCell>*/}
				<DropdownMenuContent>
					<DropdownMenuItem>
						<Link href={`/club/${club.id}`}>{club.name}</Link>
					</DropdownMenuItem>
					<DropdownMenuSeparator />
					<p>Details</p>
				</DropdownMenuContent>
				<DropdownMenuTrigger></DropdownMenuTrigger>
			</DropdownMenu>
		</TableRow>
	)
}

export default ClubsRow
