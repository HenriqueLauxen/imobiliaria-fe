import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Users, MapPin, Tags, Home, Image, ChevronRight, ChevronLeft, LayoutDashboard, LogOut } from 'lucide-react';

function BarraLateral() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  
  const menuItems = [
    { id: 'home', path: '/home', label: 'Início', icon: <LayoutDashboard size={20} /> },
    { id: 'imoveis', path: '/imoveis', label: 'Imóveis', icon: <Home size={20} /> },
    { id: 'usuarios', path: '/usuarios', label: 'Usuários', icon: <Users size={20} /> },
    { id: 'bairros', path: '/bairros', label: 'Bairros', icon: <MapPin size={20} /> },
    { id: 'tipos', path: '/tipos', label: 'Tipos de Imóveis', icon: <Tags size={20} /> },
    { id: 'fotos', path: '/fotos', label: 'Fotos', icon: <Image size={20} /> },
  ];

  const isActive = (path) => {
    return location.pathname === path;
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <>
      {/* Mobile toggle button */}
      <button 
        className="sidebar-toggle"
        onClick={() => setIsOpen(!isOpen)}
        aria-label={isOpen ? "Fechar menu" : "Abrir menu"}
      >
        {isOpen ? <ChevronLeft size={24} /> : <ChevronRight size={24} />}
      </button>

      {/* Overlay for mobile */}
      {isOpen && (
        <div 
          className="sidebar-overlay" 
          onClick={() => setIsOpen(false)}
        />
      )}

      <div className={`sidebar ${isOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <img src="/Nipia.png" alt="Logo" style={{ height: '32px', width: 'auto' }} />
          NiPia
        </div>
        
        <nav className="sidebar-nav">
          {menuItems.map((item) => (
            <Link
              key={item.id}
              to={item.path}
              className={`nav-link ${isActive(item.path) ? 'active' : ''}`}
              onClick={() => setIsOpen(false)}
            >
              {item.icon}
              {item.label}
            </Link>
          ))}
          
          <div
            className="nav-link"
            onClick={handleLogout}
            style={{ 
              marginTop: 'auto', 
              cursor: 'pointer'
            }}
            role="button"
            tabIndex={0}
          >
            <LogOut size={20} />
            Sair
          </div>
        </nav>
      </div>
    </>
  );
}

export default BarraLateral;
