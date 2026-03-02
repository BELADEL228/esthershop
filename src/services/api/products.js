import { supabase } from '../supabase'

export const productsApi = {
  // Récupérer tous les produits
  async getAll(filters = {}) {
    let query = supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false })

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

  // Récupérer un produit par ID
  async getById(id) {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', id)
      .single()
    
    if (error) throw error
    return data
  },

  // Créer un produit (admin seulement)
  async create(productData) {
    const { data, error } = await supabase
      .from('products')
      .insert([productData])
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  // Mettre à jour un produit (admin seulement)
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

  // Supprimer un produit (admin seulement)
  async delete(id) {
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id)
    
    if (error) throw error
    return true
  },

  // Récupérer les catégories uniques
  async getCategories() {
    const { data, error } = await supabase
      .from('products')
      .select('category')
      .order('category')
    
    if (error) throw error
    return [...new Set(data.map(item => item.category))]
  }
}