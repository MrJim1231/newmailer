import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import Navbar from './components/Navbar'
import EmailForm from './pages/EmailForm'
import ConfigForm from './pages/ConfigForm'
import styles from './App.module.css' // Импортируем стили

function App() {
  return (
    <Router>
      <Navbar />
      <div className={styles.appContainer}>
        <h1>Мейлер</h1>
        <Routes>
          <Route path="/" element={<h2>Добро пожаловать в Мейлер</h2>} />
          <Route path="/email-form" element={<EmailForm />} />
          <Route path="/config-form" element={<ConfigForm />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App
