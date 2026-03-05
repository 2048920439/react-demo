'use client'

import { useEffect, useMemo } from 'react'
import { createDI } from '../di/createdi/createDI'
import { MountableServicesToken } from '../di/createdi/token'
import { DIContext } from './_context'
import type { DIProviderProps } from './types'
import type { IMountable } from '../di/interface'

// ─── DIProvider ──────────────────────────────────────────────
// 职责：
//   1. 创建并持有 TSyringe 容器（useMemo 确保只创建一次）
//   2. 水合完成后（useEffect）统一驱动 Service 的 onMounted 生命周期
//
// 注意：
//   - 服务端渲染阶段 useMemo 会执行，但不执行 useEffect
//   - createDI 内部不能有浏览器 API，onMounted 里才能访问 localStorage 等
export const DIProvider = ({ children, env }: DIProviderProps) => {
    // ── 容器：渲染阶段初始化，整个生命周期不变 ──────────────────
    // eslint-disable-next-line react-hooks/exhaustive-deps
    const container = useMemo(() => createDI({ env }), [])

    // ── Context Value ──────────────────────────────────────────
    // eslint-disable-next-line react-hooks/exhaustive-deps
    const value = useMemo(() => ({ serviceContainer: container }), [])

    // ── 生命周期驱动：水合完成后统一调用 Service.onMounted ────────
    // 在这里调用而非各业务组件，保证初始化顺序统一且 Provider 职责清晰
    useEffect(() => {
        const services = container.resolve(MountableServicesToken) as IMountable[]
        services.forEach((s) => s.onMounted())
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return <DIContext.Provider value={value}>{children}</DIContext.Provider>
}
