import { ClubRole } from '@/types/club'

export const accumulateMemberPermissions = (roles: ClubRole[]) => {
	let acc = 0
	roles.forEach((role) => {
		acc |= role.permissions
	})
	return acc
}
