import { create } from 'zustand'
import { GithubApiProfile, GithubProfile } from '../types'
import axios from 'axios'
type repoType = {
    id: string
    created_at: string
    clerk_user_id: string
    description: string | null
    github_repo_url: string
}
type UserStore = {
    user: GithubApiProfile | null
    setUser: (user: GithubApiProfile) => void
    clearUser: () => void
    fetchUser: (userId: string) => Promise<void>
    repos: repoType[]
    fetchUserRepos: (userId: string) => Promise<void>
    isFetchingRepos: boolean,
    setRepos: (repos: repoType[]) => void
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

            if (res.data) {
                set({ user: res.data })
            } else {
                set({ user: null })
            }
        } catch (err) {
            console.error("Failed to fetch user:", err)
            set({ user: null })
        }
    },

    isFetchingRepos: false,
    fetchUserRepos: async (userId: string) => {
        if (!userId) return
        set({ isFetchingRepos: true }) // <-- Start loading

        try {
            const res = await axios.get(`/api/repo?userId=${userId}`)

            if (res.data) {
                set({ repos: res.data })
            } else {
                set({ repos: [] })
            }
        } catch (err) {
            console.error("Failed to fetch user repos:", err)
            set({ repos: [] })
        } finally {
            set({ isFetchingRepos: false }) // <-- Stop loading
        }
    },
    repos: [],
    setRepos: (repos: repoType[]) => set({ repos }),
}))