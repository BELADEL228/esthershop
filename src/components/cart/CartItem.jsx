import React from 'react'
import { TrashIcon, PlusIcon, MinusIcon } from '@heroicons/react/24/outline'
import { usePrice } from '../../hooks/usePrice'
import { Link } from 'react-router-dom'

export const CartItem = ({ item, onUpdateQuantity, onRemove }) => {
  const formatPrice = usePrice()

  return (
    <div className="flex flex-wrap md:flex-nowrap items-center py-6 border-b border-gray-200 dark:border-gray-700 gap-4">
      {/* Image produit */}
      <div className="w-24 h-24 flex-shrink-0">
        <Link to={`/products/${item.id}`}>
          <img
            src={item.images?.[0] || 'https://via.placeholder.com/100'}
            alt={item.name}
            className="w-full h-full object-cover rounded-lg shadow-sm transition-transform hover:scale-105 duration-300"
          />
        </Link>
      </div>

      {/* Détails produit */}
      <div className="flex-1 min-w-0">
        <Link to={`/products/${item.id}`}>
          <h3 className="text-lg font-bold text-gray-900 dark:text-white hover:text-primary-600 dark:hover:text-primary-400 transition-colors line-clamp-1">
            {item.name}
          </h3>
        </Link>
        <p className="text-gray-500 dark:text-gray-400 text-sm mt-0.5">{item.category}</p>
        <p className="text-primary-600 dark:text-primary-400 font-bold mt-2">{formatPrice(item.price)}</p>
      </div>

      {/* Quantité */}
      <div className="flex items-center space-x-3">
        <button
          onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
          className="w-8 h-8 rounded-full border border-gray-300 dark:border-gray-600 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={item.quantity <= 1}
        >
          <MinusIcon className="h-4 w-4" />
        </button>
        <span className="w-8 text-center font-semibold text-gray-900 dark:text-white">{item.quantity}</span>
        <button
          onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
          className="w-8 h-8 rounded-full border border-gray-300 dark:border-gray-600 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={item.quantity >= item.stock}
        >
          <PlusIcon className="h-4 w-4" />
        </button>
      </div>

      {/* Sous-total */}
      <div className="w-28 text-right">
        <p className="font-bold text-gray-900 dark:text-white">{formatPrice(item.price * item.quantity)}</p>
      </div>

      {/* Bouton supprimer */}
      <button
        onClick={() => onRemove(item.id)}
        className="ml-2 p-2 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full transition-colors"
        aria-label="Supprimer"
      >
        <TrashIcon className="h-5 w-5" />
      </button>
    </div>
  )
}