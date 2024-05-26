import { Permissions } from '@/types/permissions'
import { create } from 'zustand'
import { Club, ClubRole } from '@/types/club'

export interface userRolesStore {
	roles: ClubRole[] | []
	highestRole?: ClubRole
	permissions: Permissions
	club?: Club
	setUserRoles: (
		roles: ClubRole[],
		highestRole: ClubRole,
		permissions: Permissions,
		club: Club,
	) => void
	resetUserRoles: () => void
}

const useUserRolesStore = create<userRolesStore>()((set) => ({
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
	resetUserRoles: () => {
		set({
			roles: [],
			highestRole: undefined,
			permissions: Permissions.none,
			club: undefined,
		})
	},
}))

export default useUserRolesStore
