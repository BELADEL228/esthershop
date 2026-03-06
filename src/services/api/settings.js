import { supabase } from '../supabase'

export const settingsApi = {
  // Récupérer les paramètres
  async get() {
    const { data, error } = await supabase
      .from('settings')
      .select('*')
      .eq('id', 1)
      .maybeSingle()
    
    if (error) throw error
    return data
  },

  // Mettre à jour les paramètres
  async update(settingsData) {
    const { data, error } = await supabase
      .from('settings')
      .update({
        site_name: settingsData.site_name,
        site_email: settingsData.site_email,
        site_phone: settingsData.site_phone,
        site_address: settingsData.site_address,
        shipping_cost: settingsData.shipping_cost,
        free_shipping_threshold: settingsData.free_shipping_threshold,
        tax_rate: settingsData.tax_rate,
        updated_at: new Date().toISOString()
      })
      .eq('id', 1)
      .select()
      .single()
    
    if (error) throw error
    return data
  }
}