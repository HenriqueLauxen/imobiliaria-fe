import React, { useState, useEffect } from 'react';
import { Pencil, Trash2 } from 'lucide-react';
import api from '../services/api';
import Loading from '../components/Loading';

function PaginaImoveis() {
  const [modo, setModo] = useState('lista');
  
  const [bairros, setBairros] = useState([]);
  const [tipos, setTipos] = useState([]);
  const [imoveis, setImoveis] = useState([]);
  const [fotos, setFotos] = useState([]);
  const [loading, setLoading] = useState(true);

  const [formulario, setFormulario] = useState({
    titulo: '',
    precoVenda: '',
    precoAluguel: '',
    finalidade: 'Residencial',
    status: 'Ativo',
    dormitorios: '',
    banheiros: '',
    garagem: '',
    areaTotal: '',
    areaConstruida: '',
    endereco: '',
    numero: '',
    complemento: '',
    cep: '',
    bairro: null,
    tipoImovel: null,
    descricao: '',
    caracteristicas: '',
    destaque: false
  });

  useEffect(() => {
    carregarDados();
  }, []);

  const carregarDados = async () => {
    try {
      setLoading(true);
      const [imoveisData, bairrosData, tiposData, fotosData] = await Promise.all([
        api.get('/imoveis'),
        api.get('/bairros'),
        api.get('/tiposimoveis'),
        api.get('/fotos')
      ]);
      setImoveis(imoveisData);
      setBairros(bairrosData);
      setTipos(tiposData);
      setFotos(fotosData);
    } catch (error) {
      console.error("Erro ao carregar dados:", error);
    } finally {
      setLoading(false);
    }
  };

  const getFotoCapa = (imovelId) => {
    const fotosImovel = fotos.filter(f => f.imovel?.id === imovelId);
    const fotoCapa = fotosImovel.find(f => f.capa);
    return fotoCapa || fotosImovel[0] || null;
  };

  const salvarImovel = async (e) => {
    e.preventDefault();
    
    if (!formulario.titulo.trim()) {
      alert('O campo Título é obrigatório');
      return;
    }
    if (!formulario.finalidade) {
      alert('Selecione uma Finalidade');
      return;
    }
    if (!formulario.status) {
      alert('Selecione um Status');
      return;
    }
    
    try {
      const payload = {
        ...formulario,
        bairro: bairros.find(b => b.id == formulario.bairroId),
        tipoImovel: tipos.find(t => t.id == formulario.tipoId)
      };

      if (formulario.id) {
        await api.put(`/imoveis/${formulario.id}`, payload);
      } else {
        await api.post('/imoveis', payload);
      }
      await carregarDados();
      setModo('lista');
      setFormulario({ 
        titulo: '', 
        precoVenda: '', 
        precoAluguel: '',
        finalidade: 'Residencial',
        status: 'Ativo',
        dormitorios: '',
        banheiros: '',
        garagem: '',
        areaTotal: '', 
        areaConstruida: '',
        endereco: '',
        numero: '',
        complemento: '',
        cep: '',
        bairroId: '', 
        tipoId: '', 
        descricao: '',
        caracteristicas: '',
        destaque: false
      });
    } catch (error) {
      alert('Erro ao salvar imóvel');
    }
  };

  const deletarImovel = async (id) => {
    if (confirm('Tem certeza?')) {
      try {
        await api.delete(`/imoveis/${id}`);
        await carregarDados();
      } catch (error) {
        alert('Erro ao excluir imóvel');
      }
    }
  };

  const editarImovel = (imovel) => {
    setFormulario({
      ...imovel,
      bairroId: imovel.bairro?.id,
      tipoId: imovel.tipoImovel?.id,
      precoVenda: imovel.precoVenda || '',
      precoAluguel: imovel.precoAluguel || '',
      areaTotal: imovel.areaTotal || '',
      areaConstruida: imovel.areaConstruida || '',
      dormitorios: imovel.dormitorios || '',
      banheiros: imovel.banheiros || '',
      garagem: imovel.garagem || ''
    });
    setModo('formulario');
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8 border-b border-[#0B132B]/10 pb-4">
        <h1 className="text-3xl font-light text-[#0B132B]">Imóveis</h1>
        {modo === 'lista' && (
          <button 
            onClick={() => setModo('formulario')}
            className="px-4 py-2 rounded-md bg-[#0B132B] text-[#FFFFE4] hover:bg-[#0B132B]/90 transition shadow-lg"
          >
            + Novo Imóvel
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
        <Loading mensagem="Carregando imóveis..." />
      ) : modo === 'lista' ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {imoveis.map((imovel) => {
            const fotoCapa = getFotoCapa(imovel.id);
            return (
            <div key={imovel.id} className="bg-white p-6 rounded-lg border border-[#0B132B]/10 hover:shadow-lg transition group flex flex-col md:flex-row gap-6">
              <div className="w-full md:w-48 h-32 bg-gray-200 rounded-md flex items-center justify-center text-gray-400 overflow-hidden">
                {fotoCapa ? (
                  <img 
                    src={fotoCapa.caminho} 
                    alt={imovel.titulo}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-xs">Sem Foto</span>
                )}
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <h3 className="text-xl font-bold text-[#0B132B] mb-2">{imovel.titulo}</h3>
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
                    <button onClick={() => editarImovel(imovel)} className="text-blue-600 text-sm hover:underline" title="Editar">
                      <Pencil size={18} />
                    </button>
                    <button onClick={() => deletarImovel(imovel.id)} className="text-red-600 text-sm hover:underline" title="Excluir">
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
                <p className="text-2xl font-light text-[#0B132B] mb-2">
                  {imovel.finalidade === 'Aluguel' 
                    ? `R$ ${imovel.precoAluguel || '0'}/mês` 
                    : `R$ ${imovel.precoVenda || '0'}`}
                </p>
                <div className="flex flex-wrap gap-2 text-sm text-[#0B132B]/70">
                  <span className="bg-[#0B132B]/5 px-2 py-1 rounded">{imovel.bairro?.nome}</span>
                  <span className="bg-[#0B132B]/5 px-2 py-1 rounded">{imovel.tipoImovel?.nome}</span>
                  <span className="bg-[#0B132B]/5 px-2 py-1 rounded">{imovel.areaTotal} m²</span>
                  {imovel.dormitorios && <span className="bg-[#0B132B]/5 px-2 py-1 rounded">{imovel.dormitorios} dorm.</span>}
                  <span className="bg-[#0B132B]/5 px-2 py-1 rounded">{imovel.finalidade}</span>
                </div>
              </div>
            </div>
            );
          })}
        </div>
      ) : (
        <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg border border-[#0B132B]/10 shadow-sm">
          <h2 className="text-xl font-semibold mb-6 text-[#0B132B]">Dados do Imóvel</h2>
          <form onSubmit={salvarImovel} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-[#0B132B] mb-2">Título do Anúncio</label>
              <input 
                type="text" 
                required
                className="w-full border border-[#0B132B]/20 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-[#0B132B] transition"
                value={formulario.titulo}
                onChange={e => setFormulario({...formulario, titulo: e.target.value})}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#0B132B] mb-2">Finalidade</label>
              <select 
                className="w-full border border-[#0B132B]/20 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-[#0B132B] transition bg-white"
                value={formulario.finalidade || ''}
                onChange={e => setFormulario({...formulario, finalidade: e.target.value})}
              >
                <option value="Residencial">Residencial</option>
                <option value="Comercial">Comercial</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-[#0B132B] mb-2">Status</label>
              <select 
                className="w-full border border-[#0B132B]/20 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-[#0B132B] transition bg-white"
                value={formulario.status || ''}
                onChange={e => setFormulario({...formulario, status: e.target.value})}
              >
                <option value="Ativo">Ativo</option>
                <option value="Inativo">Inativo</option>
                <option value="Vendido">Vendido</option>
                <option value="Alugado">Alugado</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-[#0B132B] mb-2">Preço Venda (R$)</label>
              <input 
                type="number" 
                className="w-full border border-[#0B132B]/20 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-[#0B132B] transition"
                value={formulario.precoVenda}
                onChange={e => setFormulario({...formulario, precoVenda: e.target.value})}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#0B132B] mb-2">Preço Aluguel (R$/mês)</label>
              <input 
                type="number" 
                className="w-full border border-[#0B132B]/20 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-[#0B132B] transition"
                value={formulario.precoAluguel}
                onChange={e => setFormulario({...formulario, precoAluguel: e.target.value})}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#0B132B] mb-2">Área Total (m²)</label>
              <input 
                type="number" 
                className="w-full border border-[#0B132B]/20 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-[#0B132B] transition"
                value={formulario.areaTotal}
                onChange={e => setFormulario({...formulario, areaTotal: e.target.value})}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#0B132B] mb-2">Área Construída (m²)</label>
              <input 
                type="number" 
                className="w-full border border-[#0B132B]/20 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-[#0B132B] transition"
                value={formulario.areaConstruida}
                onChange={e => setFormulario({...formulario, areaConstruida: e.target.value})}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#0B132B] mb-2">Dormitórios</label>
              <input 
                type="number" 
                className="w-full border border-[#0B132B]/20 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-[#0B132B] transition"
                value={formulario.dormitorios}
                onChange={e => setFormulario({...formulario, dormitorios: e.target.value})}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#0B132B] mb-2">Banheiros</label>
              <input 
                type="number" 
                className="w-full border border-[#0B132B]/20 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-[#0B132B] transition"
                value={formulario.banheiros}
                onChange={e => setFormulario({...formulario, banheiros: e.target.value})}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#0B132B] mb-2">Vagas Garagem</label>
              <input 
                type="number" 
                className="w-full border border-[#0B132B]/20 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-[#0B132B] transition"
                value={formulario.garagem}
                onChange={e => setFormulario({...formulario, garagem: e.target.value})}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#0B132B] mb-2">Bairro</label>
              <select 
                className="w-full border border-[#0B132B]/20 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-[#0B132B] transition bg-white"
                value={formulario.bairroId || ''}
                onChange={e => setFormulario({...formulario, bairroId: e.target.value})}
              >
                <option value="">Selecione...</option>
                {bairros.map(b => <option key={b.id} value={b.id}>{b.nome}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-[#0B132B] mb-2">Tipo de Imóvel</label>
              <select 
                className="w-full border border-[#0B132B]/20 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-[#0B132B] transition bg-white"
                value={formulario.tipoId || ''}
                onChange={e => setFormulario({...formulario, tipoId: e.target.value})}
              >
                <option value="">Selecione...</option>
                {tipos.map(t => <option key={t.id} value={t.id}>{t.nome}</option>)}
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-[#0B132B] mb-2">Endereço</label>
              <input 
                type="text" 
                className="w-full border border-[#0B132B]/20 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-[#0B132B] transition"
                value={formulario.endereco || ''}
                onChange={e => setFormulario({...formulario, endereco: e.target.value})}
                placeholder="Rua, Avenida..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#0B132B] mb-2">Número</label>
              <input 
                type="text" 
                className="w-full border border-[#0B132B]/20 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-[#0B132B] transition"
                value={formulario.numero || ''}
                onChange={e => setFormulario({...formulario, numero: e.target.value})}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#0B132B] mb-2">Complemento</label>
              <input 
                type="text" 
                className="w-full border border-[#0B132B]/20 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-[#0B132B] transition"
                value={formulario.complemento || ''}
                onChange={e => setFormulario({...formulario, complemento: e.target.value})}
                placeholder="Apto, Bloco..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#0B132B] mb-2">CEP</label>
              <input 
                type="text" 
                className="w-full border border-[#0B132B]/20 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-[#0B132B] transition"
                value={formulario.cep || ''}
                onChange={e => setFormulario({...formulario, cep: e.target.value})}
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-[#0B132B] mb-2">Descrição Detalhada</label>
              <textarea 
                className="w-full border border-[#0B132B]/20 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-[#0B132B] transition h-32 resize-none"
                value={formulario.descricao || ''}
                onChange={e => setFormulario({...formulario, descricao: e.target.value})}
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-[#0B132B] mb-2">Características</label>
              <textarea 
                className="w-full border border-[#0B132B]/20 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-[#0B132B] transition h-24 resize-none"
                value={formulario.caracteristicas || ''}
                onChange={e => setFormulario({...formulario, caracteristicas: e.target.value})}
                placeholder="Piscina, Churrasqueira, Ar condicionado..."
              />
            </div>

            <div className="md:col-span-2 pt-4 flex justify-end gap-4 border-t border-[#0B132B]/10 mt-4">
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
                Salvar Imóvel
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

export default PaginaImoveis;
