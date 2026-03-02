import { createContext } from 'react'

// Création du contexte avec une valeur par défaut
export const ThemeContext = createContext({
  darkMode: false,
  toggleDarkMode: () => {}
})