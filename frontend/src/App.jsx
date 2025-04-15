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
import Home from './pages/Home' // ✅ компонент домашней страницы
import { AuthProvider, useAuth } from './context/AuthContext'
import AuthPage from './pages/AuthPage' // 👈 компонент авторизации
import AdminLogin from './pages/AdminLogin' // 🔐 вход в админку
import AdminDashboard from './pages/AdminDashboard' // 🔐 панель супер-админа
import RequireSuperAdmin from './components/RequireSuperAdmin' // 🔒 защита маршрута
import styles from './App.module.css'

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className={styles.appWrapper}>
          <Navbar />
          <div className={styles.appContainer}>
            <Routes>
              {/* Главная логика редиректа */}
              <Route path="/" element={<RedirectToAppropriatePage />} />

              {/* Пользовательские страницы */}
              <Route path="/email-form" element={<EmailForm />} />
              <Route path="/config-form" element={<ConfigForm />} />
              <Route path="/delete-account" element={<DeleteAccount />} />
              <Route path="/history" element={<EmailHistory />} />
              <Route path="/faq" element={<Faq />} />
              <Route path="/auth/login" element={<AuthPage mode="login" />} />
              <Route path="/auth/register" element={<AuthPage mode="register" />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/home" element={<Home />} />

              {/* Админская зона */}
              <Route path="/admin" element={<AdminLogin />} />
              <Route
                path="/admin/dashboard"
                element={
                  <RequireSuperAdmin>
                    <AdminDashboard />
                  </RequireSuperAdmin>
                }
              />
            </Routes>
          </div>
          <Footer />
        </div>
      </AuthProvider>
    </Router>
  )
}

// 🔁 Перенаправление с "/" в зависимости от авторизации
function RedirectToAppropriatePage() {
  const { user } = useAuth()

  if (user) {
    return <Navigate to="/email-form" />
  } else {
    return <Navigate to="/auth/login" />
  }
}

export default App
