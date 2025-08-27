/**
 * 动画工具库
 *
 * 提供完整的前端动画解决方案，包括：
 * - 三次贝塞尔曲线计算
 * - 预计算查找表优化
 * - 智能缓存管理
 * - 高性能数值过渡动画
 * - CSS 缓动函数支持
 *
 * @example
 * import { animateValue, EASING_PRESETS } from '@/utils/animation';
 *
 * // 创建平滑的数值动画
 * const cancel = animateValue({
 *   startValue: 0,
 *   endValue: 100,
 *   duration: 1000,
 *   easing: 'ease-in-out'
 * }, (status) => {
 *   console.log(`进度: ${status.progress}, 值: ${status.value}`);
 * });
 */

// 导出类型定义
export type * from './types';

// 导出常量配置
export { EASING_PRESETS } from './constants';

// 导出核心算法
export { cubicBezier, calculateBezierComponent } from './core';

// 导出查找表功能和缓存管理
export { createBezierLookup, BezierLookupCache } from './lookup';

// 导出主要动画函数
export { animateValue } from './animateValue';
