import React, { useState } from 'react'
import { ImageUploader } from '../ImageUploader'

interface BackgroundPickerProps {
  onBackgroundChange: (background: BackgroundConfig) => void
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

export const BackgroundPicker: React.FC<BackgroundPickerProps> = ({
  onBackgroundChange,
}) => {
  const [backgroundType, setBackgroundType] = useState<'color' | 'gradient' | 'image'>('color')
  const [solidColor, setSolidColor] = useState('#ffffff')
  const [gradientColor1, setGradientColor1] = useState('#3b82f6')
  const [gradientColor2, setGradientColor2] = useState('#ec4899')
  const [gradientDirection, setGradientDirection] = useState<'horizontal' | 'vertical' | 'diagonal'>('horizontal')

  const handleTypeChange = (type: 'color' | 'gradient' | 'image') => {
    setBackgroundType(type)
    if (type === 'color') {
      onBackgroundChange({
        type: 'color',
        color: solidColor,
      })
    } else if (type === 'gradient') {
      onBackgroundChange({
        type: 'gradient',
        gradient: {
          colors: [gradientColor1, gradientColor2],
          direction: gradientDirection,
        },
      })
    }
    // imageタイプの場合は何もしない（ImageUploaderで処理）
  }

  const handleImageUpload = (imageUrl: string, overlay?: number, position?: 'left' | 'center' | 'right' | 'top' | 'bottom') => {
    if (imageUrl === '') {
      // リセット時は単色に戻す
      setBackgroundType('color')
      onBackgroundChange({
        type: 'color',
        color: solidColor,
      })
    } else {
      setBackgroundType('image')
      onBackgroundChange({
        type: 'image',
        image: imageUrl,
        overlay: overlay || 0,
        imagePosition: position || 'center',
      })
    }
  }

  const handleColorChange = (color: string) => {
    setSolidColor(color)
    if (backgroundType === 'color') {
      onBackgroundChange({
        type: 'color',
        color,
      })
    }
  }

  const handleGradientChange = () => {
    if (backgroundType === 'gradient') {
      onBackgroundChange({
        type: 'gradient',
        gradient: {
          colors: [gradientColor1, gradientColor2],
          direction: gradientDirection,
        },
      })
    }
  }

  const presetColors = [
    '#ffffff', '#f3f4f6', '#e5e7eb', '#d1d5db',
    '#000000', '#374151', '#4b5563', '#6b7280',
    '#ef4444', '#f97316', '#f59e0b', '#eab308',
    '#22c55e', '#10b981', '#06b6d4', '#3b82f6',
    '#6366f1', '#8b5cf6', '#a855f7', '#ec4899',
  ]

  const presetGradients = [
    { colors: ['#3b82f6', '#ec4899'], name: 'Blue to Pink' },
    { colors: ['#f59e0b', '#ef4444'], name: 'Orange to Red' },
    { colors: ['#10b981', '#3b82f6'], name: 'Green to Blue' },
    { colors: ['#8b5cf6', '#ec4899'], name: 'Purple to Pink' },
    { colors: ['#06b6d4', '#10b981'], name: 'Cyan to Green' },
    { colors: ['#374151', '#111827'], name: 'Dark Gray' },
  ]

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium text-gray-900">背景設定</h3>
      
      {/* 背景タイプ選択 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          背景タイプ
        </label>
        <div className="grid grid-cols-3 gap-1">
          <button
            onClick={() => handleTypeChange('color')}
            className={`px-2 py-2 rounded text-sm font-medium transition-colors ${
              backgroundType === 'color'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            単色
          </button>
          <button
            onClick={() => handleTypeChange('gradient')}
            className={`px-2 py-2 rounded text-sm font-medium transition-colors ${
              backgroundType === 'gradient'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            グラデ
          </button>
          <button
            onClick={() => handleTypeChange('image')}
            className={`px-2 py-2 rounded text-sm font-medium transition-colors ${
              backgroundType === 'image'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            画像
          </button>
        </div>
      </div>

      {backgroundType === 'color' && (
        <div className="space-y-4">
          {/* 単色設定 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              背景色
            </label>
            <div className="flex gap-2 items-center mb-3">
              <input
                type="color"
                value={solidColor}
                onChange={(e) => handleColorChange(e.target.value)}
                className="w-12 h-8 border border-gray-300 rounded cursor-pointer"
              />
              <input
                type="text"
                value={solidColor}
                onChange={(e) => handleColorChange(e.target.value)}
                className="flex-1 px-3 py-1 border border-gray-300 rounded text-sm"
                placeholder="#ffffff"
              />
            </div>
            
            {/* プリセットカラー */}
            <div className="grid grid-cols-10 gap-1">
              {presetColors.map((color) => (
                <button
                  key={color}
                  onClick={() => handleColorChange(color)}
                  className="w-6 h-6 rounded border border-gray-300 hover:scale-110 transition-transform"
                  style={{ backgroundColor: color }}
                  title={color}
                />
              ))}
            </div>
          </div>
        </div>
      )}

      {backgroundType === 'gradient' && (
        <div className="space-y-4">
          {/* グラデーション設定 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              グラデーション色 1
            </label>
            <div className="flex gap-2 items-center">
              <input
                type="color"
                value={gradientColor1}
                onChange={(e) => {
                  setGradientColor1(e.target.value)
                  handleGradientChange()
                }}
                className="w-12 h-8 border border-gray-300 rounded cursor-pointer"
              />
              <input
                type="text"
                value={gradientColor1}
                onChange={(e) => {
                  setGradientColor1(e.target.value)
                  handleGradientChange()
                }}
                className="flex-1 px-3 py-1 border border-gray-300 rounded text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              グラデーション色 2
            </label>
            <div className="flex gap-2 items-center">
              <input
                type="color"
                value={gradientColor2}
                onChange={(e) => {
                  setGradientColor2(e.target.value)
                  handleGradientChange()
                }}
                className="w-12 h-8 border border-gray-300 rounded cursor-pointer"
              />
              <input
                type="text"
                value={gradientColor2}
                onChange={(e) => {
                  setGradientColor2(e.target.value)
                  handleGradientChange()
                }}
                className="flex-1 px-3 py-1 border border-gray-300 rounded text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              グラデーション方向
            </label>
            <select
              value={gradientDirection}
              onChange={(e) => {
                const direction = e.target.value as 'horizontal' | 'vertical' | 'diagonal'
                setGradientDirection(direction)
                handleGradientChange()
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="horizontal">水平</option>
              <option value="vertical">垂直</option>
              <option value="diagonal">斜め</option>
            </select>
          </div>

          {/* プリセットグラデーション */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              プリセット
            </label>
            <div className="grid grid-cols-2 gap-2">
              {presetGradients.map((preset, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setGradientColor1(preset.colors[0])
                    setGradientColor2(preset.colors[1])
                    onBackgroundChange({
                      type: 'gradient',
                      gradient: {
                        colors: preset.colors,
                        direction: gradientDirection,
                      },
                    })
                  }}
                  className="h-8 rounded border border-gray-300 hover:scale-105 transition-transform"
                  style={{
                    background: `linear-gradient(to right, ${preset.colors[0]}, ${preset.colors[1]})`,
                  }}
                  title={preset.name}
                />
              ))}
            </div>
          </div>
        </div>
      )}

      {backgroundType === 'image' && (
        <div className="space-y-4">
          <ImageUploader onImageUpload={handleImageUpload} />

          {/* フリー素材サイトリンク */}
          <div className="bg-blue-50 border border-blue-200 rounded-md p-3">
            <h4 className="text-sm font-medium text-blue-900 mb-2">フリー素材サイト</h4>
            <p className="text-xs text-blue-800 mb-3">画像をダウンロードして上記にアップロードできます</p>
            <div className="space-y-2">
              <a
                href="https://unsplash.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800 hover:underline"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
                Unsplash - 高品質な写真
              </a>
              <a
                href="https://aiartstock.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800 hover:underline"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
                A.I. ArtStock - AI生成画像
              </a>
              <a
                href="https://studio-aiphoto.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800 hover:underline"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
                studio-AI. - AI写真素材
              </a>
              <a
                href="https://www.beiz.jp/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800 hover:underline"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
                BEIZ images - 背景素材
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}