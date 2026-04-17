import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { productsApi } from '../services/api/products'
import { ProductCard } from '../components/products/ProductCard'
import { HeartIcon, ShoppingBagIcon } from '@heroicons/react/24/outline'
import { HeartIcon as HeartIconSolid } from '@heroicons/react/24/solid'
import toast from 'react-hot-toast'

export const Favorites = () => {
  const { user } = useAuth()
  const [favorites, setFavorites] = useState([])
  const [loading, setLoading] = useState(true)
  const [favoriteIds, setFavoriteIds] = useState([])

  useEffect(() => {
    loadFavorites()
  }, [])

  const loadFavorites = () => {
    try {
      const savedFavorites = localStorage.getItem('favorites')
      if (savedFavorites) {
        const ids = JSON.parse(savedFavorites)
        setFavoriteIds(ids)
        loadFavoriteProducts(ids)
      } else {
        setFavorites([])
        setLoading(false)
      }
    } catch (error) {
      console.error('Erreur chargement favoris:', error)
      setLoading(false)
    }
  }

  const loadFavoriteProducts = async (ids) => {
    if (ids.length === 0) {
      setFavorites([])
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      const allProducts = await productsApi.getAll()
      const favoriteProducts = allProducts.filter(p => ids.includes(p.id))
      setFavorites(favoriteProducts)
    } catch (error) {
      console.error('Erreur chargement produits:', error)
      toast.error('Erreur lors du chargement des favoris')
    } finally {
      setLoading(false)
    }
  }

  const toggleFavorite = (productId) => {
    let newFavoriteIds
    
    if (favoriteIds.includes(productId)) {
      newFavoriteIds = favoriteIds.filter(id => id !== productId)
      toast.success('Produit retiré des favoris')
    } else {
      newFavoriteIds = [...favoriteIds, productId]
      toast.success('Produit ajouté aux favoris')
    }
    
    setFavoriteIds(newFavoriteIds)
    localStorage.setItem('favorites', JSON.stringify(newFavoriteIds))
    loadFavoriteProducts(newFavoriteIds)
  }

  const clearAllFavorites = () => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer tous vos favoris ?')) {
      setFavoriteIds([])
      setFavorites([])
      localStorage.removeItem('favorites')
      toast.success('Tous les favoris ont été supprimés')
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-48 mb-8"></div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((n) => (
              <div key={n} className="bg-gray-200 dark:bg-gray-700 h-64 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (favorites.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="flex justify-center mb-6">
          <div className="bg-pink-100 dark:bg-pink-900/20 p-4 rounded-full">
            <HeartIcon className="h-16 w-16 text-pink-600 dark:text-pink-400" />
          </div>
        </div>
        
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">
          Liste de souhaits vide
        </h1>
        
        <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto">
          Vous n'avez pas encore ajouté de produits à votre liste de souhaits. 
          Explorez nos produits et ajoutez vos coups de cœur !
        </p>
        
        <Link
          to="/products"
          className="inline-flex items-center space-x-2 bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition-colors"
        >
          <ShoppingBagIcon className="h-5 w-5" />
          <span>Découvrir nos produits</span>
        </Link>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* En-tête */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
        <div className="flex items-center space-x-3 mb-4 sm:mb-0">
          <HeartIconSolid className="h-8 w-8 text-pink-600" />
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Mes favoris
          </h1>
          <span className="bg-pink-100 dark:bg-pink-900/20 text-pink-600 dark:text-pink-400 px-3 py-1 rounded-full text-sm font-medium">
            {favorites.length} produit{favorites.length > 1 ? 's' : ''}
          </span>
        </div>
        
        <button
          onClick={clearAllFavorites}
          className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 text-sm font-medium transition-colors"
        >
          Vider la liste
        </button>
      </div>

      {/* Grille des favoris */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {favorites.map((product) => (
          <div key={product.id} className="relative group">
            <ProductCard product={product} />
            
            {/* Bouton pour retirer des favoris (overlay) */}
            <button
              onClick={() => toggleFavorite(product.id)}
              className="absolute top-2 right-2 bg-white dark:bg-gray-800 rounded-full p-2 shadow-md opacity-0 group-hover:opacity-100 transition-opacity hover:bg-pink-50 dark:hover:bg-gray-700"
              title="Retirer des favoris"
            >
              <HeartIconSolid className="h-5 w-5 text-pink-600" />
            </button>
          </div>
        ))}
      </div>

      {/* Message pour les utilisateurs non connectés */}
      {!user && (
        <div className="mt-8 p-4 bg-primary-50 dark:bg-primary-900/20 rounded-lg text-center">
          <p className="text-primary-800 dark:text-primary-200">
            💡 Connectez-vous pour sauvegarder vos favoris sur tous vos appareils !
          </p>
          <Link
            to="/login"
            className="inline-block mt-2 text-primary-600 dark:text-primary-400 hover:underline"
          >
            Se connecter
          </Link>
        </div>
      )}
    </div>
  )
}