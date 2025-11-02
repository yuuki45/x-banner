import React, { useState } from 'react'
import { ICON_OPTIONS, ICON_CATEGORIES, DEFAULT_ICON_CONFIG, IconOption } from '../../constants/icons'

interface IconInserterProps {
  onAddIcon: (icon: IconOption, color: string, size: number) => void
}

export const IconInserter: React.FC<IconInserterProps> = ({ onAddIcon }) => {
  const [selectedCategory, setSelectedCategory] = useState<'all' | keyof typeof ICON_CATEGORIES>('all')
  const [selectedIcon, setSelectedIcon] = useState<IconOption>(ICON_OPTIONS[0])
  const [iconColor, setIconColor] = useState(DEFAULT_ICON_CONFIG.COLOR)
  const [iconSize, setIconSize] = useState(DEFAULT_ICON_CONFIG.SIZE)

  const filteredIcons = selectedCategory === 'all'
    ? ICON_OPTIONS
    : ICON_OPTIONS.filter(icon => icon.category === selectedCategory)

  const handleAddIcon = () => {
    onAddIcon(selectedIcon, iconColor, iconSize)
  }

  const presetColors = [
    '#000000', '#ffffff', '#3b82f6', '#ef4444',
    '#10b981', '#f59e0b', '#ec4899', '#8b5cf6',
    '#06b6d4', '#f97316', '#22c55e', '#eab308',
    '#6366f1', '#a855f7', '#94a3b8', '#64748b',
  ]

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium text-gray-900">アイコン挿入</h3>

      {/* カテゴリ選択 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          カテゴリ
        </label>
        <div className="flex flex-wrap gap-1">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-2 py-1 rounded text-xs font-medium transition-colors ${
              selectedCategory === 'all'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            すべて
          </button>
          {Object.entries(ICON_CATEGORIES).map(([key, label]) => (
            <button
              key={key}
              onClick={() => setSelectedCategory(key as keyof typeof ICON_CATEGORIES)}
              className={`px-2 py-1 rounded text-xs font-medium transition-colors ${
                selectedCategory === key
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* アイコン選択 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          アイコン
        </label>
        <div className="max-h-48 overflow-y-auto border border-gray-300 rounded-md p-2">
          <div className="grid grid-cols-4 gap-2">
            {filteredIcons.map((icon) => (
              <button
                key={icon.id}
                onClick={() => setSelectedIcon(icon)}
                className={`p-3 rounded border-2 transition-all hover:shadow-md ${
                  selectedIcon.id === icon.id
                    ? 'border-blue-600 bg-blue-50'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
                title={icon.name}
              >
                <svg viewBox={icon.viewBox || '0 0 24 24'} className="w-6 h-6 mx-auto">
                  <path d={icon.svgPath} fill="currentColor" />
                </svg>
                <div className="text-xs text-gray-600 mt-1 truncate">{icon.name}</div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 色選択 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          色
        </label>
        <div className="flex gap-2 items-center mb-3">
          <input
            type="color"
            value={iconColor}
            onChange={(e) => setIconColor(e.target.value)}
            className="w-12 h-8 border border-gray-300 rounded cursor-pointer"
          />
          <input
            type="text"
            value={iconColor}
            onChange={(e) => setIconColor(e.target.value)}
            className="flex-1 px-3 py-1 border border-gray-300 rounded text-sm font-mono focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="#000000"
          />
        </div>

        {/* プリセットカラー */}
        <div className="grid grid-cols-8 gap-1">
          {presetColors.map((color) => (
            <button
              key={color}
              onClick={() => setIconColor(color)}
              className={`w-8 h-8 rounded border-2 hover:scale-110 transition-transform ${
                iconColor === color ? 'border-blue-600' : 'border-gray-300'
              }`}
              style={{ backgroundColor: color }}
              title={color}
            />
          ))}
        </div>
      </div>

      {/* サイズ選択 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          サイズ: <span className="font-semibold text-blue-600">{iconSize}px</span>
        </label>
        <input
          type="range"
          min="30"
          max="200"
          value={iconSize}
          onChange={(e) => setIconSize(parseInt(e.target.value))}
          className="w-full slider"
        />
      </div>

      {/* 追加ボタン */}
      <button
        onClick={handleAddIcon}
        className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm font-medium"
      >
        アイコンを追加
      </button>

      {/* プレビュー */}
      <div className="bg-gray-50 p-4 rounded-md">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          プレビュー
        </label>
        <div className="flex justify-center items-center h-32 bg-white rounded border border-gray-200">
          <svg
            viewBox={selectedIcon.viewBox || '0 0 24 24'}
            style={{
              width: `${Math.min(iconSize, 80)}px`,
              height: `${Math.min(iconSize, 80)}px`,
              color: iconColor,
            }}
          >
            <path d={selectedIcon.svgPath} fill="currentColor" />
          </svg>
        </div>
      </div>
    </div>
  )
}
