import { EnvToken } from '@/di'
import { ApplicationFormData, ApplicationFormService, HttpService } from '@/di/services'
import { container } from 'tsyringe'
import { beforeEach, describe, expect, it, vi } from 'vitest'

describe('ApplicationFormService', () => {
  let applicationFormService: ApplicationFormService;
  let testContainer: ReturnType<typeof container.createChildContainer>;

  beforeEach(() => {
    // 创建测试容器
    testContainer = container.createChildContainer();
    // 注册所有必需的依赖
    testContainer.register(EnvToken, { useValue: 'daily' });
    testContainer.registerSingleton(HttpService);
    testContainer.registerSingleton(ApplicationFormService);
    applicationFormService = testContainer.resolve(ApplicationFormService);
  });

  it('应该正确实例化ApplicationFormService', () => {
    expect(applicationFormService).toBeInstanceOf(ApplicationFormService);
  });

  it('应该有默认的表单数据', () => {
    const initialData = applicationFormService['FormDataChangeEvent'];
    expect(initialData).toBeDefined();
  });

  it('应该能够更新表单数据', () => {
    const newData: ApplicationFormData = {
      username: 'testuser',
      sex: 1,
      age: 25
    };

    // 订阅变化
    let receivedData: ApplicationFormData | undefined;
    const subscription = applicationFormService.FormDataChangeEvent.subscribe((data: ApplicationFormData) => {
      receivedData = data;
    });

    // 更新数据
    applicationFormService.updateFromDate(newData);
    
    expect(receivedData).toEqual(newData);
    subscription.unsubscribe();
  });

  it('应该能够提交表单数据', async () => {
    const testData: ApplicationFormData = {
      username: 'testuser',
      sex: 1,
      age: 25
    };

    // Mock HttpService的post方法
    const httpService = testContainer.resolve(HttpService);
    const postSpy = vi.spyOn(httpService, 'post').mockResolvedValue('success');

    // 更新数据
    applicationFormService.updateFromDate(testData);

    // 提交表单
    const result = await applicationFormService.submit();

    expect(postSpy).toHaveBeenCalledWith('/api/application-form', testData);
    expect(result).toBe('success');

    postSpy.mockRestore();
  });
});