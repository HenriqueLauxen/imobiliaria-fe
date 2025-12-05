import React, { useState, useEffect } from 'react';
import { Home, MapPin, Building, Users } from 'lucide-react';
import api from '../services/api';
import Loading from '../components/Loading';

function Dashboard() {
  const [stats, setStats] = useState({
    imoveis: 0,
    bairros: 0,
    tipos: 0,
    usuarios: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    carregarEstatisticas();
  }, []);

  const carregarEstatisticas = async () => {
    try {
      const [imoveisData, bairrosData, tiposData, usuariosData] = await Promise.all([
        api.get('/imoveis'),
        api.get('/bairros'),
        api.get('/tiposimoveis'),
        api.get('/usuarios')
      ]);
      setStats({
        imoveis: imoveisData.length,
        bairros: bairrosData.length,
        tipos: tiposData.length,
        usuarios: usuariosData.length
      });
    } catch (error) {
      console.error("Erro ao carregar estatísticas:", error);
    } finally {
      setLoading(false);
    }
  };

  const cards = [
    { titulo: 'Imóveis Cadastrados', valor: stats.imoveis, icon: <Home size={40} className="text-[#0B132B]" /> },
    { titulo: 'Bairros', valor: stats.bairros, icon: <MapPin size={40} className="text-[#0B132B]" /> },
    { titulo: 'Tipos de Imóvel', valor: stats.tipos, icon: <Building size={40} className="text-[#0B132B]" /> },
    { titulo: 'Usuários Ativos', valor: stats.usuarios, icon: <Users size={40} className="text-[#0B132B]" /> },
  ];

  if (loading) {
    return (
      <div className="p-8">
        <h1 className="text-3xl font-light text-[#0B132B] mb-8 border-b border-[#0B132B]/10 pb-4">
          Visão Geral
        </h1>
        <Loading mensagem="Carregando estatísticas..." />
      </div>
    );
  }

  return (
    <div className="p-8">
      <h1 className="text-3xl font-light text-[#0B132B] mb-8 border-b border-[#0B132B]/10 pb-4">
        Visão Geral
      </h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card, index) => (
          <div key={index} className="bg-white p-6 rounded-lg border border-[#0B132B]/10 hover:shadow-lg transition-all duration-300 group">
            <div className="flex justify-between items-start mb-4">
              <div className="text-4xl group-hover:scale-110 transition-transform duration-300">{card.icon}</div>
              <span className="text-xs font-semibold text-[#0B132B]/60 bg-[#0B132B]/5 px-2 py-1 rounded">
                ATUALIZADO
              </span>
            </div>
            <h3 className="text-4xl font-bold text-[#0B132B] mb-1">
              {card.valor}
            </h3>
            <p className="text-sm text-[#0B132B]/70 font-medium">{card.titulo}</p>
          </div>
        ))}
      </div>

      <div className="mt-12 grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-lg border border-[#0B132B]/10">
          <h2 className="text-xl font-semibold text-[#0B132B] mb-4">Atividades Recentes</h2>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center gap-4 p-3 hover:bg-[#FFFFE4]/50 rounded transition">
                <div className="w-2 h-2 rounded-full bg-[#0B132B]"></div>
                <p className="text-sm text-[#0B132B]/80">Novo imóvel cadastrado no bairro Centro.</p>
                <span className="text-xs text-[#0B132B]/40 ml-auto">Há 2h</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-[#0B132B]/10">
          <h2 className="text-xl font-semibold text-[#0B132B] mb-4">Status do Sistema</h2>
          <div className="flex items-center gap-2 text-green-600 bg-green-50 p-4 rounded border border-green-100">
            <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse"></div>
            <span className="font-medium">Tudo em ordem</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
