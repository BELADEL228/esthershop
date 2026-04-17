import React, { useEffect, useState } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';
import { ordersApi } from '../../services/api/orders';
import { usePrice } from '../../hooks/usePrice';

export const RevenueChart = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const formatPrice = usePrice();

  useEffect(() => {
    loadChartData();
  }, []);

  const loadChartData = async () => {
    try {
      const orders = await ordersApi.getAll();
      
      const monthlyData = {};
      
      orders
        .filter(order => order.status === 'delivered')
        .forEach(order => {
          const date = new Date(order.created_at);
          const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
          const monthName = date.toLocaleDateString('fr-FR', { month: 'short', year: 'numeric' });
          
          if (!monthlyData[monthKey]) {
            monthlyData[monthKey] = {
              month: monthName,
              revenue: 0,
              orders: 0
            };
          }
          monthlyData[monthKey].revenue += order.total;
          monthlyData[monthKey].orders += 1;
        });

      const sortedData = Object.keys(monthlyData)
        .sort()
        .map(key => monthlyData[key]);

      setData(sortedData);
    } catch (error) {
      console.error('Erreur chargement données graphique:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="h-64 bg-gray-100 dark:bg-gray-700 animate-pulse rounded-lg"></div>;
  }

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        Évolution du chiffre d'affaires
      </h3>
      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" strokeOpacity={0.5} />
          <XAxis dataKey="month" tick={{ fill: '#6b7280' }} />
          <YAxis
            tickFormatter={(value) => formatPrice(value)}
            tick={{ fill: '#6b7280' }}
          />
          <Tooltip
            formatter={(value) => [formatPrice(value), 'Chiffre d\'affaires']}
            labelFormatter={(label) => `Mois: ${label}`}
            contentStyle={{
              backgroundColor: 'white',
              borderColor: '#e5e7eb',
              borderRadius: '0.5rem',
              boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)'
            }}
            itemStyle={{ color: '#1f2937' }}
          />
          <Legend wrapperStyle={{ color: '#4b5563' }} />
          <Area
            type="monotone"
            dataKey="revenue"
            stroke="#4f46e5"
            fill="#4f46e5"
            fillOpacity={0.2}
            strokeWidth={2}
            name="Chiffre d'affaires"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};