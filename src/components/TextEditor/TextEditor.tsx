import React, { useState } from 'react'
import { FontSelector } from '../FontSelector'

interface TextEditorProps {
  onAddText: (text: string) => void
  onUpdateText: (updates: TextUpdate) => void
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

export const TextEditor: React.FC<TextEditorProps> = ({
  onAddText,
  onUpdateText,
}) => {
  const [newText, setNewText] = useState('')
  const [fontSize, setFontSize] = useState(48)
  const [textColor, setTextColor] = useState('#000000')
  const [fontWeight, setFontWeight] = useState('400')
  const [fontFamily, setFontFamily] = useState('Noto Sans JP')
  const [fontStyle, setFontStyle] = useState<'normal' | 'italic'>('normal')
  const [shadowEnabled, setShadowEnabled] = useState(false)
  const [shadowColor, setShadowColor] = useState('#000000')
  const [shadowBlur, setShadowBlur] = useState(4)
  const [shadowOffsetX, setShadowOffsetX] = useState(2)
  const [shadowOffsetY, setShadowOffsetY] = useState(2)
  const [isVertical, setIsVertical] = useState(false)

  const handleAddText = () => {
    if (newText.trim()) {
      onAddText(newText)
      setNewText('')
    }
  }


  const handleFontChange = (newFontFamily: string, newFontWeight: string) => {
    setFontFamily(newFontFamily)
    setFontWeight(newFontWeight)
    onUpdateText({ fontFamily: newFontFamily, fontWeight: newFontWeight })
  }

  const handleShadowUpdate = () => {
    onUpdateText({
      shadow: {
        enabled: shadowEnabled,
        color: shadowColor,
        blur: shadowBlur,
        offsetX: shadowOffsetX,
        offsetY: shadowOffsetY,
      }
    })
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium text-gray-900 mb-4">テキスト設定</h3>
      
      {/* テキスト追加 */}
      <div className="mb-4">
        <div className="flex gap-2">
          <input
            type="text"
            value={newText}
            onChange={(e) => setNewText(e.target.value)}
            placeholder="テキストを入力..."
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
          />
          <button
            onClick={handleAddText}
            className="px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm font-medium"
          >
            追加
          </button>
        </div>
      </div>

      {/* フォントサイズ */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          サイズ: <span className="font-semibold text-blue-600">{fontSize}px</span>
        </label>
        <input
          type="range"
          min="12"
          max="120"
          value={fontSize}
          onChange={(e) => {
            const size = parseInt(e.target.value)
            setFontSize(size)
            onUpdateText({ fontSize: size })
          }}
          className="w-full slider"
        />
      </div>

      {/* テキスト色 */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">色</label>
        <div className="flex gap-2 items-center">
          <input
            type="color"
            value={textColor}
            onChange={(e) => {
              const color = e.target.value
              setTextColor(color)
              onUpdateText({ color })
            }}
            className="w-10 h-8 border border-gray-300 rounded cursor-pointer"
          />
          <input
            type="text"
            value={textColor}
            onChange={(e) => {
              const color = e.target.value
              setTextColor(color)
              onUpdateText({ color })
            }}
            className="flex-1 px-2 py-1 border border-gray-300 rounded text-xs font-mono focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="#000000"
          />
        </div>
      </div>

      {/* 縦書き設定 */}
      <div className="mb-4">
        <div className="flex items-center">
          <input
            type="checkbox"
            id="vertical-text"
            checked={isVertical}
            onChange={(e) => {
              const vertical = e.target.checked
              setIsVertical(vertical)
              onUpdateText({ isVertical: vertical })
            }}
            className="mr-2"
          />
          <label htmlFor="vertical-text" className="text-sm font-medium text-gray-700">
            縦書きモード
          </label>
        </div>
      </div>

      {/* 斜体設定 */}
      <div className="mb-4">
        <div className="flex items-center">
          <input
            type="checkbox"
            id="italic-text"
            checked={fontStyle === 'italic'}
            onChange={(e) => {
              const style = e.target.checked ? 'italic' : 'normal'
              setFontStyle(style)
              onUpdateText({ fontStyle: style })
            }}
            className="mr-2"
          />
          <label htmlFor="italic-text" className="text-sm font-medium text-gray-700">
            斜体（イタリック）
          </label>
        </div>
      </div>

      {/* テキストシャドウ */}
      <div className="mb-4">
        <div className="flex items-center mb-2">
          <input
            type="checkbox"
            id="shadow-enabled"
            checked={shadowEnabled}
            onChange={(e) => {
              const enabled = e.target.checked
              setShadowEnabled(enabled)
              onUpdateText({
                shadow: {
                  enabled,
                  color: shadowColor,
                  blur: shadowBlur,
                  offsetX: shadowOffsetX,
                  offsetY: shadowOffsetY,
                }
              })
            }}
            className="mr-2"
          />
          <label htmlFor="shadow-enabled" className="text-sm font-medium text-gray-700">
            テキストシャドウ
          </label>
        </div>

        {shadowEnabled && (
          <div className="space-y-3 pl-6 border-l-2 border-gray-200">
            {/* シャドウカラー */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">シャドウの色</label>
              <div className="flex gap-2 items-center">
                <input
                  type="color"
                  value={shadowColor}
                  onChange={(e) => {
                    const color = e.target.value
                    setShadowColor(color)
                    handleShadowUpdate()
                  }}
                  className="w-8 h-6 border border-gray-300 rounded cursor-pointer"
                />
                <input
                  type="text"
                  value={shadowColor}
                  onChange={(e) => {
                    const color = e.target.value
                    setShadowColor(color)
                    handleShadowUpdate()
                  }}
                  className="flex-1 px-2 py-1 border border-gray-300 rounded text-xs font-mono focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="#000000"
                />
              </div>
            </div>

            {/* ぼかし強度 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                ぼかし: <span className="font-semibold text-blue-600">{shadowBlur}px</span>
              </label>
              <input
                type="range"
                min="0"
                max="20"
                value={shadowBlur}
                onChange={(e) => {
                  const blur = parseInt(e.target.value)
                  setShadowBlur(blur)
                  handleShadowUpdate()
                }}
                className="w-full slider"
              />
            </div>

            {/* X方向オフセット */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                横方向: <span className="font-semibold text-blue-600">{shadowOffsetX}px</span>
              </label>
              <input
                type="range"
                min="-20"
                max="20"
                value={shadowOffsetX}
                onChange={(e) => {
                  const offsetX = parseInt(e.target.value)
                  setShadowOffsetX(offsetX)
                  handleShadowUpdate()
                }}
                className="w-full slider"
              />
            </div>

            {/* Y方向オフセット */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                縦方向: <span className="font-semibold text-blue-600">{shadowOffsetY}px</span>
              </label>
              <input
                type="range"
                min="-20"
                max="20"
                value={shadowOffsetY}
                onChange={(e) => {
                  const offsetY = parseInt(e.target.value)
                  setShadowOffsetY(offsetY)
                  handleShadowUpdate()
                }}
                className="w-full slider"
              />
            </div>
          </div>
        )}
      </div>

      {/* フォント選択 */}
      <div className="border-t border-gray-200 pt-4">
        <FontSelector
          currentFont={fontFamily}
          currentWeight={fontWeight}
          onFontChange={handleFontChange}
        />
      </div>
    </div>
  )
}