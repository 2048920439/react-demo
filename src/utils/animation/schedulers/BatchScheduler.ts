import type { AnimationScheduler } from './types';

/**
 * 批处理调度器
 *
 * @description 将多个动画更新批处理到同一帧中，减少重绘次数，提升性能。
 * 特别适用于同时运行多个动画的场景，可以显著减少 DOM 操作和重绘开销。
 *
 * @example
 * const batchScheduler = new BatchScheduler();
 *
 * // 多个动画共享同一个调度器
 * animateValue({ ...options, scheduler: batchScheduler }, callback1);
 * animateValue({ ...options, scheduler: batchScheduler }, callback2);
 */
export class BatchScheduler implements AnimationScheduler {
  private callbacks: Set<() => void> = new Set();

  private animationId: number | null = null;

  schedule(callback: () => void): () => void {
    this.callbacks.add(callback);

    // 如果还没有调度帧，则调度一个
    if (!this.animationId) {
      this.animationId = requestAnimationFrame(() => {
        const callbacksToExecute = Array.from(this.callbacks);
        this.callbacks.clear();
        this.animationId = null;

        // 批量执行所有回调
        callbacksToExecute.forEach((cb) => cb());
      });
    }

    // 返回取消函数
    return () => {
      this.callbacks.delete(callback);

      // 如果没有回调了，取消动画帧
      if (this.callbacks.size === 0 && this.animationId) {
        cancelAnimationFrame(this.animationId);
        this.animationId = null;
      }
    };
  }
}
