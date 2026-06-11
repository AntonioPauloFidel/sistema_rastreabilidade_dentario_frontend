import { useNavigate } from 'react-router-dom'

export default function NaoEncontrado() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 text-center px-4">
      <h1 className="text-9xl font-bold text-blue-800">404</h1>
      <h2 className="mt-4 text-2xl font-semibold text-gray-700">Página não encontrada</h2>
      <p className="mt-2 text-gray-500">A rota que você acessou não existe ou foi removida.</p>
      <button
        onClick={() => navigate('/')}
        className="mt-8 px-6 py-3 bg-blue-800 text-white rounded-lg hover:bg-blue-900 transition-colors"
      >
        Voltar ao início
      </button>
    </div>
  )
}
