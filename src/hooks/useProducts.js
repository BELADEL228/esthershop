import { useState, useEffect } from 'react'
import { productsApi } from '../services/api/products'

export const useProducts = (filters = {}) => {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    loadProducts()
  }, [JSON.stringify(filters)])

  const loadProducts = async () => {
    try {
      setLoading(true)
      const data = await productsApi.getAll(filters)
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