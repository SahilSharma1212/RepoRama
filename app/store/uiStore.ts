import { create } from 'zustand'

type UIStore = {
    isLeftBarHidden: boolean
    toggleLeftBarVisibility: () => void
    isRightBarHidden: boolean,
    toggleRightBarVisibility: () => void
}

const useUIStore = create<UIStore>((set, get) => ({
    isLeftBarHidden: false,
    toggleLeftBarVisibility: () => {
        const { isLeftBarHidden } = get()
        set({ isLeftBarHidden: !isLeftBarHidden })
    },
    isRightBarHidden: true,
    toggleRightBarVisibility: () => {
        const { isRightBarHidden } = get()
        set({ isRightBarHidden: !isRightBarHidden })
    },
}))

export default useUIStore
