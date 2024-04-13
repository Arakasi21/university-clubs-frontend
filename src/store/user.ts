import { create } from 'zustand'
import { IUser } from '@/interface/user'
import { persist } from 'zustand/middleware'

interface userStore {
	user: IUser | null
	isLoggedIn: boolean

	setUser: (user: IUser) => void
	purgeUser: () => void
}

const useUserStore = create<userStore>()(
	persist(
		(set) => ({
			isLoggedIn: false,
			user: null,
			setUser: (user: IUser) =>
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
