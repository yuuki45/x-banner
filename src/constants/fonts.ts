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
    name: 'M PLUS Rounded 1c',
    value: 'M PLUS Rounded 1c',
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
  {
    name: 'Mochiy Pop One',
    value: 'Mochiy Pop One',
    category: 'japanese',
    weights: ['400'],
  },
  {
    name: 'Yusei Magic',
    value: 'Yusei Magic',
    category: 'japanese',
    weights: ['400'],
  },
  {
    name: 'Rampart One',
    value: 'Rampart One',
    category: 'japanese',
    weights: ['400'],
  },
  {
    name: 'Zen Kaku Gothic New',
    value: 'Zen Kaku Gothic New',
    category: 'japanese',
    weights: ['400', '500', '700'],
  },
  {
    name: 'Zen Maru Gothic',
    value: 'Zen Maru Gothic',
    category: 'japanese',
    weights: ['400', '500', '700'],
  },
  {
    name: 'Shippori Mincho',
    value: 'Shippori Mincho',
    category: 'japanese',
    weights: ['400', '500', '600', '700', '800'],
  },
  {
    name: 'Hachi Maru Pop',
    value: 'Hachi Maru Pop',
    category: 'japanese',
    weights: ['400'],
  },
  {
    name: 'Kiwi Maru',
    value: 'Kiwi Maru',
    category: 'japanese',
    weights: ['400', '500'],
  },
  {
    name: 'Reggae One',
    value: 'Reggae One',
    category: 'japanese',
    weights: ['400'],
  },
  {
    name: 'RocknRoll One',
    value: 'RocknRoll One',
    category: 'japanese',
    weights: ['400'],
  },
  {
    name: 'Kaisei Decol',
    value: 'Kaisei Decol',
    category: 'japanese',
    weights: ['400', '500', '700'],
  },
  {
    name: 'Dela Gothic One',
    value: 'Dela Gothic One',
    category: 'japanese',
    weights: ['400'],
  },
  {
    name: 'New Tegomin',
    value: 'New Tegomin',
    category: 'japanese',
    weights: ['400'],
  },
  {
    name: 'Stick',
    value: 'Stick',
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
  {
    name: 'Lato',
    value: 'Lato',
    category: 'english',
    weights: ['400', '700'],
  },
  {
    name: 'Oswald',
    value: 'Oswald',
    category: 'english',
    weights: ['400', '500', '600', '700'],
  },
  {
    name: 'Raleway',
    value: 'Raleway',
    category: 'english',
    weights: ['400', '500', '600', '700'],
  },
  {
    name: 'Poppins',
    value: 'Poppins',
    category: 'english',
    weights: ['400', '500', '600', '700'],
  },
  {
    name: 'Merriweather',
    value: 'Merriweather',
    category: 'english',
    weights: ['400', '700'],
  },
  {
    name: 'Source Sans Pro',
    value: 'Source Sans Pro',
    category: 'english',
    weights: ['400', '600', '700'],
  },
  {
    name: 'Ubuntu',
    value: 'Ubuntu',
    category: 'english',
    weights: ['400', '500', '700'],
  },
  {
    name: 'Nunito',
    value: 'Nunito',
    category: 'english',
    weights: ['400', '600', '700'],
  },
  {
    name: 'PT Sans',
    value: 'PT Sans',
    category: 'english',
    weights: ['400', '700'],
  },
  {
    name: 'Work Sans',
    value: 'Work Sans',
    category: 'english',
    weights: ['400', '500', '600', '700'],
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
  {
    name: 'Lobster',
    value: 'Lobster',
    category: 'decorative',
    weights: ['400'],
  },
  {
    name: 'Pacifico',
    value: 'Pacifico',
    category: 'decorative',
    weights: ['400'],
  },
  {
    name: 'Righteous',
    value: 'Righteous',
    category: 'decorative',
    weights: ['400'],
  },
  {
    name: 'Bangers',
    value: 'Bangers',
    category: 'decorative',
    weights: ['400'],
  },
  {
    name: 'Permanent Marker',
    value: 'Permanent Marker',
    category: 'decorative',
    weights: ['400'],
  },
  {
    name: 'Comfortaa',
    value: 'Comfortaa',
    category: 'decorative',
    weights: ['400', '700'],
  },
  {
    name: 'Audiowide',
    value: 'Audiowide',
    category: 'decorative',
    weights: ['400'],
  },
  {
    name: 'Bungee',
    value: 'Bungee',
    category: 'decorative',
    weights: ['400'],
  },
  {
    name: 'Fredoka One',
    value: 'Fredoka One',
    category: 'decorative',
    weights: ['400'],
  },
  {
    name: 'Satisfy',
    value: 'Satisfy',
    category: 'decorative',
    weights: ['400'],
  },
  {
    name: 'Archivo Black',
    value: 'Archivo Black',
    category: 'decorative',
    weights: ['400'],
  },
  {
    name: 'Faster One',
    value: 'Faster One',
    category: 'decorative',
    weights: ['400'],
  },
]

export const FONT_CATEGORIES = {
  japanese: '日本語',
  english: '英語',
  decorative: 'デコラティブ',
} as const