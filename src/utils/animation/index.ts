/**
 * 动画工具库
 *
 * 提供完整的前端动画解决方案，包括：
 * - 三次贝塞尔曲线计算
 * - 预计算查找表优化
 * - 智能缓存管理
 * - 高性能数值过渡动画
 * - CSS 缓动函数支持
 * - 可配置的动画调度器
 *
 * @example
 * import { animateValue, EASING_PRESETS, FixedFPSScheduler } from '@/utils/animation';
 *
 * // 创建平滑的数值动画（使用默认调度器）
 * const cancel = animateValue({
 *   startValue: 0,
 *   endValue: 100,
 *   duration: 1000,
 *   easing: 'ease-in-out'
 * }, (status) => {
 *   console.log(`进度: ${status.progress}, 值: ${status.value}`);
 * });
 *
 * @example
 * // 使用自定义调度器控制动画性能
 * const fps30Scheduler = new FixedFPSScheduler(30); // 30fps 调度器
 * const cancel = animateValue({
 *   startValue: 0,
 *   endValue: 100,
 *   duration: 1000,
 *   easing: 'ease-in-out',
 *   scheduler: fps30Scheduler
 * }, callback);
 */

// 导出类型定义
export type * from './types';

// 导出常量配置
export { EASING_PRESETS } from './constants';

// 导出核心算法
export { calculateBezierComponent, cubicBezier } from './core';

// 导出查找表功能和缓存管理
export { BezierLookup } from './BezierLookup';
export { BezierLookupCache } from './BezierLookupCache';

// 导出主要动画函数
export { animateValue } from './animateValue';

// 导出调度器相关
export * from './schedulers';
