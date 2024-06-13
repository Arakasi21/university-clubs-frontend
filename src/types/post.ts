export type Post = {
	id: string
	club: Club
	title: string
	description: string
	tags: string[]
	created_at: string
	updated_at: string
	cover_images?: Image[]
	attached_files?: PostFile[]
}
export type Image = {
	url: string
	name: string
	type: string
	position: number
}

export type PostFile = {
	url: string
	name: string
	type: string
}

export type Club = {
	id: number
	name: string
	logo_url: string
}
