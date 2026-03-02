import { loadStripe } from '@stripe/stripe-js'
import axios from 'axios'

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY)

// Paiement par carte (Stripe)
export const processStripePayment = async (amount, orderData) => {
  try {
    const stripe = await stripePromise
    
    // Créer une intention de paiement sur votre backend
    const { data } = await axios.post('/api/create-payment-intent', {
      amount,
      currency: 'xof',
      orderData
    })

    // Confirmer le paiement
    const { error } = await stripe.confirmCardPayment(data.clientSecret)
    
    if (error) {
      throw new Error(error.message)
    }

    return {
      success: true,
      transactionId: data.paymentIntentId
    }
  } catch (error) {
    console.error('Erreur Stripe:', error)
    return {
      success: false,
      error: error.message
    }
  }
}

// Paiement Mobile Money (Togo)
export const processMobileMoney = async ({ amount, provider, phone, orderData }) => {
  try {
    // Simuler une requête vers l'API Mobile Money
    // À remplacer par l'API réelle de votre partenaire
    const response = await axios.post('/api/mobile-money/initiate', {
      amount,
      provider,
      phone,
      orderData
    })

    return {
      success: true,
      transactionId: response.data.transactionId
    }
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || 'Erreur paiement mobile'
    }
  }
}

// Paiement à la livraison
export const processCashOnDelivery = (orderData) => {
  return {
    success: true,
    transactionId: `COD-${Date.now()}`,
    message: 'Paiement à la livraison'
  }
}