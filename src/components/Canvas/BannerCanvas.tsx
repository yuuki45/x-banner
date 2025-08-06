import { useEffect, useImperativeHandle, forwardRef, useState } from 'react'
import { Canvas, IText, Gradient, FabricImage, Rect } from 'fabric'
import { useCanvas } from '../../hooks/useCanvas'
import { CANVAS_CONFIG, DEFAULT_TEXT_CONFIG } from '../../constants/canvas'
import { exportCanvasAsPNG, downloadImage } from '../../utils/canvas'

interface BannerCanvasProps {
  className?: string
  onAddText?: (text: string) => void
  onUpdateText?: (updates: TextUpdate) => void
  onTextChanged?: (text: string) => void
}

interface TextUpdate {
  text?: string
  fontSize?: number
  color?: string
  fontWeight?: string
  fontFamily?: string
  isVertical?: boolean
  shadow?: {
    enabled: boolean
    color: string
    blur: number
    offsetX: number
    offsetY: number
  }
}

interface BackgroundConfig {
  type: 'color' | 'gradient' | 'image'
  color?: string
  gradient?: {
    colors: string[]
    direction: 'horizontal' | 'vertical' | 'diagonal'
  }
  image?: string
  overlay?: number
  imagePosition?: 'left' | 'center' | 'right' | 'top' | 'bottom'
}

export interface BannerCanvasRef {
  addText: (text: string) => void
  updateSelectedText: (updates: TextUpdate) => void
  updateBackground: (background: BackgroundConfig) => void
  deleteSelectedText: () => void
  exportAsPNG: () => void
  getCanvas: () => Canvas | null
}

export const BannerCanvas = forwardRef<BannerCanvasRef, BannerCanvasProps>(
  ({ className = '', onTextChanged }, ref) => {
    const { canvasRef, canvas } = useCanvas()
    const [windowWidth, setWindowWidth] = useState(0)

    useImperativeHandle(ref, () => ({
      addText: (text: string) => {
        if (canvas) {
          const textObj = new IText(text, {
            left: DEFAULT_TEXT_CONFIG.LEFT + (Math.random() - 0.5) * 200,
            top: DEFAULT_TEXT_CONFIG.TOP + (Math.random() - 0.5) * 100,
            fontFamily: DEFAULT_TEXT_CONFIG.FONT_FAMILY,
            fontSize: DEFAULT_TEXT_CONFIG.FONT_SIZE,
            fill: DEFAULT_TEXT_CONFIG.COLOR,
            originX: 'center',
            originY: 'center',
            editable: true,
          })
          canvas.add(textObj)
          canvas.bringObjectToFront(textObj) // 新しいテキストを最前面に
          canvas.setActiveObject(textObj)
          
          canvas.renderAll()
        }
      },
      updateSelectedText: (updates: TextUpdate) => {
        if (canvas) {
          const activeObject = canvas.getActiveObject()
          if (activeObject && (activeObject.type === 'text' || activeObject.type === 'i-text')) {
            const textObj = activeObject as IText
            if (updates.fontSize) textObj.set('fontSize', updates.fontSize)
            if (updates.color) textObj.set('fill', updates.color)
            if (updates.fontWeight) textObj.set('fontWeight', updates.fontWeight)
            if (updates.fontFamily) textObj.set('fontFamily', updates.fontFamily)
            if (updates.text) textObj.set('text', updates.text)
            
            if (updates.isVertical !== undefined) {
              if (updates.isVertical) {
                // 縦書きに変更
                textObj.set({
                  angle: 0,
                  textAlign: 'center',
                })
                // テキストを縦書き風に変換（文字を改行で区切る）
                const currentText = textObj.text || ''
                const verticalText = currentText.split('').join('\n')
                textObj.set('text', verticalText)
              } else {
                // 横書きに戻す
                const currentText = textObj.text || ''
                const horizontalText = currentText.replace(/\n/g, '')
                textObj.set('text', horizontalText)
              }
            }
            
            if (updates.shadow) {
              if (updates.shadow.enabled) {
                textObj.set('shadow', {
                  color: updates.shadow.color,
                  blur: updates.shadow.blur,
                  offsetX: updates.shadow.offsetX,
                  offsetY: updates.shadow.offsetY,
                })
              } else {
                textObj.set('shadow', null)
              }
            }
            
            canvas.renderAll()
          }
        }
      },
      deleteSelectedText: () => {
        if (canvas) {
          const activeObject = canvas.getActiveObject()
          if (activeObject && (activeObject.type === 'text' || activeObject.type === 'i-text')) {
            canvas.remove(activeObject)
            canvas.renderAll()
          }
        }
      },
      updateBackground: (background: BackgroundConfig) => {
        if (canvas) {
          // 既存の背景画像とオーバーレイを削除
          if (background.type === 'color' || (background.type === 'image' && !background.image)) {
            const objects = canvas.getObjects()
            objects.forEach((obj) => {
              if (obj.type === 'image' || (obj.type === 'rect' && !obj.selectable)) {
                canvas.remove(obj)
              }
            })
          }
          
          if (background.type === 'color') {
            canvas.backgroundColor = background.color || '#ffffff'
            canvas.renderAll()
          } else if (background.type === 'gradient' && background.gradient) {
            const { colors, direction } = background.gradient
            let coords: { x1: number; y1: number; x2: number; y2: number }
            
            switch (direction) {
              case 'horizontal':
                coords = { x1: 0, y1: 0, x2: CANVAS_CONFIG.WIDTH, y2: 0 }
                break
              case 'vertical':
                coords = { x1: 0, y1: 0, x2: 0, y2: CANVAS_CONFIG.HEIGHT }
                break
              case 'diagonal':
                coords = { x1: 0, y1: 0, x2: CANVAS_CONFIG.WIDTH, y2: CANVAS_CONFIG.HEIGHT }
                break
              default:
                coords = { x1: 0, y1: 0, x2: CANVAS_CONFIG.WIDTH, y2: 0 }
            }

            const gradient = new Gradient({
              type: 'linear',
              coords,
              colorStops: [
                { offset: 0, color: colors[0] },
                { offset: 1, color: colors[1] },
              ],
            })
            
            canvas.backgroundColor = gradient
            canvas.renderAll()
          } else if (background.type === 'image' && background.image) {
            // 既存の背景画像とオーバーレイを削除
            const objects = canvas.getObjects()
            objects.forEach((obj) => {
              if (obj.type === 'image' || (obj.type === 'rect' && !obj.selectable)) {
                canvas.remove(obj)
              }
            })
            
            // 実際の画像ファイル処理
            FabricImage.fromURL(background.image).then((img) => {
              // アスペクト比を保ちながらキャンバス全体をカバーするスケールを計算（cover方式）
              const canvasAspect = CANVAS_CONFIG.WIDTH / CANVAS_CONFIG.HEIGHT
              const imageAspect = (img.width || 1) / (img.height || 1)
              
              let scaleX, scaleY
              
              if (imageAspect > canvasAspect) {
                // 画像が横長の場合、高さに合わせてスケール
                scaleY = CANVAS_CONFIG.HEIGHT / (img.height || 1)
                scaleX = scaleY
              } else {
                // 画像が縦長の場合、幅に合わせてスケール
                scaleX = CANVAS_CONFIG.WIDTH / (img.width || 1)
                scaleY = scaleX
              }
              
              // 位置設定に基づいて配置を決定
              const position = background.imagePosition || 'center'
              let left: number, top: number, originX: string, originY: string
              
              switch (position) {
                case 'left':
                  left = 0
                  top = CANVAS_CONFIG.HEIGHT / 2
                  originX = 'left'
                  originY = 'center'
                  break
                case 'right':
                  left = CANVAS_CONFIG.WIDTH
                  top = CANVAS_CONFIG.HEIGHT / 2
                  originX = 'right'
                  originY = 'center'
                  break
                case 'top':
                  left = CANVAS_CONFIG.WIDTH / 2
                  top = 0
                  originX = 'center'
                  originY = 'top'
                  break
                case 'bottom':
                  left = CANVAS_CONFIG.WIDTH / 2
                  top = CANVAS_CONFIG.HEIGHT
                  originX = 'center'
                  originY = 'bottom'
                  break
                case 'center':
                default:
                  left = CANVAS_CONFIG.WIDTH / 2
                  top = CANVAS_CONFIG.HEIGHT / 2
                  originX = 'center'
                  originY = 'center'
                  break
              }
              
              img.set({
                scaleX,
                scaleY,
                left,
                top,
                originX,
                originY,
                selectable: false,
                evented: false,
              })
              
              // 画像を最背面に挿入
              canvas.insertAt(0, img)
              
              // オーバーレイを追加（設定されている場合）
              if (background.overlay && background.overlay > 0) {
                const overlay = new Rect({
                  left: 0,
                  top: 0,
                  width: CANVAS_CONFIG.WIDTH,
                  height: CANVAS_CONFIG.HEIGHT,
                  fill: `rgba(0, 0, 0, ${background.overlay})`,
                  selectable: false,
                  evented: false,
                  originX: 'left',
                  originY: 'top',
                })
                
                // オーバーレイを画像の上に配置
                canvas.insertAt(1, overlay)
              }
              
              // 既存のすべてのテキストを最前面に移動
              setTimeout(() => {
                const allObjects = canvas.getObjects()
                allObjects.forEach((obj) => {
                  if (obj.type === 'text' || obj.type === 'i-text') {
                    canvas.bringObjectToFront(obj)
                  }
                })
                canvas.renderAll()
              }, 10)
              
              canvas.renderAll()
            }).catch((error) => {
              console.error('Failed to load image:', error)
              // エラーの場合は白背景に戻す
              canvas.backgroundColor = '#ffffff'
              canvas.renderAll()
            })
          }
        }
      },
      exportAsPNG: () => {
        if (canvas) {
          const dataURL = exportCanvasAsPNG(canvas)
          const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-')
          downloadImage(dataURL, `x-banner-${timestamp}.png`)
        }
      },
      getCanvas: () => canvas,
    }))

    useEffect(() => {
      if (canvas) {
        // 既存のテキストオブジェクトがあるかチェック
        const existingTexts = canvas.getObjects().filter(obj => obj.type === 'text' || obj.type === 'i-text')
        
        // 初回のみサンプルテキストを追加
        if (existingTexts.length === 0) {
          const text = new IText('Hello World!', {
            left: DEFAULT_TEXT_CONFIG.LEFT,
            top: DEFAULT_TEXT_CONFIG.TOP,
            fontFamily: DEFAULT_TEXT_CONFIG.FONT_FAMILY,
            fontSize: DEFAULT_TEXT_CONFIG.FONT_SIZE,
            fill: DEFAULT_TEXT_CONFIG.COLOR,
            originX: 'center',
            originY: 'center',
            editable: true,
          })
          canvas.add(text)
          canvas.bringObjectToFront(text) // 初期テキストを最前面に
        }
        
        canvas.renderAll()
        
        // テキスト編集機能を有効にする
        canvas.defaultCursor = 'default'
        canvas.hoverCursor = 'pointer'
        canvas.moveCursor = 'move'
        
        // 既存のイベントリスナーをクリア
        canvas.off('text:changed')
        canvas.off('text:editing:exited')
        
        // テキスト編集イベントリスナーを追加
        canvas.on('text:changed', (e) => {
          const textObj = e.target as IText
          if (textObj && (textObj.type === 'text' || textObj.type === 'i-text') && onTextChanged) {
            onTextChanged(textObj.text || '')
          }
        })
        
        // テキスト編集終了時のイベント（フォーカスアウト）
        canvas.on('text:editing:exited', (e) => {
          const textObj = e.target as IText
          if (textObj && (textObj.type === 'text' || textObj.type === 'i-text') && onTextChanged) {
            onTextChanged(textObj.text || '')
          }
        })
      }
    }, [canvas, onTextChanged])

    useEffect(() => {
      const handleResize = () => {
        setWindowWidth(window.innerWidth)
      }

      if (typeof window !== 'undefined') {
        setWindowWidth(window.innerWidth)
        window.addEventListener('resize', handleResize)
        return () => window.removeEventListener('resize', handleResize)
      }
    }, [])

    // レスポンシブサイズ計算（アスペクト比3:1を維持）
    const getResponsiveSize = () => {
      if (!windowWidth) return { width: 900, height: 300 }
      
      const padding = 48 // コンテナの左右パディング
      const maxWidth = windowWidth - padding
      
      // ブレークポイントに応じたサイズ調整
      let targetWidth: number
      
      if (windowWidth >= 1024) {
        // Desktop: 最大900px
        targetWidth = Math.min(900, maxWidth)
      } else if (windowWidth >= 768) {
        // Tablet: 画面幅の85%
        targetWidth = Math.min(maxWidth * 0.85, 750)
      } else {
        // Mobile: 画面幅の90%
        targetWidth = Math.min(maxWidth * 0.9, 600)
      }
      
      // アスペクト比3:1を維持
      const targetHeight = targetWidth / 3
      
      return { 
        width: Math.round(targetWidth), 
        height: Math.round(targetHeight) 
      }
    }

    const { width: displayWidth, height: displayHeight } = getResponsiveSize()

    useEffect(() => {
      // fabric.jsのcanvas-containerとcanvasのスタイルを上書き
      if (canvasRef.current && canvas) {
        const wrapper = canvasRef.current.parentElement
        if (wrapper && wrapper.classList.contains('canvas-container')) {
          wrapper.style.width = `${displayWidth}px`
          wrapper.style.height = `${displayHeight}px`
          wrapper.style.transform = 'none'
        }
        
        // キャンバスのズーム比率を計算（実際のサイズ1500x500に対する表示サイズの比率）
        const scaleX = displayWidth / CANVAS_CONFIG.WIDTH
        const scaleY = displayHeight / CANVAS_CONFIG.HEIGHT
        const scale = Math.min(scaleX, scaleY)
        
        // Fabric.jsキャンバスのズーム設定
        canvas.setZoom(scale)
        canvas.setDimensions({ width: displayWidth, height: displayHeight })
        
        // ズーム後もテキスト編集を有効に保つ
        canvas.forEachObject((obj) => {
          if (obj.type === 'text' || obj.type === 'i-text') {
            const textObj = obj as IText
            textObj.set('editable', true)
            textObj.set('selectable', true)
          }
        })
        
        // canvasのスタイルを直接設定
        const canvases = wrapper?.querySelectorAll('canvas')
        canvases?.forEach(canvasEl => {
          canvasEl.style.width = `${displayWidth}px`
          canvasEl.style.height = `${displayHeight}px`
        })
        
        canvas.renderAll()
      }
    }, [canvas, displayWidth, displayHeight, windowWidth])

    return (
      <div className={className} style={{ width: `${displayWidth}px`, height: `${displayHeight}px` }}>
        <div 
          className="border border-gray-300 rounded overflow-hidden bg-white shadow-sm" 
          style={{ 
            width: `${displayWidth}px`,
            height: `${displayHeight}px`,
            overflow: 'hidden',
          }}
        >
          <canvas
            ref={canvasRef}
            style={{
              display: 'block',
            }}
          />
        </div>
      </div>
    )
  }
)