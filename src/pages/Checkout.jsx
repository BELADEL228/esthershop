import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useCart } from '../contexts/CartContext'
import { useAuth } from '../hooks/useAuth'
import { useSettings } from '../hooks/useSettings'  // ← AJOUTÉ
import { ordersApi } from '../services/api/orders'
import { formatPrice } from '../utils/helpers'
import { 
  BanknotesIcon,
  CheckCircleIcon,
  ShoppingBagIcon
} from '@heroicons/react/24/outline'
import toast from 'react-hot-toast'

const checkoutSchema = z.object({
  firstName: z.string().min(2, 'Prénom requis'),
  lastName: z.string().min(2, 'Nom requis'),
  email: z.string().email('Email invalide'),
  phone: z.string().min(8, 'Téléphone requis'),
  address: z.string().min(5, 'Adresse requise'),
  city: z.string().min(2, 'Ville requise'),
  deliveryNotes: z.string().optional(),
})

export const Checkout = () => {
  const navigate = useNavigate()
  const { cart, clearCart } = useCart()
  const { user } = useAuth()
  const { settings } = useSettings()  // ← Récupère les paramètres
  const [loading, setLoading] = useState(false)

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      email: user?.email || '',
    }
  })

  const calculateTotals = () => {
    const subtotal = cart.total
    
    // Utiliser les valeurs des settings ou des valeurs par défaut
    const shippingCost = settings?.shipping_cost || 2000
    const freeShippingThreshold = settings?.free_shipping_threshold || 50000
    const taxRate = settings?.tax_rate || 18
    
    const shipping = subtotal > freeShippingThreshold ? 0 : shippingCost
    const tax = Math.round(subtotal * taxRate / 100) // TVA en pourcentage
    const total = subtotal + shipping + tax
    
    return { 
      subtotal, 
      shipping, 
      tax, 
      total,
      taxRate,
      freeShippingThreshold,
      shippingCost
    }
  }

  const handleSubmitOrder = async (data) => {
    setLoading(true)
    
    try {
      const { subtotal, shipping, tax, total } = calculateTotals()
      
      // Créer la commande
      const orderData = {
        user_id: user?.id,
        items: cart.items,
        subtotal,
        shipping,
        tax,
        total,
        shipping_address: {
          firstName: data.firstName,
          lastName: data.lastName,
          address: data.address,
          city: data.city,
          phone: data.phone,
          deliveryNotes: data.deliveryNotes
        },
        payment_method: 'cash_on_delivery',
        payment_status: 'pending',
        status: 'pending'
      }

      // Sauvegarder la commande
      const order = await ordersApi.create(orderData)

      // Vider le panier
      clearCart()
      
      toast.success('Commande confirmée avec succès!')
      
      // Rediriger vers la page de confirmation
      navigate(`/orders/success/${order.id}`)
      
    } catch (error) {
      console.error('❌ Erreur commande:', error)
      toast.error(error.message || 'Erreur lors de la commande')
    } finally {
      setLoading(false)
    }
  }

  const { 
    subtotal, 
    shipping, 
    tax, 
    total,
    taxRate,
    freeShippingThreshold,
    shippingCost 
  } = calculateTotals()

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Finaliser la commande</h1>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Formulaire */}
        <div className="lg:col-span-2">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Informations de livraison</h2>
            
            <form onSubmit={handleSubmit(handleSubmitOrder)} className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Prénom</label>
                  <input
                    {...register('firstName')}
                    className="w-full px-3 py-2 border rounded-md dark:bg-gray-700"
                  />
                  {errors.firstName && (
                    <p className="text-red-500 text-sm mt-1">{errors.firstName.message}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Nom</label>
                  <input
                    {...register('lastName')}
                    className="w-full px-3 py-2 border rounded-md dark:bg-gray-700"
                  />
                  {errors.lastName && (
                    <p className="text-red-500 text-sm mt-1">{errors.lastName.message}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Email</label>
                  <input
                    {...register('email')}
                    type="email"
                    className="w-full px-3 py-2 border rounded-md dark:bg-gray-700"
                  />
                  {errors.email && (
                    <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Téléphone</label>
                  <input
                    {...register('phone')}
                    className="w-full px-3 py-2 border rounded-md dark:bg-gray-700"
                    placeholder="90 00 00 00"
                  />
                  {errors.phone && (
                    <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>
                  )}
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-1">Adresse</label>
                  <input
                    {...register('address')}
                    className="w-full px-3 py-2 border rounded-md dark:bg-gray-700"
                  />
                  {errors.address && (
                    <p className="text-red-500 text-sm mt-1">{errors.address.message}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Ville</label>
                  <input
                    {...register('city')}
                    className="w-full px-3 py-2 border rounded-md dark:bg-gray-700"
                  />
                  {errors.city && (
                    <p className="text-red-500 text-sm mt-1">{errors.city.message}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Instructions (optionnel)</label>
                  <input
                    {...register('deliveryNotes')}
                    className="w-full px-3 py-2 border rounded-md dark:bg-gray-700"
                    placeholder="Heure de livraison, etc."
                  />
                </div>
              </div>

              {/* Mode de paiement (fixe) */}
              <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                <div className="flex items-center space-x-3">
                  <BanknotesIcon className="h-8 w-8 text-green-600" />
                  <div>
                    <p className="font-semibold">Paiement à la livraison</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Vous paierez en espèces à la réception de votre commande
                    </p>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading || cart.items.length === 0}
                className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 disabled:bg-blue-300 transition-colors font-semibold"
              >
                {loading ? 'Traitement en cours...' : `Confirmer la commande (${formatPrice(total)})`}
              </button>
            </form>
          </div>
        </div>

        {/* Résumé de la commande */}
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 sticky top-20">
            <h2 className="text-xl font-bold mb-4">Récapitulatif</h2>
            
            <div className="space-y-3 mb-4 max-h-96 overflow-y-auto">
              {cart.items.map((item) => (
                <div key={item.id} className="flex justify-between text-sm">
                  <div>
                    <p className="font-medium">{item.name}</p>
                    <p className="text-gray-500">x {item.quantity}</p>
                  </div>
                  <span>{formatPrice(item.price * item.quantity)}</span>
                </div>
              ))}
            </div>

            <div className="border-t pt-4 space-y-2">
              <div className="flex justify-between">
                <span>Sous-total</span>
                <span>{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span>Livraison</span>
                {shipping === 0 ? (
                  <span className="text-green-600">Gratuite</span>
                ) : (
                  <span>{formatPrice(shipping)}</span>
                )}
              </div>
              <div className="flex justify-between">
                <span>TVA ({taxRate}%)</span>
                <span>{formatPrice(tax)}</span>
              </div>
              <div className="flex justify-between font-bold text-lg pt-2 border-t">
                <span>Total</span>
                <span className="text-blue-600">{formatPrice(total)}</span>
              </div>
            </div>

            {subtotal < freeShippingThreshold && (
              <div className="mt-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg text-sm">
                <p className="text-yellow-800 dark:text-yellow-200">
                  💡 Plus que {formatPrice(freeShippingThreshold - subtotal)} d'achat pour la livraison gratuite !
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}