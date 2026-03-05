// ─── 使用示例 ─────────────────────────────────────────────────
// 此文件仅作为架构使用说明，不参与实际构建

/*
=============================================================
  1. 在 layout.tsx 中挂载 DIProvider
=============================================================

  // app/layout.tsx（Server Component）
  import { DIProvider } from '../context'

  export default function Layout({ children }) {
    const env = process.env.NEXT_PUBLIC_APP_ENV  // 'daily' | 'pre' | 'prod'
    return (
      <DIProvider env={env}>
        {children}
      </DIProvider>
    )
  }

  说明：
  - DIProvider 是 'use client' 组件，但 children 里的 Server Component 不受影响
  - 服务端渲染时 useMemo 初始化容器，useEffect 不执行
  - 客户端水合后 useEffect 执行，统一调用所有 Service 的 onMounted

=============================================================
  2. 在 Client Component 中使用 Service
=============================================================

  // components/ExampleList.tsx
  'use client'

  import { useService } from '../context'
  import { useObservableValue, useObservable } from '../context'
  import { ExampleService } from '../di/services'

  export function ExampleList() {
    const service = useService(ExampleService)

    // 订阅 BehaviorSubject 状态（响应式，传初始值避免首帧闪烁）
    const items = useObservableValue(service.items$, service.items)
    const loading = useObservableValue(service.loading$, false)

    // 订阅事件流（纯副作用，不触发重渲染）
    useObservable(service.error$, (err) => {
      console.error('加载失败', err)
    })

    if (loading) return <div>加载中...</div>

    return (
      <ul>
        {items.map(item => (
          <li key={item.id}>{item.name}</li>
        ))}
      </ul>
    )
  }

=============================================================
  3. Service 间依赖（通过构造函数注入）
=============================================================

  // di/services/OrderService.ts
  @injectable()
  export class OrderService implements IMountable {
    constructor(
      @inject(HttpService) private http: IHttpService,
      @inject(ExampleService) private exampleService: ExampleService
    ) {}

    async onMounted() {
      // 依赖 ExampleService 的数据
      const items = this.exampleService.items
      console.log('订单初始化，当前商品数量:', items.length)
    }
  }

  // di/createdi/createDI.ts - 注册新 Service
  c.registerSingleton(OrderService, OrderService)
  c.register(MountableServicesToken, {
    useValue: [
      c.resolve(ExampleService),
      c.resolve(OrderService),   // 追加
    ],
  })

=============================================================
  4. 架构总览
=============================================================

  DIProvider ('use client')
  └── TSyringe Container（createDI 创建）
      ├── HttpService（基础层）
      ├── WebSocketService（基础层）
      └── ExampleService（业务层）
          ├── items$: BehaviorSubject  ← 业务状态
          ├── loading$: BehaviorSubject
          └── error$: Subject          ← 事件流

  职责边界：
  - Service.BehaviorSubject → 业务状态（跟着 Service 生命周期）
  - useObservableValue → BehaviorSubject 映射到 React 状态
  - useObservable → 事件流副作用（不触发重渲染）
  - useService → resolve Service 实例

*/

export {}
