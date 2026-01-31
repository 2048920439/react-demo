export const getReckoner = (slideW: number, slideH: number) => {
  return {
    getX: (x: number) => (x * 100) / slideW + '%',
    getY: (y: number) => (y * 100) / slideH + '%',
  }
}
