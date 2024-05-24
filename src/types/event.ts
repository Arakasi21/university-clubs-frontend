import { Club } from '@/types/club'

export type Event = {
	id: string
	club_id: number
	owner_id: number
	collaborator_clubs: Club[]
	organizers: Organizer[]
	status: string
	is_approve: boolean
	created_at: string
	updated_at: string
	deleted_at: string
	attached_files: AttachedFile[]
	attached_images: AttachedImage[]
	cover_images: CoverImage[]
	end_date: string
	location_link: string
	location_university: string
	approved_metadata?: ApprovedMetadata
	reject_metadata?: RejectMetadata
	max_participants: number
	start_date: string
	tags: string[]
	title: string
	description: string
	type: string
}

export type Organizer = {
	id: number
	first_name: string
	last_name: string
	avatar_url: string
	barcode: string
	club_id: number
	by_who_id?: number
}

type User = {
	id: number
	first_name: string
	last_name: string
	barcode: string
	avatar_url: string
}

export type ApprovedMetadata = {
	approved_by: User
	approved_at: string
}

export type RejectMetadata = {
	rejected_by: User
	rejected_at: string
}

export type AttachedFile = {
	url: string
	name: string
	type: string
}

export type AttachedImage = {
	url: string
	name: string
	type: string
}

export type CoverImage = {
	filemongo: {
		url: string
		name: string
		type: string
	}
	position: number
}
