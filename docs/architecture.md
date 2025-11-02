# アーキテクチャ設計書

**プロジェクト名**: X Banner Studio
**バージョン**: 1.0.0
**最終更新日**: 2025-11-02

---

## 1. システムアーキテクチャ概要

### 1.1 全体構成

```
┌─────────────────────────────────────────────────┐
│                   Browser                       │
│  ┌───────────────────────────────────────────┐ │
│  │          React Application                │ │
│  │  ┌─────────────────────────────────────┐ │ │
│  │  │       App Component (Root)          │ │ │
│  │  │  ┌──────────┐  ┌──────────────┐    │ │ │
│  │  │  │ Controls │  │   Preview    │    │ │ │
│  │  │  │  Panel   │  │    Panel     │    │ │ │
│  │  │  └──────────┘  └──────────────┘    │ │ │
│  │  └─────────────────────────────────────┘ │ │
│  │  ┌─────────────────────────────────────┐ │ │
│  │  │    Fabric.js Canvas Engine          │ │ │
│  │  └─────────────────────────────────────┘ │ │
│  └───────────────────────────────────────────┘ │
│  ┌───────────────────────────────────────────┐ │
│  │    Browser APIs (File, Download)          │ │
│  └───────────────────────────────────────────┘ │
└─────────────────────────────────────────────────┘
        ↓ (Future Phase)
┌─────────────────────────────────────────────────┐
│            External APIs                        │
│  • OpenAI API (Catchphrase Generation)         │
│  • Stability AI / DALL-E (Image Generation)    │
│  • Google Fonts API (Font Loading)             │
└─────────────────────────────────────────────────┘
```

### 1.2 アーキテクチャの特徴

- **クライアントサイド完結**: サーバー不要、全処理をブラウザで実行
- **コンポーネント指向**: React関数コンポーネントによる疎結合設計
- **単一責任の原則**: 各コンポーネントは1つの責務のみを持つ
- **カスタムフック**: ロジックとUIの分離
- **型安全**: TypeScriptによる厳格な型チェック

---

## 2. コンポーネント設計

### 2.1 コンポーネント階層

```
App (Root)
├── ControlPanel (左側パネル)
│   ├── BackgroundPicker
│   │   ├── ColorPicker
│   │   ├── GradientPicker
│   │   └── ImageUploader
│   ├── TextEditor
│   │   ├── TextInput
│   │   ├── FontSelector
│   │   ├── FontSizeSlider
│   │   └── ColorPicker
│   └── ExportControls
│       └── ExportButton
└── PreviewPanel (右側パネル)
    └── BannerCanvas
        └── <canvas> (Fabric.js)
```

### 2.2 コンポーネント詳細

#### App.tsx
**責務**: アプリケーション全体の統合、状態管理のルート

```typescript
export const App: React.FC = () => {
  const {
    canvas,
    canvasState,
    textObjects,
    updateBackground,
    addText,
    updateText,
    deleteText,
    exportPNG
  } = useCanvas();

  const [isPreviewSticky, setIsPreviewSticky] = useState(false);

  return (
    <div className="app-container">
      <ControlPanel
        onBackgroundChange={updateBackground}
        onTextAdd={addText}
        onTextUpdate={updateText}
        onTextDelete={deleteText}
        onExport={exportPNG}
        textObjects={textObjects}
      />
      <PreviewPanel
        canvas={canvas}
        isSticky={isPreviewSticky}
      />
    </div>
  );
};
```

**Props**: なし（ルートコンポーネント）

**State**:
- `isPreviewSticky: boolean` - プレビューパネルの追従設定

**使用フック**:
- `useCanvas()` - Canvas操作・状態管理

---

#### BackgroundPicker.tsx
**責務**: 背景設定UIの提供

```typescript
interface BackgroundPickerProps {
  onBackgroundChange: (config: BackgroundConfig) => void;
  currentBackground: BackgroundConfig;
}

export const BackgroundPicker: React.FC<BackgroundPickerProps> = ({
  onBackgroundChange,
  currentBackground
}) => {
  const [mode, setMode] = useState<'color' | 'gradient' | 'image'>('color');

  return (
    <div className="background-picker">
      <div className="mode-selector">
        <button onClick={() => setMode('color')}>単色</button>
        <button onClick={() => setMode('gradient')}>グラデーション</button>
        <button onClick={() => setMode('image')}>画像</button>
      </div>

      {mode === 'color' && (
        <ColorPicker
          color={currentBackground.color}
          onChange={(color) => onBackgroundChange({ type: 'color', color })}
        />
      )}

      {mode === 'gradient' && (
        <GradientPicker
          colors={currentBackground.gradientColors}
          onChange={(colors) => onBackgroundChange({ type: 'gradient', gradientColors: colors })}
        />
      )}

      {mode === 'image' && (
        <ImageUploader
          onImageUpload={(url) => onBackgroundChange({ type: 'image', imageUrl: url })}
        />
      )}
    </div>
  );
};
```

**Props**:
- `onBackgroundChange: (config: BackgroundConfig) => void` - 背景変更コールバック
- `currentBackground: BackgroundConfig` - 現在の背景設定

**State**:
- `mode: 'color' | 'gradient' | 'image'` - 背景設定モード

---

#### TextEditor.tsx
**責務**: テキスト編集UIの提供

```typescript
interface TextEditorProps {
  textObjects: TextObject[];
  onAdd: (text: TextConfig) => void;
  onUpdate: (id: string, text: Partial<TextConfig>) => void;
  onDelete: (id: string) => void;
}

export const TextEditor: React.FC<TextEditorProps> = ({
  textObjects,
  onAdd,
  onUpdate,
  onDelete
}) => {
  const [newText, setNewText] = useState('');
  const [selectedTextId, setSelectedTextId] = useState<string | null>(null);

  const handleAddText = () => {
    if (newText.trim()) {
      onAdd({
        content: newText,
        fontFamily: 'Noto Sans JP',
        fontSize: 48,
        color: '#FFFFFF',
        x: 100,
        y: 200,
        align: 'left'
      });
      setNewText('');
    }
  };

  return (
    <div className="text-editor">
      <div className="text-input-section">
        <input
          type="text"
          value={newText}
          onChange={(e) => setNewText(e.target.value)}
          placeholder="テキストを入力"
        />
        <button onClick={handleAddText}>追加</button>
      </div>

      <div className="text-list">
        {textObjects.map((textObj) => (
          <TextObjectItem
            key={textObj.id}
            textObject={textObj}
            isSelected={selectedTextId === textObj.id}
            onSelect={() => setSelectedTextId(textObj.id)}
            onUpdate={(updates) => onUpdate(textObj.id, updates)}
            onDelete={() => onDelete(textObj.id)}
          />
        ))}
      </div>
    </div>
  );
};
```

**Props**:
- `textObjects: TextObject[]` - テキストオブジェクト一覧
- `onAdd: (text: TextConfig) => void` - テキスト追加コールバック
- `onUpdate: (id: string, text: Partial<TextConfig>) => void` - テキスト更新コールバック
- `onDelete: (id: string) => void` - テキスト削除コールバック

**State**:
- `newText: string` - 新規テキスト入力値
- `selectedTextId: string | null` - 選択中のテキストID

---

#### FontSelector.tsx
**責務**: フォント選択UIの提供

```typescript
interface FontSelectorProps {
  currentFont: string;
  onFontChange: (font: string) => void;
}

export const FontSelector: React.FC<FontSelectorProps> = ({
  currentFont,
  onFontChange
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="font-selector">
      <button onClick={() => setIsOpen(!isOpen)}>
        {currentFont}
      </button>

      {isOpen && (
        <div className="font-dropdown">
          {AVAILABLE_FONTS.map((font) => (
            <div
              key={font.family}
              className="font-option"
              style={{ fontFamily: font.family }}
              onClick={() => {
                onFontChange(font.family);
                setIsOpen(false);
              }}
            >
              {font.name}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
```

**Props**:
- `currentFont: string` - 現在のフォント
- `onFontChange: (font: string) => void` - フォント変更コールバック

**State**:
- `isOpen: boolean` - ドロップダウン開閉状態

---

#### ImageUploader.tsx
**責務**: 画像アップロード機能

```typescript
interface ImageUploaderProps {
  onImageUpload: (dataUrl: string) => void;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageUpload }) => {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // ファイル検証
    if (!validateImageFile(file)) return;

    // FileReaderでDataURL取得
    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      onImageUpload(dataUrl);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="image-uploader">
      <input
        type="file"
        accept="image/png,image/jpeg,image/gif"
        onChange={handleFileChange}
      />
    </div>
  );
};
```

**Props**:
- `onImageUpload: (dataUrl: string) => void` - 画像アップロードコールバック

**State**: なし

---

#### BannerCanvas.tsx
**責務**: Fabric.js Canvasの描画管理

```typescript
interface BannerCanvasProps {
  canvasRef: React.RefObject<HTMLCanvasElement>;
}

export const BannerCanvas: React.FC<BannerCanvasProps> = ({ canvasRef }) => {
  return (
    <div className="canvas-container">
      <canvas
        ref={canvasRef}
        id="banner-canvas"
        width={1500}
        height={500}
      />
    </div>
  );
};
```

**Props**:
- `canvasRef: React.RefObject<HTMLCanvasElement>` - Canvas要素への参照

**State**: なし

---

#### ExportControls.tsx
**責務**: エクスポート操作UI

```typescript
interface ExportControlsProps {
  onExport: () => void;
}

export const ExportControls: React.FC<ExportControlsProps> = ({ onExport }) => {
  return (
    <div className="export-controls">
      <button
        className="export-button"
        onClick={onExport}
      >
        PNG形式でダウンロード
      </button>
    </div>
  );
};
```

**Props**:
- `onExport: () => void` - エクスポート実行コールバック

**State**: なし

---

## 3. カスタムフック設計

### 3.1 useCanvas Hook

**責務**: Canvas操作とバナー状態の統合管理

```typescript
interface UseCanvasReturn {
  canvas: fabric.Canvas | null;
  canvasState: CanvasConfig;
  textObjects: TextObject[];
  updateBackground: (config: BackgroundConfig) => void;
  addText: (text: TextConfig) => void;
  updateText: (id: string, updates: Partial<TextConfig>) => void;
  deleteText: (id: string) => void;
  exportPNG: () => void;
}

export const useCanvas = (): UseCanvasReturn => {
  const canvasRef = useRef<fabric.Canvas | null>(null);
  const [canvasState, setCanvasState] = useState<CanvasConfig>(DEFAULT_CANVAS_CONFIG);
  const [textObjects, setTextObjects] = useState<TextObject[]>([]);

  // Canvas初期化
  useEffect(() => {
    canvasRef.current = new fabric.Canvas('banner-canvas', {
      width: CANVAS_WIDTH,
      height: CANVAS_HEIGHT,
      backgroundColor: DEFAULT_BG_COLOR
    });

    return () => {
      canvasRef.current?.dispose();
    };
  }, []);

  // 背景更新
  const updateBackground = useCallback((config: BackgroundConfig) => {
    if (!canvasRef.current) return;

    switch (config.type) {
      case 'color':
        canvasRef.current.setBackgroundColor(config.color!, () => {
          canvasRef.current!.renderAll();
        });
        break;

      case 'gradient':
        const gradient = new fabric.Gradient({
          type: 'linear',
          coords: { x1: 0, y1: 0, x2: CANVAS_WIDTH, y2: 0 },
          colorStops: [
            { offset: 0, color: config.gradientColors![0] },
            { offset: 1, color: config.gradientColors![1] }
          ]
        });
        canvasRef.current.setBackgroundColor(gradient, () => {
          canvasRef.current!.renderAll();
        });
        break;

      case 'image':
        fabric.Image.fromURL(config.imageUrl!, (img) => {
          canvasRef.current!.setBackgroundImage(img, () => {
            canvasRef.current!.renderAll();
          }, {
            scaleX: CANVAS_WIDTH / img.width!,
            scaleY: CANVAS_HEIGHT / img.height!
          });
        });
        break;
    }
  }, []);

  // テキスト追加
  const addText = useCallback((textConfig: TextConfig) => {
    if (!canvasRef.current) return;

    const text = new fabric.Text(textConfig.content, {
      left: textConfig.x,
      top: textConfig.y,
      fontSize: textConfig.fontSize,
      fill: textConfig.color,
      fontFamily: textConfig.fontFamily
    });

    canvasRef.current.add(text);

    const textObject: TextObject = {
      id: generateId(),
      fabricObject: text,
      config: textConfig
    };

    setTextObjects(prev => [...prev, textObject]);
  }, []);

  // PNG出力
  const exportPNG = useCallback(() => {
    if (!canvasRef.current) return;

    const dataURL = canvasRef.current.toDataURL({
      format: 'png',
      quality: 1,
      multiplier: 1
    });

    const link = document.createElement('a');
    link.download = `x-banner-${Date.now()}.png`;
    link.href = dataURL;
    link.click();
  }, []);

  return {
    canvas: canvasRef.current,
    canvasState,
    textObjects,
    updateBackground,
    addText,
    updateText,
    deleteText,
    exportPNG
  };
};
```

**内部状態**:
- `canvasRef: React.RefObject<fabric.Canvas>` - Fabric.js Canvasインスタンス
- `canvasState: CanvasConfig` - Canvas設定
- `textObjects: TextObject[]` - テキストオブジェクト一覧

**提供メソッド**:
- `updateBackground(config)` - 背景更新
- `addText(text)` - テキスト追加
- `updateText(id, updates)` - テキスト更新
- `deleteText(id)` - テキスト削除
- `exportPNG()` - PNG出力

---

## 4. データフロー

### 4.1 状態管理フロー

```
User Input → Component Event Handler → useCanvas Hook → Fabric.js Canvas → Visual Update
                                              ↓
                                         State Update
                                              ↓
                                      Re-render Components
```

### 4.2 具体例：テキスト追加フロー

```
1. User: TextEditorで「Hello」と入力、「追加」ボタンクリック
   ↓
2. TextEditor: handleAddText実行
   ↓
3. TextEditor: props.onAdd({ content: 'Hello', ... })を呼び出し
   ↓
4. App: addText({ content: 'Hello', ... })を受け取る
   ↓
5. useCanvas: addText内でfabric.Textを生成、canvas.add()
   ↓
6. useCanvas: setTextObjects([...prev, newTextObject])でstate更新
   ↓
7. React: App再レンダリング → TextEditorに新しいtextObjects渡す
   ↓
8. TextEditor: 新しいテキストオブジェクトをリスト表示
   ↓
9. Fabric.js: Canvasに「Hello」テキストを描画
```

---

## 5. ファイル・ディレクトリ設計

### 5.1 コンポーネントディレクトリ規約

各コンポーネントは独自のディレクトリを持ち、以下の構成とする：

```
components/
└── ComponentName/
    ├── index.ts              # エクスポート専用（名前付きエクスポート）
    ├── ComponentName.tsx     # コンポーネント本体
    ├── ComponentName.test.tsx  # テスト（将来的）
    └── ComponentName.module.css  # スタイル（必要に応じて）
```

**index.ts の例**:
```typescript
export { TextEditor } from './TextEditor';
export type { TextEditorProps } from './TextEditor';
```

### 5.2 型定義ディレクトリ

```
types/
├── canvas.ts        # Canvas関連型
├── text.ts          # テキスト関連型
└── background.ts    # 背景関連型
```

### 5.3 定数ディレクトリ

```
constants/
├── canvas.ts        # Canvas設定定数
├── fonts.ts         # フォント定義
└── colors.ts        # カラーパレット
```

### 5.4 ユーティリティディレクトリ

```
utils/
├── canvas.ts        # Canvas操作ヘルパー
├── file.ts          # ファイル操作ヘルパー
└── validation.ts    # バリデーション関数
```

---

## 6. パフォーマンス最適化アーキテクチャ

### 6.1 再レンダリング最適化

#### React.memo使用
```typescript
export const TextEditor = React.memo<TextEditorProps>(({ ... }) => {
  // ...
});
```

#### useCallback使用
```typescript
const handleTextChange = useCallback((id: string, text: string) => {
  updateText(id, { content: text });
}, [updateText]);
```

#### useMemo使用
```typescript
const sortedTextObjects = useMemo(() => {
  return textObjects.sort((a, b) => a.config.y - b.config.y);
}, [textObjects]);
```

### 6.2 Canvas描画最適化

#### Debounce適用
```typescript
import { debounce } from 'lodash-es';

const debouncedRender = useMemo(
  () => debounce(() => {
    canvas?.renderAll();
  }, 200),
  [canvas]
);

useEffect(() => {
  return () => {
    debouncedRender.cancel();
  };
}, [debouncedRender]);
```

---

## 7. エラーハンドリング戦略

### 7.1 Error Boundary

```typescript
// src/components/ErrorBoundary/ErrorBoundary.tsx

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  ErrorBoundaryState
> {
  state: ErrorBoundaryState = {
    hasError: false,
    error: null
  };

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-screen">
          <h1>エラーが発生しました</h1>
          <p>{this.state.error?.message}</p>
          <button onClick={() => window.location.reload()}>
            リロード
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
```

### 7.2 Try-Catch戦略

```typescript
const exportPNG = useCallback(() => {
  try {
    if (!canvasRef.current) {
      throw new Error('Canvas is not initialized');
    }

    const dataURL = canvasRef.current.toDataURL({
      format: 'png',
      quality: 1
    });

    downloadFile(dataURL, `x-banner-${Date.now()}.png`);
  } catch (error) {
    console.error('PNG export failed:', error);
    alert('PNG出力に失敗しました。もう一度お試しください。');
  }
}, []);
```

---

## 8. 将来的な拡張性

### 8.1 状態管理ライブラリ導入（Phase 2）

複雑化した場合の状態管理戦略：

```typescript
// Zustand使用例
import create from 'zustand';

interface BannerStore {
  canvas: fabric.Canvas | null;
  textObjects: TextObject[];
  background: BackgroundConfig;

  setCanvas: (canvas: fabric.Canvas) => void;
  addText: (text: TextConfig) => void;
  updateBackground: (config: BackgroundConfig) => void;
}

export const useBannerStore = create<BannerStore>((set) => ({
  canvas: null,
  textObjects: [],
  background: { type: 'color', color: '#1DA1F2' },

  setCanvas: (canvas) => set({ canvas }),
  addText: (text) => set((state) => ({
    textObjects: [...state.textObjects, createTextObject(text)]
  })),
  updateBackground: (config) => set({ background: config })
}));
```

### 8.2 ルーティング（Phase 3）

複数ページ対応時：

```typescript
import { BrowserRouter, Routes, Route } from 'react-router-dom';

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<EditorPage />} />
        <Route path="/templates" element={<TemplatesPage />} />
        <Route path="/gallery" element={<GalleryPage />} />
      </Routes>
    </BrowserRouter>
  );
};
```

---

## 変更履歴

| 日付 | バージョン | 変更内容 | 担当者 |
|-----|----------|---------|-------|
| 2025-11-02 | 1.0.0 | 初版作成 | - |
