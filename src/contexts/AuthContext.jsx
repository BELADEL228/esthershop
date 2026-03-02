import { createContext } from 'react'

// Création du contexte avec des valeurs par défaut
export const AuthContext = createContext({
  user: null,
  loading: true,
  isAdmin: false,
  signIn: async () => {},
  signUp: async () => {},
  signOut: async () => {}
})