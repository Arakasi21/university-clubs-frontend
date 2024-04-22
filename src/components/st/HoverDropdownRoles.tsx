import React, { useState } from 'react'
import { Club, ClubRole } from '@/types/club'

export function HoverDropdownRoles({
	roles,
	clubId,
	member,
	addRoleMember,
}: {
	club: Club
	role: ClubRole
	onUpdateSuccess: () => void
})) {
	const [isOpen, setIsOpen] = useState(false)

	return (
		<div onMouseEnter={() => setIsOpen(true)} onMouseLeave={() => setIsOpen(false)}>
			<p>Assign roles</p>

			{isOpen && (
				<div>
					{roles.map((role) => (
						<p key={role.id} onClick={() => addRoleMember(clubId, role.id, member.id)}>
							{role.name}
						</p>
					))}
				</div>
			)}
		</div>
	)
}
