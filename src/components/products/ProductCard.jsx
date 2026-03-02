import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useCart } from '../../hooks/useCart'
import { useAuth } from '../../hooks/useAuth'
import { formatPrice } from '../../utils/helpers'
import { 
  ShoppingCartIcon, 
  HeartIcon,
  EyeIcon 
} from '@heroicons/react/24/outline'
import { HeartIcon as HeartIconSolid } from '@heroicons/react/24/solid'
import toast from 'react-hot-toast'

export const ProductCard = ({ product }) => {
  const { addToCart } = useCart()
  const { user } = useAuth()
  const [isFavorite, setIsFavorite] = useState(false)
  const [imageLoaded, setImageLoaded] = useState(false)
  const [isHovered, setIsHovered] = useState(false)

  const handleAddToCart = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (product.stock === 0) {
      toast.error('Produit en rupture de stock')
      return
    }
    addToCart(product)
    toast.success('Produit ajouté au panier')
  }

  const handleToggleFavorite = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (!user) {
      toast.error('Connectez-vous pour ajouter aux favoris')
      return
    }
    setIsFavorite(!isFavorite)
    toast.success(isFavorite ? 'Retiré des favoris' : 'Ajouté aux favoris')
  }

  const discount = product.originalPrice ? 
    Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) : 0

  return (
    <div 
      className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link to={`/products/${product.id}`} className="block relative">
        {/* Image avec effet de zoom */}
        <div className="relative h-64 overflow-hidden bg-gray-100">
          {!imageLoaded && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
          )}
          <img
            src={product.images?.[0] || 'https://via.placeholder.com/300x400?text=Image+non+disponible'}
            alt={product.name}
            className={`w-full h-full object-cover transition-transform duration-500 ${
              isHovered ? 'scale-110' : 'scale-100'
            } ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
            onLoad={() => setImageLoaded(true)}
          />
          
          {/* Badges */}
          <div className="absolute top-2 left-2 flex flex-col space-y-2">
            {product.stock === 0 && (
              <span className="bg-red-500 text-white text-xs px-2 py-1 rounded">
                Rupture de stock
              </span>
            )}
            {product.stock > 0 && product.stock < 5 && (
              <span className="bg-orange-500 text-white text-xs px-2 py-1 rounded">
                Plus que {product.stock}
              </span>
            )}
            {discount > 0 && (
              <span className="bg-green-500 text-white text-xs px-2 py-1 rounded">
                -{discount}%
              </span>
            )}
            {product.isNew && (
              <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded">
                Nouveau
              </span>
            )}
          </div>

          {/* Boutons d'action (apparaissent au hover) */}
          <div className={`absolute inset-0 bg-black bg-opacity-20 transition-opacity duration-300 flex items-center justify-center space-x-2 ${
            isHovered ? 'opacity-100' : 'opacity-0'
          }`}>
            <button
              onClick={handleAddToCart}
              disabled={product.stock === 0}
              className={`p-2 rounded-full transition-all transform hover:scale-110 ${
                product.stock === 0 
                  ? 'bg-gray-300 cursor-not-allowed' 
                  : 'bg-white text-blue-600 hover:bg-blue-600 hover:text-white'
              }`}
              title="Ajouter au panier"
            >
              <ShoppingCartIcon className="h-5 w-5" />
            </button>
            
            <button
              onClick={handleToggleFavorite}
              className="p-2 bg-white rounded-full hover:bg-red-50 transition-all transform hover:scale-110"
              title="Ajouter aux favoris"
            >
              {isFavorite ? (
                <HeartIconSolid className="h-5 w-5 text-red-500" />
              ) : (
                <HeartIcon className="h-5 w-5 text-gray-600" />
              )}
            </button>

            <Link
              to={`/products/${product.id}`}
              className="p-2 bg-white rounded-full hover:bg-gray-100 transition-all transform hover:scale-110"
              title="Voir détails"
            >
              <EyeIcon className="h-5 w-5 text-gray-600" />
            </Link>
          </div>
        </div>

        {/* Contenu */}
        <div className="p-4">
          <h3 className="text-lg font-semibold mb-2 line-clamp-1 hover:text-blue-600 transition-colors">
            {product.name}
          </h3>
          
          <p className="text-gray-600 text-sm mb-3 line-clamp-2">
            {product.description}
          </p>
          
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              <span className="text-xl font-bold text-blue-600">
                {formatPrice(product.price)}
              </span>
              {product.originalPrice && (
                <span className="text-sm text-gray-400 line-through">
                  {formatPrice(product.originalPrice)}
                </span>
              )}
            </div>
            <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
              {product.category}
            </span>
          </div>

          {/* Note et avis */}
          {product.rating && (
            <div className="flex items-center space-x-1 mb-3">
              <div className="flex text-yellow-400">
                {[...Array(5)].map((_, i) => (
                  <svg
                    key={i}
                    className={`h-4 w-4 ${i < Math.floor(product.rating) ? 'text-yellow-400' : 'text-gray-300'}`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <span className="text-xs text-gray-500">({product.reviews || 0})</span>
            </div>
          )}

          {/* Bouton Ajouter au panier (mobile/fallback) */}
          <button
            onClick={handleAddToCart}
            disabled={product.stock === 0}
            className={`w-full mt-2 py-2 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2 lg:hidden ${
              product.stock === 0
                ? 'bg-gray-300 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700 text-white'
            }`}
          >
            <ShoppingCartIcon className="h-4 w-4" />
            <span className="text-sm">Ajouter</span>
          </button>
        </div>

        {/* Livraison gratuite badge */}
        {product.freeShipping && (
          <div className="absolute bottom-2 right-2 bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
            Livraison gratuite
          </div>
        )}
      </Link>
    </div>
  )
}