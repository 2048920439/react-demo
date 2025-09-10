/**
 * 动画调度器模块类型定义
 */

export interface CancelSchedule {
  (): void;
}
/**
 * 动画调度器接口
 * 允许外部控制动画的执行时机和频率
 */
export interface AnimationScheduler {
  /** 调度动画帧，返回取消函数 */
  schedule: (callback: () => void) => CancelSchedule;
  /** 获取当前经过的时间（毫秒），用于时间线控制 */
  getElapsed?: () => number;
}
