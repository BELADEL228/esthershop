import { useState, useEffect, useCallback } from 'react'
import { ordersApi } from '../services/api/orders'
import { useAuth } from './useAuth'
import toast from 'react-hot-toast'

export const useOrders = () => {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  
  const { user } = useAuth()

  // Charger les commandes de l'utilisateur connecté
  const loadOrders = useCallback(async () => {
    if (!user) {
      setOrders([])
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      setError(null)
      
      const data = await ordersApi.getUserOrders(user.id)
      setOrders(data || [])
      
    } catch (err) {
      console.error('❌ Erreur chargement commandes:', err)
      setError(err.message)
      toast.error('Erreur lors du chargement des commandes')
    } finally {
      setLoading(false)
    }
  }, [user])

  // Charger au montage et quand l'utilisateur change
  useEffect(() => {
    loadOrders()
  }, [loadOrders])

  // Créer une nouvelle commande
  const createOrder = async (orderData) => {
    try {
      const newOrder = await ordersApi.create({
        ...orderData,
        user_id: user?.id
      })
      
      toast.success('Commande créée avec succès !')
      await loadOrders() // Recharger la liste
      
      return { success: true, data: newOrder }
    } catch (err) {
      console.error('❌ Erreur création commande:', err)
      toast.error('Erreur lors de la création de la commande')
      return { success: false, error: err.message }
    }
  }

  // Annuler une commande
  const cancelOrder = async (orderId) => {
    const order = orders.find(o => o.id === orderId)
    
    if (!order) {
      toast.error('Commande non trouvée')
      return { success: false }
    }

    // Vérifier si la commande peut être annulée
    if (order.status !== 'pending') {
      toast.error('Seules les commandes en attente peuvent être annulées')
      return { success: false }
    }

    try {
      await ordersApi.cancel(orderId)
      
      // Mettre à jour la liste locale
      setOrders(prev => prev.map(order => 
        order.id === orderId ? { ...order, status: 'cancelled' } : order
      ))
      
      toast.success('Commande annulée avec succès')
      return { success: true }
    } catch (err) {
      console.error('❌ Erreur annulation commande:', err)
      toast.error('Erreur lors de l\'annulation')
      return { success: false, error: err.message }
    }
  }

  // Récupérer une commande spécifique
  const getOrderById = (orderId) => {
    return orders.find(order => order.id === orderId)
  }

  // Rafraîchir les commandes
  const refreshOrders = () => {
    loadOrders()
  }

  // Calculer des statistiques simples pour l'utilisateur
  const getUserStats = () => {
    return {
      total: orders.length,
      pending: orders.filter(o => o.status === 'pending').length,
      delivered: orders.filter(o => o.status === 'delivered').length,
      cancelled: orders.filter(o => o.status === 'cancelled').length,
      totalSpent: orders
        .filter(o => o.status === 'delivered')
        .reduce((sum, o) => sum + (o.total || 0), 0)
    }
  }

  return {
    // Données
    orders,
    loading,
    error,
    
    // Statistiques utilisateur
    stats: getUserStats(),
    
    // Actions
    createOrder,
    cancelOrder,
    getOrderById,
    refreshOrders,
    
    // Utilitaires
    user
  }
}