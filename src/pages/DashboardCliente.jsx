import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { buscarImoveis, atualizarImovel } from '../api';

function DashboardCliente() {
  const navigate = useNavigate();
  const [imovel, setImovel] = useState(null);
  const [erro, setErro] = useState('');
  const [form, setForm] = useState({ titulo: '', precoVenda: '', descricao: '' });

  useEffect(() => {
    const saved = localStorage.getItem('user');
    const user = saved ? JSON.parse(saved) : null;
    if (!user || user.tipo !== 'CLIENTE') {
      navigate('/login');
      return;
    }
    carregar();
  }, [navigate]);

  async function carregar() {
    try {
      const data = await buscarImoveis();
      const primeiro = data && data.length > 0 ? data[0] : null;
      setImovel(primeiro);
      if (primeiro) {
        setForm({
          titulo: primeiro.titulo || '',
          precoVenda: primeiro.precoVenda || '',
          descricao: primeiro.descricao || '',
        });
      }
    } catch (e) {
      setErro('Não foi possível carregar seu imóvel.');
    }
  }

  async function salvar(e) {
    e.preventDefault();
    if (!imovel) return;
    setErro('');
    try {
      await atualizarImovel(imovel.id, form);
      carregar();
    } catch (e) {
      setErro('Erro ao salvar.');
    }
  }

  if (!imovel) {
    return <div className="container">Nenhum imóvel encontrado para este cliente.</div>;
  }

  return (
    <div className="container">
      <h2>Meu Imóvel</h2>
      {erro && <div className="alert">{erro}</div>}
      <p>ID: {imovel.id}</p>
      <p>Título atual: {imovel.titulo}</p>
      <p>Preço atual: {imovel.precoVenda}</p>

      <form onSubmit={salvar}>
        <input className="input" placeholder="Título" value={form.titulo} onChange={(e) => setForm({ ...form, titulo: e.target.value })} />
        <input className="input" placeholder="Preço" value={form.precoVenda} onChange={(e) => setForm({ ...form, precoVenda: e.target.value })} />
        <input className="input" placeholder="Descrição" value={form.descricao} onChange={(e) => setForm({ ...form, descricao: e.target.value })} />
        <button className="button" type="submit">Salvar alterações</button>
      </form>
    </div>
  );
}

export default DashboardCliente;
