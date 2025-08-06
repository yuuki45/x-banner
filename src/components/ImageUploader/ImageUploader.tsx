import React, { useRef, useState } from 'react'

interface ImageUploaderProps {
  onImageUpload: (imageUrl: string, overlay?: number, position?: 'left' | 'center' | 'right' | 'top' | 'bottom') => void
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageUpload }) => {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [dragOver, setDragOver] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [overlayOpacity, setOverlayOpacity] = useState(0)
  const [hasImage, setHasImage] = useState(false)
  const [currentImageUrl, setCurrentImageUrl] = useState('')
  const [imagePosition, setImagePosition] = useState<'left' | 'center' | 'right' | 'top' | 'bottom'>('center')

  const handleFileSelect = (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('画像ファイルを選択してください')
      return
    }

    // ファイルサイズチェック（5MB制限）
    if (file.size > 5 * 1024 * 1024) {
      alert('ファイルサイズは5MB以下にしてください')
      return
    }

    setUploading(true)

    const reader = new FileReader()
    reader.onload = (e) => {
      if (e.target?.result) {
        const imageUrl = e.target.result as string
        setHasImage(true)
        setCurrentImageUrl(imageUrl)
        onImageUpload(imageUrl, overlayOpacity, imagePosition)
      }
      setUploading(false)
    }
    reader.onerror = () => {
      alert('ファイルの読み込みに失敗しました')
      setUploading(false)
    }
    reader.readAsDataURL(file)
  }

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      handleFileSelect(file)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)

    const file = e.dataTransfer.files[0]
    if (file) {
      handleFileSelect(file)
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
  }

  const handleClick = () => {
    fileInputRef.current?.click()
  }

  return (
    <div className="space-y-4">
      <h4 className="font-medium text-gray-900">背景画像</h4>
      
      <div
        onClick={handleClick}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={`
          border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors
          ${dragOver 
            ? 'border-blue-400 bg-blue-50' 
            : 'border-gray-300 hover:border-gray-400'
          }
          ${uploading ? 'opacity-50 cursor-not-allowed' : ''}
        `}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileInputChange}
          className="hidden"
          disabled={uploading}
        />
        
        {uploading ? (
          <div className="flex items-center justify-center gap-2">
            <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            <span className="text-gray-600">アップロード中...</span>
          </div>
        ) : (
          <div>
            <div className="mb-2">
              <svg
                className="mx-auto h-12 w-12 text-gray-400"
                stroke="currentColor"
                fill="none"
                viewBox="0 0 48 48"
              >
                <path
                  d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <p className="text-sm text-gray-600 mb-1">
              クリックまたはドラッグ&ドロップで画像をアップロード
            </p>
            <p className="text-xs text-gray-500">
              PNG, JPG, GIF対応（最大5MB）
            </p>
          </div>
        )}
      </div>

      {/* 画像位置設定 */}
      <div className="space-y-3 p-3 bg-gray-50 rounded-md mb-4">
        <label className="block text-sm font-medium text-gray-700">
          画像の位置
        </label>
        <div className="grid grid-cols-3 gap-2">
          <button
            onClick={() => {
              if (hasImage) {
                setImagePosition('left')
                onImageUpload(currentImageUrl, overlayOpacity, 'left')
              }
            }}
            disabled={!hasImage}
            className={`px-3 py-2 rounded text-sm font-medium transition-colors ${
              !hasImage
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : imagePosition === 'left'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            左寄せ
          </button>
          <button
            onClick={() => {
              if (hasImage) {
                setImagePosition('center')
                onImageUpload(currentImageUrl, overlayOpacity, 'center')
              }
            }}
            disabled={!hasImage}
            className={`px-3 py-2 rounded text-sm font-medium transition-colors ${
              !hasImage
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : imagePosition === 'center'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            中央
          </button>
          <button
            onClick={() => {
              if (hasImage) {
                setImagePosition('right')
                onImageUpload(currentImageUrl, overlayOpacity, 'right')
              }
            }}
            disabled={!hasImage}
            className={`px-3 py-2 rounded text-sm font-medium transition-colors ${
              !hasImage
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : imagePosition === 'right'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            右寄せ
          </button>
        </div>
        <div className="grid grid-cols-2 gap-2 mt-2">
          <button
            onClick={() => {
              if (hasImage) {
                setImagePosition('top')
                onImageUpload(currentImageUrl, overlayOpacity, 'top')
              }
            }}
            disabled={!hasImage}
            className={`px-3 py-2 rounded text-sm font-medium transition-colors ${
              !hasImage
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : imagePosition === 'top'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            上寄せ
          </button>
          <button
            onClick={() => {
              if (hasImage) {
                setImagePosition('bottom')
                onImageUpload(currentImageUrl, overlayOpacity, 'bottom')
              }
            }}
            disabled={!hasImage}
            className={`px-3 py-2 rounded text-sm font-medium transition-colors ${
              !hasImage
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : imagePosition === 'bottom'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            下寄せ
          </button>
        </div>
      </div>

      {/* オーバーレイ設定 */}
      <div className="space-y-3 p-3 bg-gray-50 rounded-md">
        <label className="block text-sm font-medium text-gray-700">
          オーバーレイの透明度: <span className="font-semibold text-blue-600">{Math.round(overlayOpacity * 100)}%</span>
        </label>
        <input
          type="range"
          min="0"
          max="0.7"
          step="0.1"
          value={overlayOpacity}
          onChange={(e) => {
            const newOpacity = parseFloat(e.target.value)
            setOverlayOpacity(newOpacity)
            if (hasImage) {
              onImageUpload(currentImageUrl, newOpacity, imagePosition) // 現在の画像にオーバーレイを適用
            }
          }}
          disabled={!hasImage}
          className={`w-full slider ${!hasImage ? 'opacity-50 cursor-not-allowed' : ''}`}
        />
        <p className="text-xs text-gray-500">テキストを読みやすくするため、画像の上に薄暗いオーバーレイをかけます</p>
      </div>

      {/* リセットボタン */}
      <div>
        <button
          onClick={() => {
            setHasImage(false)
            setOverlayOpacity(0)
            setCurrentImageUrl('')
            setImagePosition('center')
            onImageUpload('')
          }}
          className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors text-sm font-medium"
        >
          背景をリセット
        </button>
      </div>
    </div>
  )
}