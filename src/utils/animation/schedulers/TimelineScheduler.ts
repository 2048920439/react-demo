import type { AnimationScheduler } from './types';

/**
 * 时间线控制调度器
 *
 * @description 支持动画的播放、暂停、跳转和速度控制，提供精确的时间线控制能力。
 * 通过将时间计算委托给调度器，实现灵活的动画控制。
 *
 * @example
 * // 创建时间线控制器
 * const timeline = new TimelineScheduler();
 *
 * // 使用时间线控制器
 * animateValue({
 *   startValue: 0,
 *   endValue: 100,
 *   duration: 2000,
 *   scheduler: timeline
 * }, callback);
 *
 * // 控制动画时间线
 * timeline.pause(); // 暂停动画
 * timeline.setPlaybackRate(2.0); // 2倍速播放
 * timeline.seek(500); // 跳转到500ms位置
 */
export class TimelineScheduler implements AnimationScheduler {
  private baseTime = 0;

  private offsetTime = 0;

  private isPaused = false;

  private playbackRate = 1.0;

  private lastTime = 0;

  private animationId: number | null = null;

  private pendingCallback: (() => void) | null = null;

  /**
   * 构造函数
   */
  constructor() {
    this.baseTime = Date.now();
    this.lastTime = this.baseTime;
  }

  /**
   * 调度动画帧
   * @param callback - 动画回调函数
   * @returns 取消函数
   */
  schedule(callback: () => void): () => void {
    // 如果已暂停，存储回调函数，等待恢复时执行
    if (this.isPaused) {
      this.pendingCallback = callback;
      return () => {
        this.pendingCallback = null;
      };
    }

    const wrappedCallback = () => {
      this.lastTime = Date.now();
      callback();
      // 继续调度下一帧
      this.animationId = requestAnimationFrame(wrappedCallback);
    };

    this.animationId = requestAnimationFrame(wrappedCallback);

    return () => {
      if (this.animationId) {
        cancelAnimationFrame(this.animationId);
        this.animationId = null;
      }
    };
  }

  /**
   * 获取当前经过的时间（毫秒）
   * @returns 经过的时间（毫秒）
   */
  getElapsed(): number {
    if (this.isPaused) {
      return (this.lastTime - this.baseTime + this.offsetTime) * this.playbackRate;
    }
    return (Date.now() - this.baseTime + this.offsetTime) * this.playbackRate;
  }

  /**
   * 暂停动画
   */
  pause(): void {
    this.isPaused = true;
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }
  }

  /**
   * 恢复动画
   */
  resume(): void {
    this.isPaused = false;
    // 如果有等待执行的回调，立即执行
    if (this.pendingCallback) {
      const callback = this.pendingCallback;
      this.pendingCallback = null;
      callback();
    }
    this.baseTime = Date.now() - (this.lastTime - this.baseTime);
  }

  /**
   * 设置播放速度
   * @param rate - 播放速度（1.0为正常速度）
   */
  setPlaybackRate(rate: number): void {
    // 调整基准时间以保持当前播放位置
    const currentElapsed = this.getElapsed();
    this.playbackRate = rate;
    this.offsetTime = currentElapsed / rate - (Date.now() - this.baseTime);
  }

  /**
   * 跳转到指定时间
   * @param time - 目标时间（毫秒）
   */
  seek(time: number): void {
    this.offsetTime = time / this.playbackRate - (Date.now() - this.baseTime);
  }

  /**
   * 重置时间线
   */
  reset(): void {
    this.baseTime = Date.now();
    this.offsetTime = 0;
    this.isPaused = false;
    this.playbackRate = 1.0;
    this.lastTime = this.baseTime;
    this.pendingCallback = null;
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }
  }
}
