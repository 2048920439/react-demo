import { createStore } from '@/context/_store'
import { createContainer } from '@/di'
import { useMemo } from 'react'
import { DemoContextProviderProps, DemoContextValue } from './types'
import { DemoContext } from './_context'

export const DemoContextProvider = (props: DemoContextProviderProps) => {
  const { children, env } = props

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const serviceContainer = useMemo(() => createContainer({ env }), [])

  const useBoundStore = useMemo(() => createStore(), [])

  const value = useMemo<DemoContextValue>(() => {

    return {
      serviceContainer,
      useBoundStore
    }
  }, [serviceContainer, useBoundStore])

  return <DemoContext.Provider value={value}>{children}</DemoContext.Provider>
}

