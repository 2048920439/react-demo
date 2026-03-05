// ─── 环境类型 ───────────────────────────────────────────────
export type Env = 'daily' | 'pre' | 'prod'

// ─── HTTP 服务接口 ──────────────────────────────────────────
export interface IHttpService {
    get<T>(url: string): Promise<T>
    post<T, R>(url: string, data: T): Promise<R>
    put<T, R>(url: string, data: T): Promise<R>
    delete<T>(url: string): Promise<T>
}

// ─── WebSocket 服务接口 ─────────────────────────────────────
export interface IWebSocketService {
    connect(url: string): void
    subscribe(topic: string): void
    close(): void
}

// ─── Service 生命周期接口 ───────────────────────────────────
// 实现此接口的 Service 会在 DIProvider 水合后自动调用 onMounted
export interface IMountable {
    onMounted(): void | Promise<void>
}
