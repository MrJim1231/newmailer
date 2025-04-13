import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import Navbar from './components/Navbar'
import Faq from './pages/Faq'
import EmailForm from './pages/EmailForm'
import ConfigForm from './pages/ConfigForm'
import DeleteAccount from './pages/DeleteAccount'
import EmailHistory from './pages/EmailHistory'
import Footer from './components/Footer'
import Login from './pages/Login' // Подключаем Login
import Register from './pages/Register' // Подключаем Register
import Profile from './pages/Profile'
import styles from './App.module.css'

function App() {
  return (
    <Router>
      <div className={styles.appWrapper}>
        <Navbar />
        <div className={styles.appContainer}>
          <Routes>
            <Route path="/email-form" element={<EmailForm />} />
            <Route path="/config-form" element={<ConfigForm />} />
            <Route path="/delete-account" element={<DeleteAccount />} />
            <Route path="/history" element={<EmailHistory />} />
            <Route path="/faq" element={<Faq />} />
            <Route path="/login" element={<Login />} /> {/* Добавили роут логина */}
            <Route path="/register" element={<Register />} /> {/* Добавили роут регистрации */}
            <Route path="/profile" element={<Profile />} />
          </Routes>
        </div>
        <Footer />
      </div>
    </Router>
  )
}

export default App
