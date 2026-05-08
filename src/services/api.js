// src/services/api.js
// Single source of truth for the API base URL.

// Desactiva logs en producción (evita exposición accidental de info sensible).
const DEBUG_LOGS = import.meta.env.DEV

const BASE = (import.meta.env.VITE_API_URL || 'https://hotelierbackend-1.onrender.com/api')
  .trim()
  .replace(/\/+$/, '')          // quita slash final
  .replace(/\/api$/i, '')       // quita /api accidental al final

export const API_ROOT = BASE           // https://hotelierbackend-1.onrender.com
export const API      = `${BASE}/api`  // https://hotelierbackend-1.onrender.com/api

// ─────────────────────────────────────────────
// Helper: convierte "" / undefined → null
// ─────────────────────────────────────────────
export const nullIfEmpty = (v) =>
  v === '' || v === undefined || v === null ? null : v

// ─────────────────────────────────────────────
// Helper: limpia el payload antes de enviarlo
//  - strings vacíos  → null
//  - id_*            → integer o null
//  - estatura / peso → número o null
// ─────────────────────────────────────────────
export function sanitizeProfilePayload(raw) {
  const strOrNull  = (v) => (v != null && String(v).trim() !== '' ? String(v).trim() : null)
  const intOrNull  = (v) => {
    if (v === '' || v == null) return null
    const n = parseInt(String(v).trim(), 10)
    return isNaN(n) ? null : n
  }
  const floatOrNull = (v) => {
    if (v === '' || v == null) return null
    const n = parseFloat(String(v).trim())
    return isNaN(n) ? null : n
  }

  const generoMap = { 'Masculino': 'M', 'Femenino': 'F', 'Otro': 'O' }
  const generoNorm = (v) => {
    if (!v) return null
    const s = String(v).trim()
    return generoMap[s] ?? s
  }

  const payload = {}
if (strOrNull(raw.nombre_completo))   payload.nombre_completo = strOrNull(raw.nombre_completo)
payload.segundo_nombre = strOrNull(raw.segundo_nombre)   // ← sin if, siempre se incluye (puede ser null)
if (strOrNull(raw.apellidos))         payload.apellidos = strOrNull(raw.apellidos)
  if (strOrNull(raw.fecha_nacimiento))       payload.fecha_nacimiento           = strOrNull(raw.fecha_nacimiento)
  if (raw.genero)                            payload.genero                     = generoNorm(raw.genero)
  if (strOrNull(raw.descripcion_personal) !== null) payload.descripcion_personal = strOrNull(raw.descripcion_personal)
  if (intOrNull(raw.id_pais)    !== null)    payload.id_pais                    = intOrNull(raw.id_pais)
  if (intOrNull(raw.id_ciudad)  !== null)    payload.id_ciudad                  = intOrNull(raw.id_ciudad)
  if (intOrNull(raw.id_ubicacion) !== null)  payload.id_ubicacion               = intOrNull(raw.id_ubicacion)
 
  if (raw.email?.trim())                     payload.email                      = raw.email.trim()
  if (strOrNull(raw.telefono_numero))        payload.telefono_numero            = strOrNull(raw.telefono_numero)
  if (strOrNull(raw.contacto_emergencia_nombre)) payload.contacto_emergencia_nombre = strOrNull(raw.contacto_emergencia_nombre)
  if (strOrNull(raw.contacto_emergencia_tel))    payload.contacto_emergencia_tel    = strOrNull(raw.contacto_emergencia_tel)
  if (strOrNull(raw.ubicacion_nombre))       payload.ubicacion_nombre           = strOrNull(raw.ubicacion_nombre)

  if (strOrNull(raw.documento_numero))       payload.numero_documento           = strOrNull(raw.documento_numero)
  if (strOrNull(raw.documento_emision))      payload.fecha_emision              = strOrNull(raw.documento_emision)
  if (strOrNull(raw.documento_expiracion))   payload.fecha_expiracion           = strOrNull(raw.documento_expiracion)
  if (strOrNull(raw.documento_emisor))       payload.emisor                     = strOrNull(raw.documento_emisor)

  if (strOrNull(raw.num_viajero_conocido))   payload.num_viajero_conocido       = strOrNull(raw.num_viajero_conocido)
  if (strOrNull(raw.num_dhs_trip))           payload.num_dhs_trip               = strOrNull(raw.num_dhs_trip)


  if (strOrNull(raw.estatura) !== null)      payload.estatura = String(raw.estatura).trim().substring(0, 5)
  if (strOrNull(raw.peso)     !== null)      payload.peso     = String(raw.peso).trim().substring(0, 5)
  if (strOrNull(raw.sangre)   !== null)      payload.sangre   = String(raw.sangre).trim().substring(0, 3)

  if (strOrNull(raw.ocupacion))              payload.ocupacion                  = strOrNull(raw.ocupacion)
  if (strOrNull(raw.nacionalidad))           payload.nacionalidad               = strOrNull(raw.nacionalidad)
  if (strOrNull(raw.estado_civil))           payload.estado_civil               = strOrNull(raw.estado_civil)

  // al final de sanitizeProfilePayload, antes del return:
  return payload
}
// ─────────────────────────────────────────────
// Core fetch wrapper
// ─────────────────────────────────────────────
export async function apiFetch(path, options = {}) {
  const token   = localStorage.getItem('user_token')
  const headers = { ...options.headers }

  // No loguear info sensible/operativa (tokens/URLs) en consola.

  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }

  if (!(options.body instanceof FormData) && !headers['Content-Type']) {
    headers['Content-Type'] = 'application/json'
  }

  try {
    const res = await fetch(`${API}${path}`, {
      ...options,
      headers,
      credentials: 'include'  // necesario para cookies de sesión
    })

    // status logs deshabilitados para no saturar consola

    if (res.status === 401 && token) {
      let errBody = {}
      try { errBody = await res.clone().json() } catch (_) {}

      // ✅ Solo cerrar sesión si el backend indica token inválido
      // NO cerrar si es "perfil incompleto" u otro 401
      const msg = (errBody.message || errBody.error || '').toLowerCase()
      const esSesionExpirada = msg.includes('token') || msg.includes('autenti')

      if (esSesionExpirada && msg.includes('token')) {
      // Mensaje genérico para no filtrar detalles en consola
        localStorage.removeItem('user_token')
        localStorage.removeItem('user_role')
        localStorage.removeItem('user_name')
        window.location.href = '/login'
        throw new Error('Sesión expirada')
      }

      // Para otros 401 (ej: perfil incompleto), lanzar el error pero NO cerrar sesión
      const error = new Error(errBody.message || errBody.error || 'No autorizado')
      error.status = 401
      throw error
    }

    if (!res.ok) {
      let err = {}
      try {
        err = await res.json()
      } catch (_) {
        err = { message: `Error ${res.status}` }
      }

      // Error detallado solo en el backend; en frontend mostramos mensaje genérico.

      // Lanzar con el mensaje del backend para que el componente lo muestre
      const error    = new Error(err.message || err.error || `Error ${res.status}`)
      error.status   = res.status
      error.details  = err
      throw error
    }

    const data = await res.json()
    return data

  } catch (err) {
    // Evitar imprimir detalles internos en consola del cliente.
    throw err
  }
}

// ─────────────────────────────────────────────
// Métodos HTTP de conveniencia
// ─────────────────────────────────────────────
export const apiGet    = (path)        => apiFetch(path)
export const apiPost   = (path, data)  => apiFetch(path, { method: 'POST',   body: JSON.stringify(data) })
export const apiPut    = (path, data)  => apiFetch(path, { method: 'PUT',    body: JSON.stringify(data) })
export const apiDelete = (path)        => apiFetch(path, { method: 'DELETE' })

// ─────────────────────────────────────────────
// PUT de perfil con sanitización automática
// Uso: await apiPutPerfil(formPerfil)
// ─────────────────────────────────────────────
export const apiPutPerfil = (rawForm) =>
  apiPut('/perfil/profile/update', sanitizeProfilePayload(rawForm))
