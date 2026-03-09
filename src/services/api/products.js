import { supabase } from '../supabase'

export const productsApi = {
  // Récupérer tous les produits (par défaut uniquement actifs)
  async getAll(filters = {}, includeInactive = false) {
    let query = supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false })

    // Ne montrer que les actifs sauf si includeInactive est true (admin)
    if (!includeInactive) {
      query = query.eq('active', true)
    }

    if (filters.category) {
      query = query.eq('category', filters.category)
    }

    if (filters.minPrice) {
      query = query.gte('price', filters.minPrice)
    }

    if (filters.maxPrice) {
      query = query.lte('price', filters.maxPrice)
    }

    if (filters.search) {
      query = query.ilike('name', `%${filters.search}%`)
    }

    const { data, error } = await query
    if (error) throw error
    return data
  },

  // Récupérer un produit par ID (quel que soit son statut actif)
  async getById(id) {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', id)
      .single()
    
    if (error) throw error
    return data
  },

  // Créer un produit (actif par défaut)
  async create(productData) {
    const { data, error } = await supabase
      .from('products')
      .insert([{ ...productData, active: true }])
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  // Mettre à jour un produit
  async update(id, productData) {
    const { data, error } = await supabase
      .from('products')
      .update(productData)
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  // Supprimer un produit (soft delete : passe active à false)
  async delete(id) {
    const { error } = await supabase
      .from('products')
      .update({ active: false })
      .eq('id', id)
    
    if (error) throw error
    return true
  },

  // Récupérer les catégories uniques (uniquement parmi les produits actifs)
  async getCategories() {
    const { data, error } = await supabase
      .from('products')
      .select('category')
      .eq('active', true)
      .order('category')
    
    if (error) throw error
    return [...new Set(data.map(item => item.category))]
  },

  // (Optionnel) Restaurer un produit supprimé
  async restore(id) {
    const { error } = await supabase
      .from('products')
      .update({ active: true })
      .eq('id', id)
    
    if (error) throw error
    return true
  }
}