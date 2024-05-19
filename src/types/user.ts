export type User = {
	id: number
	first_name: string
	last_name: string
	avatar_url: string
	email: string
	created_at: string
	role: 'DSVR' | 'ADMIN' | 'MODER' | 'USER'
	barcode: string
	major: string
	group_name: string
	year: number
}

// TODO add about me , phone number, hobbies , skills, interests, social media links
