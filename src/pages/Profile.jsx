import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'  // ← AJOUTER cet import
import { useAuth } from '../hooks/useAuth'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { supabase } from '../services/supabase'
import { 
  UserIcon, 
  EnvelopeIcon, 
  PhoneIcon, 
  MapPinIcon,
  ShieldCheckIcon,  // ← AJOUTER cette icône
  ArrowRightIcon     // ← AJOUTER cette icône
} from '@heroicons/react/24/outline'
import toast from 'react-hot-toast'

const profileSchema = z.object({
  firstName: z.string().min(2, 'Le prénom doit contenir au moins 2 caractères'),
  lastName: z.string().min(2, 'Le nom doit contenir au moins 2 caractères'),
  phone: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  postalCode: z.string().optional(),
  country: z.string().optional()
})

export const Profile = () => {
  const { user, isAdmin } = useAuth()  // ← AJOUTER isAdmin ici
  const [loading, setLoading] = useState(false)
  const [profile, setProfile] = useState(null)

  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      phone: '',
      address: '',
      city: '',
      postalCode: '',
      country: ''
    }
  })

  useEffect(() => {
    if (user) {
      loadProfile()
    }
  }, [user])

  const loadProfile = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

      if (error && error.code !== 'PGRST116') throw error

      if (data) {
        setProfile(data)
        reset({
          firstName: data.first_name || '',
          lastName: data.last_name || '',
          phone: data.phone || '',
          address: data.address || '',
          city: data.city || '',
          postalCode: data.postal_code || '',
          country: data.country || ''
        })
      }
    } catch (error) {
      console.error('Erreur chargement profil:', error)
      toast.error('Erreur lors du chargement du profil')
    }
  }

  const onSubmit = async (data) => {
    setLoading(true)
    try {
      const { error } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          first_name: data.firstName,
          last_name: data.lastName,
          phone: data.phone,
          address: data.address,
          city: data.city,
          postal_code: data.postalCode,
          country: data.country,
          updated_at: new Date().toISOString()
        })

      if (error) throw error

      toast.success('Profil mis à jour avec succès')
      loadProfile()
    } catch (error) {
      console.error('Erreur mise à jour:', error)
      toast.error('Erreur lors de la mise à jour du profil')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Mon Profil</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Sidebar avec infos */}
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <div className="flex flex-col items-center text-center">
              <div className="w-24 h-24 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mb-4">
                <UserIcon className="h-12 w-12 text-blue-600 dark:text-blue-300" />
              </div>
              <h2 className="text-xl font-semibold mb-1 flex items-center justify-center space-x-2">
  <span>{profile?.first_name} {profile?.last_name}</span>
  {isAdmin && (
    <span className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded-full flex items-center">
      <ShieldCheckIcon className="h-3 w-3 mr-1" />
      Admin
    </span>
  )}
</h2>
              <p className="text-gray-600 dark:text-gray-400 mb-4">{user?.email}</p>
              
              <div className="w-full border-t dark:border-gray-700 pt-4 mt-2">
                <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400 mb-2">
                  <EnvelopeIcon className="h-5 w-5" />
                  <span className="text-sm">{user?.email}</span>
                </div>
                {profile?.phone && (
                  <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400 mb-2">
                    <PhoneIcon className="h-5 w-5" />
                    <span className="text-sm">{profile.phone}</span>
                  </div>
                )}
                {(profile?.address || profile?.city) && (
                  <div className="flex items-start space-x-2 text-gray-600 dark:text-gray-400">
                    <MapPinIcon className="h-5 w-5 flex-shrink-0 mt-0.5" />
                    <span className="text-sm">
                      {profile.address}<br />
                      {profile.postal_code} {profile.city}<br />
                      {profile.country}
                    </span>
                  </div>
                )}
              </div>

              {/* ===== BOUTON ADMIN (UNIQUEMENT POUR LES ADMINS) ===== */}
              {isAdmin && (
                <div className="w-full mt-6 pt-4 border-t dark:border-gray-700">
                  <Link
                    to="/dashboard"
                    className="flex items-center justify-between w-full px-4 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all transform hover:scale-105 shadow-lg"
                  >
                    <div className="flex items-center space-x-2">
                      <ShieldCheckIcon className="h-5 w-5" />
                      <span className="font-semibold">Accès Dashboard Admin</span>
                    </div>
                    <ArrowRightIcon className="h-5 w-5" />
                  </Link>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 text-center">
                    Gérez les produits, commandes et utilisateurs
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Formulaire d'édition */}
        <div className="lg:col-span-2">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-6">Modifier mes informations</h2>
            
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Prénom</label>
                  <input
                    {...register('firstName')}
                    className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
                  />
                  {errors.firstName && (
                    <p className="text-red-500 text-sm mt-1">{errors.firstName.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Nom</label>
                  <input
                    {...register('lastName')}
                    className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
                  />
                  {errors.lastName && (
                    <p className="text-red-500 text-sm mt-1">{errors.lastName.message}</p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Téléphone</label>
                <input
                  {...register('phone')}
                  className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Adresse</label>
                <input
                  {...register('address')}
                  className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Ville</label>
                  <input
                    {...register('city')}
                    className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Code postal</label>
                  <input
                    {...register('postalCode')}
                    className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Pays</label>
                  <select
                    {...register('country')}
                    className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
                  >
                    <option value="">Sélectionner</option>
                    <option value="Togo">Togo</option>
                    <option value="Ghana">Ghana</option>
                    <option value="Benin">Bénin</option>
                    <option value="Burkina Faso">Burkina Faso</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => reset()}
                  className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-700"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:bg-blue-300"
                >
                  {loading ? 'Mise à jour...' : 'Mettre à jour'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}