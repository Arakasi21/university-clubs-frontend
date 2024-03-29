import {create} from 'zustand';
import {IUser} from '@/interface/user';
import {persist} from "zustand/middleware";

interface userStore{
    user: IUser | null;
    isLoggedIn : boolean;

    login: (user: IUser) => void
    logout: () => void
}

const useUserStore = create<userStore>()(
    persist(
        (set) => ({
            isLoggedIn: false,
            user: null,
            login: (user: IUser) =>
                set(() => ({
                    isLoggedIn: true,
                    user: user
                })),
            logout: () =>
                set(() => ({
                    isLoggedIn: false,
                    user: null
                })),
        }),
        {
            name: 'user-storage', // Specify the name for the storage key
        }
    ));

export default useUserStore;