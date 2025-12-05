import React, { useState, useEffect } from 'react';
import { Pencil, Trash2 } from 'lucide-react';
import api from '../services/api';
import Loading from '../components/Loading';

function PaginaTiposImoveis() {
  const [modo, setModo] = useState('lista');
  const [tipos, setTipos] = useState([]);
  const [formulario, setFormulario] = useState({ nome: '', descricao: '' });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    carregarTipos();
  }, []);

  const carregarTipos = async () => {
    try {
      setLoading(true);
      const dados = await api.get('/tiposimoveis');
      setTipos(dados);
    } catch (error) {
      console.error("Erro ao carregar tipos:", error);
    } finally {
      setLoading(false);
    }
  };

  const salvarTipo = async (e) => {
    e.preventDefault();
    
    if (!formulario.nome.trim()) {
      alert('O campo Nome é obrigatório');
      return;
    }
    
    try {
      if (formulario.id) {
        await api.put(`/tiposimoveis/${formulario.id}`, formulario);
      } else {
        await api.post('/tiposimoveis', formulario);
      }
      await carregarTipos();
      setModo('lista');
      setFormulario({ nome: '', descricao: '' });
    } catch (error) {
      alert('Erro ao salvar tipo de imóvel');
    }
  };

  const deletarTipo = async (id) => {
    if (confirm('Deseja excluir este tipo de imóvel?')) {
      try {
        await api.delete(`/tiposimoveis/${id}`);
        await carregarTipos();
      } catch (error) {
        alert('Erro ao excluir tipo de imóvel');
      }
    }
  };

  const editarTipo = (tipo) => {
    setFormulario(tipo);
    setModo('formulario');
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8 border-b border-[#0B132B]/10 pb-4">
        <h1 className="text-3xl font-light text-[#0B132B]">Tipos de Imóvel</h1>
        {modo === 'lista' && (
          <button 
            onClick={() => setModo('formulario')}
            className="px-4 py-2 rounded-md bg-[#0B132B] text-[#FFFFE4] hover:bg-[#0B132B]/90 transition shadow-lg"
          >
            + Novo Tipo
          </button>
        )}
        {modo === 'formulario' && (
          <button 
            onClick={() => setModo('lista')}
            className="px-4 py-2 rounded-md border border-[#0B132B] text-[#0B132B] hover:bg-[#0B132B] hover:text-[#FFFFE4] transition"
          >
            Voltar
          </button>
        )}
      </div>

      {loading ? (
        <Loading mensagem="Carregando tipos de imóvel..." />
      ) : modo === 'lista' ? (
        <div className="bg-white rounded-lg border border-[#0B132B]/10 overflow-hidden">
          <ul className="divide-y divide-[#0B132B]/10">
            {tipos.map((tipo) => (
              <li key={tipo.id} className="p-6 hover:bg-[#FFFFE4]/30 transition flex justify-between items-center group">
                <div>
                  <h3 className="text-lg font-semibold text-[#0B132B]">{tipo.nome}</h3>
                  <p className="text-sm text-[#0B132B]/60 mt-1">{tipo.descricao}</p>
                </div>
                <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-4">
                  <button onClick={() => editarTipo(tipo)} className="text-blue-600 hover:underline text-sm font-medium" title="Editar">
                    <Pencil size={18} />
                  </button>
                  <button onClick={() => deletarTipo(tipo.id)} className="text-red-600 hover:underline text-sm font-medium" title="Excluir">
                    <Trash2 size={18} />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <div className="max-w-xl mx-auto bg-white p-8 rounded-lg border border-[#0B132B]/10 shadow-sm">
          <h2 className="text-xl font-semibold mb-6 text-[#0B132B]">Cadastrar Tipo</h2>
          <form onSubmit={salvarTipo} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-[#0B132B] mb-2">Nome do Tipo</label>
              <input 
                type="text" 
                required
                className="w-full border border-[#0B132B]/20 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-[#0B132B] transition"
                value={formulario.nome}
                onChange={e => setFormulario({...formulario, nome: e.target.value})}
                placeholder="Ex: Duplex"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#0B132B] mb-2">Descrição</label>
              <textarea 
                className="w-full border border-[#0B132B]/20 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-[#0B132B] transition h-32 resize-none"
                value={formulario.descricao}
                onChange={e => setFormulario({...formulario, descricao: e.target.value})}
                placeholder="Breve descrição..."
              />
            </div>
            <div className="pt-4 flex justify-end gap-4">
              <button 
                type="button"
                onClick={() => setModo('lista')}
                className="px-6 py-2 rounded-md border border-[#0B132B]/20 text-[#0B132B] hover:bg-gray-50 transition"
              >
                Cancelar
              </button>
              <button 
                type="submit"
                className="px-6 py-2 rounded-md bg-[#0B132B] text-[#FFFFE4] hover:bg-[#0B132B]/90 transition shadow-md"
              >
                Salvar
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

export default PaginaTiposImoveis;
