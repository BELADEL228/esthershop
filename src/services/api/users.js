import { supabase } from '../supabase'
import { createClient } from '@supabase/supabase-js'

// Créer un client admin avec la clé service_role
const serviceRoleKey = import.meta.env.VITE_SUPABASE_SERVICE_ROLE_KEY
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL

// Initialiser le client admin (uniquement si la clé existe)
const supabaseAdmin = serviceRoleKey 
  ? createClient(supabaseUrl, serviceRoleKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    })
  : null

console.log('🔑 Service Role Key présente:', !!serviceRoleKey)

export const usersApi = {
  // Récupérer tous les utilisateurs avec leurs rôles
  async getAll() {
    try {
      let usersData = []
      
      // 1. Récupérer les utilisateurs (avec admin si disponible)
      if (supabaseAdmin) {
        const { data: authUsers, error: authError } = await supabaseAdmin.auth.admin.listUsers()
        if (authError) throw authError
        usersData = authUsers.users
      } else {
        // Fallback: récupérer depuis profiles (moins complet)
        const { data: profiles, error } = await supabase
          .from('profiles')
          .select('*, user_roles(role)')
        
        if (error) throw error
        return profiles.map(profile => ({
          id: profile.id,
          email: profile.email,
          created_at: profile.created_at,
          user_metadata: {
            firstName: profile.first_name || '',
            lastName: profile.last_name || ''
          },
          role: profile.user_roles?.role || 'user'
        }))
      }

      // 2. Récupérer les rôles
      const { data: roles, error: rolesError } = await supabase
        .from('user_roles')
        .select('*')

      if (rolesError) throw rolesError

      // 3. Récupérer les profils
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('*')

      if (profilesError && profilesError.code !== 'PGRST116') throw profilesError

      // 4. Combiner les données
      const usersWithDetails = usersData.map(user => {
        const userRole = roles?.find(r => r.user_id === user.id)
        const userProfile = profiles?.find(p => p.id === user.id)

        return {
          id: user.id,
          email: user.email,
          created_at: user.created_at,
          user_metadata: {
            firstName: user.user_metadata?.firstName || userProfile?.first_name || '',
            lastName: user.user_metadata?.lastName || userProfile?.last_name || ''
          },
          role: userRole?.role || 'user',
          profile: userProfile || {}
        }
      })

      return usersWithDetails
    } catch (error) {
      console.error('❌ Erreur chargement utilisateurs:', error)
      throw error
    }
  },

  // Récupérer un utilisateur par son ID
  async getById(id) {
    try {
      let userData
      
      if (supabaseAdmin) {
        const { data: user, error } = await supabaseAdmin.auth.admin.getUserById(id)
        if (error) throw error
        userData = user.user
      } else {
        const { data, error } = await supabase
          .from('profiles')
          .select('*, user_roles(role)')
          .eq('id', id)
          .single()
        
        if (error) throw error
        return {
          id: data.id,
          email: data.email,
          created_at: data.created_at,
          user_metadata: {
            firstName: data.first_name || '',
            lastName: data.last_name || ''
          },
          role: data.user_roles?.role || 'user',
          profile: data
        }
      }

      const { data: role } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', id)
        .maybeSingle()

      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', id)
        .maybeSingle()

      return {
        ...userData,
        role: role?.role || 'user',
        profile: profile || {}
      }
    } catch (error) {
      console.error('❌ Erreur chargement utilisateur:', error)
      throw error
    }
  },

  // Mettre à jour le rôle d'un utilisateur
  async updateRole(userId, newRole) {
    try {
      const { data, error } = await supabase
        .from('user_roles')
        .upsert({ 
          user_id: userId, 
          role: newRole 
        })
        .select()
        .single()
      
      if (error) throw error
      return data
    } catch (error) {
      console.error('❌ Erreur mise à jour rôle:', error)
      throw error
    }
  },

  // Supprimer un utilisateur
  async delete(userId) {
    try {
      // 1. Supprimer le profil
      await supabase
        .from('profiles')
        .delete()
        .eq('id', userId)

      // 2. Supprimer le rôle
      await supabase
        .from('user_roles')
        .delete()
        .eq('user_id', userId)

      // 3. Supprimer l'utilisateur (si admin disponible)
      if (supabaseAdmin) {
        const { error } = await supabaseAdmin.auth.admin.deleteUser(userId)
        if (error) throw error
      }
      
      return true
    } catch (error) {
      console.error('❌ Erreur suppression utilisateur:', error)
      throw error
    }
  },

  // Mettre à jour le profil d'un utilisateur
  async updateProfile(userId, profileData) {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .upsert({
          id: userId,
          first_name: profileData.firstName,
          last_name: profileData.lastName,
          phone: profileData.phone,
          address: profileData.address,
          city: profileData.city,
          postal_code: profileData.postalCode,
          country: profileData.country,
          updated_at: new Date().toISOString()
        })
        .select()
        .single()

      if (error) throw error
      return data
    } catch (error) {
      console.error('❌ Erreur mise à jour profil:', error)
      throw error
    }
  }
}