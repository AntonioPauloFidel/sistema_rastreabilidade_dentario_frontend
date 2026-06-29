import { forwardRef } from 'react'
import { Input as AntInput } from 'antd'
import styles from './styles.module.css'

export const Textarea = forwardRef(({ rotulo, erro, required, maxCaracteres, ...props }, ref) => {
  return (
    <div className={styles.wrapper}>
      {rotulo && (
        <label className={styles.label}>
          {rotulo}
          {required && <span className={styles.required}>*</span>}
        </label>
      )}
      <AntInput.TextArea
        ref={ref}
        status={erro ? 'error' : ''}
        showCount={!!maxCaracteres}
        maxLength={maxCaracteres}
        autoSize={{ minRows: 3, maxRows: 6 }}
        {...props}
      />
      {erro && <span className={styles.erro}>{erro}</span>}
    </div>
  )
})
