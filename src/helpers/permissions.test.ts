import { describe, expect, test } from '@jest/globals'
import { ClubRole } from '../types/club'
import { Permissions } from '../types/permissions'
import { accumulateMemberPermissions, hasPermission } from './permissions'

describe('accumulateMemberPermissions', () => {
	test('only administrator', () => {
		const roles: ClubRole[] = [
			{ id: 1, permissions: Permissions.none, position: 0, name: 'member', color: 324234 },
			{ id: 2, permissions: Permissions.administrator, position: 0, name: 'member', color: 324234 },
			{ id: 3, permissions: Permissions.none, position: 0, name: 'member', color: 324234 },
			{ id: 4, permissions: Permissions.none, position: 0, name: 'member', color: 324234 },
		]

		const accumPerms = accumulateMemberPermissions(roles)

		expect(accumPerms).toBe(Permissions.administrator)
	})

	test('two permissions', () => {
		const roles: ClubRole[] = [
			{ id: 1, permissions: Permissions.none, position: 0, name: 'member', color: 324234 },
			{ id: 2, permissions: Permissions.manage_club, position: 0, name: 'member', color: 324234 },
			{ id: 3, permissions: Permissions.manage_roles, position: 0, name: 'member', color: 324234 },
			{ id: 4, permissions: Permissions.none, position: 0, name: 'member', color: 324234 },
		]

		const accumPerms = accumulateMemberPermissions(roles)

		expect(accumPerms).toBe(Permissions.manage_club | Permissions.manage_roles)
	})

	test('no permissions', () => {
		const roles: ClubRole[] = [
			{ id: 1, permissions: Permissions.none, position: 0, name: 'member', color: 324234 },
			{ id: 2, permissions: Permissions.none, position: 0, name: 'member', color: 324234 },
			{ id: 3, permissions: Permissions.none, position: 0, name: 'member', color: 324234 },
			{ id: 4, permissions: Permissions.none, position: 0, name: 'member', color: 324234 },
		]

		const accumPerms = accumulateMemberPermissions(roles)

		expect(accumPerms).toBe(Permissions.none)
	})

	test('no permissions', () => {
		const roles: ClubRole[] = []

		const accumPerms = accumulateMemberPermissions(roles)

		expect(accumPerms).toBe(Permissions.none)
	})
})

describe('Has Permissions', () => {
	const memberPermissions = Permissions.manage_club | Permissions.manage_roles

	test('true, has permissions', () => {
		expect(hasPermission(memberPermissions, Permissions.manage_roles)).toBeTruthy()
	})

	test('do not have permissions', () => {
		expect(hasPermission(memberPermissions, Permissions.administrator)).toBeFalsy()
	})
	test('do not have permissions', () => {
		expect(hasPermission(memberPermissions, Permissions.none)).toBeFalsy()
	})
	test('true, has permissions', () => {
		expect(hasPermission(memberPermissions, Permissions.manage_club)).toBeTruthy()
	})

	test('member have all perms', () => {
		expect(hasPermission(Permissions.ALL, Permissions.manage_club)).toBeTruthy()
	})

	test('member have all perms', () => {
		expect(hasPermission(Permissions.ALL, Permissions.ALL)).toBeTruthy()
	})
})
