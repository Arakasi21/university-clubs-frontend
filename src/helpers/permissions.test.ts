import { describe, expect, test } from '@jest/globals'
import { ClubRole } from '../types/club'
import { Permissions } from '../types/permissions'
import { accumulateMemberPermissions, hasPermission } from './permissions'

describe('accumulateMemberPermissions', () => {
	test('only administrator', () => {
		const roles: ClubRole[] = [
			{ id: 1, permissions: Permissions.None, position: 0, name: 'member', color: 324234 },
			{ id: 2, permissions: Permissions.Administrator, position: 0, name: 'member', color: 324234 },
			{ id: 3, permissions: Permissions.None, position: 0, name: 'member', color: 324234 },
			{ id: 4, permissions: Permissions.None, position: 0, name: 'member', color: 324234 },
		]

		const accumPerms = accumulateMemberPermissions(roles)

		expect(accumPerms).toBe(Permissions.Administrator)
	})

	test('two permissions', () => {
		const roles: ClubRole[] = [
			{ id: 1, permissions: Permissions.None, position: 0, name: 'member', color: 324234 },
			{ id: 2, permissions: Permissions.ManageClub, position: 0, name: 'member', color: 324234 },
			{ id: 3, permissions: Permissions.ManageRoles, position: 0, name: 'member', color: 324234 },
			{ id: 4, permissions: Permissions.None, position: 0, name: 'member', color: 324234 },
		]

		const accumPerms = accumulateMemberPermissions(roles)

		expect(accumPerms).toBe(Permissions.ManageClub | Permissions.ManageRoles)
	})

	test('no permissions', () => {
		const roles: ClubRole[] = [
			{ id: 1, permissions: Permissions.None, position: 0, name: 'member', color: 324234 },
			{ id: 2, permissions: Permissions.None, position: 0, name: 'member', color: 324234 },
			{ id: 3, permissions: Permissions.None, position: 0, name: 'member', color: 324234 },
			{ id: 4, permissions: Permissions.None, position: 0, name: 'member', color: 324234 },
		]

		const accumPerms = accumulateMemberPermissions(roles)

		expect(accumPerms).toBe(Permissions.None)
	})

	test('no permissions', () => {
		const roles: ClubRole[] = []

		const accumPerms = accumulateMemberPermissions(roles)

		expect(accumPerms).toBe(Permissions.None)
	})
})

describe('Has Permissions', () => {
	const memberPermissions = Permissions.ManageClub | Permissions.ManageRoles

	test('true, has permissions', () => {
		expect(hasPermission(memberPermissions, Permissions.ManageRoles)).toBeTruthy()
	})

	test('do not have permissions', () => {
		expect(hasPermission(memberPermissions, Permissions.Administrator)).toBeFalsy()
	})
	test('do not have permissions', () => {
		expect(hasPermission(memberPermissions, Permissions.None)).toBeFalsy()
	})
	test('true, has permissions', () => {
		expect(hasPermission(memberPermissions, Permissions.ManageClub)).toBeTruthy()
	})

	test('member have all perms', () => {
		expect(hasPermission(Permissions.ALL, Permissions.ManageClub)).toBeTruthy()
	})
})
