# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## プロジェクト概要

SNS（X/Twitter）のプロフィールバナー画像生成ツール。ユーザーが1500×500pxのバナー画像を作成し、背景・テキストを編集してPNG出力できるWebアプリケーションです。

**技術スタック**: React 18 + TypeScript + Fabric.js + Tailwind CSS + Vite

## 開発コマンド

```bash
npm install        # 依存関係インストール
npm run dev        # 開発サーバー起動 (http://localhost:5173)
npm run build      # 本番ビルド (tsc → vite build)
npm run preview    # ビルド結果のプレビュー
npm run lint       # ESLint実行
npm run lint:fix   # ESLint自動修正
npm run format     # Prettier実行
npm run typecheck  # TypeScript型チェック（ビルドなし）
```

## アーキテクチャ概要

### コア設計パターン

**Canvas管理**: `useCanvas` カスタムフックがFabric.jsインスタンスとCanvas状態を統合管理。Appコンポーネントはこのフックを使用してCanvas操作を行う。

**コンポーネント構成**:
- `App.tsx`: ルートコンポーネント。左側コントロールパネル、右側プレビューパネルの2カラムレイアウト
- `BannerCanvas`: Fabric.js Canvasのラッパー。useRefでcanvas要素への参照を管理
- `BackgroundPicker`, `TextEditor`, `FontSelector`, `ImageUploader`, `ExportControls`: 各機能ごとの独立したUIコンポーネント

**状態の流れ**:
```
User Input → Component → useCanvas Hook → Fabric.js API → Canvas描画更新
```

### 重要な実装詳細

**Canvas初期化** (`useCanvas.ts`):
- `useRef<HTMLCanvasElement>`でDOM要素への参照を保持
- `useState<fabric.Canvas | null>`でFabric.jsインスタンスを管理
- `useEffect`のクリーンアップでcanvas.dispose()を呼び出してメモリリーク防止

**型定義** (`src/types/canvas.ts`):
- `TextConfig`: テキストオブジェクトの設定（位置、フォント、色、影等）
- `BackgroundConfig`: 背景設定（単色/グラデーション/画像の3タイプ）
- `BannerConfig`: バナー全体の設定（背景 + テキスト配列）

**定数** (`src/constants/`):
- `canvas.ts`: CANVAS_CONFIG（WIDTH: 1500, HEIGHT: 500）
- `fonts.ts`: 利用可能なGoogle Fontsリスト

## 重要な実装パターン

### Fabric.js Canvas操作

**テキスト追加**:
```typescript
const text = new fabric.Text(content, {
  left: x,
  top: y,
  fontSize: size,
  fill: color,
  fontFamily: font
});
fabricCanvas.add(text);
```

**背景画像設定**:
```typescript
fabric.Image.fromURL(imageUrl, (img) => {
  fabricCanvas.setBackgroundImage(img, fabricCanvas.renderAll.bind(fabricCanvas), {
    scaleX: CANVAS_WIDTH / img.width!,
    scaleY: CANVAS_HEIGHT / img.height!
  });
});
```

**PNG出力**:
```typescript
const dataURL = fabricCanvas.toDataURL({
  format: 'png',
  quality: 1,
  multiplier: 1
});
```

### パフォーマンス考慮事項

- **Canvas再描画**: 頻繁な更新時はdebounceでrenderAll()呼び出しを制御
- **Google Fonts読み込み**: 動的に`<link>`要素を追加してフォントを読み込み。document.fonts.load()で読み込み完了を待機
- **画像アップロード**: FileReader APIでDataURLを取得。ファイルサイズ制限（5MB）とMIMEタイプ検証を実装

## コーディング規約

### TypeScript
- 関数コンポーネント: `React.FC<Props>`型を使用
- Props定義: `interface`を使用（`type`はユニオン型のみ）
- イベントハンドラー: `handle`プレフィックス（例: `handleTextChange`）

### インポート順序
1. React関連
2. 外部ライブラリ（fabric等）
3. 内部コンポーネント
4. フック
5. ユーティリティ
6. 型定義
7. 定数

### Tailwind CSS
- レイアウト → サイズ → スタイル → インタラクションの順でクラス記述
- 複雑なスタイルのみカスタムCSSを使用

## ドキュメント

包括的なドキュメントは`docs/`ディレクトリに格納：
- `requirements.md`: 機能要件、非機能要件、受け入れ基準
- `technical-spec.md`: 技術スタック詳細、API仕様
- `architecture.md`: コンポーネント設計、データフロー
- `ui-ux-design.md`: レイアウト、カラーパレット、インタラクション
- `implementation-guide.md`: セットアップ手順、実装ステップ
- `api-spec.md`: Google Fonts API、将来的なOpenAI/Stability AI連携仕様
- `changelog.md`: バージョン履歴

詳細な設計情報や実装ガイドは`docs/README.md`を参照。

## ドキュメント駆動開発

このプロジェクトはコンテキストエンジニアリングの考え方を重視し、ドキュメントを中心とした開発を推奨します。

### 実装前の参照ルール

新機能実装やバグ修正を開始する前に、関連ドキュメントを必ず確認：

1. **機能追加時**:
   - `requirements.md`で要件と受け入れ基準を確認
   - `architecture.md`でコンポーネント設計パターンを確認
   - `ui-ux-design.md`でUI仕様とレイアウトを確認
   - `implementation-guide.md`で実装手順とベストプラクティスを確認

2. **API連携時**:
   - `api-spec.md`でエンドポイント、認証、エラーハンドリングを確認

3. **技術調査時**:
   - `technical-spec.md`で既存の技術選定理由と使用方法を確認

### 実装後の更新ルール

実装完了後は、変更内容をドキュメントに反映：

1. **新機能実装後**:
   - `changelog.md`にバージョン履歴を追記
   - 設計変更があれば`architecture.md`を更新
   - 新しいUIパターンがあれば`ui-ux-design.md`を更新

2. **技術スタック変更後**:
   - `technical-spec.md`に新しいライブラリやバージョン情報を追記
   - `implementation-guide.md`に新しい開発手順を追記

3. **API追加後**:
   - `api-spec.md`にエンドポイント仕様を追記

### コンテキスト維持のベストプラクティス

- **実装理由の記録**: なぜその実装方法を選んだかを`architecture.md`や`technical-spec.md`に記載
- **トレードオフの明記**: 代替案と選択理由を文書化
- **将来の拡張性**: Phase 2/3で追加予定の機能との整合性を考慮
- **一貫性の維持**: 既存のコーディングパターンやUI設計に従う

これにより、将来のClaude Codeインスタンスや開発者が文脈を理解しやすくなり、プロジェクトの継続性が向上します。