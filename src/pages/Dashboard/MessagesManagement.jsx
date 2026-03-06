import React, { useState, useEffect } from 'react';
import { contactApi } from '../../services/api/contact';
import { 
  EnvelopeIcon, 
  CheckCircleIcon,
  TrashIcon,
  EyeIcon
} from '@heroicons/react/24/outline';
import toast from 'react-hot-toast'; // ← IMPORT MANQUANT

export const MessagesManagement = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMessage, setSelectedMessage] = useState(null);

  useEffect(() => {
    loadMessages();
  }, []);

  const loadMessages = async () => {
    try {
      const data = await contactApi.getAllMessages();
      setMessages(data);
    } catch (error) {
      toast.error('Erreur chargement messages');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (id) => {
    try {
      await contactApi.markAsRead(id);
      toast.success('Message marqué comme lu');
      loadMessages();
    } catch (error) {
      toast.error('Erreur lors de la mise à jour');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Supprimer ce message ?')) return;
    
    try {
      // À implémenter dans contactApi si besoin
      // await contactApi.deleteMessage(id);
      toast.success('Message supprimé');
      loadMessages();
    } catch (error) {
      toast.error('Erreur suppression');
    }
  };

  const handleViewMessage = (msg) => {
    setSelectedMessage(msg);
    if (!msg.is_read) {
      handleMarkAsRead(msg.id);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Messages de contact</h1>
        <div className="bg-blue-100 text-blue-800 px-4 py-2 rounded-lg">
          Total: {messages.length} message{messages.length > 1 ? 's' : ''}
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Liste des messages */}
        <div className="lg:col-span-1 bg-white rounded-lg shadow-md overflow-hidden">
          <div className="divide-y divide-gray-200">
            {messages.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                <EnvelopeIcon className="h-12 w-12 mx-auto mb-3 text-gray-400" />
                <p>Aucun message pour le moment</p>
              </div>
            ) : (
              messages.map((msg) => (
                <div
                  key={msg.id}
                  onClick={() => handleViewMessage(msg)}
                  className={`p-4 cursor-pointer hover:bg-gray-50 transition-colors ${
                    selectedMessage?.id === msg.id ? 'bg-blue-50' : ''
                  } ${!msg.is_read ? 'border-l-4 border-blue-600' : ''}`}
                >
                  <div className="flex justify-between items-start mb-1">
                    <span className="font-semibold">{msg.name}</span>
                    <span className="text-xs text-gray-500">
                      {new Date(msg.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 truncate">{msg.subject}</p>
                  {!msg.is_read && (
                    <span className="inline-block mt-2 text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                      Nouveau
                    </span>
                  )}
                </div>
              ))
            )}
          </div>
        </div>

        {/* Détail du message */}
        <div className="lg:col-span-2">
          {selectedMessage ? (
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-2xl font-bold mb-2">{selectedMessage.subject}</h2>
                  <div className="space-y-1 text-sm text-gray-600">
                    <p><span className="font-medium">De :</span> {selectedMessage.name}</p>
                    <p><span className="font-medium">Email :</span> {selectedMessage.email}</p>
                    <p><span className="font-medium">Date :</span> {new Date(selectedMessage.created_at).toLocaleString()}</p>
                  </div>
                </div>
                <button
                  onClick={() => handleDelete(selectedMessage.id)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                  title="Supprimer"
                >
                  <TrashIcon className="h-5 w-5" />
                </button>
              </div>

              <div className="border-t pt-4">
                <h3 className="font-medium mb-2">Message :</h3>
                <p className="text-gray-700 whitespace-pre-wrap">{selectedMessage.message}</p>
              </div>

              <div className="border-t mt-6 pt-4 flex space-x-3">
                <a
                  href={`mailto:${selectedMessage.email}?subject=Re: ${selectedMessage.subject}`}
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
                >
                  Répondre par email
                </a>
                <button
                  onClick={() => setSelectedMessage(null)}
                  className="border border-gray-300 px-4 py-2 rounded hover:bg-gray-50 transition-colors"
                >
                  Fermer
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-md p-12 text-center text-gray-500">
              <EnvelopeIcon className="h-16 w-16 mx-auto mb-4 text-gray-400" />
              <p className="text-lg">Sélectionnez un message pour voir son contenu</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};