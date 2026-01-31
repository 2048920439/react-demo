import { memo } from 'react'
import type { CSSProperties } from 'react'
import { getReckoner } from 'src/components/skeleton/elements/utils'
import type { RectangleProps } from 'src/components/skeleton/elements/types'

export const Rectangle = memo((props: RectangleProps) => {
  const { w, h, top, left, slideW, slideH } = props
  const { getX, getY } = getReckoner(slideW, slideH)

  const style: CSSProperties = {
    position: 'absolute',
    overflow: 'hidden',
    backgroundColor: '#e5e7eb',
    top: getY(top),
    left: getX(left),
    width: getX(w),
    height: getY(h),
    borderRadius: 4,
  }

  return <div style={style} />
})
