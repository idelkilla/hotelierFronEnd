import { apiGet } from './api'

export const getFiltrosVuelos = (params = {}) => {
  const query = new URLSearchParams(params).toString()
  return apiGet(`/vuelos/filtros${query ? '?' + query : ''}`)
}

export const buscarVuelos = (params = {}) => {
  const query = new URLSearchParams(params).toString()
  return apiGet(`/vuelos${query ? '?' + query : ''}`)
}

export default {
  getFiltrosVuelos,
  buscarVuelos
}