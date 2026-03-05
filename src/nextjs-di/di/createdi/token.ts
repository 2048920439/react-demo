import { InjectionToken } from 'tsyringe'
import type { Env, IMountable } from '../interface'

// 环境变量 Token
export const EnvToken: InjectionToken<Env> = Symbol('Env')

// 可挂载 Service 集合 Token
// DIProvider 通过此 Token 获取所有需要调用 onMounted 的 Service
export const MountableServicesToken: InjectionToken<IMountable[]> = Symbol('MountableServices')
