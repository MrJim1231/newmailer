import { useState } from 'react'
import axios from 'axios'

function EmailForm() {
  const [formData, setFormData] = useState({
    email: '',
    subject: '',
    message: '',
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
      const response = await axios.post('http://localhost/backend/api/send_mail.php', formData, {
        headers: {
          'Content-Type': 'application/json',
        },
      })

      setResponseMessage(response.data.message)
    } catch (error) {
      setResponseMessage('Ошибка при отправке письма')
    }
  }

  return (
    <div>
      <h1>Send an Email</h1>
      <form onSubmit={handleSubmit}>
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
