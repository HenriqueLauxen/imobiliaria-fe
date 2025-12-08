const API_URL = 'https://imob-tjwp8g.fly.dev';

const getHeaders = () => {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const headers = { 'Content-Type': 'application/json' };
  if (user.id) {
    headers['userId'] = user.id;
  }
  return headers;
};

const handleResponse = async (response) => {
  if (response.status === 401) {
    localStorage.removeItem('user');
    window.location.href = '/';
    throw new Error('Sessão expirada ou login inválido');
  }
  if (response.status === 403) {
    throw new Error('Sem permissão');
  }
  if (!response.ok) {
    throw new Error('Erro na requisição');
  }
  
  const text = await response.text();
  return text ? JSON.parse(text) : {};
};

const api = {
  get: async (endpoint) => {
    const response = await fetch(`${API_URL}${endpoint}`, {
      headers: getHeaders(),
    });
    return handleResponse(response);
  },

  post: async (endpoint, data) => {
    const response = await fetch(`${API_URL}${endpoint}`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse(response);
  },

  put: async (endpoint, data) => {
    const response = await fetch(`${API_URL}${endpoint}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse(response);
  },

  delete: async (endpoint) => {
    const response = await fetch(`${API_URL}${endpoint}`, {
      method: 'DELETE',
      headers: getHeaders(),
    });
    return handleResponse(response);
  },
  
  upload: async (endpoint, formData) => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const headers = {};
    if (user.id) {
      headers['userId'] = user.id;
    }
    
    const response = await fetch(`${API_URL}${endpoint}`, {
      method: 'POST',
      headers: headers,
      body: formData,
    });
    return handleResponse(response);
  }
};

export default api;
