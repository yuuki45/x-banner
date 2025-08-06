import { useEffect, useRef, useState } from 'react'
import { Canvas } from 'fabric'
import { createCanvas } from '../utils/canvas'

export const useCanvas = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const fabricCanvasRef = useRef<Canvas | null>(null)
  const [canvas, setCanvas] = useState<Canvas | null>(null)

  useEffect(() => {
    if (canvasRef.current && !fabricCanvasRef.current) {
      const fabricCanvas = createCanvas(canvasRef.current)
      fabricCanvasRef.current = fabricCanvas
      setCanvas(fabricCanvas)
    }

    return () => {
      if (fabricCanvasRef.current) {
        fabricCanvasRef.current.dispose()
        fabricCanvasRef.current = null
        setCanvas(null)
      }
    }
  }, [])

  return { canvasRef, canvas }
}