import { TableCell, TableRow } from '@/components/ui/table'
import UserAvatar from '@/components/userAvatar'
import { decimalToRgb } from '@/helpers/helper'
import { Club, ClubMember, ClubRole } from '@/types/club'
import { useEffect, useState } from 'react'
import Link from 'next/link'

import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import RoleCheckboxDropdown from '@/components/st/RoleCheckboxDropdown'

export type MemberRolesRowProps = {
	member: ClubMember
	roles: ClubRole[]
	clubId: number | undefined
}

function MemberRolesRow({
	member,
	roles,
	clubId,
}: MemberRolesRowProps & {
	addRoleMember: (roleId: number, memberId: number, clubId: number | undefined) => Promise<void>
}) {
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

	const addRoleMember = async (roleId: number, memberId: number, clubId: number) => {
		console.log(`roleId: ${roleId}, memberId: ${memberId}, clubId: ${clubId}`) // Add this line

		const response = await fetch(`http://localhost:5000/clubs/${clubId}/roles/${roleId}/members`, {
			method: 'PATCH',
			headers: {
				'Content-Type': 'application/json',
			},
			credentials: 'include',
			body: JSON.stringify({ members: [memberId] }),
		})

		if (!response.ok) {
			throw new Error(`HTTP error! status: ${response.status}`)
		}
	}

	useEffect(() => {
		setMemberRoles(roleFilter(member.roles, roles))
	}, [member.roles, roles])

	return (
		// TODO OPEN ASSIGN MENU WHEN RIGHT CLICK
		<TableRow
			key={member.id}
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
						<RoleCheckboxDropdown
							roles={roles}
							assignRole={async (roleId, assign) => {
								if (assign) {
									// Call the API to assign the role to the user
									await addRoleMember(roleId, member.id, clubId || 0)
								} else {
									// Call the API to unassign the role from the user
									// You need to implement this
								}
							}}
							clubMember={member}
						/>
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
