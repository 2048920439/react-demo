import { Env } from '@/di'
import React from 'react'
import { describe, test, expect } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { DemoContextProvider } from '@/context'
import { useService, useStore } from '@/context/hooks'
import { HttpService } from '@/di/services'

// 创建测试环境配置
const testEnv: Env = 'daily'

/**
 * Context模块集成测试
 * 
 * 验证以下核心功能：
 * 1. 同一Provider实例中store实例的共享
 * 2. 状态在重新渲染时的保持
 * 3. 不同Provider实例间的状态隔离
 * 4. 服务解析功能
 * 5. 错误处理
 */
describe('Context Module Integration Tests', () => {
  /**
   * 验证在同一Provider实例中，多次调用useStore共享同一个store实例
   */
  test('should share store instance within same provider', () => {
    // 创建测试用的包装组件
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <DemoContextProvider env={testEnv}>
        {children}
      </DemoContextProvider>
    )

    // 在renderHook的回调中调用两次useStore来验证同上下文中store是否共用实例
    const { result } = renderHook(() => {
      const initUserInfo = useStore(state => state.initUserInfo)
      const userInfo = useStore(state => state.userInfo)
      return { initUserInfo, userInfo }
    }, { wrapper })

    // 初始化用户信息
    const testUserInfo = {
      name: 'John Doe',
      age: 30,
      sex: 'male'
    }

    act(() => {
      result.current.initUserInfo(testUserInfo)
    })

    // 验证状态更新（在同一renderHook回调中调用的useStore应该能获取到更新后的状态）
    expect(result.current.userInfo).toEqual(testUserInfo)
  })

  /**
   * 验证状态在组件重新渲染时的保持
   */
  test('should maintain state across component re-renders', () => {
    // 创建测试用的包装组件
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <DemoContextProvider env={testEnv}>
        {children}
      </DemoContextProvider>
    )

    // 使用单个renderHook实例进行测试
    const { result, rerender } = renderHook(() => {
      const initUserInfo = useStore(state => state.initUserInfo)
      const userInfo = useStore(state => state.userInfo)
      return { initUserInfo, userInfo }
    }, { wrapper })

    // 初始化用户信息
    const testUserInfo = {
      name: 'John Doe',
      age: 30,
      sex: 'male'
    }

    act(() => {
      result.current.initUserInfo(testUserInfo)
    })

    // 验证状态更新
    expect(result.current.userInfo).toEqual(testUserInfo)

    // 重新渲染组件
    rerender()

    // 验证状态在重新渲染后仍然存在
    expect(result.current.userInfo).toEqual(testUserInfo)
  })

  /**
   * 验证状态更新功能和状态保持
   */
  test('should update state and maintain it across re-renders', () => {
    // 创建测试用的包装组件
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <DemoContextProvider env={testEnv}>
        {children}
      </DemoContextProvider>
    )

    // 使用单个renderHook实例进行测试
    const { result, rerender } = renderHook(() => {
      const initUserInfo = useStore(state => state.initUserInfo)
      const updateUserInfo = useStore(state => state.updateUserInfo)
      const userInfo = useStore(state => state.userInfo)
      return { initUserInfo, updateUserInfo, userInfo }
    }, { wrapper })

    // 初始化用户信息
    const testUserInfo = {
      name: 'John Doe',
      age: 30,
      sex: 'male'
    }

    act(() => {
      result.current.initUserInfo(testUserInfo)
    })

    // 验证初始状态更新
    expect(result.current.userInfo).toEqual(testUserInfo)

    // 更新用户信息
    act(() => {
      result.current.updateUserInfo({ age: 31, company: 'Test Company' })
    })

    // 验证状态更新
    const updatedUserInfo = {
      name: 'John Doe',
      age: 31,
      sex: 'male',
      company: 'Test Company'
    }
    expect(result.current.userInfo).toEqual(updatedUserInfo)

    // 重新渲染组件
    rerender()

    // 验证状态在重新渲染后仍然存在
    expect(result.current.userInfo).toEqual(updatedUserInfo)
  })

  /**
   * 验证不同Provider实例间的状态隔离
   * 
   * 通过使用不同的key属性创建两个独立的Provider实例，
   * 并在每个实例中维护独立的状态，验证状态隔离功能。
   */
  test('should isolate state between different provider instances', () => {
    // 使用不同的key属性创建两个独立的Provider实例
    const wrapper1 = ({ children }: { children: React.ReactNode }) => (
      <DemoContextProvider key="provider1" env={testEnv}>
        {children}
      </DemoContextProvider>
    )

    const wrapper2 = ({ children }: { children: React.ReactNode }) => (
      <DemoContextProvider key="provider2" env={testEnv}>
        {children}
      </DemoContextProvider>
    )

    // 在第一个provider中初始化用户信息
    const testUserInfo1 = {
      name: 'John Doe',
      age: 30,
      sex: 'male'
    }

    // 使用同一个renderHook实例来确保操作在同一个Provider上下文中进行
    const { result: result1, rerender: rerender1 } = renderHook(
      () => ({
        initUserInfo: useStore(state => state.initUserInfo),
        userInfo: useStore(state => state.userInfo)
      }), 
      { wrapper: wrapper1 }
    );

    act(() => {
      result1.current.initUserInfo(testUserInfo1);
    });

    // 在第二个provider中初始化不同的用户信息
    const testUserInfo2 = {
      name: 'Jane Smith',
      age: 25,
      sex: 'female'
    }

    const { result: result2, rerender: rerender2 } = renderHook(
      () => ({
        initUserInfo: useStore(state => state.initUserInfo),
        userInfo: useStore(state => state.userInfo)
      }), 
      { wrapper: wrapper2 }
    );

    act(() => {
      result2.current.initUserInfo(testUserInfo2);
    });

    // 验证两个provider有不同的状态
    // 重新渲染以确保获取最新状态
    rerender1();
    rerender2();

    expect(result1.current.userInfo).toEqual(testUserInfo1);
    expect(result2.current.userInfo).toEqual(testUserInfo2);
    expect(result1.current.userInfo).not.toEqual(result2.current.userInfo);
  })

  /**
   * 验证未初始化时更新用户信息会抛出错误
   */
  test('should throw error when updating uninitialized user info', () => {
    // 创建测试用的包装组件
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <DemoContextProvider env={testEnv}>
        {children}
      </DemoContextProvider>
    )

    // 获取更新用户信息的函数
    const { result: updateResult } = renderHook(() => {
      return useStore(state => state.updateUserInfo)
    }, { wrapper })

    // 尝未初始化就更新用户信息，应该抛出错误
    expect(() => {
      act(() => {
        updateResult.current({ name: 'New Name' })
      })
    }).toThrow('User info is not set')
  })

  /**
   * 验证能够从依赖注入容器中正确获取已注册的服务
   */
  test('should resolve registered services from DI container', () => {
    // 创建测试用的包装组件
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <DemoContextProvider env={testEnv}>
        {children}
      </DemoContextProvider>
    )

    // 获取HttpService服务
    const { result } = renderHook(() => {
      return useService(HttpService)
    }, { wrapper })

    // 验证服务实例正确获取
    expect(result.current).toBeInstanceOf(HttpService)
  })

  /**
   * 验证请求未注册的服务时会抛出错误
   */
  test('should throw error when requesting unregistered service', () => {
    // 创建测试用的包装组件
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <DemoContextProvider env={testEnv}>
        {children}
      </DemoContextProvider>
    )

    // 创建一个未注册的服务类
    class UnregisteredService {}

    // 尝试获取未注册的服务，应该抛出错误
    expect(() => {
      renderHook(() => {
        return useService(UnregisteredService)
      }, { wrapper })
    }).toThrow('Service UnregisteredService not registered')
  })
})