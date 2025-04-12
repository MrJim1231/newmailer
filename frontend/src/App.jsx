import EmailForm from './pages/EmailForm'
import ConfigForm from './pages/ConfigForm' // подключаем вторую форму

function App() {
  return (
    <div>
      <h1>Мейлер</h1>

      <h2>Форма отправки письма</h2>
      <EmailForm />

      <hr />

      <h2>Добавить SMTP Конфигурацию</h2>
      <ConfigForm />
    </div>
  )
}

export default App
