// src/routes/PublicOnlyRoute.jsx
import React from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const PublicOnlyRoute = ({ children }) => {
  const { user, loading } = useAuth()

  if (loading) return null

  // ❌ Если админ — не пускаем на эту страницу, отправляем на email-form
  if (user && user.role === 'admin') {
    return <Navigate to="/email-form" replace />
  }

  return children
}

export default PublicOnlyRoute
