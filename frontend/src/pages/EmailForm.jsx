import { useEffect, useState } from 'react'
import axios from 'axios'
import { API_URL } from '../api/config'
import styles from '../styles/EmailForm.module.css'

function EmailForm() {
  const [formData, setFormData] = useState({
    email: '',
    subject: '',
    message: '',
    account_id: '',
    attachment: null,
  })

  const [accounts, setAccounts] = useState([])
  const [responseMessage, setResponseMessage] = useState('')
  const [loading, setLoading] = useState(false) // Состояние для загрузки

  useEffect(() => {
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

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    setFormData((prevData) => ({
      ...prevData,
      attachment: file,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    const formDataToSend = new FormData()
    formDataToSend.append('email', formData.email)
    formDataToSend.append('subject', formData.subject)
    formDataToSend.append('message', formData.message)
    formDataToSend.append('account_id', formData.account_id)

    if (!formData.email || !formData.subject || !formData.message || !formData.account_id) {
      alert('Заполните все обязательные поля.')
      return
    }

    if (formData.attachment) {
      formDataToSend.append('attachment', formData.attachment)
    }

    setLoading(true) // Начинаем загрузку

    try {
      const response = await axios.post(`${API_URL}send_email.php`, formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })

      setResponseMessage(response.data.message)
    } catch (error) {
      console.error('Ошибка при отправке письма:', error)
      setResponseMessage('Ошибка при отправке письма')
    } finally {
      setLoading(false) // Заканчиваем загрузку
    }
  }

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Отправка письма</h2>
      <form onSubmit={handleSubmit} className={styles.form}>
        <select name="account_id" value={formData.account_id} onChange={handleChange} required className={styles.select}>
          <option value="">Выберите аккаунт</option>
          {accounts.map((acc) => (
            <option key={acc.id} value={acc.id}>
              {acc.account_name} ({acc.MAIL_USERNAME})
            </option>
          ))}
        </select>

        <input type="email" name="email" placeholder="Email получателя" value={formData.email} onChange={handleChange} required className={styles.input} />

        <input type="text" name="subject" placeholder="Тема письма" value={formData.subject} onChange={handleChange} required className={styles.input} />

        <textarea name="message" placeholder="Сообщение" value={formData.message} onChange={handleChange} required className={styles.textarea} />

        <input type="file" name="attachment" accept=".pdf,.txt,.docx" onChange={handleFileChange} className={styles.file} />

        <button type="submit" className={styles.button}>
          Отправить
        </button>
      </form>

      {/* Прелоадер */}
      {loading && <div className={styles.loader}>Загрузка...</div>}

      {responseMessage && <p className={styles.responseMessage}>{responseMessage}</p>}
    </div>
  )
}

export default EmailForm
