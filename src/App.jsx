import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import BarraLateral from './components/BarraLateral';
import PaginaUsuarios from './pages/PaginaUsuarios';
import PaginaBairros from './pages/PaginaBairros';
import PaginaTiposImoveis from './pages/PaginaTiposImoveis';
import PaginaImoveis from './pages/PaginaImoveis';
import PaginaFotos from './pages/PaginaFotos';

function App() {
  return (
    <div className="flex min-h-screen bg-[#FFFFE4]">
      <BarraLateral />
      
      <main className="flex-1 ml-64 p-8">
        <div className="max-w-7xl mx-auto">
          <Routes>
            <Route path="/" element={<Navigate to="/imoveis" replace />} />
            <Route path="/usuarios" element={<PaginaUsuarios />} />
            <Route path="/bairros" element={<PaginaBairros />} />
            <Route path="/tipos" element={<PaginaTiposImoveis />} />
            <Route path="/imoveis" element={<PaginaImoveis />} />
            <Route path="/fotos" element={<PaginaFotos />} />
            <Route path="*" element={<Navigate to="/imoveis" replace />} />
          </Routes>
        </div>
      </main>
    </div>
  );
}

export default App;
