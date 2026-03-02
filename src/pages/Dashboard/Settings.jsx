import React, { useState, useEffect } from 'react'
import { useAuth } from '../../hooks/useAuth'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { supabase } from '../../services/supabase'
import toast from 'react-hot-toast'

const settingsSchema = z.object({
  siteName: z.string().min(3, 'Le nom du site est requis'),
  siteEmail: z.string().email('Email invalide'),
  sitePhone: z.string().min(8, 'Téléphone requis'),
  siteAddress: z.string().min(5, 'Adresse requise'),
  shippingCost: z.number().min(0, 'Coût de livraison invalide'),
  freeShippingThreshold: z.number().min(0, 'Seuil invalide'),
  taxRate: z.number().min(0).max(100, 'TVA invalide')
})

export const Settings = () => {
  const [loading, setLoading] = useState(false)
  const [initialLoading, setInitialLoading] = useState(true)
  const { user } = useAuth()

  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: zodResolver(settingsSchema),
    defaultValues: {
      siteName: 'Esther Shop',
      siteEmail: 'esthernabede08@gmail.com',
      sitePhone: '+228 90 00 00 00',
      siteAddress: 'Lomé, Togo',
      shippingCost: 2000,
      freeShippingThreshold: 25000,
      taxRate: 18
    }
  })

  // Charger les paramètres au montage
  useEffect(() => {
    loadSettings()
  }, [])

  const loadSettings = async () => {
    try {
      setInitialLoading(true)
      
      const { data, error } = await supabase
        .from('settings')
        .select('*')
        .eq('id', 1)
        .maybeSingle() // Utiliser maybeSingle au lieu de single

      if (error) {
        console.error('❌ Erreur chargement:', error)
        throw error
      }

      if (data) {
        console.log('📦 Paramètres chargés:', data)
        reset({
          siteName: data.site_name || 'Esther Shop',
          siteEmail: data.site_email || 'esthernabede08@gmail.com',
          sitePhone: data.site_phone || '+228 90 00 00 00',
          siteAddress: data.site_address || 'Lomé, Togo',
          shippingCost: data.shipping_cost || 2000,
          freeShippingThreshold: data.free_shipping_threshold || 25000,
          taxRate: data.tax_rate || 18
        })
      }
    } catch (error) {
      console.error('❌ Erreur chargement paramètres:', error)
      toast.error('Erreur lors du chargement des paramètres')
    } finally {
      setInitialLoading(false)
    }
  }

 const onSubmit = async (data) => {
  setLoading(true)
  try {
    console.log('📦 Données à sauvegarder:', data)

    // 1. Vérifier que l'utilisateur est connecté
    if (!user?.id) {
      throw new Error('Vous devez être connecté')
    }

    // 2. Vérifier si l'utilisateur est admin
    const { data: userRole, error: roleError } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', user.id)
      .maybeSingle()

    if (roleError) {
      console.error('❌ Erreur vérification rôle:', roleError)
      throw new Error('Erreur de vérification des droits')
    }

    if (userRole?.role !== 'admin') {
      throw new Error('Vous devez être administrateur pour modifier les paramètres')
    }

    // 3. Préparer les données avec les bons types
    const settingsData = {
      site_name: String(data.siteName),
      site_email: String(data.siteEmail),
      site_phone: String(data.sitePhone),
      site_address: String(data.siteAddress),
      shipping_cost: Number(data.shippingCost),
      free_shipping_threshold: Number(data.freeShippingThreshold),
      tax_rate: Number(data.taxRate),
      updated_by: user.id,
      updated_at: new Date().toISOString()
    }

    console.log('📤 Mise à jour Supabase:', settingsData)

    // 4. Utiliser UPDATE au lieu de UPSERT
    const { data: result, error } = await supabase
      .from('settings')
      .update(settingsData)
      .eq('id', 1)  // Mettre à jour la ligne avec id=1
      .select()
      .single()

    if (error) {
      console.error('❌ Erreur Supabase:', error)
      throw new Error(`Erreur base de données: ${error.message}`)
    }

    console.log('✅ Résultat:', result)
    toast.success('Paramètres mis à jour avec succès')
    await loadSettings() // Recharger pour confirmer
    
  } catch (error) {
    console.error('❌ Erreur sauvegarde:', error)
    toast.error(error.message || 'Erreur lors de la sauvegarde')
  } finally {
    setLoading(false)
  }
}

  if (initialLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Paramètres de la boutique</h1>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Section Informations générales */}
          <div>
            <h2 className="text-xl font-semibold mb-4 text-blue-600 dark:text-blue-400">
              Informations générales
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Nom du site
                </label>
                <input
                  {...register('siteName')}
                  className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
                />
                {errors.siteName && (
                  <p className="text-red-500 text-sm mt-1">{errors.siteName.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Email de contact
                </label>
                <input
                  {...register('siteEmail')}
                  type="email"
                  className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
                />
                {errors.siteEmail && (
                  <p className="text-red-500 text-sm mt-1">{errors.siteEmail.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Téléphone
                </label>
                <input
                  {...register('sitePhone')}
                  className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
                />
                {errors.sitePhone && (
                  <p className="text-red-500 text-sm mt-1">{errors.sitePhone.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Adresse
                </label>
                <input
                  {...register('siteAddress')}
                  className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
                />
                {errors.siteAddress && (
                  <p className="text-red-500 text-sm mt-1">{errors.siteAddress.message}</p>
                )}
              </div>
            </div>
          </div>

          {/* Section Livraison et Taxes */}
          <div>
            <h2 className="text-xl font-semibold mb-4 text-blue-600 dark:text-blue-400">
              Paramètres de livraison et taxes
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Frais de livraison (FCFA)
                </label>
                <input
                  {...register('shippingCost', { valueAsNumber: true })}
                  type="number"
                  className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
                />
                {errors.shippingCost && (
                  <p className="text-red-500 text-sm mt-1">{errors.shippingCost.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Livraison gratuite à partir de (FCFA)
                </label>
                <input
                  {...register('freeShippingThreshold', { valueAsNumber: true })}
                  type="number"
                  className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
                />
                {errors.freeShippingThreshold && (
                  <p className="text-red-500 text-sm mt-1">{errors.freeShippingThreshold.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Taux de TVA (%)
                </label>
                <input
                  {...register('taxRate', { valueAsNumber: true })}
                  type="number"
                  step="0.1"
                  className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
                />
                {errors.taxRate && (
                  <p className="text-red-500 text-sm mt-1">{errors.taxRate.message}</p>
                )}
              </div>
            </div>
          </div>

          {/* Bouton de sauvegarde */}
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:bg-blue-300 transition-colors"
            >
              {loading ? 'Sauvegarde...' : 'Sauvegarder les modifications'}
            </button>
          </div>
        </form>
      </div>

      {/* Informations supplémentaires */}
      {user && (
        <div className="mt-4 text-sm text-gray-500 dark:text-gray-400 text-right">
          Connecté en tant que : {user.email}
        </div>
      )}
    </div>
  )
}