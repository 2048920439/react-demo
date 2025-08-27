import type { EasingPreset, BezierCurve } from './types';

/**
 * 动画精度配置常量
 */
export const PRECISION_CONFIG = {
  /** 默认查找表精度 */
  DEFAULT_LOOKUP_PRECISION: 1000,
  /** 最小精度限制 */
  MIN_PRECISION_LIMIT: 500,
  /** 最大精度限制 */
  MAX_PRECISION_LIMIT: 8000,
  /** 默认帧率 (fps) - 用于计算动画精度的默认帧率 */
  DEFAULT_FRAME_RATE: 60,
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
