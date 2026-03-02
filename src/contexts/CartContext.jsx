import React, { createContext, useContext } from 'react'

// Création du contexte
export const CartContext = createContext()

// Hook personnalisé
export const useCart = () => {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}