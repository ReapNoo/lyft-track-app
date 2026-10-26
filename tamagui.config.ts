import { defaultConfig } from '@tamagui/config/v6'
import { createTamagui } from 'tamagui'

const darkTheme = {
  ...defaultConfig.themes.dark,
  background: '#121214',
  backgroundHover: '#18181C',
  backgroundPress: '#101012',
  backgroundFocus: '#1E1E22',
  color: '#FFFFFF',
  colorHover: '#F1F5F9',
  colorPress: '#CBD5E1',
  colorFocus: '#FFFFFF',
  borderColor: 'rgba(255, 255, 255, 0.08)',
  borderColorHover: 'rgba(6, 182, 212, 0.4)',
  borderColorFocus: '#06b6d4',
  accentBackground: '#06b6d4',
  accentColor: '#FFFFFF',
}

export const tamaguiConfig = createTamagui({
  ...defaultConfig,
  shorthands: {},
  themes: {
    ...defaultConfig.themes,
    dark: darkTheme,
  },
})

export type Conf = typeof tamaguiConfig
declare module 'tamagui' {
  interface TamaguiCustomConfig extends Conf {}
}

export default tamaguiConfig
