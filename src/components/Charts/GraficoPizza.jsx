import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts'

const DEFAULT_COLORS = ['#038C5A', '#05F29B', '#0EA5E9', '#F59E0B', '#8B5CF6', '#EF4444']

export function GraficoPizza({ dados = [], cores = {}, altura = 280, titulo = 'Distribuição', carregando = false }) {
  const dadosFormatados = (dados || []).map((item, index) => ({
    nome: item.nome ?? item.label ?? item.status ?? `Item ${index + 1}`,
    valor: Number(item.valor ?? item.value ?? 0),
    cor: cores[item.nome ?? item.label ?? item.status] ?? DEFAULT_COLORS[index % DEFAULT_COLORS.length],
  }))

  if (carregando) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm" style={{ height: altura }}>
        <div className="mb-4 h-4 w-28 animate-pulse rounded bg-slate-200" />
        <div className="h-[calc(100%-24px)] animate-pulse rounded-xl bg-slate-100" />
      </div>
    )
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <h3 className="mb-4 text-sm font-semibold text-slate-800">{titulo}</h3>
      <div style={{ width: '100%', height: altura }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie data={dadosFormatados} dataKey="valor" nameKey="nome" innerRadius={60} outerRadius={90} paddingAngle={2}>
              {dadosFormatados.map((entry) => (
                <Cell key={entry.nome} fill={entry.cor} />
              ))}
            </Pie>
            <Tooltip formatter={(value) => `${value}`} />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
