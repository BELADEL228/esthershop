import React from 'react'
import { 
  ArrowPathIcon, 
  CreditCardIcon, 
  ClockIcon,
  CheckCircleIcon 
} from '@heroicons/react/24/outline'

export const Returns = () => {
  const steps = [
    {
      icon: ArrowPathIcon,
      title: '1. Demande de retour',
      description: 'Connectez-vous à votre compte et sélectionnez les articles à retourner dans "Mes commandes".'
    },
    {
      icon: ClockIcon,
      title: '2. Préparation',
      description: 'Imprimez l\'étiquette de retour, emballez soigneusement les articles et déposez le colis en point relais.'
    },
    {
      icon: CheckCircleIcon,
      title: '3. Vérification',
      description: 'Nous vérifions l\'état des articles retournés sous 48h après réception.'
    },
    {
      icon: CreditCardIcon,
      title: '4. Remboursement',
      description: 'Le remboursement est effectué sous 48h après vérification, sur le moyen de paiement utilisé.'
    }
  ]

  const exceptions = [
    'Produits personnalisés',
    'Articles d\'hygiène ouverts',
    'Produits périssables',
    'Cartes cadeaux',
    'Logiciels téléchargés'
  ]

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-center mb-4">
        Retours et remboursements
      </h1>
      <p className="text-xl text-gray-600 dark:text-gray-400 text-center mb-12">
        Notre politique de retour en toute simplicité
      </p>

      {/* Délai de rétractation */}
      <div className="bg-blue-600 text-white rounded-lg p-8 text-center mb-12">
        <h2 className="text-3xl font-bold mb-2">14 jours</h2>
        <p className="text-xl mb-4">pour changer d'avis</p>
        <p className="text-blue-100">
          Conformément à la loi, vous disposez de 14 jours à compter de la réception 
          de votre commande pour nous retourner les articles qui ne vous conviendraient pas.
        </p>
      </div>

      {/* Étapes */}
      <h2 className="text-2xl font-semibold text-center mb-8">
        Comment retourner un article ?
      </h2>
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {steps.map((step, index) => (
          <div
            key={index}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 text-center"
          >
            <div className="bg-blue-100 dark:bg-blue-900/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <step.icon className="h-8 w-8 text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="text-lg font-semibold mb-2">{step.title}</h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              {step.description}
            </p>
          </div>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Exceptions */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4 text-red-600 dark:text-red-400">
            Articles non retournables
          </h2>
          <ul className="space-y-2">
            {exceptions.map((item, index) => (
              <li key={index} className="flex items-start space-x-2">
                <span className="text-red-500">•</span>
                <span className="text-gray-700 dark:text-gray-300">{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Conditions */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4 text-green-600 dark:text-green-400">
            Conditions de retour
          </h2>
          <ul className="space-y-3">
            <li className="flex items-start space-x-2">
              <CheckCircleIcon className="h-5 w-5 text-green-500 flex-shrink-0" />
              <span className="text-gray-700 dark:text-gray-300">
                Articles dans leur état d'origine, non portés/ utilisés
              </span>
            </li>
            <li className="flex items-start space-x-2">
              <CheckCircleIcon className="h-5 w-5 text-green-500 flex-shrink-0" />
              <span className="text-gray-700 dark:text-gray-300">
                Étiquettes et emballage d'origine intacts
              </span>
            </li>
            <li className="flex items-start space-x-2">
              <CheckCircleIcon className="h-5 w-5 text-green-500 flex-shrink-0" />
              <span className="text-gray-700 dark:text-gray-300">
                Retour effectué dans les 14 jours suivant la réception
              </span>
            </li>
          </ul>
        </div>
      </div>

      {/* Bouton d'action */}
      <div className="text-center mt-12">
        <a
          href="/orders"
          className="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Faire une demande de retour
        </a>
      </div>
    </div>
  )
}