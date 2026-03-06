import React, { useState } from 'react'
import { 
  EnvelopeIcon, 
  PhoneIcon, 
  MapPinIcon, 
  ClockIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline'
import { supabase } from '../services/supabase'
// CORRECTION : L'import doit être relatif au dossier api à la racine
// ou utiliser fetch directement (recommandé)
import toast from 'react-hot-toast'

export const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  })
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setSuccess(false)
    
    try {
      // 1. Sauvegarder dans Supabase
      const { error: dbError } = await supabase
        .from('contact_messages')
        .insert([{
          name: formData.name,
          email: formData.email,
          subject: formData.subject,
          message: formData.message,
          created_at: new Date().toISOString()
        }])

      if (dbError) throw dbError

      // 2. Envoyer l'email via l'API route (CORRIGÉ)
      const response = await fetch('/api/send-contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          subject: formData.subject,
          message: formData.message
        })
      })

      const result = await response.json()

      if (!response.ok) {
        console.error('Erreur envoi email:', result.error)
        // Ne pas bloquer l'utilisateur si l'email échoue
      } else {
        console.log('✅ Email envoyé:', result)
      }

      // Succès
      setSuccess(true)
      toast.success('Message envoyé avec succès!')
      setFormData({ name: '', email: '', subject: '', message: '' })
      
      // Cacher le message de succès après 5 secondes
      setTimeout(() => setSuccess(false), 5000)
      
    } catch (error) {
      console.error('❌ Erreur:', error)
      toast.error("Erreur lors de l'envoi du message")
    } finally {
      setLoading(false)
    }
  }

  const contactInfo = [
    {
      icon: MapPinIcon,
      title: 'Adresse',
      content: ['National N1, Lomé, Togo', 'Marché d\'Adétikopé']
    },
    {
      icon: PhoneIcon,
      title: 'Téléphone',
      content: ['+228 96 64 49 90', 'Lun-Ven: 9h-18h']
    },
    {
      icon: EnvelopeIcon,
      title: 'Email',
      content: ['esthernabede08@gmail.com', 'beleiabel8@gmail.com']
    },
    {
      icon: ClockIcon,
      title: 'Horaires',
      content: ['Lun-Ven: 9h-19h', 'Sam: 10h-18h']
    }
  ]

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-center mb-4">Contactez-nous</h1>
      <p className="text-xl text-gray-600 dark:text-gray-400 text-center mb-12">
        Une question ? Une suggestion ? N'hésitez pas à nous écrire
      </p>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Informations de contact */}
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700">
            <h2 className="text-2xl font-semibold mb-6 text-blue-600 dark:text-blue-400">
              Informations
            </h2>
            <div className="space-y-6">
              {contactInfo.map((info, index) => (
                <div key={index} className="flex space-x-4">
                  <div className="bg-blue-100 dark:bg-blue-900/20 p-2 rounded-lg h-fit">
                    <info.icon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1 text-gray-900 dark:text-white">
                      {info.title}
                    </h3>
                    {info.content.map((line, i) => (
                      <p key={i} className="text-gray-600 dark:text-gray-400 text-sm">
                        {line}
                      </p>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Carte Google Maps */}
            <div className="mt-6 h-48 bg-gray-200 dark:bg-gray-700 rounded-lg overflow-hidden">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3965.557822554531!2d1.2167314387801127!3d6.321661451754261!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1023ffc287c8b66d%3A0x89633d82b01b6e6e!2zTUFSQ0jDiSBQUklOQ0lQQUwgRCdBRMOJVElLT1DDiQ!5e0!3m2!1sfr!2stg!4v1772480640782!5m2!1sfr!2stg"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                title="Carte du marché d'Adétikopé"
                className="w-full h-full"
              ></iframe>
            </div>
          </div>
        </div>

        {/* Formulaire de contact */}
        <div className="lg:col-span-2">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700">
            <h2 className="text-2xl font-semibold mb-6 text-blue-600 dark:text-blue-400">
              Envoyez-nous un message
            </h2>
            
            {success && (
              <div className="mb-6 p-4 bg-green-100 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg flex items-center space-x-3">
                <CheckCircleIcon className="h-6 w-6 text-green-600 dark:text-green-400" />
                <p className="text-green-800 dark:text-green-200">
                  Message envoyé avec succès ! Nous vous répondrons dans les plus brefs délais.
                </p>
              </div>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                    Nom complet <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Jean Dupont"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="jean@example.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                  Sujet <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Question sur un produit..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                  Message <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows="6"
                  className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Votre message..."
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 disabled:bg-blue-300 transition-colors font-semibold flex items-center justify-center space-x-2"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span>Envoi en cours...</span>
                  </>
                ) : (
                  <span>Envoyer le message</span>
                )}
              </button>

              <p className="text-xs text-gray-500 dark:text-gray-400 text-center mt-4">
                En soumettant ce formulaire, vous acceptez que vos données soient traitées pour vous répondre.
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}