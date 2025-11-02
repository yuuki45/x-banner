# 技術仕様書

**プロジェクト名**: X Banner Studio
**バージョン**: 1.0.0
**最終更新日**: 2025-11-02

---

## 1. 技術スタック概要

### 1.1 フロントエンド

| カテゴリ | 技術 | バージョン | 用途 |
|---------|-----|----------|-----|
| フレームワーク | React | 18.2.0 | UIコンポーネント構築 |
| 言語 | TypeScript | 5.2.2 | 型安全な開発 |
| ビルドツール | Vite | 5.2.0 | 高速開発サーバー・ビルド |
| スタイリング | Tailwind CSS | 4.1.11 | ユーティリティファーストCSS |
| Canvas操作 | Fabric.js | 6.7.1 | Canvas描画・オブジェクト管理 |

### 1.2 開発ツール

| カテゴリ | 技術 | バージョン | 用途 |
|---------|-----|----------|-----|
| リンター | ESLint | 8.57.0 | コード品質チェック |
| フォーマッター | Prettier | 3.6.2 | コードフォーマット |
| 型チェック | TypeScript Compiler | 5.2.2 | 型検証 |
| パッケージ管理 | npm | - | 依存関係管理 |

### 1.3 将来的な技術（Phase 2以降）

| カテゴリ | 技術候補 | 用途 |
|---------|---------|-----|
| AI API | OpenAI GPT-4o-mini | キャッチコピー生成 |
| 画像生成 | Stability AI / DALL-E 3 | 背景画像自動生成 |
| テスト | Vitest + React Testing Library | ユニット・統合テスト |
| E2Eテスト | Playwright | エンドツーエンドテスト |
| 状態管理 | Zustand (検討中) | 複雑な状態管理が必要になった場合 |

---

## 2. プロジェクト構成

### 2.1 ディレクトリ構造

```
x-banner/
├── public/                 # 静的ファイル
│   └── vite.svg           # ファビコン等
├── src/
│   ├── components/        # Reactコンポーネント
│   │   ├── Canvas/       # Canvas関連コンポーネント
│   │   │   ├── BannerCanvas.tsx
│   │   │   └── index.ts
│   │   ├── TextEditor/   # テキスト編集UI
│   │   │   ├── TextEditor.tsx
│   │   │   └── index.ts
│   │   ├── BackgroundPicker/  # 背景選択UI
│   │   │   ├── BackgroundPicker.tsx
│   │   │   └── index.ts
│   │   ├── FontSelector/ # フォント選択UI
│   │   │   ├── FontSelector.tsx
│   │   │   └── index.ts
│   │   ├── ImageUploader/     # 画像アップロード
│   │   │   ├── ImageUploader.tsx
│   │   │   └── index.ts
│   │   └── ExportControls/    # エクスポート制御
│   │       ├── ExportControls.tsx
│   │       └── index.ts
│   ├── hooks/             # カスタムフック
│   │   └── useCanvas.ts  # Canvas操作ロジック
│   ├── utils/            # ユーティリティ関数
│   │   └── canvas.ts     # Canvas描画ヘルパー
│   ├── types/            # TypeScript型定義
│   │   └── canvas.ts     # Canvas関連型
│   ├── constants/        # 定数定義
│   │   ├── canvas.ts     # Canvas設定
│   │   └── fonts.ts      # フォント設定
│   ├── App.tsx           # メインアプリケーション
│   ├── main.tsx          # エントリーポイント
│   └── index.css         # グローバルスタイル
├── docs/                  # ドキュメント
│   ├── requirements.md    # 要件定義
│   ├── technical-spec.md  # 技術仕様（本ファイル）
│   ├── architecture.md    # アーキテクチャ設計
│   ├── ui-ux-design.md   # UI/UX設計
│   └── implementation-guide.md  # 実装ガイド
├── dist/                  # ビルド出力
├── node_modules/          # 依存パッケージ
├── package.json           # プロジェクト設定
├── tsconfig.json          # TypeScript設定
├── vite.config.ts         # Vite設定
├── tailwind.config.js     # Tailwind CSS設定
├── .eslintrc.cjs          # ESLint設定
├── .prettierrc            # Prettier設定
├── readme.md              # プロジェクトREADME
└── CLAUDE.md              # Claude Code用ガイド
```

---

## 3. コア技術詳細

### 3.1 React + TypeScript

#### 使用理由
- **React**: コンポーネントベースの再利用可能なUI構築
- **TypeScript**: 型安全性による開発効率向上とバグ削減
- **関数コンポーネント + Hooks**: モダンなReact開発パターン

#### コーディング規約
```typescript
// 関数コンポーネントの定義
interface Props {
  title: string;
  onSave: () => void;
}

export const MyComponent: React.FC<Props> = ({ title, onSave }) => {
  const [value, setValue] = useState<string>('');

  return (
    <div className="container">
      <h1>{title}</h1>
      <button onClick={onSave}>Save</button>
    </div>
  );
};
```

---

### 3.2 Fabric.js

#### 使用理由
- Canvas APIの直接操作は複雑で保守性が低い
- Fabric.jsはオブジェクト指向でCanvas要素を管理可能
- インタラクティブな操作（ドラッグ、リサイズ等）が簡単
- React統合の実績が豊富

#### 主要機能

##### Canvas初期化
```typescript
import { fabric } from 'fabric';

const canvas = new fabric.Canvas('canvas', {
  width: 1500,
  height: 500,
  backgroundColor: '#1DA1F2'
});
```

##### テキストオブジェクト追加
```typescript
const text = new fabric.Text('Hello X Banner', {
  left: 100,
  top: 200,
  fontSize: 48,
  fill: '#FFFFFF',
  fontFamily: 'Noto Sans JP'
});

canvas.add(text);
```

##### 背景画像設定
```typescript
fabric.Image.fromURL(imageUrl, (img) => {
  canvas.setBackgroundImage(img, canvas.renderAll.bind(canvas), {
    scaleX: canvas.width! / img.width!,
    scaleY: canvas.height! / img.height!
  });
});
```

##### PNG出力
```typescript
const dataURL = canvas.toDataURL({
  format: 'png',
  quality: 1,
  multiplier: 1
});

// ダウンロード処理
const link = document.createElement('a');
link.download = `x-banner-${Date.now()}.png`;
link.href = dataURL;
link.click();
```

#### パフォーマンス最適化
- `renderOnAddRemove: false` で自動レンダリングを無効化
- 手動で `canvas.renderAll()` を呼び出してバッチ更新
- `requestAnimationFrame` でスムーズなアニメーション

---

### 3.3 Tailwind CSS

#### 使用理由
- ユーティリティファーストで高速開発
- カスタマイズ性が高い
- ビルド時に未使用CSSを削除（パフォーマンス向上）
- Viteとの統合が簡単

#### 設定例（tailwind.config.js）
```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'x-blue': '#1DA1F2',
        'x-dark': '#15202B',
      },
      fontFamily: {
        'noto': ['Noto Sans JP', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
```

#### 使用例
```tsx
<div className="flex flex-col gap-4 p-6 bg-white rounded-lg shadow-lg">
  <h2 className="text-2xl font-bold text-x-blue">Text Editor</h2>
  <input
    type="text"
    className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-x-blue"
  />
</div>
```

---

### 3.4 Vite

#### 使用理由
- **超高速な開発サーバー**: ESModulesベースでHMR（Hot Module Replacement）が高速
- **最適化されたビルド**: Rollupベースでプロダクションビルドが効率的
- **TypeScript標準サポート**: 追加設定不要
- **React Fast Refresh**: コンポーネント状態を保持したまま更新

#### 主要設定（vite.config.ts）
```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    open: true
  },
  build: {
    outDir: 'dist',
    sourcemap: true
  }
})
```

---

## 4. データモデル

### 4.1 Canvas状態管理

#### CanvasState型定義
```typescript
// src/types/canvas.ts

export interface CanvasConfig {
  width: number;
  height: number;
  backgroundColor: string;
}

export interface TextConfig {
  content: string;
  fontFamily: string;
  fontSize: number;
  color: string;
  x: number;
  y: number;
  align: 'left' | 'center' | 'right';
}

export interface BackgroundConfig {
  type: 'color' | 'gradient' | 'image';
  color?: string;
  gradientColors?: [string, string];
  imageUrl?: string;
}

export interface BannerState {
  canvas: CanvasConfig;
  text: TextConfig;
  background: BackgroundConfig;
}
```

#### useCanvas Hook
```typescript
// src/hooks/useCanvas.ts

import { useState, useEffect, useRef } from 'react';
import { fabric } from 'fabric';
import type { BannerState } from '../types/canvas';

export const useCanvas = () => {
  const canvasRef = useRef<fabric.Canvas | null>(null);
  const [state, setState] = useState<BannerState>(defaultState);

  useEffect(() => {
    // Canvas初期化
    canvasRef.current = new fabric.Canvas('banner-canvas', {
      width: 1500,
      height: 500
    });

    return () => {
      // クリーンアップ
      canvasRef.current?.dispose();
    };
  }, []);

  const updateText = (textConfig: Partial<TextConfig>) => {
    setState(prev => ({
      ...prev,
      text: { ...prev.text, ...textConfig }
    }));
  };

  const updateBackground = (bgConfig: Partial<BackgroundConfig>) => {
    setState(prev => ({
      ...prev,
      background: { ...prev.background, ...bgConfig }
    }));
  };

  const exportPNG = () => {
    if (!canvasRef.current) return;

    const dataURL = canvasRef.current.toDataURL({
      format: 'png',
      quality: 1
    });

    const link = document.createElement('a');
    link.download = `x-banner-${Date.now()}.png`;
    link.href = dataURL;
    link.click();
  };

  return {
    canvas: canvasRef.current,
    state,
    updateText,
    updateBackground,
    exportPNG
  };
};
```

---

## 5. API仕様（将来的な拡張）

### 5.1 OpenAI API（キャッチコピー生成）

#### エンドポイント
```
POST https://api.openai.com/v1/chat/completions
```

#### リクエスト例
```typescript
const response = await fetch('https://api.openai.com/v1/chat/completions', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${process.env.VITE_OPENAI_API_KEY}`
  },
  body: JSON.stringify({
    model: 'gpt-4o-mini',
    messages: [
      {
        role: 'system',
        content: 'あなたはSNSバナー用のキャッチコピーを提案するアシスタントです。簡潔で印象的なフレーズを生成してください。'
      },
      {
        role: 'user',
        content: `職業: Web開発者\nキーワード: React, TypeScript, フロントエンド`
      }
    ],
    max_tokens: 100,
    temperature: 0.7,
    n: 3
  })
});
```

#### レスポンス例
```json
{
  "choices": [
    {
      "message": {
        "content": "React × TypeScriptで未来を創る"
      }
    },
    {
      "message": {
        "content": "モダンフロントエンドのプロフェッショナル"
      }
    },
    {
      "message": {
        "content": "コードで世界を変える、Web開発者"
      }
    }
  ]
}
```

---

### 5.2 Google Fonts API

#### フォント一覧取得
```
GET https://www.googleapis.com/webfonts/v1/webfonts?key=YOUR_API_KEY&sort=popularity
```

#### Webフォント読み込み
```html
<link href="https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@400;700&display=swap" rel="stylesheet">
```

#### TypeScriptでの動的読み込み
```typescript
const loadGoogleFont = (fontFamily: string) => {
  const link = document.createElement('link');
  link.href = `https://fonts.googleapis.com/css2?family=${fontFamily.replace(' ', '+')}:wght@400;700&display=swap`;
  link.rel = 'stylesheet';
  document.head.appendChild(link);
};
```

---

## 6. パフォーマンス最適化戦略

### 6.1 初期ロード最適化
- **Code Splitting**: React.lazy()でルート単位の遅延読み込み
- **Tree Shaking**: 未使用コードの自動削除（Viteデフォルト）
- **画像最適化**: WebP形式の使用、遅延読み込み
- **フォントサブセット**: 使用する文字セットのみ読み込み

### 6.2 Canvas描画最適化
- **オフスクリーンCanvas**: 重い処理はバックグラウンドで実行
- **debounce**: テキスト入力時の再描画を制御
```typescript
import { debounce } from 'lodash-es';

const debouncedRender = debounce(() => {
  canvas.renderAll();
}, 200);
```

### 6.3 メモリ管理
- **Canvas dispose**: コンポーネントアンマウント時にCanvas破棄
- **画像キャッシュ**: 同じ画像の再読み込みを防ぐ
- **イベントリスナー解除**: メモリリーク防止

---

## 7. セキュリティ対策

### 7.1 ファイルアップロード検証
```typescript
const validateImageFile = (file: File): boolean => {
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

### 7.2 XSS対策
- React標準のエスケープ処理に依存
- `dangerouslySetInnerHTML`は使用しない
- ユーザー入力をそのまま属性値に設定しない

### 7.3 環境変数管理
```bash
# .env.local (Gitにコミットしない)
VITE_OPENAI_API_KEY=sk-xxxxxxxxxxxxx
VITE_STABILITY_API_KEY=sk-xxxxxxxxxxxxx
```

```typescript
// アクセス方法
const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
```

---

## 8. デプロイ

### 8.1 Vercel設定

#### ビルドコマンド
```bash
npm run build
```

#### 出力ディレクトリ
```
dist/
```

#### 環境変数設定
```
VITE_OPENAI_API_KEY = <Your API Key>
```

#### vercel.json（オプション）
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "vite",
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

---

## 9. 開発コマンド

```bash
# 依存関係インストール
npm install

# 開発サーバー起動（http://localhost:5173）
npm run dev

# プロダクションビルド
npm run build

# ビルドプレビュー
npm run preview

# リンター実行
npm run lint

# リンター自動修正
npm run lint:fix

# フォーマット実行
npm run format

# 型チェック
npm run typecheck
```

---

## 10. ブラウザ互換性

### 対応ブラウザ
| ブラウザ | 最小バージョン | 備考 |
|---------|---------------|------|
| Chrome | 90+ | 推奨 |
| Firefox | 88+ | 推奨 |
| Safari | 14+ | iOS含む |
| Edge | 90+ | Chromiumベース |

### Polyfill不要
- ViteとReact 18のデフォルト設定で主要ブラウザ対応
- Canvas APIは全モダンブラウザでサポート済み

---

## 変更履歴

| 日付 | バージョン | 変更内容 | 担当者 |
|-----|----------|---------|-------|
| 2025-11-02 | 1.0.0 | 初版作成 | - |
