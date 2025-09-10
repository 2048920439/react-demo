import { PRECISION_CONFIG } from './constants';
import type { BezierCurve, BezierLookupTable } from './types';
import { BezierLookup } from './BezierLookup';

/**
 * 贝塞尔查找表缓存管理器，支持精度感知的缓存策略
 */
export class BezierLookupCache {
  private cache = new Map<string, { lookup: BezierLookupTable; precision: number }>();

  /**
   * 获取或创建缓动函数查找表
   * 智能处理精度：高精度可以覆盖低精度需求
   */
  getOrCreate(
    bezierCurve: BezierCurve,
    requestedPrecision: number = PRECISION_CONFIG.DEFAULT_LOOKUP_PRECISION,
  ): BezierLookupTable {
    const key = this.getCacheKey(bezierCurve);
    const cached = this.cache.get(key);

    // 如果缓存存在且精度足够，直接返回
    if (cached && cached.precision >= requestedPrecision) {
      return cached.lookup;
    }

    // 创建新的查找表（使用更高的精度）
    const actualPrecision = cached ? Math.max(cached.precision, requestedPrecision) : requestedPrecision;
    const lookup = new BezierLookup(bezierCurve, actualPrecision);

    // 更新缓存
    this.cache.set(key, { lookup, precision: actualPrecision });

    return lookup;
  }

  /**
   * 清理缓存（用于内存管理）
   */
  clear(): void {
    this.cache.clear();
  }

  /**
   * 获取缓存统计信息
   */
  getCacheStats(): { size: number; entries: Array<{ key: string; precision: number }> } {
    return {
      size: this.cache.size,
      entries: Array.from(this.cache.entries()).map(([key, { precision }]) => ({ key, precision })),
    };
  }

  /**
   * 生成缓存键，不包含精度信息
   */
  private getCacheKey(bezierCurve: BezierCurve): string {
    return bezierCurve.join(',');
  }
}
