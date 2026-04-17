import React, { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { productsApi } from '../services/api/products'
import { ProductList } from '../components/products/ProductList'
import { ProductFilters } from '../components/products/ProductFilters'
import { LoadingSpinner } from '../components/common/LoadingSpinner'
import { FunnelIcon } from '@heroicons/react/24/outline'

export const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const [products, setProducts] = useState([])
  const [filteredProducts, setFilteredProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showFilters, setShowFilters] = useState(false)
  const [categories, setCategories] = useState([])
  const [filters, setFilters] = useState({
    category: searchParams.get('category') || '',
    minPrice: searchParams.get('minPrice') || '',
    maxPrice: searchParams.get('maxPrice') || '',
    search: searchParams.get('search') || '',
    sort: searchParams.get('sort') || 'newest',
    inStock: searchParams.get('inStock') === 'true'
  })

  useEffect(() => {
    loadProducts()
    loadCategories()
  }, [])

  useEffect(() => {
    applyFilters()
    updateUrlParams()
  }, [products, filters])

  const loadProducts = async () => {
    try {
      setLoading(true)
      const data = await productsApi.getAll()
      setProducts(data)
      setError(null)
    } catch (err) {
      setError('Erreur lors du chargement des produits')
      console.error('Erreur chargement produits:', err)
    } finally {
      setLoading(false)
    }
  }

  const loadCategories = async () => {
    try {
      const data = await productsApi.getCategories()
      setCategories(data)
    } catch (error) {
      console.error('Erreur chargement catégories:', error)
    }
  }

  const applyFilters = () => {
    let result = [...products]

    if (filters.category) {
      result = result.filter(p => p.category === filters.category)
    }
    if (filters.search) {
      const searchLower = filters.search.toLowerCase()
      result = result.filter(p => 
        p.name.toLowerCase().includes(searchLower) ||
        p.description.toLowerCase().includes(searchLower)
      )
    }
    if (filters.minPrice) {
      result = result.filter(p => p.price >= parseFloat(filters.minPrice))
    }
    if (filters.maxPrice) {
      result = result.filter(p => p.price <= parseFloat(filters.maxPrice))
    }
    if (filters.inStock) {
      result = result.filter(p => p.stock > 0)
    }

    switch (filters.sort) {
      case 'price-asc':
        result.sort((a, b) => a.price - b.price)
        break
      case 'price-desc':
        result.sort((a, b) => b.price - a.price)
        break
      case 'name-asc':
        result.sort((a, b) => a.name.localeCompare(b.name))
        break
      case 'name-desc':
        result.sort((a, b) => b.name.localeCompare(a.name))
        break
      case 'stock':
        result.sort((a, b) => b.stock - a.stock)
        break
      default:
        result.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    }

    setFilteredProducts(result)
  }

  const updateUrlParams = () => {
    const params = new URLSearchParams()
    if (filters.category) params.set('category', filters.category)
    if (filters.minPrice) params.set('minPrice', filters.minPrice)
    if (filters.maxPrice) params.set('maxPrice', filters.maxPrice)
    if (filters.search) params.set('search', filters.search)
    if (filters.sort !== 'newest') params.set('sort', filters.sort)
    if (filters.inStock) params.set('inStock', 'true')
    setSearchParams(params)
  }

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters)
  }

  const handleClearFilters = () => {
    setFilters({
      category: '',
      minPrice: '',
      maxPrice: '',
      search: '',
      sort: 'newest',
      inStock: false
    })
  }

  if (loading && products.length === 0) return <LoadingSpinner />
  if (error) return <div className="text-center py-12 text-red-600">{error}</div>

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Nos Produits</h1>
        <p className="text-gray-600 dark:text-gray-400">
          {filteredProducts.length} produit(s) trouvé(s)
        </p>
      </div>

      {/* Barre de recherche mobile */}
      <div className="md:hidden mb-4">
        <input
          type="text"
          placeholder="Rechercher un produit..."
          value={filters.search}
          onChange={(e) => handleFilterChange({ ...filters, search: e.target.value })}
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-800 dark:text-white"
        />
      </div>

      {/* Mobile filter button */}
      <button
        onClick={() => setShowFilters(!showFilters)}
        className="md:hidden flex items-center justify-center space-x-2 bg-primary-600 text-white px-4 py-2 rounded-lg mb-4 w-full hover:bg-primary-700 transition-colors"
      >
        <FunnelIcon className="h-5 w-5" />
        <span>{showFilters ? 'Masquer les filtres' : 'Afficher les filtres'}</span>
      </button>

      <div className="flex flex-col md:flex-row gap-8">
        <div className={`md:w-64 ${showFilters ? 'block' : 'hidden md:block'}`}>
          <ProductFilters
            filters={filters}
            onFilterChange={handleFilterChange}
            onClearFilters={handleClearFilters}
            categories={categories}
          />
        </div>

        <div className="flex-1">
          <div className="mb-6 flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <label htmlFor="sort" className="text-gray-600 dark:text-gray-400">Trier par:</label>
              <select
                id="sort"
                value={filters.sort}
                onChange={(e) => handleFilterChange({ ...filters, sort: e.target.value })}
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-800 dark:text-white"
              >
                <option value="newest">Plus récents</option>
                <option value="price-asc">Prix croissant</option>
                <option value="price-desc">Prix décroissant</option>
                <option value="name-asc">Nom A-Z</option>
                <option value="name-desc">Nom Z-A</option>
                <option value="stock">Stock</option>
              </select>
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400 hidden md:block">
              {filteredProducts.length} résultats
            </div>
          </div>

          <ProductList 
            products={filteredProducts} 
            loading={loading}
            error={error}
          />
        </div>
      </div>
    </div>
  )
}