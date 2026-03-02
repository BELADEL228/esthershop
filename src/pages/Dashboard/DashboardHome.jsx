import React, { useEffect, useState } from 'react'
import { ordersApi } from '../../services/api/orders'
import { productsApi } from '../../services/api/products'
import { usersApi } from '../../services/api/users'
import { formatPrice } from '../../utils/helpers'
import {
  CurrencyEuroIcon,
  ShoppingBagIcon,
  UsersIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline'

export const DashboardHome = () => {
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalRevenue: 0,
    totalProducts: 0,
    totalUsers: 0,
    recentOrders: []
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    try {
      const [orders, products, users] = await Promise.all([
        ordersApi.getAll(),
        productsApi.getAll(),
        usersApi.getAll()
      ])

      const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0)
      const recentOrders = orders.slice(0, 5)

      setStats({
        totalOrders: orders.length,
        totalRevenue,
        totalProducts: products.length,
        totalUsers: users.length,
        recentOrders
      })
    } catch (error) {
      console.error('Erreur chargement dashboard:', error)
    } finally {
      setLoading(false)
    }
  }

  const cards = [
    {
      name: 'Chiffre d\'affaires',
      value: formatPrice(stats.totalRevenue),
      icon: CurrencyEuroIcon,
      bgColor: 'bg-green-500'
    },
    {
      name: 'Commandes',
      value: stats.totalOrders,
      icon: ShoppingBagIcon,
      bgColor: 'bg-blue-500'
    },
    {
      name: 'Produits',
      value: stats.totalProducts,
      icon: ChartBarIcon,
      bgColor: 'bg-purple-500'
    },
    {
      name: 'Utilisateurs',
      value: stats.totalUsers,
      icon: UsersIcon,
      bgColor: 'bg-yellow-500'
    }
  ]

  if (loading) {
    return <div>Chargement...</div>
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Tableau de bord</h1>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {cards.map((card) => (
          <div key={card.name} className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">{card.name}</p>
                <p className="text-2xl font-bold mt-1">{card.value}</p>
              </div>
              <div className={`${card.bgColor} p-3 rounded-lg`}>
                <card.icon className="h-6 w-6 text-white" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Commandes récentes */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Commandes récentes</h2>
        
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3 px-4">ID</th>
                <th className="text-left py-3 px-4">Date</th>
                <th className="text-left py-3 px-4">Client</th>
                <th className="text-left py-3 px-4">Total</th>
                <th className="text-left py-3 px-4">Statut</th>
              </tr>
            </thead>
            <tbody>
              {stats.recentOrders.map((order) => (
                <tr key={order.id} className="border-b hover:bg-gray-50">
                  <td className="py-3 px-4">#{order.id.slice(0, 8)}</td>
                  <td className="py-3 px-4">
                    {new Date(order.created_at).toLocaleDateString()}
                  </td>
                  <td className="py-3 px-4">{order.user_email || 'N/A'}</td>
                  <td className="py-3 px-4">{formatPrice(order.total)}</td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                      order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {order.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}