import type { FC } from 'react'

export type SkeletonStyle<T extends object = any> = {
  renderer: FC<T>
  props: T
}

export interface SkeletonComponentProps {
  /**
   * 一组骨架配置，SkeletonComponent 将按顺序渲染其中的 renderer + props
   */
  skeletonStyle: SkeletonStyle[]
  className?: string
}
