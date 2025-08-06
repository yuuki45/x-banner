function App() {
  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow">
        <h1 className="text-4xl font-bold text-blue-600 mb-4">
          X Banner Generator
        </h1>
        <p className="text-gray-600 mb-8">
          SNS（X）プロフィールバナー画像生成ツール
        </p>
        
        <div className="border border-gray-300 rounded-lg p-4 bg-gray-50">
          <p className="text-center text-gray-500">
            Canvas コンポーネントがここに表示されます
          </p>
          <div className="mt-4 text-center">
            <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
              テストボタン
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App