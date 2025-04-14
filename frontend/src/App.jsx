import React from 'react'
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom'
import Navbar from './components/Navbar'
import Faq from './pages/Faq'
import EmailForm from './pages/EmailForm'
import ConfigForm from './pages/ConfigForm'
import DeleteAccount from './pages/DeleteAccount'
import EmailHistory from './pages/EmailHistory'
import Footer from './components/Footer'
import Login from './pages/Login'
import Register from './pages/Register'
import Profile from './pages/Profile'
import Home from './pages/Home' // ✅ Добавь компонент Home
import { AuthProvider, useAuth } from './context/AuthContext' // Импортируем AuthProvider и useAuth
import AuthPage from './pages/AuthPage' // 👈 компонент, который внутри переключает формы
import styles from './App.module.css'

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className={styles.appWrapper}>
          <Navbar />
          <div className={styles.appContainer}>
            <Routes>
              <Route path="/" element={<RedirectToAppropriatePage />} />
              <Route path="/email-form" element={<EmailForm />} />
              <Route path="/config-form" element={<ConfigForm />} />
              <Route path="/delete-account" element={<DeleteAccount />} />
              <Route path="/history" element={<EmailHistory />} />
              <Route path="/faq" element={<Faq />} />
              <Route path="/auth/login" element={<AuthPage mode="login" />} />
              <Route path="/auth/register" element={<AuthPage mode="register" />} />
              <Route path="/profile" element={<Profile />} />
            </Routes>
          </div>
          <Footer />
        </div>
      </AuthProvider>
    </Router>
  )
}

function RedirectToAppropriatePage() {
  const { user } = useAuth()

  if (user) {
    // Если пользователь залогинен, перенаправляем на /email-form
    return <Navigate to="/email-form" />
  } else {
    // Если пользователь не залогинен, перенаправляем на /auth/login
    return <Navigate to="/auth/login" />
  }
}

export default App
