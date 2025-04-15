import React, { useEffect, useState } from 'react'
import styles from '../styles/AdminUsersList.module.css'

const AdminUsersList = () => {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [updateStatus, setUpdateStatus] = useState('')
  const [userEdits, setUserEdits] = useState({})
  const [newUser, setNewUser] = useState({ email: '', password: '', role: 'user' })
  const [addStatus, setAddStatus] = useState('')

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = () => {
    setLoading(true)
    fetch('http://localhost/newmailer/backend/api/admin_get_users.php')
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          setUsers(data.users)
          const initialEdits = {}
          data.users.forEach((user) => {
            initialEdits[user.id] = { role: user.role, password: '' }
          })
          setUserEdits(initialEdits)
        } else {
          setError(data.error || 'Ошибка при загрузке пользователей')
        }
        setLoading(false)
      })
      .catch((err) => {
        setError('Произошла ошибка: ' + err.message)
        setLoading(false)
      })
  }

  const handleEditChange = (id, field, value) => {
    setUserEdits((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        [field]: value,
      },
    }))
  }

  const handleUpdate = (id) => {
    const { role, password } = userEdits[id]
    setUpdateStatus('')

    fetch('http://localhost/newmailer/backend/api/admin_update_user.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, role, password }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setUpdateStatus('Изменения успешно сохранены')
          setUsers((prev) => prev.map((user) => (user.id === id ? { ...user, role } : user)))
        } else {
          setUpdateStatus('Ошибка: ' + data.error)
        }
      })
      .catch((err) => {
        setUpdateStatus('Ошибка запроса: ' + err.message)
      })
  }

  const handleDelete = (id) => {
    if (!window.confirm('Вы уверены, что хотите удалить пользователя?')) return

    fetch('http://localhost/newmailer/backend/api/admin_delete_user.php', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setUsers((prev) => prev.filter((user) => user.id !== id))
        } else {
          alert('Ошибка удаления: ' + data.error)
        }
      })
      .catch((err) => {
        alert('Ошибка запроса: ' + err.message)
      })
  }

  const handleNewUserChange = (field, value) => {
    setNewUser((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleAddUser = () => {
    setAddStatus('')
    const { email, password, role } = newUser

    if (!email || !password) {
      setAddStatus('Заполните все поля')
      return
    }

    fetch('http://localhost/newmailer/backend/api/admin_add_user.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, role }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setAddStatus('Пользователь успешно добавлен')
          setNewUser({ email: '', password: '', role: 'user' })
          fetchUsers()
        } else {
          setAddStatus('Ошибка: ' + data.error)
        }
      })
      .catch((err) => {
        setAddStatus('Ошибка запроса: ' + err.message)
      })
  }

  if (loading) return <p>Загрузка пользователей...</p>
  if (error) return <p className={styles.error}>{error}</p>

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Список пользователей</h2>

      {updateStatus && <p className={styles.status}>{updateStatus}</p>}

      <table className={styles.table}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Email</th>
            <th>Роль</th>
            <th>Новая роль</th>
            <th>Новый пароль</th>
            <th>Действия</th>
            <th>Дата регистрации</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>{user.id}</td>
              <td>{user.email}</td>
              <td>{user.role}</td>
              <td>
                <select value={userEdits[user.id]?.role || 'user'} onChange={(e) => handleEditChange(user.id, 'role', e.target.value)} className={styles.select}>
                  <option value="user">user</option>
                  <option value="admin">admin</option>
                  <option value="superadmin">superadmin</option>
                </select>
              </td>
              <td>
                <input
                  type="text"
                  value={userEdits[user.id]?.password || ''}
                  placeholder="Новый пароль"
                  onChange={(e) => handleEditChange(user.id, 'password', e.target.value)}
                  className={styles.input}
                />
              </td>
              <td>
                <button onClick={() => handleUpdate(user.id)} className={styles.button}>
                  Сохранить
                </button>
                <button onClick={() => handleDelete(user.id)} className={styles.deleteButton}>
                  Удалить
                </button>
              </td>
              <td>{user.created_at}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h3 className={styles.subtitle}>Добавить нового пользователя</h3>
      {addStatus && <p className={styles.status}>{addStatus}</p>}

      <div className={styles.addForm}>
        <input type="email" value={newUser.email} onChange={(e) => handleNewUserChange('email', e.target.value)} placeholder="Email" className={styles.input} />
        <input type="password" value={newUser.password} onChange={(e) => handleNewUserChange('password', e.target.value)} placeholder="Пароль" className={styles.input} />
        <select value={newUser.role} onChange={(e) => handleNewUserChange('role', e.target.value)} className={styles.select}>
          <option value="user">user</option>
          <option value="admin">admin</option>
          <option value="superadmin">superadmin</option>
        </select>
        <button onClick={handleAddUser} className={styles.button}>
          Добавить пользователя
        </button>
      </div>
    </div>
  )
}

export default AdminUsersList
