export interface BaseShapeProps {
  top: number
  left: number
  slideW: number
  slideH: number
}

export interface RoundProps extends BaseShapeProps {
  d: number
}

export interface RectangleProps extends BaseShapeProps {
  w: number
  h: number
}
