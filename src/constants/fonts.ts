export interface FontOption {
  name: string
  value: string
  category: 'japanese' | 'english' | 'decorative'
  weights: string[]
}

export const FONT_OPTIONS: FontOption[] = [
  // 日本語フォント
  {
    name: 'Noto Sans JP',
    value: 'Noto Sans JP',
    category: 'japanese',
    weights: ['400', '500', '600', '700'],
  },
  {
    name: 'Noto Serif JP',
    value: 'Noto Serif JP',
    category: 'japanese',
    weights: ['400', '500', '600', '700'],
  },
  {
    name: 'M PLUS 1p',
    value: 'M PLUS 1p',
    category: 'japanese',
    weights: ['400', '500', '700', '800'],
  },
  {
    name: 'Kosugi Maru',
    value: 'Kosugi Maru',
    category: 'japanese',
    weights: ['400'],
  },
  {
    name: 'Sawarabi Gothic',
    value: 'Sawarabi Gothic',
    category: 'japanese',
    weights: ['400'],
  },
  
  // 英語フォント
  {
    name: 'Inter',
    value: 'Inter',
    category: 'english',
    weights: ['400', '500', '600', '700', '800'],
  },
  {
    name: 'Roboto',
    value: 'Roboto',
    category: 'english',
    weights: ['300', '400', '500', '700'],
  },
  {
    name: 'Open Sans',
    value: 'Open Sans',
    category: 'english',
    weights: ['400', '600', '700'],
  },
  {
    name: 'Montserrat',
    value: 'Montserrat',
    category: 'english',
    weights: ['400', '500', '600', '700', '800'],
  },
  
  // デコラティブフォント
  {
    name: 'Playfair Display',
    value: 'Playfair Display',
    category: 'decorative',
    weights: ['400', '700'],
  },
  {
    name: 'Dancing Script',
    value: 'Dancing Script',
    category: 'decorative',
    weights: ['400', '700'],
  },
  {
    name: 'Bebas Neue',
    value: 'Bebas Neue',
    category: 'decorative',
    weights: ['400'],
  },
]

export const FONT_CATEGORIES = {
  japanese: '日本語',
  english: '英語',
  decorative: 'デコラティブ',
} as const