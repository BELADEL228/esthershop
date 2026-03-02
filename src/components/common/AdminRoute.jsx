import React from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { LoadingSpinner } from './LoadingSpinner'

export const AdminRoute = ({ children }) => {
  const { user, isAdmin, loading } = useAuth()
  const location = useLocation()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    )
  }

  if (!user || !isAdmin) {
    // Rediriger vers une page d'erreur avec l'information d'où il venait
    return <Navigate to="/unauthorized" state={{ from: location }} replace />
  }

  return children
}