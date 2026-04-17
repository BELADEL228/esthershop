import React, { useState } from 'react'
import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import {
  HomeIcon,
  ShoppingBagIcon,
  UsersIcon,
  Cog6ToothIcon,
  ArrowLeftOnRectangleIcon,
  ChartBarIcon,
  EnvelopeIcon,
  ChatBubbleLeftRightIcon
} from '@heroicons/react/24/outline'
import toast from 'react-hot-toast'

const navigation = [
  { name: 'Tableau de bord', to: '/dashboard', icon: HomeIcon },
  { name: 'Produits', to: '/dashboard/products', icon: ShoppingBagIcon },
  { name: 'Commandes', to: '/dashboard/orders', icon: ChartBarIcon },
  { name: 'Utilisateurs', to: '/dashboard/users', icon: UsersIcon },
  { name: 'Messages', to: '/dashboard/messages', icon: ChatBubbleLeftRightIcon },
  { name: 'Newsletter', to: '/dashboard/newsletter', icon: EnvelopeIcon },
  { name: 'Paramètres', to: '/dashboard/settings', icon: Cog6ToothIcon }
]

export const DashboardLayout = () => {
  const { signOut, user } = useAuth()
  const navigate = useNavigate()
  const [showNewsletter, setShowNewsletter] = useState(false)

  const handleSignOut = async () => {
    await signOut()
    navigate('/')
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      {/* Sidebar */}
      <div className="fixed inset-y-0 left-0 w-64 bg-white dark:bg-gray-800 shadow-lg border-r border-gray-200 dark:border-gray-700">
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <h1 className="text-2xl font-bold text-primary-600 dark:text-primary-400">
              Jenny Shop
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Administration
            </p>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 overflow-y-auto">
            <ul className="space-y-2">
              {navigation.map((item) => (
                <li key={item.name}>
                  <NavLink
                    to={item.to}
                    end={item.to === '/dashboard'}
                    className={({ isActive }) =>
                      `flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                        isActive
                          ? 'bg-primary-600 text-white shadow-md'
                          : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                      }`
                    }
                  >
                    <item.icon className="h-5 w-5" />
                    <span className="text-sm font-medium">{item.name}</span>
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>

          {/* User info & Logout */}
          <div className="p-4 border-t border-gray-200 dark:border-gray-700">
            <div className="mb-4">
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Connecté en tant que
              </p>
              <p className="font-semibold text-sm truncate text-gray-900 dark:text-white">
                {user?.email}
              </p>
              <p className="text-xs text-green-600 dark:text-green-400 mt-1">
                Administrateur
              </p>
            </div>
            <button
              onClick={handleSignOut}
              className="flex items-center space-x-3 text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 w-full px-4 py-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
            >
              <ArrowLeftOnRectangleIcon className="h-5 w-5" />
              <span className="text-sm font-medium">Déconnexion</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="ml-64 p-8">
        {/* Header avec boutons d'action */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Dashboard
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Gérez votre boutique en toute simplicité
            </p>
          </div>
          
          {/* Bouton newsletter (optionnel) */}
          <button
            onClick={() => setShowNewsletter(!showNewsletter)}
            className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors flex items-center space-x-2 text-sm"
          >
            <EnvelopeIcon className="h-4 w-4" />
            <span>{showNewsletter ? 'Masquer' : 'Afficher'} la newsletter</span>
          </button>
        </div>

        {/* Newsletter Section (visible conditionnellement) */}
        {showNewsletter && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-primary-600 dark:text-primary-400">
                Gestion de la Newsletter
              </h2>
              <span className="bg-primary-100 dark:bg-primary-900/30 text-primary-800 dark:text-primary-300 text-xs px-3 py-1 rounded-full">
                Test
              </span>
            </div>
            
            <div className="bg-primary-50 dark:bg-primary-900/20 p-4 rounded-lg">
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
                💡 Cette section vous permet de gérer vos campagnes de newsletter.
              </p>
              <div className="flex space-x-3">
                <button
                  onClick={() => navigate('/dashboard/newsletter')}
                  className="bg-primary-600 text-white px-4 py-2 rounded hover:bg-primary-700 transition-colors text-sm"
                >
                  Gérer la newsletter
                </button>
                <button
                  onClick={() => toast.success('Fonctionnalité à venir!')}
                  className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition-colors text-sm"
                >
                  Envoyer un test
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Contenu principal de la page */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700">
          <Outlet />
        </div>
      </div>
    </div>
  )
}