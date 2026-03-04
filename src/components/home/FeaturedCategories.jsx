import React from 'react'
import { Link } from 'react-router-dom'

const categories = [
  {
    name: 'Électronique',
    image: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=600',
    count: 150,
    slug: 'electronique'
  },
  {
    name: 'Vêtements',
    image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=600',
    count: 230,
    slug: 'vetements'
  },
  {
    name: 'Parfum',
    image: 'https://images.unsplash.com/photo-1484101403633-562f891dc89a?w=600',
    count: 180,
    slug: 'parfum'
  },
  {
    name: 'Sport',
    image: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=600',
    count: 95,
    slug: 'sport'
  }
]

export const FeaturedCategories = () => {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-4">Catégories Populaires</h2>
        <p className="text-gray-600 text-center mb-12 max-w-2xl mx-auto">
          Explorez nos différentes catégories et trouvez ce que vous cherchez
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category) => (
            <Link
              key={category.slug}
              to={`/products?category=${category.slug}`}
              className="group relative h-64 overflow-hidden rounded-lg"
            >
              <img
                src={category.image}
                alt={category.name}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-black bg-opacity-40 group-hover:bg-opacity-50 transition-all" />
              <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
                <h3 className="text-2xl font-bold mb-2">{category.name}</h3>
                <p className="text-lg">{category.count} produits</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}