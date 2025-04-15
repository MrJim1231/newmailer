import React, { useEffect, useState } from 'react'

const AdminUsersList = () => {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [updateStatus, setUpdateStatus] = useState('')
  const [userEdits, setUserEdits] = useState({}) // <--- сюда изменения по id

  useEffect(() => {
    fetch('http://localhost/newmailer/backend/api/admin_get_users.php')
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          setUsers(data.users)
          // заполняем userEdits начальными данными
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
  }, [])

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

  if (loading) return <p>Загрузка пользователей...</p>
  if (error) return <p style={{ color: 'red' }}>{error}</p>

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Список пользователей</h2>
      {updateStatus && <p className="mb-4 text-blue-600">{updateStatus}</p>}
      <table border="1" cellPadding="8" style={{ borderCollapse: 'collapse', width: '100%' }}>
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
                <select value={userEdits[user.id]?.role || 'user'} onChange={(e) => handleEditChange(user.id, 'role', e.target.value)}>
                  <option value="user">user</option>
                  <option value="admin">admin</option>
                  <option value="superadmin">superadmin</option>
                </select>
              </td>
              <td>
                <input type="text" value={userEdits[user.id]?.password || ''} placeholder="Новый пароль" onChange={(e) => handleEditChange(user.id, 'password', e.target.value)} />
              </td>
              <td>
                <button onClick={() => handleUpdate(user.id)} className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600">
                  Сохранить
                </button>
              </td>
              <td>{user.created_at}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default AdminUsersList
