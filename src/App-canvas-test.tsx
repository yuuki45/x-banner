import { useEffect, useRef, useState } from 'react'

function App() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [fabricCanvas, setFabricCanvas] = useState<any>(null)

  useEffect(() => {
    const loadFabric = async () => {
      try {
        const { Canvas, Text } = await import('fabric')
        
        if (canvasRef.current && !fabricCanvas) {
          const canvas = new Canvas(canvasRef.current, {
            width: 750,
            height: 250,
            backgroundColor: '#ffffff',
          })

          const text = new Text('Hello Fabric.js!', {
            left: 50,
            top: 100,
            fontFamily: 'Arial',
            fontSize: 32,
            fill: '#000000',
          })

          canvas.add(text)
          canvas.renderAll()
          setFabricCanvas(canvas)
          
          console.log('Fabric.js loaded successfully!')
        }
      } catch (error) {
        console.error('Failed to load Fabric.js:', error)
      }
    }

    loadFabric()
    
    // クリーンアップ
    return () => {
      if (fabricCanvas) {
        fabricCanvas.dispose()
        setFabricCanvas(null)
      }
    }
  }, [fabricCanvas])

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow">
        <h1 className="text-4xl font-bold text-blue-600 mb-4">
          X Banner Generator - Canvas Test
        </h1>
        <p className="text-gray-600 mb-8">
          Fabric.js Canvas テスト
        </p>
        
        <div className="border border-gray-300 rounded-lg p-4 bg-gray-50">
          <canvas 
            ref={canvasRef}
            className="border border-gray-400"
            style={{ display: 'block', margin: '0 auto' }}
          />
        </div>
        
        <div className="mt-4 text-center text-sm text-gray-500">
          ブラウザのコンソールでエラーを確認してください
        </div>
      </div>
    </div>
  )
}

export default App