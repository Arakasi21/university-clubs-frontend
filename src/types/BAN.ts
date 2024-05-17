import { ClubMember } from '@/types/club'
export type Ban = {
	id: number
	club_id: number
	user: ClubMember
	admin: ClubMember
	reason: string
	banned_at: string
}
