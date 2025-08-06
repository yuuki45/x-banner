import React, { useState } from 'react'

interface ExportControlsProps {
  onExport: () => void
}

export const ExportControls: React.FC<ExportControlsProps> = ({ onExport }) => {
  const [isExporting, setIsExporting] = useState(false)

  const handleExport = async () => {
    setIsExporting(true)
    try {
      await onExport()
    } finally {
      setIsExporting(false)
    }
  }

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium text-gray-900">出力設定</h3>
      
      <div className="space-y-4">
        <div className="bg-gray-50 p-4 rounded-lg border">
          <div className="mb-4">
            <h4 className="font-medium text-gray-900 mb-1">PNG出力</h4>
            <p className="text-sm text-gray-600">高品質でエクスポート</p>
          </div>
            
          <div className="bg-white p-3 rounded border mb-4">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">出力サイズ</span>
              <span className="font-mono text-gray-900">1500×500px</span>
            </div>
            <div className="flex items-center justify-between text-sm mt-2">
              <span className="text-gray-600">フォーマット</span>
              <span className="text-gray-900">PNG</span>
            </div>
          </div>
            
          <button
            onClick={handleExport}
            disabled={isExporting}
            className={`w-full px-4 py-3 rounded-md font-medium transition-colors ${
              isExporting
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'
            }`}
          >
            {isExporting ? (
              <div className="flex items-center justify-center gap-2">
                <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
                <span>出力中...</span>
              </div>
            ) : (
              'バナーをダウンロード'
            )}
          </button>
        </div>
        
        <div className="bg-gray-50 p-4 rounded-lg border">
          <div className="mb-4">
            <h4 className="font-medium text-gray-900 mb-1">SNSシェア</h4>
            <p className="text-sm text-gray-600">作品をシェア</p>
          </div>
          
          <button
            onClick={() => {
              const text = 'X Banner Studioで素敵なプロフィールバナーを作成しました！'
              const hashtags = 'XBannerStudio,Twitter,プロフィール,バナー,デザイン'
              const url = window.location.href
              const shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&hashtags=${encodeURIComponent(hashtags)}&url=${encodeURIComponent(url)}`
              window.open(shareUrl, '_blank', 'width=550,height=420')
            }}
            className="w-full px-4 py-3 bg-black text-white rounded-md font-medium hover:bg-gray-800 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 flex items-center justify-center gap-2"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
            </svg>
            Xでシェア
          </button>
        </div>
        
        <div className="bg-blue-50 rounded-md p-3 border border-blue-200">
          <p className="text-sm font-medium text-gray-700 mb-2">使用方法</p>
          <div className="text-xs text-gray-600 space-y-1">
            <p>• ダウンロード後、Xのプロフィール設定へ</p>
            <p>• バナー画像として直接アップロード可能</p>
          </div>
        </div>
      </div>
    </div>
  )
}