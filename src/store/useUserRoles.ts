import { Permissions } from '@/types/permissions'
import { create } from 'zustand'
import { ClubRole } from '@/types/club'

interface useUserRolesStore {
	roles: ClubRole[]
	highestRole?: ClubRole
	permissions: Permissions

	setUserRoles: (roles: ClubRole[], highestRole: ClubRole, permissions: Permissions) => void
}

const useUserRolesStore = create<useUserRolesStore>()((set) => ({
	roles: [],
	permissions: Permissions.none,
	setUserRoles: (roles: ClubRole[], highestRole: ClubRole, permissions: Permissions) => {
		set({ roles, highestRole, permissions })
	},
}))

export default useUserRolesStore
