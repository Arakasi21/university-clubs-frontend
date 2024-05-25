import { Event } from '@/types/event'
import { create } from 'zustand'

export interface eventStore {
	event: Event | null
	isOwner: boolean
	fetchEventInfo: () => void
	setEventStore: (event: Event, isOwner: boolean, fetchEventInfo: () => void) => void
}

const useEventStore = create<eventStore>()((set) => ({
	event: null,
	isOwner: false,
	fetchEventInfo: () => {},
	setEventStore: (event, isOwner, fetchEventInfo) => {
		set({ event, isOwner, fetchEventInfo })
	},
}))

export default useEventStore
