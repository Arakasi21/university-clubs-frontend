export interface IClub {
	id: number
	name: string
	description: string
	club_type: string
	logo_url: string
	banner_url: string
	number_of_members: number
	roles: [IClubRole]
}

export interface IClubMember {
	id: number
	first_name: string
	last_name: string
	avatar_url: string
	email: string
	barcode: string
	roles: number[]
}

export interface IClubRole {
	name: string
	permissions: string[]
	position: number
	color: number
}
