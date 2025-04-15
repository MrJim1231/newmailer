import React, { useEffect, useState } from 'react'

const AdminUsersList = () => {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetch('http://localhost/newmailer/backend/api/admin_get_users.php') // сюда вставь актуальный адрес
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          setUsers(data.users)
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

  if (loading) return <p>Загрузка пользователей...</p>
  if (error) return <p style={{ color: 'red' }}>{error}</p>

  return (
    <div>
      <h2>Список пользователей</h2>
      <table border="1" cellPadding="8" style={{ borderCollapse: 'collapse', width: '100%' }}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Email</th>
            <th>Роль</th>
            <th>Дата регистрации</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>{user.id}</td>
              <td>{user.email}</td>
              <td>{user.role}</td>
              <td>{user.created_at}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default AdminUsersList
