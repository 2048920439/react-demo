import type { BezierCurve, EasingPreset } from './types';

/**
 * 动画精度配置常量
 */
export const PRECISION_CONFIG = {
  /** 默认查找表精度 */
  DEFAULT_LOOKUP_PRECISION: 1000,
} as const;

/**
 * 贝塞尔曲线计算常量
 */
export const BEZIER_CONFIG = {
  /** 二分法最大迭代次数 */
  MAX_BINARY_SEARCH_ITERATIONS: 20,
  /** 计算精度阈值 */
  CALCULATION_PRECISION_THRESHOLD: 0.0001,
  /** 三次贝塞尔曲线系数 */
  CUBIC_BEZIER_COEFFICIENT: 3,
  /** 二分法初始中点值 */
  BINARY_SEARCH_INITIAL_MID: 0.5,
} as const;

/**
 * 动画边界值常量
 */
export const ANIMATION_BOUNDS = {
  /** 时间参数最小值 */
  TIME_PARAMETER_MIN: 0,
  /** 时间参数最大值 */
  TIME_PARAMETER_MAX: 1,
  /** 动画进度完成阈值 */
  ANIMATION_PROGRESS_COMPLETE: 1,
} as const;

/**
 * CSS 缓动函数预设
 */
export const EASING_PRESETS: Record<EasingPreset, BezierCurve> = {
  linear: [0, 0, 1, 1],
  ease: [0.25, 0.1, 0.25, 1],
  'ease-in': [0.42, 0, 1, 1],
  'ease-out': [0, 0, 0.58, 1],
  'ease-in-out': [0.42, 0, 0.58, 1],
};
