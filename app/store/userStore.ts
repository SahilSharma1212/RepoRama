import { create } from 'zustand'
import { GithubProfile } from '../types'
import axios from 'axios'

type UserStore = {
    user: GithubProfile | null
    setUser: (user: GithubProfile) => void
    clearUser: () => void
    fetchUser: (userId: string) => Promise<void>
}

export const useUserStore = create<UserStore>((set) => ({
    user: null,
    setUser: (user) => set({ user }),
    clearUser: () => set({ user: null }),
    fetchUser: async (userId) => {
        if (!userId) return
        try {
            const res = await axios.get(`/api/user`, {
                params: { userId }
            })

            if (res.data?.user) {
                set({ user: res.data.user })
            } else {
                set({ user: null })
            }
        } catch (err: any) {
            console.error("Failed to fetch user:", err)
            set({ user: null })
        }
    }
}))
