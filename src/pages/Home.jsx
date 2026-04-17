import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { productsApi } from '../services/api/products'
import { ProductCard } from '../components/products/ProductCard'
import { HeroSection } from '../components/home/HeroSection'
import { FeaturedCategories } from '../components/home/FeaturedCategories'
import { NewsletterSection } from '../components/home/NewsLetterSection' // Correction de la casse
import { LoadingSpinner } from '../components/common/LoadingSpinner'

export const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadHomeData()
  }, [])

  const loadHomeData = async () => {
    try {
      const products = await productsApi.getAll()
      setFeaturedProducts(products.slice(0, 8))
    } catch (error) {
      console.error('Erreur chargement home:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <LoadingSpinner />

  return (
    <div className="min-h-screen">
      <HeroSection />
      <FeaturedCategories />

      <section className="py-16 bg-gray-50 dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-4">
            Nos Produits Vedettes
          </h2>
          <p className="text-gray-600 dark:text-gray-400 text-center mb-12 max-w-2xl mx-auto">
            Découvrez notre sélection de produits les plus populaires
          </p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          
          <div className="text-center mt-10">
            <Link 
              to="/products" 
              className="inline-block bg-primary-600 text-white px-8 py-3 rounded-lg hover:bg-primary-700 transition-colors"
            >
              Voir tous les produits
            </Link>
          </div>
        </div>
      </section>

      <section className="py-16 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-primary-100 dark:bg-primary-900/20 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-10 h-10 text-primary-600 dark:text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Qualité Garantie</h3>
              <p className="text-gray-600 dark:text-gray-400">Tous nos produits sont soigneusement sélectionnés</p>
            </div>
            
            <div className="text-center">
              <div className="bg-primary-100 dark:bg-primary-900/20 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-10 h-10 text-primary-600 dark:text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Livraison Rapide</h3>
              <p className="text-gray-600 dark:text-gray-400">Livraison en 24/48h partout au Togo</p>
            </div>
            
            <div className="text-center">
              <div className="bg-primary-100 dark:bg-primary-900/20 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-10 h-10 text-primary-600 dark:text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Paiement Sécurisé</h3>
              <p className="text-gray-600 dark:text-gray-400">Paiement 100% sécurisé</p>
            </div>
          </div>
        </div>
      </section>

      <NewsletterSection />
    </div>
  )
}