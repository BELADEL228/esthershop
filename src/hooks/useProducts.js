import { useState, useEffect } from 'react'
import { productsApi } from '../services/api/products'

export const useProducts = (filters = {}, includeInactive = false) => {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    loadProducts()
  }, [JSON.stringify(filters), includeInactive])

  const loadProducts = async () => {
    try {
      setLoading(true)
      const data = await productsApi.getAll(filters, includeInactive)
      setProducts(data)
      setError(null)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return { products, loading, error, refetch: loadProducts }
}