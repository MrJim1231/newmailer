import { useState } from 'react'
import axios from 'axios'
import { API_URL } from '../api/config' // Импортируем API_URL

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

    // Логируем данные формы в консоль перед отправкой
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
