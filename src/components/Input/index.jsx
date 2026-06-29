import { forwardRef } from 'react'
import { Input as AntInput } from 'antd'
import InputMask from 'react-input-mask'
import styles from './styles.module.css'

export const Input = forwardRef(({ rotulo, icone, erro, required, mascara, ...props }, ref) => {
  const Componente = mascara ? InputMask : AntInput
  
  return (
    <div className={styles.wrapper}>
      {rotulo && (
        <label className={styles.label}>
          {rotulo}
          {required && <span className={styles.required}>*</span>}
        </label>
      )}
      {mascara ? (
        <InputMask
          ref={ref}
          mask={mascara}
          {...props}
        >
          {(inputProps) => (
            <AntInput
              prefix={icone}
              status={erro ? 'error' : ''}
              className={styles.input}
              {...inputProps}
            />
          )}
        </InputMask>
      ) : (
        <AntInput
          ref={ref}
          prefix={icone}
          status={erro ? 'error' : ''}
          className={styles.input}
          {...props}
        />
      )}
      {erro && <span className={styles.erro}>{erro}</span>}
    </div>
  )
})

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
