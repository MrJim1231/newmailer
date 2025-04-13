import React from 'react'
import styles from './Question.module.css' // Импортируем стили из отдельного модуля

const Question = () => {
  return (
    <div className={styles.faqContainer}>
      <h1 className={styles.title}>Как отправлять письма без попадания в спам</h1>

      <div className={styles.faqItem}>
        <h2 className={styles.subtitle}>Если ты отправляешь через SMTP чужого сервиса (например Gmail):</h2>
        <p>То дело точно не в твоём домене и IP хостинга. Потому что:</p>
        <ul className={styles.list}>
          <li>
            Письмо уходит с IP <code>smtp.gmail.com</code>
          </li>
          <li>Проверяют репутацию именно аккаунта отправителя (gmail-аккаунта)</li>
          <li>А ещё контент письма и заголовки</li>
          <li>Твой домен и IP хостинга вообще не участвуют в маршрутизации письма</li>
        </ul>
      </div>

      <div className={styles.faqItem}>
        <h2 className={styles.subtitle}>Почему письмо может улетать в спам или не доходить:</h2>
        <ol className={styles.list}>
          <li>
            <strong>Плохая репутация аккаунта отправителя (gmail-аккаунта)</strong> → если с него уже много спама или похожих писем — Gmail сам режет его
          </li>
          <li>
            <strong>Плохой или подозрительный контент письма</strong> → слова вроде «бесплатно», «скидка», «заработок», ссылки и вложения с рандомными именами, отсутствие нормального текста в теле
            письма
          </li>
          <li>
            <strong>Отсутствие или кривые заголовки</strong> → отсутствие темы письма, пустое имя отправителя, мусор в вложении
          </li>
          <li>
            <strong>SPF/DKIM/DMARC на домене отправителя</strong> (если ты отправляешь с кастомного адреса типа <code>no-reply@yourdomain.com</code>, а не с <code>gmail.com</code>)
          </li>
        </ol>
      </div>

      <div className={styles.faqItem}>
        <h2 className={styles.subtitle}>Что можно сделать:</h2>
        <ul className={styles.list}>
          <li>✅ Попробовать другой gmail-аккаунт</li>
          <li>✅ Изменить тему письма и текст (ближе к деловой переписке)</li>
          <li>✅ Проверить заголовки</li>
          <li>✅ Не прикладывать файлы с рандомными именами</li>
          <li>✅ Проверить репутацию gmail-аккаунта через Gmail Postmaster Tools (если есть доступ)</li>
        </ul>
      </div>

      <div className={styles.faqItem}>
        <h2 className={styles.subtitle}>Когда проблема в домене/айпи:</h2>
        <ul className={styles.list}>
          <li>Только если ты отправляешь со своего SMTP (mail.yourdomain.com) — тогда:</li>
          <li>проверяется репутация IP твоего хостинга</li>
          <li>нужны SPF/DKIM/DMARC записи</li>
          <li>могут блочить по IP</li>
        </ul>
      </div>

      <div className={styles.faqItem}>
        <h2 className={styles.subtitle}>Вывод:</h2>
        <p>
          👉 Спам или отсутствие доставки — это почти всегда контент письма или репутация аккаунта отправителя. Домен и IP твоего хостинга тут вообще не причём, если письмо уходит через{' '}
          <code>smtp.gmail.com</code>.
        </p>
      </div>
    </div>
  )
}

export default Question
