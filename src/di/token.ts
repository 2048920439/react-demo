import { Env } from '@/di/types'
import { InjectionToken } from 'tsyringe'

export const EnvToken: InjectionToken<Env> = Symbol("Env");