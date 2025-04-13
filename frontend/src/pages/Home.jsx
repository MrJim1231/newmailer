import React from 'react'
import Question from '../components/faq/Question' // Импортируем компонент Question
import QuestionTwo from '../components/faq/QuestionTwo' // Импортируем компонент QuestionTwo
import styles from '../styles/Home.module.css'

const Home = () => {
  return (
    <div className={styles.container}>
      {/* Вставляем оба компонента Question и QuestionTwo */}
      <Question />
      <QuestionTwo />
    </div>
  )
}

export default Home
