// src/utils/constants.js

export const APP_NAME = 'Jenny Shop'

export const CATEGORIES = [
  { value: 'chaussures', label: 'Chaussures' },
  { value: 'maillots', label: 'Maillots' },
  { value: 'ballons', label: 'Ballons' },
  { value: 'accessoires', label: 'Accessoires' },
  { value: 'vetements', label: 'Vêtements' },
  { value: 'beaute', label: 'Beauté' },
  { value: 'sport', label: 'Sport' }
]

export const ORDER_STATUS = {
  pending: 'En attente',
  processing: 'En cours',
  shipped: 'Expédié',
  delivered: 'Livré',
  cancelled: 'Annulé'
}

export const PAYMENT_METHODS = {
  cash_on_delivery: 'Paiement à la livraison',
  mobile_money: 'Mobile Money',
  card: 'Carte bancaire'
}

export const SORT_OPTIONS = [
  { value: 'newest', label: 'Plus récents' },
  { value: 'price-asc', label: 'Prix croissant' },
  { value: 'price-desc', label: 'Prix décroissant' },
  { value: 'name-asc', label: 'Nom A-Z' },
  { value: 'name-desc', label: 'Nom Z-A' }
]