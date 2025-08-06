import { Canvas } from 'fabric'
import { CANVAS_CONFIG } from '../constants/canvas'

export const createCanvas = (canvasElement: HTMLCanvasElement) => {
  const canvas = new Canvas(canvasElement, {
    width: CANVAS_CONFIG.WIDTH,
    height: CANVAS_CONFIG.HEIGHT,
    backgroundColor: CANVAS_CONFIG.BACKGROUND_COLOR,
  })
  return canvas
}

export const exportCanvasAsPNG = (canvas: Canvas): string => {
  return canvas.toDataURL({
    format: 'png',
    quality: 1,
    multiplier: 1,
  })
}

export const downloadImage = (dataURL: string, filename = 'x-banner.png') => {
  const link = document.createElement('a')
  link.download = filename
  link.href = dataURL
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}