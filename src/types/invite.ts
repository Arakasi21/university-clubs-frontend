import { Event } from '@/types/event'

export interface User {
	id: number
	first_name: string
	last_name: string
	barcode: string
	avatar_url: string
}

export interface Club {
	id: number
	name: string
	logo_url: string
}

export interface OrganizerInvite {
	id: string
	event: Event
	club_id: number
	by_who_id: number
	user: User
}

export interface CollaboratorInvite {
	id: string
	event: Event
	club: Club
}
