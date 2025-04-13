import { Link } from 'react-router-dom'
import styles from '../styles/Navbar.module.css'

function Navbar() {
  return (
    <nav className={styles.navbar}>
      <div className={styles.logoContainer}>
        <span className={styles.logoText}>Mailer</span>
      </div>
      <ul>
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
          <Link to="/delete-account" className={styles.navLink}>
            Удалить аккаунт
          </Link>
        </li>
        <li>
          <Link to="/history" className={styles.navLink}>
            История писем
          </Link>
        </li>
        <li>
          <Link to="/faq" className={styles.navLink}>
            FAQ
          </Link>
        </li>
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
      </ul>
    </nav>
  )
}

export default Navbar
