import { Modal } from 'antd'
import { ExclamationCircleOutlined } from '@ant-design/icons'

export function ModalConfirmacao({ aberto, titulo, mensagem, onConfirmar, onCancelar, carregando = false, variante = 'perigo' }) {
  return (
    <Modal
      open={aberto}
      title={
        <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <ExclamationCircleOutlined style={{ color: variante === 'perigo' ? '#dc2626' : '#d97706' }} />
          {titulo}
        </span>
      }
      onOk={onConfirmar}
      onCancel={onCancelar}
      okText="Confirmar"
      cancelText="Cancelar"
      okButtonProps={{
        danger: variante === 'perigo',
        loading: carregando,
        style: variante !== 'perigo' ? { background: '#038C5A', borderColor: '#038C5A' } : {},
      }}
      destroyOnClose
    >
      <p style={{ color: '#374151' }}>{mensagem}</p>
    </Modal>
  )
}
