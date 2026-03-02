import { useState, useEffect } from 'react'
import { ordersApi } from '../services/api/orders'
import { useAuth } from './useAuth'

export const useOrders = () => {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const { user } = useAuth()

  useEffect(() => {
    if (user) {
      loadOrders()
    }
  }, [user])

  const loadOrders = async () => {
    try {
      const data = await ordersApi.getUserOrders(user.id)
      setOrders(data)
    } catch (error) {
      console.error('Erreur chargement commandes:', error)
    } finally {
      setLoading(false)
    }
  }

  return { orders, loading, refetch: loadOrders }
}