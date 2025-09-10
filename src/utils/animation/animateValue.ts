import { AnimateValueOptions, AnimationStatus, BezierCurve, EasingFunction } from './types'
import { EASING_PRESETS, ANIMATION_BOUNDS } from './constants'
import { cubicBezier } from './core'
import { type AnimationScheduler, type CancelSchedule, RAFScheduler } from './schedulers'

/**
 * 创建一个平滑的数值动画
 *
 * @description 使用可配置的调度器实现高性能的数值过渡动画，支持自定义缓动函数。
 * 基于时间戳计算进度，确保流畅的动画效果，不依赖帧率。
 * 采用实时计算策略，零初始化开销，内存占用最小。
 * 支持外部调度器，可以灵活控制动画的执行时机和性能特性。
 *
 * @param options - 动画配置参数
 * @param onUpdate - 动画更新回调函数，接收动画状态信息
 * @returns 返回一个取消函数，用于提前停止动画
 *
 * @example
 * // 基本用法（使用默认 RAF 调度器）
 * animateValue({
 *   startValue: 120,
 *   endValue: 840,
 *   duration: 2000,
 *   easing: 'ease-in-out'
 * }, (status) => console.log(status.value));
 *
 * @example
 * // 使用自定义调度器和贝塞尔曲线
 * import { FixedFPSScheduler } from '@/utils/animation';
 * const fps30Scheduler = new FixedFPSScheduler(30); // 30fps 调度器
 * animateValue({
 *   startValue: 0,
 *   endValue: 100,
 *   duration: 3000,
 *   easing: [0.65, 0, 0.35, 1],
 *   scheduler: fps30Scheduler
 * }, callback);

 * @example
 * // 使用时间线控制调度器
 * import { TimelineScheduler } from '@/utils/animation';
 * const timeline = new TimelineScheduler();
 *
 * animateValue({
 *   startValue: 0,
 *   endValue: 100,
 *   duration: 2000,
 *   scheduler: timeline
 * }, (status) => {
 *   console.log(`进度: ${status.progress}, 值: ${status.value}`);
 * });
 *
 * // 控制动画时间线
 * setTimeout(() => timeline.pause(), 1000); // 1秒后暂停
 * setTimeout(() => timeline.setPlaybackRate(2.0), 2000); // 2秒后2倍速播放
 * setTimeout(() => timeline.seek(500), 3000); // 3秒后跳转到500ms位置

 * @example
 * // 批处理多个动画以提升性能
 * import { BatchScheduler } from '@/utils/animation';
 * const batchScheduler = new BatchScheduler();
 *
 * animateValue({ ...config1, scheduler: batchScheduler }, callback1);
 * animateValue({ ...config2, scheduler: batchScheduler }, callback2);
 *
 * @example
 * // 使用循环调度器创建无限循环动画
 * import { LoopScheduler } from '@/utils/animation';
 * const loopScheduler = new LoopScheduler(); // 无限循环
 *
 * animateValue({
 *   startValue: 0,
 *   endValue: 100,
 *   duration: 2000,
 *   scheduler: loopScheduler
 * }, (status) => {
 *   console.log(`进度: ${status.progress}, 值: ${status.value}`);
 * });
 *
 * // 控制循环动画
 * setTimeout(() => loopScheduler.pause(), 5000); // 5秒后暂停
 * setTimeout(() => loopScheduler.resume(), 8000); // 8秒后恢复
 * setTimeout(() => loopScheduler.setPlaybackRate(2.0), 10000); // 10秒后2倍速播放
 */
export const animateValue = (
  options: AnimateValueOptions,
  onUpdate: (status: AnimationStatus) => void
): (() => void) => {
  const {
    startValue,
    endValue,
    duration,
    easing = 'linear' as EasingFunction,
    scheduler = new RAFScheduler() as AnimationScheduler
  } = options

  // 将 CSS 关键字或自定义曲线统一为贝塞尔参数
  const bezierParams: BezierCurve = typeof easing === 'string' ? EASING_PRESETS[easing] : easing

  let cancelSchedule: CancelSchedule | null = null

  const startTime = Date.now()
  const getElapsed = () => (scheduler.getElapsed ? scheduler.getElapsed() : Date.now() - startTime)

  const animate = () => {
    const elapsed = getElapsed()
    const progressComplete: number = ANIMATION_BOUNDS.ANIMATION_PROGRESS_COMPLETE

    const progress = Math.min(elapsed / duration, progressComplete)
    const isCompleted = progress >= progressComplete

    // 应用缓动函数
    let easedProgress = progress
    if (!isCompleted && bezierParams !== EASING_PRESETS.linear) {
      easedProgress = cubicBezier(progress, bezierParams)
    }

    const currentValue = isCompleted ? endValue : startValue + (endValue - startValue) * easedProgress

    // 构建状态信息
    const status: AnimationStatus = {
      value: currentValue,
      progress,
      isCompleted,
      elapsed
    }

    onUpdate(status)

    if (!isCompleted) {
      cancelSchedule = scheduler.schedule(animate)
    }
  }

  // 启动动画
  cancelSchedule = scheduler.schedule(animate)

  // 返回取消函数
  return () => {
    if (cancelSchedule) {
      cancelSchedule()
      cancelSchedule = null
    }
  }
}
