import { useCallback, useEffect } from 'react'
import { Club, UserClubStatus } from '@/types/club'
import { toast } from 'sonner'
import { accumulateMemberPermissions, membersHighestRole } from '@/helpers/permissions'
import { User } from '@/types/user'
import { Permissions } from '@/types/permissions'
import useUserRolesStore from '@/store/useUserRoles'

export type UseMemberRolesProps = {
	userStatus: UserClubStatus
	user: User | null
	club: Club | null
	shouldFetch: boolean
}

function useMemberRoles({ club, user, userStatus, shouldFetch }: UseMemberRolesProps) {
	const { setUserRoles } = useUserRolesStore()

	const fetchMemberRoles = useCallback(() => {
		if (!shouldFetch || !club || !user?.id) {
			return
		}
		fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/clubs/${club.id}/members/${user?.id}/roles`)
			.then(async (res) => {
				const data = await res.json()
				if (!res.ok) {
					toast.error('not found', {
						description: data.error,
					})

					throw new Error(data.error || 'Failed to Fetch member roles ')
				}
				// do not touch
				const permissions = data.is_owner
					? Permissions.ALL
					: accumulateMemberPermissions(data.roles)

				setUserRoles(data.roles, membersHighestRole(data.roles), permissions, club)
			})
			.catch((error) => console.log(error.message))
	}, [club, user?.id, setUserRoles, shouldFetch])

	useEffect(() => {
		fetchMemberRoles()
	}, [fetchMemberRoles])
}
export default useMemberRoles
