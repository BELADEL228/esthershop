import React, { useReducer, useEffect } from 'react'
import { CartContext } from './CartContext'
import toast from 'react-hot-toast'

const initialState = {
  items: [],
  total: 0
}

const calculateTotal = (items) => {
  return items.reduce((sum, item) => sum + item.price * item.quantity, 0)
}

const cartReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_ITEM': {
      const existingItem = state.items.find(item => item.id === action.payload.id)
      
      if (existingItem) {
        const updatedItems = state.items.map(item =>
          item.id === action.payload.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
        return {
          ...state,
          items: updatedItems,
          total: calculateTotal(updatedItems)
        }
      }

      const newItems = [...state.items, { ...action.payload, quantity: 1 }]
      return {
        ...state,
        items: newItems,
        total: calculateTotal(newItems)
      }
    }

    case 'REMOVE_ITEM': {
      const filteredItems = state.items.filter(item => item.id !== action.payload)
      return {
        ...state,
        items: filteredItems,
        total: calculateTotal(filteredItems)
      }
    }

    case 'UPDATE_QUANTITY': {
      const updatedItems = state.items.map(item =>
        item.id === action.payload.id
          ? { ...item, quantity: action.payload.quantity }
          : item
      )
      return {
        ...state,
        items: updatedItems,
        total: calculateTotal(updatedItems)
      }
    }

    case 'CLEAR_CART':
      return initialState

    case 'LOAD_CART':
      return action.payload

    default:
      return state
  }
}

export const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState)

  // Charger le panier depuis localStorage au démarrage
  useEffect(() => {
    const savedCart = localStorage.getItem('cart')
    if (savedCart) {
      dispatch({ type: 'LOAD_CART', payload: JSON.parse(savedCart) })
    }
  }, [])

  // Sauvegarder dans localStorage à chaque modification
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(state))
  }, [state])

  const addToCart = (product) => {
    dispatch({ type: 'ADD_ITEM', payload: product })
    toast.success('Produit ajouté au panier')
  }

  const removeFromCart = (productId) => {
    dispatch({ type: 'REMOVE_ITEM', payload: productId })
    toast.success('Produit retiré du panier')
  }

  const updateQuantity = (productId, quantity) => {
    if (quantity < 1) return
    dispatch({ type: 'UPDATE_QUANTITY', payload: { id: productId, quantity } })
  }

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' })
  }

  return (
    <CartContext.Provider value={{
      cart: state,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart
    }}>
      {children}
    </CartContext.Provider>
  )
}