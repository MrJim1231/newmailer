import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import styles from '../styles/Navbar.module.css'

function Navbar() {
  const { user, logout, loading } = useAuth()

  if (loading) return null // ⏳ Можно вставить спиннер, если хочешь

  return (
    <nav className={styles.navbar}>
      <div className={styles.logoContainer}>
        <Link to="/" className={styles.logoText}>
          Mailer
        </Link>
      </div>
      <ul>
        <li>
          <Link to="/" className={styles.navLink}>
            Главная
          </Link>
        </li>

        {user ? (
          <>
            <li>
              <Link to="/email-form" className={styles.navLink}>
                Форма отправки письма
              </Link>
            </li>
            <li>
              <Link to="/config-form" className={styles.navLink}>
                Добавить SMTP Конфигурацию
              </Link>
            </li>
            <li>
              <Link to="/history" className={styles.navLink}>
                История писем
              </Link>
            </li>
            <li>
              <Link to="/delete-account" className={styles.navLink}>
                Удалить аккаунт
              </Link>
            </li>
            <li>
              <Link to="/profile" className={styles.navLink}>
                Профиль
              </Link>
            </li>
            <li>
              <Link to="/faq" className={styles.navLink}>
                FAQ
              </Link>
            </li>
            <li>
              <button onClick={logout} className={styles.navButton}>
                Выйти
              </button>
            </li>
          </>
        ) : (
          <>
            <li>
              <Link to="/login" className={styles.navLink}>
                Вход
              </Link>
            </li>
            <li>
              <Link to="/register" className={styles.navLink}>
                Регистрация
              </Link>
            </li>
          </>
        )}
      </ul>
    </nav>
  )
}

export default Navbar
