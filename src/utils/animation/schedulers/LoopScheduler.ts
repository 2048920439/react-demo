import type { AnimationScheduler } from './types';

/**
 * 循环调度器
 *
 * @description 支持无限循环动画，可以指定循环次数或无限循环。
 * 通过将时间计算委托给调度器，实现灵活的循环动画控制。
 *
 * @example
 * // 创建无限循环调度器
 * const loopScheduler = new LoopScheduler();
 *
 * // 使用循环调度器
 * animateValue({
 *   startValue: 0,
 *   endValue: 100,
 *   duration: 2000,
 *   scheduler: loopScheduler
 * }, callback);
 *
 * // 控制循环动画
 * loopScheduler.pause(); // 暂停循环动画
 * loopScheduler.resume(); // 恢复循环动画
 * loopScheduler.setPlaybackRate(2.0); // 2倍速播放
 */
export class LoopScheduler implements AnimationScheduler {
  private baseTime = 0;

  private offsetTime = 0;

  private isPaused = false;

  private playbackRate = 1.0;

  private lastTime = 0;

  private animationId: number | null = null;

  private loopCount = 0;

  private maxLoops: number;

  private pendingCallback: (() => void) | null = null;

  /**
   * 构造函数
   * @param maxLoops - 最大循环次数，-1表示无限循环，默认为-1
   */
  constructor(maxLoops = -1) {
    this.maxLoops = maxLoops;
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

      // 继续调度下一帧（除非达到最大循环次数）
      if (this.maxLoops === -1 || this.loopCount < this.maxLoops) {
        this.animationId = requestAnimationFrame(wrappedCallback);
      }
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
   * 对于循环调度器，这个时间会根据循环次数进行调整
   * @returns 经过的时间（毫秒）
   */
  getElapsed(): number {
    const currentTime = this.isPaused ? this.lastTime : Date.now();
    const actualElapsed = (currentTime - this.baseTime + this.offsetTime) * this.playbackRate;

    // 如果是无限循环或未达到最大循环次数，返回调整后的时间
    if (this.maxLoops === -1 || this.loopCount < this.maxLoops) {
      return actualElapsed;
    }

    return actualElapsed;
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
    // 重新开始调度
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
    this.loopCount = 0;
    this.pendingCallback = null;
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }
  }

  /**
   * 设置循环次数
   * @param count - 循环次数，-1表示无限循环
   */
  setLoopCount(count: number): void {
    this.maxLoops = count;
  }

  /**
   * 获取当前循环次数
   * @returns 当前循环次数
   */
  getLoopCount(): number {
    return this.loopCount;
  }
}
