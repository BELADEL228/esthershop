import React, { useState, useEffect } from 'react'
import { AuthContext } from './AuthContext'
import { supabase } from '../services/supabase'
import toast from 'react-hot-toast'

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {
    checkUser()
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
      if (session?.user) {
        checkAdminStatus(session.user.id)
      } else {
        setIsAdmin(false)
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  const checkAdminStatus = async (userId) => {
    try {
      const { data, error } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', userId)
        .single()
      
      if (error) {
        console.error('Erreur vérification admin:', error)
        setIsAdmin(false)
      } else {
        console.log('Rôle trouvé:', data)
        setIsAdmin(data?.role === 'admin')
      }
    } catch (error) {
      console.error('Erreur:', error)
      setIsAdmin(false)
    }
  }

  const checkUser = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession()
      setUser(session?.user ?? null)
      
      if (session?.user) {
        await checkAdminStatus(session.user.id)
      }
    } catch (error) {
      console.error('Erreur:', error)
    } finally {
      setLoading(false)
    }
  }

  const signIn = async (email, password) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      })
      if (error) throw error
      toast.success('Connexion réussie!')
      return data
    } catch (error) {
      toast.error(error.message)
      throw error
    }
  }

  const signUp = async (email, password, userData) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: userData }
      })
      if (error) throw error
      toast.success('Inscription réussie!')
      return data
    } catch (error) {
      toast.error(error.message)
      throw error
    }
  }

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut()
      if (error) throw error
      toast.success('Déconnexion réussie')
    } catch (error) {
      toast.error(error.message)
    }
  }

  console.log('📊 AuthProvider:', { loading, user: user?.email, isAdmin })

  const value = {
    user,
    loading,
    isAdmin,
    signIn,
    signUp,
    signOut
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}