import React, { useState } from 'react'
import { useOrders } from '../../hooks/useOrders'
import { formatPrice, formatDate } from '../../utils/helpers'
import { ORDER_STATUS } from '../../utils/constants'
import { 
  ShoppingBagIcon, 
  EyeIcon,
  TruckIcon,
  CheckCircleIcon,
  XCircleIcon,
  BanknotesIcon,
  MapPinIcon,
  UserIcon,
  CalendarIcon
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
      toast.success(`Statut mis à jour : ${ORDER_STATUS[newStatus]}`)
    }
  }

  const getStatusBadgeColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      processing: 'bg-blue-100 text-blue-800',
      shipped: 'bg-purple-100 text-purple-800',
      delivered: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800'
    }
    return colors[status] || 'bg-gray-100 text-gray-800'
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Gestion des commandes</h1>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Total commandes</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.total}</p>
            </div>
            <div className="bg-blue-100 dark:bg-blue-900/20 p-3 rounded-lg">
              <ShoppingBagIcon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">En attente</p>
              <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
            </div>
            <div className="bg-yellow-100 dark:bg-yellow-900/20 p-3 rounded-lg">
              <XCircleIcon className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Livrées</p>
              <p className="text-2xl font-bold text-green-600">{stats.delivered}</p>
            </div>
            <div className="bg-green-100 dark:bg-green-900/20 p-3 rounded-lg">
              <CheckCircleIcon className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Chiffre d'affaires</p>
              <p className="text-2xl font-bold text-blue-600">{formatPrice(stats.revenue)}</p>
            </div>
            <div className="bg-blue-100 dark:bg-blue-900/20 p-3 rounded-lg">
              <BanknotesIcon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Filtres */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div className="flex items-center space-x-2">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Filtrer par statut :
          </label>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="px-3 py-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700 focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">Toutes les commandes</option>
            {Object.entries(ORDER_STATUS).map(([value, label]) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </select>
        </div>
        <p className="text-sm text-gray-500">
          {filteredOrders.length} commande(s) trouvée(s)
        </p>
      </div>

      {/* Tableau des commandes */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden border border-gray-200 dark:border-gray-700">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-900">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Commande
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Client
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Total
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Statut
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {filteredOrders.map((order) => (
                <React.Fragment key={order.id}>
                  <tr className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-3">
                        <div className="bg-blue-100 dark:bg-blue-900/20 p-2 rounded-lg">
                          <ShoppingBagIcon className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                        </div>
                        <span className="font-mono font-medium">#{order.id.slice(0, 8)}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-3">
                        <UserIcon className="h-4 w-4 text-gray-400" />
                        <span className="text-sm">
                          {order.shipping_address?.firstName} {order.shipping_address?.lastName}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-3">
                        <CalendarIcon className="h-4 w-4 text-gray-400" />
                        <span className="text-sm">{formatDate(order.created_at)}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="font-bold text-blue-600 dark:text-blue-400">
                        {formatPrice(order.total)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <select
                        value={order.status}
                        onChange={(e) => handleStatusChange(order.id, e.target.value)}
                        className={`px-2 py-1 rounded-lg text-sm font-medium ${getStatusBadgeColor(order.status)} border-0 focus:ring-2 focus:ring-blue-500`}
                      >
                        {Object.entries(ORDER_STATUS).map(([value, label]) => (
                          <option key={value} value={value}>{label}</option>
                        ))}
                      </select>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => setSelectedOrder(selectedOrder?.id === order.id ? null : order)}
                        className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 p-2 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
                      >
                        <EyeIcon className="h-5 w-5" />
                      </button>
                    </td>
                  </tr>

                  {/* Détails de la commande */}
                  {selectedOrder?.id === order.id && (
                    <tr className="bg-gray-50 dark:bg-gray-900">
                      <td colSpan="6" className="px-6 py-4">
                        <div className="grid md:grid-cols-3 gap-6">
                          {/* Informations client */}
                          <div>
                            <h4 className="font-semibold mb-2 flex items-center space-x-2">
                              <UserIcon className="h-4 w-4" />
                              <span>Client</span>
                            </h4>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              {order.shipping_address?.firstName} {order.shipping_address?.lastName}<br />
                              {order.shipping_address?.phone}
                            </p>
                          </div>

                          {/* Adresse de livraison */}
                          <div>
                            <h4 className="font-semibold mb-2 flex items-center space-x-2">
                              <MapPinIcon className="h-4 w-4" />
                              <span>Adresse</span>
                            </h4>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              {order.shipping_address?.address}<br />
                              {order.shipping_address?.city}
                            </p>
                          </div>

                          {/* Paiement */}
                          <div>
                            <h4 className="font-semibold mb-2 flex items-center space-x-2">
                              <BanknotesIcon className="h-4 w-4" />
                              <span>Paiement</span>
                            </h4>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              {order.payment_method === 'cash_on_delivery' ? 'À la livraison' : 'En ligne'}<br />
                              Statut: {order.payment_status === 'paid' ? 'Payé' : 'En attente'}
                            </p>
                          </div>

                          {/* Articles commandés */}
                          <div className="md:col-span-3">
                            <h4 className="font-semibold mb-2">Articles</h4>
                            <div className="bg-white dark:bg-gray-800 rounded-lg border divide-y">
                              {order.items?.map((item, index) => (
                                <div key={index} className="flex justify-between p-3 text-sm">
                                  <span>{item.name} x {item.quantity}</span>
                                  <span className="font-medium">{formatPrice(item.price * item.quantity)}</span>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Instructions de livraison */}
                          {order.shipping_address?.deliveryNotes && (
                            <div className="md:col-span-3">
                              <h4 className="font-semibold mb-1">Instructions</h4>
                              <p className="text-sm text-gray-600 dark:text-gray-400 italic">
                                "{order.shipping_address.deliveryNotes}"
                              </p>
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>

        {filteredOrders.length === 0 && (
          <div className="text-center py-12">
            <ShoppingBagIcon className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <p className="text-gray-600 dark:text-gray-400">
              Aucune commande trouvée
            </p>
          </div>
        )}
      </div>
    </div>
  )
}