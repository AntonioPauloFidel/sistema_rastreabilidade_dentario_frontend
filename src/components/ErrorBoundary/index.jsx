import { Component } from 'react'

export class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, info) {
    console.error('ErrorBoundary capturou um erro:', error, info)
  }

  render() {
    if (!this.state.hasError) return this.props.children

    const isDev = import.meta.env.DEV

    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 text-center px-4">
        <h1 className="text-5xl font-bold text-red-600">Algo deu errado</h1>
        <p className="mt-4 text-gray-600">Ocorreu um erro inesperado. Tente recarregar a página.</p>
        {isDev && this.state.error && (
          <pre className="mt-6 p-4 bg-gray-900 text-red-400 text-left text-sm rounded-lg max-w-2xl w-full overflow-auto">
            {this.state.error.stack}
          </pre>
        )}
        <button
          onClick={() => window.location.reload()}
          className="mt-8 px-6 py-3 bg-blue-800 text-white rounded-lg hover:bg-blue-900 transition-colors"
        >
          Tentar novamente
        </button>
      </div>
    )
  }
}
