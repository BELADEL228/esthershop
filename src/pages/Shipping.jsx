import React from 'react'
import { 
  TruckIcon, 
  ClockIcon, 
  BanknotesIcon,
  GlobeAltIcon 
} from '@heroicons/react/24/outline'

export const Shipping = () => {
  const shippingMethods = [
    {
      name: 'Livraison Standard',
      delay: '3-5 jours ouvrés',
      price: '3 000 FCFA',
      free: 'Gratuite dès 35 000 FCFA',
      icon: TruckIcon
    },
    {
      name: 'Livraison Express',
      delay: '24-48h',
      price: '6 500 FCFA',
      free: null,
      icon: ClockIcon
    },
    {
      name: 'Point Relais',
      delay: '3-5 jours ouvrés',
      price: '2 500 FCFA',
      free: 'Gratuite dès 20 000 FCFA',
      icon: GlobeAltIcon
    }
  ]

  const countries = [
    'Sénégal',
    'Côte d\'Ivoire',
    'Cameroun',
    'Bénin',
    'Togo',
    'Mali',
    'Burkina Faso',
    'Gabon'
  ]

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-center text-gray-900 dark:text-white mb-4">
        Livraison
      </h1>
      <p className="text-xl text-gray-600 dark:text-gray-400 text-center mb-12">
        Toutes les informations sur nos modes de livraison
      </p>

      {/* Méthodes de livraison */}
      <div className="grid md:grid-cols-3 gap-6 mb-12">
        {shippingMethods.map((method, index) => (
          <div
            key={index}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 text-center border border-gray-200 dark:border-gray-700"
          >
            <div className="bg-primary-100 dark:bg-primary-900/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <method.icon className="h-8 w-8 text-primary-600 dark:text-primary-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">{method.name}</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-2">
              Délai: {method.delay}
            </p>
            <p className="text-2xl font-bold text-primary-600 dark:text-primary-400 mb-2">
              {method.price}
            </p>
            {method.free && (
              <p className="text-sm text-green-600 dark:text-green-400">
                {method.free}
              </p>
            )}
          </div>
        ))}
      </div>

      {/* Zones de livraison */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8 border border-gray-200 dark:border-gray-700">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">Zones de livraison</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          {countries.map((country, index) => (
            <div key={index} className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-gray-700 dark:text-gray-300">{country}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Informations complémentaires */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Suivi de colis</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Une fois votre commande expédiée, vous recevrez un email avec un numéro de suivi. 
            Vous pouvez également suivre vos colis depuis votre espace client.
          </p>
          <div className="bg-primary-50 dark:bg-primary-900/20 p-4 rounded-lg">
            <p className="text-sm text-primary-800 dark:text-primary-200">
              💡 Tous nos colis sont assurés et suivis
            </p>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Questions fréquentes</h2>
          <ul className="space-y-3 text-gray-600 dark:text-gray-400">
            <li>• Puis-je modifier mon adresse de livraison ?</li>
            <li>• Que faire si je ne suis pas chez moi ?</li>
            <li>• Comment contacter le transporteur ?</li>
            <li>• Les livraisons sont-elles assurées ?</li>
          </ul>
          <a
            href="/faq"
            className="inline-block mt-4 text-primary-600 dark:text-primary-400 hover:underline"
          >
            Voir la FAQ →
          </a>
        </div>
      </div>
    </div>
  )
}