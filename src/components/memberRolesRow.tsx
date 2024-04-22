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

	const addRoleMember = async (clubId: Club, roleId: ClubRole, memberId: ClubMember) => {
		const response = await fetch(`/clubs/${clubId}/roles/${roleId}/members`, {
			method: 'PATCH',
			headers: {
				'Content-Type': 'application/json',
			},
			credentials: 'include',
			body: JSON.stringify({ memberId }),
		})

		if (!response.ok) {
			throw new Error(`HTTP error! status: ${response.status}`)
		}

		const data = await response.json()
		return data
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
						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<p>Assign roles</p>
							</DropdownMenuTrigger>
							<DropdownMenuContent>
								{roles.map((role) => (
									<DropdownMenuItem
										key={role.id}
										onClick={() => addRoleMember(clubId, role.id, member.id)}
									>
										{role.name}
									</DropdownMenuItem>
								))}
							</DropdownMenuContent>
						</DropdownMenu>
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
