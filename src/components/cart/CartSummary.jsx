import React from 'react'
import { formatPrice } from '../../utils/helpers'
import { Link } from 'react-router-dom'

export const CartSummary = ({ cart }) => {
  const subtotal = cart.total
  const shipping = subtotal > 50 ? 0 : 5.99
  const tax = subtotal * 0.2 // TVA 20%
  const total = subtotal + shipping + tax

  return (
    <div className="bg-gray-50 rounded-lg p-6 sticky top-20">
      <h2 className="text-xl font-bold mb-4">Résumé de la commande</h2>
      
      <div className="space-y-2 mb-4">
        <div className="flex justify-between">
          <span className="text-gray-600">Sous-total</span>
          <span>{formatPrice(subtotal)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Livraison</span>
          {shipping === 0 ? (
            <span className="text-green-600">Gratuite</span>
          ) : (
            <span>{formatPrice(shipping)}</span>
          )}
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">TVA (20%)</span>
          <span>{formatPrice(tax)}</span>
        </div>
        <div className="border-t pt-2 mt-2">
          <div className="flex justify-between font-bold text-lg">
            <span>Total</span>
            <span className="text-blue-600">{formatPrice(total)}</span>
          </div>
        </div>
      </div>

      {subtotal < 50 && (
        <div className="bg-blue-50 text-blue-700 p-3 rounded-lg mb-4 text-sm">
          Plus que {formatPrice(50 - subtotal)} d'achat pour bénéficier de la livraison gratuite !
        </div>
      )}

      <Link
        to="/checkout"
        className="block w-full bg-blue-600 text-white text-center py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors mb-3"
      >
        Procéder au paiement
      </Link>

      <Link
        to="/products"
        className="block w-full text-center text-blue-600 hover:text-blue-800"
      >
        Continuer mes achats
      </Link>
    </div>
  )
}