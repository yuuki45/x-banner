import { useEffect, useImperativeHandle, forwardRef, useState, useRef } from 'react'
import { Canvas, IText, Gradient, FabricImage, Rect, Circle, Triangle, Polygon, Path, Group } from 'fabric'
import { useCanvas } from '../../hooks/useCanvas'
import { CANVAS_CONFIG, DEFAULT_TEXT_CONFIG } from '../../constants/canvas'
import { exportCanvasAsPNG, downloadImage } from '../../utils/canvas'
import { ShapeType } from '../../constants/shapes'
import { IconOption } from '../../constants/icons'

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
  fontStyle?: 'normal' | 'italic'
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
  deleteSelectedObject: () => void
  addShape: (shapeType: ShapeType, color: string, size: number) => void
  addIcon: (icon: IconOption, color: string, size: number) => void
  exportAsPNG: () => void
  getCanvas: () => Canvas | null
  // Undo/Redo機能
  undo: () => void
  redo: () => void
  canUndo: () => boolean
  canRedo: () => boolean
  // レイヤー順序変更機能
  bringToFront: () => void
  sendToBack: () => void
  bringForward: () => void
  sendBackward: () => void
  // 自動保存機能
  saveToJSON: () => string
  loadFromJSON: (json: string) => Promise<void>
  // スナップ機能
  enableSnapping: () => void
  disableSnapping: () => void
}

export const BannerCanvas = forwardRef<BannerCanvasRef, BannerCanvasProps>(
  ({ className = '', onTextChanged }, ref) => {
    const { canvasRef, canvas } = useCanvas()
    const [windowWidth, setWindowWidth] = useState(0)

    // Undo/Redo履歴管理
    const historyStack = useRef<string[]>([])
    const redoStack = useRef<string[]>([])
    const isLoadingHistory = useRef(false)
    const historyStep = useRef(0)

    // スナップ機能の状態
    const [isSnappingEnabled, setIsSnappingEnabled] = useState(true)
    const snapThreshold = 10 // スナップする距離（px）
    const guideLineRef = useRef<{
      vertical: Rect | null
      horizontal: Rect | null
    }>({ vertical: null, horizontal: null })

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
            if (updates.fontStyle) textObj.set('fontStyle', updates.fontStyle)
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
      deleteSelectedObject: () => {
        if (canvas) {
          const activeObject = canvas.getActiveObject()
          if (activeObject) {
            // 背景画像やオーバーレイは削除しない
            if (activeObject.selectable !== false) {
              canvas.remove(activeObject)
              canvas.discardActiveObject()
              canvas.renderAll()
            }
          }
        }
      },
      addShape: (shapeType: ShapeType, color: string, size: number) => {
        if (!canvas) return

        let shape: Circle | Rect | Triangle | Polygon | Path | null = null
        const centerX = CANVAS_CONFIG.WIDTH / 2
        const centerY = CANVAS_CONFIG.HEIGHT / 2

        switch (shapeType) {
          case 'circle':
            shape = new Circle({
              radius: size / 2,
              fill: color,
              left: centerX,
              top: centerY,
              originX: 'center',
              originY: 'center',
            })
            break

          case 'rect':
            shape = new Rect({
              width: size,
              height: size,
              fill: color,
              left: centerX,
              top: centerY,
              originX: 'center',
              originY: 'center',
            })
            break

          case 'triangle':
            shape = new Triangle({
              width: size,
              height: size,
              fill: color,
              left: centerX,
              top: centerY,
              originX: 'center',
              originY: 'center',
            })
            break

          case 'star':
            // 星型のポイントを生成
            const starPoints: { x: number; y: number }[] = []
            const spikes = 5
            const outerRadius = size / 2
            const innerRadius = size / 4

            for (let i = 0; i < spikes * 2; i++) {
              const radius = i % 2 === 0 ? outerRadius : innerRadius
              const angle = (Math.PI * i) / spikes
              starPoints.push({
                x: radius * Math.sin(angle),
                y: -radius * Math.cos(angle),
              })
            }

            shape = new Polygon(starPoints, {
              fill: color,
              left: centerX,
              top: centerY,
              originX: 'center',
              originY: 'center',
            })
            break

          case 'heart':
            // ハート型のSVGパス
            const heartSize = size / 100
            const heartPath = `
              M ${50 * heartSize} ${90 * heartSize}
              C ${50 * heartSize} ${90 * heartSize}, ${20 * heartSize} ${70 * heartSize}, ${20 * heartSize} ${45 * heartSize}
              C ${20 * heartSize} ${30 * heartSize}, ${30 * heartSize} ${20 * heartSize}, ${50 * heartSize} ${35 * heartSize}
              C ${70 * heartSize} ${20 * heartSize}, ${80 * heartSize} ${30 * heartSize}, ${80 * heartSize} ${45 * heartSize}
              C ${80 * heartSize} ${70 * heartSize}, ${50 * heartSize} ${90 * heartSize}, ${50 * heartSize} ${90 * heartSize}
              Z
            `
            shape = new Path(heartPath, {
              fill: color,
              left: centerX,
              top: centerY,
              originX: 'center',
              originY: 'center',
            })
            break
        }

        if (shape) {
          canvas.add(shape)
          canvas.setActiveObject(shape)
          canvas.renderAll()
        }
      },
      addIcon: (icon: IconOption, color: string, size: number) => {
        if (!canvas) return

        // SVGパスからFabricオブジェクトを作成
        const iconPath = new Path(icon.svgPath, {
          fill: color,
          stroke: null,
          strokeWidth: 0,
        })

        // アイコンのサイズを調整（viewBoxを考慮）
        const viewBoxSize = 24 // デフォルトのviewBoxサイズ
        const scale = size / viewBoxSize

        iconPath.set({
          scaleX: scale,
          scaleY: scale,
          left: CANVAS_CONFIG.WIDTH / 2,
          top: CANVAS_CONFIG.HEIGHT / 2,
          originX: 'center',
          originY: 'center',
        })

        canvas.add(iconPath)
        canvas.setActiveObject(iconPath)
        canvas.renderAll()
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

      // Undo/Redo機能
      undo: () => {
        if (canvas && historyStack.current.length > 0) {
          // 現在の状態をredoスタックに保存
          const currentState = JSON.stringify(canvas.toJSON())
          redoStack.current.push(currentState)

          // historyから1つ前の状態を取得
          const previousState = historyStack.current.pop()

          if (previousState) {
            isLoadingHistory.current = true
            canvas.loadFromJSON(previousState).then(() => {
              canvas.renderAll()
              isLoadingHistory.current = false
            })
          }
        }
      },
      redo: () => {
        if (canvas && redoStack.current.length > 0) {
          // 現在の状態をhistoryスタックに保存
          const currentState = JSON.stringify(canvas.toJSON())
          historyStack.current.push(currentState)

          // redoスタックから1つ取得
          const nextState = redoStack.current.pop()

          if (nextState) {
            isLoadingHistory.current = true
            canvas.loadFromJSON(nextState).then(() => {
              canvas.renderAll()
              isLoadingHistory.current = false
            })
          }
        }
      },
      canUndo: () => historyStack.current.length > 0,
      canRedo: () => redoStack.current.length > 0,

      // レイヤー順序変更機能
      bringToFront: () => {
        if (canvas) {
          const activeObject = canvas.getActiveObject()
          if (activeObject && activeObject.selectable !== false) {
            canvas.bringObjectToFront(activeObject)
            canvas.renderAll()
          }
        }
      },
      sendToBack: () => {
        if (canvas) {
          const activeObject = canvas.getActiveObject()
          if (activeObject && activeObject.selectable !== false) {
            canvas.sendObjectToBack(activeObject)
            canvas.renderAll()
          }
        }
      },
      bringForward: () => {
        if (canvas) {
          const activeObject = canvas.getActiveObject()
          if (activeObject && activeObject.selectable !== false) {
            canvas.bringObjectForward(activeObject)
            canvas.renderAll()
          }
        }
      },
      sendBackward: () => {
        if (canvas) {
          const activeObject = canvas.getActiveObject()
          if (activeObject && activeObject.selectable !== false) {
            canvas.sendObjectBackwards(activeObject)
            canvas.renderAll()
          }
        }
      },

      // 自動保存機能
      saveToJSON: () => {
        if (canvas) {
          return JSON.stringify(canvas.toJSON())
        }
        return ''
      },
      loadFromJSON: async (json: string) => {
        if (canvas && json) {
          try {
            isLoadingHistory.current = true
            await canvas.loadFromJSON(JSON.parse(json))
            canvas.renderAll()
            isLoadingHistory.current = false
          } catch (error) {
            console.error('Failed to load canvas from JSON:', error)
            isLoadingHistory.current = false
          }
        }
      },

      // スナップ機能
      enableSnapping: () => {
        setIsSnappingEnabled(true)
      },
      disableSnapping: () => {
        setIsSnappingEnabled(false)
      },
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

    // Canvas変更時に履歴を保存
    useEffect(() => {
      if (canvas && !isLoadingHistory.current) {
        const saveHistory = () => {
          if (isLoadingHistory.current) return

          const currentState = JSON.stringify(canvas.toJSON())

          // 履歴スタックに追加（最大50件まで保持）
          historyStack.current.push(currentState)
          if (historyStack.current.length > 50) {
            historyStack.current.shift()
          }

          // 新しい変更があったらredoスタックをクリア
          redoStack.current = []
        }

        // Canvas上でのオブジェクト変更を監視
        canvas.on('object:modified', saveHistory)
        canvas.on('object:added', saveHistory)
        canvas.on('object:removed', saveHistory)

        return () => {
          canvas.off('object:modified', saveHistory)
          canvas.off('object:added', saveHistory)
          canvas.off('object:removed', saveHistory)
        }
      }
    }, [canvas])

    // スナップ機能とガイドライン表示
    useEffect(() => {
      if (canvas && isSnappingEnabled) {
        const centerX = CANVAS_CONFIG.WIDTH / 2
        const centerY = CANVAS_CONFIG.HEIGHT / 2

        const showGuideLine = (isVertical: boolean) => {
          if (isVertical) {
            // 垂直ガイドライン（中央縦線）
            if (!guideLineRef.current.vertical) {
              guideLineRef.current.vertical = new Rect({
                left: centerX,
                top: 0,
                width: 2,
                height: CANVAS_CONFIG.HEIGHT,
                fill: '#00a8ff',
                selectable: false,
                evented: false,
                opacity: 0.7,
                originX: 'center',
              })
              canvas.add(guideLineRef.current.vertical)
            }
            guideLineRef.current.vertical.set('visible', true)
          } else {
            // 水平ガイドライン（中央横線）
            if (!guideLineRef.current.horizontal) {
              guideLineRef.current.horizontal = new Rect({
                left: 0,
                top: centerY,
                width: CANVAS_CONFIG.WIDTH,
                height: 2,
                fill: '#00a8ff',
                selectable: false,
                evented: false,
                opacity: 0.7,
                originY: 'center',
              })
              canvas.add(guideLineRef.current.horizontal)
            }
            guideLineRef.current.horizontal.set('visible', true)
          }
          canvas.renderAll()
        }

        const hideGuideLine = (isVertical: boolean) => {
          if (isVertical && guideLineRef.current.vertical) {
            guideLineRef.current.vertical.set('visible', false)
          } else if (!isVertical && guideLineRef.current.horizontal) {
            guideLineRef.current.horizontal.set('visible', false)
          }
          canvas.renderAll()
        }

        const handleObjectMoving = (e: any) => {
          const obj = e.target
          if (!obj || obj.selectable === false) return

          const objCenterX = obj.left
          const objCenterY = obj.top

          // 水平方向（X軸）の中央揃えスナップ
          if (Math.abs(objCenterX - centerX) < snapThreshold) {
            obj.set('left', centerX)
            showGuideLine(true)
          } else {
            hideGuideLine(true)
          }

          // 垂直方向（Y軸）の中央揃えスナップ
          if (Math.abs(objCenterY - centerY) < snapThreshold) {
            obj.set('top', centerY)
            showGuideLine(false)
          } else {
            hideGuideLine(false)
          }

          obj.setCoords()
        }

        const handleObjectModified = () => {
          hideGuideLine(true)
          hideGuideLine(false)
        }

        canvas.on('object:moving', handleObjectMoving)
        canvas.on('object:modified', handleObjectModified)

        return () => {
          canvas.off('object:moving', handleObjectMoving)
          canvas.off('object:modified', handleObjectModified)
          // ガイドラインを削除
          if (guideLineRef.current.vertical) {
            canvas.remove(guideLineRef.current.vertical)
            guideLineRef.current.vertical = null
          }
          if (guideLineRef.current.horizontal) {
            canvas.remove(guideLineRef.current.horizontal)
            guideLineRef.current.horizontal = null
          }
        }
      }
    }, [canvas, isSnappingEnabled])

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