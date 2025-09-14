import { Env, IApplicationFormService, IHttpService, IWebSocketService } from '@/di/types'
import { InjectionToken } from 'tsyringe'

export const EnvToken: InjectionToken<Env> = Symbol("Env");
export const HttpToken: InjectionToken<IHttpService> = Symbol("HttpService");
export const WebSocketToken: InjectionToken<IWebSocketService> = Symbol("WebSocketService");
export const ApplicationFormServiceToken: InjectionToken<IApplicationFormService> = Symbol("ApplicationFormService");