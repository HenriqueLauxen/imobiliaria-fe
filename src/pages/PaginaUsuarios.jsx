import React, { useState, useEffect } from 'react';
import { Pencil, Trash2 } from 'lucide-react';
import api from '../services/api';
import Loading from '../components/Loading';

function PaginaUsuarios() {
  const [modo, setModo] = useState('lista');
  const [usuarios, setUsuarios] = useState([]);
  const [formulario, setFormulario] = useState({ nome: '', email: '', senha: '', tipo: '' });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    carregarUsuarios();
  }, []);

  const carregarUsuarios = async () => {
    try {
      setLoading(true);
      const dados = await api.get('/usuarios');
      setUsuarios(dados);
    } catch (error) {
      console.error("Erro ao carregar usuários:", error);
    } finally {
      setLoading(false);
    }
  };

  const salvarUsuario = async (e) => {
    e.preventDefault();
    
    if (!formulario.nome.trim()) {
      alert('O campo Nome é obrigatório');
      return;
    }
    if (!formulario.email.trim()) {
      alert('O campo Email é obrigatório');
      return;
    }
    if (!formulario.id && !formulario.senha.trim()) {
      alert('O campo Senha é obrigatório');
      return;
    }
    if (!formulario.tipo) {
      alert('Selecione um Tipo de usuário');
      return;
    }
    
    try {
      if (formulario.id) {
        await api.put(`/usuarios/${formulario.id}`, formulario);
      } else {
        await api.post('/usuarios', formulario);
      }
      await carregarUsuarios();
      setModo('lista');
      setFormulario({ nome: '', email: '', senha: '', tipo: '' });
    } catch (error) {
      alert('Erro ao salvar usuário');
    }
  };

  const deletarUsuario = async (id) => {
    if (confirm('Tem certeza que deseja excluir este usuário?')) {
      try {
        await api.delete(`/usuarios/${id}`);
        await carregarUsuarios();
      } catch (error) {
        alert('Erro ao excluir usuário');
      }
    }
  };

  const editarUsuario = (usuario) => {
    setFormulario(usuario);
    setModo('formulario');
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8 border-b border-[#0B132B]/10 pb-4">
        <h1 className="text-3xl font-light text-[#0B132B]">Gerenciar Usuários</h1>
        {modo === 'lista' && (
          <button 
            onClick={() => setModo('formulario')}
            className="px-4 py-2 rounded-md bg-[#0B132B] text-[#FFFFE4] hover:bg-[#0B132B]/90 transition shadow-lg"
          >
            + Novo Usuário
          </button>
        )}
        {modo === 'formulario' && (
          <button 
            onClick={() => setModo('lista')}
            className="px-4 py-2 rounded-md border border-[#0B132B] text-[#0B132B] hover:bg-[#0B132B] hover:text-[#FFFFE4] transition"
          >
            Voltar para Lista
          </button>
        )}
      </div>

      {loading ? (
        <Loading mensagem="Carregando usuários..." />
      ) : modo === 'lista' ? (
        <div className="bg-white rounded-lg border border-[#0B132B]/10 overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-[#0B132B]/5 text-[#0B132B]">
              <tr>
                <th className="p-4 font-semibold">Nome</th>
                <th className="p-4 font-semibold">Email</th>
                <th className="p-4 font-semibold">Tipo</th>
                <th className="p-4 font-semibold text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#0B132B]/10">
              {usuarios.map((usuario) => (
                <tr key={usuario.id} className="hover:bg-[#FFFFE4]/30 transition">
                  <td className="p-4">{usuario.nome}</td>
                  <td className="p-4 text-[#0B132B]/70">{usuario.email}</td>
                  <td className="p-4">
                    <span className="px-2 py-1 text-xs font-medium bg-[#0B132B]/10 rounded-full">
                      {usuario.tipo}
                    </span>
                  </td>
                  <td className="p-4 text-right space-x-2">
                    <button onClick={() => editarUsuario(usuario)} className="text-blue-600 hover:underline text-sm" title="Editar">
                      <Pencil size={18} className="inline" />
                    </button>
                    <button 
                      onClick={() => deletarUsuario(usuario.id)}
                      className="text-red-600 hover:underline text-sm"
                      title="Excluir"
                    >
                      <Trash2 size={18} className="inline" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg border border-[#0B132B]/10 shadow-sm">
          <h2 className="text-xl font-semibold mb-6 text-[#0B132B]">Cadastrar Novo Usuário</h2>
          <form onSubmit={salvarUsuario} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-[#0B132B] mb-2">Nome Completo</label>
              <input 
                type="text" 
                required
                className="w-full border border-[#0B132B]/20 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-[#0B132B] focus:border-transparent transition"
                value={formulario.nome}
                onChange={e => setFormulario({...formulario, nome: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#0B132B] mb-2">Email Corporativo</label>
              <input 
                type="email" 
                required
                className="w-full border border-[#0B132B]/20 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-[#0B132B] focus:border-transparent transition"
                value={formulario.email}
                onChange={e => setFormulario({...formulario, email: e.target.value})}
              />
            </div>
            {!formulario.id && (
              <div>
                <label className="block text-sm font-medium text-[#0B132B] mb-2">Senha</label>
                <input 
                  type="password" 
                  required
                  className="w-full border border-[#0B132B]/20 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-[#0B132B] focus:border-transparent transition"
                  value={formulario.senha}
                  onChange={e => setFormulario({...formulario, senha: e.target.value})}
                  placeholder="Mínimo 6 caracteres"
                />
              </div>
            )}
            <div>
              <label className="block text-sm font-medium text-[#0B132B] mb-2">Tipo</label>
              <select 
                required
                className="w-full border border-[#0B132B]/20 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-[#0B132B] focus:border-transparent transition bg-white"
                value={formulario.tipo}
                onChange={e => setFormulario({...formulario, tipo: e.target.value})}
              >
                <option value="">Selecione um tipo...</option>
                <option value="administrador">Administrador</option>
                <option value="corretor">Corretor</option>
                <option value="cliente">Cliente</option>
              </select>
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
                Salvar Usuário
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

export default PaginaUsuarios;
