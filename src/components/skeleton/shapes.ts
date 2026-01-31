import { Rectangle, RectangleProps, Round, RoundProps } from 'src/components/skeleton/elements'
import { SkeletonStyle } from 'src/components/skeleton/types'

export const createRound = (props: RoundProps): SkeletonStyle<RoundProps> => {
  return { renderer: Round, props }
}

export const createRectangle = (props: RectangleProps): SkeletonStyle<RectangleProps> => {
  return { renderer: Rectangle, props }
}
