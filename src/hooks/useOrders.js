import { useState, useEffect, useCallback } from 'react'
import { ordersApi } from '../services/api/orders'
import { useAuth } from './useAuth'
import toast from 'react-hot-toast'

export const useOrders = () => {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    processing: 0,
    shipped: 0,
    delivered: 0,
    cancelled: 0,
    revenue: 0
  })
  
  const { user, isAdmin } = useAuth()  // ← isAdmin est IMPORTANT

  // Charger les commandes (utilisateur ou admin)
  const loadOrders = useCallback(async () => {
    if (!user) {
      setOrders([])
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      setError(null)
      
      let data
      if (isAdmin) {
        // Admin voit toutes les commandes
        data = await ordersApi.getAll()
      } else {
        // Utilisateur voit ses commandes
        data = await ordersApi.getUserOrders(user.id)
      }
      
      setOrders(data || [])
      calculateStats(data || [])
      
    } catch (err) {
      console.error('❌ Erreur chargement commandes:', err)
      setError(err.message)
      toast.error('Erreur lors du chargement des commandes')
    } finally {
      setLoading(false)
    }
  }, [user, isAdmin])

  // Calculer les statistiques
  const calculateStats = (ordersData) => {
    const newStats = {
      total: ordersData.length,
      pending: ordersData.filter(o => o.status === 'pending').length,
      processing: ordersData.filter(o => o.status === 'processing').length,
      shipped: ordersData.filter(o => o.status === 'shipped').length,
      delivered: ordersData.filter(o => o.status === 'delivered').length,
      cancelled: ordersData.filter(o => o.status === 'cancelled').length,
      revenue: ordersData
        .filter(o => o.status === 'delivered')
        .reduce((sum, o) => sum + (o.total || 0), 0)
    }
    setStats(newStats)
  }

  useEffect(() => {
    loadOrders()
  }, [loadOrders])

  // Créer une commande
  const createOrder = async (orderData) => {
    try {
      const newOrder = await ordersApi.create({
        ...orderData,
        user_id: user?.id
      })
      
      toast.success('Commande créée avec succès !')
      await loadOrders()
      
      return { success: true, data: newOrder }
    } catch (err) {
      console.error('❌ Erreur création commande:', err)
      toast.error('Erreur lors de la création de la commande')
      return { success: false, error: err.message }
    }
  }

  // Mettre à jour le statut d'une commande (admin)
  const updateOrderStatus = async (orderId, newStatus) => {
    if (!isAdmin) {
      toast.error('Action non autorisée')
      return { success: false }
    }

    try {
      const updated = await ordersApi.updateStatus(orderId, newStatus)
      
      // Mettre à jour la liste locale
      setOrders(prev => prev.map(order => 
        order.id === orderId ? { ...order, status: newStatus } : order
      ))
      
      // Recalculer les stats
      calculateStats(orders.map(order => 
        order.id === orderId ? { ...order, status: newStatus } : order
      ))
      
      return { success: true, data: updated }
    } catch (err) {
      console.error('❌ Erreur mise à jour statut:', err)
      toast.error('Erreur lors de la mise à jour')
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

    if (order.status !== 'pending') {
      toast.error('Seules les commandes en attente peuvent être annulées')
      return { success: false }
    }

    try {
      await ordersApi.cancel(orderId)
      
      setOrders(prev => prev.map(order => 
        order.id === orderId ? { ...order, status: 'cancelled' } : order
      ))
      
      calculateStats(orders.map(order => 
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

  const getOrderById = (orderId) => {
    return orders.find(order => order.id === orderId)
  }

  const refreshOrders = () => {
    loadOrders()
  }

  const getOrdersByStatus = (status) => {
    if (status === 'all') return orders
    return orders.filter(order => order.status === status)
  }

  // Stats pour l'utilisateur connecté (version simplifiée)
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
    
    // Statistiques (globales pour admin, utilisateur pour client)
    stats: isAdmin ? stats : getUserStats(),
    
    // Actions
    createOrder,
    updateOrderStatus,  // ← MAINtenant disponible !
    cancelOrder,
    getOrderById,
    refreshOrders,
    getOrdersByStatus,
    
    // Utilitaires
    isAdmin,
    user
  }
}
