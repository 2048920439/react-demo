'use client'

import { useContext } from 'react'
import type { InjectionToken } from 'tsyringe'
import { DIContext } from './_context'

// ─── 内部 hook ───────────────────────────────────────────────
function useDIContext() {
    const ctx = useContext(DIContext)
    if (!ctx)
        throw new Error('Missing DIProvider: make sure components are wrapped in <DIProvider>')
    return ctx
}

// ─── useService ──────────────────────────────────────────────
// 从 TSyringe 容器中 resolve Service 实例
// 注意：只能在 'use client' 组件中使用，且必须在 DIProvider 子树内
export function useService<T>(token: InjectionToken<T>): T {
    const { serviceContainer } = useDIContext()

    if (!serviceContainer.isRegistered(token)) {
        const name = (token as { name?: string }).name ?? token.toString()
        throw new Error(`Service "${name}" is not registered in the DI container`)
    }

    return serviceContainer.resolve(token)
}
