import React, { useState } from 'react'
import { useOrders } from '../../hooks/useOrders'
import { formatPrice, formatDate } from '../../utils/helpers'
import { ORDER_STATUS } from '../../utils/constants'
import { 
  ShoppingBagIcon, 
  EyeIcon,
  TruckIcon,
  CheckCircleIcon,
  XCircleIcon
} from '@heroicons/react/24/outline'
import toast from 'react-hot-toast'

export const OrdersManagement = () => {
  const { orders, loading, stats, updateOrderStatus, refreshOrders } = useOrders()
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [filter, setFilter] = useState('all')

  const filteredOrders = filter === 'all' 
    ? orders 
    : orders.filter(o => o.status === filter)

  const handleStatusChange = async (orderId, newStatus) => {
    const result = await updateOrderStatus(orderId, newStatus)
    if (result.success) {
      refreshOrders()
    }
  }

  if (loading) {
    return <div className="flex justify-center p-8">Chargement...</div>
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Gestion des commandes</h1>

      {/* Statistiques */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-4 rounded-lg shadow">
          <p className="text-sm text-gray-600">Total</p>
          <p className="text-2xl font-bold">{stats.total}</p>
        </div>
        <div className="bg-yellow-50 p-4 rounded-lg shadow">
          <p className="text-sm text-yellow-600">En attente</p>
          <p className="text-2xl font-bold text-yellow-700">{stats.pending}</p>
        </div>
        <div className="bg-green-50 p-4 rounded-lg shadow">
          <p className="text-sm text-green-600">Livrées</p>
          <p className="text-2xl font-bold text-green-700">{stats.delivered}</p>
        </div>
        <div className="bg-blue-50 p-4 rounded-lg shadow">
          <p className="text-sm text-blue-600">Chiffre d'affaires</p>
          <p className="text-2xl font-bold text-blue-700">{formatPrice(stats.revenue)}</p>
        </div>
      </div>

      {/* Filtres */}
      <select
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
        className="mb-4 px-4 py-2 border rounded"
      >
        <option value="all">Toutes les commandes</option>
        {Object.entries(ORDER_STATUS).map(([value, label]) => (
          <option key={value} value={value}>{label}</option>
        ))}
      </select>

      {/* Tableau */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left">Commande</th>
              <th className="px-6 py-3 text-left">Client</th>
              <th className="px-6 py-3 text-left">Date</th>
              <th className="px-6 py-3 text-left">Total</th>
              <th className="px-6 py-3 text-left">Statut</th>
              <th className="px-6 py-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.map(order => (
              <tr key={order.id} className="border-t hover:bg-gray-50">
                <td className="px-6 py-4">#{order.id.slice(0, 8)}</td>
                <td className="px-6 py-4">
                  {order.shipping_address?.firstName} {order.shipping_address?.lastName}
                </td>
                <td className="px-6 py-4">{formatDate(order.created_at)}</td>
                <td className="px-6 py-4 font-bold">{formatPrice(order.total)}</td>
                <td className="px-6 py-4">
                  <select
                    value={order.status}
                    onChange={(e) => handleStatusChange(order.id, e.target.value)}
                    className="px-2 py-1 border rounded text-sm"
                  >
                    {Object.entries(ORDER_STATUS).map(([value, label]) => (
                      <option key={value} value={value}>{label}</option>
                    ))}
                  </select>
                </td>
                <td className="px-6 py-4">
                  <button
                    onClick={() => setSelectedOrder(order)}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    <EyeIcon className="h-5 w-5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}