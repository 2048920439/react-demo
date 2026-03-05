import { container, DependencyContainer } from 'tsyringe'
import { EnvToken, MountableServicesToken } from './token'
import { HttpService, WebSocketService, ExampleService } from '../services'
import type { Env } from '../interface'

export interface CreateDIConfig {
    env: Env
}

// ─── 容器工厂 ────────────────────────────────────────────────
// 每次调用创建一个独立子容器，Provider 间状态完全隔离
// 服务端渲染时不会触发 onMounted，onMounted 由客户端 DIProvider 驱动
export const createDI = (config: CreateDIConfig): DependencyContainer => {
    const c = container.createChildContainer()

    // ── 环境变量 ─────────────────────────────────────────────
    c.register(EnvToken, { useValue: config.env })

    // ── 基础服务（单例） ──────────────────────────────────────
    c.registerSingleton(HttpService, HttpService)
    c.registerSingleton(WebSocketService, WebSocketService)

    // ── 业务服务（单例） ──────────────────────────────────────
    c.registerSingleton(ExampleService, ExampleService)

    // ── 注册 Mountable Services ──────────────────────────────
    // 按需添加实现了 IMountable 的 Service
    // DIProvider 会在水合后依次调用它们的 onMounted
    c.register(MountableServicesToken, {
        useValue: [
            c.resolve(ExampleService),
            // 继续追加其他需要 onMounted 的 Service...
        ],
    })

    return c
}
