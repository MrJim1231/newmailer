import React from 'react'
import Question from '../components/faq/Question'
import QuestionTwo from '../components/faq/QuestionTwo'
import QuestionThree from '../components/faq/QuestionThree'
import styles from '../styles/Home.module.css'

const Home = () => {
  return (
    <div className={styles.container}>
      {/* Вставляем оба компонента Question и QuestionTwo */}
      <Question />
      <QuestionTwo />
      <QuestionThree />
    </div>
  )
}

export default Home
