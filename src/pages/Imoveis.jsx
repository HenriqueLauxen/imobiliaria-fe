import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { buscarImoveis } from '../api';

function Imoveis() {
  const [imoveis, setImoveis] = useState([]);
  const [erro, setErro] = useState('');

  async function carregar() {
    setErro('');
    try {
      const data = await buscarImoveis();
      setImoveis(data || []);
    } catch (e) {
      setErro('Não foi possível carregar os imóveis.');
    }
  }

  useEffect(() => {
    carregar();
  }, []);

  return (
    <div className="container">
      <h2>Imóveis</h2>
      {erro && <div className="alert">{erro}</div>}
      <div className="card-grid">
        {imoveis.map((item) => (
          <div className="card" key={item.id}>
            <img src={item.imagem || 'https://via.placeholder.com/300x180'} alt={item.titulo} />
            <h3>{item.titulo}</h3>
            <p>Preço: {item.precoVenda || item.preco || '---'}</p>
            <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
              <Link className="button secondary" to={`/imoveis/${item.id}`}>Detalhes</Link>
              <a className="button" href="https://api.whatsapp.com/send?phone=555597178810" target="_blank" rel="noreferrer">Comprar</a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Imoveis;
