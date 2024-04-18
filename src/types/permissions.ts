export enum Permissions {
	None = 0,
	Administrator = 1 << 0,
	ManageClub = 1 << 1,
	ManageMembership = 1 << 2,
	KickMember = 1 << 3,
	BanMember = 1 << 4,
	ManageRoles = 1 << 5,
	ALL = Administrator | ManageRoles | ManageMembership | KickMember | BanMember | ManageClub,
}
