import React from 'react';

function Loading({ mensagem = 'Carregando...' }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] p-8">
      <div className="relative">
        {/* Spinner externo */}
        <div className="w-16 h-16 border-4 border-[#0B132B]/20 rounded-full"></div>
        {/* Spinner animado */}
        <div className="absolute top-0 left-0 w-16 h-16 border-4 border-transparent border-t-[#0B132B] rounded-full animate-spin"></div>
      </div>
      <p className="mt-6 text-lg text-[#0B132B]/70 font-medium">{mensagem}</p>
      <div className="flex gap-1 mt-3">
        <span className="w-2 h-2 bg-[#0B132B]/40 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
        <span className="w-2 h-2 bg-[#0B132B]/40 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
        <span className="w-2 h-2 bg-[#0B132B]/40 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
      </div>
    </div>
  );
}

export default Loading;
