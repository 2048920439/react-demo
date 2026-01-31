import { createRectangle, createRound } from 'src/components/skeleton/shapes'
import { SkeletonStyle } from 'src/components/skeleton/types'

export const slide1: SkeletonStyle[] = [
  createRectangle({ slideW: 882, slideH: 500, top: 89, left: 54, w: 209, h: 72 }),
  createRectangle({ slideW: 882, slideH: 500, top: 197, left: 54, w: 355, h: 36 }),
  createRectangle({ slideW: 882, slideH: 500, top: 20, left: 445, w: 417, h: 460 }),
  createRound({ slideW: 882, slideH: 500, top: 420, left: 54, d: 24 }),
  createRound({ slideW: 882, slideH: 500, top: 420, left: 90, d: 24 }),
  createRound({ slideW: 882, slideH: 500, top: 420, left: 126, d: 24 }),
]

export const slide2: SkeletonStyle[] = [
  createRectangle({ slideW: 882, slideH: 500, top: 42, left: 42, w: 252, h: 72 }),
  createRectangle({ slideW: 882, slideH: 500, top: 162, left: 42, w: 252, h: 228 }),
  createRectangle({ slideW: 882, slideH: 500, top: 162, left: 315, w: 252, h: 228 }),
  createRectangle({ slideW: 882, slideH: 500, top: 162, left: 588, w: 252, h: 228 }),
  createRectangle({ slideW: 882, slideH: 500, top: 417, left: 88, w: 160, h: 30 }),
  createRectangle({ slideW: 882, slideH: 500, top: 417, left: 361, w: 160, h: 30 }),
  createRectangle({ slideW: 882, slideH: 500, top: 417, left: 634, w: 160, h: 30 }),
]

export const slide3: SkeletonStyle[] = [
  createRectangle({ slideW: 882, slideH: 500, top: 79, left: 80, w: 240, h: 152 }),
  createRectangle({ slideW: 882, slideH: 500, top: 79, left: 393, w: 207, h: 48 }),
  createRectangle({ slideW: 882, slideH: 500, top: 155, left: 393, w: 421, h: 30 }),
  createRectangle({ slideW: 882, slideH: 500, top: 210, left: 393, w: 334, h: 30 }),
  createRectangle({ slideW: 882, slideH: 500, top: 284, left: 393, w: 207, h: 48 }),
  createRectangle({ slideW: 882, slideH: 500, top: 360, left: 393, w: 421, h: 30 }),
  createRectangle({ slideW: 882, slideH: 500, top: 406, left: 393, w: 334, h: 30 }),
]
