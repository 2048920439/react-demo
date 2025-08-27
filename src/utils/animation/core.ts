import type { BezierCurve } from './types';
import { BEZIER_CONFIG, ANIMATION_BOUNDS } from './constants';

/**
 * 计算三次贝塞尔曲线分量的纯函数
 *
 * @description 基于标准三次贝塞尔曲线公式的核心计算函数。
 * 适用于起点(0,0)和终点(1,1)的标准缓动曲线场景，已进行数学简化优化。
 *
 * 标准公式：B(t) = (1-t)³P₀ + 3(1-t)²t P₁ + 3(1-t)t² P₂ + t³P₃
 * 简化后：B(t) = 3(1-t)²t P₁ + 3(1-t)t² P₂ + t³
 *
 * @param t - 时间参数，取值范围 [0, 1]
 * @param p1 - 第一个控制点的对应分量 (x1 或 y1)
 * @param p2 - 第二个控制点的对应分量 (x2 或 y2)
 * @returns 贝塞尔曲线在时间点 t 的分量值
 *
 * @example
 * // 计算 X 分量
 * const x = calculateBezierComponent(0.5, 0.42, 0.58);
 *
 * @example
 * // 计算 Y 分量
 * const y = calculateBezierComponent(0.5, 0, 1);
 */
export const calculateBezierComponent = (t: number, p1: number, p2: number): number => {
  const timeMax: number = ANIMATION_BOUNDS.TIME_PARAMETER_MAX;
  const cubicCoefficient: number = BEZIER_CONFIG.CUBIC_BEZIER_COEFFICIENT;

  const oneMinusT = timeMax - t;
  const t2 = t * t;
  const oneMinusT2 = oneMinusT * oneMinusT;

  return cubicCoefficient * oneMinusT2 * t * p1 + cubicCoefficient * oneMinusT * t2 * p2 + t2 * t;
};

/**
 * 计算三次贝塞尔曲线在指定时间点的值
 *
 * @description 使用二分法求解三次贝塞尔曲线的数值，适用于实现各种缓动函数和动画曲线计算。
 * 算法针对起点(0,0)和终点(1,1)的标准缓动曲线进行了优化。
 *
 * @param t - 时间参数，取值范围 [0, 1]
 * @param bezierCurve - 贝塞尔曲线控制点 [x1, y1, x2, y2]
 * @returns 在时间点 t 对应的贝塞尔曲线 y 值
 *
 * @example
 * // CSS cubic-bezier(.65, 0, .35, 1) 缓动函数
 * const easedValue = cubicBezier(0.5, [0.65, 0, 0.35, 1]);
 *
 * @example
 * // ease-in-out 缓动函数
 * const easedValue = cubicBezier(0.3, [0.42, 0, 0.58, 1]);
 */
export const cubicBezier = (t: number, bezierCurve: BezierCurve): number => {
  const [x1, y1, x2, y2] = bezierCurve;

  // 边界情况处理
  const timeMin: number = ANIMATION_BOUNDS.TIME_PARAMETER_MIN;
  const timeMax: number = ANIMATION_BOUNDS.TIME_PARAMETER_MAX;

  if (t <= timeMin) return timeMin;
  if (t >= timeMax) return timeMax;

  // 使用二分法求解 x = t 对应的贝塞尔参数
  const searchTimeMin: number = ANIMATION_BOUNDS.TIME_PARAMETER_MIN;
  const searchTimeMax: number = ANIMATION_BOUNDS.TIME_PARAMETER_MAX;
  const initialMid: number = BEZIER_CONFIG.BINARY_SEARCH_INITIAL_MID;
  const maxIterations: number = BEZIER_CONFIG.MAX_BINARY_SEARCH_ITERATIONS;
  const precisionThreshold: number = BEZIER_CONFIG.CALCULATION_PRECISION_THRESHOLD;

  let start = searchTimeMin;
  let end = searchTimeMax;
  let mid = initialMid;

  // 高精度二分搜索
  for (let i = 0; i < maxIterations; i++) {
    const x = calculateBezierComponent(mid, x1, x2);
    const delta = Math.abs(x - t);

    if (delta < precisionThreshold) break;

    if (x < t) {
      start = mid;
    } else {
      end = mid;
    }
    mid = (start + end) * initialMid;
  }

  return calculateBezierComponent(mid, y1, y2);
};
