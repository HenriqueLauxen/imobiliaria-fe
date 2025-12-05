import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Users, MapPin, Tags, Home, Image } from 'lucide-react';

function BarraLateral() {
  const location = useLocation();
  
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

  return (
    <div className="w-64 h-screen bg-[#0B132B] text-[#FFFFE4] fixed left-0 top-0 flex flex-col border-r border-[#0B132B]">
      <div className="p-6 text-2xl font-bold tracking-widest border-b border-[#FFFFE4]/20 flex items-center gap-3">
        <img src="/Nipia.png" alt="Logo" className="h-8 w-auto" />
        NiPia
      </div>
      
      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => (
          <Link
            key={item.id}
            to={item.path}
            className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium transition-all duration-200 rounded-lg
              ${isActive(item.path) 
                ? 'bg-[#FFFFE4] text-[#0B132B]' 
                : 'hover:bg-[#FFFFE4]/10 hover:translate-x-1'
              }`}
          >
            {item.icon}
            {item.label}
          </Link>
        ))}
      </nav>
    </div>
  );
}

export default BarraLateral;
