import { EnvToken } from '@/di'
import { HttpService } from '@/di/services'
import { container } from 'tsyringe'
import { beforeEach, describe, expect, it, vi } from 'vitest'

describe('HttpService', () => {
  let httpService: HttpService;
  let testContainer: ReturnType<typeof container.createChildContainer>;

  beforeEach(() => {
    // 创建测试容器
    testContainer = container.createChildContainer();
    testContainer.register(EnvToken, { useValue: 'daily' });
    testContainer.registerSingleton(HttpService);
    httpService = testContainer.resolve(HttpService);
  });

  it('应该正确实例化HttpService', () => {
    expect(httpService).toBeInstanceOf(HttpService);
  });

  it('应该正确执行GET请求', async () => {
    const consoleSpy = vi.spyOn(console, 'log');
    const result = await httpService.get('/test');
    expect(consoleSpy).toHaveBeenCalledWith('get request', { env: 'daily', url: '/test' });
    expect(result).toBe('get');
    consoleSpy.mockRestore();
  });

  it('应该正确执行POST请求', async () => {
    const consoleSpy = vi.spyOn(console, 'log');
    const testData = { name: 'test' };
    const result = await httpService.post('/test', testData);
    expect(consoleSpy).toHaveBeenCalledWith('post request', { env: 'daily', url: '/test', data: testData });
    expect(result).toBe('post');
    consoleSpy.mockRestore();
  });

  it('应该正确执行PUT请求', async () => {
    const consoleSpy = vi.spyOn(console, 'log');
    const testData = { name: 'test' };
    const result = await httpService.put('/test', testData);
    expect(consoleSpy).toHaveBeenCalledWith('put request', { env: 'daily', url: '/test', data: testData });
    expect(result).toBe('put');
    consoleSpy.mockRestore();
  });

  it('应该正确执行DELETE请求', async () => {
    const consoleSpy = vi.spyOn(console, 'log');
    const result = await httpService.delete('/test');
    expect(consoleSpy).toHaveBeenCalledWith('delete request', { env: 'daily', url: '/test' });
    expect(result).toBe('delete');
    consoleSpy.mockRestore();
  });
});