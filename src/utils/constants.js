export const APP_NAME = 'E-Shop'

export const CATEGORIES = [
  { value: 'electronique', label: 'Électronique' },
  { value: 'vetements', label: 'Vêtements' },
  { value: 'maison', label: 'Maison' },
  { value: 'livres', label: 'Livres' },
  { value: 'sport', label: 'Sport' },
  { value: 'beaute', label: 'Beauté' },
  { value: 'jouets', label: 'Jouets' },
  { value: 'alimentation', label: 'Alimentation' }
]

export const ORDER_STATUS = {
  pending: 'En attente',
  processing: 'En cours',
  shipped: 'Expédié',
  delivered: 'Livré',
  cancelled: 'Annulé'
}

export const PAYMENT_METHODS = {
  card: 'Carte bancaire',
  paypal: 'PayPal',
  bank_transfer: 'Virement bancaire'
}

export const SORT_OPTIONS = [
  { value: 'newest', label: 'Plus récents' },
  { value: 'price-asc', label: 'Prix croissant' },
  { value: 'price-desc', label: 'Prix décroissant' },
  { value: 'name-asc', label: 'Nom A-Z' },
  { value: 'name-desc', label: 'Nom Z-A' }
]