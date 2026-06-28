import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

export function GraficoLinha({ dados = [], altura = 280, titulo = 'Histórico', carregando = false }) {
  const dadosFormatados = (dados || []).map((item) => ({
    nome: item.nome ?? item.mes ?? item.label ?? '—',
    valor: Number(item.valor ?? item.value ?? item.total ?? 0),
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
          <LineChart data={dadosFormatados}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="nome" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
            <YAxis allowDecimals={false} axisLine={false} tickLine={false} />
            <Tooltip />
            <Line type="monotone" dataKey="valor" stroke="#038C5A" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
