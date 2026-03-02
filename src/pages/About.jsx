import React from 'react'
import { Link } from 'react-router-dom'
import { 
  HeartIcon, 
  TruckIcon, 
  ShieldCheckIcon, 
  CurrencyEuroIcon 
} from '@heroicons/react/24/outline'

export const About = () => {
  const stats = [
    { label: 'Produits', value: '10,000+' },
    { label: 'Clients', value: '50,000+' },
    { label: 'Commandes', value: '100,000+' },
    { label: 'Années', value: '5' }
  ]

  const values = [
    {
      icon: HeartIcon,
      title: 'Passion',
      description: 'Nous sommes passionnés par ce que nous faisons et cela se ressent dans chaque produit que nous sélectionnons.'
    },
    {
      icon: TruckIcon,
      title: 'Rapidité',
      description: 'Livraison express partout au Togo pour vous satisfaire au plus vite.'
    },
    {
      icon: ShieldCheckIcon,
      title: 'Confiance',
      description: 'Paiement 100% sécurisé et service client disponible 7j/7.'
    },
    {
      icon: CurrencyEuroIcon,
      title: 'Prix justes',
      description: 'Les meilleurs prix du marché sans compromis sur la qualité.'
    }
  ]

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">À propos de nous</h1>
        <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
          Découvrez l'histoire d'E-Shop, votre destination shopping préférée
        </p>
      </div>

      {/* Histoire */}
      <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
        <div>
          <h2 className="text-3xl font-bold mb-4">Notre histoire</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Fondée en 2024, E-Shop est née d'une passion commune pour le shopping en ligne et le désir de rendre les achats plus accessibles à tous.
          </p>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Ce qui a commencé comme une petite boutique en ligne est devenu aujourd'hui une référence dans le e-commerce, avec des milliers de produits et des centaines de milliers de clients satisfaits.
          </p>
          <p className="text-gray-600 dark:text-gray-400">
            Notre mission : vous offrir la meilleure expérience shopping possible, avec des produits de qualité, des prix justes et un service client exceptionnel.
          </p>
        </div>
        <div className="bg-blue-100 dark:bg-blue-900/20 p-8 rounded-lg">
          <img 
            src="https://images.unsplash.com/photo-1556742502-ec7c0e9f34b1?w=600" 
            alt="Notre équipe"
            className="rounded-lg shadow-lg"
          />
        </div>
      </div>

      {/* Statistiques */}
      <div className="bg-blue-600 text-white rounded-lg p-8 mb-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {stats.map((stat, index) => (
            <div key={index}>
              <div className="text-3xl font-bold mb-2">{stat.value}</div>
              <div className="text-blue-100">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Valeurs */}
      <div className="mb-16">
        <h2 className="text-3xl font-bold text-center mb-12">Nos valeurs</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {values.map((value, index) => (
            <div key={index} className="text-center">
              <div className="bg-blue-100 dark:bg-blue-900/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <value.icon className="h-8 w-8 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-xl font-semibold mb-2">{value.title}</h3>
              <p className="text-gray-600 dark:text-gray-400">{value.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}