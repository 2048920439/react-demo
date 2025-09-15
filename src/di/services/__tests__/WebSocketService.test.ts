import { EnvToken } from '@/di'
import { HttpService, WebSocketService } from '@/di/services'
import { container } from 'tsyringe'
import { beforeEach, describe, expect, it, vi } from 'vitest'

describe('WebSocketService', () => {
  let webSocketService: WebSocketService;
  let testContainer: ReturnType<typeof container.createChildContainer>;

  beforeEach(() => {
    // 创建测试容器
    testContainer = container.createChildContainer();
    testContainer.register(EnvToken, { useValue: 'daily' });
    testContainer.registerSingleton(HttpService);
    testContainer.registerSingleton(WebSocketService);
    webSocketService = testContainer.resolve(WebSocketService);
  });

  it('应该正确实例化WebSocketService', () => {
    expect(webSocketService).toBeInstanceOf(WebSocketService);
  });

  it('应该正确执行connect方法', () => {
    const consoleSpy = vi.spyOn(console, 'log');
    webSocketService.connect('ws://localhost:8080');
    expect(consoleSpy).toHaveBeenCalledWith('connect', {
      url: 'ws://localhost:8080',
      env: 'daily',
      http: expect.any(HttpService)
    });
    consoleSpy.mockRestore();
  });

  it('应该正确执行subscribe方法', () => {
    const consoleSpy = vi.spyOn(console, 'log');
    webSocketService.subscribe('test-topic');
    expect(consoleSpy).toHaveBeenCalledWith('subscribe', {
      topic: 'test-topic',
      env: 'daily',
      http: expect.any(HttpService)
    });
    consoleSpy.mockRestore();
  });

  it('应该正确执行close方法', () => {
    const consoleSpy = vi.spyOn(console, 'log');
    webSocketService.close();
    expect(consoleSpy).toHaveBeenCalledWith('close', {
      env: 'daily',
      http: expect.any(HttpService)
    });
    consoleSpy.mockRestore();
  });
});