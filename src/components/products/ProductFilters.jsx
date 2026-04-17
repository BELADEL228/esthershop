import React, { useState } from 'react'
import { 
  XMarkIcon,
  ChevronDownIcon,
  ChevronUpIcon 
} from '@heroicons/react/24/outline'

export const ProductFilters = ({ 
  filters, 
  onFilterChange, 
  onClearFilters,
  categories 
}) => {
  const [expandedSections, setExpandedSections] = useState({
    categories: true,
    price: true,
    stock: true
  })

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }))
  }

  const handleCategoryChange = (category) => {
    onFilterChange({ ...filters, category })
  }

  const handlePriceChange = (type, value) => {
    onFilterChange({ ...filters, [type]: value })
  }

  const handleStockChange = (e) => {
    onFilterChange({ ...filters, inStock: e.target.checked })
  }

  const handleSearchChange = (e) => {
    onFilterChange({ ...filters, search: e.target.value })
  }

  const hasActiveFilters = filters.category || 
    filters.minPrice || 
    filters.maxPrice || 
    filters.search || 
    filters.inStock

  const priceRanges = [
    { label: 'Moins de 15 000 FCFA', min: 0, max: 15000 },
    { label: '15 000 - 30 000 FCFA', min: 15000, max: 30000 },
    { label: '30 000 - 60 000 FCFA', min: 30000, max: 60000 },
    { label: '60 000 - 120 000 FCFA', min: 60000, max: 120000 },
    { label: 'Plus de 120 000 FCFA', min: 120000, max: null }
  ]

  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
      {/* En-tête avec bouton effacer */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Filtres</h3>
        {hasActiveFilters && (
          <button
            onClick={onClearFilters}
            className="text-sm text-red-600 hover:text-red-800 flex items-center"
          >
            <XMarkIcon className="h-4 w-4 mr-1" />
            Effacer tout
          </button>
        )}
      </div>

      {/* Barre de recherche */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Recherche
        </label>
        <input
          type="text"
          value={filters.search}
          onChange={handleSearchChange}
          placeholder="Nom du produit..."
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-600 dark:bg-gray-700 dark:text-white"
        />
      </div>

      {/* Catégories */}
      <div className="mb-6">
        <button
          onClick={() => toggleSection('categories')}
          className="flex items-center justify-between w-full text-left mb-2"
        >
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Catégories</span>
          {expandedSections.categories ? (
            <ChevronUpIcon className="h-4 w-4 text-gray-500" />
          ) : (
            <ChevronDownIcon className="h-4 w-4 text-gray-500" />
          )}
        </button>
        
        {expandedSections.categories && (
          <div className="space-y-2 mt-2 max-h-60 overflow-y-auto">
            <label className="flex items-center space-x-2">
              <input
                type="radio"
                name="category"
                checked={filters.category === ''}
                onChange={() => handleCategoryChange('')}
                className="form-radio text-primary-600"
              />
              <span className="text-sm text-gray-700 dark:text-gray-300">Toutes les catégories</span>
            </label>
            
            {categories.map((category) => (
              <label key={category} className="flex items-center space-x-2">
                <input
                  type="radio"
                  name="category"
                  checked={filters.category === category}
                  onChange={() => handleCategoryChange(category)}
                  className="form-radio text-primary-600"
                />
                <span className="text-sm capitalize text-gray-700 dark:text-gray-300">{category}</span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Prix */}
      <div className="mb-6">
        <button
          onClick={() => toggleSection('price')}
          className="flex items-center justify-between w-full text-left mb-2"
        >
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Prix</span>
          {expandedSections.price ? (
            <ChevronUpIcon className="h-4 w-4 text-gray-500" />
          ) : (
            <ChevronDownIcon className="h-4 w-4 text-gray-500" />
          )}
        </button>
        
        {expandedSections.price && (
          <div className="space-y-3 mt-2">
            <div className="space-y-2">
              {priceRanges.map((range, index) => (
                <button
                  key={index}
                  onClick={() => {
                    onFilterChange({
                      ...filters,
                      minPrice: range.min,
                      maxPrice: range.max || ''
                    })
                  }}
                  className={`block w-full text-left px-3 py-2 text-sm rounded-md transition-colors ${
                    filters.minPrice === range.min && filters.maxPrice === (range.max || '')
                      ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300'
                      : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
                  }`}
                >
                  {range.label}
                </button>
              ))}
            </div>

            <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">Prix personnalisé (FCFA):</p>
              <div className="flex items-center space-x-2">
                <input
                  type="number"
                  value={filters.minPrice}
                  onChange={(e) => handlePriceChange('minPrice', e.target.value)}
                  placeholder="Min"
                  min="0"
                  className="w-full px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
                />
                <span className="text-gray-500">-</span>
                <input
                  type="number"
                  value={filters.maxPrice}
                  onChange={(e) => handlePriceChange('maxPrice', e.target.value)}
                  placeholder="Max"
                  min="0"
                  className="w-full px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Disponibilité */}
      <div className="mb-6">
        <button
          onClick={() => toggleSection('stock')}
          className="flex items-center justify-between w-full text-left mb-2"
        >
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Disponibilité</span>
          {expandedSections.stock ? (
            <ChevronUpIcon className="h-4 w-4 text-gray-500" />
          ) : (
            <ChevronDownIcon className="h-4 w-4 text-gray-500" />
          )}
        </button>
        
        {expandedSections.stock && (
          <div className="space-y-2 mt-2">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={filters.inStock}
                onChange={handleStockChange}
                className="form-checkbox text-primary-600 rounded"
              />
              <span className="text-sm text-gray-700 dark:text-gray-300">En stock uniquement</span>
            </label>
          </div>
        )}
      </div>

      {/* Filtres actifs */}
      {hasActiveFilters && (
        <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">Filtres actifs:</p>
          <div className="flex flex-wrap gap-2">
            {filters.category && (
              <span className="inline-flex items-center bg-primary-100 dark:bg-primary-900/30 text-primary-800 dark:text-primary-300 text-xs px-2 py-1 rounded">
                {filters.category}
                <button
                  onClick={() => handleCategoryChange('')}
                  className="ml-1 hover:text-primary-900"
                >
                  <XMarkIcon className="h-3 w-3" />
                </button>
              </span>
            )}
            {filters.minPrice && (
              <span className="inline-flex items-center bg-primary-100 dark:bg-primary-900/30 text-primary-800 dark:text-primary-300 text-xs px-2 py-1 rounded">
                Min: {filters.minPrice} FCFA
                <button
                  onClick={() => handlePriceChange('minPrice', '')}
                  className="ml-1 hover:text-primary-900"
                >
                  <XMarkIcon className="h-3 w-3" />
                </button>
              </span>
            )}
            {filters.maxPrice && (
              <span className="inline-flex items-center bg-primary-100 dark:bg-primary-900/30 text-primary-800 dark:text-primary-300 text-xs px-2 py-1 rounded">
                Max: {filters.maxPrice} FCFA
                <button
                  onClick={() => handlePriceChange('maxPrice', '')}
                  className="ml-1 hover:text-primary-900"
                >
                  <XMarkIcon className="h-3 w-3" />
                </button>
              </span>
            )}
            {filters.inStock && (
              <span className="inline-flex items-center bg-primary-100 dark:bg-primary-900/30 text-primary-800 dark:text-primary-300 text-xs px-2 py-1 rounded">
                En stock
                <button
                  onClick={() => onFilterChange({ ...filters, inStock: false })}
                  className="ml-1 hover:text-primary-900"
                >
                  <XMarkIcon className="h-3 w-3" />
                </button>
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  )
}