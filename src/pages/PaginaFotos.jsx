import React, { useState, useEffect } from 'react';
import { Pencil, Trash2, Upload } from 'lucide-react';
import api from '../services/api';
import Loading from '../components/Loading';

function PaginaFotos() {
  const [modo, setModo] = useState('lista');
  const [fotos, setFotos] = useState([]);
  const [imoveis, setImoveis] = useState([]);
  const [formulario, setFormulario] = useState({ 
    capa: false, 
    ordem: 1,
    imovelId: ''
  });
  const [arquivo, setArquivo] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    carregarDados();
  }, []);

  const carregarDados = async () => {
    try {
      setLoading(true);
      const [fotosData, imoveisData] = await Promise.all([
        api.get('/fotos'),
        api.get('/imoveis')
      ]);
      setFotos(fotosData);
      setImoveis(imoveisData);
    } catch (error) {
      console.error("Erro ao carregar dados:", error);
    } finally {
      setLoading(false);
    }
  };

  const salvarFoto = async (e) => {
    e.preventDefault();
    
    if (!arquivo && !formulario.id) {
      alert('Selecione uma imagem para upload');
      return;
    }
    
    if (!formulario.imovelId) {
      alert('Selecione um imóvel');
      return;
    }

    try {
      setUploading(true);
      
      if (formulario.id) {
        // Edição - atualiza apenas metadados
        const payload = {
          ...formulario,
          imovel: imoveis.find(i => i.id == formulario.imovelId)
        };
        await api.put(`/fotos/${formulario.id}`, payload);
      } else {
        const formData = new FormData();
        formData.append('file', arquivo);
        formData.append('imovelId', formulario.imovelId);
        formData.append('capa', true);
        formData.append('ordem', formulario.ordem);

        const response = await fetch('/api/fotos/upload', {
          method: 'POST',
          body: formData
        });
        
        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(errorText || 'Erro ao fazer upload');
        }
      }
      
      await carregarDados();
      setModo('lista');
      setFormulario({ capa: false, ordem: 1, imovelId: '' });
      setArquivo(null);
      setPreviewUrl(null);
    } catch (error) {
      console.error('Erro ao salvar foto:', error);
      alert('Erro ao salvar foto: ' + error.message);
    } finally {
      setUploading(false);
    }
  };

  const deletarFoto = async (id) => {
    if (confirm('Deseja excluir esta foto?')) {
      try {
        await api.delete(`/fotos/${id}`);
        await carregarDados();
      } catch (error) {
        alert('Erro ao excluir foto');
      }
    }
  };

  const editarFoto = (foto) => {
    setFormulario({
      id: foto.id,
      capa: foto.capa,
      ordem: foto.ordem,
      imovelId: foto.imovel?.id,
      caminho: foto.caminho,
      nomeArquivo: foto.nomeArquivo
    });
    setPreviewUrl(foto.caminho);
    setModo('formulario');
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8 border-b border-[#0B132B]/10 pb-4">
        <h1 className="text-3xl font-light text-[#0B132B]">Galeria de Fotos</h1>
        {modo === 'lista' && (
          <button 
            onClick={() => setModo('formulario')}
            className="px-4 py-2 rounded-md bg-[#0B132B] text-[#FFFFE4] hover:bg-[#0B132B]/90 transition shadow-lg"
          >
            + Adicionar Foto
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
        <Loading mensagem="Carregando fotos..." />
      ) : modo === 'lista' ? (
        <>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {fotos.map((foto) => (
              <div key={foto.id} className="group relative aspect-square bg-gray-100 rounded-lg overflow-hidden border border-[#0B132B]/10">
                {foto.caminho ? (
                  <img 
                    src={foto.caminho} 
                    alt={foto.nomeArquivo}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-400 bg-gray-200">
                    <span className="text-sm font-medium">{foto.nomeArquivo}</span>
                    <span className="text-xs mt-1">Imóvel: {foto.imovel?.titulo || 'N/A'}</span>
                  </div>
                )}
                {foto.capa && (
                  <span className="absolute top-2 left-2 bg-[#0B132B] text-[#FFFFE4] text-xs px-2 py-1 rounded">
                    Capa
                  </span>
                )}
                <div className="absolute inset-0 bg-[#0B132B]/80 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                  <button 
                    onClick={() => editarFoto(foto)}
                    className="text-[#FFFFE4] hover:scale-110 transition"
                    title="Editar"
                  >
                    <Pencil size={32} />
                  </button>
                  <button 
                    onClick={() => deletarFoto(foto.id)}
                    className="text-[#FFFFE4] hover:scale-110 transition"
                    title="Excluir"
                  >
                    <Trash2 size={32} />
                  </button>
                </div>
              </div>
            ))}
          </div>
          {fotos.length === 0 && (
            <div className="text-center py-12 text-[#0B132B]/50">
              Nenhuma foto cadastrada. Clique em "+ Adicionar Foto" para começar.
            </div>
          )}
        </>
      ) : (
        <div className="max-w-xl mx-auto bg-white p-8 rounded-lg border border-[#0B132B]/10 shadow-sm">
          <h2 className="text-xl font-semibold mb-6 text-[#0B132B]">
            {formulario.id ? 'Editar Foto' : 'Nova Foto'}
          </h2>
          <form onSubmit={salvarFoto} className="space-y-6">
            {/* Upload de Imagem */}
            {!formulario.id && (
              <div>
                <label className="block text-sm font-medium text-[#0B132B] mb-2">Selecionar Imagem</label>
                <div 
                  className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors
                    ${previewUrl ? 'border-[#0B132B]' : 'border-[#0B132B]/20 hover:border-[#0B132B]/50'}`}
                  onClick={() => document.getElementById('fileInput').click()}
                >
                  {previewUrl ? (
                    <div className="relative">
                      <img 
                        src={previewUrl} 
                        alt="Preview" 
                        className="max-h-48 mx-auto rounded-md object-contain"
                      />
                      <p className="mt-2 text-sm text-[#0B132B]/60">{arquivo?.name}</p>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-2 text-[#0B132B]/50">
                      <Upload size={40} />
                      <p className="text-sm">Clique para selecionar uma imagem</p>
                      <p className="text-xs">JPG, PNG ou GIF (máx. 5MB)</p>
                    </div>
                  )}
                </div>
                <input 
                  id="fileInput"
                  type="file" 
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (file) {
                      setArquivo(file);
                      setPreviewUrl(URL.createObjectURL(file));
                    }
                  }}
                />
              </div>
            )}

            {/* Preview da imagem em edição */}
            {formulario.id && previewUrl && (
              <div>
                <label className="block text-sm font-medium text-[#0B132B] mb-2">Imagem Atual</label>
                <div className="border border-[#0B132B]/20 rounded-lg p-4 text-center">
                  <img 
                    src={previewUrl} 
                    alt="Imagem atual" 
                    className="max-h-48 mx-auto rounded-md object-contain"
                  />
                  <p className="mt-2 text-sm text-[#0B132B]/60">{formulario.nomeArquivo}</p>
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-[#0B132B] mb-2">Imóvel</label>
              <select 
                required
                className="w-full border border-[#0B132B]/20 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-[#0B132B] transition bg-white"
                value={formulario.imovelId || ''}
                onChange={e => setFormulario({...formulario, imovelId: e.target.value})}
              >
                <option value="">Selecione um imóvel...</option>
                {imoveis.map(i => <option key={i.id} value={i.id}>{i.titulo}</option>)}
              </select>
            </div>
            <div className="pt-4 flex justify-end gap-4">
              <button 
                type="button"
                onClick={() => {
                  setModo('lista');
                  setFormulario({ capa: false, ordem: 1, imovelId: '' });
                  setArquivo(null);
                  setPreviewUrl(null);
                }}
                className="px-6 py-2 rounded-md border border-[#0B132B]/20 text-[#0B132B] hover:bg-gray-50 transition"
              >
                Cancelar
              </button>
              <button 
                type="submit"
                disabled={uploading}
                className="px-6 py-2 rounded-md bg-[#0B132B] text-[#FFFFE4] hover:bg-[#0B132B]/90 transition shadow-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {uploading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-[#FFFFE4]/30 border-t-[#FFFFE4] rounded-full animate-spin"></div>
                    Enviando...
                  </>
                ) : (
                  'Salvar'
                )}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

export default PaginaFotos;
