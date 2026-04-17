import React, { useState } from 'react'
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/outline'

export const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(null)

  const faqs = [
    {
      category: 'Commandes',
      questions: [
        {
          q: 'Comment passer une commande ?',
          a: 'Pour passer une commande, ajoutez simplement les produits souhaités à votre panier, puis suivez les étapes de validation. Vous devrez créer un compte ou vous connecter, renseigner votre adresse de livraison et choisir votre mode de paiement.'
        },
        {
          q: 'Puis-je modifier ma commande après validation ?',
          a: 'Malheureusement, une fois la commande validée, il n\'est plus possible de la modifier. Vous pouvez cependant annuler votre commande dans l\'heure qui suit et en passer une nouvelle.'
        },
        {
          q: 'Comment suivre ma commande ?',
          a: 'Une fois votre commande expédiée, vous recevrez un email avec un numéro de suivi. Vous pouvez également suivre vos commandes depuis votre espace client, rubrique "Mes commandes".'
        }
      ]
    },
    {
      category: 'Livraison',
      questions: [
        {
          q: 'Quels sont les délais de livraison ?',
          a: 'Les délais de livraison varient selon le mode choisi : 24-48h pour la livraison express, 3-5 jours pour la livraison standard. La livraison est gratuite à partir de 35 000 FCFA d\'achat.'
        },
        {
          q: 'Livrez-vous dans toute l\'Afrique ?',
          a: 'Oui, nous livrons principalement en Afrique de l\'Ouest et Centrale : Sénégal, Côte d\'Ivoire, Cameroun, Bénin, Togo, etc.'
        },
        {
          q: 'Que faire si je ne reçois pas ma commande ?',
          a: 'Si vous ne recevez pas votre commande dans les délais annoncés, contactez notre service client. Nous ferons tout notre possible pour résoudre la situation.'
        }
      ]
    },
    {
      category: 'Paiement',
      questions: [
        {
          q: 'Quels moyens de paiement acceptez-vous ?',
          a: 'Nous acceptons les paiements par Mobile Money (Orange Money, MTN MoMo, Wave), les cartes bancaires (Visa, Mastercard) et le paiement à la livraison dans certaines zones.'
        },
        {
          q: 'Le paiement est-il sécurisé ?',
          a: 'Oui, tous les paiements sont cryptés et sécurisés via nos partenaires de paiement locaux et internationaux.'
        },
        {
          q: 'Puis-je payer en plusieurs fois ?',
          a: 'Oui, pour tout achat supérieur à 65 000 FCFA, vous pouvez payer en 3 fois sans frais selon les conditions de nos partenaires.'
        }
      ]
    },
    {
      category: 'Retours et remboursements',
      questions: [
        {
          q: 'Quelle est votre politique de retour ?',
          a: 'Vous disposez d\'un délai de 14 jours à compter de la réception pour retourner un article qui ne vous conviendrait pas, sauf exceptions (produits personnalisés, hygiène, etc.).'
        },
        {
          q: 'Comment retourner un article ?',
          a: 'Connectez-vous à votre compte, allez dans "Mes commandes" et sélectionnez l\'article à retourner. Notre service client vous contactera pour organiser l\'enlèvement.'
        },
        {
          q: 'Quand serai-je remboursé ?',
          a: 'Le remboursement est effectué sous 48h après réception et vérification du retour. Le délai d\'affichage sur votre compte peut varier selon le mode de paiement utilisé.'
        }
      ]
    }
  ]

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-center text-gray-900 dark:text-white mb-4">
        Foire Aux Questions
      </h1>
      <p className="text-xl text-gray-600 dark:text-gray-400 text-center mb-12">
        Retrouvez les réponses aux questions les plus fréquentes
      </p>

      <div className="max-w-3xl mx-auto">
        {faqs.map((category, categoryIndex) => (
          <div key={categoryIndex} className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-primary-600 dark:text-primary-400">
              {category.category}
            </h2>
            
            <div className="space-y-4">
              {category.questions.map((faq, questionIndex) => {
                const index = `${categoryIndex}-${questionIndex}`
                return (
                  <div
                    key={questionIndex}
                    className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden"
                  >
                    <button
                      onClick={() => toggleFAQ(index)}
                      className="w-full px-6 py-4 text-left bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 flex justify-between items-center transition-colors"
                    >
                      <span className="font-medium text-gray-900 dark:text-white">{faq.q}</span>
                      {openIndex === index ? (
                        <ChevronUpIcon className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                      ) : (
                        <ChevronDownIcon className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                      )}
                    </button>
                    
                    {openIndex === index && (
                      <div className="px-6 py-4 bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700">
                        <p className="text-gray-600 dark:text-gray-400">
                          {faq.a}
                        </p>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Section contact */}
      <div className="mt-12 text-center p-8 bg-primary-50 dark:bg-primary-900/20 rounded-lg">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Vous n'avez pas trouvé votre réponse ?</h3>
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          Notre équipe est là pour vous aider
        </p>
        <a
          href="/contact"
          className="inline-block bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition-colors"
        >
          Contactez-nous
        </a>
      </div>
    </div>
  )
}