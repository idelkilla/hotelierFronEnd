// src/services/api.js
// Single source of truth for the API base URL.
// VITE_API_URL should be set to the backend root WITHOUT trailing slash:
//   e.g. https://hotelierbackend-1.onrender.com
// All routes below add /api/... themselves.

const BASE = (import.meta.env.VITE_API_URL || 'https://hotelierbackend-1.onrender.com')
  .replace(/\/+$/, '')          // strip trailing slash
  .replace(/\/api$/, '')        // strip accidental /api suffix

export const API_ROOT = BASE           // https://hotelierbackend-1.onrender.com
export const API      = `${BASE}/api`  // https://hotelierbackend-1.onrender.com/api

export async function apiFetch(path, options = {}) {
  const token = localStorage.getItem('user_token')
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  }
  const res = await fetch(`${API}${path}`, { ...options, headers }) //

  if (res.status === 401 || res.status === 403) { //
    // Token expirado o inválido — redirige al login
    localStorage.removeItem('user_token') //
    localStorage.removeItem('user_role') //
    window.location.href = '/login' //
    throw new Error('Sesión expirada') //
  }
  if (!res.ok) { //
    const err = await res.json().catch(() => ({}))
    throw new Error(err.message || `Error ${res.status}`)
  }
  return res.json()
}