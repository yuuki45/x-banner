# 変更履歴

このファイルには、X Banner Studioプロジェクトの重要な変更がすべて記録されます。

フォーマットは [Keep a Changelog](https://keepachangelog.com/ja/1.0.0/) に基づいており、
このプロジェクトは [セマンティック バージョニング](https://semver.org/lang/ja/) に準拠しています。

---

## [Unreleased]

### 計画中（Phase 2）
- テンプレートシステム（ビジネス、カジュアル、イベント用）
- AIキャッチコピー生成機能（OpenAI API連携）
- プロフィール画像重複領域ガイド
- 複数テキストレイヤー管理
- テキストレイヤーの重なり順変更
- グラデーション背景の方向指定（横/縦/斜め）

### 計画中（Phase 3）
- AI背景画像生成（Stability AI / DALL-E 3）
- 季節イベントテンプレート（桜、海、紅葉、雪）
- シェイプ・装飾追加機能（矩形、円、アイコン）
- プリセットカラーパレット
- ダークモード対応
- 複数バナーの一括生成
- クラウド保存機能

---

## [0.2.0] - 2025-11-02

### 追加
- プレビュー追従オン・オフ切り替え機能
  - ヘッダーにトグルスイッチを追加
  - スクロール時のプレビューパネル固定/追従を切り替え可能に

### 修正
- Canvas描画時のバグ修正
- レスポンシブ表示の調整

### ドキュメント
- `docs/` ディレクトリを作成
- 要件定義書（requirements.md）を追加
- 技術仕様書（technical-spec.md）を追加
- アーキテクチャ設計書（architecture.md）を追加
- UI/UX設計書（ui-ux-design.md）を追加
- 実装ガイド（implementation-guide.md）を追加
- API仕様書（api-spec.md）を追加
- 変更履歴（changelog.md）を追加

---

## [0.1.0] - 2025-11-01

### 追加（初回リリース）
- **基本機能（MVP）**:
  - 1500×500px固定サイズのCanvas生成
  - 背景色選択機能（カラーピッカー）
  - テキスト追加・編集機能
  - フォント選択（Google Fonts対応）
    - Noto Sans JP
    - Zen Kaku Gothic New
    - Noto Serif JP
    - Roboto
  - フォントサイズ調整（12px～200px）
  - 文字色変更（カラーピッカー）
  - テキスト位置調整（ドラッグ＆ドロップ）
  - PNG形式ダウンロード機能

- **コンポーネント**:
  - `BannerCanvas`: Fabric.js Canvas描画コンポーネント
  - `BackgroundPicker`: 背景色選択UI
  - `TextEditor`: テキスト編集UI
  - `FontSelector`: フォント選択ドロップダウン
  - `ExportControls`: PNG出力コントロール

- **カスタムフック**:
  - `useCanvas`: Canvas操作と状態管理を統合

- **ユーティリティ**:
  - `canvas.ts`: Canvas描画ヘルパー関数
  - `file.ts`: ファイル操作ユーティリティ
  - `validation.ts`: バリデーション関数

- **型定義**:
  - `canvas.ts`: Canvas関連型定義
  - Fabric.jsとの型統合

- **定数**:
  - `canvas.ts`: Canvas設定定数（幅、高さ、デフォルト背景色）
  - `fonts.ts`: Google Fonts定義

- **開発環境**:
  - React 18.2.0
  - TypeScript 5.2.2
  - Vite 5.2.0
  - Tailwind CSS 4.1.11
  - Fabric.js 6.7.1
  - ESLint + Prettier設定

- **ドキュメント**:
  - readme.md（要件定義書）
  - CLAUDE.md（Claude Code用ガイド）

---

## バージョニング規則

このプロジェクトは[セマンティック バージョニング](https://semver.org/lang/ja/)に従います：

- **メジャーバージョン (X.0.0)**: 互換性のない大きな変更
- **マイナーバージョン (0.X.0)**: 後方互換性のある機能追加
- **パッチバージョン (0.0.X)**: 後方互換性のあるバグ修正

### 変更カテゴリ

- `Added`: 新機能
- `Changed`: 既存機能の変更
- `Deprecated`: 非推奨化された機能
- `Removed`: 削除された機能
- `Fixed`: バグ修正
- `Security`: セキュリティ関連の修正
- `Performance`: パフォーマンス改善
- `Documentation`: ドキュメント更新

---

## リリースプロセス

### 1. バージョンアップ

```bash
# package.jsonのバージョンを更新
npm version patch  # 0.1.0 → 0.1.1
npm version minor  # 0.1.0 → 0.2.0
npm version major  # 0.1.0 → 1.0.0
```

### 2. Changelogに追記

```markdown
## [0.2.0] - YYYY-MM-DD

### Added
- 新機能の説明

### Fixed
- 修正内容
```

### 3. Gitコミット

```bash
git add .
git commit -m "chore: release v0.2.0"
git tag v0.2.0
git push origin main --tags
```

### 4. デプロイ

```bash
# Vercelに自動デプロイ
# mainブランチへのpushで自動的にデプロイされます
```

---

## マイルストーン

### Phase 1: MVP（完了目標: Week 2）
- [x] Canvas初期化
- [x] 背景色変更
- [x] テキスト追加・編集
- [x] フォント選択
- [x] PNG出力
- [x] レスポンシブ対応（基本）
- [x] プレビュー追従機能

### Phase 2: 拡張機能（完了目標: Week 6）
- [ ] グラデーション背景
- [ ] 画像背景アップロード
- [ ] 複数テキストレイヤー
- [ ] テキスト削除機能
- [ ] テンプレートシステム
- [ ] AIキャッチコピー生成
- [ ] プロフィール画像位置ガイド

### Phase 3: AI機能（完了目標: Week 12）
- [ ] AI背景画像生成（Stability AI）
- [ ] プロンプト入力UI
- [ ] 生成履歴管理
- [ ] コスト管理機能
- [ ] シェイプ追加機能
- [ ] ダークモード

### Phase 4: 最適化（完了目標: Week 16）
- [ ] パフォーマンス最適化
- [ ] E2Eテスト実装
- [ ] アクセシビリティ改善（WCAG 2.1 AA準拠）
- [ ] SEO最適化
- [ ] PWA対応
- [ ] 多言語対応（英語）

---

## 既知の問題

### 優先度: 高
- なし

### 優先度: 中
- [ ] 大きな画像アップロード時のメモリ使用量最適化
- [ ] Google Fonts読み込み完了までのローディング表示

### 優先度: 低
- [ ] Safari iOS でのタッチ操作の微調整
- [ ] 古いブラウザでのPolyfill追加

---

## 貢献者

- **初期開発**: [Your Name]
- **ドキュメント整備**: Claude Code AI Assistant

---

## リンク

- [プロジェクトリポジトリ](https://github.com/your-username/x-banner)
- [本番環境](https://x-banner.vercel.app)
- [課題トラッカー](https://github.com/your-username/x-banner/issues)
- [プルリクエスト](https://github.com/your-username/x-banner/pulls)

---

## 参考

- [Keep a Changelog](https://keepachangelog.com/ja/1.0.0/)
- [セマンティック バージョニング](https://semver.org/lang/ja/)
- [Conventional Commits](https://www.conventionalcommits.org/ja/)
