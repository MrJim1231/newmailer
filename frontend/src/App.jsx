import React from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
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
import Home from './pages/Home'
import { AuthProvider } from './context/AuthContext'
import PrivateRoute from './components/PrivateRoute' // ✅ импорт защиты
import styles from './App.module.css'

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className={styles.appWrapper}>
          <Navbar />
          <div className={styles.appContainer}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              {/* 🔐 Только для авторизованных пользователей */}
              <Route
                path="/profile"
                element={
                  <PrivateRoute>
                    <Profile />
                  </PrivateRoute>
                }
              />

              {/* 🔐 Только для админов */}
              <Route
                path="/faq"
                element={
                  <PrivateRoute requiredRole="admin">
                    <Faq />
                  </PrivateRoute>
                }
              />
              <Route
                path="/email-form"
                element={
                  <PrivateRoute requiredRole="admin">
                    <EmailForm />
                  </PrivateRoute>
                }
              />
              <Route
                path="/config-form"
                element={
                  <PrivateRoute requiredRole="admin">
                    <ConfigForm />
                  </PrivateRoute>
                }
              />
              <Route
                path="/delete-account"
                element={
                  <PrivateRoute requiredRole="admin">
                    <DeleteAccount />
                  </PrivateRoute>
                }
              />
              <Route
                path="/history"
                element={
                  <PrivateRoute requiredRole="admin">
                    <EmailHistory />
                  </PrivateRoute>
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

export default App
