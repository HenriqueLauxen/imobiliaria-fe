import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fazerLogin } from '../api';

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');

  async function enviar(e) {
    e.preventDefault();
    setErro('');
    try {
      const user = await fazerLogin(email, senha);
      localStorage.setItem('user', JSON.stringify(user));
      if (user.tipo === 'ADMIN') {
        navigate('/admin');
      } else if (user.tipo === 'CORRETOR') {
        navigate('/corretor');
      } else {
        navigate('/cliente');
      }
    } catch (err) {
      setErro('Login inválido.');
    }
  }

  return (
    <div className="container">
      <h2>Login</h2>
      <form onSubmit={enviar}>
        <input className="input" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <input className="input" placeholder="Senha" type="password" value={senha} onChange={(e) => setSenha(e.target.value)} />
        <button className="button" type="submit">Entrar</button>
      </form>
      {erro && <div className="alert">{erro}</div>}
    </div>
  );
}

export default Login;
