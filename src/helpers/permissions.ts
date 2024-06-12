import { ClubRole } from '@/types/club'
import { Permissions, PermissionsList, PermissionsListItem } from '@/types/permissions'

// userRole [admin permission:(Manage club, Ban User),
// moder(manage roles)

export const accumulateMemberPermissions = (roles: ClubRole[]) => {
	let acc = 0
	roles.forEach((role) => {
		if (role.permissions == Permissions.administrator) {
			return Permissions.ALL
		}
		acc |= role.permissions
	})
	return acc // (Manage club, ban user, manage roles)
}

/**
 * Checks whether a member has a specific permission.
 * @param memberPerms The permission bitmask of the member.
 * @param permission The permission to check against. Pass only one Permission.
 * @returns True if the member has the permission, false otherwise.
 */
export const hasPermission = (memberPerms: number, permission: Permissions) => {
	return (memberPerms & permission) !== 0
}

export const missingPermissions = (permsFrom: number, permissions: number) => {
	return permissions & ~permsFrom
}

// TODO for front to check the membersHighestRole
export const membersHighestRole = (roles: ClubRole[]) => {
	let highestRole = roles[0]
	roles.forEach((role) => {
		if (role.position ?? 0 < highestRole.permissions) {
			highestRole = role
		}
	})
	return highestRole
}

export const permissionsToStringArr = (permissions: Permissions) => {
	const arr: PermissionsListItem[] = []

	if ((permissions & Permissions.administrator) !== 0) {
		arr.push(PermissionsList[0])
	}
	if ((permissions & Permissions.manage_club) !== 0) {
		arr.push(PermissionsList[1])
	}
	if ((permissions & Permissions.manage_membership) !== 0) {
		arr.push(PermissionsList[2])
	}
	if ((permissions & Permissions.kick_member) !== 0) {
		arr.push(PermissionsList[3])
	}
	if ((permissions & Permissions.ban_member) !== 0) {
		arr.push(PermissionsList[4])
	}
	if ((permissions & Permissions.manage_roles) !== 0) {
		arr.push(PermissionsList[5])
	}
	if ((permissions & Permissions.manage_events) !== 0) {
		arr.push(PermissionsList[6])
	}
	if ((permissions & Permissions.manage_posts) !== 0) {
		arr.push(PermissionsList[7])
	}
	return arr
}

export const permissionsToHex = (permissions: string[]) => {
	let hex = 0
	permissions.forEach((p) => {
		hex |= Permissions[p as keyof typeof Permissions]
	})
	return hex
}
