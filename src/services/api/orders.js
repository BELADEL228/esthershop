import { supabase } from '../supabase'

export const ordersApi = {
  // Récupérer toutes les commandes (admin) avec les détails des produits
  async getAll() {
    const { data, error } = await supabase
      .from('orders')
      .select(`
        *,
        order_items (
          id,
          quantity,
          price,
          product:product_id (
            id,
            name,
            images
          )
        )
      `)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data
  },

  // Récupérer les commandes d'un utilisateur avec les détails des produits
  async getUserOrders(userId) {
    const { data, error } = await supabase
      .from('orders')
      .select(`
        *,
        order_items (
          id,
          quantity,
          price,
          product:product_id (
            id,
            name,
            images
          )
        )
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data
  },

  // Récupérer une commande par son ID avec les détails des produits
  async getById(orderId) {
    const { data, error } = await supabase
      .from('orders')
      .select(`
        *,
        order_items (
          id,
          quantity,
          price,
          product:product_id (
            id,
            name,
            images
          )
        )
      `)
      .eq('id', orderId)
      .single()

    if (error) throw error
    return data
  },

  // Créer une nouvelle commande
  async create(orderData) {
    try {
      // 1. Insérer la commande
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert([{
          user_id: orderData.user_id,
          total: orderData.total,
          subtotal: orderData.subtotal || orderData.total,
          shipping: orderData.shipping || 0,
          tax: orderData.tax || 0,
          shipping_address: orderData.shipping_address,
          payment_method: orderData.payment_method || 'cash_on_delivery',
          payment_status: 'pending',
          status: 'pending',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }])
        .select()
        .single()

      if (orderError) throw orderError

      // 2. Insérer les articles de la commande
      if (orderData.items && orderData.items.length > 0) {
        const orderItems = orderData.items.map(item => ({
          order_id: order.id,
          product_id: item.id,
          quantity: item.quantity,
          price: item.price
          // Le nom n'est pas stocké ici car on utilisera la jointure avec products
        }))

        const { error: itemsError } = await supabase
          .from('order_items')
          .insert(orderItems)

        if (itemsError) throw itemsError
      }

      // 3. Retourner la commande complète
      return await this.getById(order.id)
      
    } catch (error) {
      console.error('❌ Erreur création commande:', error)
      throw error
    }
  },

  // Mettre à jour le statut d'une commande
  async updateStatus(orderId, status) {
    const { data, error } = await supabase
      .from('orders')
      .update({ 
        status,
        updated_at: new Date().toISOString()
      })
      .eq('id', orderId)
      .select()
      .single()

    if (error) throw error
    return data
  },

  // Mettre à jour le statut de paiement
  async updatePaymentStatus(orderId, paymentStatus) {
    const { data, error } = await supabase
      .from('orders')
      .update({
        payment_status: paymentStatus,
        updated_at: new Date().toISOString()
      })
      .eq('id', orderId)
      .select()
      .single()

    if (error) throw error
    return data
  },

  // Annuler une commande
  async cancel(orderId) {
    return this.updateStatus(orderId, 'cancelled')
  },

  // Supprimer une commande (admin seulement)
  async delete(orderId) {
    const { error } = await supabase
      .from('orders')
      .delete()
      .eq('id', orderId)

    if (error) throw error
    return true
  },

  // Récupérer les commandes récentes (pour le dashboard)
  async getRecentOrders(limit = 5) {
    const { data, error } = await supabase
      .from('orders')
      .select(`
        *,
        order_items (
          id,
          quantity,
          price,
          product:product_id (
            id,
            name,
            images
          )
        )
      `)
      .order('created_at', { ascending: false })
      .limit(limit)

    if (error) throw error
    return data
  },

  // Compter les commandes par statut
  async countByStatus(status) {
    const { count, error } = await supabase
      .from('orders')
      .select('*', { count: 'exact', head: true })
      .eq('status', status)

    if (error) throw error
    return count
  },

  // Calculer le chiffre d'affaires total
  async getTotalRevenue() {
    const { data, error } = await supabase
      .from('orders')
      .select('total')
      .eq('status', 'delivered')

    if (error) throw error
    return data.reduce((sum, order) => sum + (order.total || 0), 0)
  }
}