import { useState } from 'react'
import axios from 'axios'

function ConfigForm() {
  const [formData, setFormData] = useState({
    MAIL_HOST: '',
    MAIL_USERNAME: '',
    MAIL_PASSWORD: '',
    MAIL_PORT: '',
    MAIL_ENCRYPTION: '',
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

    try {
      // Отправка данных через POST-запрос на сервер
      const response = await axios.post('http://localhost/newmailer/backend/api/save_config.php', formData, {
        headers: {
          'Content-Type': 'application/json',
        },
      })

      // Отображение сообщения о результате
      setResponseMessage(response.data.message)
    } catch (error) {
      setResponseMessage('Ошибка при сохранении данных')
    }
  }

  return (
    <div>
      <h1>Настройки почты</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>MAIL_HOST</label>
          <input type="text" name="MAIL_HOST" value={formData.MAIL_HOST} onChange={handleChange} placeholder="MAIL_HOST" required />
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
          <input type="number" name="MAIL_PORT" value={formData.MAIL_PORT} onChange={handleChange} placeholder="MAIL_PORT" required />
        </div>

        <div>
          <label>MAIL_ENCRYPTION</label>
          <input type="text" name="MAIL_ENCRYPTION" value={formData.MAIL_ENCRYPTION} onChange={handleChange} placeholder="MAIL_ENCRYPTION" required />
        </div>

        <button type="submit">Сохранить</button>
      </form>

      {responseMessage && <p>{responseMessage}</p>}
    </div>
  )
}

export default ConfigForm
