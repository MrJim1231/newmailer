import React, { useState } from 'react'
import axios from 'axios'
import { useAuth } from '../context/AuthContext' // 👈
import { useNavigate } from 'react-router-dom' // 👈

const Register = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState(null)

  const { login } = useAuth() // 👈 получаем функцию login из контекста
  const navigate = useNavigate()

  const handleRegister = async (e) => {
    e.preventDefault()

    try {
      const response = await axios.post('http://localhost/newmailer/backend/api/register.php', {
        email,
        password,
      })

      const { token, user, message } = response.data

      // 👇 авторизуем сразу после регистрации
      login(user, token)
      setMessage(message)
      console.log('Успешная регистрация:', response.data)

      navigate('/') // 👈 редирект на главную
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
      <h2>Регистрация</h2>
      <form onSubmit={handleRegister} style={styles.form}>
        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required style={styles.input} />
        <input type="password" placeholder="Пароль" value={password} onChange={(e) => setPassword(e.target.value)} required style={styles.input} />
        <button type="submit" style={styles.button}>
          Зарегистрироваться
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
    backgroundColor: '#2196F3',
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

export default Register
