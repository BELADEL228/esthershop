import React from 'react'
import { Link } from 'react-router-dom'
import { useSettings } from '../../hooks/useSettings'
import { 
  EnvelopeIcon,
  PhoneIcon,
  MapPinIcon,
  ClockIcon
} from '@heroicons/react/24/outline'
import { 
  FaFacebook, 
  FaInstagram, 
  FaTiktok,
  FaCcVisa,
  FaCcMastercard,
  FaPaypal,
} from 'react-icons/fa'
import { SiApplepay, SiGooglepay } from 'react-icons/si'

export const Footer = () => {
  const currentYear = new Date().getFullYear()
  const { settings } = useSettings()

  const quickLinks = [
    { name: 'Accueil', path: '/' },
    { name: 'Produits', path: '/products' },
    { name: 'Promotions', path: '/products?promo=true' },
    { name: 'Nouveautés', path: '/products?sort=newest' }
  ]

  const customerLinks = [
    { name: 'Mon compte', path: '/profile' },
    { name: 'Mes commandes', path: '/orders' },
    { name: 'Liste de souhaits', path: '/favorites' },
    { name: 'Panier', path: '/cart' }
  ]

  const infoLinks = [
    { name: 'À propos', path: '/about' },
    { name: 'Contact', path: '/contact' },
    { name: 'FAQ', path: '/faq' },
    { name: 'Livraison', path: '/shipping' },
    { name: 'Retours', path: '/returns' },
    { name: 'Conditions générales', path: '/terms' },
    { name: 'Politique de confidentialité', path: '/privacy' }
  ]

  const socialLinks = [
    { name: 'Facebook', icon: FaFacebook, href: 'https://facebook.com/Jennyshop', color: 'hover:text-blue-600' },
    { name: 'TikTok', icon: FaTiktok, href: 'https://tiktok.com/@Jennyshop', color: 'hover:text-black' },
    { name: 'Instagram', icon: FaInstagram, href: 'https://instagram.com/Jennyshop', color: 'hover:text-pink-600' },
  ]

  const paymentMethods = [
    { name: 'Visa', icon: FaCcVisa, color: 'text-blue-600' },
    { name: 'Mastercard', icon: FaCcMastercard, color: 'text-orange-600' },
    { name: 'PayPal', icon: FaPaypal, color: 'text-blue-800' },
    { name: 'Apple Pay', icon: SiApplepay, color: 'text-gray-400' },
    { name: 'Google Pay', icon: SiGooglepay, color: 'text-blue-500' }
  ]

  return (
    <footer className="bg-gray-900 text-white">
      {/* Newsletter Section */}
      <div className="border-b border-gray-800">
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-2xl font-bold mb-2">Inscription à la Newsletter</h3>
              <p className="text-gray-400">
                Inscrivez-vous pour recevoir nos offres exclusives et les dernières nouveautés.
              </p>
            </div>
            <form className="flex flex-col sm:flex-row gap-4">
              <input
                type="email"
                placeholder="Votre adresse email"
                className="flex-1 px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-600 text-white placeholder-gray-400"
                required
              />
              <button 
                type="submit"
                className="px-6 py-3 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-700 transition-colors whitespace-nowrap"
              >
                S'inscrire
              </button>
            </form>
          </div>
        </div>
      </div> 

      {/* Main Footer */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* About */}
          <div>
            <div className="flex items-center space-x-2 mb-6">
              <div className="bg-primary-600 rounded-lg flex items-center justify-center px-3 py-1">
                <span className="text-white font-bold text-xl">
                  {settings?.site_name?.split(' ')[0] || "Jenny'"}
                </span>
              </div>
              <span className="text-xl font-bold">Shop</span>
            </div>
            <p className="text-gray-400 mb-6">
              {settings?.site_description || "Votre destination shopping préférée pour les dernières tendances et les meilleurs prix. Des milliers de produits disponibles avec livraison rapide partout au Togo."}
            </p>
            <div className="flex space-x-4">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`text-gray-400 ${social.color} transition-colors`}
                  aria-label={social.name}
                >
                  <social.icon className="h-6 w-6" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-6 text-primary-400">Liens rapides</h3>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link 
                    to={link.path} 
                    className="text-gray-400 hover:text-white transition-colors flex items-center group"
                  >
                    <span className="w-0 group-hover:w-2 h-0.5 bg-primary-500 mr-0 group-hover:mr-2 transition-all"></span>
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h3 className="text-lg font-semibold mb-6 text-primary-400">Service client</h3>
            <ul className="space-y-3">
              {customerLinks.map((link) => (
                <li key={link.name}>
                  <Link 
                    to={link.path} 
                    className="text-gray-400 hover:text-white transition-colors flex items-center group"
                  >
                    <span className="w-0 group-hover:w-2 h-0.5 bg-primary-500 mr-0 group-hover:mr-2 transition-all"></span>
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-6 text-primary-400">Contact</h3>
            <ul className="space-y-4">
              <li className="flex items-start space-x-3">
                <MapPinIcon className="h-5 w-5 text-primary-400 flex-shrink-0 mt-0.5" />
                <span className="text-gray-400">
                  {settings?.site_address || "Adeticope, Marché d'Adéticopé, National N1, Lomé, Togo"}
                </span>
              </li>
              <li className="flex items-center space-x-3">
                <PhoneIcon className="h-5 w-5 text-primary-400 flex-shrink-0" />
                <a 
                  href={`tel:${settings?.site_phone?.replace(/\s/g, '') || '+22896644990'}`} 
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  {settings?.site_phone || '+228 96 64 49 90'}
                </a>
              </li>
              <li className="flex items-center space-x-3">
                <EnvelopeIcon className="h-5 w-5 text-primary-400 flex-shrink-0" />
                <a 
                  href={`mailto:${settings?.site_email || 'Jennynabede08@gmail.com'}`} 
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  {settings?.site_email || 'Jennynabede08@gmail.com'}
                </a>
              </li>
              <li className="flex items-start space-x-3">
                <ClockIcon className="h-5 w-5 text-primary-400 flex-shrink-0 mt-0.5" />
                <span className="text-gray-400">
                  Lun - Ven: 9h - 19h<br />
                  Sam: 10h - 18h
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Payment Methods */}
        <div className="border-t border-gray-800 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-4 mb-4 md:mb-0">
              <span className="text-gray-400">Paiements acceptés :</span>
              <div className="flex space-x-3">
                {paymentMethods.map((method) => (
                  <div
                    key={method.name}
                    className={`text-gray-400 ${method.color} hover:scale-110 transition-transform`}
                    title={method.name}
                  >
                    <method.icon className="h-6 w-6" />
                  </div>
                ))}
              </div>
            </div>
            
            {/* Trust Badges */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-1 text-gray-400">
                <svg className="h-5 w-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="text-sm">Paiement sécurisé</span>
              </div>
              <div className="flex items-center space-x-1 text-gray-400">
                <svg className="h-5 w-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="text-sm">Livraison garantie</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-8 pt-8 text-center">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-400">
            <div className="order-3 md:order-1">
              &copy; {currentYear} {settings?.site_name || 'Jenny Shop'}. Tous droits réservés.
            </div>
            <div className="order-1 md:order-2 flex justify-center space-x-6">
              {infoLinks.slice(0, 3).map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  className="hover:text-white transition-colors"
                >
                  {link.name}
                </Link>
              ))}
            </div>
            <div className="order-2 md:order-3 flex justify-end space-x-6">
              {infoLinks.slice(3, 5).map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  className="hover:text-white transition-colors"
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}