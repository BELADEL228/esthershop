import React, { useState } from 'react'
import { newsletterApi } from '../../services/api/newsletter'
import { EnvelopeIcon, CheckCircleIcon } from '@heroicons/react/24/outline'
import toast from 'react-hot-toast'

export const NewsletterSection = ({ source = 'footer' }) => {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [subscribed, setSubscribed] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const result = await newsletterApi.subscribe(email, source)
      
      if (result.success) {
        setSubscribed(true)
        toast.success(result.message)
        setEmail('')
        
        setTimeout(() => setSubscribed(false), 3000)
      } else {
        toast.error(result.message)
      }
    } catch (error) {
      toast.error('Erreur lors de l\'inscription')
    } finally {
      setLoading(false)
    }
  }

  if (subscribed) {
    return (
      <section className="bg-green-600 py-16">
        <div className="container mx-auto px-4 text-center">
          <CheckCircleIcon className="h-16 w-16 text-white mx-auto mb-4" />
          <h2 className="text-3xl font-bold text-white mb-4">
            Merci pour votre inscription !
          </h2>
          <p className="text-green-100">
            Vous recevrez bientôt nos actualités et offres spéciales.
          </p>
        </div>
      </section>
    )
  }

  return (
    <section className="bg-primary-600 py-16">
      <div className="container mx-auto px-4 text-center">
        <EnvelopeIcon className="h-12 w-12 text-white mx-auto mb-4" />
        <h2 className="text-3xl font-bold text-white mb-4">
          Restez informé
        </h2>
        <p className="text-primary-100 mb-8 max-w-2xl mx-auto">
          Inscrivez-vous à notre newsletter pour recevoir nos offres spéciales 
          et les dernières nouveautés directement dans votre boîte mail.
        </p>
        
        <form onSubmit={handleSubmit} className="max-w-md mx-auto flex flex-col sm:flex-row gap-4">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Votre adresse email"
            required
            className="flex-1 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-white bg-white text-gray-900"
            disabled={loading}
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-white text-primary-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            {loading ? 'Inscription...' : "S'inscrire"}
          </button>
        </form>
        
        <p className="text-primary-200 text-sm mt-4">
          📧 Vos données sont confidentielles. Désinscription possible à tout moment.
        </p>
      </div>
    </section>
  )
}