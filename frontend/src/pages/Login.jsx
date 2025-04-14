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

    if (!email.trim() || !password.trim()) {
      setMessage('Пожалуйста, заполните все поля')
      return
    }

    try {
      const response = await axios.post('http://localhost/newmailer/backend/api/login.php', {
        email,
        password,
      })

      const data = response.data

      if (data.success === false) {
        setMessage(data.error || 'Неверные данные для входа')
        return
      }

      const { token, user, message } = data

      if (user.role !== 'admin') {
        setMessage('Доступ только для администратора')
        return
      }

      login(user, token)
      setMessage(message)
      navigate('/')
    } catch (error) {
      console.error('Ошибка входа:', error)
      setMessage('Ошибка соединения с сервером')
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
