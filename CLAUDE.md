# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## プロジェクト概要

SNS（X/Twitter）のプロフィールバナー画像生成ツールです。ユーザーがX（旧Twitter）のプロフィール用カスタムバナー画像を作成できます。背景、テキスト、装飾の設定を直感的なインターフェースで行い、リアルタイムプレビューとPNGダウンロード機能を提供します。

**対象サイズ**: 1500×500px（X推奨バナーサイズ）

## プロジェクト状況

⚠️ **開発初期段階**: このリポジトリには現在、プロジェクト要件文書（readme.md）のみが含まれています。実際のコードベースはまだ実装されていません。

## 予定技術アーキテクチャ

要件文書に基づく予定技術スタック：

- **フロントエンド**: React + Tailwind CSS
- **Canvas操作**: Fabric.jsまたはKonva.jsによる描画処理
- **フォント**: Google Fonts API連携
- **ホスティング**: Vercelデプロイ
- **AI機能（オプション）**: OpenAI API / Stability AI APIによる背景生成

## 実装すべきコア機能

### MVP（必須機能）
1. **キャンバス生成**: 1500×500px固定サイズ、背景色/グラデーション/画像対応
2. **テキスト編集**: Google Fonts対応、サイズ/色/位置調整機能
3. **リアルタイムプレビュー**: 変更の即座な視覚フィードバック
4. **PNG出力**: 高解像度ダウンロード機能

### 将来的な拡張機能
- テンプレートシステム（ビジネス、カジュアル、イベント用テーマ）
- AI活用キャッチフレーズ生成
- プロフィール画像重複領域ガイド
- 季節背景テンプレート
- AI背景生成

## 開発コマンド

プロジェクト初期化後の典型的なReactコマンド：

```bash
# 初期セットアップ（実装時）
npm install
npm start          # 開発サーバー
npm run build      # 本番ビルド
npm test           # テスト実行
npm run lint       # コードリンティング
```

## 重要な実装考慮事項

- **ブラウザ完結処理**: サーバーコスト削減のためクライアントサイド画像生成を目指す
- **パフォーマンス目標**: 画像生成は2秒以内で完了
- **レスポンシブ対応**: デスクトップ、タブレット、モバイル対応
- **日本語サポート**: Google Fonts日本語フォント適切な統合

## Canvasライブラリ選択

Fabric.jsとKonva.jsの比較検討：
- **Fabric.js**: インタラクティブオブジェクト操作に優れ、React統合実績あり
- **Konva.js**: 複雑なシーンで高パフォーマンス、アニメーションに適している

## ファイル構造（予定）

実装時の推奨構成：
```
src/
  components/          # UIコンポーネント
    Canvas/           # Canvas操作コンポーネント
    TextEditor/       # テキスト編集コントロール
    BackgroundPicker/ # 背景選択
  hooks/              # カスタムReactフック
  utils/              # Canvasユーティリティ、出力関数
  constants/          # Canvas寸法、デフォルトスタイル
```

## Reactベストプラクティス

### コンポーネント設計
- **関数コンポーネント**: クラスコンポーネントではなく関数コンポーネントを使用
- **単一責任の原則**: 1つのコンポーネントは1つの責任のみを持つ
- **Props型定義**: TypeScriptのinterfaceまたはtypeでpropsを明確に定義
- **デフォルトProps**: 必要に応じてdefaultPropsを設定

### フック活用
- **useState**: 状態管理には適切な粒度でuseStateを使用
- **useEffect**: 副作用処理には依存配列を適切に設定
- **useMemo**: 重い計算処理はuseMemoでメモ化
- **useCallback**: イベントハンドラーはuseCallbackでメモ化
- **カスタムフック**: ロジックの再利用にはカスタムフックを作成

### 状態管理
- **ローカル状態**: コンポーネント内部のシンプルな状態はuseState
- **グローバル状態**: アプリ全体で共有する状態はContext API、または必要に応じてZustand/Redux Toolkit
- **Canvas状態**: Canvas操作の状態管理は専用のContextまたはカスタムフックで管理

### パフォーマンス最適化
- **React.memo**: 不要な再レンダリングを防ぐためにReact.memoを活用
- **lazy loading**: 大きなコンポーネントはReact.lazyで遅延読み込み
- **Canvas最適化**: Canvas操作は重いため、requestAnimationFrameで最適化
- **debounce**: テキスト入力等はdebounceで処理頻度を制御

### コード品質
- **ESLint + Prettier**: コード品質と一貫性のためのツール設定
- **TypeScript**: 型安全性確保のため必須
- **Error Boundary**: エラーハンドリングのためのError Boundary実装
- **テスト**: Jest + React Testing Libraryでユニットテスト

### Canvas特有の考慮事項
- **ref管理**: Canvas要素への参照はuseRefで適切に管理
- **メモリリーク対策**: useEffectのクリーンアップでCanvas関連のリスナーを解除
- **レスポンシブ対応**: Canvas sizeの動的調整とデバイス比率対応
- **パフォーマンス**: Canvas操作はフレームレートを意識した実装