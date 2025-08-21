import { create } from 'zustand';

interface State {
    isLogin: boolean;
    hideHistoryChat: boolean;
    setLogin: (val: boolean) => void;
    setHideHistoryCHat: (val: boolean) => void;
}

export const useAuthStore = create<State>((set) => ({
    isLogin: false,
    hideHistoryChat: false,
    setLogin: (val) => set({ isLogin: val }),
    setHideHistoryCHat: (val) => set({ hideHistoryChat: val })
}));
