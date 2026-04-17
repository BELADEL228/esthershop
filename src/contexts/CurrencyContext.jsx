import React, { createContext, useContext, useState, useEffect } from 'react'

const CurrencyContext = createContext()

const EXCHANGE_RATE = 600 // 1 USD = 600 FCFA (à ajuster selon le taux réel)

export const useCurrency = () => {
  const context = useContext(CurrencyContext)
  if (!context) throw new Error('useCurrency must be used within CurrencyProvider')
  return context
}

export const CurrencyProvider = ({ children }) => {
  const [currency, setCurrency] = useState(() => {
    const saved = localStorage.getItem('preferredCurrency')
    return saved || 'XOF' // par défaut Franc CFA
  })

  useEffect(() => {
    localStorage.setItem('preferredCurrency', currency)
  }, [currency])

  const convertPrice = (amountInXOF) => {
    if (currency === 'USD') {
      return amountInXOF / EXCHANGE_RATE
    }
    return amountInXOF
  }

  const formatPrice = (amountInXOF) => {
    const converted = convertPrice(amountInXOF)
    if (currency === 'USD') {
      return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(converted)
    }
    return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'XOF' }).format(converted).replace('FCFA', 'FCFA')
  }

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency, convertPrice, formatPrice }}>
      {children}
    </CurrencyContext.Provider>
  )
}