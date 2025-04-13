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
    attachment: [], // массив файлов
  })

  const [accounts, setAccounts] = useState([])
  const [responseMessage, setResponseMessage] = useState('')
  const [loading, setLoading] = useState(false)

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
    const files = Array.from(e.target.files)
    setFormData((prevData) => ({
      ...prevData,
      attachment: [...prevData.attachment, ...files],
    }))
  }

  const handleRemoveFile = (index) => {
    setFormData((prevData) => ({
      ...prevData,
      attachment: prevData.attachment.filter((_, i) => i !== index),
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!formData.email || !formData.subject || !formData.message || !formData.account_id) {
      alert('Заполните все обязательные поля.')
      return
    }

    const formDataToSend = new FormData()
    formDataToSend.append('email', formData.email)
    formDataToSend.append('subject', formData.subject)
    formDataToSend.append('message', formData.message)
    formDataToSend.append('account_id', formData.account_id)

    formData.attachment.forEach((file) => {
      formDataToSend.append('attachment[]', file)
    })

    setLoading(true)

    try {
      const response = await axios.post(`${API_URL}send_email.php`, formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })

      setResponseMessage(response.data.message)

      // ⬇️ очищаем форму после отправки
      setFormData({
        email: '',
        subject: '',
        message: '',
        account_id: '',
        attachment: [],
      })
    } catch (error) {
      console.error('Ошибка при отправке письма:', error)
      setResponseMessage('Ошибка при отправке письма')
    } finally {
      setLoading(false)
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

        <input type="file" name="attachment" accept=".pdf,.txt,.docx" multiple onChange={handleFileChange} className={styles.file} />

        {formData.attachment.length === 0 && <p className={styles.fileFormats}>Вы можете загрузить файлы форматов: .pdf, .txt, .docx</p>}

        {formData.attachment.length > 0 && (
          <ul className={styles.fileList}>
            {formData.attachment.map((file, index) => (
              <li key={index} className={styles.fileItem}>
                {file.name}
                <button type="button" onClick={() => handleRemoveFile(index)} className={styles.removeButton}>
                  ✕
                </button>
              </li>
            ))}
          </ul>
        )}

        <button type="submit" className={styles.button}>
          Отправить
        </button>
      </form>

      {loading && <div className={styles.loader}>Загрузка...</div>}

      {responseMessage && <p className={styles.responseMessage}>{responseMessage}</p>}
    </div>
  )
}

export default EmailForm
