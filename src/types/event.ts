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
	attached_files: {
		url: string
		name: string
		type: string
	}[]
	attached_images: {
		url: string
		name: string
		type: string
	}[]
	cover_images: {
		filemongo: {
			url: string
			name: string
			type: string
		}
		position: number
	}[]
	end_date: string
	location_link: string
	location_university: string
	approved_metadata?: ApprovedMetadata
	reject_metadata?: RejectMetadata
	max_participants: number
	start_date: string
	tags: string[]
	title: string
	type: string
}

export type Organizer = {
	id: number
	first_name: string
	last_name: string
	avatar_url: string
	barcode: number
	club_id: number
	by_who_id?: number
}

export type ApprovedMetadata = {
	approved_by: Organizer[]
	approved_at: string
}

export type RejectMetadata = {
	rejected_by: Organizer[]
	rejected_at: string
}
