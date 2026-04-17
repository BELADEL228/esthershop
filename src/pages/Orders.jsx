import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useOrders } from '../hooks/useOrders'
import { usePrice } from '../hooks/usePrice'
import { formatDate } from '../utils/helpers'
import { ORDER_STATUS } from '../utils/constants'
import { 
  ShoppingBagIcon, 
  CalendarIcon, 
  CurrencyEuroIcon,
  TruckIcon,
  EyeIcon,
  XCircleIcon,
  BanknotesIcon
} from '@heroicons/react/24/outline'

export const Orders = () => {
  const { orders, loading, cancelOrder } = useOrders()
  const formatPrice = usePrice()
  const [selectedOrder, setSelectedOrder] = useState(null)

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
      processing: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
      shipped: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
      delivered: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      cancelled: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
    }
    return colors[status] || 'bg-gray-100 text-gray-800'
  }

  const handleCancelOrder = async (orderId) => {
    if (window.confirm('Êtes-vous sûr de vouloir annuler cette commande ?')) {
      await cancelOrder(orderId)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  if (orders.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <ShoppingBagIcon className="h-24 w-24 mx-auto text-gray-400 dark:text-gray-500 mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Aucune commande</h2>
        <p className="text-gray-600 dark:text-gray-400 mb-8">Vous n'avez pas encore passé de commande</p>
        <Link to="/products" className="inline-block bg-primary-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors">
          Découvrir nos produits
        </Link>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Mes Commandes</h1>

      <div className="space-y-4">
        {orders.map((order) => (
          <div key={order.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden border border-gray-200 dark:border-gray-700">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="flex items-center space-x-4">
                  <div className="bg-primary-100 dark:bg-primary-900/20 p-2 rounded-lg">
                    <ShoppingBagIcon className="h-5 w-5 text-primary-600 dark:text-primary-400" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Commande</p>
                    <p className="font-mono font-semibold text-gray-900 dark:text-white">#{order.id.slice(0, 8)}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <CalendarIcon className="h-5 w-5 text-gray-400" />
                    <span className="text-sm text-gray-600 dark:text-gray-400">{formatDate(order.created_at)}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CurrencyEuroIcon className="h-5 w-5 text-gray-400" />
                    <span className="font-semibold text-primary-600 dark:text-primary-400">{formatPrice(order.total)}</span>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(order.status)}`}>
                    {ORDER_STATUS[order.status] || order.status}
                  </span>
                  
                  <button
                    onClick={() => setSelectedOrder(selectedOrder?.id === order.id ? null : order)}
                    className="text-primary-600 hover:text-primary-800 dark:text-primary-400 dark:hover:text-primary-300 transition-colors"
                  >
                    <EyeIcon className="h-5 w-5" />
                  </button>

                  {order.status === 'pending' && (
                    <button
                      onClick={() => handleCancelOrder(order.id)}
                      className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 transition-colors"
                      title="Annuler la commande"
                    >
                      <XCircleIcon className="h-5 w-5" />
                    </button>
                  )}
                </div>
              </div>
            </div>

            {selectedOrder?.id === order.id && (
              <div className="p-6 bg-gray-50 dark:bg-gray-900">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Détails de la commande</h3>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                      Adresse de livraison
                    </h4>
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                      {order.shipping_address?.firstName} {order.shipping_address?.lastName}<br />
                      {order.shipping_address?.address}<br />
                      {order.shipping_address?.city}<br />
                      Tél: {order.shipping_address?.phone}
                    </p>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                      Paiement
                    </h4>
                    <div className="flex items-center space-x-2 text-sm">
                      <BanknotesIcon className="h-5 w-5 text-green-600" />
                      <span className="text-gray-700 dark:text-gray-300">
                        Paiement à la livraison •{' '}
                        {order.payment_status === 'paid' ? 'Payé' : 'À payer à la réception'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-4">
                  <h4 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                    Articles
                  </h4>
                  <div className="space-y-2">
                    {order.order_items?.map((item, index) => (
                      <div key={index} className="flex justify-between text-sm">
                        <span className="text-gray-700 dark:text-gray-300">
                          {item.product?.name || "Produit indisponible"} x {item.quantity}
                        </span>
                        <span className="font-medium text-gray-900 dark:text-white">
                          {formatPrice(item.price * item.quantity)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {order.status === 'shipped' && (
                  <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                    <div className="flex items-center space-x-2 text-green-600 dark:text-green-400">
                      <TruckIcon className="h-5 w-5" />
                      <span className="text-sm font-medium">Votre commande a été expédiée</span>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}