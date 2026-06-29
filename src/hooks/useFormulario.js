import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

export function useFormulario(schema, defaultValues = {}) {
  const { register, handleSubmit, formState, reset, control } = useForm({
    resolver: schema ? zodResolver(schema) : undefined,
    defaultValues,
  })

  return {
    register,
    handleSubmit,
    errors: formState.errors,
    isSubmitting: formState.isSubmitting,
    reset,
    control,
  }
}
