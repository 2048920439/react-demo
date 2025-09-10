import type { AnimationScheduler } from './types';

/**
 * 自定义帧率调度器
 *
 * @description 允许精确控制动画帧率，适用于性能受限的设备或需要特定帧率的场景。
 * 通过 setTimeout 实现固定间隔的动画调度。
 *
 * @example
 * // 创建 30fps 调度器
 * const scheduler = new FixedFPSScheduler(30);
 *
 * @example
 * // 创建 120fps 调度器（用于高刷新率显示器）
 * const scheduler = new FixedFPSScheduler(120);
 */
export class FixedFPSScheduler implements AnimationScheduler {
  private readonly frameInterval: number;

  /**
   * 构造函数
   * @param fps - 目标帧率，默认 60fps
   */
  constructor(fps: number = 60) {
    this.frameInterval = 1000 / fps;
  }

  schedule(callback: () => void): () => void {
    const timeoutId = setTimeout(callback, this.frameInterval);
    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }
}
