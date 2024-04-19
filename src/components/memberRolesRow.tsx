import { TableCell, TableRow } from '@/components/ui/table'
import UserAvatar from '@/components/userAvatar'
import { decimalToRgb } from '@/helpers/helper'
import { ClubMember, ClubRole } from '@/types/club'
import { useEffect, useState } from 'react'
import {
	ContextMenu,
	ContextMenuContent,
	ContextMenuItem,
	ContextMenuTrigger,
} from '@/components/ui/context-menu'
import Link from 'next/link'
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select'
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

export type MemberRolesRowProps = { member: ClubMember; roles: ClubRole[] }

function MemberRolesRow({ member, roles }: MemberRolesRowProps) {
	const [memberRoles, setMemberRoles] = useState<ClubRole[]>()
	const [isContextMenuOpen, setIsContextMenuOpen] = useState(false)

	const roleFilter = (arr1: number[], arr2: ClubRole[]) => {
		const res: ClubRole[] = []
		for (let i = 0; i < arr1.length; i++) {
			for (let k = 0; k < arr2.length; k++) {
				if (arr2[k].id === arr1[i]) {
					res.push(arr2[k])
					break
				}
			}
		}

		return res
	}

	useEffect(() => {
		setMemberRoles(roleFilter(member.roles, roles))
	}, [])

	return (
		// TODO OPEN ASSIGN MENU WHEN RIGHT CLICK
		<TableRow
			key={member.id}
			onContextMenu={() => {
				setIsContextMenuOpen(true)
			}}
			onClick={() => {
				setIsContextMenuOpen(true)
			}}
		>
			{/*<ContextMenu onOpenChange={setIsContextMenuOpen} modal={isContextMenuOpen}>
				<ContextMenuContent hidden={!isContextMenuOpen}>
					<ContextMenuItem>
						<Link href={`/user/${member.id}`}>{member.first_name}</Link>
					</ContextMenuItem>
				</ContextMenuContent>
			</ContextMenu>*/}
			<DropdownMenu open={isContextMenuOpen} onOpenChange={setIsContextMenuOpen} modal={true}>
				<TableCell>
					<UserAvatar user={member} />
				</TableCell>
				<TableCell>{member.first_name}</TableCell>
				<TableCell>{member.last_name}</TableCell>
				<TableCell>
					{memberRoles?.map((role) => (
						<>
							<p style={{ color: `${decimalToRgb(role.color)}` }}>{role.name}</p>
						</>
					))}
				</TableCell>
				<TableCell>{member.email}</TableCell>
				<TableCell>{member.barcode}</TableCell>

				<DropdownMenuContent>
					<DropdownMenuItem>
						<Link href={`/user/${member.id}`}>{member.first_name}</Link>
					</DropdownMenuItem>
					<DropdownMenuItem>
						<p>Assign roles</p>
					</DropdownMenuItem>
					<DropdownMenuItem>
						<p>Kick</p>
					</DropdownMenuItem>
					<DropdownMenuItem>
						<p>Ban</p>
					</DropdownMenuItem>
				</DropdownMenuContent>
				<DropdownMenuTrigger></DropdownMenuTrigger>
			</DropdownMenu>
		</TableRow>
	)
}

export default MemberRolesRow
