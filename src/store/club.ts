import { Club } from '@/types/club'
import { create } from 'zustand'

export interface clubStore {
	club: Club | null
	isOwner: boolean
	fetchClubInfo: () => void
	setClubStore: (club: Club, isOwner: boolean, fetchClubInfo: () => void) => void
}

const useClubStore = create<clubStore>()((set) => ({
	club: null,
	isOwner: false,
	fetchClubInfo: () => {},
	setClubStore: (club, isOwner, fetchClubInfo) => {
		set({ club, isOwner, fetchClubInfo })
	},
}))

export default useClubStore
