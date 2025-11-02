# API仕様書

**プロジェクト名**: X Banner Studio
**バージョン**: 1.0.0
**最終更新日**: 2025-11-02

---

## 1. 概要

このドキュメントでは、X Banner Studioが使用する外部APIの仕様を定義します。

**注意**: MVP（Phase 1）では外部API連携は実装せず、Phase 2以降の拡張機能として実装予定です。

---

## 2. API一覧

| API名 | 用途 | Phase | 優先度 |
|------|-----|-------|-------|
| Google Fonts API | フォント一覧取得・読み込み | Phase 1 | P0 |
| OpenAI Chat API | キャッチコピー生成 | Phase 2 | P2 |
| Stability AI | 背景画像生成 | Phase 3 | P3 |
| DALL-E 3 | 背景画像生成（代替） | Phase 3 | P3 |

---

## 3. Google Fonts API

### 3.1 概要

- **ベースURL**: `https://fonts.googleapis.com`
- **認証**: APIキー（オプション）
- **料金**: 無料
- **レート制限**: 特になし（CDN経由）

### 3.2 フォント読み込み

#### エンドポイント
```
GET /css2?family={fontFamily}:wght@{weights}&display=swap
```

#### リクエストパラメータ

| パラメータ | 型 | 必須 | 説明 | 例 |
|-----------|---|-----|------|---|
| family | string | ✓ | フォントファミリー名（スペースは+に置換） | `Noto+Sans+JP` |
| wght | string | | ウェイト指定（複数可、セミコロン区切り） | `400;700` |
| display | string | | フォント表示方法 | `swap` |

#### レスポンス例
```css
/* 生成されたCSSファイル */
@font-face {
  font-family: 'Noto Sans JP';
  font-style: normal;
  font-weight: 400;
  font-display: swap;
  src: url(https://fonts.gstatic.com/s/...) format('woff2');
  unicode-range: U+0000-00FF, ...;
}
```

#### 実装例

```typescript
// src/utils/font.ts

/**
 * Google Fontsを動的に読み込む
 * @param fontFamily - フォントファミリー名
 * @param weights - ウェイト配列（デフォルト: [400, 700]）
 */
export const loadGoogleFont = (
  fontFamily: string,
  weights: number[] = [400, 700]
): void => {
  const weightsParam = weights.join(';');
  const fontParam = `${fontFamily.replace(/ /g, '+')}:wght@${weightsParam}`;
  const url = `https://fonts.googleapis.com/css2?family=${fontParam}&display=swap`;

  // 既に読み込み済みか確認
  const existingLink = document.querySelector(`link[href="${url}"]`);
  if (existingLink) return;

  // <link>要素を作成して追加
  const link = document.createElement('link');
  link.href = url;
  link.rel = 'stylesheet';
  document.head.appendChild(link);
};
```

#### 使用例

```typescript
// コンポーネント内で使用
useEffect(() => {
  loadGoogleFont('Noto Sans JP');
  loadGoogleFont('Zen Kaku Gothic New');
  loadGoogleFont('Roboto');
}, []);
```

---

### 3.3 フォント一覧取得（オプション）

#### エンドポイント
```
GET /webfonts/v1/webfonts?key={API_KEY}&sort=popularity
```

#### リクエストパラメータ

| パラメータ | 型 | 必須 | 説明 |
|-----------|---|-----|------|
| key | string | ✓ | Google API Key |
| sort | string | | ソート順（popularity, alpha, trending, style, date） |

#### レスポンス例
```json
{
  "kind": "webfonts#webfontList",
  "items": [
    {
      "family": "Roboto",
      "variants": ["100", "300", "regular", "500", "700", "900"],
      "subsets": ["latin", "latin-ext", "cyrillic"],
      "category": "sans-serif",
      "kind": "webfonts#webfont"
    },
    {
      "family": "Noto Sans JP",
      "variants": ["100", "300", "regular", "500", "700", "900"],
      "subsets": ["japanese", "latin"],
      "category": "sans-serif",
      "kind": "webfonts#webfont"
    }
  ]
}
```

#### 実装例

```typescript
// src/services/googleFonts.ts

interface GoogleFont {
  family: string;
  variants: string[];
  subsets: string[];
  category: string;
}

/**
 * Google Fonts一覧を取得（日本語フォントのみ）
 */
export const fetchJapaneseFonts = async (): Promise<GoogleFont[]> => {
  const apiKey = import.meta.env.VITE_GOOGLE_FONTS_API_KEY;
  const url = `https://www.googleapis.com/webfonts/v1/webfonts?key=${apiKey}&sort=popularity`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    // 日本語フォントのみフィルタリング
    return data.items.filter((font: GoogleFont) =>
      font.subsets.includes('japanese')
    );
  } catch (error) {
    console.error('Failed to fetch Google Fonts:', error);
    return [];
  }
};
```

---

## 4. OpenAI Chat API（Phase 2）

### 4.1 概要

- **ベースURL**: `https://api.openai.com/v1`
- **認証**: Bearer Token（APIキー）
- **料金**: 従量課金
  - GPT-4o-mini: $0.150 / 1M input tokens, $0.600 / 1M output tokens
- **レート制限**:
  - Tier 1: 500 RPM (Requests Per Minute)
  - 3,000 RPD (Requests Per Day)

### 4.2 キャッチコピー生成

#### エンドポイント
```
POST /chat/completions
```

#### リクエストヘッダー

| ヘッダー | 値 |
|---------|---|
| Content-Type | application/json |
| Authorization | Bearer {API_KEY} |

#### リクエストボディ

```typescript
interface ChatCompletionRequest {
  model: string;              // "gpt-4o-mini"
  messages: Message[];        // 会話履歴
  max_tokens?: number;        // 最大出力トークン数（デフォルト: 無制限）
  temperature?: number;       // ランダム性（0.0～2.0、デフォルト: 1.0）
  n?: number;                 // 生成する候補数（デフォルト: 1）
  stop?: string[];            // 停止シーケンス
}

interface Message {
  role: 'system' | 'user' | 'assistant';
  content: string;
}
```

#### リクエスト例

```json
{
  "model": "gpt-4o-mini",
  "messages": [
    {
      "role": "system",
      "content": "あなたはSNSバナー用のキャッチコピーを提案するプロフェッショナルです。簡潔で印象的な日本語のフレーズを生成してください。20文字以内で、記号は最小限にしてください。"
    },
    {
      "role": "user",
      "content": "職業: Web開発者\nスキル: React, TypeScript, Tailwind CSS\nアピールポイント: モダンなフロントエンド開発"
    }
  ],
  "max_tokens": 50,
  "temperature": 0.7,
  "n": 3
}
```

#### レスポンス例

```json
{
  "id": "chatcmpl-123",
  "object": "chat.completion",
  "created": 1677652288,
  "model": "gpt-4o-mini",
  "choices": [
    {
      "index": 0,
      "message": {
        "role": "assistant",
        "content": "React × TypeScriptで未来を創る"
      },
      "finish_reason": "stop"
    },
    {
      "index": 1,
      "message": {
        "role": "assistant",
        "content": "モダンフロントエンドのプロ"
      },
      "finish_reason": "stop"
    },
    {
      "index": 2,
      "message": {
        "role": "assistant",
        "content": "コードで世界を変える"
      },
      "finish_reason": "stop"
    }
  ],
  "usage": {
    "prompt_tokens": 56,
    "completion_tokens": 38,
    "total_tokens": 94
  }
}
```

#### 実装例

```typescript
// src/services/openai.ts

interface CatchphraseRequest {
  occupation: string;
  skills: string[];
  appeal: string;
}

/**
 * OpenAI APIでキャッチコピーを生成
 * @param request - ユーザー入力情報
 * @returns 生成されたキャッチコピー候補（3つ）
 */
export const generateCatchphrases = async (
  request: CatchphraseRequest
): Promise<string[]> => {
  const apiKey = import.meta.env.VITE_OPENAI_API_KEY;

  if (!apiKey) {
    throw new Error('OpenAI API key is not configured');
  }

  const prompt = `職業: ${request.occupation}\nスキル: ${request.skills.join(', ')}\nアピールポイント: ${request.appeal}`;

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: 'あなたはSNSバナー用のキャッチコピーを提案するプロフェッショナルです。簡潔で印象的な日本語のフレーズを生成してください。20文字以内で、記号は最小限にしてください。'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 50,
        temperature: 0.7,
        n: 3
      })
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    return data.choices.map((choice: any) => choice.message.content.trim());
  } catch (error) {
    console.error('Failed to generate catchphrases:', error);
    throw error;
  }
};
```

#### エラーハンドリング

| ステータスコード | 説明 | 対処 |
|-----------------|-----|-----|
| 401 | 認証エラー | APIキー確認 |
| 429 | レート制限超過 | リトライ（指数バックオフ） |
| 500 | サーバーエラー | リトライ |

```typescript
const retryWithBackoff = async (
  fn: () => Promise<any>,
  maxRetries: number = 3
): Promise<any> => {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error: any) {
      if (error.status === 429 && i < maxRetries - 1) {
        const delay = Math.pow(2, i) * 1000; // 1s, 2s, 4s
        await new Promise(resolve => setTimeout(resolve, delay));
      } else {
        throw error;
      }
    }
  }
};
```

---

## 5. Stability AI（Phase 3）

### 5.1 概要

- **ベースURL**: `https://api.stability.ai/v1`
- **認証**: APIキー（ヘッダー）
- **料金**: クレジットベース
  - Stable Diffusion XL: 6.5 credits per image
- **レート制限**: 150 requests/10 seconds

### 5.2 テキストから画像生成

#### エンドポイント
```
POST /generation/{engine_id}/text-to-image
```

#### リクエストヘッダー

| ヘッダー | 値 |
|---------|---|
| Content-Type | application/json |
| Authorization | Bearer {API_KEY} |

#### リクエストボディ

```typescript
interface TextToImageRequest {
  text_prompts: TextPrompt[];
  cfg_scale?: number;        // プロンプト忠実度（0～35、デフォルト: 7）
  height?: number;           // 画像高さ（64の倍数、最大: 1536）
  width?: number;            // 画像幅（64の倍数、最大: 1536）
  samples?: number;          // 生成する画像数（1～10）
  steps?: number;            // 推論ステップ数（10～50、デフォルト: 30）
}

interface TextPrompt {
  text: string;
  weight?: number;           // プロンプトの重み（-1.0～1.0）
}
```

#### リクエスト例

```json
{
  "text_prompts": [
    {
      "text": "beautiful sunset over ocean, vibrant colors, professional photography, 4k",
      "weight": 1.0
    },
    {
      "text": "low quality, blurry, watermark",
      "weight": -1.0
    }
  ],
  "cfg_scale": 7,
  "height": 512,
  "width": 1536,
  "samples": 1,
  "steps": 30
}
```

#### レスポンス例

```json
{
  "artifacts": [
    {
      "base64": "iVBORw0KGgoAAAANS...",
      "seed": 1050625087,
      "finishReason": "SUCCESS"
    }
  ]
}
```

#### 実装例

```typescript
// src/services/stabilityAI.ts

interface ImageGenerationRequest {
  prompt: string;
  negativePrompt?: string;
  width: number;
  height: number;
}

/**
 * Stability AIで背景画像を生成
 * @param request - 画像生成リクエスト
 * @returns Base64エンコードされた画像データ
 */
export const generateBackgroundImage = async (
  request: ImageGenerationRequest
): Promise<string> => {
  const apiKey = import.meta.env.VITE_STABILITY_API_KEY;
  const engineId = 'stable-diffusion-xl-1024-v1-0';

  if (!apiKey) {
    throw new Error('Stability AI API key is not configured');
  }

  try {
    const response = await fetch(
      `https://api.stability.ai/v1/generation/${engineId}/text-to-image`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          text_prompts: [
            {
              text: request.prompt,
              weight: 1.0
            },
            {
              text: request.negativePrompt || 'low quality, blurry, watermark',
              weight: -1.0
            }
          ],
          cfg_scale: 7,
          height: request.height,
          width: request.width,
          samples: 1,
          steps: 30
        })
      }
    );

    if (!response.ok) {
      throw new Error(`Stability AI error: ${response.status}`);
    }

    const data = await response.json();
    return `data:image/png;base64,${data.artifacts[0].base64}`;
  } catch (error) {
    console.error('Failed to generate image:', error);
    throw error;
  }
};
```

---

## 6. DALL-E 3（Phase 3 - 代替案）

### 6.1 概要

- **ベースURL**: `https://api.openai.com/v1`
- **認証**: Bearer Token
- **料金**:
  - Standard (1024×1024): $0.040 per image
  - Standard (1024×1792, 1792×1024): $0.080 per image
- **レート制限**: 50 images/minute

### 6.2 画像生成

#### エンドポイント
```
POST /images/generations
```

#### リクエストボディ

```typescript
interface DallERequest {
  model: 'dall-e-3';
  prompt: string;
  n?: number;                // 生成数（DALL-E 3は1のみ）
  size?: '1024x1024' | '1024x1792' | '1792x1024';
  quality?: 'standard' | 'hd';
  style?: 'vivid' | 'natural';
}
```

#### リクエスト例

```json
{
  "model": "dall-e-3",
  "prompt": "beautiful sunset over ocean, vibrant colors, professional photography",
  "n": 1,
  "size": "1792x1024",
  "quality": "standard",
  "style": "vivid"
}
```

#### レスポンス例

```json
{
  "created": 1698765432,
  "data": [
    {
      "url": "https://oaidalleapiprodscus.blob.core.windows.net/private/...",
      "revised_prompt": "A beautiful sunset over the ocean with vibrant colors..."
    }
  ]
}
```

---

## 7. セキュリティ対策

### 7.1 APIキー管理

```bash
# .env.local（Gitにコミットしない）
VITE_GOOGLE_FONTS_API_KEY=AIzaSyXXXXXXXXXXXXXXXXX
VITE_OPENAI_API_KEY=sk-XXXXXXXXXXXXXXXXXXXXXXXX
VITE_STABILITY_API_KEY=sk-XXXXXXXXXXXXXXXXXXXXXXXX
```

```typescript
// アクセス方法
const apiKey = import.meta.env.VITE_OPENAI_API_KEY;

// 本番環境チェック
if (!apiKey && import.meta.env.PROD) {
  throw new Error('API key is required in production');
}
```

### 7.2 レート制限対策

```typescript
// src/utils/rateLimit.ts

class RateLimiter {
  private requests: number[] = [];
  private maxRequests: number;
  private timeWindow: number; // ミリ秒

  constructor(maxRequests: number, timeWindowSeconds: number) {
    this.maxRequests = maxRequests;
    this.timeWindow = timeWindowSeconds * 1000;
  }

  async acquire(): Promise<void> {
    const now = Date.now();

    // 古いリクエストを削除
    this.requests = this.requests.filter(
      (timestamp) => now - timestamp < this.timeWindow
    );

    // 制限チェック
    if (this.requests.length >= this.maxRequests) {
      const oldestRequest = this.requests[0];
      const waitTime = this.timeWindow - (now - oldestRequest);
      await new Promise((resolve) => setTimeout(resolve, waitTime));
    }

    this.requests.push(Date.now());
  }
}

// OpenAI用（3 requests/minute）
export const openAILimiter = new RateLimiter(3, 60);

// Stability AI用（150 requests/10 seconds）
export const stabilityLimiter = new RateLimiter(150, 10);
```

### 7.3 コスト制御

```typescript
// src/utils/costControl.ts

const MAX_DAILY_COST = 5.00; // $5/日
const COST_PER_CATCHPHRASE = 0.001; // 概算
const COST_PER_IMAGE = 0.04; // DALL-E 3 standard

let dailyCost = 0;
let lastResetDate = new Date().toDateString();

export const checkBudget = (operation: 'catchphrase' | 'image'): boolean => {
  const today = new Date().toDateString();

  // 日付が変わったらリセット
  if (today !== lastResetDate) {
    dailyCost = 0;
    lastResetDate = today;
  }

  const cost = operation === 'catchphrase' ? COST_PER_CATCHPHRASE : COST_PER_IMAGE;

  if (dailyCost + cost > MAX_DAILY_COST) {
    alert('本日の利用上限に達しました。明日再度お試しください。');
    return false;
  }

  dailyCost += cost;
  return true;
};
```

---

## 8. テスト

### 8.1 APIモック

```typescript
// src/services/__mocks__/openai.ts

export const generateCatchphrases = async (): Promise<string[]> => {
  return [
    'React × TypeScriptで未来を創る',
    'モダンフロントエンドのプロ',
    'コードで世界を変える'
  ];
};
```

### 8.2 統合テスト

```typescript
// src/services/openai.test.ts

import { describe, it, expect, vi } from 'vitest';
import { generateCatchphrases } from './openai';

describe('generateCatchphrases', () => {
  it('キャッチコピーを3つ生成する', async () => {
    const result = await generateCatchphrases({
      occupation: 'Web開発者',
      skills: ['React', 'TypeScript'],
      appeal: 'モダン開発'
    });

    expect(result).toHaveLength(3);
    expect(result[0]).toBeTypeOf('string');
  });

  it('APIキーがない場合はエラー', async () => {
    vi.stubEnv('VITE_OPENAI_API_KEY', '');

    await expect(generateCatchphrases({
      occupation: 'Web開発者',
      skills: ['React'],
      appeal: 'モダン開発'
    })).rejects.toThrow('OpenAI API key is not configured');
  });
});
```

---

## 9. パフォーマンス最適化

### 9.1 キャッシング

```typescript
// src/utils/cache.ts

const cache = new Map<string, { data: any; timestamp: number }>();
const CACHE_TTL = 24 * 60 * 60 * 1000; // 24時間

export const cachedFetch = async <T>(
  key: string,
  fetcher: () => Promise<T>
): Promise<T> => {
  const cached = cache.get(key);

  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.data;
  }

  const data = await fetcher();
  cache.set(key, { data, timestamp: Date.now() });
  return data;
};

// 使用例
const fonts = await cachedFetch('google-fonts-ja', fetchJapaneseFonts);
```

---

## 10. モニタリング

### 10.1 APIコール追跡

```typescript
// src/utils/analytics.ts

export const trackAPICall = (
  apiName: string,
  status: 'success' | 'error',
  duration: number
) => {
  console.log(`[API] ${apiName}: ${status} (${duration}ms)`);

  // Vercel Analyticsに送信（将来的）
  if (window.va) {
    window.va.track('api_call', {
      api: apiName,
      status,
      duration
    });
  }
};

// 使用例
const start = Date.now();
try {
  const result = await generateCatchphrases(request);
  trackAPICall('openai_catchphrase', 'success', Date.now() - start);
  return result;
} catch (error) {
  trackAPICall('openai_catchphrase', 'error', Date.now() - start);
  throw error;
}
```

---

## 変更履歴

| 日付 | バージョン | 変更内容 | 担当者 |
|-----|----------|---------|-------|
| 2025-11-02 | 1.0.0 | 初版作成 | - |
