import React, { useState, useEffect } from 'react'
import { useAuth } from '../../hooks/useAuth'
import { useSettings } from '../../hooks/useSettings'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
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
  const { user } = useAuth()
  const { settings, updateSettings, refreshSettings } = useSettings()

  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: zodResolver(settingsSchema)
  })

  // Remplir le formulaire avec les settings existants
  useEffect(() => {
    if (settings) {
      reset({
        siteName: settings.site_name,
        siteEmail: settings.site_email,
        sitePhone: settings.site_phone,
        siteAddress: settings.site_address,
        shippingCost: settings.shipping_cost,
        freeShippingThreshold: settings.free_shipping_threshold,
        taxRate: settings.tax_rate
      })
    }
  }, [settings, reset])

  const onSubmit = async (data) => {
    setLoading(true)
    try {
      if (!user) throw new Error('Vous devez être connecté')

      const settingsData = {
        site_name: data.siteName,
        site_email: data.siteEmail,
        site_phone: data.sitePhone,
        site_address: data.siteAddress,
        shipping_cost: data.shippingCost,
        free_shipping_threshold: data.freeShippingThreshold,
        tax_rate: data.taxRate
      }

      const result = await updateSettings(settingsData)
      
      if (result.success) {
        toast.success('Paramètres mis à jour avec succès')
        await refreshSettings()
      } else {
        throw new Error('Erreur lors de la mise à jour')
      }
      
    } catch (error) {
      toast.error(error.message)
    } finally {
      setLoading(false)
    }
  }

  if (!settings) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  // ... (le reste du JSX reste identique)
}