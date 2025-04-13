import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import Navbar from './components/Navbar'
import Faq from './pages/Faq'
import EmailForm from './pages/EmailForm'
import ConfigForm from './pages/ConfigForm'
import DeleteAccount from './pages/DeleteAccount'
import EmailHistory from './pages/EmailHistory'
import Footer from './components/Footer' // Импорт футера
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
          </Routes>
        </div>
        <Footer /> {/* Добавим футер */}
      </div>
    </Router>
  )
}

export default App
