import { DemoContextProvider, useStore } from '@/context'
import { Env } from '@/di'
import React from 'react'
import { describe, test, expect } from 'vitest'
import { renderHook, act } from '@testing-library/react'

// 创建测试环境配置
const testEnv: Env = 'daily'

describe('Context Store Tests', () => {
  test('should share the same store instance within the same provider', () => {
    // 创建测试用的包装组件
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <DemoContextProvider env={testEnv}>
        {children}
      </DemoContextProvider>
    )

    // 初始化用户信息
    const testUserInfo = {
      name: 'John Doe',
      age: 30,
      sex: 'male'
    }

    // 在同一个provider中初始化用户信息
    act(() => {
      const { result } = renderHook(
        () => {
          const initUserInfo = useStore(state => state.initUserInfo);
          return { initUserInfo };
        }, 
        { wrapper }
      );
      result.current.initUserInfo(testUserInfo);
    })

    // 在同一个provider中验证状态更新
    const { result } = renderHook(() => useStore(state => state.userInfo), { wrapper })
    expect(result.current).toEqual(testUserInfo)
  })

  test('should have separate store instances for different providers', () => {
    // 创建两个不同的包装组件实例
    const wrapper1 = ({ children }: { children: React.ReactNode }) => (
      <DemoContextProvider env={testEnv}>
        {children}
      </DemoContextProvider>
    )

    const wrapper2 = ({ children }: { children: React.ReactNode }) => (
      <DemoContextProvider env={testEnv}>
        {children}
      </DemoContextProvider>
    )

    // 在第一个provider中初始化用户信息
    const testUserInfo1 = {
      name: 'John Doe',
      age: 30,
      sex: 'male'
    }

    act(() => {
      const { result } = renderHook(
        () => {
          const initUserInfo = useStore(state => state.initUserInfo);
          return { initUserInfo };
        }, 
        { wrapper: wrapper1 }
      );
      result.current.initUserInfo(testUserInfo1);
    })

    // 在第二个provider中初始化不同的用户信息
    const testUserInfo2 = {
      name: 'Jane Smith',
      age: 25,
      sex: 'female'
    }

    act(() => {
      const { result } = renderHook(
        () => {
          const initUserInfo = useStore(state => state.initUserInfo);
          return { initUserInfo };
        }, 
        { wrapper: wrapper2 }
      );
      result.current.initUserInfo(testUserInfo2);
    })

    // 验证两个provider有不同的状态
    const { result: result1 } = renderHook(() => useStore(state => state.userInfo), { wrapper: wrapper1 })
    const { result: result2 } = renderHook(() => useStore(state => state.userInfo), { wrapper: wrapper2 })

    expect(result1.current).toEqual(testUserInfo1)
    expect(result2.current).toEqual(testUserInfo2)
    expect(result1.current).not.toEqual(result2.current)
  })

  test('should update partial user info correctly', () => {
    // 创建测试用的包装组件
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <DemoContextProvider env={testEnv}>
        {children}
      </DemoContextProvider>
    )

    // 初始化用户信息
    const testUserInfo = {
      name: 'John Doe',
      age: 30,
      sex: 'male'
    }

    // 初始化用户信息
    act(() => {
      const { result } = renderHook(
        () => {
          const initUserInfo = useStore(state => state.initUserInfo);
          return { initUserInfo };
        }, 
        { wrapper }
      );
      result.current.initUserInfo(testUserInfo);
    })

    // 更新部分用户信息
    act(() => {
      const { result } = renderHook(
        () => {
          const updateUserInfo = useStore(state => state.updateUserInfo);
          return { updateUserInfo };
        }, 
        { wrapper }
      );
      result.current.updateUserInfo({ age: 31, company: 'Test Company' });
    })

    // 验证状态更新
    const { result } = renderHook(() => useStore(state => state.userInfo), { wrapper })
    expect(result.current).toEqual({
      name: 'John Doe',
      age: 31,
      sex: 'male',
      company: 'Test Company'
    })
  })

  test('should throw error when updating uninitialized user info', () => {
    // 创建测试用的包装组件
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <DemoContextProvider env={testEnv}>
        {children}
      </DemoContextProvider>
    )

    // 确保store是初始状态
    expect(() => {
      act(() => {
        const { result } = renderHook(
          () => {
            const updateUserInfo = useStore(state => state.updateUserInfo);
            return { updateUserInfo };
          }, 
          { wrapper }
        );
        result.current.updateUserInfo({ name: 'New Name' });
      });
    }).toThrow('User info is not set');
  })
})