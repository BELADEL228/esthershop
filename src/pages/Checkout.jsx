import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useCart } from '../contexts/CartContext'
import { useAuth } from '../hooks/useAuth'
import { ordersApi } from '../services/api/orders'
import { processMobileMoney, processCardPayment } from '../services/payment/fedapay'
import { formatPrice } from '../utils/helpers'
import { 
  CreditCardIcon, 
  DevicePhoneMobileIcon, 
  BanknotesIcon,
  CheckCircleIcon,
  ArrowPathIcon
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
  paymentMethod: z.enum(['card', 'mobile_money', 'cash_on_delivery']),
  // Pour Mobile Money
  mobileMoneyProvider: z.string().optional(),
  mobileMoneyNumber: z.string().optional(),
})

export const Checkout = () => {
  const navigate = useNavigate()
  const { cart, clearCart } = useCart()
  const { user } = useAuth()
  const [loading, setLoading] = useState(false)
  const [paymentStep, setPaymentStep] = useState('form') // form, processing, success

  const { register, handleSubmit, watch, formState: { errors } } = useForm({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      email: user?.email || '',
      paymentMethod: 'cash_on_delivery',
      mobileMoneyProvider: 'togocel'
    }
  })

  const paymentMethod = watch('paymentMethod')

  const calculateTotals = () => {
    const subtotal = cart.total
    const shipping = subtotal > 50000 ? 0 : 2000 // 2000 FCFA si < 50000
    const tax = subtotal * 0.18 // TVA 18%
    const total = subtotal + shipping + tax
    
    return { subtotal, shipping, tax, total }
  }

  const handlePayment = async (data) => {
    setLoading(true)
    setPaymentStep('processing')
    
    try {
      const { subtotal, shipping, tax, total } = calculateTotals()
      
      // 1. Créer la commande en base
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
        payment_method: data.paymentMethod,
        payment_status: 'pending',
        status: 'pending'
      }

      // 2. Sauvegarder la commande d'abord pour avoir l'ID
      const order = await ordersApi.create(orderData)

      // 3. Traiter selon le mode de paiement
      let paymentResult = { success: true }

      if (data.paymentMethod === 'card') {
        paymentResult = await processCardPayment({
          amount: total,
          customer: {
            firstName: data.firstName,
            lastName: data.lastName,
            email: data.email,
            phone: data.phone
          },
          orderData: order
        })

        // Rediriger vers la page de paiement FedaPay
        if (paymentResult.success && paymentResult.paymentUrl) {
          window.location.href = paymentResult.paymentUrl
          return
        }

      } else if (data.paymentMethod === 'mobile_money') {
        paymentResult = await processMobileMoney({
          amount: total,
          provider: data.mobileMoneyProvider,
          phone: data.mobileMoneyNumber,
          customer: {
            firstName: data.firstName,
            lastName: data.lastName,
            email: data.email,
            phone: data.phone
          },
          orderData: order
        })

        // Rediriger vers la page de paiement FedaPay
        if (paymentResult.success && paymentResult.paymentUrl) {
          window.location.href = paymentResult.paymentUrl
          return
        }

      } else if (data.paymentMethod === 'cash_on_delivery') {
        // Paiement à la livraison : pas de traitement particulier
        paymentResult = {
          success: true,
          transactionId: `COD-${Date.now()}`
        }
      }

      if (!paymentResult.success) {
        throw new Error(paymentResult.error)
      }

      // 4. Mettre à jour la commande avec l'ID de transaction
      if (paymentResult.transactionId) {
        await ordersApi.update(order.id, {
          transaction_id: paymentResult.transactionId,
          payment_status: data.paymentMethod === 'cash_on_delivery' ? 'pending' : 'paid'
        })
      }

      // 5. Vider le panier (sauf pour Mobile Money/Carte où on redirige avant)
      if (data.paymentMethod === 'cash_on_delivery') {
        clearCart()
        
        setPaymentStep('success')
        toast.success('Commande confirmée avec succès!')
        
        setTimeout(() => {
          navigate(`/orders/success/${order.id}`)
        }, 2000)
      }
      
    } catch (error) {
      console.error('❌ Erreur paiement:', error)
      toast.error(error.message || 'Erreur lors du paiement')
      setPaymentStep('form')
    } finally {
      setLoading(false)
    }
  }

  const { subtotal, shipping, tax, total } = calculateTotals()

  if (paymentStep === 'success') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <CheckCircleIcon className="h-24 w-24 text-green-500 mx-auto mb-4" />
          <h2 className="text-3xl font-bold mb-2">Merci pour votre commande !</h2>
          <p className="text-gray-600 mb-4">Vous allez être redirigé...</p>
        </div>
      </div>
    )
  }

  if (paymentStep === 'processing') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <ArrowPathIcon className="h-24 w-24 text-blue-500 mx-auto mb-4 animate-spin" />
          <h2 className="text-3xl font-bold mb-2">Traitement en cours...</h2>
          <p className="text-gray-600 mb-4">Veuillez patienter pendant le traitement de votre paiement.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Finaliser la commande</h1>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Formulaire */}
        <div className="lg:col-span-2">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Mode de paiement</h2>
            
            <form onSubmit={handleSubmit(handlePayment)} className="space-y-6">
              {/* Choix du mode de paiement */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <label className={`border rounded-lg p-4 cursor-pointer transition-all ${
                  paymentMethod === 'cash_on_delivery' 
                    ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20' 
                    : 'border-gray-200 hover:border-blue-300'
                }`}>
                  <input
                    type="radio"
                    value="cash_on_delivery"
                    {...register('paymentMethod')}
                    className="hidden"
                  />
                  <BanknotesIcon className="h-8 w-8 mb-2 text-green-600" />
                  <p className="font-semibold">Paiement à la livraison</p>
                  <p className="text-sm text-gray-500">Payez en espèces à la réception</p>
                </label>

                <label className={`border rounded-lg p-4 cursor-pointer transition-all ${
                  paymentMethod === 'mobile_money' 
                    ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20' 
                    : 'border-gray-200 hover:border-blue-300'
                }`}>
                  <input
                    type="radio"
                    value="mobile_money"
                    {...register('paymentMethod')}
                    className="hidden"
                  />
                  <DevicePhoneMobileIcon className="h-8 w-8 mb-2 text-orange-600" />
                  <p className="font-semibold">Mobile Money</p>
                  <p className="text-sm text-gray-500">TogoCell, Moov, Flooz</p>
                </label>

                <label className={`border rounded-lg p-4 cursor-pointer transition-all ${
                  paymentMethod === 'card' 
                    ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20' 
                    : 'border-gray-200 hover:border-blue-300'
                }`}>
                  <input
                    type="radio"
                    value="card"
                    {...register('paymentMethod')}
                    className="hidden"
                  />
                  <CreditCardIcon className="h-8 w-8 mb-2 text-blue-600" />
                  <p className="font-semibold">Carte bancaire</p>
                  <p className="text-sm text-gray-500">Visa, Mastercard</p>
                </label>
              </div>

              {/* Formulaire Mobile Money */}
              {paymentMethod === 'mobile_money' && (
                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg mb-4">
                  <h3 className="font-semibold mb-3">Informations Mobile Money</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Opérateur</label>
                      <select
                        {...register('mobileMoneyProvider')}
                        className="w-full px-3 py-2 border rounded-md dark:bg-gray-600"
                      >
                        <option value="togocel">TogoCell</option>
                        <option value="moov_tg">Moov</option>
                        <option value="flooz">Flooz</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Numéro</label>
                      <input
                        type="tel"
                        {...register('mobileMoneyNumber')}
                        placeholder="90 00 00 00"
                        className="w-full px-3 py-2 border rounded-md dark:bg-gray-600"
                      />
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    Vous recevrez une notification sur votre téléphone pour confirmer le paiement
                  </p>
                </div>
              )}

              {/* Informations de livraison */}
              <div className="border-t pt-6">
                <h2 className="text-xl font-semibold mb-4">Adresse de livraison</h2>
                <div className="grid md:grid-cols-2 gap-4">
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
                  <div>
                    <label className="block text-sm font-medium mb-1">Email</label>
                    <input
                      {...register('email')}
                      type="email"
                      className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
                    />
                    {errors.email && (
                      <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Téléphone</label>
                    <input
                      {...register('phone')}
                      className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
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
                      className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
                    />
                    {errors.address && (
                      <p className="text-red-500 text-sm mt-1">{errors.address.message}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Ville</label>
                    <input
                      {...register('city')}
                      className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
                    />
                    {errors.city && (
                      <p className="text-red-500 text-sm mt-1">{errors.city.message}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Instructions (optionnel)</label>
                    <input
                      {...register('deliveryNotes')}
                      className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
                      placeholder="Heure de livraison, etc."
                    />
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
                <span>TVA (18%)</span>
                <span>{formatPrice(tax)}</span>
              </div>
              <div className="flex justify-between font-bold text-lg pt-2 border-t">
                <span>Total</span>
                <span className="text-blue-600">{formatPrice(total)}</span>
              </div>
            </div>

            {subtotal < 50000 && (
              <div className="mt-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg text-sm">
                <p className="text-yellow-800 dark:text-yellow-200">
                  💡 Plus que {formatPrice(50000 - subtotal)} d'achat pour la livraison gratuite !
                </p>
              </div>
            )}

            {/* Informations de sécurité */}
            <div className="mt-6 pt-4 border-t text-xs text-gray-500 dark:text-gray-400">
              <p className="flex items-center gap-1">
                <CheckCircleIcon className="h-4 w-4 text-green-500" />
                Paiement 100% sécurisé
              </p>
              <p className="mt-1">
                Vos informations sont protégées par FedaPay
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}