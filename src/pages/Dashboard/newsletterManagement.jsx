import React, { useState, useEffect } from 'react'
import { newsletterApi } from '../../services/api/newsletter'
import { supabase } from '../../services/supabase'
import { 
  EnvelopeIcon, 
  UsersIcon, 
  TrashIcon,
  DocumentArrowDownIcon,
  PaperAirplaneIcon,
  CheckCircleIcon,
  XCircleIcon
} from '@heroicons/react/24/outline'
import toast from 'react-hot-toast'

export const NewsletterManagement = () => {
  const [subscribers, setSubscribers] = useState([])
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({ total: 0, active: 0, sent: 0 })
  const [sending, setSending] = useState(false)
  const [subject, setSubject] = useState('')
  const [content, setContent] = useState('')
  const [sendResults, setSendResults] = useState(null)

  useEffect(() => {
    loadSubscribers()
    loadStats()
  }, [])

  const loadSubscribers = async () => {
    try {
      const data = await newsletterApi.getAllSubscribers()
      setSubscribers(data)
      
      const active = data.filter(s => s.is_active).length
      setStats(prev => ({ ...prev, total: data.length, active }))
    } catch (error) {
      toast.error('Erreur chargement des abonnés')
    } finally {
      setLoading(false)
    }
  }

  const loadStats = async () => {
    try {
      const { data, error } = await supabase
        .from('newsletter_stats')
        .select('total_sent')
        .eq('id', 1)
        .single()

      if (error && error.code !== 'PGRST116') throw error
      
      setStats(prev => ({ ...prev, sent: data?.total_sent || 0 }))
    } catch (error) {
      console.error('Erreur chargement stats:', error)
    }
  }

  const handleSendNewsletter = async () => {
    if (!subject || !content) {
      toast.error('Veuillez remplir le sujet et le contenu')
      return
    }

    const activeSubscribers = subscribers.filter(s => s.is_active)
    if (activeSubscribers.length === 0) {
      toast.error('Aucun abonné actif')
      return
    }

    if (!window.confirm(`Envoyer cette newsletter à ${activeSubscribers.length} abonné(s) ?`)) {
      return
    }

    setSending(true)
    setSendResults(null)
    
    try {
      // 1. Créer le template HTML
      const htmlContent = createNewsletterTemplate(subject, content)

      // 2. Envoyer via l'API backend
      const response = await fetch('/api/send-newsletter', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          subscribers: activeSubscribers.map(s => s.email),
          subject,
          htmlContent
        })
      })

      const results = await response.json()

      if (!response.ok) {
        throw new Error(results.error || 'Erreur lors de l\'envoi')
      }

      setSendResults(results)

      // 3. Mettre à jour les statistiques
      if (results.success?.length > 0) {
        const newTotal = (stats.sent || 0) + 1
        
        const { error } = await supabase
          .from('newsletter_stats')
          .upsert({
            id: 1,
            total_sent: newTotal,
            last_sent_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          })

        if (error) throw error

        setStats(prev => ({ ...prev, sent: newTotal }))
        
        toast.success(
          `✅ Newsletter envoyée !\n` +
          `Succès: ${results.success.length}\n` +
          `Échecs: ${results.failed?.length || 0}`
        )
        
        if (results.failed?.length === 0) {
          setSubject('')
          setContent('')
        }
      }
      
    } catch (error) {
      console.error('❌ Erreur envoi:', error)
      toast.error(`Erreur: ${error.message}`)
    } finally {
      setSending(false)
    }
  }

  const handleDelete = async (id, email) => {
    if (window.confirm(`Supprimer l'abonné ${email} ?`)) {
      try {
        await newsletterApi.deleteSubscriber(id)
        toast.success('Abonné supprimé')
        loadSubscribers()
      } catch (error) {
        toast.error('Erreur lors de la suppression')
      }
    }
  }

  const handleExport = async () => {
    try {
      const emails = await newsletterApi.exportEmails()
      
      const headers = 'Email,Date d\'inscription,Source,Statut\n'
      const rows = emails.map(e => 
        `"${e.email}",${new Date(e.subscribed_at).toLocaleDateString()},${e.source || 'footer'},${e.is_active ? 'Actif' : 'Inactif'}`
      ).join('\n')
      
      const csv = headers + rows
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `newsletter-abonnes-${new Date().toISOString().split('T')[0]}.csv`
      a.click()
      window.URL.revokeObjectURL(url)
      
      toast.success('Export réussi !')
    } catch (error) {
      toast.error('Erreur lors de l\'export')
    }
  }

  const createNewsletterTemplate = (subject, content) => {
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>${subject}</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #4f46e5; color: white; padding: 30px 20px; text-align: center; }
            .content { padding: 30px; background: #f9fafb; }
            .footer { text-align: center; padding: 20px; font-size: 12px; color: #666; }
            .button { display: inline-block; padding: 12px 30px; background: #4f46e5; color: white; text-decoration: none; border-radius: 6px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>✨ Jenny Shop ✨</h1>
            </div>
            <div class="content">
              <h2 style="color: #4f46e5;">${subject}</h2>
              <div>${content.replace(/\n/g, '<br>')}</div>
              <div style="text-align: center; margin-top: 30px;">
                <a href="https://Jennyshop-9si1.vercel.app/" class="button">
                  Découvrir nos produits
                </a>
              </div>
            </div>
            <div class="footer">
              <p>© ${new Date().getFullYear()} Jenny Shop. Tous droits réservés.</p>
              <p>Lomé, Togo</p>
            </div>
          </div>
        </body>
      </html>
    `
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* En-tête */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Gestion de la Newsletter</h1>
        <button
          onClick={handleExport}
          className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
        >
          <DocumentArrowDownIcon className="h-5 w-5" />
          <span>Exporter (CSV)</span>
        </button>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-4">
            <div className="bg-primary-100 dark:bg-primary-900/20 p-3 rounded-lg">
              <UsersIcon className="h-6 w-6 text-primary-600 dark:text-primary-400" />
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Total abonnés</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.total}</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-4">
            <div className="bg-green-100 dark:bg-green-900/20 p-3 rounded-lg">
              <EnvelopeIcon className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Abonnés actifs</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.active}</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-4">
            <div className="bg-purple-100 dark:bg-purple-900/20 p-3 rounded-lg">
              <PaperAirplaneIcon className="h-6 w-6 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Newsletters envoyées</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.sent}</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-4">
            <div className="bg-yellow-100 dark:bg-yellow-900/20 p-3 rounded-lg">
              <CheckCircleIcon className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Taux d'engagement</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {stats.total ? Math.round((stats.active / stats.total) * 100) : 0}%
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Formulaire d'envoi */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8 border border-gray-200 dark:border-gray-700">
        <h2 className="text-xl font-semibold mb-4 text-primary-600 dark:text-primary-400">
          Envoyer une newsletter
        </h2>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Sujet</label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
              placeholder="Ex: Nos nouveautés de la semaine"
              disabled={sending}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Contenu</label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={6}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
              placeholder="Rédigez votre newsletter ici..."
              disabled={sending}
            />
          </div>

          <div className="flex justify-between items-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              📧 {stats.active} abonné{stats.active > 1 ? 's' : ''} actif{stats.active > 1 ? 's' : ''} recevront cette newsletter
            </p>
            <button
              onClick={handleSendNewsletter}
              disabled={sending || stats.active === 0}
              className="bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700 disabled:bg-primary-300 transition-colors flex items-center space-x-2"
            >
              <PaperAirplaneIcon className="h-5 w-5" />
              <span>{sending ? 'Envoi en cours...' : 'Envoyer'}</span>
            </button>
          </div>
        </div>

        {/* Résultats d'envoi */}
        {sendResults && (
          <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <h3 className="font-semibold mb-2 text-gray-900 dark:text-white">Résultats de l'envoi :</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center space-x-2 text-green-600">
                <CheckCircleIcon className="h-5 w-5" />
                <span>Réussis : {sendResults.success?.length || 0}</span>
              </div>
              <div className="flex items-center space-x-2 text-red-600">
                <XCircleIcon className="h-5 w-5" />
                <span>Échecs : {sendResults.failed?.length || 0}</span>
              </div>
            </div>
            
            {sendResults.failed?.length > 0 && (
              <div className="mt-2 text-sm text-red-600">
                <p className="font-medium">Échecs :</p>
                <ul className="list-disc list-inside">
                  {sendResults.failed.map((f, i) => (
                    <li key={i}>{f.email} : {f.error}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Liste des abonnés */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden border border-gray-200 dark:border-gray-700">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-900">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Date d'inscription
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Source
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
              {subscribers.map((sub) => (
                <tr key={sub.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">
                    {sub.email}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                    {new Date(sub.subscribed_at).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-sm capitalize text-gray-600 dark:text-gray-400">
                    {sub.source}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      sub.is_active 
                        ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' 
                        : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-400'
                    }`}>
                      {sub.is_active ? 'Actif' : 'Désabonné'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm font-medium">
                    <button
                      onClick={() => handleDelete(sub.id, sub.email)}
                      className="text-red-600 hover:text-red-700 dark:hover:text-red-400 transition-colors"
                      title="Supprimer"
                    >
                      <TrashIcon className="h-5 w-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {subscribers.length === 0 && (
          <div className="text-center py-12">
            <EnvelopeIcon className="h-12 w-12 mx-auto text-gray-400 dark:text-gray-500 mb-4" />
            <p className="text-gray-600 dark:text-gray-400">
              Aucun abonné pour le moment
            </p>
          </div>
        )}
      </div>
    </div>
  )
}