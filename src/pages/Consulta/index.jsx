import { useState } from 'react'
import { Controller } from 'react-hook-form'
import { CreditCard, ShieldCheck } from 'lucide-react'
import { Button } from '../../components/Button'
import { Input } from '../../components/Input'
import { useFormulario } from '../../hooks'
import { publicService } from '../../services/public/public.service'
import { z } from 'zod'
import styles from './styles.module.css'
import logoPng from '../../assets/Logo.png'

const schemaConsulta = z.object({
  cpf: z
    .string()
    .min(14, 'CPF inválido')
    .regex(/^[0-9]{3}\.[0-9]{3}\.[0-9]{3}-[0-9]{2}$/, 'CPF inválido'),
})

function formatarCpf(valor) {
  const numeros = valor.replace(/\D/g, '').slice(0, 11)
  return numeros
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d{1,2})$/, '$1-$2')
}

function formatarData(valor) {
  if (!valor) return '—'
  const data = new Date(valor)
  if (Number.isNaN(data.getTime())) return '—'
  return new Intl.DateTimeFormat('pt-BR', {
    dateStyle: 'short',
    timeStyle: 'short',
  }).format(data)
}

export default function Consulta() {
  const [resultado, setResultado] = useState(null)
  const [mensagem, setMensagem] = useState('')
  const [carregando, setCarregando] = useState(false)

  const { control, handleSubmit, errors } = useFormulario(schemaConsulta, { cpf: '' })

  async function onSubmit({ cpf }) {
    setMensagem('')
    setResultado(null)
    setCarregando(true)

    try {
      const res = await publicService.consultaDentes(cpf)
      const dados = res.data?.dentes ?? res.data?.data ?? res.data
      const lista = Array.isArray(dados) ? dados : []

      if (lista.length === 0) {
        setMensagem('Nenhum resultado encontrado para o CPF informado.')
      } else {
        setResultado(lista)
      }
    } catch (erro) {
      setMensagem('Nenhum resultado encontrado para o CPF informado.')
    } finally {
      setCarregando(false)
    }
  }

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <img src={logoPng} alt="Sirde" className={styles.logo} />
        <div className={styles.header}>
          <h1>Consulta de dentes doados</h1>
          <p>Use o CPF para acompanhar o status dos dentes doados com privacidade e segurança.</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
          <Controller
            name="cpf"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                rotulo="CPF do doador"
                placeholder="000.000.000-00"
                icone={<CreditCard size={18} color="#6B7280" />}
                erro={errors.cpf?.message}
                onChange={(event) => {
                  const valor = formatarCpf(event.target.value)
                  field.onChange(valor)
                }}
              />
            )}
          />

          <Button
            tipo="submit"
            variante="primary"
            tamanho="large"
            carregando={carregando}
          >
            Consultar
          </Button>
        </form>

        <p className={styles.notice}>
          Caso o CPF não esteja cadastrado, exibiremos apenas uma resposta neutra para proteger a privacidade do doador.
        </p>

        {mensagem && <div className={styles.message}>{mensagem}</div>}

        {resultado?.length > 0 && (
          <div className={styles.resultado}>
            {resultado.map((item, index) => {
              const codigo = item.codigoPublico ?? item.codigo ?? item.id ?? `#${index + 1}`
              const status = item.status ?? item.statusResumo ?? '—'
              const atualizado = item.ultimaAtualizacao ?? item.updatedAt ?? item.atualizadoEm

              return (
                <article key={codigo} className={styles.item}>
                  <div className={styles.itemTopo}>
                    <span className={styles.codigo}>{codigo}</span>
                    <span className={styles.badge}>{status}</span>
                  </div>
                  <div className={styles.itemMeta}>
                    <span>Última atualização: {formatarData(atualizado)}</span>
                  </div>
                </article>
              )
            })}
          </div>
        )}

        <div className={styles.footerNote}>
          <ShieldCheck size={18} />
          <span>Seus dados são tratados com confidencialidade. Apenas o doador pode consultar seus próprios dentes.</span>
        </div>
      </div>
    </div>
  )
}
