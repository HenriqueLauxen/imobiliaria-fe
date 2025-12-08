import React, { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import BarraLateral from './components/BarraLateral';
import PaginaUsuarios from './pages/PaginaUsuarios';
import PaginaBairros from './pages/PaginaBairros';
import PaginaTiposImoveis from './pages/PaginaTiposImoveis';
import PaginaImoveis from './pages/PaginaImoveis';
import PaginaFotos from './pages/PaginaFotos';
import PaginaLogin from './pages/PaginaLogin';

function App() {
  const [user] = useState(() => {
    const storedUser = localStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser) : null;
  });

  if (!user) {
    return <PaginaLogin />;
  }

  const getHomeRoute = () => {
    if (user.tipo === 'ADMIN') return '/usuarios';
    return '/imoveis';
  };

  return (
    <div className="app-container">
      <BarraLateral />
      
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Navigate to={getHomeRoute()} replace />} />
          <Route path="/usuarios" element={<PaginaUsuarios />} />
          <Route path="/bairros" element={<PaginaBairros />} />
          <Route path="/tipos" element={<PaginaTiposImoveis />} />
          <Route path="/imoveis" element={<PaginaImoveis />} />
          <Route path="/fotos" element={<PaginaFotos />} />
          <Route path="*" element={<Navigate to={getHomeRoute()} replace />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
