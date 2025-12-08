import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { listarUsuarios, salvarUsuario, atualizarUsuario, apagarUsuario, buscarImoveis } from '../api';

function DashboardAdmin() {
  const navigate = useNavigate();
  const [usuarios, setUsuarios] = useState([]);
  const [imoveis, setImoveis] = useState([]);
  const [form, setForm] = useState({ nome: '', email: '', senha: '', tipo: 'ADMIN' });
  const [editId, setEditId] = useState(null);
  const [erro, setErro] = useState('');

  useEffect(() => {
    const saved = localStorage.getItem('user');
    const user = saved ? JSON.parse(saved) : null;
    if (!user || user.tipo !== 'ADMIN') {
      navigate('/login');
      return;
    }
    carregarUsuarios();
    carregarImoveis();
  }, [navigate]);

  async function carregarUsuarios() {
    try {
      const data = await listarUsuarios();
      setUsuarios(data || []);
    } catch (e) {
      setErro('Não foi possível carregar usuários.');
    }
  }

  async function carregarImoveis() {
    try {
      const data = await buscarImoveis();
      setImoveis(data || []);
    } catch (e) {
      setErro('Não foi possível carregar imóveis.');
    }
  }

  async function salvar(e) {
    e.preventDefault();
    setErro('');
    try {
      if (editId) {
        await atualizarUsuario(editId, form);
      } else {
        await salvarUsuario(form);
      }
      setForm({ nome: '', email: '', senha: '', tipo: 'ADMIN' });
      setEditId(null);
      carregarUsuarios();
    } catch (e) {
      setErro('Erro ao salvar usuário.');
    }
  }

  async function excluir(id) {
    try {
      await apagarUsuario(id);
      carregarUsuarios();
    } catch (e) {
      setErro('Erro ao excluir usuário.');
    }
  }

  function editar(user) {
    setEditId(user.id);
    setForm({ nome: user.nome || '', email: user.email || '', senha: '', tipo: user.tipo || 'ADMIN' });
  }

  return (
    <div className="container">
      <h2>Painel do Admin</h2>
      {erro && <div className="alert">{erro}</div>}

      <section>
        <h3>Usuários</h3>
        <form onSubmit={salvar}>
          <div className="form-row">
            <input className="input" placeholder="Nome" value={form.nome} onChange={(e) => setForm({ ...form, nome: e.target.value })} />
            <input className="input" placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            <input className="input" placeholder="Senha" type="password" value={form.senha} onChange={(e) => setForm({ ...form, senha: e.target.value })} />
            <select className="input" value={form.tipo} onChange={(e) => setForm({ ...form, tipo: e.target.value })}>
              <option value="ADMIN">ADMIN</option>
              <option value="CORRETOR">CORRETOR</option>
              <option value="CLIENTE">CLIENTE</option>
            </select>
          </div>
          <button className="button" type="submit">{editId ? 'Salvar edição' : 'Cadastrar'}</button>
          {editId && <button className="button secondary" type="button" onClick={() => { setEditId(null); setForm({ nome: '', email: '', senha: '', tipo: 'ADMIN' }); }}>Cancelar</button>}
        </form>

        <table className="simple-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nome</th>
              <th>Email</th>
              <th>Tipo</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {usuarios.map((u) => (
              <tr key={u.id}>
                <td>{u.id}</td>
                <td>{u.nome}</td>
                <td>{u.email}</td>
                <td>{u.tipo}</td>
                <td>
                  <button className="button secondary" onClick={() => editar(u)}>Editar</button>
                  <button className="button" onClick={() => excluir(u.id)}>Excluir</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section style={{ marginTop: '20px' }}>
        <h3>Imóveis (somente leitura aqui)</h3>
        <div className="card-grid">
          {imoveis.map((item) => (
            <div className="card" key={item.id}>
              <h4>{item.titulo}</h4>
              <p>Preço: {item.precoVenda || '---'}</p>
              <p>Corretor: {item.corretorId || '-'} | Cliente: {item.clienteId || '-'}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export default DashboardAdmin;
