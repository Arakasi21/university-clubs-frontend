import React, { useEffect, useState } from 'react'
import { IClubMember, IClubRole } from '@/interface/club'
import { TableCell, TableRow } from '@/components/ui/table'
import UserAvatar from '@/components/userAvatar'
import { decimalToRgb } from '@/helpers/helper'

export type MemberRolesRowProps = { member: IClubMember; roles: IClubRole[] }

function MemberRolesRow({ member, roles }: MemberRolesRowProps) {
	const [memberRoles, setMemberRoles] = useState<IClubRole[]>()

	const roleFilter = (arr1: number[], arr2: IClubRole[]) => {
		const res: IClubRole[] = []
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
