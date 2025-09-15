import { DependencyContainer } from 'tsyringe'
import { CreateContainerConfig, createContainer } from '@/di/createContainer'

/**
 * 创建测试容器的辅助函数
 * @param config 容器配置
 * @returns 测试容器实例
 */
export const createTestContainer = (config: CreateContainerConfig): DependencyContainer => {
  return createContainer(config)
}

/**
 * 清理容器的辅助函数
 * 注意：tsyringe不直接支持清理容器，这个函数主要用于文档目的
 */
export const clearContainer = (): void => {
  // tsyringe库不提供直接清理容器的方法
  // 在测试中，我们通常为每个测试创建新的子容器
}

/**
 * Mock服务的辅助函数
 * @param container 容器实例
 * @param token 服务令牌
 * @param mockImplementation mock实现
 */
export const mockService = <T>(
  container: DependencyContainer,
  token: any,
  mockImplementation: T
): void => {
  container.register(token, { useValue: mockImplementation })
}

export type { CreateContainerConfig }