// Service API pour les settings (à créer : src/services/api/settings.js)
import { supabase } from '../supabase'

export const settingsApi = {
  // Récupérer les paramètres
  async get() {
    const { data, error } = await supabase
      .from('settings')
      .select('*')
      .eq('id', 1)
      .single()
    
    if (error) throw error
    return data
  },

  // Mettre à jour les paramètres
  async update(settingsData) {
    const { data, error } = await supabase
      .from('settings')
      .update({
        site_name: settingsData.siteName,
        site_email: settingsData.siteEmail,
        site_phone: settingsData.sitePhone,
        site_address: settingsData.siteAddress,
        shipping_cost: settingsData.shippingCost,
        free_shipping_threshold: settingsData.freeShippingThreshold,
        tax_rate: settingsData.taxRate
      })
      .eq('id', 1)
      .select()
      .single()
    
    if (error) throw error
    return data
  }
}