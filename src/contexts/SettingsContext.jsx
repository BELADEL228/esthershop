import { createContext } from 'react'

export const SettingsContext = createContext({
  settings: null,
  loading: true,
  updateSettings: async () => {},
  refreshSettings: async () => {}
})