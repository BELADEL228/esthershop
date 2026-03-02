import { supabase } from '../supabase'

export const newsletterApi = {
  // Récupérer tous les abonnés
  async getAllSubscribers() {
    const { data, error } = await supabase
      .from('newsletter_subscribers')
      .select('*')
      .order('subscribed_at', { ascending: false })

    if (error) throw error
    return data
  },

  // S'abonner à la newsletter
  async subscribe(email, source = 'footer') {
    try {
      const { data, error } = await supabase
        .from('newsletter_subscribers')
        .insert([{ 
          email, 
          source,
          subscribed_at: new Date().toISOString(),
          is_active: true
        }])
        .select()
        .single()

      if (error) {
        // Code 23505 = duplicate key violation (email déjà existant)
        if (error.code === '23505') {
          return { 
            success: false, 
            message: 'Cet email est déjà inscrit à la newsletter' 
          }
        }
        throw error
      }

      return { 
        success: true, 
        data,
        message: 'Inscription réussie !' 
      }
    } catch (error) {
      console.error('Erreur inscription newsletter:', error)
      throw error
    }
  },

  // Se désabonner (soft delete)
  async unsubscribe(email) {
    try {
      const { data, error } = await supabase
        .from('newsletter_subscribers')
        .update({ is_active: false })
        .eq('email', email)
        .select()
        .single()

      if (error) throw error
      
      return { 
        success: true, 
        data,
        message: 'Désabonnement réussi' 
      }
    } catch (error) {
      console.error('Erreur désabonnement:', error)
      throw error
    }
  },

  // Supprimer définitivement un abonné (admin)
  async deleteSubscriber(id) {
    const { error } = await supabase
      .from('newsletter_subscribers')
      .delete()
      .eq('id', id)

    if (error) throw error
    return true
  },

  // Exporter les emails (tous ou uniquement actifs)
  async exportEmails(onlyActive = true) {
    let query = supabase
      .from('newsletter_subscribers')
      .select('email, subscribed_at, source, is_active')
      .order('subscribed_at', { ascending: false })

    if (onlyActive) {
      query = query.eq('is_active', true)
    }

    const { data, error } = await query

    if (error) throw error
    return data
  },

  // Compter les abonnés actifs
  async countActive() {
    const { count, error } = await supabase
      .from('newsletter_subscribers')
      .select('*', { count: 'exact', head: true })
      .eq('is_active', true)

    if (error) throw error
    return count
  },

  // Compter tous les abonnés
  async countTotal() {
    const { count, error } = await supabase
      .from('newsletter_subscribers')
      .select('*', { count: 'exact', head: true })

    if (error) throw error
    return count
  },

  // Vérifier si un email est déjà abonné
  async isSubscribed(email) {
    const { data, error } = await supabase
      .from('newsletter_subscribers')
      .select('id')
      .eq('email', email)
      .eq('is_active', true)
      .maybeSingle()

    if (error) throw error
    return !!data
  }
}