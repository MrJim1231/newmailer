import React from 'react'
import UsersList from './AdminUsersList' // укажи правильный путь, если папка отличается

const AdminDashboard = () => {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-4">Панель управления (SuperAdmin)</h1>
      <p className="text-gray-600 mb-6">Добро пожаловать в административную панель. Здесь можно управлять системой.</p>

      {/* Блок со списком пользователей */}
      <div className="mt-8">
        <h2 className="text-2xl font-semibold mb-4">Пользователи</h2>
        <UsersList />
      </div>
    </div>
  )
}

export default AdminDashboard
