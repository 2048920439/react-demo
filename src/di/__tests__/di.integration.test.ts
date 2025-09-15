import { describe, it, expect, vi } from 'vitest'
import { createTestContainer } from '../__tests__/test-utils'
import { HttpService, WebSocketService, ApplicationFormService } from '@/di/services'
import { EnvToken } from '@/di/token'

describe('DI Integration', () => {
  it('应该正确解析所有服务', () => {
    const container = createTestContainer({ env: 'pre' })
    
    // 解析所有服务
    const env = container.resolve(EnvToken)
    const httpService = container.resolve(HttpService)
    const webSocketService = container.resolve(WebSocketService)
    const applicationFormService = container.resolve(ApplicationFormService)
    
    // 检查所有服务都被正确解析
    expect(env).toBe('pre')
    expect(httpService).toBeInstanceOf(HttpService)
    expect(webSocketService).toBeInstanceOf(WebSocketService)
    expect(applicationFormService).toBeInstanceOf(ApplicationFormService)
  })

  it('应该在多次解析中保持单例实例', () => {
    const container = createTestContainer({ env: 'daily' })
    
    // 多次解析服务
    const httpService1 = container.resolve(HttpService)
    const httpService2 = container.resolve(HttpService)
    
    const webSocketService1 = container.resolve(WebSocketService)
    const webSocketService2 = container.resolve(WebSocketService)
    
    const applicationFormService1 = container.resolve(ApplicationFormService)
    const applicationFormService2 = container.resolve(ApplicationFormService)
    
    // 检查返回的是相同实例
    expect(httpService1).toBe(httpService2)
    expect(webSocketService1).toBe(webSocketService2)
    expect(applicationFormService1).toBe(applicationFormService2)
  })

  it('应该在所有服务中正确注入依赖', () => {
    const container = createTestContainer({ env: 'prod' })
    
    // 解析服务
    const httpService = container.resolve(HttpService)
    const webSocketService = container.resolve(WebSocketService)
    const applicationFormService = container.resolve(ApplicationFormService)
    
    // 检查依赖被正确注入
    expect((webSocketService as any).http).toBe(httpService)
    expect((applicationFormService as any).http).toBe(httpService)
    
    // 检查服务在环境中正确工作
    // 我们不能直接访问私有属性，但可以验证行为
    const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {})
    
    // 测试 HttpService
    httpService.get('/test')
    expect(consoleSpy).toHaveBeenCalledWith('get request', expect.objectContaining({
      env: 'prod',
      url: '/test'
    }))
    
    // 测试 WebSocketService
    consoleSpy.mockClear()
    webSocketService.connect('/ws')
    expect(consoleSpy).toHaveBeenCalledWith('connect', expect.objectContaining({
      url: '/ws',
      env: 'prod'
    }))
    
    consoleSpy.mockRestore()
  })
})