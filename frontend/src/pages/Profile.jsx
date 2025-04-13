import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

const Profile = () => {
  const navigate = useNavigate()
  const [user, setUser] = useState(null)

  useEffect(() => {
    const storedUser = localStorage.getItem('user')
    const token = localStorage.getItem('token')

    if (!token || !storedUser) {
      navigate('/login') // Перенаправление, если нет токена
    } else {
      setUser(JSON.parse(storedUser))
    }
  }, [navigate])

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    navigate('/login')
  }

  if (!user) {
    return <div style={styles.container}>Загрузка...</div>
  }

  return (
    <div style={styles.container}>
      <h2>Профиль</h2>
      <div style={styles.infoBox}>
        <p>
          <strong>Email:</strong> {user.email}
        </p>
        <p>
          <strong>ID:</strong> {user.id}
        </p>
        <p>
          <strong>Роль:</strong> {user.role}
        </p>
        <p>
          <strong>Создан:</strong> {user.created_at}
        </p>
      </div>
      <button onClick={handleLogout} style={styles.button}>
        Выйти
      </button>
    </div>
  )
}

const styles = {
  container: {
    maxWidth: '500px',
    margin: '50px auto',
    padding: '30px',
    border: '1px solid #ddd',
    borderRadius: '10px',
    textAlign: 'center',
  },
  infoBox: {
    marginBottom: '20px',
    textAlign: 'left',
    lineHeight: '1.8',
  },
  button: {
    padding: '10px 20px',
    fontSize: '16px',
    backgroundColor: '#f44336',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
  },
}

export default Profile
