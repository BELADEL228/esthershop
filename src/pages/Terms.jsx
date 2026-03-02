import React from 'react'

export const Terms = () => {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-4xl font-bold mb-8">Conditions Générales de Vente</h1>
      <p className="text-gray-600 dark:text-gray-400 mb-8">
        Dernière mise à jour : {new Date().toLocaleDateString('fr-FR')}
      </p>

      <div className="prose dark:prose-invert max-w-none">
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">1. Objet</h2>
          <p className="text-gray-700 dark:text-gray-300">
            Les présentes conditions générales de vente régissent les relations contractuelles 
            entre la société E-Shop et son client, dans le cadre de la vente des produits 
            proposés sur le site e-shop.com.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">2. Produits</h2>
          <p className="text-gray-700 dark:text-gray-300">
            Les produits proposés à la vente sont ceux figurant sur le site au jour de la 
            consultation par le client, dans la limite des stocks disponibles. Les photographies 
            et descriptions des produits sont fournies à titre indicatif et ne sont pas 
            contractuelles.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">3. Prix</h2>
          <p className="text-gray-700 dark:text-gray-300">
            Les prix sont indiqués en euros, toutes taxes comprises, hors frais de livraison. 
            E-Shop se réserve le droit de modifier ses prix à tout moment, les produits étant 
            facturés sur la base du tarif en vigueur au moment de la validation de la commande.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">4. Commandes</h2>
          <p className="text-gray-700 dark:text-gray-300">
            La validation de la commande par le client vaut acceptation des prix, de la 
            description des produits et des présentes conditions générales de vente. 
            E-Shop confirme la commande par email.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">5. Paiement</h2>
          <p className="text-gray-700 dark:text-gray-300">
            Le paiement s'effectue en ligne par carte bancaire, PayPal, Apple Pay ou Google Pay. 
            Les transactions sont sécurisées et les données bancaires ne sont pas conservées 
            sur nos serveurs.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">6. Livraison</h2>
          <p className="text-gray-700 dark:text-gray-300">
            La livraison est effectuée à l'adresse indiquée par le client lors de la commande. 
            Les délais de livraison sont donnés à titre indicatif et peuvent varier selon la 
            destination. En cas de retard, le client en est informé par email.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">7. Droit de rétractation</h2>
          <p className="text-gray-700 dark:text-gray-300">
            Conformément à la loi, le client dispose d'un délai de 14 jours pour exercer son 
            droit de rétractation sans avoir à justifier de motifs. Les frais de retour sont 
            à la charge du client, sauf en cas de produit défectueux ou d'erreur de notre part.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">8. Garantie</h2>
          <p className="text-gray-700 dark:text-gray-300">
            Tous les produits bénéficient de la garantie légale de conformité et de la garantie 
            contre les vices cachés. En cas de défaut, le client peut contacter notre service 
            client pour obtenir réparation ou remboursement.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">9. Données personnelles</h2>
          <p className="text-gray-700 dark:text-gray-300">
            Les informations recueillies font l'objet d'un traitement informatique destiné à la 
            gestion des commandes et à la relation client. Conformément au RGPD, vous disposez 
            d'un droit d'accès, de rectification et de suppression de vos données.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">10. Droit applicable</h2>
          <p className="text-gray-700 dark:text-gray-300">
            Les présentes conditions sont soumises au droit français. En cas de litige, 
            une solution amiable sera recherchée avant toute action judiciaire.
          </p>
        </section>
      </div>
    </div>
  )
}