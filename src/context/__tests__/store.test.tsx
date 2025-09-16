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
    let initUserInfo: (info: any) => void;
    
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

    // 在同一个provider中初始化用户信息并在同一次renderHook调用中完成
    const { result, rerender } = renderHook(() => {
      const userInfo = useStore(state => state.userInfo);
      initUserInfo = useStore(state => state.initUserInfo);
      return userInfo;
    }, { wrapper });
    
    act(() => {
      initUserInfo(testUserInfo);
    })
    
    // 重新渲染以获取更新后的状态
    rerender();
    expect(result.current).toEqual(testUserInfo)
  })

  test('should have separate store instances for different providers', () => {
    // 创建两个不同的包装组件实例
    let initUserInfo1: (info: any) => void;
    let initUserInfo2: (info: any) => void;
    
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

    const { result: result1, rerender: rerender1 } = renderHook(() => {
      const userInfo = useStore(state => state.userInfo);
      initUserInfo1 = useStore(state => state.initUserInfo);
      return userInfo;
    }, { wrapper: wrapper1 });
    
    act(() => {
      initUserInfo1(testUserInfo1);
    })
    
    rerender1();

    // 在第二个provider中初始化不同的用户信息
    const testUserInfo2 = {
      name: 'Jane Smith',
      age: 25,
      sex: 'female'
    }

    const { result: result2, rerender: rerender2 } = renderHook(() => {
      const userInfo = useStore(state => state.userInfo);
      initUserInfo2 = useStore(state => state.initUserInfo);
      return userInfo;
    }, { wrapper: wrapper2 });
    
    act(() => {
      initUserInfo2(testUserInfo2);
    })
    
    rerender2();

    // 验证两个provider有不同的状态
    expect(result1.current).toEqual(testUserInfo1)
    expect(result2.current).toEqual(testUserInfo2)
    expect(result1.current).not.toEqual(result2.current)
  })

  test('should update partial user info correctly', () => {
    // 创建测试用的包装组件
    let initUserInfo: (info: any) => void;
    let updateUserInfo: (info: any) => void;
    
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

    // 在同一次renderHook调用中完成初始化和更新操作
    const { result, rerender } = renderHook(() => {
      const userInfo = useStore(state => state.userInfo);
      initUserInfo = useStore(state => state.initUserInfo);
      updateUserInfo = useStore(state => state.updateUserInfo);
      return userInfo;
    }, { wrapper });
    
    // 初始化用户信息
    act(() => {
      initUserInfo(testUserInfo);
    })
    
    rerender();

    // 更新部分用户信息
    act(() => {
      updateUserInfo({ age: 31, company: 'Test Company' });
    })
    
    rerender();

    // 验证状态更新
    expect(result.current).toEqual({
      name: 'John Doe',
      age: 31,
      sex: 'male',
      company: 'Test Company'
    })
  })

  test('should throw error when updating uninitialized user info', () => {
    // 创建测试用的包装组件
    let updateUserInfo: (info: any) => void;
    
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <DemoContextProvider env={testEnv}>
        {children}
      </DemoContextProvider>
    )

    // 确保store是初始状态
    const { rerender } = renderHook(() => {
      updateUserInfo = useStore(state => state.updateUserInfo);
      return useStore(state => state.userInfo);
    }, { wrapper });

    rerender();
    
    expect(() => {
      act(() => {
        updateUserInfo({ name: 'New Name' });
      });
    }).toThrow('User info is not set');
  })
})