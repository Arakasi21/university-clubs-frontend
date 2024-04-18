import { ClubRole } from '@/types/club'
import { Permissions } from '@/types/permissions'

export const accumulateMemberPermissions = (roles: ClubRole[]) => {
	let acc = 0
	roles.forEach((role) => {
		if (role.permissions == Permissions.Administrator) {
			return Permissions.ALL
		}
		acc |= role.permissions
	})
	return acc
}

/**
 * Checks whether a member has a specific permission.
 * @param memberPerms The permission bitmask of the member.
 * @param permission The permission to check against. Pass only one Permission.
 * @returns True if the member has the permission, false otherwise.
 */
export const hasPermission = (memberPerms: number, permission: Permissions) => {
	// If the result is not 0, it means the member has the permission.
	return (memberPerms & permission) !== 0
}

export const missingPermissions = (permsFrom: number, permissions: number) => {
	return permissions & ~permsFrom
}
