import { create } from 'zustand';

interface State {
    isLogin: boolean;
    setLogin: (val: boolean) => void;
}

export const useAuthStore = create<State>((set) => ({
    isLogin: false,
    setLogin: (val) => set({ isLogin: val })
}));
