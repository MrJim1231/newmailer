import React from 'react'
import styles from '../styles/Footer.module.css'

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <p>© {new Date().getFullYear()} Mailer App. Все права защищены.</p>
    </footer>
  )
}

export default Footer
