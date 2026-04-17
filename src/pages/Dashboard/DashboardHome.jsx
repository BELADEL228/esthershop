import React, { useEffect, useState } from 'react'
import { ordersApi } from '../../services/api/orders'
import { productsApi } from '../../services/api/products'
import { usersApi } from '../../services/api/users'
import { usePrice } from '../../hooks/usePrice'
import { RevenueChart } from './RevenueChart'
import { OrdersPieChart } from './OrdersPieChart'
import {
  CurrencyEuroIcon,
  ShoppingBagIcon,
  UsersIcon,
  ChartBarIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon
} from '@heroicons/react/24/outline'

export const DashboardHome = () => {
  const formatPrice = usePrice()
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalRevenue: 0,
    totalProducts: 0,
    totalUsers: 0,
    recentOrders: [],
    revenueEvolution: 0,
    previousRevenue: 0
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

      const deliveredOrders = orders.filter(order => order.status === 'delivered')
      const totalRevenue = deliveredOrders.reduce((sum, order) => sum + order.total, 0)
      
      const now = new Date()
      const currentMonth = now.getMonth()
      const currentYear = now.getFullYear()
      
      const currentMonthOrders = deliveredOrders.filter(order => {
        const date = new Date(order.created_at)
        return date.getMonth() === currentMonth && date.getFullYear() === currentYear
      })
      
      const previousMonthOrders = deliveredOrders.filter(order => {
        const date = new Date(order.created_at)
        const prevMonth = currentMonth === 0 ? 11 : currentMonth - 1
        const prevYear = currentMonth === 0 ? currentYear - 1 : currentYear
        return date.getMonth() === prevMonth && date.getFullYear() === prevYear
      })

      const currentRevenue = currentMonthOrders.reduce((sum, order) => sum + order.total, 0)
      const previousRevenue = previousMonthOrders.reduce((sum, order) => sum + order.total, 0)
      
      const revenueEvolution = previousRevenue > 0 
        ? ((currentRevenue - previousRevenue) / previousRevenue * 100).toFixed(1)
        : 100

      const recentOrders = orders.slice(0, 5)

      setStats({
        totalOrders: orders.length,
        totalRevenue,
        totalProducts: products.length,
        totalUsers: users.length,
        recentOrders,
        revenueEvolution,
        previousRevenue
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
      bgColor: 'bg-green-500',
      evolution: stats.revenueEvolution,
      comparison: `vs. mois précédent`
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
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Tableau de bord</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card, index) => (
          <div key={index} className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 dark:text-gray-400 text-sm">{card.name}</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{card.value}</p>
                {card.evolution && (
                  <div className="flex items-center mt-2 text-sm">
                    {card.evolution > 0 ? (
                      <>
                        <ArrowTrendingUpIcon className="h-4 w-4 text-green-500 mr-1" />
                        <span className="text-green-600">+{card.evolution}%</span>
                      </>
                    ) : card.evolution < 0 ? (
                      <>
                        <ArrowTrendingDownIcon className="h-4 w-4 text-red-500 mr-1" />
                        <span className="text-red-600">{card.evolution}%</span>
                      </>
                    ) : null}
                    <span className="text-gray-400 dark:text-gray-500 text-xs ml-2">{card.comparison}</span>
                  </div>
                )}
              </div>
              <div className={`${card.bgColor} p-3 rounded-lg`}>
                <card.icon className="h-6 w-6 text-white" />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RevenueChart />
        <OrdersPieChart />
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Commandes récentes</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="text-left py-3 px-4 text-gray-600 dark:text-gray-400">ID</th>
                <th className="text-left py-3 px-4 text-gray-600 dark:text-gray-400">Date</th>
                <th className="text-left py-3 px-4 text-gray-600 dark:text-gray-400">Client</th>
                <th className="text-left py-3 px-4 text-gray-600 dark:text-gray-400">Total</th>
                <th className="text-left py-3 px-4 text-gray-600 dark:text-gray-400">Statut</th>
              </tr>
            </thead>
            <tbody>
              {stats.recentOrders.map((order) => (
                <tr key={order.id} className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="py-3 px-4 font-mono text-gray-900 dark:text-white">#{order.id.slice(0, 8)}</td>
                  <td className="py-3 px-4 text-gray-700 dark:text-gray-300">{new Date(order.created_at).toLocaleDateString()}</td>
                  <td className="py-3 px-4 text-gray-700 dark:text-gray-300">{order.shipping_address?.firstName} {order.shipping_address?.lastName || 'N/A'}</td>
                  <td className="py-3 px-4 font-medium text-gray-900 dark:text-white">{formatPrice(order.total)}</td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      order.status === 'delivered' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' :
                      order.status === 'pending' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400' :
                      order.status === 'processing' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400' :
                      order.status === 'shipped' ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400' :
                      order.status === 'cancelled' ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400' :
                      'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
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