import { useState } from 'react'
import { API_URL } from '../api/config'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import styles from '../styles/AdminLogin.module.css'

const AdminLogin = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()
  const { login } = useAuth()

  const handleLogin = async (e) => {
    e.preventDefault()
    setError('')

    try {
      const response = await fetch(`${API_URL}admin_login.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()

      if (data.success) {
        login(data.user, data.token)
        navigate('/admin/dashboard')
      } else {
        setError(data.error)
      }
    } catch (err) {
      console.error('Ошибка запроса:', err)
      setError('Ошибка сервера. Попробуйте позже.')
    }
  }

  return (
    <div className={styles.container}>
      <form onSubmit={handleLogin} className={styles.form}>
        <h2 className={styles.title}>Вход для суперадмина</h2>
        {error && <p className={styles.error}>{error}</p>}

        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required className={styles.input} />

        <input type="password" placeholder="Пароль" value={password} onChange={(e) => setPassword(e.target.value)} required className={styles.input} />

        <button type="submit" className={styles.button}>
          Войти
        </button>
      </form>
    </div>
  )
}

export default AdminLogin
