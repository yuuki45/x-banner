# 実装ガイド

**プロジェクト名**: X Banner Studio
**バージョン**: 1.0.0
**最終更新日**: 2025-11-02

---

## 1. 開発環境セットアップ

### 1.1 必要な環境

| ツール | 推奨バージョン | 備考 |
|-------|--------------|-----|
| Node.js | 18.x以上 | LTS推奨 |
| npm | 9.x以上 | Node.js付属 |
| Git | 2.x以上 | バージョン管理 |
| VSCode | 最新版 | エディタ（推奨） |

### 1.2 VSCode拡張機能（推奨）

```json
{
  "recommendations": [
    "dbaeumer.vscode-eslint",           // ESLint
    "esbenp.prettier-vscode",           // Prettier
    "bradlc.vscode-tailwindcss",        // Tailwind CSS IntelliSense
    "dsznajder.es7-react-js-snippets",  // Reactスニペット
    "ms-vscode.vscode-typescript-next"  // TypeScript
  ]
}
```

### 1.3 プロジェクトクローン

```bash
# リポジトリクローン
git clone https://github.com/your-username/x-banner.git
cd x-banner

# 依存関係インストール
npm install

# 開発サーバー起動
npm run dev
```

ブラウザで `http://localhost:5173` を開く

---

## 2. プロジェクト構造

### 2.1 ディレクトリ構成

```
x-banner/
├── docs/                       # ドキュメント
│   ├── requirements.md         # 要件定義
│   ├── technical-spec.md       # 技術仕様
│   ├── architecture.md         # アーキテクチャ設計
│   ├── ui-ux-design.md        # UI/UX設計
│   ├── implementation-guide.md # 実装ガイド（本ファイル）
│   ├── api-spec.md            # API仕様
│   └── changelog.md           # 変更履歴
│
├── src/
│   ├── components/            # Reactコンポーネント
│   │   ├── Canvas/
│   │   │   ├── BannerCanvas.tsx
│   │   │   └── index.ts
│   │   ├── TextEditor/
│   │   │   ├── TextEditor.tsx
│   │   │   └── index.ts
│   │   ├── BackgroundPicker/
│   │   ├── FontSelector/
│   │   ├── ImageUploader/
│   │   └── ExportControls/
│   │
│   ├── hooks/                 # カスタムフック
│   │   └── useCanvas.ts
│   │
│   ├── utils/                 # ユーティリティ関数
│   │   ├── canvas.ts
│   │   ├── file.ts
│   │   └── validation.ts
│   │
│   ├── types/                 # TypeScript型定義
│   │   ├── canvas.ts
│   │   ├── text.ts
│   │   └── background.ts
│   │
│   ├── constants/             # 定数定義
│   │   ├── canvas.ts
│   │   ├── fonts.ts
│   │   └── colors.ts
│   │
│   ├── App.tsx                # メインアプリ
│   ├── main.tsx               # エントリーポイント
│   └── index.css              # グローバルスタイル
│
├── public/                    # 静的ファイル
├── .eslintrc.cjs              # ESLint設定
├── .prettierrc                # Prettier設定
├── tsconfig.json              # TypeScript設定
├── vite.config.ts             # Vite設定
├── tailwind.config.js         # Tailwind CSS設定
├── package.json               # npm設定
└── readme.md                  # プロジェクトREADME
```

---

## 3. コーディング規約

### 3.1 TypeScript規約

#### 型定義の場所

```typescript
// ✅ 良い例: types/ディレクトリに配置
// types/canvas.ts
export interface CanvasConfig {
  width: number;
  height: number;
  backgroundColor: string;
}

// ❌ 悪い例: コンポーネントファイル内に型定義
// components/Canvas/BannerCanvas.tsx
interface CanvasConfig { ... } // 再利用不可
```

#### 型アノテーション

```typescript
// ✅ 明示的な型指定
const width: number = 1500;
const height: number = 500;

function updateText(id: string, content: string): void {
  // ...
}

// ✅ 関数の戻り値型を明示
const exportPNG = (): void => {
  // ...
};

// ❌ 型推論に頼りすぎない（複雑な型の場合）
const complexData = someFunction(); // 型が不明瞭
```

#### インターフェース vs タイプエイリアス

```typescript
// ✅ Props: interface使用
interface ButtonProps {
  label: string;
  onClick: () => void;
}

// ✅ ユニオン型: type使用
type BackgroundType = 'color' | 'gradient' | 'image';

// ✅ 関数型: type使用
type EventHandler = (event: React.ChangeEvent<HTMLInputElement>) => void;
```

---

### 3.2 React規約

#### コンポーネント定義

```typescript
// ✅ 良い例: 関数コンポーネント + FC型
import React from 'react';

interface TextEditorProps {
  text: string;
  onChange: (text: string) => void;
}

export const TextEditor: React.FC<TextEditorProps> = ({ text, onChange }) => {
  return (
    <div>
      <input value={text} onChange={(e) => onChange(e.target.value)} />
    </div>
  );
};

// ❌ 悪い例: クラスコンポーネント（非推奨）
class TextEditor extends React.Component { ... }
```

#### フック使用規則

```typescript
// ✅ 良い例: トップレベルでのみフック使用
const MyComponent: React.FC = () => {
  const [value, setValue] = useState('');
  const debouncedValue = useMemo(() => debounce(value), [value]);

  return <div>{value}</div>;
};

// ❌ 悪い例: 条件分岐内でフック使用
const MyComponent: React.FC = () => {
  if (condition) {
    const [value, setValue] = useState(''); // エラー！
  }
  return <div>...</div>;
};
```

#### イベントハンドラー命名

```typescript
// ✅ 良い例: handle + 動作
const handleClick = () => { ... };
const handleTextChange = (text: string) => { ... };
const handleFileUpload = (file: File) => { ... };

// ❌ 悪い例: 曖昧な命名
const onClick = () => { ... };
const change = () => { ... };
```

---

### 3.3 CSS/Tailwind規約

#### Tailwind優先

```tsx
// ✅ 良い例: Tailwindクラス使用
<div className="flex items-center gap-4 p-6 bg-white rounded-lg shadow-md">
  <h2 className="text-xl font-bold text-gray-900">Title</h2>
</div>

// ❌ 悪い例: インラインスタイル
<div style={{ display: 'flex', padding: '24px' }}>
  <h2 style={{ fontSize: '20px', fontWeight: 'bold' }}>Title</h2>
</div>
```

#### クラス名の順序

```tsx
// ✅ 推奨順序: レイアウト → サイズ → スタイル → インタラクション
<button className="
  flex items-center justify-center  // レイアウト
  w-full h-12 px-6                  // サイズ
  bg-x-blue text-white rounded-md  // スタイル
  hover:bg-x-blue-hover transition  // インタラクション
">
  Click me
</button>
```

#### カスタムCSSの使用タイミング

```css
/* ✅ 良い例: Tailwindで表現できない複雑なアニメーション */
@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

.custom-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

/* ❌ 悪い例: Tailwindで表現可能なスタイル */
.custom-button {
  padding: 16px;
  background-color: #1DA1F2;
  border-radius: 8px;
}
```

---

### 3.4 ファイル・インポート規約

#### インポート順序

```typescript
// 1. Reactライブラリ
import React, { useState, useEffect } from 'react';

// 2. 外部ライブラリ
import { fabric } from 'fabric';

// 3. 内部コンポーネント
import { TextEditor } from '@/components/TextEditor';
import { BackgroundPicker } from '@/components/BackgroundPicker';

// 4. フック
import { useCanvas } from '@/hooks/useCanvas';

// 5. ユーティリティ
import { exportPNG } from '@/utils/canvas';

// 6. 型定義
import type { CanvasConfig, TextConfig } from '@/types/canvas';

// 7. 定数
import { CANVAS_WIDTH, CANVAS_HEIGHT } from '@/constants/canvas';

// 8. スタイル
import './App.css';
```

#### 名前付きエクスポート優先

```typescript
// ✅ 良い例: 名前付きエクスポート
// components/TextEditor/index.ts
export { TextEditor } from './TextEditor';
export type { TextEditorProps } from './TextEditor';

// ❌ 悪い例: デフォルトエクスポート
export default TextEditor;
```

---

## 4. 実装手順（MVP開発）

### 4.1 Phase 1: 基盤構築（Week 1）

#### Step 1: Canvas初期化

**タスク**:
- [ ] `useCanvas` フックを実装
- [ ] Fabric.js Canvas初期化
- [ ] デフォルト背景色設定
- [ ] Canvas破棄処理実装

**実装例**:
```typescript
// src/hooks/useCanvas.ts
import { useRef, useEffect } from 'react';
import { fabric } from 'fabric';
import { CANVAS_WIDTH, CANVAS_HEIGHT, DEFAULT_BG_COLOR } from '@/constants/canvas';

export const useCanvas = () => {
  const canvasRef = useRef<fabric.Canvas | null>(null);

  useEffect(() => {
    // Canvas初期化
    canvasRef.current = new fabric.Canvas('banner-canvas', {
      width: CANVAS_WIDTH,
      height: CANVAS_HEIGHT,
      backgroundColor: DEFAULT_BG_COLOR
    });

    // クリーンアップ
    return () => {
      canvasRef.current?.dispose();
    };
  }, []);

  return { canvas: canvasRef.current };
};
```

**確認方法**:
```bash
npm run dev
# ブラウザで http://localhost:5173 を開き、1500×500pxの青いCanvasが表示されることを確認
```

---

#### Step 2: 背景色変更機能

**タスク**:
- [ ] `BackgroundPicker` コンポーネント作成
- [ ] カラーピッカーUI実装
- [ ] 背景色更新ロジック実装

**実装例**:
```typescript
// src/components/BackgroundPicker/BackgroundPicker.tsx
import React from 'react';

interface BackgroundPickerProps {
  color: string;
  onChange: (color: string) => void;
}

export const BackgroundPicker: React.FC<BackgroundPickerProps> = ({ color, onChange }) => {
  return (
    <div className="p-4 bg-white rounded-lg border border-gray-200">
      <h3 className="text-lg font-semibold mb-4">背景設定</h3>
      <div className="flex items-center gap-3">
        <input
          type="color"
          value={color}
          onChange={(e) => onChange(e.target.value)}
          className="w-12 h-12 rounded cursor-pointer"
        />
        <input
          type="text"
          value={color}
          onChange={(e) => onChange(e.target.value)}
          className="flex-1 px-3 py-2 border border-gray-300 rounded"
          placeholder="#1DA1F2"
        />
      </div>
    </div>
  );
};
```

---

#### Step 3: テキスト追加機能

**タスク**:
- [ ] `TextEditor` コンポーネント作成
- [ ] テキスト入力フィールド実装
- [ ] Fabric.js Textオブジェクト生成
- [ ] Canvas追加処理実装

**実装例**:
```typescript
// src/hooks/useCanvas.ts に追加
const addText = useCallback((content: string) => {
  if (!canvasRef.current) return;

  const text = new fabric.Text(content, {
    left: 100,
    top: 200,
    fontSize: 48,
    fill: '#FFFFFF',
    fontFamily: 'Noto Sans JP'
  });

  canvasRef.current.add(text);
}, []);
```

---

### 4.2 Phase 2: UI完成（Week 2）

#### Step 4: フォント選択機能

**タスク**:
- [ ] Google Fonts読み込みユーティリティ作成
- [ ] `FontSelector` コンポーネント実装
- [ ] フォント一覧定義（constants/fonts.ts）
- [ ] 動的フォント読み込み

**実装例**:
```typescript
// src/constants/fonts.ts
export const AVAILABLE_FONTS = [
  { name: 'Noto Sans JP', family: 'Noto Sans JP' },
  { name: 'Zen角ゴシック', family: 'Zen Kaku Gothic New' },
  { name: 'Noto Serif JP', family: 'Noto Serif JP' },
  { name: 'Roboto', family: 'Roboto' }
];

// src/utils/font.ts
export const loadGoogleFont = (fontFamily: string) => {
  const link = document.createElement('link');
  link.href = `https://fonts.googleapis.com/css2?family=${fontFamily.replace(' ', '+')}:wght@400;700&display=swap`;
  link.rel = 'stylesheet';
  document.head.appendChild(link);
};
```

---

#### Step 5: PNG出力機能

**タスク**:
- [ ] `ExportControls` コンポーネント作成
- [ ] PNG生成ロジック実装
- [ ] ダウンロード処理実装
- [ ] エラーハンドリング追加

**実装例**:
```typescript
// src/utils/canvas.ts
export const exportCanvasToPNG = (canvas: fabric.Canvas): void => {
  try {
    const dataURL = canvas.toDataURL({
      format: 'png',
      quality: 1,
      multiplier: 1
    });

    const link = document.createElement('a');
    link.download = `x-banner-${Date.now()}.png`;
    link.href = dataURL;
    link.click();
  } catch (error) {
    console.error('PNG export failed:', error);
    alert('PNG出力に失敗しました');
  }
};
```

---

### 4.3 Phase 3: 拡張機能（Week 3-4）

#### Step 6: 画像背景機能

**タスク**:
- [ ] `ImageUploader` コンポーネント作成
- [ ] ファイル検証（サイズ・形式）実装
- [ ] FileReader実装
- [ ] Fabric.js背景画像設定

**実装例**:
```typescript
// src/utils/validation.ts
export const validateImageFile = (file: File): boolean => {
  const allowedTypes = ['image/png', 'image/jpeg', 'image/gif'];
  const maxSize = 5 * 1024 * 1024; // 5MB

  if (!allowedTypes.includes(file.type)) {
    alert('PNG, JPEG, GIF形式のみ対応しています');
    return false;
  }

  if (file.size > maxSize) {
    alert('ファイルサイズは5MB以下にしてください');
    return false;
  }

  return true;
};
```

---

## 5. テスト戦略（将来的）

### 5.1 ユニットテスト

```bash
# Vitestインストール
npm install -D vitest @testing-library/react @testing-library/jest-dom
```

**テスト例**:
```typescript
// src/utils/validation.test.ts
import { describe, it, expect } from 'vitest';
import { validateImageFile } from './validation';

describe('validateImageFile', () => {
  it('正しいPNGファイルを受け入れる', () => {
    const file = new File([''], 'test.png', { type: 'image/png' });
    expect(validateImageFile(file)).toBe(true);
  });

  it('5MBを超えるファイルを拒否する', () => {
    const largeFile = new File([new ArrayBuffer(6 * 1024 * 1024)], 'large.png', { type: 'image/png' });
    expect(validateImageFile(largeFile)).toBe(false);
  });

  it('PDFファイルを拒否する', () => {
    const pdfFile = new File([''], 'test.pdf', { type: 'application/pdf' });
    expect(validateImageFile(pdfFile)).toBe(false);
  });
});
```

---

### 5.2 E2Eテスト

```bash
# Playwrightインストール
npm install -D @playwright/test
```

**テストシナリオ例**:
```typescript
// e2e/banner-creation.spec.ts
import { test, expect } from '@playwright/test';

test('バナー作成から出力まで', async ({ page }) => {
  // 1. ページアクセス
  await page.goto('http://localhost:5173');

  // 2. 背景色変更
  await page.fill('input[type="color"]', '#FF0000');

  // 3. テキスト追加
  await page.fill('input[placeholder="テキストを入力"]', 'Hello X Banner');
  await page.click('button:has-text("追加")');

  // 4. Canvas確認
  const canvas = page.locator('canvas');
  await expect(canvas).toBeVisible();

  // 5. PNG出力
  const downloadPromise = page.waitForEvent('download');
  await page.click('button:has-text("PNG形式でダウンロード")');
  const download = await downloadPromise;

  // 6. ファイル名確認
  expect(download.suggestedFilename()).toMatch(/x-banner-\d+\.png/);
});
```

---

## 6. デバッグ手法

### 6.1 React DevTools

```bash
# ブラウザ拡張機能インストール
# Chrome: https://chrome.google.com/webstore/detail/react-developer-tools/
```

**使用方法**:
- コンポーネントツリー確認
- Props/State確認
- パフォーマンスプロファイリング

---

### 6.2 Fabric.js Canvas検査

```typescript
// 開発時のデバッグログ
useEffect(() => {
  if (!canvasRef.current) return;

  console.log('Canvas objects:', canvasRef.current.getObjects());
  console.log('Canvas size:', canvasRef.current.width, canvasRef.current.height);
  console.log('Background:', canvasRef.current.backgroundColor);
}, [canvasRef.current]);
```

---

### 6.3 パフォーマンス計測

```typescript
// React Profilerでレンダリング計測
import { Profiler } from 'react';

const onRender = (id: string, phase: string, actualDuration: number) => {
  console.log(`${id} (${phase}) took ${actualDuration}ms`);
};

<Profiler id="App" onRender={onRender}>
  <App />
</Profiler>
```

---

## 7. よくある問題と解決策

### 7.1 Canvas描画が遅い

**原因**: 頻繁な`renderAll()`呼び出し

**解決策**:
```typescript
import { debounce } from 'lodash-es';

const debouncedRender = useMemo(
  () => debounce(() => canvas?.renderAll(), 200),
  [canvas]
);
```

---

### 7.2 Google Fontsが読み込まれない

**原因**: フォント読み込み完了前にCanvas描画

**解決策**:
```typescript
const loadFont = async (fontFamily: string) => {
  await document.fonts.load(`16px "${fontFamily}"`);
  canvas?.renderAll();
};
```

---

### 7.3 画像アップロード後にCanvasがクラッシュ

**原因**: 大きすぎる画像でメモリ不足

**解決策**:
```typescript
const validateImageFile = (file: File): boolean => {
  const maxSize = 5 * 1024 * 1024; // 5MBに制限
  return file.size <= maxSize;
};
```

---

## 8. Git運用

### 8.1 ブランチ戦略

```
main (本番)
  └── develop (開発)
       ├── feature/background-picker
       ├── feature/text-editor
       └── feature/export-png
```

### 8.2 コミットメッセージ規約

```bash
# フォーマット
<type>: <subject>

# 例
feat: 背景色変更機能を実装
fix: PNG出力時のエラーを修正
docs: requirements.mdを更新
style: コードフォーマット修正
refactor: useCanvasフックをリファクタリング
test: TextEditorのユニットテスト追加
```

---

## 9. デプロイ手順

### 9.1 Vercelデプロイ

```bash
# Vercel CLIインストール
npm install -g vercel

# ログイン
vercel login

# デプロイ
vercel --prod
```

### 9.2 環境変数設定（将来的なAI機能用）

```bash
# Vercel Dashboard > Settings > Environment Variables
VITE_OPENAI_API_KEY=sk-xxxxxxxxxxxxx
```

---

## 10. チェックリスト

### 10.1 MVP完成チェックリスト

- [ ] Canvas初期化（1500×500px）
- [ ] 背景色変更機能
- [ ] テキスト追加機能
- [ ] フォント選択機能
- [ ] フォントサイズ調整
- [ ] 文字色変更
- [ ] テキスト位置調整（ドラッグ）
- [ ] PNG出力機能
- [ ] レスポンシブ対応（Desktop/Tablet/Mobile）
- [ ] ESLint/Prettierパス
- [ ] 型エラーなし（`npm run typecheck`）
- [ ] Lighthouseスコア90以上

### 10.2 Phase 2チェックリスト

- [ ] グラデーション背景
- [ ] 画像背景アップロード
- [ ] 複数テキストレイヤー
- [ ] テキスト削除機能
- [ ] プレビュー追従モード
- [ ] テンプレート機能

---

## 変更履歴

| 日付 | バージョン | 変更内容 | 担当者 |
|-----|----------|---------|-------|
| 2025-11-02 | 1.0.0 | 初版作成 | - |
