import { memo } from 'react'
import type { CSSProperties } from 'react'
import { getReckoner } from 'src/components/skeleton/elements/utils'
import type { RoundProps } from 'src/components/skeleton/elements/types'

export const Round = memo((props: RoundProps) => {
  const { d, top, left, slideW, slideH } = props
  const { getX, getY } = getReckoner(slideW, slideH)

  const style: CSSProperties = {
    position: 'absolute',
    overflow: 'hidden',
    backgroundColor: '#e5e7eb',
    top: getY(top),
    left: getX(left),
    width: getX(d),
    height: getY(d),
    borderRadius: '50%',
  }

  return <div style={style} />
})
