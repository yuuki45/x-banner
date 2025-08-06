import React, { useState, useEffect } from 'react'
import { FONT_OPTIONS, FONT_CATEGORIES, FontOption } from '../../constants/fonts'

interface FontSelectorProps {
  currentFont: string
  currentWeight: string
  onFontChange: (fontFamily: string, fontWeight: string) => void
}

export const FontSelector: React.FC<FontSelectorProps> = ({
  currentFont,
  currentWeight,
  onFontChange,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'japanese' | 'english' | 'decorative'>('all')
  const [loadedFonts, setLoadedFonts] = useState<Set<string>>(new Set())

  const filteredFonts = selectedCategory === 'all' 
    ? FONT_OPTIONS 
    : FONT_OPTIONS.filter(font => font.category === selectedCategory)

  const currentFontOption = FONT_OPTIONS.find(font => font.value === currentFont)

  const loadFont = async (fontFamily: string) => {
    if (loadedFonts.has(fontFamily)) return

    try {
      // Google Fonts APIを使用してフォントを動的に読み込み
      const link = document.createElement('link')
      link.href = `https://fonts.googleapis.com/css2?family=${fontFamily.replace(/ /g, '+')}:wght@400;500;600;700;800&display=swap`
      link.rel = 'stylesheet'
      document.head.appendChild(link)

      // フォントの読み込み完了を待つ
      await new Promise((resolve) => {
        link.onload = resolve
        setTimeout(resolve, 2000) // タイムアウト
      })

      setLoadedFonts(prev => new Set([...prev, fontFamily]))
    } catch (error) {
      console.warn(`Failed to load font: ${fontFamily}`, error)
    }
  }

  useEffect(() => {
    // 初期フォントを読み込み
    loadFont(currentFont)
  }, [currentFont])

  const handleFontSelect = async (font: FontOption) => {
    await loadFont(font.value)
    const defaultWeight = font.weights.includes('400') ? '400' : font.weights[0]
    onFontChange(font.value, defaultWeight)
  }

  const handleWeightChange = (weight: string) => {
    onFontChange(currentFont, weight)
  }

  return (
    <div className="space-y-4">
      <h4 className="font-medium text-gray-900 text-lg mb-4">フォント</h4>

      {/* カテゴリ選択 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">カテゴリ</label>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
              selectedCategory === 'all'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            すべて
          </button>
          {Object.entries(FONT_CATEGORIES).map(([key, label]) => (
            <button
              key={key}
              onClick={() => setSelectedCategory(key as any)}
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
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

      {/* フォント選択 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          フォント
        </label>
        <div className="max-h-48 overflow-y-auto border border-gray-300 rounded-md">
          {filteredFonts.map((font) => (
            <button
              key={font.value}
              onClick={() => handleFontSelect(font)}
              className={`w-full p-3 text-left border-b border-gray-200 last:border-b-0 transition-colors ${
                currentFont === font.value
                  ? 'bg-blue-50 border-blue-200'
                  : 'hover:bg-gray-50'
              }`}
              style={{
                fontFamily: loadedFonts.has(font.value) ? font.value : 'inherit',
              }}
            >
              <div className="font-medium">{font.name}</div>
              <div className="text-sm text-gray-500 mt-1">
                {font.category === 'japanese' && 'あいうえお漢字'}
                {font.category === 'english' && 'The quick brown fox'}
                {font.category === 'decorative' && 'Stylish Text'}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* フォント太さ選択 */}
      {currentFontOption && (
        <div className="mb-3">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            太さ
          </label>
          <select
            value={currentWeight}
            onChange={(e) => handleWeightChange(e.target.value)}
            className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
          >
            {currentFontOption.weights.map((weight) => (
              <option key={weight} value={weight}>
                {weight === '300' && '300 (Light)'}
                {weight === '400' && '400 (Regular)'}
                {weight === '500' && '500 (Medium)'}
                {weight === '600' && '600 (Semi Bold)'}
                {weight === '700' && '700 (Bold)'}
                {weight === '800' && '800 (Extra Bold)'}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* プレビュー */}
      <div className="bg-gray-50 p-3 rounded-md">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          プレビュー
        </label>
        <div
          className="text-lg"
          style={{
            fontFamily: loadedFonts.has(currentFont) ? currentFont : 'inherit',
            fontWeight: currentWeight,
          }}
        >
          Sample Text サンプル
        </div>
      </div>
    </div>
  )
}