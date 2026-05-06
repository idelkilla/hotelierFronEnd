// src/services/api.js
// Single source of truth for the API base URL.
// VITE_API_URL should be set to the backend root WITHOUT trailing slash:
//   e.g. https://hotelierbackend-1.onrender.com
// All routes below add /api/... themselves.

const BASE = (import.meta.env.VITE_API_URL || 'https://hotelierbackend-1.onrender.com/api')
  .trim()
  .replace(/\/+$/, '')          // strip trailing slash
  .replace(/\/api$/i, '')       // strip accidental /api suffix

export const API_ROOT = BASE           // https://hotelierbackend-1.onrender.com
export const API      = `${BASE}/api`  // https://hotelierbackend-1.onrender.com/api

export async function apiFetch(path, options = {}) {
  const token = localStorage.getItem('user_token')
  const headers = { ...options.headers }

  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }

  // Solo agregamos JSON si no es FormData y no se ha especificado otro tipo
  if (!(options.body instanceof FormData) && !headers['Content-Type']) {
    headers['Content-Type'] = 'application/json'
  }

  const res = await fetch(`${API}${path}`, {
    ...options,
    headers,
    credentials: 'include' // ← IMPORTANTE
  })

 if (res.status === 401 || res.status === 403) {
    throw new Error('No autenticado')
  }
  if (!res.ok) { //
    const err = await res.json().catch(() => ({}))
    throw new Error(err.message || `Error ${res.status}`)
  }
  return res.json()
}

// Para GET simple
export const apiGet = (path) => apiFetch(path)

// Para POST
export const apiPost = (path, data) =>
  apiFetch(path, { method: 'POST', body: JSON.stringify(data) })

// Para PUT
export const apiPut = (path, data) =>
  apiFetch(path, { method: 'PUT', body: JSON.stringify(data) })

// Para DELETE
export const apiDelete = (path) =>
  apiFetch(path, { method: 'DELETE' })
