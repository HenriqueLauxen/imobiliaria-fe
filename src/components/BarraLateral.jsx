import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Users, MapPin, Tags, Home, Image, ChevronRight, ChevronLeft, LogOut } from 'lucide-react';

function BarraLateral() {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  
  const menuItems = [
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
    window.location.reload();
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

          <button
            className="nav-link"
            onClick={handleLogout}
            style={{ 
              marginTop: 'auto', 
              background: 'transparent', 
              border: 'none', 
              width: '100%', 
              cursor: 'pointer',
              fontFamily: 'inherit',
              fontSize: '0.95rem'
            }}
          >
            <LogOut size={20} />
            Sair
          </button>
        </nav>
      </div>
    </>
  );
}

export default BarraLateral;
