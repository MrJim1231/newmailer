import { Link } from 'react-router-dom'
import Login from './Login'
import Register from './Register'
import styles from '../styles/AuthPage.module.css'

function AuthPage({ mode }) {
  const isLogin = mode === 'login'

  return (
    <div className={styles.authContainer}>
      {isLogin ? <Login /> : <Register />}

      {/* Блок с ссылками для переключения */}
      <div className={styles.switchLink}>
        {isLogin ? (
          <p>
            Нет аккаунта? <Link to="/auth/register">Регистрация</Link>
          </p>
        ) : (
          <p>
            Уже есть аккаунт? <Link to="/auth/login">Вход</Link>
          </p>
        )}
      </div>
    </div>
  )
}

export default AuthPage
