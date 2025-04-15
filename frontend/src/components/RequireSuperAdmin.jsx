// src/components/RequireSuperAdmin.jsx
import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const RequireSuperAdmin = ({ children }) => {
  const { user } = useAuth()

  if (!user || user.role !== 'superadmin') {
    return <Navigate to="/admin" />
  }

  return children
}

export default RequireSuperAdmin
