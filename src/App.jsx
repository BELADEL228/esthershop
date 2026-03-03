import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AuthProvider } from './contexts/AuthProvider'
import { CartProvider } from './contexts/CartProvider'
import { ThemeProvider } from './contexts/ThemeProvider'
import { Header } from './components/common/Header'
import { Footer } from './components/common/Footer'
import { ProtectedRoute } from './components/common/ProtectedRoute'
import { AdminRoute } from './components/common/AdminRoute'
import { ErrorBoundary } from './components/common/ErrorBoundary'

// Pages d'authentification
import { Login } from './pages/Login'
import { Register } from './pages/Register'

// Pages publiques
import { Home } from './pages/Home'
import { Products } from './pages/Products'
import { ProductDetail } from './pages/ProductDetail'
import { Cart } from './pages/Cart'

// Pages informatives
import { About } from './pages/About'
import { Contact } from './pages/Contact'
import { FAQ } from './pages/FAQ'
import { Shipping } from './pages/Shipping'
import { Returns } from './pages/Returns'
import { Terms } from './pages/Terms'
import { Privacy } from './pages/Privacy'
import { Unauthorized } from './pages/Unauthorized'

// Pages protégées (utilisateur connecté)
import { Profile } from './pages/Profile'
import { Orders } from './pages/Orders'
import { OrderSuccess } from './pages/OrderSuccess'
import { Favorites } from './pages/Favorites'
import { Checkout } from './pages/Checkout'

// Pages dashboard (admin)
import { DashboardLayout } from './pages/Dashboard/DashboardLayout'
import { DashboardHome } from './pages/Dashboard/DashboardHome'
import { NewsletterManagement } from './pages/Dashboard/newsletterManagement'
import { ProductsManagement } from './pages/Dashboard/ProductsManagement'
import { MessagesManagement } from './pages/Dashboard/MessagesManagement'
import { OrdersManagement } from './pages/Dashboard/OrdersManagement'
import { UsersManagement } from './pages/Dashboard/UsersManagement'
import { Settings } from './pages/Dashboard/Settings'

const queryClient = new QueryClient()

function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <Router
          future={{
            v7_startTransition: true,
            v7_relativeSplatPath: true,
          }}
        >
          <AuthProvider>
            <CartProvider>
              <ThemeProvider>
                <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col">
                  <Toaster 
                    position="top-right"
                    toastOptions={{
                      duration: 3000,
                      style: {
                        background: '#363636',
                        color: '#fff',
                      },
                      success: {
                        duration: 3000,
                        iconTheme: {
                          primary: '#10b981',
                          secondary: '#fff',
                        },
                      },
                      error: {
                        duration: 4000,
                        iconTheme: {
                          primary: '#ef4444',
                          secondary: '#fff',
                        },
                      },
                    }}
                  />
                  
                  <Header />
                  
                  <main className="flex-grow">
                    <Routes>
                      {/* ===== ROUTES PUBLIQUES ===== */}
                      <Route path="/" element={<Home />} />
                      <Route path="/products" element={<Products />} />
                      <Route path="/products/:id" element={<ProductDetail />} />
                      <Route path="/cart" element={<Cart />} />
                      
                      {/* ===== ROUTES D'AUTHENTIFICATION ===== */}
                      <Route path="/login" element={<Login />} />
                      <Route path="/register" element={<Register />} />
                      
                      {/* ===== ROUTES INFORMATIVES ===== */}
                      <Route path="/about" element={<About />} />
                      <Route path="/contact" element={<Contact />} />
                      <Route path="/faq" element={<FAQ />} />
                      <Route path="/shipping" element={<Shipping />} />
                      <Route path="/returns" element={<Returns />} />
                      <Route path="/terms" element={<Terms />} />
                      <Route path="/privacy" element={<Privacy />} />
                      <Route path="/unauthorized" element={<Unauthorized />} />
                      
                      {/* ===== ROUTES PROTÉGÉES (UTILISATEUR CONNECTÉ) ===== */}
                      <Route path="/profile" element={
                        <ProtectedRoute>
                          <Profile />
                        </ProtectedRoute>
                      } />
                      
                      <Route path="/orders" element={
                        <ProtectedRoute>
                          <Orders />
                        </ProtectedRoute>
                      } />
                      <Route path="/orders/success/:id" element={
                        <ProtectedRoute>
                          <OrderSuccess />
                        </ProtectedRoute>
                      } />
                      <Route path="/favorites" element={
                        <ProtectedRoute>
                          <Favorites />
                        </ProtectedRoute>
                      } />
                      
                      <Route path="/checkout" element={
                        <ProtectedRoute>
                          <Checkout />
                        </ProtectedRoute>
                      } />
                      
                      {/* ===== ROUTES ADMIN ===== */}
                      <Route path="/dashboard" element={
                        <AdminRoute>
                          <DashboardLayout />
                        </AdminRoute>
                      }>
                        <Route index element={<DashboardHome />} />
                        <Route path="products" element={<ProductsManagement />} />
                        <Route path="orders" element={<OrdersManagement />} />
                        <Route path="users" element={<UsersManagement />} />
                        <Route path="newsletter" element={<NewsletterManagement />} />
                        <Route path="messages" element={<MessagesManagement />} />
                        <Route path="settings" element={<Settings />} />
                      </Route>
                      
                      {/* ===== REDIRECTION 404 ===== */}
                      <Route path="*" element={<Navigate to="/" replace />} />
                    </Routes>
                  </main>
                  
                  <Footer />
                </div>
              </ThemeProvider>
            </CartProvider>
          </AuthProvider>
        </Router>
      </QueryClientProvider>
    </ErrorBoundary>
  )
}

export default App