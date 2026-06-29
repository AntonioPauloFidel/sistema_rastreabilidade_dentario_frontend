import { useCallback, useEffect, useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button, Spin, Space } from 'antd'
import { Input } from '../../../components/Input'
import { Select } from '../../../components/Select'
import { Textarea } from '../../../components/Textarea'
import { useToast } from '../../../hooks/useToast'
import { TIPO_DENTE, CONDICAO_DENTE } from '../../../constants/enums'
import { formularioDenteSchema } from './schemas/formularioDente.schema'
import { dentesService } from '../../../services/dentes/dentes.service'
import { doadoresService } from '../../../services/doadores/doadores.service'
import { remessasService } from '../../../services/remessas/remessas.service'
import { locaisService } from '../../../services/locais/locais.service'
import styles from './styles.module.css'

export function FormularioDente({ onSucesso, onCancelar }) {
  const { notificar } = useToast()
  const [carregando, setCarregando] = useState(true)
  const [enviando, setEnviando] = useState(false)
  const [doadores, setDoadores] = useState([])
  const [remessas, setRemessas] = useState([])
  const [locais, setLocais] = useState([])

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(formularioDenteSchema),
    defaultValues: {
      codigoRastreio: '',
      tipo: '',
      numeracaoDental: '',
      condicao: '',
      doadorId: '',
      remessaId: '',
      localAtualId: '',
      observacao: '',
    },
  })

  // Carregar dados dos selects
  useEffect(() => {
    const carregarDados = async () => {
      try {
        setCarregando(true)
        const [doladoresRes, remessasRes, locaisRes] = await Promise.all([
          doadoresService.listar(),
          remessasService.listar(),
          locaisService.listar(),
        ])

        setDoadores(
          doladoresRes.data?.map((d) => ({
            label: d.nome,
            value: d.id,
          })) || []
        )

        setRemessas(
          remessasRes.data?.map((r) => ({
            label: r.numero || r.nome,
            value: r.id,
          })) || []
        )

        setLocais(
          locaisRes.data?.map((l) => ({
            label: l.nome,
            value: l.id,
          })) || []
        )
      } catch (erro) {
        console.error('Erro ao carregar dados:', erro)
        notificar({
          tipo: 'erro',
          titulo: 'Erro',
          mensagem: 'Falha ao carregar dados dos selects',
        })
      } finally {
        setCarregando(false)
      }
    }

    carregarDados()
  }, [notificar])

  const onSubmit = useCallback(
    async (dados) => {
      try {
        setEnviando(true)
        await dentesService.criar(dados)
        notificar({
          tipo: 'sucesso',
          titulo: 'Sucesso',
          mensagem: 'Dente cadastrado com sucesso',
        })
        reset()
        onSucesso?.()
      } catch (erro) {
        console.error('Erro ao cadastrar dente:', erro)
        notificar({
          tipo: 'erro',
          titulo: 'Erro',
          mensagem: erro?.response?.data?.message || 'Falha ao cadastrar dente',
        })
      } finally {
        setEnviando(false)
      }
    },
    [notificar, reset, onSucesso]
  )

  if (carregando) {
    return (
      <div className={styles.carregando}>
        <Spin size="large" tip="Carregando..." />
      </div>
    )
  }

  const opcoesdentipo = Object.entries(TIPO_DENTE).map(([key, val]) => ({
    label: val.label,
    value: key,
  }))

  const opcoesCondicao = Object.entries(CONDICAO_DENTE).map(([key, val]) => ({
    label: val.label,
    value: key,
  }))

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={styles.formulario}>
      <div className={styles.grid2}>
        <Controller
          name="codigoRastreio"
          control={control}
          render={({ field }) => (
            <Input
              {...field}
              rotulo="Código de Rastreio"
              placeholder="Ex: SIRDE-001"
              required
              erro={errors.codigoRastreio?.message}
            />
          )}
        />

        <Controller
          name="tipo"
          control={control}
          render={({ field }) => (
            <Select
              {...field}
              rotulo="Tipo de Dente"
              opcoes={opcoesdentipo}
              required
              erro={errors.tipo?.message}
            />
          )}
        />
      </div>

      <div className={styles.grid2}>
        <Controller
          name="numeracaoDental"
          control={control}
          render={({ field }) => (
            <Input
              {...field}
              rotulo="Numeração Dental"
              placeholder="Ex: 11"
              erro={errors.numeracaoDental?.message}
            />
          )}
        />

        <Controller
          name="condicao"
          control={control}
          render={({ field }) => (
            <Select
              {...field}
              rotulo="Condição"
              opcoes={opcoesCondicao}
              required
              erro={errors.condicao?.message}
            />
          )}
        />
      </div>

      <div className={styles.grid2}>
        <Controller
          name="doadorId"
          control={control}
          render={({ field }) => (
            <Select
              {...field}
              rotulo="Doador"
              opcoes={doadores}
              required
              erro={errors.doadorId?.message}
            />
          )}
        />

        <Controller
          name="remessaId"
          control={control}
          render={({ field }) => (
            <Select
              {...field}
              rotulo="Remessa de Entrada"
              opcoes={remessas}
              required
              erro={errors.remessaId?.message}
            />
          )}
        />
      </div>

      <Controller
        name="localAtualId"
        control={control}
        render={({ field }) => (
          <Select
            {...field}
            rotulo="Local de Armazenamento"
            opcoes={locais}
            required
            erro={errors.localAtualId?.message}
          />
        )}
      />

      <Controller
        name="observacao"
        control={control}
        render={({ field }) => (
          <Textarea
            {...field}
            rotulo="Observação"
            placeholder="Digite observações adicionais (opcional)"
            maxCaracteres={500}
            erro={errors.observacao?.message}
          />
        )}
      />

      <div className={styles.acoes}>
        <Space>
          <Button onClick={onCancelar}>Cancelar</Button>
          <Button
            type="primary"
            htmlType="submit"
            loading={enviando}
            disabled={carregando || enviando}
          >
            Cadastrar Dente
          </Button>
        </Space>
      </div>
    </form>
  )
}

export default FormularioDente
