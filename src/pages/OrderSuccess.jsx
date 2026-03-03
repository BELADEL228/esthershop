import React from 'react'
import { Link, useParams } from 'react-router-dom'
import { CheckCircleIcon } from '@heroicons/react/24/outline'

export const OrderSuccess = () => {
  const { id } = useParams()

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
      <div className="text-center max-w-md">
        <CheckCircleIcon className="h-24 w-24 text-green-500 mx-auto mb-4" />
        <h1 className="text-3xl font-bold mb-2">Merci pour votre commande !</h1>
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          Votre commande #{id?.slice(0, 8)} a bien été enregistrée.
        </p>
        <p className="text-gray-600 dark:text-gray-400 mb-8">
          Vous serez livré dans les plus brefs délais. Un email de confirmation vous a été envoyé.
        </p>
        <div className="space-y-3">
          <Link
            to="/orders"
            className="block w-full bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
          >
            Voir mes commandes
          </Link>
          <Link
            to="/products"
            className="block w-full bg-gray-200 text-gray-800 px-6 py-3 rounded-lg hover:bg-gray-300"
          >
            Continuer mes achats
          </Link>
        </div>
      </div>
    </div>
  )
}