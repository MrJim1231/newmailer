import { useEffect, useState } from 'react'
import axios from 'axios'
import { API_URL } from '../api/config'
import styles from '../styles/DeleteAccount.module.css'

function DeleteAccount() {
  const [accounts, setAccounts] = useState([])
  const [message, setMessage] = useState('')

  useEffect(() => {
    fetchAccounts()
  }, [])

  const fetchAccounts = () => {
    axios
      .get(`${API_URL}get_accounts.php`)
      .then((res) => {
        setAccounts(res.data)
      })
      .catch((err) => {
        console.error('Ошибка при загрузке аккаунтов:', err)
      })
  }

  const handleDelete = (id) => {
    if (window.confirm('Вы уверены, что хотите удалить этот аккаунт?')) {
      axios
        .post(
          `${API_URL}delete_account.php`,
          { id },
          {
            headers: {
              'Content-Type': 'application/json',
            },
          }
        )
        .then((res) => {
          setMessage(res.data.message)
          fetchAccounts() // обновляем список после удаления
        })
        .catch((err) => {
          console.error('Ошибка при удалении:', err)
          setMessage('Ошибка при удалении аккаунта')
        })
    }
  }

  return (
    <div className={styles.container}>
      <h2>Список аккаунтов</h2>
      {accounts.length === 0 ? (
        <p>Нет доступных аккаунтов.</p>
      ) : (
        <ul className={styles.accountList}>
          {accounts.map((acc) => (
            <li key={acc.id} className={styles.accountItem}>
              <span>
                {acc.account_name} ({acc.MAIL_USERNAME})
              </span>
              <button onClick={() => handleDelete(acc.id)} className={styles.deleteButton}>
                Удалить аккаунт
              </button>
            </li>
          ))}
        </ul>
      )}

      {message && <p className={styles.message}>{message}</p>}
    </div>
  )
}

export default DeleteAccount
