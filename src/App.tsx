import { useRef, useState, useEffect } from 'react'
import { BannerCanvas, BannerCanvasRef } from './components/Canvas'
import { TextEditor } from './components/TextEditor'
import { BackgroundPicker } from './components/BackgroundPicker'
import { ExportControls } from './components/ExportControls'

function App() {
  const canvasRef = useRef<BannerCanvasRef>(null)
  const [isPreviewSticky, setIsPreviewSticky] = useState(() => {
    const saved = localStorage.getItem('preview-sticky')
    return saved !== null ? JSON.parse(saved) : true
  })

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

  const handleDeleteText = () => {
    canvasRef.current?.deleteSelectedText()
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

  const handleTextChanged = (text: string) => {
    // キャンバス上で直接編集されたテキストがここで通知される
    // 必要に応じて他のUIコンポーネントと同期可能
    console.log('Text changed directly on canvas:', text)
  }

  const togglePreviewSticky = () => {
    const newValue = !isPreviewSticky
    setIsPreviewSticky(newValue)
    localStorage.setItem('preview-sticky', JSON.stringify(newValue))
  }

  useEffect(() => {
    localStorage.setItem('preview-sticky', JSON.stringify(isPreviewSticky))
  }, [isPreviewSticky])

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 sm:py-8">
          <h1 className="text-2xl sm:text-3xl font-semibold text-gray-900 tracking-tight">X Banner Studio</h1>
          <p className="text-gray-600 mt-1 sm:mt-2 text-base sm:text-lg">
            無料でXプロフィールバナーを作成
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-6">
        {/* Canvas Section */}
        <section className={`bg-white rounded-lg shadow-sm border border-gray-200 mb-4 sm:mb-6 ${isPreviewSticky ? 'sticky top-4 z-10' : ''}`} aria-label="バナープレビュー">
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
              <div>📝 テキストは複数追加できます</div>
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
                onDeleteText={handleDeleteText}
              />
            </section>
            
            {/* Background Controls */}
            <section className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6" aria-label="背景設定">
              <BackgroundPicker onBackgroundChange={handleBackgroundChange} />
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
