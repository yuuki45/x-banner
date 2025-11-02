import React from 'react'

interface ObjectControlsProps {
  onDeleteSelected: () => void
  onUndo: () => void
  onRedo: () => void
  canUndo: boolean
  canRedo: boolean
  onBringToFront: () => void
  onSendToBack: () => void
  onBringForward: () => void
  onSendBackward: () => void
}

export const ObjectControls: React.FC<ObjectControlsProps> = ({
  onDeleteSelected,
  onUndo,
  onRedo,
  canUndo,
  canRedo,
  onBringToFront,
  onSendToBack,
  onBringForward,
  onSendBackward,
}) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium text-gray-900">オブジェクト操作</h3>

      {/* 説明文 */}
      <div className="bg-blue-50 border border-blue-200 rounded-md p-3">
        <p className="text-sm text-blue-800 leading-relaxed">
          キャンバス上のオブジェクト（テキスト、図形、アイコン）をクリックして選択し、以下のボタンで操作できます。
        </p>
      </div>

      {/* Undo/Redoボタン */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">元に戻す / やり直し</label>
        <div className="flex gap-2">
          <button
            onClick={onUndo}
            disabled={!canUndo}
            className={`flex-1 px-4 py-2 rounded-md font-medium flex items-center justify-center gap-2 transition-colors ${
              canUndo
                ? 'bg-gray-600 text-white hover:bg-gray-700'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
            title="元に戻す (Ctrl+Z)"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
            </svg>
            元に戻す
          </button>
          <button
            onClick={onRedo}
            disabled={!canRedo}
            className={`flex-1 px-4 py-2 rounded-md font-medium flex items-center justify-center gap-2 transition-colors ${
              canRedo
                ? 'bg-gray-600 text-white hover:bg-gray-700'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
            title="やり直し (Ctrl+Y)"
          >
            やり直し
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 10h-10a8 8 0 00-8 8v2M21 10l-6 6m6-6l-6-6" />
            </svg>
          </button>
        </div>
      </div>

      {/* レイヤー順序変更 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">レイヤー順序</label>
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={onBringToFront}
            className="px-3 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors text-sm font-medium flex items-center justify-center gap-2"
            title="最前面に移動"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
            </svg>
            最前面
          </button>
          <button
            onClick={onSendToBack}
            className="px-3 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors text-sm font-medium flex items-center justify-center gap-2"
            title="最背面に移動"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
            最背面
          </button>
          <button
            onClick={onBringForward}
            className="px-3 py-2 bg-indigo-500 text-white rounded-md hover:bg-indigo-600 transition-colors text-sm font-medium flex items-center justify-center gap-2"
            title="1つ前に移動"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
            </svg>
            前へ
          </button>
          <button
            onClick={onSendBackward}
            className="px-3 py-2 bg-indigo-500 text-white rounded-md hover:bg-indigo-600 transition-colors text-sm font-medium flex items-center justify-center gap-2"
            title="1つ後ろに移動"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
            後ろへ
          </button>
        </div>
      </div>

      {/* 削除ボタン */}
      <button
        onClick={onDeleteSelected}
        className="w-full px-4 py-3 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors font-medium flex items-center justify-center gap-2"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
        選択中のオブジェクトを削除
      </button>

      {/* 補足説明 */}
      <div className="text-xs text-gray-600 space-y-1">
        <p>• <strong>削除対象:</strong> テキスト、図形、アイコン</p>
        <p>• <strong>操作方法:</strong> オブジェクトをクリックして選択後、削除ボタンを押す</p>
        <p>• <strong>注意:</strong> 背景画像は削除できません</p>
      </div>
    </div>
  )
}
