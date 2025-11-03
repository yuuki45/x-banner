# Public Assets

このフォルダには、OGP画像やファビコンなどの静的アセットを配置します。

## OGP画像の配置

以下の画像を配置してください：

### 必須ファイル

1. **`ogp.png`** または **`ogp.jpg`**
   - サイズ: **1200×630px** (推奨)
   - 用途: OGP (Open Graph Protocol) 画像
   - SNSでシェアされた際に表示される画像
   - 最大ファイルサイズ: 8MB以下
   - 形式: PNG または JPEG

### 推奨ファイル

2. **`favicon.ico`**
   - サイズ: 16×16px, 32×32px, 48×48px (複数サイズを含む)
   - ブラウザタブに表示されるアイコン

3. **`apple-touch-icon.png`**
   - サイズ: 180×180px
   - iOSデバイスでホーム画面に追加された際のアイコン

## 配置後の確認事項

画像を配置したら、以下を確認してください：

1. `index.html` のメタタグで正しいファイル名が指定されているか
2. 画像のファイルサイズが適切か（大きすぎないか）
3. ローカル開発サーバーで画像が正しく表示されるか

## パス指定

Viteプロジェクトでは、`public/` フォルダ内のファイルはビルド時にルートにコピーされます。

- 実際のファイルパス: `/public/ogp.png`
- HTMLでの参照パス: `/ogp.png`

## OGP画像のデザインガイド

- **テキストは大きく**: 小さい画面でも読めるように
- **シンプルに**: 複雑なデザインは避ける
- **ブランドカラー**: アプリのカラー（#3b82f6 など）を使用
- **タイトルを含める**: "X Banner Studio" など
- **セーフエリア**: 端から40px程度の余白を確保

## テストツール

OGP画像が正しく設定されているかテストできるツール：

- [Facebook Sharing Debugger](https://developers.facebook.com/tools/debug/)
- [Twitter Card Validator](https://cards-dev.twitter.com/validator)
- [LinkedIn Post Inspector](https://www.linkedin.com/post-inspector/)
