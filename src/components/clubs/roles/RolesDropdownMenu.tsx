'use client'
import { Club, ClubRole } from '@/types/club'
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { MoreHorizontal } from 'lucide-react'
import { DialogUpdateClubRole } from '@/components/clubs/roles/DialogUpdateClubRole'

export default function RolesDropdownMenu(props: {
	role: ClubRole
	club: Club
	onUpdateSuccess: () => void
	onClick: () => Promise<void>
}) {
	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button aria-haspopup="true" size="icon" variant="ghost">
					<MoreHorizontal className="h-4 w-4" />
					<span className="sr-only">Toggle menu</span>
				</Button>
			</DropdownMenuTrigger>
			{props.role.name !== 'member' && (
				<DropdownMenuContent align="end">
					<DropdownMenuItem>
						{/* TODO WAITING backend update :: lower member cannot edit the role of lowest member*/}
						<DialogUpdateClubRole
							club={props.club}
							role={props.role}
							onUpdateSuccess={props.onUpdateSuccess}
						/>
					</DropdownMenuItem>
					<DropdownMenuItem onClick={props.onClick} style={{ color: 'red' }}>
						Delete
					</DropdownMenuItem>
				</DropdownMenuContent>
			)}
		</DropdownMenu>
	)
}
