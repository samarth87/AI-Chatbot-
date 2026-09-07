const API_BASE = '/api';

export const getAuthToken = () => localStorage.getItem('token');
export const setAuthToken = (token) => {
  if (token) localStorage.setItem('token', token);
  else localStorage.removeItem('token');
};

const request = async (endpoint, options = {}) => {
  const token = getAuthToken();
  const headers = {
    ...(options.headers || {}),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  // If body is not FormData, default to JSON
  if (options.body && !(options.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
  }

  const res = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
  });

  const contentType = res.headers.get('content-type');
  let data;
  if (contentType && contentType.includes('application/json')) {
    data = await res.json();
  } else {
    data = await res.text();
  }

  if (!res.ok) {
    const errorMsg = data?.detail || data?.message || (typeof data === 'string' ? data : 'An error occurred');
    throw new Error(errorMsg);
  }

  return data;
};

export const api = {
  getConfig: () => request('/config'),
  signup: (payload) => request('/auth/signup', {
    method: 'POST',
    body: JSON.stringify(payload),
  }),
  login: (payload) => request('/auth/login', {
    method: 'POST',
    body: JSON.stringify(payload),
  }),
  getMe: () => request('/auth/me'),
  getChats: () => request('/chats'),
  createChat: (title) => request('/chats', {
    method: 'POST',
    body: JSON.stringify({ title }),
  }),
  getChatDetails: (chatId) => request(`/chats/${chatId}`),
  renameChat: (chatId, title) => request(`/chats/${chatId}`, {
    method: 'PATCH',
    body: JSON.stringify({ title }),
  }),
  deleteChat: (chatId) => request(`/chats/${chatId}`, {
    method: 'DELETE',
  }),
  sendMessage: async ({ chatId, prompt, model, level, length, files }) => {
    const formData = new FormData();
    formData.append('prompt', prompt || '');
    formData.append('model', model);
    formData.append('level', level);
    formData.append('length', length);

    if (files && files.length > 0) {
      files.forEach((file) => {
        formData.append('files', file);
      });
    }

    return request(`/chats/${chatId || 'new'}/message`, {
      method: 'POST',
      body: formData,
    });
  },
};