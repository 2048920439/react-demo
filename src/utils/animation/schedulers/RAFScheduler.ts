import type { AnimationScheduler } from './types';

/**
 * 默认调度器 - 基于 requestAnimationFrame
 *
 * @description 使用浏览器原生的 requestAnimationFrame 实现高性能的60fps 动画调度。
 * 自动同步显示刷新率，提供最佳的动画流畅度和性能表现。
 */
export class RAFScheduler implements AnimationScheduler {
  schedule(callback: () => void): () => void {
    const animationId = requestAnimationFrame(callback);
    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }
}
