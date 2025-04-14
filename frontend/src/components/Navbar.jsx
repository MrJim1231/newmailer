import { NavLink } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import styles from '../styles/Navbar.module.css'

function Navbar() {
  const { user, logout, loading } = useAuth()

  if (loading) return null

  return (
    <nav className={styles.navbar}>
      <div className={styles.logoContainer}>
        <NavLink to="/" className={styles.logoText}>
          Mailer
        </NavLink>
      </div>
      <ul>
        {user ? (
          <>
            <li>
              <NavLink to="/email-form" className={({ isActive }) => (isActive ? `${styles.navLink} ${styles.activeLink}` : styles.navLink)}>
                Форма отправки письма
              </NavLink>
            </li>
            <li>
              <NavLink to="/config-form" className={({ isActive }) => (isActive ? `${styles.navLink} ${styles.activeLink}` : styles.navLink)}>
                Добавить SMTP Конфигурацию
              </NavLink>
            </li>
            <li>
              <NavLink to="/history" className={({ isActive }) => (isActive ? `${styles.navLink} ${styles.activeLink}` : styles.navLink)}>
                История писем
              </NavLink>
            </li>
            <li>
              <NavLink to="/delete-account" className={({ isActive }) => (isActive ? `${styles.navLink} ${styles.activeLink}` : styles.navLink)}>
                Удалить аккаунт
              </NavLink>
            </li>
            <li>
              <NavLink to="/profile" className={({ isActive }) => (isActive ? `${styles.navLink} ${styles.activeLink}` : styles.navLink)}>
                Профиль
              </NavLink>
            </li>
            <li>
              <NavLink to="/faq" className={({ isActive }) => (isActive ? `${styles.navLink} ${styles.activeLink}` : styles.navLink)}>
                FAQ
              </NavLink>
            </li>
            <li>
              <button onClick={logout} className={styles.navButton}>
                Выйти
              </button>
            </li>
          </>
        ) : (
          <li>
            <NavLink to="/auth/login" className={({ isActive }) => (isActive ? `${styles.navLink} ${styles.activeLink}` : styles.navLink)}>
              Личный кабинет
            </NavLink>
          </li>
        )}
      </ul>
    </nav>
  )
}

export default Navbar
