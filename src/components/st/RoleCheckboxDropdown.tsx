import React, { useState } from 'react'
import { ClubMember, ClubRole } from '@/types/club'
import { Checkbox } from '@/components/ui/checkbox'
import { decimalToRgb } from '@/helpers/helper'

interface RoleCheckboxDropdownProps {
	roles: ClubRole[]
	assignRole: (roleId: number, assign: boolean) => void
	clubMember: ClubMember
}

export default function RoleCheckboxDropdown({
	roles,
	assignRole,
	clubMember,
}: RoleCheckboxDropdownProps) {
	const [isOpen, setIsOpen] = useState(false)

	return (
		<div onMouseEnter={() => setIsOpen(true)} onMouseLeave={() => setIsOpen(false)}>
			<p>Assign roles</p>

			{isOpen && (
				<div>
					{roles.map((role: ClubRole) => (
						<div key={role.id}>
							<Checkbox
								checked={clubMember.roles.some((r) => r === role.id)}
								onCheckedChange={(checked) => assignRole(role.id, Boolean(checked))}
							/>
							<label style={{ color: `${decimalToRgb(role.color)}` }}>{role.name}</label>
						</div>
					))}
				</div>
			)}
		</div>
	)
}
