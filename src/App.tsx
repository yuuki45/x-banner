import { useRef, useState, useEffect } from 'react'
import { BannerCanvas, BannerCanvasRef } from './components/Canvas'
import { TextEditor } from './components/TextEditor'
import { BackgroundPicker } from './components/BackgroundPicker'
import { ShapeInserter } from './components/ShapeInserter'
import { IconInserter } from './components/IconInserter'
import { ObjectControls } from './components/ObjectControls'
import { ExportControls } from './components/ExportControls'
import { KeyboardShortcutsHelp } from './components/KeyboardShortcutsHelp'
import { ShapeType } from './constants/shapes'
import { IconOption } from './constants/icons'

function App() {
  const canvasRef = useRef<BannerCanvasRef>(null)
  const [isPreviewSticky, setIsPreviewSticky] = useState(() => {
    const saved = localStorage.getItem('preview-sticky')
    return saved !== null ? JSON.parse(saved) : true
  })
  const [canUndo, setCanUndo] = useState(false)
  const [canRedo, setCanRedo] = useState(false)
  const [lastSaved, setLastSaved] = useState<Date | null>(null)
  const [showRestoreDialog, setShowRestoreDialog] = useState(false)
  const [showShortcutsHelp, setShowShortcutsHelp] = useState(false)

  const handleAddText = (text: string) => {
    canvasRef.current?.addText(text)
  }

  const handleUpdateText = (updates: {
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
  }) => {
    canvasRef.current?.updateSelectedText(updates)
  }

  const handleBackgroundChange = (background: {
    type: 'color' | 'gradient' | 'image'
    color?: string
    gradient?: {
      colors: string[]
      direction: 'horizontal' | 'vertical' | 'diagonal'
    }
    image?: string
    overlay?: number
    imagePosition?: 'left' | 'center' | 'right' | 'top' | 'bottom'
  }) => {
    canvasRef.current?.updateBackground(background)
  }

  const handleExport = () => {
    canvasRef.current?.exportAsPNG()
  }

  const handleAddShape = (shapeType: ShapeType, color: string, size: number) => {
    canvasRef.current?.addShape(shapeType, color, size)
  }

  const handleAddIcon = (icon: IconOption, color: string, size: number) => {
    canvasRef.current?.addIcon(icon, color, size)
  }

  const handleDeleteSelected = () => {
    canvasRef.current?.deleteSelectedObject()
    updateUndoRedoState()
  }

  const handleUndo = () => {
    canvasRef.current?.undo()
    updateUndoRedoState()
  }

  const handleRedo = () => {
    canvasRef.current?.redo()
    updateUndoRedoState()
  }

  const handleBringToFront = () => {
    canvasRef.current?.bringToFront()
  }

  const handleSendToBack = () => {
    canvasRef.current?.sendToBack()
  }

  const handleBringForward = () => {
    canvasRef.current?.bringForward()
  }

  const handleSendBackward = () => {
    canvasRef.current?.sendBackward()
  }

  const updateUndoRedoState = () => {
    setCanUndo(canvasRef.current?.canUndo() ?? false)
    setCanRedo(canvasRef.current?.canRedo() ?? false)
  }

  const handleTextChanged = (text: string) => {
    // キャンバス上で直接編集されたテキストがここで通知される
    // 必要に応じて他のUIコンポーネントと同期可能
    console.log('Text changed directly on canvas:', text)
    updateUndoRedoState()
  }

  // 自動保存機能
  const saveCanvas = () => {
    const json = canvasRef.current?.saveToJSON()
    if (json) {
      localStorage.setItem('banner-draft', json)
      const timestamp = new Date().toISOString()
      localStorage.setItem('banner-draft-timestamp', timestamp)
      setLastSaved(new Date(timestamp))
    }
  }

  const restoreCanvas = async () => {
    const draft = localStorage.getItem('banner-draft')
    if (draft) {
      await canvasRef.current?.loadFromJSON(draft)
      setShowRestoreDialog(false)
    }
  }

  const discardDraft = () => {
    localStorage.removeItem('banner-draft')
    localStorage.removeItem('banner-draft-timestamp')
    setShowRestoreDialog(false)
  }

  const togglePreviewSticky = () => {
    const newValue = !isPreviewSticky
    setIsPreviewSticky(newValue)
    localStorage.setItem('preview-sticky', JSON.stringify(newValue))
  }

  useEffect(() => {
    localStorage.setItem('preview-sticky', JSON.stringify(isPreviewSticky))
  }, [isPreviewSticky])

  // キーボードショートカット
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl+Z (Windows/Linux) または Cmd+Z (Mac)
      if ((e.ctrlKey || e.metaKey) && e.key === 'z' && !e.shiftKey) {
        e.preventDefault()
        handleUndo()
      }
      // Ctrl+Y (Windows/Linux) または Cmd+Shift+Z (Mac) でやり直し
      else if ((e.ctrlKey || e.metaKey) && (e.key === 'y' || (e.shiftKey && e.key === 'z'))) {
        e.preventDefault()
        handleRedo()
      }
      // Delete または Backspace で削除
      else if (e.key === 'Delete' || e.key === 'Backspace') {
        // テキスト編集中は無視
        const activeElement = document.activeElement
        if (activeElement?.tagName !== 'INPUT' && activeElement?.tagName !== 'TEXTAREA') {
          e.preventDefault()
          handleDeleteSelected()
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  // Undo/Redoの状態を定期的に更新
  useEffect(() => {
    const interval = setInterval(updateUndoRedoState, 500)
    return () => clearInterval(interval)
  }, [])

  // 自動保存（30秒ごと）
  useEffect(() => {
    const interval = setInterval(() => {
      saveCanvas()
    }, 30000) // 30秒ごと

    return () => clearInterval(interval)
  }, [])

  // 起動時の下書き復元確認
  useEffect(() => {
    const draft = localStorage.getItem('banner-draft')
    const timestamp = localStorage.getItem('banner-draft-timestamp')

    if (draft && timestamp) {
      setShowRestoreDialog(true)
    }
  }, [])

  return (
    <div className="min-h-screen bg-gray-50">
      {/* キーボードショートカットヘルプ */}
      <KeyboardShortcutsHelp
        isOpen={showShortcutsHelp}
        onClose={() => setShowShortcutsHelp(false)}
      />

      {/* 復元ダイアログ */}
      {showRestoreDialog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md mx-4 shadow-xl">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">下書きが見つかりました</h3>
            <p className="text-sm text-gray-600 mb-4">
              {localStorage.getItem('banner-draft-timestamp') &&
                new Date(localStorage.getItem('banner-draft-timestamp')!).toLocaleString('ja-JP')}
              に保存された下書きがあります。復元しますか？
            </p>
            <div className="flex gap-3">
              <button
                onClick={restoreCanvas}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-medium"
              >
                復元する
              </button>
              <button
                onClick={discardDraft}
                className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors font-medium"
              >
                破棄する
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 sm:py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl sm:text-3xl font-semibold text-gray-900 tracking-tight">X Banner Studio</h1>
              <p className="text-gray-600 mt-1 sm:mt-2 text-base sm:text-lg">
                無料でXプロフィールバナーを作成
              </p>
            </div>
            <div className="flex items-center gap-4">
              {/* ショートカットヘルプボタン */}
              <button
                onClick={() => setShowShortcutsHelp(true)}
                className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700 hover:text-gray-900 transition-colors"
                title="キーボードショートカット"
                aria-label="キーボードショートカットを表示"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </button>
              {/* 自動保存状態 */}
              {lastSaved && (
                <div className="hidden sm:flex items-center gap-2 text-sm text-gray-500">
                  <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>
                    最終保存: {lastSaved.toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-6">
        {/* Canvas Section */}
        <section className={`rounded-lg shadow-sm border border-gray-200 mb-4 sm:mb-6 ${isPreviewSticky ? 'sticky top-4 z-10 bg-white/80' : 'bg-white'}`} aria-label="バナープレビュー">
          <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-base sm:text-lg font-medium text-gray-900">プレビュー</h2>
              <div className="flex items-center gap-3">
                <button
                  onClick={togglePreviewSticky}
                  className={`flex items-center gap-2 px-3 py-1 text-xs rounded-md border transition-colors ${
                    isPreviewSticky 
                      ? 'bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100' 
                      : 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100'
                  }`}
                  title={isPreviewSticky ? "プレビュー追従をオフにする" : "プレビュー追従をオンにする"}
                >
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    {isPreviewSticky ? (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                    ) : (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                    )}
                  </svg>
                  {isPreviewSticky ? "追従ON" : "追従OFF"}
                </button>
                <span className="text-xs sm:text-sm text-gray-500 bg-gray-50 px-2 sm:px-3 py-1 rounded-md font-mono" aria-label="出力サイズ">
                  1500×500px
                </span>
              </div>
            </div>
          </div>
          <div className="p-4 sm:p-6 flex flex-col items-center">
            <div role="img" aria-label="Xバナープレビュー" className="relative">
              <BannerCanvas ref={canvasRef} onTextChanged={handleTextChanged} />
            </div>
            <div className="mt-3 text-xs text-gray-500 text-center space-y-1" role="note">
              <div>実際のサイズ: 1500×500px</div>
              <div>💡 テキストをダブルクリックで直接編集できます</div>
            </div>
          </div>
        </section>

        {/* Controls Section */}
        <section aria-label="バナー編集コントロール">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {/* Text Controls */}
            <section className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6 md:col-span-2 lg:col-span-1" aria-label="テキスト設定">
              <TextEditor
                onAddText={handleAddText}
                onUpdateText={handleUpdateText}
              />
            </section>
            
            {/* Background Controls */}
            <section className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6" aria-label="背景設定">
              <BackgroundPicker onBackgroundChange={handleBackgroundChange} />
            </section>

            {/* Shape Inserter */}
            <section className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6" aria-label="図形挿入">
              <ShapeInserter onAddShape={handleAddShape} />
            </section>

            {/* Icon Inserter */}
            <section className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6" aria-label="アイコン挿入">
              <IconInserter onAddIcon={handleAddIcon} />
            </section>

            {/* Object Controls */}
            <section className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6" aria-label="オブジェクト操作">
              <ObjectControls
                onDeleteSelected={handleDeleteSelected}
                onUndo={handleUndo}
                onRedo={handleRedo}
                canUndo={canUndo}
                canRedo={canRedo}
                onBringToFront={handleBringToFront}
                onSendToBack={handleSendToBack}
                onBringForward={handleBringForward}
                onSendBackward={handleSendBackward}
              />
            </section>

            {/* Export Controls */}
            <section className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6" aria-label="エクスポート">
              <ExportControls onExport={handleExport} />
            </section>
          </div>
        </section>
      </main>
    </div>
  )
}

export default App
