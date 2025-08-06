export interface TextConfig {
  text: string
  fontFamily: string
  fontSize: number
  color: string
  left: number
  top: number
  fontWeight?: string
  isVertical?: boolean
  shadow?: {
    enabled: boolean
    color: string
    blur: number
    offsetX: number
    offsetY: number
  }
}

export interface BackgroundConfig {
  type: 'color' | 'gradient' | 'image'
  color?: string
  gradient?: {
    colors: string[]
    direction: 'horizontal' | 'vertical' | 'diagonal'
  }
  image?: string
}

export interface BannerConfig {
  background: BackgroundConfig
  texts: TextConfig[]
}