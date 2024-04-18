import React, { useCallback, useEffect, useState } from 'react'
import { ClubRole, UserClubStatus } from '@/types/club'
import { toast } from 'sonner'
import { accumulateMemberPermissions } from '@/helpers/permissions'
import { User } from '@/types/user'
import { Permissions } from '@/types/permissions'

export type UseMemberRolesProps = {
	userStatus: UserClubStatus
	user: User | null
	clubID: number
}

function UseMemberRoles({ clubID, user, userStatus }: UseMemberRolesProps) {
	const [roles, setRoles] = useState<ClubRole[]>([])
	const [permissions, setPermissions] = useState(0)

	const fetchMemberRoles = useCallback(() => {
		fetch(`http://localhost:5000/clubs/${clubID}/members/${user?.id}/roles`)
			.then(async (res) => {
				const data = await res.json()
				if (!res.ok) {
					toast.error('not found', {
						description: data.error,
					})

					throw new Error(data.error || 'Failed to Fetch member roles ')
				}

				setRoles(data.roles)
				setPermissions(data.is_owner ? Permissions.ALL : accumulateMemberPermissions(data.roles))
			})
			.catch((error) => console.log(error.message))
	}, [clubID, user?.id])

	useEffect(() => {
		if (userStatus !== 'MEMBER' && !user) {
			return
		}
		fetchMemberRoles()
	}, [user])

	return { roles, permissions }
}

export default UseMemberRoles
