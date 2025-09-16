import { IStore } from '@/context/types'
import { DemoContext } from './_context'
import { useContext } from 'react'
import { InjectionToken } from 'tsyringe'

function useDemoContext() {
  const ctx = useContext(DemoContext)
  if (!ctx) {
    throw new Error('DemoContextProvider not found')
  }
  return ctx
}

export function useService<T>(service: InjectionToken<T>): T {
  const { serviceContainer } = useDemoContext()

  if (!serviceContainer.isRegistered(service)) {
    const serviceName = (service as any).name || (service as any).toString();
    throw new Error(`Service ${serviceName} not registered`)
  }

  return serviceContainer.resolve(service)
}

export function useStore<T>(selector: (state: IStore) => T): T {
  return useDemoContext().useBoundStore(selector)
}
