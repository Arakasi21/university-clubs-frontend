export enum Permissions {
	none = 0,
	administrator = 1 << 0, // 000001 1
	manage_club = 1 << 1, //000010 2
	manage_membership = 1 << 2, //000100 4
	kick_member = 1 << 3, // 001000 8
	ban_member = 1 << 4, // 010000  16
	manage_roles = 1 << 5, // 100000 32
	manage_events = 1 << 6,
	manage_posts = 1 << 7,
	ALL = administrator |
		manage_roles |
		manage_membership |
		kick_member |
		ban_member |
		manage_club |
		manage_events |
		manage_posts, //1111111 63
}

export type PermissionsListItem = {
	id: string
	label: string
	hex: Permissions
}

export const PermissionsList: PermissionsListItem[] = [
	{
		id: 'administrator',
		label: 'Administrator',
		hex: Permissions.administrator,
	},
	{
		id: 'manage_club',
		label: 'Manage Club',
		hex: Permissions.manage_club,
	},
	{
		id: 'manage_membership',
		label: 'Manage Membership',
		hex: Permissions.manage_membership,
	},
	{
		id: 'kick_member',
		label: 'Kick Member',
		hex: Permissions.kick_member,
	},
	{
		id: 'ban_member',
		label: 'Ban Member',
		hex: Permissions.ban_member,
	},
	{
		id: 'manage_roles',
		label: 'Manage Roles',
		hex: Permissions.manage_roles,
	},
	{
		id: 'manage_events',
		label: 'Manage Events',
		hex: Permissions.manage_events,
	},
	{
		id: 'manage_posts',
		label: 'Manage Posts',
		hex: Permissions.manage_posts,
	},
]
