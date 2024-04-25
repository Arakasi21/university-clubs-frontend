import { User } from '@/types/user'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface userStore {
	user: User | null
	jwt_token: string | null
	isLoggedIn: boolean

	setUser: (user: User, jwt_token: string) => void
	purgeUser: () => void
}

const useUserStore = create<userStore>()(
	persist(
		(set) => ({
			isLoggedIn: false,
			user: null,
			jwt_token: null,
			setUser: (user: User, jwt_token: string) =>
				set(() => ({
					isLoggedIn: true,
					user: user,
					jwt_token: jwt_token,
				})),
			purgeUser: () =>
				set(() => ({
					isLoggedIn: false,
					user: null,
					jwt_token: null,
				})),
		}),
		{
			name: 'user-storage', // Specify the name for the storage key
		},
	),
)

export default useUserStore
