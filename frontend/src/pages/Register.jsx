import React, { useState } from 'react'
import axios from 'axios'
import styles from '../styles/AuthPage.module.css'

const Register = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState(null)

  const handleRegister = async (e) => {
    e.preventDefault()

    try {
      const response = await axios.post('http://localhost/newmailer/backend/api/register.php', {
        email,
        password,
      })

      setMessage(response.data.message)
      // console.log('Успешная регистрация:', response.data)
      // Можно сделать редирект или сразу авторизацию
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
      <h2 className={styles.title}>Регистрация</h2>
      <form onSubmit={handleRegister} className={styles.form}>
        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required className={styles.input} />
        <input type="password" placeholder="Пароль" value={password} onChange={(e) => setPassword(e.target.value)} required className={styles.input} />
        <button type="submit" className={styles.button}>
          Зарегистрироваться
        </button>
      </form>

      {message && <p className={styles.message}>{message}</p>}
    </div>
  )
}

export default Register
