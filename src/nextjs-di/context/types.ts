import type { CreateDIConfig } from '../di/createdi'
import type { PropsWithChildren } from 'react'

// ─── Context Provider Props ──────────────────────────────────
export interface DIProviderProps extends CreateDIConfig, PropsWithChildren {}
