import { useCallback, useEffect, useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button, Spin, Space, Alert } from 'antd'
import { DatePicker } from 'antd'
import dayjs from 'dayjs'
import { Select } from '../../../components/Select'
import { Textarea } from '../../../components/Textarea'
import { useToast } from '../../../hooks/useToast'
import { formularioCessaoSchema } from './schemas/formularioCessao.schema'
import { cessoesService } from '../../../services/cessoes/cessoes.service'
import { solicitacoesService } from '../../../services/solicitacoes/solicitacoes.service'
import { dentesService } from '../../../services/dentes/dentes.service'
import styles from './styles.module.css'

export function FormularioCessao({ solicitacaoIdInicial, onSucesso, onCancelar }) {
  const { notificar } = useToast()
  const [carregando, setCarregando] = useState(true)
  const [enviando, setEnviando] = useState(false)
  const [solicitacoes, setSolicitacoes] = useState([])
  const [dentes, setDentes] = useState([])
  const [solicitacaoSelecionada, setSolicitacaoSelecionada] = useState(null)
  const [aposSuccesso, setAposSuccesso] = useState(false)

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm({
    resolver: zodResolver(formularioCessaoSchema),
    defaultValues: {
      solicitacaoId: solicitacaoIdInicial || '',
      denteId: '',
      dataCessao: new Date(),
      observacao: '',
    },
  })

  const solicitacaoIdWatch = watch('solicitacaoId')

  const carregarDentes = useCallback(async (solicitacao) => {
    try {
      // Extrai o tipo de dente da solicitação (primeiro item ou campo genérico)
      const tipoDente = solicitacao?.itens?.[0]?.tipo || solicitacao?.tipo
      
      if (!tipoDente) {
        setDentes([])
        return
      }

      const res = await dentesService.listar({
        status: 'ARMAZENADO',
        tipo: tipoDente,
      })

      setDentes(
        res.data?.map((d) => ({
          label: `${d.codigoRastreio} - ${d.tipo}`,
          value: d.id,
          data: d,
        })) || []
      )
    } catch (erro) {
      console.error('Erro ao carregar dentes:', erro)
      notificar({
        tipo: 'aviso',
        titulo: 'Aviso',
        mensagem: 'Falha ao carregar dentes disponíveis',
      })
      setDentes([])
    }
  }, [notificar])

  // Carregar solicitações aprovadas
  useEffect(() => {
    const carregarSolicitacoes = async () => {
      try {
        setCarregando(true)
        const res = await solicitacoesService.listar({ status: 'APROVADA' })
        setSolicitacoes(
          res.data?.map((s) => ({
            label: `${s.id.slice(0, 8)} - ${s.instituicao?.nome || 'Sem instituição'}`,
            value: s.id,
            data: s,
          })) || []
        )

        // Se veio pré-selecionada, já carrega dentes
        if (solicitacaoIdInicial) {
          const solicitacao = res.data?.find((s) => s.id === solicitacaoIdInicial)
          if (solicitacao) {
            setSolicitacaoSelecionada(solicitacao)
            carregarDentes(solicitacao)
          }
        }
      } catch (erro) {
        console.error('Erro ao carregar solicitações:', erro)
        notificar({
          tipo: 'erro',
          titulo: 'Erro',
          mensagem: 'Falha ao carregar solicitações',
        })
      } finally {
        setCarregando(false)
      }
    }

    carregarSolicitacoes()
  }, [solicitacaoIdInicial, notificar, carregarDentes])

  // Carregar dentes quando solicitação mudar
  useEffect(() => {
    if (!solicitacaoIdWatch) {
      setDentes([])
      setSolicitacaoSelecionada(null)
      return
    }

    const solicitacao = solicitacoes.find((s) => s.value === solicitacaoIdWatch)?.data
    if (solicitacao) {
      setSolicitacaoSelecionada(solicitacao)
      carregarDentes(solicitacao)
    }
  }, [solicitacaoIdWatch, solicitacoes, carregarDentes])

  const onSubmit = useCallback(
    async (dados) => {
      try {
        setEnviando(true)
        await cessoesService.criar({
          ...dados,
          dataCessao: dados.dataCessao.toISOString(),
        })

        notificar({
          tipo: 'sucesso',
          titulo: 'Sucesso',
          mensagem: 'Cessão registrada com sucesso',
        })

        setAposSuccesso(true)
        onSucesso?.()
      } catch (erro) {
        console.error('Erro ao registrar cessão:', erro)
        notificar({
          tipo: 'erro',
          titulo: 'Erro',
          mensagem: erro?.response?.data?.message || 'Falha ao registrar cessão',
        })
      } finally {
        setEnviando(false)
      }
    },
    [notificar, onSucesso]
  )

  const handleNovacessao = () => {
    setAposSuccesso(false)
    reset({
      solicitacaoId: solicitacaoIdWatch,
      denteId: '',
      dataCessao: new Date(),
      observacao: '',
    })
  }

  if (carregando) {
    return (
      <div className={styles.carregando}>
        <Spin size="large" tip="Carregando..." />
      </div>
    )
  }

  if (aposSuccesso) {
    return (
      <div className={styles.sucessoContainer}>
        <Alert
          message="Cessão registrada com sucesso!"
          type="success"
          showIcon
          className={styles.alerta}
        />
        <div className={styles.acoes}>
          <Space>
            <Button onClick={onCancelar}>Finalizar</Button>
            <Button type="primary" onClick={handleNovacessao}>
              Registrar Outra Cessão
            </Button>
          </Space>
        </div>
      </div>
    )
  }

  const opcoesInstituicao = solicitacaoSelecionada
    ? [
        {
          label: solicitacaoSelecionada.instituicao?.nome || 'Sem instituição',
          value: solicitacaoSelecionada.instituicao?.id || '',
          disabled: true,
        },
      ]
    : []

  const semDentesDisponiveis = solicitacaoSelecionada && dentes.length === 0

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={styles.formulario}>
      <Controller
        name="solicitacaoId"
        control={control}
        render={({ field }) => (
          <Select
            {...field}
            rotulo="Solicitação"
            opcoes={solicitacoes}
            required
            erro={errors.solicitacaoId?.message}
            placeholder="Selecione uma solicitação aprovada"
          />
        )}
      />

      {solicitacaoSelecionada && (
        <Select
          rotulo="Instituição"
          opcoes={opcoesInstituicao}
          disabled={true}
          placeholder={solicitacaoSelecionada.instituicao?.nome}
        />
      )}

      {semDentesDisponiveis && (
        <Alert
          message="Nenhum dente disponível"
          description={`Não há dentes com status ARMAZENADO do tipo necessário para esta solicitação.`}
          type="warning"
          showIcon
          className={styles.alerta}
        />
      )}

      <Controller
        name="denteId"
        control={control}
        render={({ field }) => (
          <Select
            {...field}
            rotulo="Dente"
            opcoes={dentes}
            required
            erro={errors.denteId?.message}
            placeholder={dentes.length > 0 ? 'Selecione um dente' : 'Nenhum dente disponível'}
            disabled={dentes.length === 0}
          />
        )}
      />

      <Controller
        name="dataCessao"
        control={control}
        render={({ field }) => (
          <div className={styles.campo}>
            <label className={styles.label}>
              Data da Cessão
              <span className={styles.required}>*</span>
            </label>
            <DatePicker
              value={field.value ? dayjs(field.value) : null}
              onChange={(date) => field.onChange(date?.toDate())}
              format="DD/MM/YYYY"
              disabledDate={(current) =>
                current && current > dayjs().endOf('day')
              }
            />
            {errors.dataCessao && (
              <span className={styles.erro}>{errors.dataCessao.message}</span>
            )}
          </div>
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
            disabled={semDentesDisponiveis || enviando}
          >
            Registrar Cessão
          </Button>
        </Space>
      </div>
    </form>
  )
}

export default FormularioCessao
