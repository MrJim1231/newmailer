import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext' // Импортируем useAuth из контекста
import styles from '../styles/Profile.module.css'

const Profile = () => {
  const { user, logout, loading } = useAuth() // Используем хук useAuth
  const navigate = useNavigate()

  useEffect(() => {
    if (loading) return // Ждем, пока загрузится состояние

    if (!user) {
      navigate('/auth/login') // Перенаправляем, если пользователь не авторизован
    }
  }, [user, loading, navigate])

  const handleLogout = () => {
    logout() // Вызываем метод logout из контекста
  }

  if (loading) {
    return <div className={styles.container}>Загрузка...</div> // Пока идет загрузка
  }

  if (!user) {
    return <div className={styles.container}>Пользователь не найден</div> // В случае ошибки
  }

  return (
    <div className={styles.container}>
      <h2>Профиль</h2>
      <div className={styles.infoBox}>
        <p>
          <strong>Email:</strong> {user.email}
        </p>
        <p>
          <strong>ID:</strong> {user.id}
        </p>
        <p>
          <strong>Роль:</strong> {user.role}
        </p>
        <p>
          <strong>Создан:</strong> {user.created_at}
        </p>
      </div>
      <button onClick={handleLogout} className={styles.button}>
        Выйти
      </button>
    </div>
  )
}

export default Profile
