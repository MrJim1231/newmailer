import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { API_URL } from '../api/config'
import { API_URL_DOC } from '../api/config'
import styles from '../styles/EmailHistory.module.css'

function EmailHistory() {
  const [history, setHistory] = useState([])
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState('')

  useEffect(() => {
    fetchHistory()
  }, [])

  const fetchHistory = () => {
    axios
      .get(`${API_URL}get_history.php`)
      .then((res) => {
        setHistory(res.data)
        setLoading(false)
      })
      .catch((err) => {
        console.error('Ошибка при загрузке истории:', err)
        setLoading(false)
      })
  }

  const clearHistory = () => {
    if (!window.confirm('Вы уверены, что хотите очистить всю историю?')) return

    axios
      .post(`${API_URL}clear_history.php`)
      .then((res) => {
        alert(res.data.message)
        fetchHistory()
      })
      .catch((err) => {
        console.error('Ошибка при очистке:', err)
      })
  }

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>История отправленных писем</h2>

      <button onClick={clearHistory} className={styles.clearButton}>
        Очистить историю
      </button>

      {loading ? (
        <p className={styles.loading}>Загрузка...</p>
      ) : history.length === 0 ? (
        <p className={styles.empty}>История пустая.</p>
      ) : (
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Отправитель</th>
              <th>Email отправителя</th>
              <th>Тема</th>
              <th>Сообщение</th>
              <th>Email получателя</th>
              <th>Дата</th>
              <th>Документ(ы)</th>
            </tr>
          </thead>
          <tbody>
            {history.map((item) => (
              <tr key={item.id}>
                <td>{item.account_name}</td>
                <td>{item.account_email}</td>
                <td>{item.subject}</td>
                <td>{item.message}</td>
                <td>{item.recipient_email}</td>
                <td>{item.sent_at}</td>
                <td>
                  {item.attachment_path
                    ? item.attachment_path.split(',').map((path, index) => (
                        <div key={index}>
                          <a href={`${API_URL_DOC}${path}`} target="_blank" rel="noopener noreferrer" className={styles.fileLink}>
                            📄 Документ {index + 1}
                          </a>
                        </div>
                      ))
                    : 'Нет документа'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {message && <p className={styles.message}>{message}</p>}
    </div>
  )
}

export default EmailHistory
