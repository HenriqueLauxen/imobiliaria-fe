import React, { useEffect } from 'react';
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react';

/**
 * Componente Toast para exibir notificações temporárias
 * @param {string} message - Mensagem a ser exibida
 * @param {string} type - Tipo do toast: 'success', 'error', 'info'
 * @param {function} onClose - Callback executado ao fechar o toast
 * @param {number} duration - Duração em ms antes de fechar automaticamente (padrão: 4000)
 */
function Toast({ message, type = 'info', onClose, duration = 4000 }) {
  // Auto-close após a duração especificada
  useEffect(() => {
    if (duration) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  // Configurações de ícone e estilo baseadas no tipo
  const configs = {
    success: {
      icon: <CheckCircle size={20} />,
      className: 'toast-success'
    },
    error: {
      icon: <AlertCircle size={20} />,
      className: 'toast-error'
    },
    info: {
      icon: <Info size={20} />,
      className: 'toast-info'
    }
  };

  const config = configs[type] || configs.info;

  return (
    <div className={`toast ${config.className}`}>
      <div className="toast-icon">
        {config.icon}
      </div>
      <div className="toast-message">{message}</div>
      <button 
        onClick={onClose} 
        className="toast-close"
        aria-label="Fechar notificação"
      >
        <X size={18} />
      </button>
    </div>
  );
}

export default Toast;
