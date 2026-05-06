// src/services/api.js - VERSIÓN MEJORADA
// Single source of truth for the API base URL.

const BASE = (import.meta.env.VITE_API_URL || 'https://hotelierbackend-1.onrender.com/api')
  .trim()
  .replace(/\/+$/, '')          // strip trailing slash
  .replace(/\/api$/i, '')       // strip accidental /api suffix

export const API_ROOT = BASE           // https://hotelierbackend-1.onrender.com
export const API      = `${BASE}/api`  // https://hotelierbackend-1.onrender.com/api

export async function apiFetch(path, options = {}) {
  const token = localStorage.getItem('user_token')
  const headers = { ...options.headers }

  console.log('🌐 apiFetch:', {
    path,
    method: options.method || 'GET',
    hasToken: !!token,
    url: `${API}${path}`
  })

  // ✅ SIEMPRE enviar token si existe
  if (token) {
    headers['Authorization'] = `Bearer ${token}`
    console.log(`✅ Token added: ${token.slice(0, 20)}...`)
  } else {
    console.warn('⚠️ No token in localStorage')
  }

  // Solo agregamos JSON si no es FormData y no se ha especificado otro tipo
  if (!(options.body instanceof FormData) && !headers['Content-Type']) {
    headers['Content-Type'] = 'application/json'
  }

  try {
    const res = await fetch(`${API}${path}`, {
      ...options,
      headers,
      credentials: 'include' // ← IMPORTANTE para cookies
    })

    console.log(`📊 Response status: ${res.status} ${res.statusText}`)

    // ✅ Si la petición fue rechazada por autenticación Y teníamos token, redirigir
    if ((res.status === 401 || res.status === 403) && token) {
      console.warn('⚠️ Token rechazado por servidor. Sesión expirada.')
      localStorage.removeItem('user_token')
      localStorage.removeItem('user_role')
      localStorage.removeItem('user_name')
      window.location.href = '/login'
      throw new Error('Sesión expirada')
    }

    // ✅ Si no hay token y falla, es un error normal (no redirigir)
    if (!res.ok) {
      let err = {}
      try {
        err = await res.json()
      } catch (_) {
        err = { message: `Error ${res.status}` }
      }
      
      console.error('❌ API Error:', {
        status: res.status,
        message: err.message || err.error,
        details: err
      })

      throw new Error(err.message || err.error || `Error ${res.status}`)
    }

    const data = await res.json()
    console.log('✅ Response data:', data)
    return data
  } catch (err) {
    console.error('❌ Fetch error:', err.message)
    throw err
  }
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