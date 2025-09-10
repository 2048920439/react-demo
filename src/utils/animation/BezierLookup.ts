import { ANIMATION_BOUNDS, PRECISION_CONFIG } from './constants';
import { cubicBezier } from './core';
import { BezierCurve, BezierLookupTable } from './types';

/**
 * 贝塞尔曲线查找表类，实现 O(1) 时间复杂度的值获取
 *
 * @description 通过预计算生成高精度的贝塞尔曲线值数组，避免动画过程中的重复计算。
 * 特别适合相同缓动函数的重复使用场景，可以将每帧计算复杂度从 O(log n) 降低到 O(1)。
 *
 * @example
 * // 创建预计算查找表
 * const lookup = new BezierLookup([0.65, 0, 0.35, 1], 1000);
 *
 * // O(1) 时间复杂度获取值
 * const value = lookup.getValue(0.5);
 *
 * @example
 * // 用于动画循环
 * const lookup = new BezierLookup([0.42, 0, 0.58, 1]);
 * function animate() {
 *   const progress = (Date.now() - startTime) / duration;
 *   const easedValue = lookup.getValue(progress); // 超快速查找
 * }
 */
export class BezierLookup implements BezierLookupTable {
  private readonly lookupTable: number[];

  private readonly precision: number;

  private readonly bezierCurve: BezierCurve;

  /**
   * 构造函数
   * @param bezierCurve - 贝塞尔曲线控制点 [x1, y1, x2, y2]
   * @param precision - 精度，表示生成多少个预计算点（默认1000，对应0.001精度）
   */
  constructor(bezierCurve: BezierCurve, precision: number = PRECISION_CONFIG.DEFAULT_LOOKUP_PRECISION) {
    this.bezierCurve = bezierCurve;
    this.precision = precision;
    this.lookupTable = [];

    // 预计算阶段：生成查找表
    this.generateLookupTable();
  }

  /**
   * 快速获取贝塞尔曲线值（O(1) 时间复杂度）
   */
  getValue(t: number): number {
    // 边界处理
    if (t <= ANIMATION_BOUNDS.TIME_PARAMETER_MIN) return this.lookupTable[0];
    if (t >= ANIMATION_BOUNDS.TIME_PARAMETER_MAX) return this.lookupTable[this.precision];

    // 计算数组索引
    const index = t * this.precision;
    const lowerIndex = Math.floor(index);
    const upperIndex = Math.ceil(index);

    // 如果正好落在整数点上，直接返回
    if (lowerIndex === upperIndex) {
      return this.lookupTable[lowerIndex];
    }

    // 线性插值提高精度
    const fraction = index - lowerIndex;
    const lowerValue = this.lookupTable[lowerIndex];
    const upperValue = this.lookupTable[upperIndex];

    return lowerValue + (upperValue - lowerValue) * fraction;
  }

  /**
   * 获取预计算的数组（用于调试或其他用途）
   */
  getPrecomputedArray(): number[] {
    return [...this.lookupTable];
  }

  /**
   * 获取精度设置
   */
  getPrecision(): number {
    return this.precision;
  }

  /**
   * 获取贝塞尔曲线参数
   */
  getBezierCurve(): BezierCurve {
    return this.bezierCurve;
  }

  /**
   * 销毁查找表，释放内存
   */
  destroy(): void {
    this.lookupTable.length = 0;
  }

  /**
   * 获取内存使用情况
   */
  getMemoryUsage(): { tableSize: number; memoryEstimate: string } {
    const tableSize = this.lookupTable.length;
    const memoryEstimate = `${((tableSize * 8) / 1024).toFixed(2)} KB`; // 每个数字约8字节
    return { tableSize, memoryEstimate };
  }

  /**
   * 生成查找表
   */
  private generateLookupTable(): void {
    for (let i = 0; i <= this.precision; i++) {
      const t = i / this.precision;
      this.lookupTable[i] = cubicBezier(t, this.bezierCurve);
    }
  }
}
