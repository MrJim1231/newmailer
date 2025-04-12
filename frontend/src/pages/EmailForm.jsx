import { useEffect, useState } from 'react'
import axios from 'axios'
import { API_URL } from '../api/config'

function EmailForm() {
  const [formData, setFormData] = useState({
    email: '',
    subject: '',
    message: '',
    account_id: '', // Добавляем сюда выбранный аккаунт
  })

  const [accounts, setAccounts] = useState([])
  const [responseMessage, setResponseMessage] = useState('')

  useEffect(() => {
    // Загружаем список аккаунтов
    axios
      .get(`${API_URL}get_accounts.php`)
      .then((res) => {
        setAccounts(res.data)
      })
      .catch((err) => {
        console.error('Ошибка при загрузке аккаунтов:', err)
      })
  }, [])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    console.log('Submitting form with data:', formData)

    try {
      const response = await axios.post(`${API_URL}send_email.php`, formData, {
        headers: {
          'Content-Type': 'application/json',
        },
      })

      console.log('Response from server:', response.data)
      setResponseMessage(response.data.message)
    } catch (error) {
      console.error('Error sending email:', error)
      setResponseMessage('Error sending email')
    }
  }

  return (
    <div>
      <h2>Send an Email</h2>
      <form onSubmit={handleSubmit}>
        <select name="account_id" value={formData.account_id} onChange={handleChange} required>
          <option value="">Выберите аккаунт</option>
          {accounts.map((acc) => (
            <option key={acc.id} value={acc.id}>
              {acc.account_name} ({acc.MAIL_USERNAME})
            </option>
          ))}
        </select>

        <input type="email" name="email" placeholder="Recipient Email" value={formData.email} onChange={handleChange} required />
        <input type="text" name="subject" placeholder="Subject" value={formData.subject} onChange={handleChange} required />
        <textarea name="message" placeholder="Message" value={formData.message} onChange={handleChange} required />
        <button type="submit">Send</button>
      </form>
      {responseMessage && <p>{responseMessage}</p>}
    </div>
  )
}

export default EmailForm
