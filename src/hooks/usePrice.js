// src/hooks/usePrice.js
import { useCurrency } from '../contexts/CurrencyContext'

export const usePrice = () => {
  const { formatPrice } = useCurrency()
  return formatPrice
}