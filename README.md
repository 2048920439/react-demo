# React 代码片段仓库

一个收集有趣 React/TypeScript 代码片段的个人仓库，包含一些实用的自定义 Hooks 和组件实现。

## 🚀 技术栈

- React 19 + TypeScript + Vite
- SCSS Modules
- ESLint

## ✨ 有趣的代码片段

### 🪝 自定义 Hooks
- **useBinaryState**: 基于位运算的状态管理 Hook，支持多状态的高效存储和操作
- **useDebounce**: 防抖处理
- **useDrop**: 拖拽功能实现
- **useEventAway**: 检测点击外部区域
- **use-popup**: 弹窗状态管理

### 🎨 组件实现
- **Button组件**: 支持多种样式、尺寸和加载状态的按钮组件
- **LoadingIcon**: 自定义加载动画

### 🛠️ 工具函数
- **动画工具**: 数值动画和缓动函数实现
- **通用工具**: 数字处理、对象操作、Promise 封装等

## 🚀 运行项目

```bash
# 安装依赖
pnpm install

# 启动开发服务器
pnpm dev

# 构建项目
pnpm build
```

## 📝 使用示例

### useBinaryState Hook
```typescript
import { useBinaryState } from '@/hooks/useBinaryState'

function App() {
  const [state, action] = useBinaryState<number>(0)
  
  const handleClick = () => {
    action.addState(4) // 添加状态
  }
  
  return (
    <div onClick={handleClick}>
      当前状态: {state}
    </div>
  )
}
```

## 📂 目录结构

```
src/
├── components/     # 组件实现
├── hooks/         # 自定义 Hooks
├── utils/         # 工具函数
└── styles/        # 样式文件
```

---

> 这个仓库主要用于记录和分享一些有趣的前端代码实现，欢迎参考和学习！