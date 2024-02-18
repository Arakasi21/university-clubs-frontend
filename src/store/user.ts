import create from 'zustand';
import { IUser } from '@/interface/user';

interface userStore{
    user: IUser | null;
    isLoggedIn : boolean;
}

const useUserStore = create<userStore>((set) => ({
    isLoggedIn: false,
    user: null,
    login: (user: IUser) =>
        set((state) => ({
            isLoggedIn: true,
            user: user

        })),
    logout: () =>
        set((state) => ({
            isLoggedIn: false,
            user: null
        })),
}));

export default useUserStore;