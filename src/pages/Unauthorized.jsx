// src/pages/Unauthorized.jsx
import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { ShieldExclamationIcon } from '@heroicons/react/24/outline'

export const Unauthorized = () => {
  const location = useLocation()
  const from = location.state?.from?.pathname || '/' //eslint-disable-line no-unused-vars

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
      <div className="text-center">
        <ShieldExclamationIcon className="h-24 w-24 mx-auto text-red-500 mb-4" />
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Accès non autorisé
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mb-8">
          Vous n'avez pas les permissions nécessaires pour accéder à cette page.
        </p>
        <Link
          to="/"
          className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
        >
          Retour à l'accueil
        </Link>
      </div>
    </div>
  )
}