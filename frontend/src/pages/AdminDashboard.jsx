import React from 'react'
import UsersList from './AdminUsersList' // измени путь при необходимости
import styles from '../styles/AdminDashboard.module.css' // путь к CSS-модулю

const AdminDashboard = () => {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Панель управления (SuperAdmin)</h1>
      <p className={styles.subtitle}>Добро пожаловать в административную панель. Здесь можно управлять системой.</p>

      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Пользователи</h2>
        <UsersList />
      </div>
    </div>
  )
}

export default AdminDashboard
