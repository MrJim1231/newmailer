import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext' // ✅ Подключаем контекст

const AdminLogin = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()
  const { login } = useAuth() // ✅ Используем login из AuthContext

  const handleLogin = async (e) => {
    e.preventDefault()
    setError('')

    try {
      const response = await fetch('http://localhost/newmailer/backend/api/admin_login.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()

      if (data.success) {
        login(data.user, data.token) // ✅ сохраняем в контекст + localStorage
        navigate('/admin/dashboard')
      } else {
        setError(data.error)
      }
    } catch (err) {
      console.error('Ошибка запроса:', err)
      setError('Ошибка сервера. Попробуйте позже.')
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      <form onSubmit={handleLogin} className="bg-white p-6 rounded-2xl shadow-md w-full max-w-md space-y-4">
        <h2 className="text-2xl font-bold text-center">Вход для суперадмина</h2>
        {error && <p className="text-red-500 text-center">{error}</p>}

        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full px-4 py-2 border rounded-xl" />

        <input type="password" placeholder="Пароль" value={password} onChange={(e) => setPassword(e.target.value)} required className="w-full px-4 py-2 border rounded-xl" />

        <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded-xl hover:bg-blue-700 transition">
          Войти
        </button>
      </form>
    </div>
  )
}

export default AdminLogin
