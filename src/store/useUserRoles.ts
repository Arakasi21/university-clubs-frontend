import { Permissions } from '@/types/permissions'
import { create } from 'zustand'
import { Club, ClubRole } from '@/types/club'

interface useUserRolesStore {
	roles: ClubRole[]
	highestRole?: ClubRole
	permissions: Permissions
	club?: Club
	setUserRoles: (
		roles: ClubRole[],
		highestRole: ClubRole,
		permissions: Permissions,
		club: Club,
	) => void
}

const useUserRolesStore = create<useUserRolesStore>()((set) => ({
	roles: [],
	permissions: Permissions.none,
	setUserRoles: (
		roles: ClubRole[],
		highestRole: ClubRole,
		permissions: Permissions,
		club: Club,
	) => {
		set({ roles, highestRole, permissions, club })
	},
}))

export default useUserRolesStore
