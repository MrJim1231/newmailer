import React, { useState } from 'react'
import axios from 'axios'

const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState(null)

  const handleLogin = async (e) => {
    e.preventDefault()

    try {
      const response = await axios.post('http://localhost/newmailer/backend/api/login.php', {
        email,
        password,
      })

      const { token, user, message } = response.data

      // Сохраняем токен и данные пользователя в localStorage
      localStorage.setItem('token', token)
      localStorage.setItem('user', JSON.stringify(user))

      setMessage(message)
      console.log('Успешный вход:', response.data)

      // Можно сделать редирект
      // window.location.href = '/dashboard'
    } catch (error) {
      if (error.response) {
        setMessage(error.response.data.error)
      } else {
        setMessage('Ошибка соединения с сервером')
      }
    }
  }

  return (
    <div style={styles.container}>
      <h2>Вход в личный кабинет</h2>
      <form onSubmit={handleLogin} style={styles.form}>
        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required style={styles.input} />
        <input type="password" placeholder="Пароль" value={password} onChange={(e) => setPassword(e.target.value)} required style={styles.input} />
        <button type="submit" style={styles.button}>
          Войти
        </button>
      </form>

      {message && <p style={styles.message}>{message}</p>}
    </div>
  )
}

const styles = {
  container: {
    maxWidth: '400px',
    margin: '50px auto',
    padding: '30px',
    border: '1px solid #ddd',
    borderRadius: '10px',
    textAlign: 'center',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '15px',
  },
  input: {
    padding: '12px',
    fontSize: '16px',
    borderRadius: '5px',
    border: '1px solid #ccc',
  },
  button: {
    padding: '12px',
    fontSize: '16px',
    backgroundColor: '#4CAF50',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
  },
  message: {
    marginTop: '20px',
    color: '#333',
  },
}

export default Login
