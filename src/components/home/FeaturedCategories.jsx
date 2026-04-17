import React from 'react'
import { Link } from 'react-router-dom'

const categories = [
  {
    name: 'Chaussures',
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600',
    count: 24,
    slug: 'chaussures'
  },
  {
    name: 'Maillots',
    image: 'https://images.unsplash.com/photo-1580060839135-3a7e15f7fbcf?w=600',
    count: 32,
    slug: 'maillots'
  },
  {
    name: 'Ballons',
    image: 'https://images.unsplash.com/photo-1519861155730-0b5fbf0dd889?w=600',
    count: 12,
    slug: 'ballons'
  },
  {
    name: 'Accessoires',
    image: 'https://images.unsplash.com/photo-1574623452334-1e0ac2b3ccb4?w=600',
    count: 18,
    slug: 'accessoires'
  }
]

export const FeaturedCategories = () => {
  return (
    <section className="py-16 bg-gray-50 dark:bg-gray-800">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">
            Nos catégories
          </h2>
          <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Découvrez notre sélection d'équipements de basketball
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category) => (
            <Link
              key={category.slug}
              to={`/products?category=${category.slug}`}
              className="group relative overflow-hidden rounded-xl bg-white dark:bg-gray-900 shadow-md hover:shadow-xl transition-all duration-300"
            >
              <div className="aspect-[4/3] overflow-hidden">
                <img
                  src={category.image}
                  alt={category.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div className="p-4 text-center">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-1">
                  {category.name}
                </h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm">
                  {category.count} produits
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}