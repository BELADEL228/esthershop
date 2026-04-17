import React from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { LoadingSpinner } from './LoadingSpinner'

export const AdminRoute = ({ children }) => {
  const { user, isAdmin, loading } = useAuth()
  const location = useLocation()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-secondary-50 dark:from-gray-900 dark:to-gray-800">
        <LoadingSpinner />
      </div>
    )
  }

  if (!user || !isAdmin) {
    // Redirection vers une page d'erreur avec informations
    return <Navigate to="/unauthorized" state={{ from: location }} replace />
  }

  return children
}