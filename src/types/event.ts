export type Event = {
	_id: string
	club_id: number
	user_id: number
	status: string
	is_approve: boolean
	created_at: string
	updated_at: string
	deleted_at: string
	attachedfiles: string[]
	attachedimages: string[]
	club: {
		_id: number
		name: string
		logo_url: string
	}
	collaboratorclubs: string | null
	coverimages: string[]
	createdat: string
	deletedat: string
	description: string
	enddate: string
	id: string
	locationlink: string
	locationuniversity: string
	maxparticipants: number
	organizers: string | null
	participantscount: number
	startdate: string
	tags: string[]
	title: string
	type: string
	updatedat: string
	user: {
		_id: number
		first_name: string
		last_name: string
		barcode: string
		avatar_url: string
	}
}
