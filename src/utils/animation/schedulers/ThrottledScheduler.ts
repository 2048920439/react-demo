import type { AnimationScheduler } from './types';

/**
 * 节流调度器
 *
 * @description 限制动画更新频率，减少计算负担。适用于复杂动画或性能敏感的场景。
 * 通过跳过部分帧来减少 CPU 使用率，同时保持动画的基本流畅度。
 *
 * @example
 * // 每 2 帧执行一次（30fps 效果）
 * const scheduler = new ThrottledScheduler(2);
 *
 * @example
 * // 每 4 帧执行一次（15fps 效果）
 * const scheduler = new ThrottledScheduler(4);
 */
export class ThrottledScheduler implements AnimationScheduler {
  private frameCount: number = 0;

  private readonly skipFrames: number;

  /**
   * 构造函数
   * @param skipFrames - 跳过的帧数，默认为 1（不跳过）
   */
  constructor(skipFrames: number = 1) {
    this.skipFrames = Math.max(1, skipFrames);
  }

  schedule(callback: () => void): () => void {
    const wrappedCallback = () => {
      this.frameCount++;
      if (this.frameCount >= this.skipFrames) {
        this.frameCount = 0;
        callback();
      } else {
        // 继续调度下一帧
        this.schedule(callback);
      }
    };

    const animationId = requestAnimationFrame(wrappedCallback);
    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }
}
