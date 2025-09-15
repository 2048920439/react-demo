import { describe, expect, it } from 'vitest'
import { createContainer } from '@/di/createContainer'
import { EnvToken } from '@/di/token'
import { HttpService, WebSocketService, ApplicationFormService } from '@/di/services'

describe('createContainer', () => {
  it('应该创建一个容器实例', () => {
    const container = createContainer({ env: 'daily' });
    expect(container).toBeDefined();
  });

  it('应该正确注册环境变量', () => {
    const container = createContainer({ env: 'prod' });
    const env = container.resolve(EnvToken);
    expect(env).toBe('prod');
  });

  it('应该正确注册单例服务', () => {
    const container = createContainer({ env: 'daily' });
    
    // 测试HttpService单例
    const httpService1 = container.resolve(HttpService);
    const httpService2 = container.resolve(HttpService);
    expect(httpService1).toBeInstanceOf(HttpService);
    expect(httpService1).toBe(httpService2); // 确保是单例
    
    // 测试WebSocketService单例
    const webSocketService1 = container.resolve(WebSocketService);
    const webSocketService2 = container.resolve(WebSocketService);
    expect(webSocketService1).toBeInstanceOf(WebSocketService);
    expect(webSocketService1).toBe(webSocketService2); // 确保是单例
  });

  it('应该正确注册业务层服务', () => {
    const container = createContainer({ env: 'daily' });
    
    const applicationFormService1 = container.resolve(ApplicationFormService);
    const applicationFormService2 = container.resolve(ApplicationFormService);
    expect(applicationFormService1).toBeInstanceOf(ApplicationFormService);
    expect(applicationFormService1).toBe(applicationFormService2); // 确保是单例
  });

  it('应该正确注入依赖', () => {
    const container = createContainer({ env: 'daily' });
    
    // 测试WebSocketService是否正确注入了HttpService和Env
    const webSocketService = container.resolve(WebSocketService);
    expect(webSocketService).toBeInstanceOf(WebSocketService);
    
    // 测试ApplicationFormService是否正确注入了HttpService
    const applicationFormService = container.resolve(ApplicationFormService);
    expect(applicationFormService).toBeInstanceOf(ApplicationFormService);
  });
});