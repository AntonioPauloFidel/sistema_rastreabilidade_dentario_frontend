import { BrowserRouter, Routes, Route } from 'react-router-dom'
import NaoEncontrado from '../pages/NaoEncontrado'

export function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<div>Home do SIRDE</div>} />
        <Route path="*" element={<NaoEncontrado />} />
      </Routes>
    </BrowserRouter>
  )
}
