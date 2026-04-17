import React, { useState, useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import { CheckCircleIcon, ShoppingBagIcon, MapPinIcon } from '@heroicons/react/24/outline'
import { ordersApi } from '../services/api/orders'
import { formatDate } from '../utils/helpers'
import { useAuth } from '../hooks/useAuth'
import { usePrice } from '../hooks/usePrice'

export const OrderSuccess = () => {
  const { id } = useParams()
  const { user } = useAuth()
  const formatPrice = usePrice()
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (id) {
      loadOrder()
    }
  }, [id])

  const loadOrder = async () => {
    try {
      const data = await ordersApi.getById(id)
      if (data.user_id !== user?.id && !user?.isAdmin) {
        throw new Error("Vous n'êtes pas autorisé à voir cette commande")
      }
      setOrder(data)
    } catch (err) {
      console.error('Erreur chargement commande:', err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  if (error || !order) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
        <div className="text-center">
          <p className="text-red-600 mb-4">Une erreur est survenue : {error}</p>
          <Link to="/orders" className="text-primary-600 hover:underline">Voir mes commandes</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        {/* En-tête de confirmation */}
        <div className="text-center mb-8">
          <CheckCircleIcon className="h-20 w-20 text-green-500 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Merci pour votre commande !
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Votre commande #{order.id.slice(0, 8)} a bien été enregistrée.
          </p>
        </div>

        {/* Carte récapitulative */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden mb-6 border border-gray-200 dark:border-gray-700">
          <div className="border-b border-gray-200 dark:border-gray-700 p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Récapitulatif</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Date de commande</p>
                <p className="font-medium text-gray-900 dark:text-white">{formatDate(order.created_at)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Montant total</p>
                <p className="text-2xl font-bold text-primary-600">{formatPrice(order.total)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Mode de paiement</p>
                <p className="font-medium text-gray-900 dark:text-white">
                  {order.payment_method === 'cash_on_delivery' ? 'Paiement à la livraison' : 'Carte bancaire'}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Statut de la commande</p>
                <p className="font-medium capitalize text-gray-900 dark:text-white">{order.status}</p>
              </div>
            </div>
          </div>

          {/* Adresse de livraison */}
          <div className="border-b border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center space-x-2 mb-3">
              <MapPinIcon className="h-5 w-5 text-primary-500" />
              <h3 className="font-semibold text-gray-900 dark:text-white">Adresse de livraison</h3>
            </div>
            <p className="text-gray-700 dark:text-gray-300">
              {order.shipping_address?.firstName} {order.shipping_address?.lastName}<br />
              {order.shipping_address?.address}<br />
              {order.shipping_address?.postalCode} {order.shipping_address?.city}<br />
              {order.shipping_address?.country}<br />
              Tél : {order.shipping_address?.phone}
            </p>
          </div>

          {/* Articles commandés */}
          <div className="p-6">
            <div className="flex items-center space-x-2 mb-3">
              <ShoppingBagIcon className="h-5 w-5 text-primary-500" />
              <h3 className="font-semibold text-gray-900 dark:text-white">Articles commandés</h3>
            </div>
            <div className="space-y-3">
              {order.order_items?.map((item, idx) => (
                <div key={idx} className="flex justify-between items-center border-b border-gray-200 dark:border-gray-700 pb-2">
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">{item.product?.name || "Produit"}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Quantité : {item.quantity}</p>
                  </div>
                  <p className="font-semibold text-gray-900 dark:text-white">{formatPrice(item.price * item.quantity)}</p>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-2 border-t border-gray-200 dark:border-gray-700">
              <div className="flex justify-between">
                <span className="text-gray-700 dark:text-gray-300">Total</span>
                <span className="font-bold text-lg text-primary-600">{formatPrice(order.total)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/orders"
            className="inline-flex justify-center items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors"
          >
            Voir toutes mes commandes
          </Link>
          <Link
            to="/products"
            className="inline-flex justify-center items-center px-6 py-3 border border-gray-300 dark:border-gray-600 text-base font-medium rounded-md shadow-sm text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors"
          >
            Continuer mes achats
          </Link>
        </div>
      </div>
    </div>
  )
}