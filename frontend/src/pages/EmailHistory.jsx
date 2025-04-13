import React, { useEffect, useState } from 'react'
import styles from '../styles/EmailHistory.module.css'

function EmailHistory() {
  const [history, setHistory] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchHistory()
  }, [])

  const fetchHistory = () => {
    fetch('http://your-server.com/api/get_history.php')
      .then((response) => response.json())
      .then((data) => {
        setHistory(data)
        setLoading(false)
      })
      .catch((error) => {
        console.error('Ошибка при загрузке истории:', error)
        setLoading(false)
      })
  }

  const clearHistory = () => {
    if (!window.confirm('Вы уверены, что хотите очистить всю историю?')) return

    fetch('http://your-server.com/api/clear_history.php', {
      method: 'POST',
    })
      .then((response) => response.json())
      .then((data) => {
        alert(data.message)
        fetchHistory()
      })
      .catch((error) => {
        console.error('Ошибка при очистке:', error)
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
              <th>ID</th>
              <th>Email</th>
              <th>Тема</th>
              <th>Сообщение</th>
              <th>Дата</th>
            </tr>
          </thead>
          <tbody>
            {history.map((item) => (
              <tr key={item.id}>
                <td>{item.id}</td>
                <td>{item.email}</td>
                <td>{item.subject}</td>
                <td>{item.message}</td>
                <td>{item.sent_at}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}

export default EmailHistory
