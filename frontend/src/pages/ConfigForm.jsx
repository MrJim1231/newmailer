import { useState } from 'react'
import axios from 'axios'
import { API_URL } from '../api/config' // Путь к вашему API
import jwt_decode from 'jwt-decode' // Используйте правильный импорт
import styles from '../styles/ConfigForm.module.css'

function ConfigForm() {
  const [formData, setFormData] = useState({
    account_name: '',
    MAIL_USERNAME: '',
    MAIL_PASSWORD: '',
    MAIL_HOST: 'smtp.gmail.com',
    MAIL_PORT: 587,
    MAIL_ENCRYPTION: 'STARTTLS',
    user_id: 1, // Это значение должно быть извлечено из токена
  })

  const [responseMessage, setResponseMessage] = useState('')

  // Функция для получения user_id из токена
  const getUserIdFromToken = () => {
    const token = localStorage.getItem('token')
    if (token) {
      const decoded = jwt_decode(token)
      return decoded.sub // user_id
    }
    return null
  }

  // Обновление данных формы
  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }))
  }

  // Отправка данных на сервер
  const handleSubmit = async (e) => {
    e.preventDefault()

    // Логирование данных формы
    console.log('Form Data:', formData)

    // Добавляем user_id из токена
    const userId = getUserIdFromToken()
    if (userId) {
      formData.user_id = userId
    } else {
      setResponseMessage('Ошибка: токен не найден')
      return
    }

    try {
      const response = await axios.post(`${API_URL}save_config.php`, formData, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`, // Передаем токен
        },
      })

      setResponseMessage(response.data.message)

      // Очистка формы после успешного сохранения
      setFormData({
        account_name: '',
        MAIL_USERNAME: '',
        MAIL_PASSWORD: '',
        MAIL_HOST: 'smtp.gmail.com',
        MAIL_PORT: 587,
        MAIL_ENCRYPTION: 'STARTTLS',
        user_id: 1,
      })
    } catch (error) {
      console.error('Ошибка при сохранении данных:', error.response ? error.response.data : error.message)
      setResponseMessage('Ошибка при сохранении данных')
    }
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Настройки почты</h1>
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formGroup}>
          <label className={styles.label}>Имя аккаунта</label>
          <input type="text" name="account_name" value={formData.account_name} onChange={handleChange} placeholder="Имя аккаунта" required className={styles.input} />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>MAIL_USERNAME</label>
          <input type="email" name="MAIL_USERNAME" value={formData.MAIL_USERNAME} onChange={handleChange} placeholder="MAIL_USERNAME" required className={styles.input} />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>MAIL_PASSWORD</label>
          <input type="password" name="MAIL_PASSWORD" value={formData.MAIL_PASSWORD} onChange={handleChange} placeholder="MAIL_PASSWORD" required className={styles.input} />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>MAIL_HOST</label>
          <input type="text" name="MAIL_HOST" value={formData.MAIL_HOST} onChange={handleChange} readOnly required className={styles.input} />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>MAIL_PORT</label>
          <input type="number" name="MAIL_PORT" value={formData.MAIL_PORT} onChange={handleChange} readOnly required className={styles.input} />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>MAIL_ENCRYPTION</label>
          <input type="text" name="MAIL_ENCRYPTION" value={formData.MAIL_ENCRYPTION} onChange={handleChange} readOnly required className={styles.input} />
        </div>

        <button type="submit" className={styles.button}>
          Сохранить
        </button>
      </form>

      {responseMessage && <p className={styles.responseMessage}>{responseMessage}</p>}
    </div>
  )
}

export default ConfigForm
