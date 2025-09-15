import { ApplicationFormService, HttpService, WebSocketService } from './services'
import { EnvToken } from './token'
import { Env } from './types'
import {
  container,
  DependencyContainer
} from 'tsyringe'

export interface CreateContainerConfig {
  env: Env
}

export const createContainer = (config: CreateContainerConfig) => {
  const localContainer: DependencyContainer = container.createChildContainer()

  // 环境变量
  localContainer.register(EnvToken, { useValue: config.env })

  // 基础服务
  localContainer.registerSingleton(HttpService, HttpService)
  localContainer.registerSingleton(WebSocketService, WebSocketService)

  // 业务层
  localContainer.registerSingleton(ApplicationFormService, ApplicationFormService)

  return localContainer
}