import { IStore } from '@/context/types'
import { create } from 'zustand'

export const createStore = () => {
  return create<IStore>((set,get) => {
    return {
      userInfo: null,
      initUserInfo: (userInfo) => set({ userInfo }),
      updateUserInfo: (userInfo) => {
        const oldUserInfo = get().userInfo
        if (!oldUserInfo){
          throw new Error('User info is not set')
        }
        set({ userInfo: { ...oldUserInfo, ...userInfo } })
      }
    }
  })
}