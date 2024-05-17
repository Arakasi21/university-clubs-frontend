import React, { useState } from 'react'
import { Checkbox } from '@/components/ui/checkbox'
import { decimalToRgb } from '@/helpers/helper'
import {
	DropdownMenuPortal,
	DropdownMenuSub,
	DropdownMenuSubContent,
	DropdownMenuSubTrigger,
} from '@/components/ui/dropdown-menu'

export type UserRole = 'DSVR' | 'ADMIN' | 'MODER' | 'USER'

interface RoleCheckboxDropdownProps {
	roles: UserRole[]
	assignRole: (role: UserRole, assign: boolean) => Promise<void>
	userRoles: UserRole[]
}

export default function AdminRoleCheckboxDropdown({
	roles,
	assignRole,
	userRoles,
}: RoleCheckboxDropdownProps) {
	const [isOpen, setIsOpen] = useState(false)

	return (
		<div onMouseEnter={() => setIsOpen(true)} onMouseLeave={() => setIsOpen(false)}>
			<DropdownMenuSub>
				<DropdownMenuSubTrigger>Assign roles</DropdownMenuSubTrigger>
				{isOpen && (
					<DropdownMenuPortal>
						<DropdownMenuSubContent>
							{roles.map((role) => (
								<div key={role} className="flex flex-row items-center space-x-1.5 font-normal">
									<Checkbox
										checked={userRoles.includes(role)}
										onCheckedChange={(checked) => assignRole(role, Boolean(checked))}
										disabled={role === 'DSVR'}
									/>
									<label>{role}</label>
								</div>
							))}
						</DropdownMenuSubContent>
					</DropdownMenuPortal>
				)}
			</DropdownMenuSub>
		</div>
	)
}
