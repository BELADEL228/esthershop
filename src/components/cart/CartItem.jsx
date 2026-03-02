import React from 'react'
import { TrashIcon, PlusIcon, MinusIcon } from '@heroicons/react/24/outline'
import { formatPrice } from '../../utils/helpers'
import { Link } from 'react-router-dom'

export const CartItem = ({ item, onUpdateQuantity, onRemove }) => {
  return (
    <div className="flex items-center py-4 border-b">
      {/* Image produit */}
      <div className="w-24 h-24 flex-shrink-0">
        <Link to={`/products/${item.id}`}>
          <img
            src={item.images?.[0] || 'https://via.placeholder.com/100'}
            alt={item.name}
            className="w-full h-full object-cover rounded-lg"
          />
        </Link>
      </div>

      {/* Détails produit */}
      <div className="flex-1 ml-4">
        <Link to={`/products/${item.id}`}>
          <h3 className="text-lg font-semibold hover:text-blue-600">{item.name}</h3>
        </Link>
        <p className="text-gray-600 text-sm">{item.category}</p>
        <p className="text-blue-600 font-bold mt-1">{formatPrice(item.price)}</p>
      </div>

      {/* Quantité */}
      <div className="flex items-center space-x-2">
        <button
          onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
          className="p-1 rounded-full hover:bg-gray-100"
          disabled={item.quantity <= 1}
        >
          <MinusIcon className="h-4 w-4" />
        </button>
        <span className="w-8 text-center">{item.quantity}</span>
        <button
          onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
          className="p-1 rounded-full hover:bg-gray-100"
          disabled={item.quantity >= item.stock}
        >
          <PlusIcon className="h-4 w-4" />
        </button>
      </div>

      {/* Sous-total */}
      <div className="w-24 text-right">
        <p className="font-semibold">{formatPrice(item.price * item.quantity)}</p>
      </div>

      {/* Bouton supprimer */}
      <button
        onClick={() => onRemove(item.id)}
        className="ml-4 p-2 text-red-600 hover:bg-red-50 rounded-lg"
      >
        <TrashIcon className="h-5 w-5" />
      </button>
    </div>
  )
}