import React from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const PrivateRoute = ({ children, requiredRole }) => {
  const { user } = useAuth()

  if (!user) {
    // если не залогинен — редирект на логин
    return <Navigate to="/login" />
  }

  if (requiredRole && user.role !== requiredRole) {
    // если роль не совпадает — редирект на главную
    return <Navigate to="/" />
  }

  return children
}

export default PrivateRoute
