import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { buscarImovel } from '../api';

function Imovel() {
  const { id } = useParams();
  const [imovel, setImovel] = useState(null);
  const [erro, setErro] = useState('');

  useEffect(() => {
    async function carregar() {
      setErro('');
      try {
        const data = await buscarImovel(id);
        setImovel(data);
      } catch (e) {
        setErro('Erro ao carregar o imóvel.');
      }
    }
    carregar();
  }, [id]);

  if (erro) {
    return <div className="container"><div className="alert">{erro}</div></div>;
  }

  if (!imovel) {
    return <div className="container">Carregando...</div>;
  }

  return (
    <div className="container">
      <h2>{imovel.titulo}</h2>
      <img src={imovel.imagem || 'https://via.placeholder.com/300x180'} alt={imovel.titulo} />
      <p>Preço: {imovel.precoVenda || imovel.preco || '---'}</p>
      <p>Descrição: {imovel.descricao || 'Sem descrição'}</p>
      <p>Finalidade: {imovel.finalidade || '-'}</p>
      <p>Status: {imovel.status || '-'}</p>
      <a className="button" href="https://api.whatsapp.com/send?phone=555597178810" target="_blank" rel="noreferrer">Comprar</a>
    </div>
  );
}

export default Imovel;
