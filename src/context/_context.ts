import { DemoContextValue } from './types'
import { createContext } from 'react'


export const DemoContext = createContext<DemoContextValue>(null as unknown as DemoContextValue)

