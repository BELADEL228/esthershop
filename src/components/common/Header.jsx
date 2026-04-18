import React, { useState, useEffect, useRef, useCallback } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { useCart } from '../../hooks/useCart'
import { useTheme } from '../../hooks/useTheme'
import { useSettings } from '../../hooks/useSettings'
import { useCurrency } from '../../contexts/CurrencyContext'
import { 
  ShoppingCartIcon, 
  UserIcon, 
  MagnifyingGlassIcon,
  Bars3Icon,
  XMarkIcon,
  HeartIcon,
  SunIcon,
  MoonIcon,
  ChevronDownIcon,
  InformationCircleIcon,
  EnvelopeIcon
} from '@heroicons/react/24/outline'
import { motion, AnimatePresence } from 'framer-motion'

export const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [scrolled, setScrolled] = useState(false)
  const { user, isAdmin, signOut } = useAuth()
  const { cart } = useCart()
  const { darkMode, toggleDarkMode } = useTheme()
  const { settings } = useSettings()
  const { currency, setCurrency } = useCurrency()
  const navigate = useNavigate()
  const location = useLocation()
  const userMenuRef = useRef(null)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    const closeMenus = () => {
      setIsMenuOpen(false)
      setIsUserMenuOpen(false)
    }
    const frame = requestAnimationFrame(closeMenus)
    return () => cancelAnimationFrame(frame)
  }, [location.pathname])

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setIsUserMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery)}`)
      setIsMenuOpen(false)
      setSearchQuery('')
    }
  }

  const handleSignOut = useCallback(async () => {
    await signOut()
    setIsUserMenuOpen(false)
    navigate('/')
  }, [signOut, navigate])

  const cartItemsCount = cart.items.reduce((acc, item) => acc + item.quantity, 0)

  return (
    <header className={`sticky top-0 z-50 transition-all duration-300 ${
  scrolled 
    ? 'bg-white/80 dark:bg-gray-900/80 backdrop-blur-md shadow-lg' 
    : 'bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm shadow-md'
}`}>
      <nav className="container mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo avec cadre rond et image non déformée */}
          <Link to="/" className="flex-shrink-0 group">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-violet-950 dark:bg-gray-800 shadow-md overflow-hidden flex items-center justify-center transition-transform group-hover:scale-105">
              <img 
                src="/logo.jpg" 
                alt={settings?.site_name || "Jenny Shop"} 
                className="w-full h-full object-contain p-1"
              />
            </div>
          </Link>

          {/* Navigation desktop */}
          <div className="hidden lg:flex items-center space-x-6 xl:space-x-8">
            <Link to="/" className={`text-gray-700 dark:text-gray-300 hover:text-primary-600 transition-colors relative group ${location.pathname === '/' ? 'text-primary-600 font-semibold' : ''}`}>
              Accueil
              <span className={`absolute bottom-0 left-0 w-full h-0.5 bg-primary-600 transform scale-x-0 group-hover:scale-x-100 transition-transform ${location.pathname === '/' ? 'scale-x-100' : ''}`} />
            </Link>
            <Link to="/products" className={`text-gray-700 dark:text-gray-300 hover:text-primary-600 transition-colors relative group ${location.pathname.includes('/products') ? 'text-primary-600 font-semibold' : ''}`}>
              Produits
              <span className={`absolute bottom-0 left-0 w-full h-0.5 bg-primary-600 transform scale-x-0 group-hover:scale-x-100 transition-transform ${location.pathname.includes('/products') ? 'scale-x-100' : ''}`} />
            </Link>
            <Link to="/about" className={`text-gray-700 dark:text-gray-300 hover:text-primary-600 transition-colors relative group flex items-center space-x-1 ${location.pathname === '/about' ? 'text-primary-600 font-semibold' : ''}`}>
             
              <span>À propos</span>
              <span className={`absolute bottom-0 left-0 w-full h-0.5 bg-primary-600 transform scale-x-0 group-hover:scale-x-100 transition-transform ${location.pathname === '/about' ? 'scale-x-100' : ''}`} />
            </Link>
            <Link to="/contact" className={`text-gray-700 dark:text-gray-300 hover:text-primary-600 transition-colors relative group flex items-center space-x-1 ${location.pathname === '/contact' ? 'text-primary-600 font-semibold' : ''}`}>
              
              <span>Contact</span>
              <span className={`absolute bottom-0 left-0 w-full h-0.5 bg-primary-600 transform scale-x-0 group-hover:scale-x-100 transition-transform ${location.pathname === '/contact' ? 'scale-x-100' : ''}`} />
            </Link>
            {isAdmin && (
              <Link to="/dashboard" className={`text-gray-700 dark:text-gray-300 hover:text-primary-600 transition-colors relative group ${location.pathname.includes('/dashboard') ? 'text-primary-600 font-semibold' : ''}`}>
                Dashboard
                <span className={`absolute bottom-0 left-0 w-full h-0.5 bg-primary-600 transform scale-x-0 group-hover:scale-x-100 transition-transform ${location.pathname.includes('/dashboard') ? 'scale-x-100' : ''}`} />
              </Link>
            )}
          </div>

          {/* Icônes de droite */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* Recherche desktop */}
            <button
              onClick={() => navigate('/products')}
              className="hidden lg:block p-2 text-gray-700 dark:text-gray-300 hover:text-primary-600 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
            >
              <MagnifyingGlassIcon className="h-5 w-5" />
            </button>

            {/* Thème */}
            <button onClick={toggleDarkMode} className="p-2 text-gray-700 dark:text-gray-300 hover:text-primary-600 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors">
              {darkMode ? <SunIcon className="h-5 w-5" /> : <MoonIcon className="h-5 w-5" />}
            </button>

            {/* Sélecteur de devise */}
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              className="text-sm px-2 py-1.5 sm:px-3 sm:py-2 text-gray-700 dark:text-gray-300 bg-transparent border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="XOF">FCFA</option>
              <option value="USD">USD ($)</option>
            </select>

            {/* Panier desktop */}
            <Link to="/cart" className="hidden lg:block p-2 text-gray-700 dark:text-gray-300 hover:text-primary-600 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors relative group">
              <ShoppingCartIcon className="h-5 w-5" />
              {cartItemsCount > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-1 -right-1 bg-accent-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center shadow-sm"
                >
                  {cartItemsCount}
                </motion.span>
              )}
            </Link>

            {/* Favoris desktop */}
            <Link to="/favorites" className="hidden lg:block p-2 text-gray-700 dark:text-gray-300 hover:text-primary-600 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors relative">
              <HeartIcon className="h-5 w-5" />
              <span className="absolute -top-1 -right-1 bg-accent-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center shadow-sm">0</span>
            </Link>

            {/* Menu utilisateur */}
            <div className="relative" ref={userMenuRef}>
              <button onClick={() => setIsUserMenuOpen(!isUserMenuOpen)} className="flex items-center space-x-1 p-2 text-gray-700 dark:text-gray-300 hover:text-primary-600 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors">
                <UserIcon className="h-5 w-5" />
                <ChevronDownIcon className={`h-4 w-4 transition-transform ${isUserMenuOpen ? 'rotate-180' : ''}`} />
              </button>
              
              <AnimatePresence>
                {isUserMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="absolute right-0 mt-2 w-56 sm:w-64 bg-white dark:bg-gray-800 rounded-lg shadow-lg py-2 border dark:border-gray-700 z-50"
                  >
                    {user ? (
                      <>
                        <div className="px-4 py-3 border-b dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
                          <p className="text-xs text-gray-500 dark:text-gray-400">Connecté en tant que</p>
                          <p className="font-medium text-gray-900 dark:text-white truncate">{user.email}</p>
                        </div>
                        <Link to="/profile" className="block px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700" onClick={() => setIsUserMenuOpen(false)}>Mon Profil</Link>
                        <Link to="/orders" className="block px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700" onClick={() => setIsUserMenuOpen(false)}>Mes Commandes</Link>
                        <Link to="/favorites" className="block px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 lg:hidden" onClick={() => setIsUserMenuOpen(false)}>Mes Favoris</Link>
                        {isAdmin && <Link to="/dashboard" className="block px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700" onClick={() => setIsUserMenuOpen(false)}>Dashboard Admin</Link>}
                        <div className="border-t dark:border-gray-700 my-1" />
                        <button onClick={handleSignOut} className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20">Déconnexion</button>
                      </>
                    ) : (
                      <>
                        <Link to="/login" className="block px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700" onClick={() => setIsUserMenuOpen(false)}>Connexion</Link>
                        <Link to="/register" className="block px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700" onClick={() => setIsUserMenuOpen(false)}>Inscription</Link>
                      </>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Menu hamburger */}
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="lg:hidden p-2 text-gray-700 dark:text-gray-300 hover:text-primary-600 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors">
              {isMenuOpen ? <XMarkIcon className="h-6 w-6" /> : <Bars3Icon className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Menu mobile */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden overflow-hidden border-t border-gray-200 dark:border-gray-700 mt-2"
            >
              <div className="py-4 space-y-4">
                <form onSubmit={handleSearch} className="relative">
                  <input
                    type="text"
                    placeholder="Rechercher..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full px-4 py-2 pl-10 pr-4 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-800 dark:text-white"
                  />
                  <MagnifyingGlassIcon className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                </form>

                <Link to="/cart" className="flex items-center justify-between px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors" onClick={() => setIsMenuOpen(false)}>
                  <span className="flex items-center space-x-2">
                    <ShoppingCartIcon className="h-5 w-5" />
                    <span>Mon panier</span>
                  </span>
                  {cartItemsCount > 0 && (
                    <span className="bg-accent-500 text-white text-xs rounded-full px-2 py-0.5">
                      {cartItemsCount}
                    </span>
                  )}
                </Link>

                <div className="flex flex-col space-y-1">
                  <Link to="/" className={`px-4 py-2 rounded-lg transition-colors ${location.pathname === '/' ? 'bg-primary-600 text-white' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'}`} onClick={() => setIsMenuOpen(false)}>Accueil</Link>
                  <Link to="/products" className={`px-4 py-2 rounded-lg transition-colors ${location.pathname.includes('/products') ? 'bg-primary-600 text-white' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'}`} onClick={() => setIsMenuOpen(false)}>Produits</Link>
                  <Link to="/about" className={`px-4 py-2 rounded-lg transition-colors ${location.pathname === '/about' ? 'bg-primary-600 text-white' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'}`} onClick={() => setIsMenuOpen(false)}>À propos</Link>
                  <Link to="/contact" className={`px-4 py-2 rounded-lg transition-colors ${location.pathname === '/contact' ? 'bg-primary-600 text-white' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'}`} onClick={() => setIsMenuOpen(false)}>Contact</Link>
                  {isAdmin && <Link to="/dashboard" className={`px-4 py-2 rounded-lg transition-colors ${location.pathname.includes('/dashboard') ? 'bg-primary-600 text-white' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'}`} onClick={() => setIsMenuOpen(false)}>Dashboard</Link>}
                  {!user && (
                    <>
                      <Link to="/login" className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg" onClick={() => setIsMenuOpen(false)}>Connexion</Link>
                      <Link to="/register" className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg" onClick={() => setIsMenuOpen(false)}>Inscription</Link>
                    </>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </header>
  )
}