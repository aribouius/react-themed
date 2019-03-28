import { createContext } from 'react'

export const ThemeContext = createContext()

export const {
  Provider: ThemeProvider,
  Consumer: ThemeConsumer,
} = ThemeContext

export const CONTEXT_KEY = 'theme'
export const CONFIG_KEY = '__THEME_CONFIG__'
