export type ShapeType = 'circle' | 'rect' | 'triangle' | 'star' | 'heart'

export interface ShapeOption {
  type: ShapeType
  name: string
  icon: string
}

export const SHAPE_OPTIONS: ShapeOption[] = [
  { type: 'circle', name: '円', icon: '●' },
  { type: 'rect', name: '四角', icon: '■' },
  { type: 'triangle', name: '三角', icon: '▲' },
  { type: 'star', name: '星', icon: '★' },
  { type: 'heart', name: 'ハート', icon: '♥' },
]

export const DEFAULT_SHAPE_CONFIG = {
  SIZE: 100,
  COLOR: '#3b82f6',
  STROKE_WIDTH: 0,
  STROKE_COLOR: '#000000',
}
