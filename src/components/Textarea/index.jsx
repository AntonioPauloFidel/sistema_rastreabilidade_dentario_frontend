import { Input as AntInput } from 'antd'
import styles from './styles.module.css'

export function Textarea({ rotulo, erro, required, maxCaracteres, ...props }) {
  return (
    <div className={styles.wrapper}>
      {rotulo && (
        <label className={styles.label}>
          {rotulo}
          {required && <span className={styles.required}>*</span>}
        </label>
      )}
      <AntInput.TextArea
        status={erro ? 'error' : ''}
        showCount={!!maxCaracteres}
        maxLength={maxCaracteres}
        autoSize={{ minRows: 3, maxRows: 6 }}
        {...props}
      />
      {erro && <span className={styles.erro}>{erro}</span>}
    </div>
  )
}
