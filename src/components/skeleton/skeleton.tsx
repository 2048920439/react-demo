import classnames from 'classnames'
import { memo } from 'react'
import type { SkeletonComponentProps } from 'src/components/skeleton/types'
import styles from 'src/components/skeleton/skeleton.module.scss'

export const Skeleton = memo((props: SkeletonComponentProps) => {
  const { skeletonStyle, className } = props

  return (
    <div className={classnames(className, styles.skeleton)}>
      {skeletonStyle.map((config, index) => {
        const { renderer: Renderer, props: rendererProps } = config
        try {
          return <Renderer key={index} {...(rendererProps as any)} />
        } catch (e) {
          console.error(e)
          return null
        }
      })}
    </div>
  )
})
