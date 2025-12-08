import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { buscarImoveis, salvarImovel, atualizarImovel, apagarImovel } from '../api';

function DashboardCorretor() {
  const navigate = useNavigate();
  const [imoveis, setImoveis] = useState([]);
  const [form, setForm] = useState({ titulo: '', precoVenda: '', descricao: '', clienteId: '' });
  const [editId, setEditId] = useState(null);
  const [erro, setErro] = useState('');

  useEffect(() => {
    const saved = localStorage.getItem('user');
    const user = saved ? JSON.parse(saved) : null;
    if (!user || user.tipo !== 'CORRETOR') {
      navigate('/login');
      return;
    }
    carregar();
  }, [navigate]);

  async function carregar() {
    try {
      const data = await buscarImoveis();
      setImoveis(data || []);
    } catch (e) {
      setErro('Erro ao carregar imóveis.');
    }
  }

  async function salvar(e) {
    e.preventDefault();
    setErro('');
    try {
      if (editId) {
        await atualizarImovel(editId, form);
      } else {
        await salvarImovel(form);
      }
      setForm({ titulo: '', precoVenda: '', descricao: '', clienteId: '' });
      setEditId(null);
      carregar();
    } catch (e) {
      setErro('Erro ao salvar. Verifique permissões.');
    }
  }

  async function excluir(id) {
    try {
      await apagarImovel(id);
      carregar();
    } catch (e) {
      setErro('Não foi possível excluir.');
    }
  }

  function editar(item) {
    setEditId(item.id);
    setForm({
      titulo: item.titulo || '',
      precoVenda: item.precoVenda || '',
      descricao: item.descricao || '',
      clienteId: item.clienteId || '',
    });
  }

  return (
    <div className="container">
      <h2>Painel do Corretor</h2>
      {erro && <div className="alert">{erro}</div>}

      <form onSubmit={salvar}>
        <div className="form-row">
          <input className="input" placeholder="Título" value={form.titulo} onChange={(e) => setForm({ ...form, titulo: e.target.value })} />
          <input className="input" placeholder="Preço" value={form.precoVenda} onChange={(e) => setForm({ ...form, precoVenda: e.target.value })} />
          <input className="input" placeholder="Descrição" value={form.descricao} onChange={(e) => setForm({ ...form, descricao: e.target.value })} />
          <input className="input" placeholder="Cliente Id (opcional)" value={form.clienteId} onChange={(e) => setForm({ ...form, clienteId: e.target.value })} />
        </div>
        <button className="button" type="submit">{editId ? 'Salvar edição' : 'Cadastrar imóvel'}</button>
        {editId && <button className="button secondary" type="button" onClick={() => { setEditId(null); setForm({ titulo: '', precoVenda: '', descricao: '', clienteId: '' }); }}>Cancelar</button>}
      </form>

      <div className="card-grid" style={{ marginTop: '12px' }}>
        {imoveis.map((item) => (
          <div className="card" key={item.id}>
            <h4>{item.titulo}</h4>
            <p>Preço: {item.precoVenda || '---'}</p>
            <p>Cliente: {item.clienteId || '-'} | Corretor: {item.corretorId || '-'}</p>
            <button className="button secondary" onClick={() => editar(item)}>Editar</button>
            <button className="button" onClick={() => excluir(item.id)}>Excluir</button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default DashboardCorretor;
