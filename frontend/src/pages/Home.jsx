import React from 'react'
import Question from '../components/faq/Question' // Импортируем компонент QuestionOne
import styles from '../styles/Home.module.css'

const Home = () => {
  return (
    <div className={styles.container}>
      <h4>Как сделать так, чтобы письмо шло во «Входящие», а не в СПАМ!</h4>

      {/* Вставляем компонент QuestionOne */}
      <Question />
    </div>
  )
}

export default Home
