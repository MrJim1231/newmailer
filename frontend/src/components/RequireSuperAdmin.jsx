import { useAuth } from '../context/AuthContext'
import { Navigate } from 'react-router-dom'

const RequireSuperAdmin = ({ children }) => {
  const { user, loading } = useAuth()

  if (loading) {
    return <div className="p-8 text-xl">Загрузка...</div> // можно спиннер
  }

  if (!user || user.role !== 'superadmin') {
    return <Navigate to="/admin" />
  }

  return children
}

export default RequireSuperAdmin
