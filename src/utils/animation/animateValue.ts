import type { AnimateValueOptions, AnimationStatus, BezierCurve } from './types';
import { EASING_PRESETS, ANIMATION_BOUNDS, PRECISION_CONFIG } from './constants';
import { BezierLookupCache } from './lookup';
import { calculateSafePrecision } from './utils';

// 全局贝塞尔查找表缓存实例
const globalBezierCache = new BezierLookupCache();

/**
 * 创建一个平滑的数值动画
 *
 * @description 使用 requestAnimationFrame 实现高性能的数值过渡动画，支持自定义缓动函数。
 * 基于时间戳计算进度，确保流畅的 60fps 动画效果，不依赖帧率。
 * 自动使用预计算查找表优化，根据动画时长和指定帧率计算安全精度，取代实时计算提升性能。
 *
 * @param options - 动画配置参数
 * @param onUpdate - 动画更新回调函数，接收动画状态信息
 * @returns 返回一个取消函数，用于提前停止动画
 *
 * @example
 * // 基本用法
 * animateValue({
 *   startValue: 120,
 *   endValue: 840,
 *   duration: 2000,
 *   easing: 'ease-in-out'
 * }, (status) => console.log(status.value));
 *
 * @example
 * // 自定义贝塞尔曲线（自动优化）
 * animateValue({
 *   startValue: 0,
 *   endValue: 100,
 *   duration: 3000,
 *   easing: [0.65, 0, 0.35, 1],  // 自动使用默认60fps安全精度预计算
 *   frameRate: 120  // 可选：指定更高的帧率以获得更高精度
 * }, callback);
 */
export const animateValue = (
  options: AnimateValueOptions,
  onUpdate: (status: AnimationStatus) => void,
): (() => void) => {
  const {
    startValue,
    endValue,
    duration,
    easing = 'linear',
    frameRate = PRECISION_CONFIG.DEFAULT_FRAME_RATE,
  } = options;
  const startTime = Date.now();
  let animationId: number;

  // 缓动函数归一化：将 CSS 关键字或自定义曲线转换为贝塞尔参数
  const bezierParams: BezierCurve = typeof easing === 'string' ? EASING_PRESETS[easing] : easing;

  // 始终使用查找表优化，根据动画时长和指定帧率计算安全精度
  const safePrecision = calculateSafePrecision(duration, frameRate);
  const lookup = globalBezierCache.getOrCreate(bezierParams, safePrecision);
  const easingFunction = lookup.getValue;

  const animate = () => {
    const elapsed = Date.now() - startTime;
    const progressComplete: number = ANIMATION_BOUNDS.ANIMATION_PROGRESS_COMPLETE;

    const progress = Math.min(elapsed / duration, progressComplete);
    const isCompleted = progress >= progressComplete;

    // 应用缓动函数
    let easedProgress = progress;
    if (bezierParams && !isCompleted && bezierParams !== EASING_PRESETS.linear) {
      easedProgress = easingFunction(progress);
    }

    const currentValue = isCompleted ? endValue : startValue + (endValue - startValue) * easedProgress;

    // 构建状态信息
    const status: AnimationStatus = {
      value: currentValue,
      progress,
      isCompleted,
      elapsed,
    };

    onUpdate(status);

    if (!isCompleted) {
      animationId = requestAnimationFrame(animate);
    }
  };

  animationId = requestAnimationFrame(animate);

  // 返回取消函数
  return () => {
    if (animationId) {
      cancelAnimationFrame(animationId);
    }
  };
};
