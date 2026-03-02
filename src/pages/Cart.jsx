import React from 'react'
import { Link } from 'react-router-dom'
import { useCart } from '../contexts/CartContext'
import { CartItem } from '../components/cart/CartItem'
import { CartSummary } from '../components/cart/CartSummary'
import { ShoppingBagIcon } from '@heroicons/react/24/outline'

export const Cart = () => {
  const { cart, removeFromCart, updateQuantity, clearCart } = useCart()

  if (cart.items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <ShoppingBagIcon className="h-24 w-24 mx-auto text-gray-400 mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Votre panier est vide</h2>
        <p className="text-gray-600 mb-8">Découvrez nos produits et commencez vos achats</p>
        <Link
          to="/products"
          className="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700"
        >
          Voir les produits
        </Link>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Votre Panier</h1>
      
      <div className="flex justify-end mb-4">
        <button
          onClick={clearCart}
          className="text-red-600 hover:text-red-800"
        >
          Vider le panier
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Liste des articles */}
        <div className="lg:col-span-2">
          {cart.items.map((item) => (
            <CartItem
              key={item.id}
              item={item}
              onUpdateQuantity={updateQuantity}
              onRemove={removeFromCart}
            />
          ))}
        </div>

        {/* Résumé */}
        <div>
          <CartSummary cart={cart} />
        </div>
      </div>
    </div>
  )
}