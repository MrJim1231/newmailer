import { useState } from 'react'
import axios from 'axios'
import { API_URL } from '../api/config' // Используем API_URL

function ConfigForm() {
  // Инициализация состояния с уже заполненными значениями для почтовых параметров
  const [formData, setFormData] = useState({
    MAIL_HOST: 'smtp.gmail.com', // Значение по умолчанию для MAIL_HOST
    MAIL_PORT: 587, // Значение по умолчанию для MAIL_PORT
    MAIL_ENCRYPTION: 'STARTTLS', // Значение по умолчанию для MAIL_ENCRYPTION
    MAIL_USERNAME: '', // Для заполнения вручную
    MAIL_PASSWORD: '', // Для заполнения вручную
    account_name: '', // Добавлено поле для имени аккаунта
  })

  const [responseMessage, setResponseMessage] = useState('')

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    console.log('Submitting config with data:', formData)

    try {
      const response = await axios.post(`${API_URL}save_config.php`, formData, {
        headers: {
          'Content-Type': 'application/json',
        },
      })

      console.log('Response from server:', response.data)
      setResponseMessage(response.data.message)
    } catch (error) {
      console.error('Error saving config:', error)
      setResponseMessage('Ошибка при сохранении данных')
    }
  }

  return (
    <div>
      <h1>Настройки почты</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Имя аккаунта</label>
          <input type="text" name="account_name" value={formData.account_name} onChange={handleChange} placeholder="Имя аккаунта" required />
        </div>

        <div>
          <label>MAIL_HOST</label>
          <input
            type="text"
            name="MAIL_HOST"
            value={formData.MAIL_HOST}
            onChange={handleChange}
            placeholder="MAIL_HOST"
            readOnly // Поле для MAIL_HOST только для чтения
            required
          />
        </div>

        <div>
          <label>MAIL_USERNAME</label>
          <input type="email" name="MAIL_USERNAME" value={formData.MAIL_USERNAME} onChange={handleChange} placeholder="MAIL_USERNAME" required />
        </div>

        <div>
          <label>MAIL_PASSWORD</label>
          <input type="password" name="MAIL_PASSWORD" value={formData.MAIL_PASSWORD} onChange={handleChange} placeholder="MAIL_PASSWORD" required />
        </div>

        <div>
          <label>MAIL_PORT</label>
          <input
            type="number"
            name="MAIL_PORT"
            value={formData.MAIL_PORT}
            onChange={handleChange}
            placeholder="MAIL_PORT"
            readOnly // Поле для MAIL_PORT только для чтения
            required
          />
        </div>

        <div>
          <label>MAIL_ENCRYPTION</label>
          <input
            type="text"
            name="MAIL_ENCRYPTION"
            value={formData.MAIL_ENCRYPTION}
            onChange={handleChange}
            placeholder="MAIL_ENCRYPTION"
            readOnly // Поле для MAIL_ENCRYPTION только для чтения
            required
          />
        </div>

        <button type="submit">Сохранить</button>
      </form>

      {responseMessage && <p>{responseMessage}</p>}
    </div>
  )
}

export default ConfigForm
