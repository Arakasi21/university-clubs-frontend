import React, { useState } from 'react'
import { ClubMember, ClubRole } from '@/types/club'
import { Checkbox } from '@/components/ui/checkbox'
import { decimalToRgb } from '@/helpers/helper'
import {
	DropdownMenuPortal,
	DropdownMenuSub,
	DropdownMenuSubContent,
	DropdownMenuSubTrigger,
} from '@/components/ui/dropdown-menu'

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
			<DropdownMenuSub>
				<DropdownMenuSubTrigger>Assign roles</DropdownMenuSubTrigger>
				{isOpen && (
					<DropdownMenuPortal>
						<DropdownMenuSubContent>
							{roles.map((role: ClubRole) => (
								<div key={role.id} className="flex flex-row items-center space-x-1.5 font-normal">
									<Checkbox
										checked={clubMember.roles.some((r) => r === role.id)}
										onCheckedChange={(checked) => assignRole(role.id, Boolean(checked))}
									/>
									<label style={{ color: `${decimalToRgb(role.color)}` }}>{role.name}</label>
								</div>
							))}
						</DropdownMenuSubContent>
					</DropdownMenuPortal>
				)}
			</DropdownMenuSub>
		</div>
	)
}
