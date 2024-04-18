import { User } from '@/types/user'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface userStore {
	user: User | null
	isLoggedIn: boolean

	setUser: (user: User) => void
	purgeUser: () => void
}

const useUserStore = create<userStore>()(
	persist(
		(set) => ({
			isLoggedIn: false,
			user: null,
			setUser: (user: User) =>
				set(() => ({
					isLoggedIn: true,
					user: user,
				})),
			purgeUser: () =>
				set(() => ({
					isLoggedIn: false,
					user: null,
				})),
		}),
		{
			name: 'user-storage', // Specify the name for the storage key
		},
	),
)

export default useUserStore
