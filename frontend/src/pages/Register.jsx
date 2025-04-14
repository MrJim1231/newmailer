import React, { useState } from 'react'
import axios from 'axios'
import styles from '../styles/AuthPage.module.css'

const Register = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState(null)
  const [error, setError] = useState(null)

  const handleRegister = async (e) => {
    e.preventDefault()
    setMessage(null)
    setError(null)

    try {
      const response = await axios.post('http://localhost/newmailer/backend/api/register.php', {
        email,
        password,
      })

      const data = response.data

      if (data.success) {
        setMessage(data.message)
      } else {
        setError(data.error || 'Ошибка при регистрации')
      }
    } catch (err) {
      setError('Ошибка соединения с сервером')
    }
  }

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Регистрация</h2>
      <form onSubmit={handleRegister} className={styles.form}>
        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required className={styles.input} />
        <input type="password" placeholder="Пароль" value={password} onChange={(e) => setPassword(e.target.value)} required className={styles.input} />
        <button type="submit" className={styles.button}>
          Зарегистрироваться
        </button>
      </form>

      {message && (
        <p className={styles.message} style={{ color: 'green' }}>
          {message}
        </p>
      )}
      {error && (
        <p className={styles.message} style={{ color: 'red' }}>
          {error}
        </p>
      )}
    </div>
  )
}

export default Register
