import { useState, useEffect, useCallback } from 'react'
import { ordersApi } from '../services/api/orders'
import { useAuth } from './useAuth'
import { supabase } from '../services/supabase'
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
  
  const { user, isAdmin } = useAuth()

  // Charger les commandes (utilisateur connecté)
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
    const stats = {
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
    setStats(stats)
  }

  // Charger au montage et quand user change
  useEffect(() => {
    loadOrders()
  }, [loadOrders])

  // Écouter les changements en temps réel (admin)
  useEffect(() => {
    if (!isAdmin) return

    const subscription = supabase
      .channel('orders-channel')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'orders' },
        (payload) => {
          console.log('🔄 Changement commande:', payload)
          loadOrders() // Recharger les commandes
          
          // Notifier selon le type de changement
          if (payload.eventType === 'INSERT') {
            toast.success('Nouvelle commande reçue !')
          }
        }
      )
      .subscribe()

    return () => {
      subscription.unsubscribe()
    }
  }, [isAdmin, loadOrders])

  // Créer une commande
  const createOrder = async (orderData) => {
    try {
      const newOrder = await ordersApi.create({
        ...orderData,
        user_id: user?.id,
        created_at: new Date().toISOString()
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

  // Mettre à jour le statut d'une commande (admin)
  const updateOrderStatus = async (orderId, newStatus) => {
    if (!isAdmin) {
      toast.error('Action non autorisée')
      return { success: false, error: 'Non autorisé' }
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
      
      toast.success(`Statut mis à jour : ${newStatus}`)
      return { success: true, data: updated }
    } catch (err) {
      console.error('❌ Erreur mise à jour statut:', err)
      toast.error('Erreur lors de la mise à jour')
      return { success: false, error: err.message }
    }
  }

  // Annuler une commande (utilisateur ou admin)
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
      const updated = await ordersApi.updateStatus(orderId, 'cancelled')
      
      setOrders(prev => prev.map(order => 
        order.id === orderId ? { ...order, status: 'cancelled' } : order
      ))
      
      calculateStats(orders.map(order => 
        order.id === orderId ? { ...order, status: 'cancelled' } : order
      ))
      
      toast.success('Commande annulée avec succès')
      return { success: true, data: updated }
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

  // Filtrer les commandes par statut
  const getOrdersByStatus = (status) => {
    if (status === 'all') return orders
    return orders.filter(order => order.status === status)
  }

  // Calculer le total des ventes pour une période
  const getRevenueByPeriod = (period = 'month') => {
    const now = new Date()
    let startDate

    switch (period) {
      case 'day':
        startDate = new Date(now.setHours(0, 0, 0, 0))
        break
      case 'week':
        startDate = new Date(now.setDate(now.getDate() - 7))
        break
      case 'month':
        startDate = new Date(now.setMonth(now.getMonth() - 1))
        break
      case 'year':
        startDate = new Date(now.setFullYear(now.getFullYear() - 1))
        break
      default:
        startDate = new Date(0)
    }

    return orders
      .filter(o => o.status === 'delivered' && new Date(o.created_at) >= startDate)
      .reduce((sum, o) => sum + (o.total || 0), 0)
  }

  return {
    // Données
    orders,
    loading,
    error,
    stats,
    
    // Actions
    createOrder,
    updateOrderStatus,
    cancelOrder,
    getOrderById,
    refreshOrders,
    getOrdersByStatus,
    getRevenueByPeriod,
    
    // Utilitaires
    isAdmin,
    user
  }
}