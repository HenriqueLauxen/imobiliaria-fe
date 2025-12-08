const API_URL = 'https://imobiliaria-be.fly.dev';

const api = {
  /**
   * GET
   * @param {string} endpoint
   * @returns {Promise}
   */
  get: async (endpoint) => {
    const response = await fetch(`${API_URL}${endpoint}`);
    if (!response.ok) throw new Error('Erro ao buscar dados');
    return response.json();
  },

  /**
   * POST
   * @param {string} endpoint
   * @param {Object} data
   * @returns {Promise}
   */
  post: async (endpoint, data) => {
    const response = await fetch(`${API_URL}${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Erro ao salvar dados');
    const text = await response.text();
    return text ? JSON.parse(text) : {};
  },

  /**
   * PUT
   * @param {string} endpoint
   * @param {Object} data
   * @returns {Promise}
   */
  put: async (endpoint, data) => {
    const response = await fetch(`${API_URL}${endpoint}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Erro ao atualizar dados');
    const text = await response.text();
    return text ? JSON.parse(text) : {};
  },

  /**
   * DELETE
    @param {string} endpoint
    @returns {Promise}
   */
  delete: async (endpoint) => {
    const response = await fetch(`${API_URL}${endpoint}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Erro ao excluir dados');
    return true;
  }
};

export default api;
