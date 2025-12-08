import React, { useEffect, useState } from 'react';
import { Link, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import Home from './pages/Home';
import Imoveis from './pages/Imoveis';
import Imovel from './pages/Imovel';
import Login from './pages/Login';
import DashboardAdmin from './pages/DashboardAdmin';
import DashboardCorretor from './pages/DashboardCorretor';
import DashboardCliente from './pages/DashboardCliente';

function Topo() {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const saved = localStorage.getItem('user');
    if (saved) {
      setUser(JSON.parse(saved));
    } else {
      setUser(null);
    }
  }, [location.pathname]);

  function sair() {
    localStorage.removeItem('user');
    setUser(null);
    navigate('/login');
  }

  return (
    <header>
      <h1>NiPia Imobiliária</h1>
      <div className="navbar">
        <Link to="/">Home</Link>
        <Link to="/imoveis">Imóveis</Link>
        <Link to="/login">Login</Link>
        <Link to="/admin">Admin</Link>
        <Link to="/corretor">Corretor</Link>
        <Link to="/cliente">Cliente</Link>
        {user && (
          <button className="button secondary" onClick={sair}>Sair</button>
        )}
      </div>
      {user && <p>Logado como: {user.nome} ({user.tipo})</p>}
    </header>
  );
}

function App() {
  return (
    <div className="app">
      <Topo />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/imoveis" element={<Imoveis />} />
        <Route path="/imoveis/:id" element={<Imovel />} />
        <Route path="/login" element={<Login />} />
        <Route path="/admin" element={<DashboardAdmin />} />
        <Route path="/corretor" element={<DashboardCorretor />} />
        <Route path="/cliente" element={<DashboardCliente />} />
        <Route path="*" element={<Home />} />
      </Routes>
    </div>
  );
}

export default App;
