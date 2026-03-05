import { createContext } from 'react'
import type { DependencyContainer } from 'tsyringe'

export interface DIContextValue {
    // TSyringe 容器，用于 resolve Service
    serviceContainer: DependencyContainer
}

export const DIContext = createContext<DIContextValue>(null as unknown as DIContextValue)
