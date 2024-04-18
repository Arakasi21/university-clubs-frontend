import { TableCell, TableRow } from '@/components/ui/table'
import UserAvatar from '@/components/userAvatar'
import { decimalToRgb } from '@/helpers/helper'
import { ClubMember, ClubRole } from '@/types/club'
import { useEffect, useState } from 'react'

export type MemberRolesRowProps = { member: ClubMember; roles: ClubRole[] }

function MemberRolesRow({ member, roles }: MemberRolesRowProps) {
	const [memberRoles, setMemberRoles] = useState<ClubRole[]>()

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
		<TableRow key={member.id}>
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
		</TableRow>
	)
}

export default MemberRolesRow
