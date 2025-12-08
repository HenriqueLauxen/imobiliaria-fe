import React from 'react';
import { useNavigate } from 'react-router-dom';

function Home() {
  const navigate = useNavigate();

  function irParaImoveis() {
    navigate('/imoveis');
  }

  return (
    <div className="container">
      <h2>Bem-vindo</h2>
      <p>Este é um site simples feito só para testar as rotas e chamadas da API.</p>
      <button className="button" onClick={irParaImoveis}>Ver imóveis</button>
    </div>
  );
}

export default Home;
