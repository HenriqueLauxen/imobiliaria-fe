const API = '/api';

function getUserId() {
  try {
    const saved = localStorage.getItem('user');
    const obj = saved ? JSON.parse(saved) : null;
    return obj ? obj.id : null;
  } catch (e) {
    return null;
  }
}

function buildHeaders() {
  const userId = getUserId();
  const headers = { 'Content-Type': 'application/json' };
  if (userId) {
    headers['userId'] = userId;
  }
  return headers;
}

async function fazerLogin(email, senha) {
  const resp = await fetch('/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, senha }),
  });
  if (!resp.ok) {
    throw new Error('login');
  }
  return resp.json();
}

async function buscarImoveis() {
  const resp = await fetch(`${API}/imoveis`, { headers: buildHeaders() });
  if (!resp.ok) throw new Error('erro');
  return resp.json();
}

async function buscarImovel(id) {
  const resp = await fetch(`${API}/imoveis/${id}`, { headers: buildHeaders() });
  if (!resp.ok) throw new Error('erro');
  return resp.json();
}

async function salvarImovel(data) {
  const resp = await fetch(`${API}/imoveis`, {
    method: 'POST',
    headers: buildHeaders(),
    body: JSON.stringify(data),
  });
  if (!resp.ok) throw new Error('erro');
  return resp.json();
}

async function atualizarImovel(id, data) {
  const resp = await fetch(`${API}/imoveis/${id}`, {
    method: 'PUT',
    headers: buildHeaders(),
    body: JSON.stringify(data),
  });
  if (!resp.ok) throw new Error('erro');
  return resp.json();
}

async function apagarImovel(id) {
  const resp = await fetch(`${API}/imoveis/${id}`, {
    method: 'DELETE',
    headers: buildHeaders(),
  });
  if (!resp.ok) throw new Error('erro');
  return true;
}

async function listarUsuarios() {
  const resp = await fetch(`${API}/usuarios`, { headers: buildHeaders() });
  if (!resp.ok) throw new Error('erro');
  return resp.json();
}

async function salvarUsuario(data) {
  const resp = await fetch(`${API}/usuarios`, {
    method: 'POST',
    headers: buildHeaders(),
    body: JSON.stringify(data),
  });
  if (!resp.ok) throw new Error('erro');
  return resp.json();
}

async function atualizarUsuario(id, data) {
  const resp = await fetch(`${API}/usuarios/${id}`, {
    method: 'PUT',
    headers: buildHeaders(),
    body: JSON.stringify(data),
  });
  if (!resp.ok) throw new Error('erro');
  return resp.json();
}

async function apagarUsuario(id) {
  const resp = await fetch(`${API}/usuarios/${id}`, {
    method: 'DELETE',
    headers: buildHeaders(),
  });
  if (!resp.ok) throw new Error('erro');
  return true;
}

export {
  fazerLogin,
  buscarImoveis,
  buscarImovel,
  salvarImovel,
  atualizarImovel,
  apagarImovel,
  listarUsuarios,
  salvarUsuario,
  atualizarUsuario,
  apagarUsuario,
};
