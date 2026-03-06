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
import { formatPrice } from '../../utils/helpers';

export const RevenueChart = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadChartData();
  }, []);

  const loadChartData = async () => {
    try {
      const orders = await ordersApi.getAll();
      
      // Grouper les commandes par mois (uniquement les livrées)
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

      // Trier par date et convertir en tableau
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
    return <div className="h-64 bg-gray-100 animate-pulse rounded-lg"></div>;
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-lg font-semibold mb-4">Évolution du chiffre d'affaires</h3>
      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis tickFormatter={(value) => `${value.toLocaleString()} FCFA`} />
          <Tooltip 
            formatter={(value) => [`${value.toLocaleString()} FCFA`, 'Chiffre d\'affaires']}
            labelFormatter={(label) => `Mois: ${label}`}
          />
          <Legend />
          <Area
            type="monotone"
            dataKey="revenue"
            stroke="#3b82f6"
            fillOpacity={1}
            fill="url(#colorRevenue)"
            name="Chiffre d'affaires"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};