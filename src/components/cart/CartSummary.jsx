import React from 'react'
import { Link } from 'react-router-dom'
import { useSettings } from '../../hooks/useSettings'
import { usePrice } from '../../hooks/usePrice'

export const CartSummary = ({ cart }) => {
  const { settings } = useSettings()
  const formatPrice = usePrice()
  const subtotal = cart.total

  const shippingCost = settings?.shipping_cost || 2000
  const freeShippingThreshold = settings?.free_shipping_threshold || 50000
  const taxRate = settings?.tax_rate || 18

  const shipping = subtotal > freeShippingThreshold ? 0 : shippingCost
  const tax = Math.round(subtotal * taxRate / 100)
  const total = subtotal + shipping + tax

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 sticky top-20 border border-gray-200 dark:border-gray-700">
      <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 pb-2 border-b border-gray-200 dark:border-gray-700">
        Résumé de la commande
      </h2>
      
      <div className="space-y-3 mb-6">
        <div className="flex justify-between text-gray-600 dark:text-gray-400">
          <span>Sous-total</span>
          <span className="font-medium">{formatPrice(subtotal)}</span>
        </div>
        <div className="flex justify-between text-gray-600 dark:text-gray-400">
          <span>Livraison</span>
          {shipping === 0 ? (
            <span className="text-green-600 font-medium">Gratuite</span>
          ) : (
            <span className="font-medium">{formatPrice(shipping)}</span>
          )}
        </div>
        <div className="flex justify-between text-gray-600 dark:text-gray-400">
          <span>TVA ({taxRate}%)</span>
          <span className="font-medium">{formatPrice(tax)}</span>
        </div>
        <div className="border-t border-gray-200 dark:border-gray-700 pt-3 mt-2">
          <div className="flex justify-between text-lg font-bold">
            <span className="text-gray-900 dark:text-white">Total</span>
            <span className="text-primary-600">{formatPrice(total)}</span>
          </div>
        </div>
      </div>

      {subtotal < freeShippingThreshold && (
        <div className="bg-blue-50 dark:bg-blue-900/20 text-blue-800 dark:text-blue-300 p-3 rounded-lg mb-6 text-sm">
          💡 Plus que {formatPrice(freeShippingThreshold - subtotal)} d'achat pour bénéficier de la livraison gratuite !
        </div>
      )}

      <Link
        to="/checkout"
        className="block w-full bg-primary-600 text-white text-center py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors mb-4"
      >
        Procéder au paiement
      </Link>

      <Link
        to="/products"
        className="block w-full text-center text-primary-600 hover:text-primary-700 transition-colors font-medium"
      >
        Continuer mes achats
      </Link>
    </div>
  )
}