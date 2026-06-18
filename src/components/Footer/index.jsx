import styles from './styles.module.css'

const ANO = new Date().getFullYear()

export function Footer() {
  return (
    <footer className={styles.footer}>
      <span className={styles.copy}>
        © {ANO} <strong>Sirde</strong> — Sistema de Registro de Dentes
      </span>
      <span className={styles.versao}>v1.0.0</span>
    </footer>
  )
}
