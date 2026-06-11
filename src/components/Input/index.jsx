import { Input as AntInput } from 'antd'
import styles from './styles.module.css'

export function Input({ rotulo, icone, erro, required, ...props }) {
  return (
    <div className={styles.wrapper}>
      {rotulo && (
        <label className={styles.label}>
          {rotulo}
          {required && <span className={styles.required}>*</span>}
        </label>
      )}
      <AntInput
        prefix={icone}
        status={erro ? 'error' : ''}
        className={styles.input}
        {...props}
      />
      {erro && <span className={styles.erro}>{erro}</span>}
    </div>
  )
}

export function InputSenha({ rotulo, erro, required, ...props }) {
  return (
    <div className={styles.wrapper}>
      {rotulo && (
        <label className={styles.label}>
          {rotulo}
          {required && <span className={styles.required}>*</span>}
        </label>
      )}
      <AntInput.Password
        status={erro ? 'error' : ''}
        className={styles.input}
        {...props}
      />
      {erro && <span className={styles.erro}>{erro}</span>}
    </div>
  )
}
