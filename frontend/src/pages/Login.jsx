import React, { useState } from 'react'
import axios from 'axios'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import styles from '../styles/AuthPage.module.css'

const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState(null)

  const { login } = useAuth()
  const navigate = useNavigate()

  const handleLogin = async (e) => {
    e.preventDefault()

    try {
      const response = await axios.post('http://localhost/newmailer/backend/api/login.php', {
        email,
        password,
      })

      const { token, user, message } = response.data

      if (user.role !== 'admin') {
        // Проверка роли пользователя
        setMessage('Доступ только для администратора')
        return
      }

      login(user, token)
      setMessage(message)
      console.log('Успешный вход:', response.data)
      navigate('/')
    } catch (error) {
      if (error.response) {
        setMessage(error.response.data.error)
      } else {
        setMessage('Ошибка соединения с сервером')
      }
    }
  }

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Вход в личный кабинет</h2>
      <form onSubmit={handleLogin} className={styles.form}>
        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required className={styles.input} />
        <input type="password" placeholder="Пароль" value={password} onChange={(e) => setPassword(e.target.value)} required className={styles.input} />
        <button type="submit" className={styles.button}>
          Войти
        </button>
      </form>
      {message && <p className={styles.message}>{message}</p>}
    </div>
  )
}

export default Login
