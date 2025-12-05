import React, { useState, useEffect } from 'react';
import { Pencil, Trash2 } from 'lucide-react';
import api from '../services/api';
import Loading from '../components/Loading';

function PaginaBairros() {
  const [modo, setModo] = useState('lista');
  const [bairros, setBairros] = useState([]);
  const [formulario, setFormulario] = useState({ nome: '', cidade: 'Panambi', estado: 'RS' });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    carregarBairros();
  }, []);

  const carregarBairros = async () => {
    try {
      setLoading(true);
      const dados = await api.get('/bairros');
      setBairros(dados);
    } catch (error) {
      console.error("Erro ao carregar bairros:", error);
    } finally {
      setLoading(false);
    }
  };

  const salvarBairro = async (e) => {
    e.preventDefault();
    
    if (!formulario.nome.trim()) {
      alert('O campo Nome do Bairro é obrigatório');
      return;
    }
    if (!formulario.cidade.trim()) {
      alert('O campo Cidade é obrigatório');
      return;
    }
    if (!formulario.estado.trim()) {
      alert('O campo Estado é obrigatório');
      return;
    }
    
    try {
      if (formulario.id) {
        await api.put(`/bairros/${formulario.id}`, formulario);
      } else {
        await api.post('/bairros', formulario);
      }
      await carregarBairros();
      setModo('lista');
      setFormulario({ nome: '', cidade: 'Panambi', estado: 'RS' });
    } catch (error) {
      alert('Erro ao salvar bairro');
    }
  };

  const deletarBairro = async (id) => {
    if (confirm('Deseja remover este bairro?')) {
      try {
        await api.delete(`/bairros/${id}`);
        await carregarBairros();
      } catch (error) {
        alert('Erro ao excluir bairro');
      }
    }
  };

  const editarBairro = (bairro) => {
    setFormulario(bairro);
    setModo('formulario');
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8 border-b border-[#0B132B]/10 pb-4">
        <h1 className="text-3xl font-light text-[#0B132B]">Bairros</h1>
        {modo === 'lista' && (
          <button 
            onClick={() => setModo('formulario')}
            className="px-4 py-2 rounded-md bg-[#0B132B] text-[#FFFFE4] hover:bg-[#0B132B]/90 transition shadow-lg"
          >
            + Adicionar Bairro
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
        <Loading mensagem="Carregando bairros..." />
      ) : modo === 'lista' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {bairros.map((bairro) => (
            <div key={bairro.id} className="bg-white p-6 rounded-lg border border-[#0B132B]/10 hover:shadow-md transition group">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-xl font-bold text-[#0B132B]">{bairro.nome}</h3>
                <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
                  <button onClick={() => editarBairro(bairro)} className="text-blue-600 text-sm hover:underline" title="Editar">
                    <Pencil size={18} />
                  </button>
                  <button onClick={() => deletarBairro(bairro.id)} className="text-red-600 text-sm hover:underline" title="Excluir">
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
              <p className="text-[#0B132B]/60 text-sm">{bairro.cidade} - {bairro.estado}</p>
            </div>
          ))}
        </div>
      ) : (
        <div className="max-w-xl mx-auto bg-white p-8 rounded-lg border border-[#0B132B]/10 shadow-sm">
          <h2 className="text-xl font-semibold mb-6 text-[#0B132B]">Novo Bairro</h2>
          <form onSubmit={salvarBairro} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-[#0B132B] mb-2">Nome do Bairro</label>
              <input 
                type="text" 
                required
                className="w-full border border-[#0B132B]/20 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-[#0B132B] transition"
                value={formulario.nome}
                onChange={e => setFormulario({...formulario, nome: e.target.value})}
                placeholder="Ex: Centro"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-[#0B132B] mb-2">Cidade</label>
                <input 
                  type="text" 
                  className="w-full border border-[#0B132B]/20 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-[#0B132B] transition"
                  value={formulario.cidade}
                  onChange={e => setFormulario({...formulario, cidade: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#0B132B] mb-2">Estado</label>
                <input 
                  type="text" 
                  className="w-full border border-[#0B132B]/20 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-[#0B132B] transition"
                  value={formulario.estado}
                  onChange={e => setFormulario({...formulario, estado: e.target.value})}
                />
              </div>
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

export default PaginaBairros;
