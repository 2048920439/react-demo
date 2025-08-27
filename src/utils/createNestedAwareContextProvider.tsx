import { objectToOrderedArray, omit } from '@/utils/object';
import { useUpdateEffect } from 'ahooks';
import { Context, FC, PropsWithChildren, ReactElement, useContext } from 'react';

/**
 * 嵌套感知上下文提供者工厂函数的配置选项
 */
export interface NestedAwareContextOptions<TProps> {
  /** 上下文实例 */
  context: Context<any>;
  /** 错误提示消息生成函数 */
  getErrorMessage?: (componentName: string) => string;
  /** 组件名称，用于错误提示 */
  componentName: string;
  /** 需要从 props 中排除的属性名称，children 会自动添加 */
  excludeProps?: Array<keyof TProps>;
}

/**
 * 创建嵌套感知上下文提供者的工厂函数
 *
 * 生成的组件具有嵌套感知和父级优先特性：
 * - 自动检测是否存在父级上下文
 * - 如果存在父级上下文，直接使用父级设置（子级 props 被父级覆盖）
 * - 如果不存在，创建新的上下文实例
 * - 在开发环境下监控 props 变化并提供错误提示
 *
 * @param options 配置选项
 * @param ProviderImplementation 内层实现组件，包含完整的上下文逻辑
 * @returns 嵌套感知的上下文提供者组件
 *
 * @example
 * ```typescript
 * // 定义内层实现组件
 * const MyContextProviderInternal = ({ children, value }) => (
 *   <MyContext.Provider value={value}>{children}</MyContext.Provider>
 * );
 *
 * // 使用工厂函数创建嵌套感知提供者
 * export const MyContextProvider = createNestedAwareContextProvider(
 *   {
 *     context: MyContext,
 *     componentName: 'MyContextProvider',
 *     // excludeProps 可选，children 会自动被添加
 *     // excludeProps: ['someOtherProp'] // 仅在需要排除其他属性时指定
 *   },
 *   MyContextProviderInternal
 * );
 * ```
 */
export function createNestedAwareContextProvider<TProps>(
  options: NestedAwareContextOptions<TProps>,
  ProviderImplementation: FC<PropsWithChildren<TProps>>,
): FC<PropsWithChildren<TProps>> {
  const { context, getErrorMessage, componentName, excludeProps = [] } = options;

  // 静默添加 'children' 到 excludeProps 中，确保它总是被排除
  const finalExcludeProps = [...new Set([...excludeProps, 'children' as keyof TProps])];

  const defaultGetErrorMessage = (name: string) =>
    `[${name}] 检测到 props 变化，但由于存在父级上下文，修改无效。请在父级 ${name} 中修改相关参数。`;

  const errorMessageGenerator = getErrorMessage || defaultGetErrorMessage;

  return function NestedAwareContextProvider(props: PropsWithChildren<TProps>) {
    const { children } = props;

    // 检查是否已存在父级上下文
    const existingContext = Boolean(useContext(context));

    // 提取非排除属性的值用于依赖项比较
    const propsValues = objectToOrderedArray(omit(props, finalExcludeProps)).map(([, value]) => value);

    useUpdateEffect(() => {
      if (!existingContext) return;

      const errorMessage = errorMessageGenerator(componentName);

      // mock dev
      const isDev = false

      if (isDev) {
        throw new Error(errorMessage);
      } else {
        console.warn(errorMessage);
      }
    }, [existingContext, ...propsValues]);

    // 如果外层已经存在上下文，则直接透传父级上下文的信息
    if (existingContext) {
      return children as ReactElement;
    }

    // 如果没有父级上下文，则创建新的上下文
    return <ProviderImplementation {...props} />;
  };
}
