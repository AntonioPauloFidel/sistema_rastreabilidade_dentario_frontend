import { Select as AntSelect } from 'antd'
import styles from './styles.module.css'

export function Select({ rotulo, opcoes = [], erro, required, placeholder = 'Selecione...', ...props }) {
  return (
    <div className={styles.wrapper}>
      {rotulo && (
        <label className={styles.label}>
          {rotulo}
          {required && <span className={styles.required}>*</span>}
        </label>
      )}
      <AntSelect
        placeholder={placeholder}
        status={erro ? 'error' : ''}
        style={{ width: '100%' }}
        options={opcoes}
        {...props}
      />
      {erro && <span className={styles.erro}>{erro}</span>}
    </div>
  )
}
