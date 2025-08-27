import type { BezierCurve, BezierLookupTable } from './types';
import { cubicBezier } from './core';
import { PRECISION_CONFIG, ANIMATION_BOUNDS } from './constants';

/**
 * 预计算贝塞尔曲线查找表，实现 O(1) 时间复杂度的值获取
 *
 * @description 通过预计算生成高精度的贝塞尔曲线值数组，避免动画过程中的重复计算。
 * 特别适合相同缓动函数的重复使用场景，可以将每帧计算复杂度从 O(log n) 降低到 O(1)。
 *
 * @param bezierCurve - 贝塞尔曲线控制点 [x1, y1, x2, y2]
 * @param precision - 精度，表示生成多少个预计算点（默认1000，对应0.001精度）
 * @returns 返回包含查找函数的对象
 *
 * @example
 * // 创建预计算查找表
 * const lookup = createBezierLookup([0.65, 0, 0.35, 1], 1000);
 *
 * // O(1) 时间复杂度获取值
 * const value = lookup.getValue(0.5);
 *
 * @example
 * // 用于动画循环
 * const lookup = createBezierLookup([0.42, 0, 0.58, 1]);
 * function animate() {
 *   const progress = (Date.now() - startTime) / duration;
 *   const easedValue = lookup.getValue(progress); // 超快速查找
 * }
 */
export const createBezierLookup = (
  bezierCurve: BezierCurve,
  precision: number = PRECISION_CONFIG.DEFAULT_LOOKUP_PRECISION,
): BezierLookupTable => {
  const lookupTable: number[] = [];

  // 预计算阶段：生成查找表
  for (let i = 0; i <= precision; i++) {
    const t = i / precision;
    lookupTable[i] = cubicBezier(t, bezierCurve);
  }

  return {
    /**
     * 快速获取贝塞尔曲线值（O(1) 时间复杂度）
     */
    getValue: (t: number): number => {
      // 边界处理
      const timeMin: number = ANIMATION_BOUNDS.TIME_PARAMETER_MIN;
      const timeMax: number = ANIMATION_BOUNDS.TIME_PARAMETER_MAX;

      if (t <= timeMin) return lookupTable[0];
      if (t >= timeMax) return lookupTable[precision];

      // 计算数组索引
      const index = t * precision;
      const lowerIndex = Math.floor(index);
      const upperIndex = Math.ceil(index);

      // 如果正好落在整数点上，直接返回
      if (lowerIndex === upperIndex) {
        return lookupTable[lowerIndex];
      }

      // 线性插值提高精度
      const fraction = index - lowerIndex;
      const lowerValue = lookupTable[lowerIndex];
      const upperValue = lookupTable[upperIndex];

      return lowerValue + (upperValue - lowerValue) * fraction;
    },

    /**
     * 获取预计算的数组（用于调试或其他用途）
     */
    getPrecomputedArray: (): number[] => [...lookupTable],

    /**
     * 获取精度设置
     */
    getPrecision: (): number => precision,
  };
};

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
    const lookup = createBezierLookup(bezierCurve, actualPrecision);

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
