import React, { useState } from 'react'
import { SHAPE_OPTIONS, DEFAULT_SHAPE_CONFIG, ShapeType } from '../../constants/shapes'

interface ShapeInserterProps {
  onAddShape: (shapeType: ShapeType, color: string, size: number) => void
}

export const ShapeInserter: React.FC<ShapeInserterProps> = ({ onAddShape }) => {
  const [selectedShape, setSelectedShape] = useState<ShapeType>('circle')
  const [shapeColor, setShapeColor] = useState(DEFAULT_SHAPE_CONFIG.COLOR)
  const [shapeSize, setShapeSize] = useState(DEFAULT_SHAPE_CONFIG.SIZE)

  const handleAddShape = () => {
    onAddShape(selectedShape, shapeColor, shapeSize)
  }

  const presetColors = [
    '#3b82f6', '#ef4444', '#10b981', '#f59e0b',
    '#ec4899', '#8b5cf6', '#06b6d4', '#f97316',
    '#22c55e', '#eab308', '#6366f1', '#a855f7',
    '#ffffff', '#000000', '#94a3b8', '#64748b',
  ]

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium text-gray-900">図形挿入</h3>

      {/* 図形選択 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          図形タイプ
        </label>
        <div className="grid grid-cols-5 gap-2">
          {SHAPE_OPTIONS.map((shape) => (
            <button
              key={shape.type}
              onClick={() => setSelectedShape(shape.type)}
              className={`p-3 rounded-md border-2 transition-all ${
                selectedShape === shape.type
                  ? 'border-blue-600 bg-blue-50'
                  : 'border-gray-300 hover:border-gray-400'
              }`}
              title={shape.name}
            >
              <div className="text-2xl mb-1">{shape.icon}</div>
              <div className="text-xs text-gray-700">{shape.name}</div>
            </button>
          ))}
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
            value={shapeColor}
            onChange={(e) => setShapeColor(e.target.value)}
            className="w-12 h-8 border border-gray-300 rounded cursor-pointer"
          />
          <input
            type="text"
            value={shapeColor}
            onChange={(e) => setShapeColor(e.target.value)}
            className="flex-1 px-3 py-1 border border-gray-300 rounded text-sm font-mono focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="#3b82f6"
          />
        </div>

        {/* プリセットカラー */}
        <div className="grid grid-cols-8 gap-1">
          {presetColors.map((color) => (
            <button
              key={color}
              onClick={() => setShapeColor(color)}
              className={`w-8 h-8 rounded border-2 hover:scale-110 transition-transform ${
                shapeColor === color ? 'border-blue-600' : 'border-gray-300'
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
          サイズ: <span className="font-semibold text-blue-600">{shapeSize}px</span>
        </label>
        <input
          type="range"
          min="30"
          max="300"
          value={shapeSize}
          onChange={(e) => setShapeSize(parseInt(e.target.value))}
          className="w-full slider"
        />
      </div>

      {/* 追加ボタン */}
      <button
        onClick={handleAddShape}
        className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm font-medium"
      >
        図形を追加
      </button>

      {/* プレビュー */}
      <div className="bg-gray-50 p-4 rounded-md">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          プレビュー
        </label>
        <div className="flex justify-center items-center h-32 bg-white rounded border border-gray-200">
          <div
            style={{
              width: `${Math.min(shapeSize, 80)}px`,
              height: `${Math.min(shapeSize, 80)}px`,
              backgroundColor: selectedShape === 'circle' || selectedShape === 'rect' ? shapeColor : 'transparent',
              color: selectedShape === 'triangle' || selectedShape === 'star' || selectedShape === 'heart' ? shapeColor : 'transparent',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: `${Math.min(shapeSize * 0.8, 64)}px`,
              lineHeight: 1,
            }}
            className={
              selectedShape === 'circle'
                ? 'rounded-full'
                : selectedShape === 'rect'
                ? 'rounded-sm'
                : ''
            }
          >
            {selectedShape === 'triangle' && '▲'}
            {selectedShape === 'star' && '★'}
            {selectedShape === 'heart' && '♥'}
          </div>
        </div>
      </div>
    </div>
  )
}
