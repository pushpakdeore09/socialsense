import {create} from 'zustand';

const useAuth = create((set) => ({
    isAuthenticated: false,
    user: null,
    login: (userData) => set({isAuthenticated: true, user: userData}),
    logout: () => set({isAuthenticated: false, user: null})
}));

export default useAuth;