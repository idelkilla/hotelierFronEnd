<template>
  <div class="reservas-page">
    <!-- Header -->
    <div class="page-header">
      <div class="header-left">
        <h1 class="page-title">Reservas</h1>
        <p class="page-subtitle">Gestión de reservas y viajes</p>
      </div>
      <div class="header-actions">
        <div class="search-box">
          <i class="fas fa-search"></i>
          <input v-model="searchQuery" type="text" placeholder="Buscar reserva, cliente..." />
        </div>
        <select v-model="filterEstado" class="filter-select">
          <option value="">Todos los estados</option>
          <option v-for="e in estados" :key="e.ID_ESTADO" :value="e.ID_ESTADO">{{ e.ESTADO }}</option>
        </select>
      </div>
    </div>

    <!-- Stats bar -->
    <div class="stats-bar">
      <div class="stat-card" v-for="stat in stats" :key="stat.label">
        <span class="stat-value">{{ stat.value }}</span>
        <span class="stat-label">{{ stat.label }}</span>
        <div class="stat-dot" :style="{ background: stat.color }"></div>
      </div>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="loading-state">
      <div class="spinner"></div>
      <p>Cargando reservas...</p>
    </div>

    <!-- Error -->
    <div v-else-if="error" class="error-state">
      <i class="fas fa-exclamation-triangle"></i>
      <p>{{ error }}</p>
      <button @click="fetchReservas" class="btn-retry">Reintentar</button>
    </div>

    <!-- Table -->
    <div v-else class="table-container">
      <table class="reservas-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Cliente</th>
            <th>Origen</th>
            <th>Destino</th>
            <th>Fecha inicio</th>
            <th>Fecha fin</th>
            <th>Estado</th>
            <th>Empleado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="r in reservasFiltradas" :key="r.ID_RESERVA" class="table-row">
            <td class="id-cell">#{{ r.ID_RESERVA }}</td>
            <td>
              <div class="client-cell">
                <div class="avatar">{{ initials(r.cliente_nombre) }}</div>
                <span>{{ r.cliente_nombre || '—' }}</span>
              </div>
            </td>
            <td>{{ r.origen_nombre || r.ID_ORIGEN }}</td>
            <td>{{ r.destino_nombre || r.ID_DESTINO }}</td>
            <td>{{ formatDate(r.FECHA_INICIO) }}</td>
            <td>{{ formatDate(r.FECHA_FIN) }}</td>
            <td>
              <span class="badge" :class="estadoClass(r.estado_nombre)">
                {{ r.estado_nombre || '—' }}
              </span>
            </td>
            <td>{{ r.empleado_nombre || r.ID_EMPLEADO }}</td>
            <td>
              <div class="action-buttons">
                <button class="btn-icon view" title="Ver detalles" @click="verDetalle(r)">
                  <i class="fas fa-eye"></i>
                </button>
                <button class="btn-icon edit" title="Cambiar estado" @click="abrirCambioEstado(r)">
                  <i class="fas fa-edit"></i>
                </button>
              </div>
            </td>
          </tr>
          <tr v-if="reservasFiltradas.length === 0">
            <td colspan="9" class="empty-row">No se encontraron reservas.</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Detalle Modal -->
    <div v-if="selectedReserva" class="modal-overlay" @click.self="selectedReserva = null">
      <div class="modal">
        <button class="modal-close" @click="selectedReserva = null"><i class="fas fa-times"></i></button>
        <h2 class="modal-title">Reserva #{{ selectedReserva.ID_RESERVA }}</h2>
        <div class="modal-grid">
          <div class="modal-field">
            <label>Cliente</label>
            <p>{{ selectedReserva.cliente_nombre || selectedReserva.ID_CLIENTE }}</p>
          </div>
          <div class="modal-field">
            <label>Estado</label>
            <p><span class="badge" :class="estadoClass(selectedReserva.estado_nombre)">{{ selectedReserva.estado_nombre }}</span></p>
          </div>
          <div class="modal-field">
            <label>Origen</label>
            <p>{{ selectedReserva.origen_nombre || selectedReserva.ID_ORIGEN }}</p>
          </div>
          <div class="modal-field">
            <label>Destino</label>
            <p>{{ selectedReserva.destino_nombre || selectedReserva.ID_DESTINO }}</p>
          </div>
          <div class="modal-field">
            <label>Fecha inicio</label>
            <p>{{ formatDate(selectedReserva.FECHA_INICIO) }}</p>
          </div>
          <div class="modal-field">
            <label>Fecha fin</label>
            <p>{{ formatDate(selectedReserva.FECHA_FIN) }}</p>
          </div>
          <div class="modal-field">
            <label>Empleado asignado</label>
            <p>{{ selectedReserva.empleado_nombre || selectedReserva.ID_EMPLEADO }}</p>
          </div>
        </div>

        <!-- Detalles de habitación -->
        <div v-if="detalles.length" class="modal-section">
          <h3>Detalles de alojamiento</h3>
          <div class="detail-list">
            <div v-for="d in detalles" :key="d.ID_DETALLE" class="detail-item">
              <span>{{ d.CANTIDAD_NOCHE }} noches</span>
              <span>{{ formatDate(d.FECHA_INICIO) }} → {{ formatDate(d.FECHA_FIN) }}</span>
              <span class="price">${{ d.PRECIO_TOTAL?.toFixed(2) }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Estado Change Modal -->
    <div v-if="cambioEstadoReserva" class="modal-overlay" @click.self="cambioEstadoReserva = null">
      <div class="modal modal--small">
        <button class="modal-close" @click="cambioEstadoReserva = null"><i class="fas fa-times"></i></button>
        <h2 class="modal-title">Cambiar estado</h2>
        <p class="modal-sub">Reserva #{{ cambioEstadoReserva.ID_RESERVA }}</p>
        <select v-model="nuevoEstado" class="filter-select full">
          <option v-for="e in estados" :key="e.ID_ESTADO" :value="e.ID_ESTADO">{{ e.ESTADO }}</option>
        </select>
        <button class="btn-primary" @click="cambiarEstado">Guardar cambio</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

const API = import.meta.env.VITE_API_URL || 'https://hotelierbackend-1.onrender.com'

const reservas = ref([])
const estados = ref([])
const detalles = ref([])
const loading = ref(true)
const error = ref(null)
const searchQuery = ref('')
const filterEstado = ref('')
const selectedReserva = ref(null)
const cambioEstadoReserva = ref(null)
const nuevoEstado = ref(null)

const stats = computed(() => {
  const total = reservas.value.length
  const activas = reservas.value.filter(r => r.estado_nombre?.toLowerCase().includes('confirm')).length
  const pendientes = reservas.value.filter(r => r.estado_nombre?.toLowerCase().includes('pend')).length
  const canceladas = reservas.value.filter(r => r.estado_nombre?.toLowerCase().includes('cancel')).length
  return [
    { label: 'Total', value: total, color: '#265073' },
    { label: 'Activas', value: activas, color: '#10b981' },
    { label: 'Pendientes', value: pendientes, color: '#f59e0b' },
    { label: 'Canceladas', value: canceladas, color: '#ef4444' },
  ]
})

const reservasFiltradas = computed(() => {
  return reservas.value.filter(r => {
    const q = searchQuery.value.toLowerCase()
    const matchQ = !q ||
      String(r.ID_RESERVA).includes(q) ||
      r.cliente_nombre?.toLowerCase().includes(q) ||
      r.origen_nombre?.toLowerCase().includes(q) ||
      r.destino_nombre?.toLowerCase().includes(q)
    const matchE = !filterEstado.value || r.ID_ESTADO === filterEstado.value
    return matchQ && matchE
  })
})

async function fetchReservas() {
  loading.value = true
  error.value = null
  try {
    const token = localStorage.getItem('user_token')
    const headers = { Authorization: `Bearer ${token}` }

    const [resRes, estRes] = await Promise.all([
      fetch(`${API}/api/reservas`, { headers }),
      fetch(`${API}/api/catalogos/estados-reserva`, { headers }),
    ])

    if (!resRes.ok) throw new Error('Error al cargar reservas')
    reservas.value = await resRes.json()
    if (estRes.ok) estados.value = await estRes.json()
  } catch (e) {
    error.value = e.message
  } finally {
    loading.value = false
  }
}

async function verDetalle(r) {
  selectedReserva.value = r
  detalles.value = []
  try {
    const token = localStorage.getItem('user_token')
    const res = await fetch(`${API}/api/reservas/${r.ID_RESERVA}/detalles`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    if (res.ok) detalles.value = await res.json()
  } catch (_) {}
}

function abrirCambioEstado(r) {
  cambioEstadoReserva.value = r
  nuevoEstado.value = r.ID_ESTADO
}

async function cambiarEstado() {
  if (!cambioEstadoReserva.value) return
  try {
    const token = localStorage.getItem('user_token')
    const res = await fetch(`${API}/api/reservas/${cambioEstadoReserva.value.ID_RESERVA}/estado`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ ID_ESTADO: nuevoEstado.value })
    })
    if (!res.ok) throw new Error()
    const idx = reservas.value.findIndex(r => r.ID_RESERVA === cambioEstadoReserva.value.ID_RESERVA)
    if (idx !== -1) {
      const estadoObj = estados.value.find(e => e.ID_ESTADO === nuevoEstado.value)
      reservas.value[idx].ID_ESTADO = nuevoEstado.value
      reservas.value[idx].estado_nombre = estadoObj?.ESTADO
    }
    cambioEstadoReserva.value = null
  } catch {
    alert('Error al cambiar el estado')
  }
}

function formatDate(d) {
  if (!d) return '—'
  return new Date(d).toLocaleDateString('es-DO', { day: '2-digit', month: 'short', year: 'numeric' })
}

function initials(name) {
  if (!name) return '?'
  return name.split(' ').slice(0, 2).map(n => n[0]).join('').toUpperCase()
}

function estadoClass(estado) {
  if (!estado) return ''
  const s = estado.toLowerCase()
  if (s.includes('confirm') || s.includes('activ')) return 'badge--green'
  if (s.includes('pend')) return 'badge--yellow'
  if (s.includes('cancel')) return 'badge--red'
  if (s.includes('complet') || s.includes('finaliz')) return 'badge--blue'
  return 'badge--gray'
}

onMounted(fetchReservas)
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=DM+Mono:wght@400;500&display=swap');

.reservas-page {
  font-family: 'DM Sans', sans-serif;
  padding: 2rem;
  min-height: 100vh;
  background: #ffffff;
  color: #1a1d2e;
}

/* Header */
.page-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 1rem;
  margin-bottom: 1.75rem;
}
.page-title {
  font-size: 1.75rem;
  font-weight: 600;
  margin: 0;
  letter-spacing: -0.03em;
}
.page-subtitle { color: #6b7280; margin: 0.25rem 0 0; font-size: 0.9rem; }

.header-actions { display: flex; gap: 0.75rem; align-items: center; flex-wrap: wrap; }

.search-box {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: #fff;
  border: 1.5px solid #e5e7eb;
  border-radius: 10px;
  padding: 0.5rem 0.875rem;
  transition: border-color 0.2s;
}
.search-box:focus-within { border-color: #265073; }
.search-box i { color: #9ca3af; font-size: 0.85rem; }
.search-box input { border: none; outline: none; font-size: 0.875rem; width: 220px; background: transparent; }

.filter-select {
  border: 1.5px solid #e5e7eb;
  border-radius: 10px;
  padding: 0.5rem 0.875rem;
  font-size: 0.875rem;
  background: #fff;
  outline: none;
  cursor: pointer;
  transition: border-color 0.2s;
}
.filter-select:focus { border-color: #265073; }
.filter-select.full { width: 100%; margin-bottom: 1rem; }

/* Stats */
.stats-bar {
  display: flex;
  gap: 1rem;
  margin-bottom: 1.75rem;
  flex-wrap: wrap;
}
.stat-card {
  flex: 1;
  min-width: 130px;
  background: #fff;
  border-radius: 14px;
  border: 1.5px solid #f0f0f4;
  padding: 1rem 1.25rem;
  display: flex;
  flex-direction: column;
  position: relative;
  overflow: hidden;
}
.stat-value { font-size: 1.75rem; font-weight: 600; letter-spacing: -0.04em; }
.stat-label { font-size: 0.8rem; color: #6b7280; margin-top: 0.25rem; }
.stat-dot {
  position: absolute;
  top: 1rem; right: 1rem;
  width: 10px; height: 10px;
  border-radius: 50%;
}

/* Loading / Error */
.loading-state, .error-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  padding: 4rem;
  color: #6b7280;
}
.spinner {
  width: 36px; height: 36px;
  border: 3px solid #e5e7eb;
  border-top-color: #265073;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}
@keyframes spin { to { transform: rotate(360deg); } }
.btn-retry {
  padding: 0.5rem 1.25rem;
  background: #265073;
  color: #fff;
  border: none;
  border-radius: 8px;
  cursor: pointer;
}

/* Table */
.table-container {
  background: #fff;
  border-radius: 16px;
  border: 1.5px solid #f0f0f4;
  overflow: hidden;
}
.reservas-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.875rem;
}
.reservas-table thead {
  background: #fafafa;
  border-bottom: 1.5px solid #f0f0f4;
}
.reservas-table th {
  padding: 0.875rem 1rem;
  text-align: left;
  font-weight: 500;
  color: #6b7280;
  font-size: 0.8rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}
.table-row { border-bottom: 1px solid #f5f5f8; transition: background 0.15s; }
.table-row:hover { background: #fafbff; }
.reservas-table td { padding: 0.875rem 1rem; }
.id-cell { font-family: 'DM Mono', monospace; font-size: 0.8rem; color: #9ca3af; }

.client-cell { display: flex; align-items: center; gap: 0.625rem; }
.avatar {
  width: 30px; height: 30px;
  border-radius: 50%;
  background: linear-gradient(135deg, #265073, #3a4e5e);
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.65rem;
  font-weight: 600;
  flex-shrink: 0;
}

.empty-row { text-align: center; color: #9ca3af; padding: 3rem; }

/* Badges */
.badge {
  display: inline-block;
  padding: 0.25rem 0.625rem;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 500;
}
.badge--green  { background: #d1fae5; color: #065f46; }
.badge--yellow { background: #fef3c7; color: #92400e; }
.badge--red    { background: #fee2e2; color: #991b1b; }
.badge--blue   { background: #dbeafe; color: #1e40af; }
.badge--gray   { background: #f3f4f6; color: #374151; }

/* Action buttons */
.action-buttons { display: flex; gap: 0.5rem; }
.btn-icon {
  width: 30px; height: 30px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.75rem;
  transition: all 0.15s;
}
.btn-icon.view  { background: #f0f7ff; color: #265073; }
.btn-icon.edit  { background: #fef3c7; color: #d97706; }
.btn-icon:hover { filter: brightness(0.9); transform: scale(1.05); }

/* Modal */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.45);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
  padding: 1rem;
}
.modal {
  background: #fff;
  border-radius: 20px;
  padding: 2rem;
  width: 100%;
  max-width: 620px;
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
  box-shadow: 0 20px 60px rgba(0,0,0,0.15);
}
.modal--small { max-width: 360px; }
.modal-close {
  position: absolute;
  top: 1rem; right: 1rem;
  background: #f3f4f6;
  border: none;
  border-radius: 8px;
  width: 32px; height: 32px;
  cursor: pointer;
  color: #374151;
}
.modal-title { font-size: 1.25rem; font-weight: 600; margin: 0 0 0.25rem; letter-spacing: -0.02em; }
.modal-sub { color: #6b7280; font-size: 0.875rem; margin: 0 0 1.25rem; }

.modal-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 1.5rem; }
.modal-field label { font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.05em; color: #9ca3af; display: block; margin-bottom: 0.25rem; }
.modal-field p { margin: 0; font-size: 0.9rem; font-weight: 500; }

.modal-section h3 { font-size: 0.9rem; font-weight: 600; margin-bottom: 0.75rem; color: #374151; }
.detail-list { display: flex; flex-direction: column; gap: 0.5rem; }
.detail-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.625rem 0.875rem;
  background: #f9fafb;
  border-radius: 10px;
  font-size: 0.85rem;
}
.price { font-weight: 600; color: #265073; font-family: 'DM Sans', monospace; }

.btn-primary {
  width: 100%;
  padding: 0.75rem;
  background: #265073;
  color: #fff;
  border: none;
  border-radius: 10px;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.2s;
}
.btn-primary:hover { background: #1e3f5a; }
</style>