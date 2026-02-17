import { BrowserRouter, Routes, Route } from 'react-router-dom';

export function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<div>Home do SIRDE</div>} />
      </Routes>
    </BrowserRouter>
  );
}