import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { productsApi } from '../services/api/products'
import { useCart } from '../contexts/CartContext'
import { usePrice } from '../hooks/usePrice'
import { LoadingSpinner } from '../components/common/LoadingSpinner'
import { ShoppingCartIcon, HeartIcon } from '@heroicons/react/24/outline'
import { HeartIcon as HeartIconSolid } from '@heroicons/react/24/solid'
import toast from 'react-hot-toast'

export const ProductDetail = () => {
  const { id } = useParams()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [selectedImage, setSelectedImage] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [isFavorite, setIsFavorite] = useState(false)
  const { addToCart } = useCart()
  const formatPrice = usePrice()

  useEffect(() => {
    loadProduct()
  }, [id])

  useEffect(() => {
    if (product) {
      checkIfFavorite()
    }
  }, [product])

  const loadProduct = async () => {
    try {
      const data = await productsApi.getById(id)
      setProduct(data)
    } catch (error) {
      toast.error(`Erreur lors du chargement du produit: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  const checkIfFavorite = () => {
    try {
      const favorites = localStorage.getItem('favorites')
      if (favorites) {
        const favIds = JSON.parse(favorites)
        setIsFavorite(favIds.includes(id))
      } else {
        setIsFavorite(false)
      }
    } catch (error) {
      console.error('Erreur vérification favori:', error)
      setIsFavorite(false)
    }
  }

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addToCart(product)
    }
    toast.success(`${quantity} produit(s) ajouté(s) au panier`)
  }

  const handleToggleFavorite = () => {
    try {
      const favorites = localStorage.getItem('favorites')
      let favIds = favorites ? JSON.parse(favorites) : []
      
      if (isFavorite) {
        favIds = favIds.filter(favId => favId !== id)
        toast.success('Retiré des favoris')
      } else {
        favIds = [...favIds, id]
        toast.success('Ajouté aux favoris')
      }
      
      localStorage.setItem('favorites', JSON.stringify(favIds))
      setIsFavorite(!isFavorite)
    } catch (error) {
      console.error('Erreur gestion favori:', error)
      toast.error('Erreur lors de la mise à jour des favoris')
    }
  }

  if (loading) return <LoadingSpinner />
  if (!product) return (
    <div className="text-center py-12">
      <p className="text-gray-600 dark:text-gray-400">Produit non trouvé</p>
    </div>
  )

  const images = product.images?.length ? product.images : ['https://via.placeholder.com/500']

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Galerie d'images */}
        <div>
          <div className="bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden mb-4">
            <img
              src={images[selectedImage]}
              alt={product.name}
              className="w-full h-96 object-cover"
            />
          </div>
          {images.length > 1 && (
            <div className="grid grid-cols-4 gap-2">
              {images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`border-2 rounded-lg overflow-hidden transition-all ${
                    selectedImage === index 
                      ? 'border-primary-600 ring-2 ring-primary-300' 
                      : 'border-transparent hover:border-gray-300'
                  }`}
                >
                  <img 
                    src={image} 
                    alt={`${product.name} ${index + 1}`} 
                    className="w-full h-20 object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Informations produit */}
        <div>
          <h1 className="text-3xl font-bold mb-2 text-gray-900 dark:text-white">
            {product.name}
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-4 capitalize">
            {product.category}
          </p>
          
          <div className="text-3xl font-bold text-primary-600 dark:text-primary-400 mb-4">
            {formatPrice(product.price)}
          </div>

          <div className="mb-6">
            <h3 className="font-semibold mb-2 text-gray-900 dark:text-white">
              Description
            </h3>
            <p className="text-gray-700 dark:text-gray-300">
              {product.description}
            </p>
          </div>

          <div className="mb-6">
            <h3 className="font-semibold mb-2 text-gray-900 dark:text-white">
              Disponibilité
            </h3>
            {product.stock > 0 ? (
              <p className="text-green-600 dark:text-green-400">
                ✓ En stock ({product.stock} unité{product.stock > 1 ? 's' : ''} disponible{product.stock > 1 ? 's' : ''})
              </p>
            ) : (
              <p className="text-red-600 dark:text-red-400">
                ⚠ Rupture de stock
              </p>
            )}
          </div>

          {product.stock > 0 && (
            <>
              <div className="flex items-center space-x-4 mb-6">
                <label className="font-semibold text-gray-900 dark:text-white">
                  Quantité:
                </label>
                <div className="flex items-center border rounded-lg dark:border-gray-600">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3 py-1 hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-white transition-colors"
                    aria-label="Diminuer la quantité"
                  >
                    -
                  </button>
                  <span className="px-4 py-1 border-x dark:border-gray-600 dark:text-white">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                    className="px-3 py-1 hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-white transition-colors"
                    aria-label="Augmenter la quantité"
                  >
                    +
                  </button>
                </div>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  max. {product.stock}
                </span>
              </div>

              <div className="flex space-x-4">
                <button
                  onClick={handleAddToCart}
                  className="flex-1 bg-primary-600 text-white py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors flex items-center justify-center space-x-2 disabled:bg-primary-300 disabled:cursor-not-allowed"
                  disabled={product.stock === 0}
                >
                  <ShoppingCartIcon className="h-5 w-5" />
                  <span>Ajouter au panier</span>
                </button>
                
                <button
                  onClick={handleToggleFavorite}
                  className={`p-3 border rounded-lg transition-all ${
                    isFavorite 
                      ? 'bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800' 
                      : 'hover:bg-gray-50 dark:hover:bg-gray-800 dark:border-gray-600'
                  }`}
                  aria-label={isFavorite ? 'Retirer des favoris' : 'Ajouter aux favoris'}
                >
                  {isFavorite ? (
                    <HeartIconSolid className="h-6 w-6 text-red-500" />
                  ) : (
                    <HeartIcon className="h-6 w-6 text-gray-600 dark:text-gray-400" />
                  )}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}