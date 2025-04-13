import React, { useState } from 'react'
import styles from '../../styles/faq/Question.module.css' // Импортируем модуль стилей

const Question = () => {
  // Стейт для отслеживания, раскрыт ли текст
  const [isOpen, setIsOpen] = useState(false)

  // Функция для переключения состояния
  const toggleContent = () => {
    setIsOpen(!isOpen)
  }

  return (
    <div className={styles.container}>
      {/* Заголовок с добавлением стрелочки */}
      <h3 className={styles.mainTitle} onClick={toggleContent}>
        Как сделать так, чтобы письмо попадало в «Входящие», а не в СПАМ!
        {/* Стрелочка, которая меняет угол при раскрытии */}
        <span className={`${styles.arrow} ${isOpen ? styles.open : ''}`}>&#9660;</span>
      </h3>

      {/* Текст, который скрывается или раскрывается */}
      {isOpen && (
        <div>
          <h2>Нейтральный заголовок</h2>
          <p>
            Вместо слов <code>«скидка», «бесплатно», «срочно», «подарок» или капс-лок — это триггер для фильтров.</code> напиши что-то вроде <strong>Ваш документ</strong> или{' '}
            <strong>Документ по запросу</strong>.
          </p>
          <pre>
            <code>Subject: Ваш запрошенный документ</code>
          </pre>

          <h2>Простой текст без лишних слов</h2>
          <p>
            Сейчас у тебя просто <code>Какой то текст</code> — лучше сделать нормальное короткое письмо.
          </p>
          <pre>
            <code>Здравствуйте! Отправляю вам запрошенный документ. Если будут вопросы — пишите. С уважением, имя отправителя</code>
          </pre>

          <h2>Не добавлять ссылки, если не нужно</h2>
          <p>Чем проще письмо — тем выше шанс попасть во «Входящие».</p>

          <h2>Название вложения — без чисел или странных имён</h2>
          <p>
            Вместо <code>53.pdf</code> — лучше <strong>dokument.pdf</strong> или <strong>dogovor.pdf</strong>.
          </p>
        </div>
      )}
    </div>
  )
}

export default Question
