import { inject, injectable } from 'tsyringe'
import { BehaviorSubject, Subject } from 'rxjs'
import { HttpService } from './HttpService'
import type { IHttpService, IMountable } from '../interface'

// ─── 业务数据类型 ────────────────────────────────────────────
export interface ExampleItem {
    id: string
    name: string
}

// ─── ExampleService ─────────────────────────────────────────
// 演示：
//   - 通过 @inject 依赖 HttpService
//   - 用 BehaviorSubject 管理内部状态
//   - 实现 IMountable，由 DIProvider 驱动 onMounted
@injectable()
export class ExampleService implements IMountable {
    constructor(@inject(HttpService) private http: IHttpService) {}

    // ── 列表状态 ──────────────────────────────────────────────
    private _items$ = new BehaviorSubject<ExampleItem[]>([])
    readonly items$ = this._items$.asObservable()
    get items() {
        return this._items$.getValue()
    }

    // ── 加载状态 ──────────────────────────────────────────────
    private _loading$ = new BehaviorSubject(false)
    readonly loading$ = this._loading$.asObservable()

    // ── 事件流（副作用用，不携带状态） ───────────────────────────
    private _error$ = new Subject<Error>()
    readonly error$ = this._error$.asObservable()

    // ── 生命周期：DIProvider useEffect 中统一调用 ───────────────
    async onMounted() {
        // 1. 从持久化存储恢复数据（仅客户端）
        if (typeof window !== 'undefined') {
            const cached = localStorage.getItem('example-items')
            if (cached) {
                this._items$.next(JSON.parse(cached))
            }
        }
        // 2. 拉取最新数据
        await this.fetchItems()
    }

    // ── 业务方法 ──────────────────────────────────────────────
    async fetchItems() {
        this._loading$.next(true)
        try {
            const data = await this.http.get<ExampleItem[]>('/api/example')
            this._items$.next(data)
            // 持久化（仅客户端）
            if (typeof window !== 'undefined') {
                localStorage.setItem('example-items', JSON.stringify(data))
            }
        } catch (err) {
            this._error$.next(err as Error)
        } finally {
            this._loading$.next(false)
        }
    }

    // ── 销毁（可选，Provider unmount 时调用） ────────────────────
    destroy() {
        this._items$.complete()
        this._loading$.complete()
        this._error$.complete()
    }
}
