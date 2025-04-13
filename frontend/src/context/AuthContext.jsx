import React, { createContext, useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(null)
  const [loading, setLoading] = useState(true) // Важный флаг загрузки
  const navigate = useNavigate()

  // Загрузка данных из localStorage при монтировании компонента
  useEffect(() => {
    const storedUser = localStorage.getItem('user')
    const storedToken = localStorage.getItem('token')

    if (storedUser && storedToken) {
      setUser(JSON.parse(storedUser))
      setToken(storedToken)
    }

    // Убираем загрузку после того, как данные загружены
    setLoading(false)
  }, [])

  const login = (userData, userToken) => {
    localStorage.setItem('user', JSON.stringify(userData))
    localStorage.setItem('token', userToken)
    setUser(userData)
    setToken(userToken)
  }

  const logout = () => {
    localStorage.removeItem('user')
    localStorage.removeItem('token')
    setUser(null)
    setToken(null)
    navigate('/login')
  }

  // Если состояние в процессе загрузки, ничего не рендерим
  if (loading) {
    return null // или можно добавить спиннер
  }

  return <AuthContext.Provider value={{ user, token, login, logout, loading }}>{children}</AuthContext.Provider>
}

export const useAuth = () => React.useContext(AuthContext)
