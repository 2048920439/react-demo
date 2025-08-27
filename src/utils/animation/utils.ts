import { limitNumber } from '@/utils/number';
import { PRECISION_CONFIG } from './constants';

/**
 * 内部工具函数（不对外暴露）
 */

/**
 * 根据动画时长和帧率计算动画精度
 * 确保在requestAnimationFrame中能够获取到足够精细的数据
 *
 * @param duration - 动画时长（毫秒）
 * @param frameRate - 帧率 (fps)，用于计算精度
 * @returns 动画精度
 */
export const calculateSafePrecision = (duration: number, frameRate: number): number => {
  // 根据指定帧率计算帧数作为安全精度，确保RAF中一定能取到合适的数据
  const frameCount = Math.ceil((duration / 1000) * frameRate);

  // 限制精度范围，确保性能和精度的平衡
  return limitNumber(frameCount, PRECISION_CONFIG.MIN_PRECISION_LIMIT, PRECISION_CONFIG.MAX_PRECISION_LIMIT);
};
