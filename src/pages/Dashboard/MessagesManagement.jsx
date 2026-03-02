import React, { useState, useEffect } from 'react';
import { contactApi } from '../../services/api/contact';
import { EnvelopeIcon, CheckCircleIcon } from '@heroicons/react/24/outline';

export const MessagesManagement = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMessages();
  }, []);

  const loadMessages = async () => {
    try {
      const data = await contactApi.getAllMessages();
      setMessages(data);
    } catch (error) {
      toast.error('Erreur chargement messages');
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (id) => {
    try {
      await contactApi.markAsRead(id);
      loadMessages();
    } catch (error) {
      toast.error('Erreur');
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Messages de contact</h1>
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left">Date</th>
              <th className="px-6 py-3 text-left">Nom</th>
              <th className="px-6 py-3 text-left">Email</th>
              <th className="px-6 py-3 text-left">Sujet</th>
              <th className="px-6 py-3 text-left">Statut</th>
              <th className="px-6 py-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {messages.map(msg => (
              <tr key={msg.id} className="border-t hover:bg-gray-50">
                <td className="px-6 py-4">
                  {new Date(msg.created_at).toLocaleDateString()}
                </td>
                <td className="px-6 py-4">{msg.name}</td>
                <td className="px-6 py-4">{msg.email}</td>
                <td className="px-6 py-4">{msg.subject}</td>
                <td className="px-6 py-4">
                  {msg.is_read ? (
                    <span className="text-green-600">Lu</span>
                  ) : (
                    <span className="text-yellow-600">Non lu</span>
                  )}
                </td>
                <td className="px-6 py-4">
                  {!msg.is_read && (
                    <button
                      onClick={() => handleMarkAsRead(msg.id)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      <CheckCircleIcon className="h-5 w-5" />
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};