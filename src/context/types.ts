import { CreateContainerConfig } from '@/di'
import { PropsWithChildren } from 'react'
import { DependencyContainer } from 'tsyringe'

export interface DemoContextValue {
  serviceContainer: DependencyContainer
  useBoundStore: <T>(selector: (state: IStore) => T) => T
}

export interface DemoContextProviderProps extends CreateContainerConfig, PropsWithChildren {}

export interface UserInfo {
  name: string
  age: number
  sex: string
  address?: string
  phone?: string
  email?: string
  company?: string
}

export interface IStore {
  userInfo: UserInfo | null
  initUserInfo: (info: UserInfo) => void
  updateUserInfo: (info: Partial<UserInfo>) => void
}