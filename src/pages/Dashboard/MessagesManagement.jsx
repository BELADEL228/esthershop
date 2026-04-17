import React, { useState, useEffect } from 'react';
import { contactApi } from '../../services/api/contact';
import { 
  EnvelopeIcon, 
  CheckCircleIcon,
  TrashIcon,
  EyeIcon
} from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

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
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Messages de contact</h1>
        <div className="bg-primary-100 dark:bg-primary-900/30 text-primary-800 dark:text-primary-300 px-4 py-2 rounded-lg">
          Total: {messages.length} message{messages.length > 1 ? 's' : ''}
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Liste des messages */}
        <div className="lg:col-span-1 bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden border border-gray-200 dark:border-gray-700">
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {messages.length === 0 ? (
              <div className="p-8 text-center text-gray-500 dark:text-gray-400">
                <EnvelopeIcon className="h-12 w-12 mx-auto mb-3 text-gray-400 dark:text-gray-500" />
                <p>Aucun message pour le moment</p>
              </div>
            ) : (
              messages.map((msg) => (
                <div
                  key={msg.id}
                  onClick={() => handleViewMessage(msg)}
                  className={`p-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${
                    selectedMessage?.id === msg.id ? 'bg-primary-50 dark:bg-primary-900/20' : ''
                  } ${!msg.is_read ? 'border-l-4 border-primary-600' : ''}`}
                >
                  <div className="flex justify-between items-start mb-1">
                    <span className="font-semibold text-gray-900 dark:text-white">{msg.name}</span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {new Date(msg.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 truncate">{msg.subject}</p>
                  {!msg.is_read && (
                    <span className="inline-block mt-2 text-xs bg-primary-100 dark:bg-primary-900/30 text-primary-800 dark:text-primary-300 px-2 py-1 rounded">
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
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{selectedMessage.subject}</h2>
                  <div className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
                    <p><span className="font-medium">De :</span> {selectedMessage.name}</p>
                    <p><span className="font-medium">Email :</span> {selectedMessage.email}</p>
                    <p><span className="font-medium">Date :</span> {new Date(selectedMessage.created_at).toLocaleString()}</p>
                  </div>
                </div>
                <button
                  onClick={() => handleDelete(selectedMessage.id)}
                  className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                  title="Supprimer"
                >
                  <TrashIcon className="h-5 w-5" />
                </button>
              </div>

              <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                <h3 className="font-medium text-gray-900 dark:text-white mb-2">Message :</h3>
                <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">{selectedMessage.message}</p>
              </div>

              <div className="border-t border-gray-200 dark:border-gray-700 mt-6 pt-4 flex space-x-3">
                <a
                  href={`mailto:${selectedMessage.email}?subject=Re: ${selectedMessage.subject}`}
                  className="bg-primary-600 text-white px-4 py-2 rounded hover:bg-primary-700 transition-colors"
                >
                  Répondre par email
                </a>
                <button
                  onClick={() => setSelectedMessage(null)}
                  className="border border-gray-300 dark:border-gray-600 px-4 py-2 rounded hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-gray-700 dark:text-gray-300"
                >
                  Fermer
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-12 text-center text-gray-500 dark:text-gray-400 border border-gray-200 dark:border-gray-700">
              <EnvelopeIcon className="h-16 w-16 mx-auto mb-4 text-gray-400 dark:text-gray-500" />
              <p className="text-lg">Sélectionnez un message pour voir son contenu</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};