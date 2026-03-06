import React, { useEffect, useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { ordersApi } from '../../services/api/orders';

const COLORS = ['#FBBF24', '#3B82F6', '#8B5CF6', '#10B981', '#EF4444'];

export const OrdersPieChart = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const orders = await ordersApi.getAll();
      
      const statusCount = {
        pending: orders.filter(o => o.status === 'pending').length,
        processing: orders.filter(o => o.status === 'processing').length,
        shipped: orders.filter(o => o.status === 'shipped').length,
        delivered: orders.filter(o => o.status === 'delivered').length,
        cancelled: orders.filter(o => o.status === 'cancelled').length
      };

      const chartData = [
        { name: 'En attente', value: statusCount.pending, color: COLORS[0] },
        { name: 'En cours', value: statusCount.processing, color: COLORS[1] },
        { name: 'Expédiées', value: statusCount.shipped, color: COLORS[2] },
        { name: 'Livrées', value: statusCount.delivered, color: COLORS[3] },
        { name: 'Annulées', value: statusCount.cancelled, color: COLORS[4] }
      ].filter(item => item.value > 0);

      setData(chartData);
    } catch (error) {
      console.error('Erreur chargement données:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="h-64 bg-gray-100 animate-pulse rounded-lg"></div>;
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-lg font-semibold mb-4">Répartition des commandes</h3>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
            outerRadius={100}
            fill="#8884d8"
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};