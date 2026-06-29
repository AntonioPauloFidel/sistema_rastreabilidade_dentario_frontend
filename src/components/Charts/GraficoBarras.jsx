import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts'

const DEFAULT_COLORS = ['#038C5A', '#05F29B', '#0EA5E9', '#F59E0B', '#8B5CF6', '#EF4444']

export function GraficoBarras({ dados = [], cores = {}, altura = 280, titulo = 'Distribuição', carregando = false }) {
  const dadosFormatados = (dados || []).map((item, index) => ({
    nome: item.nome ?? item.label ?? item.tipo ?? `Item ${index + 1}`,
    valor: Number(item.valor ?? item.value ?? 0),
    cor: cores[item.nome ?? item.label ?? item.tipo] ?? DEFAULT_COLORS[index % DEFAULT_COLORS.length],
  }))

  if (carregando) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm" style={{ height: altura }}>
        <div className="mb-4 h-4 w-32 animate-pulse rounded bg-slate-200" />
        <div className="h-[calc(100%-24px)] animate-pulse rounded-xl bg-slate-100" />
      </div>
    )
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <h3 className="mb-4 text-sm font-semibold text-slate-800">{titulo}</h3>
      <div style={{ width: '100%', height: altura }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={dadosFormatados}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="nome" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
            <YAxis allowDecimals={false} axisLine={false} tickLine={false} />
            <Tooltip />
            <Bar dataKey="valor" radius={[6, 6, 0, 0]}>
              {dadosFormatados.map((entry) => (
                <Cell key={entry.nome} fill={entry.cor} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
