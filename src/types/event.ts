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
	published_at: string
	is_hidden_for_non_members: boolean
}

export type EventParticipationStatus = 'UNKNOWN' | 'BANNED' | 'PARTICIPANT'

export type EventUserStatus = 'UNKNOWN' | 'ORGANIZER' | 'OWNER'

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
	url: string
	name: string
	type: string
	position: number
}

export type EventFilters = {
	clubId: number
	userId: number
	status:
		| ''
		| 'DRAFT'
		| 'PENDING'
		| 'APPROVED'
		| 'REJECTED'
		| 'IN_PROGRESS'
		| 'FINISHED'
		| 'CANCELLED'
		| 'ARCHIVED'
	tags: string[]
	from_date: Date
	till_date: Date
	sort_by: '' | 'date' | 'participants' | 'type'
	sort_order: '' | 'asc' | 'desc'
}
