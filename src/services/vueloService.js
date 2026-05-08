// services/vueloService.js
// All API calls related to flights.
// The base URL reads from Vite's env var (VITE_API_URL) so it works
// in both local dev (http://localhost:10000) and production.

const BASE = import.meta.env.VITE_API_URL ?? ''

// ─────────────────────────────────────────────────────────────
// Helper: throw a readable error from any non-2xx response
// ─────────────────────────────────────────────────────────────
async function apiFetch(path, options = {}) {
  const res = await fetch(`${BASE}${path}`, {
    ...options,
    headers: { 'Content-Type': 'application/json', ...options.headers },
  })
  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    throw new Error(body.error ?? body.message ?? `HTTP ${res.status}`)
  }
  return res.json()
}

// ─────────────────────────────────────────────────────────────
// getAeropuertos(q)
// Searches UBICACION for airports matching the query string.
// Used by the origin/destination autocomplete inputs.
//
// Returns: Array<{ id, ubicacion, ciudad, pais, iata_origen }>
// ─────────────────────────────────────────────────────────────
export async function getAeropuertos(q = '') {
  const params = new URLSearchParams()
  if (q) params.set('q', q)
  return apiFetch(`/api/search/aeropuertos?${params}`)
}

// ─────────────────────────────────────────────────────────────
// getFiltrosVuelos(params)
// Returns filter metadata for the sidebar: airlines, cabin classes,
// duration range, and stop counts. Optionally scoped to a route.
//
// params: { id_origen?, id_destino? }
// Returns: { aerolineas, clases, duracion, escalas }
// ─────────────────────────────────────────────────────────────
export async function getFiltrosVuelos(params = {}) {
  const qs = new URLSearchParams()
  if (params.id_origen)  qs.set('id_origen',  params.id_origen)
  if (params.id_destino) qs.set('id_destino', params.id_destino)
  return apiFetch(`/api/vuelos/filtros?${qs}`)
}

// ─────────────────────────────────────────────────────────────
// buscarVuelos(params)
// Searches for flights matching the given criteria.
//
// params: {
//   id_origen:    number  (required)
//   id_destino:   number  (required)
//   fecha_salida: string  (required, YYYY-MM-DD)
//   pasajeros?:   number
//   id_clase?:    number
//   id_proveedor?: number
//   max_horas?:   number
// }
// Returns: Array<VueloRow>
// ─────────────────────────────────────────────────────────────
export async function buscarVuelos(params = {}) {
  const qs = new URLSearchParams()

  // Required
  qs.set('id_origen',    params.id_origen)
  qs.set('id_destino',   params.id_destino)
  qs.set('fecha_salida', params.fecha_salida)

  // Optional
  if (params.pasajeros)    qs.set('pasajeros',    params.pasajeros)
  if (params.id_clase)     qs.set('id_clase',     params.id_clase)
  if (params.id_proveedor) qs.set('id_proveedor', params.id_proveedor)
  if (params.max_horas)    qs.set('max_horas',    params.max_horas)

  return apiFetch(`/api/vuelos/buscar?${qs}`)
}

// ─────────────────────────────────────────────────────────────
// getDetalleVuelo(id)
// Returns full detail for a single flight including all class options.
//
// Returns: VueloRow & { clases: Array<ClaseRow> }
// ─────────────────────────────────────────────────────────────
export async function getDetalleVuelo(id) {
  return apiFetch(`/api/vuelos/${id}`)
}

export default {
  getAeropuertos,
  getFiltrosVuelos,
  buscarVuelos,
  getDetalleVuelo
}