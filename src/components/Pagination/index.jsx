import { Pagination as AntPagination } from 'antd'

export function Pagination({ pagina, total, porPagina = 10, onChange }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 16 }}>
      <AntPagination
        current={pagina}
        total={total}
        pageSize={porPagina}
        onChange={onChange}
        showSizeChanger={false}
        showTotal={(tot) => `Total: ${tot} registros`}
      />
    </div>
  )
}