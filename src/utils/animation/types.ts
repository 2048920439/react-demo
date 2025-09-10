import type { AnimationScheduler } from './schedulers/types';

/**
 * 动画模块类型定义
 */

/**
 * CSS 缓动函数预设类型
 */
export type EasingPreset = 'linear' | 'ease' | 'ease-in' | 'ease-out' | 'ease-in-out';

/**
 * 贝塞尔曲线控制点
 * 标准格式：[x1, y1, x2, y2]，其中 x1, x2 ∈ [0, 1]，y1, y2 可以超出范围实现弹性效果
 */
export type BezierCurve = readonly [x1: number, y1: number, x2: number, y2: number];

/**
 * 缓动函数，支持 CSS 关键字或自定义贝塞尔曲线
 */
export type EasingFunction = EasingPreset | BezierCurve;

/**
 * 动画状态信息
 */
export interface AnimationStatus {
  /** 当前动画值 */
  value: number;
  /** 动画进度，取值范围 [0, 1] */
  progress: number;
  /** 是否已完成 */
  isCompleted: boolean;
  /** 已经过的时间（毫秒） */
  elapsed: number;
}

/**
 * 动画配置参数
 */
export interface AnimateValueOptions {
  /** 动画起始值 */
  startValue: number;
  /** 动画结束值 */
  endValue: number;
  /** 缓动函数，支持 CSS 关键字或自定义贝塞尔曲线（可选，默认为 'linear'） */
  easing?: EasingFunction;
  /** 动画时长（毫秒） */
  duration: number;
  /** 自定义调度器（可选，默认使用 requestAnimationFrame） */
  scheduler?: AnimationScheduler;
}

/**
 * 贝塞尔查找表接口
 */
export interface BezierLookupTable {
  /** 快速获取贝塞尔曲线值（O(1) 时间复杂度） */
  getValue: (t: number) => number;
  /** 获取预计算的数组（用于调试或其他用途） */
  getPrecomputedArray: () => number[];
  /** 获取精度设置 */
  getPrecision: () => number;
}
