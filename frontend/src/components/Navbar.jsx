import { Link } from 'react-router-dom'
import styles from '../styles/Navbar.module.css' // Импортируем стили

function Navbar() {
  return (
    <nav className={styles.navbar}>
      <ul>
        <li>
          <Link to="/" className={styles.navLink}>
            Главная
          </Link>
        </li>
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
      </ul>
    </nav>
  )
}

export default Navbar
