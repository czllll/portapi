import { create } from 'zustand'

import { User } from '../types/user'
import axios from 'axios'

interface UserStore {
  user: User | null
  loading: boolean
  error: string | null
  fetchUser: () => Promise<void>
  setUser: (user: User | null) => void
  logout: () => void
}
const BASE_API_URL = process.env.NEXT_PUBLIC_BASE_API_URL;


const useUserStore = create<UserStore>((set) => ({
  user: null,
  loading: false,
  error: null,

  fetchUser: async () => {
    set({ loading: true, error: null })
    try {
      const response = await axios.get(`${BASE_API_URL}/user/current`)
      set({ user: response.data, loading: false })
    } catch (error: unknown) {
        if (error instanceof Error) {
          set({ error: error.message, loading: false })
        } else {
          set({ error: 'An unknown error occurred', loading: false })
        }
      }
      
  },

  setUser: (user) => set({ user }),
  
  logout: () => set({ user: null })
}))

export default useUserStore
