import React from 'react'

export const Privacy = () => {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-4xl font-bold mb-8">Politique de Confidentialité</h1>
      <p className="text-gray-600 dark:text-gray-400 mb-8">
        Dernière mise à jour : {new Date().toLocaleDateString('fr-FR')}
      </p>

      <div className="prose dark:prose-invert max-w-none">
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">1. Introduction</h2>
          <p className="text-gray-700 dark:text-gray-300">
            Chez E-Shop, nous accordons une grande importance à la protection de vos données 
            personnelles. La présente politique de confidentialité vous informe sur la manière 
            dont nous collectons, utilisons et protégeons vos informations.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">2. Données collectées</h2>
          <p className="text-gray-700 dark:text-gray-300 mb-4">
            Nous collectons les données suivantes :
          </p>
          <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-2">
            <li>Données d'identification (nom, prénom, email)</li>
            <li>Données de connexion et d'utilisation du site</li>
            <li>Données de transaction (commandes, historique d'achats)</li>
            <li>Données de navigation (cookies, adresse IP)</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">3. Utilisation des données</h2>
          <p className="text-gray-700 dark:text-gray-300 mb-4">
            Vos données sont utilisées pour :
          </p>
          <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-2">
            <li>Gérer vos commandes et assurer la livraison</li>
            <li>Communiquer avec vous (service client, newsletters)</li>
            <li>Améliorer notre site et nos services</li>
            <li>Respecter nos obligations légales</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">4. Partage des données</h2>
          <p className="text-gray-700 dark:text-gray-300">
            Nous ne vendons pas vos données personnelles. Elles peuvent être partagées avec 
            nos partenaires de confiance (transporteurs, prestataires de paiement) uniquement 
            dans le cadre de l'exécution de vos commandes.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">5. Conservation des données</h2>
          <p className="text-gray-700 dark:text-gray-300">
            Vos données sont conservées pendant la durée nécessaire à la réalisation des 
            finalités pour lesquelles elles ont été collectées, conformément aux obligations 
            légales (5 ans pour les données comptables).
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">6. Vos droits</h2>
          <p className="text-gray-700 dark:text-gray-300 mb-4">
            Conformément au RGPD, vous disposez des droits suivants :
          </p>
          <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-2">
            <li>Droit d'accès à vos données</li>
            <li>Droit de rectification</li>
            <li>Droit à l'effacement</li>
            <li>Droit à la limitation du traitement</li>
            <li>Droit à la portabilité</li>
            <li>Droit d'opposition</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">7. Cookies</h2>
          <p className="text-gray-700 dark:text-gray-300">
            Nous utilisons des cookies pour améliorer votre expérience de navigation. 
            Vous pouvez configurer votre navigateur pour refuser les cookies, mais certaines 
            fonctionnalités du site pourraient être altérées.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">8. Sécurité</h2>
          <p className="text-gray-700 dark:text-gray-300">
            Nous mettons en œuvre toutes les mesures techniques et organisationnelles 
            appropriées pour garantir un niveau de sécurité adapté au risque.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">9. Contact</h2>
          <p className="text-gray-700 dark:text-gray-300">
            Pour toute question concernant cette politique ou pour exercer vos droits, 
            contactez notre Délégué à la Protection des Données à l'adresse : 
            privacy@eshop.com
          </p>
        </section>
      </div>
    </div>
  )
}