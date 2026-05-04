<template>
  <div class="config-page">
    <div class="page-header">
      <h1 class="page-title">Configuración</h1>
      <p class="page-subtitle">Gestión del sistema y preferencias globales</p>
    </div>

    <div class="config-layout">
      <!-- Sidebar Tabs -->
      <nav class="config-nav">
        <button
          v-for="tab in tabs"
          :key="tab.id"
          :class="['tab-btn', { 'tab-btn--active': activeTab === tab.id }]"
          @click="activeTab = tab.id"
        >
          <i :class="tab.icon"></i>
          <span>{{ tab.label }}</span>
        </button>
      </nav>

      <!-- Content -->
      <div class="config-content">

        <!-- ── Tipos de Hospedaje ── -->
        <section v-if="activeTab === 'hospedaje'">
          <div class="section-header">
            <h2>Tipos de Hospedaje</h2>
            <button class="btn-add" @click="openModal('hospedaje')"><i class="fas fa-plus"></i> Nuevo tipo</button>
          </div>
          <CatalogTable
            :items="tiposHospedaje"
            :loading="loadings.hospedaje"
            label-field="NOMBRE_TIPO"
            id-field="ID_TIPO"
            @delete="deleteItem('hospedaje', $event)"
            @edit="editItem('hospedaje', $event)"
          />
        </section>

        <!-- ── Tipos de Habitación ── -->
        <section v-if="activeTab === 'habitacion'">
          <div class="section-header">
            <h2>Tipos de Habitación</h2>
            <button class="btn-add" @click="openModal('habitacion')"><i class="fas fa-plus"></i> Nuevo tipo</button>
          </div>
          <CatalogTable
            :items="tiposHabitacion"
            :loading="loadings.habitacion"
            label-field="NOMBRE"
            id-field="ID_TIPO_HABITACION"
            @delete="deleteItem('habitacion', $event)"
            @edit="editItem('habitacion', $event)"
          />
        </section>

        <!-- ── Servicios Incluidos ── -->
        <section v-if="activeTab === 'servicios'">
          <div class="section-header">
            <h2>Servicios Incluidos</h2>
            <button class="btn-add" @click="openModal('servicios')"><i class="fas fa-plus"></i> Nuevo servicio</button>
          </div>
          <CatalogTable
            :items="serviciosIncluidos"
            :loading="loadings.servicios"
            label-field="NOMBRE"
            id-field="ID_SERVICIO_INCLUIDO"
            @delete="deleteItem('servicios', $event)"
            @edit="editItem('servicios', $event)"
          />
        </section>

        <!-- ── Estados de Reserva ── -->
        <section v-if="activeTab === 'estados'">
          <div class="section-header">
            <h2>Estados de Reserva</h2>
            <button class="btn-add" @click="openModal('estados')"><i class="fas fa-plus"></i> Nuevo estado</button>
          </div>
          <CatalogTable
            :items="estadosReserva"
            :loading="loadings.estados"
            label-field="ESTADO"
            id-field="ID_ESTADO"
            @delete="deleteItem('estados', $event)"
            @edit="editItem('estados', $event)"
          />
        </section>

        <!-- ── Niveles de Membresía ── -->
        <section v-if="activeTab === 'membresia'">
          <div class="section-header">
            <h2>Niveles de Membresía</h2>
            <button class="btn-add" @click="openModal('membresia')"><i class="fas fa-plus"></i> Nuevo nivel</button>
          </div>
          <div v-if="loadings.membresia" class="loading-inline"><div class="spinner"></div></div>
          <div v-else class="membership-grid">
            <div v-for="n in nivelesMembresia" :key="n.ID_NIVEL" class="membership-card">
              <div class="membership-rank">Nivel {{ n.ID_NIVEL }}</div>
              <h3 class="membership-name">{{ n.NOMBRE_NIVEL }}</h3>
              <p class="membership-pts">{{ n.PUNTOS_MINIMOS.toLocaleString() }} pts mínimos</p>
              <p v-if="n.DESCRIPCION" class="membership-desc">{{ n.DESCRIPCION }}</p>
              <div class="card-actions">
                <button class="btn-icon edit" @click="editItem('membresia', n)"><i class="fas fa-edit"></i></button>
                <button class="btn-icon del" @click="deleteItem('membresia', n.ID_NIVEL)"><i class="fas fa-trash"></i></button>
              </div>
            </div>
            <div v-if="nivelesMembresia.length === 0" class="empty-text">Sin niveles registrados.</div>
          </div>
        </section>

        <!-- ── Ubicaciones ── -->
        <section v-if="activeTab === 'ubicaciones'">
          <div class="section-header">
            <h2>Tipos de Ubicación</h2>
            <button class="btn-add" @click="openModal('ubicaciones')"><i class="fas fa-plus"></i> Nuevo tipo</button>
          </div>
          <CatalogTable
            :items="tiposUbicacion"
            :loading="loadings.ubicaciones"
            label-field="NOMBRE"
            id-field="ID_TIPO"
            @delete="deleteItem('ubicaciones', $event)"
            @edit="editItem('ubicaciones', $event)"
          />
        </section>

      </div>
    </div>

    <!-- Universal Modal -->
    <div v-if="modal.open" class="modal-overlay" @click.self="closeModal">
      <div class="modal">
        <button class="modal-close" @click="closeModal"><i class="fas fa-times"></i></button>
        <h2 class="modal-title">{{ modal.editId ? 'Editar' : 'Nuevo' }} — {{ tabLabel }}</h2>

        <div class="form-group" v-for="field in modalFields" :key="field.key">
          <label>{{ field.label }}</label>
          <input
            v-if="field.type !== 'textarea'"
            :type="field.type || 'text'"
            v-model="modal.data[field.key]"
            :placeholder="field.placeholder || field.label"
            class="form-input"
          />
          <textarea
            v-else
            v-model="modal.data[field.key]"
            :placeholder="field.placeholder"
            class="form-input form-textarea"
            rows="3"
          ></textarea>
        </div>

        <div class="modal-footer">
          <button class="btn-cancel" @click="closeModal">Cancelar</button>
          <button class="btn-primary" @click="saveItem" :disabled="modal.saving">
            <span v-if="modal.saving"><i class="fas fa-spinner fa-spin"></i></span>
            <span v-else>{{ modal.editId ? 'Guardar cambios' : 'Crear' }}</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Toast -->
    <transition name="toast">
      <div v-if="toast.visible" :class="['toast', `toast--${toast.type}`]">
        <i :class="toast.type === 'success' ? 'fas fa-check-circle' : 'fas fa-exclamation-circle'"></i>
        {{ toast.message }}
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { API } from '../services/api'

// ── State ──────────────────────────────────────────
const activeTab = ref('hospedaje')

const tiposHospedaje = ref([])
const tiposHabitacion = ref([])
const serviciosIncluidos = ref([])
const estadosReserva = ref([])
const nivelesMembresia = ref([])
const tiposUbicacion = ref([])

const loadings = reactive({
  hospedaje: false,
  habitacion: false,
  servicios: false,
  estados: false,
  membresia: false,
  ubicaciones: false,
})

const modal = reactive({
  open: false,
  tab: '',
  editId: null,
  data: {},
  saving: false
})

const toast = reactive({
  visible: false,
  message: '',
  type: 'success'
})

// ── Tabs config ───────────────────────────────────
const tabs = [
  { id: 'hospedaje', label: 'Tipos hospedaje', icon: 'fas fa-hotel' },
  { id: 'habitacion', label: 'Tipos habitación', icon: 'fas fa-door-open' },
  { id: 'servicios', label: 'Servicios incluidos', icon: 'fas fa-concierge-bell' },
  { id: 'estados', label: 'Estados reserva', icon: 'fas fa-flag' },
  { id: 'membresia', label: 'Membresías', icon: 'fas fa-crown' },
  { id: 'ubicaciones', label: 'Tipos ubicación', icon: 'fas fa-map-marker-alt' },
]

const tabLabel = computed(() => 
  tabs.find(t => t.id === activeTab.value)?.label || ''
)

// ── Modal fields ───────────────────────────────────
const fieldsMap = {
  hospedaje: [{ key: 'NOMBRE_TIPO', label: 'Nombre del tipo' }],
  habitacion: [{ key: 'NOMBRE', label: 'Nombre del tipo' }],
  servicios: [{ key: 'NOMBRE', label: 'Nombre del servicio' }],
  estados: [{ key: 'ESTADO', label: 'Nombre del estado' }],
  membresia: [
    { key: 'NOMBRE_NIVEL', label: 'Nombre del nivel' },
    { key: 'PUNTOS_MINIMOS', label: 'Puntos mínimos', type: 'number' },
    { key: 'DESCRIPCION', label: 'Descripción', type: 'textarea' },
  ],
  ubicaciones: [{ key: 'NOMBRE', label: 'Nombre del tipo' }],
}

const modalFields = computed(() => fieldsMap[modal.tab] || [])

// ── API endpoints ──────────────────────────────────
const endpoints = {
  hospedaje: { get: '/catalogos/tipos-hospedaje', post: '/catalogos/tipos-hospedaje' },
  habitacion: { get: '/catalogos/tipos-habitacion', post: '/catalogos/tipos-habitacion' },
  servicios: { get: '/catalogos/servicios-incluidos', post: '/catalogos/servicios-incluidos' },
  estados: { get: '/catalogos/estados-reserva', post: '/catalogos/estados-reserva' },
  membresia: { get: '/catalogos/niveles-membresia', post: '/catalogos/niveles-membresia' },
  ubicaciones: { get: '/catalogos/tipos-ubicacion', post: '/catalogos/tipos-ubicacion' },
}

const idMap = {
  hospedaje: 'ID_TIPO',
  habitacion: 'ID_TIPO_HABITACION',
  servicios: 'ID_SERVICIO_INCLUIDO',
  estados: 'ID_ESTADO',
  membresia: 'ID_NIVEL',
  ubicaciones: 'ID_TIPO'
}

// ── DATA MAP ───────────────────────────────────────
const dataRefMap = {
  hospedaje: tiposHospedaje,
  habitacion: tiposHabitacion,
  servicios: serviciosIncluidos,
  estados: estadosReserva,
  membresia: nivelesMembresia,
  ubicaciones: tiposUbicacion,
}

// ── GET TOKEN (BUSCA EN TODOS LOS POSIBLES LUGARES) ──
function getAuthToken() {
  // Intenta múltiples nombres de token
  const possibleTokenNames = [
    'token',           // Más común
    'auth_token',
    'user_token',
    'access_token',
    'authToken',
    'authorization'
  ]

  for (const name of possibleTokenNames) {
    const token = localStorage.getItem(name)
    if (token) {
      console.log(`✅ Token encontrado en: ${name}`)
      return token
    }
  }

  console.warn('⚠️ No se encontró token en localStorage')
  return null
}

// ── FETCH ──────────────────────────────────────────
async function fetchTab(tab) {
  loadings[tab] = true
  try {
    const token = getAuthToken()
    
    if (!token) {
      throw new Error('No autenticado. Por favor inicia sesión.')
    }

    const endpoint = endpoints[tab]
    if (!endpoint) {
      throw new Error(`Endpoint no configurado para: ${tab}`)
    }

    console.log(`📡 Fetching ${tab} from: ${API}${endpoint.get}`)

    const res = await fetch(`${API}${endpoint.get}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json'
      }
    })

    console.log(`📊 Response status: ${res.status}`)

    if (!res.ok) {
      const errorText = await res.text()
      throw new Error(`HTTP ${res.status}: ${errorText}`)
    }

    const data = await res.json()
    console.log(`✅ Data loaded for ${tab}:`, data)

    // ✅ Asignar datos
    if (dataRefMap[tab]) {
      dataRefMap[tab].value = Array.isArray(data) ? data : []
    }

  } catch (err) {
    console.error(`❌ Error fetching ${tab}:`, err)
    const tabName = tabs.find(t => t.id === tab)?.label || tab
    showToast(`Error al cargar ${tabName}: ${err.message}`, 'error')
    
    // Array vacío en caso de error
    if (dataRefMap[tab]) {
      dataRefMap[tab].value = []
    }
  } finally {
    loadings[tab] = false
  }
}

// ── LIFECYCLE ──────────────────────────────────────
onMounted(() => {
  console.log('🚀 AdminConfiguracion montado')
  console.log('📦 API URL:', API)
  
  // Cargar todos los tabs
  Object.keys(endpoints).forEach(tab => {
    console.log(`Loading tab: ${tab}`)
    fetchTab(tab)
  })
})

// ── CRUD ───────────────────────────────────────────
function openModal(tab, item = null) {
  modal.tab = tab
  modal.open = true
  modal.editId = item ? item[idMap[tab]] : null
  modal.data = item ? { ...item } : {}
  modal.saving = false
}

function editItem(tab, item) {
  openModal(tab, item)
}

function closeModal() {
  modal.open = false
  modal.data = {}
}

async function saveItem() {
  modal.saving = true
  try {
    const token = getAuthToken()
    if (!token) throw new Error('No autenticado')

    const ep = endpoints[modal.tab]
    const url = modal.editId 
      ? `${API}${ep.post}/${modal.editId}` 
      : `${API}${ep.post}`
    const method = modal.editId ? 'PATCH' : 'POST'

    console.log(`📤 ${method} to:`, url)

    const res = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(modal.data),
    })

    if (!res.ok) {
      throw new Error(`HTTP ${res.status}`)
    }

    await fetchTab(modal.tab)
    closeModal()
    showToast(
      modal.editId ? 'Actualizado correctamente' : 'Creado correctamente',
      'success'
    )
  } catch (err) {
    console.error('❌ Error saving:', err)
    showToast(`Error al guardar: ${err.message}`, 'error')
  } finally {
    modal.saving = false
  }
}

async function deleteItem(tab, id) {
  if (!confirm('¿Estás seguro?')) return

  try {
    const token = getAuthToken()
    if (!token) throw new Error('No autenticado')

    const url = `${API}${endpoints[tab].post}/${id}`

    const res = await fetch(url, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` },
    })

    if (!res.ok) throw new Error(`HTTP ${res.status}`)

    await fetchTab(tab)
    showToast('Eliminado correctamente', 'success')
  } catch (err) {
    console.error('❌ Error deleting:', err)
    showToast(`Error al eliminar: ${err.message}`, 'error')
  }
}

// ── TOAST ──────────────────────────────────────────
function showToast(message, type = 'success') {
  toast.message = message
  toast.type = type
  toast.visible = true
  setTimeout(() => {
    toast.visible = false
  }, 3000)
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=DM+Mono:wght@400;500&display=swap');

.config-page {
  font-family: 'DM Sans', sans-serif;
  padding: 2rem;
  min-height: 100vh;
  background: #ffffff;
  color: #1a1d2e;
}

.page-header { margin-bottom: 2rem; }
.page-title { font-size: 1.75rem; font-weight: 600; margin: 0; letter-spacing: -0.03em; }
.page-subtitle { color: #6b7280; margin: 0.25rem 0 0; font-size: 0.9rem; }

/* Layout */
.config-layout { display: flex; gap: 1.5rem; align-items: flex-start; }

/* Nav */
.config-nav {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  min-width: 210px;
  background: #fff;
  border-radius: 16px;
  border: 1.5px solid #f0f0f4;
  padding: 0.75rem;
  position: sticky;
  top: 1.5rem;
}
.tab-btn {
  display: flex;
  align-items: center;
  gap: 0.625rem;
  padding: 0.625rem 0.875rem;
  border: none;
  border-radius: 10px;
  background: transparent;
  cursor: pointer;
  font-size: 0.875rem;
  color: #6b7280;
  transition: all 0.15s;
  text-align: left;
  font-family: 'DM Sans', sans-serif;
}
.tab-btn i { width: 16px; text-align: center; }
.tab-btn:hover { background: #f5f5f8; color: #1a1d2e; }
.tab-btn--active { background: #f0f7ff; color: #265073; font-weight: 500; }

/* Content */
.config-content { flex: 1; min-width: 0; }

.section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1.25rem;
}
.section-header h2 { font-size: 1.1rem; font-weight: 600; margin: 0; }

.btn-add {
  display: flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.5rem 1rem;
  background: #265073;
  color: #fff;
  border: none;
  border-radius: 10px;
  font-size: 0.85rem;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.2s;
}
.btn-add:hover { background: #1e3f5a; }

/* Catalog table */
:deep(.catalog-table) {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.875rem;
  background: #fff;
  border-radius: 14px;
  border: 1.5px solid #f0f0f4;
  overflow: hidden;
}
:deep(.catalog-table thead) { background: #fafafa; border-bottom: 1.5px solid #f0f0f4; }
:deep(.catalog-table th) {
  padding: 0.75rem 1rem;
  text-align: left;
  font-weight: 500;
  color: #6b7280;
  font-size: 0.78rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}
:deep(.catalog-table td) { padding: 0.75rem 1rem; border-bottom: 1px solid #f5f5f8; }
:deep(.catalog-table tr:last-child td) { border-bottom: none; }
:deep(.catalog-table tr:hover td) { background: #fafbff; }
:deep(.id-cell) { font-family: 'DM Mono', monospace; font-size: 0.8rem; color: #9ca3af; }
:deep(.empty-row) { text-align: center; color: #9ca3af; padding: 2.5rem; }

/* Membership cards */
.membership-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 1rem; }
.membership-card {
  background: #fff;
  border-radius: 16px;
  border: 1.5px solid #f0f0f4;
  padding: 1.25rem;
  position: relative;
}
.membership-rank { font-size: 0.72rem; text-transform: uppercase; letter-spacing: 0.08em; color: #9ca3af; margin-bottom: 0.5rem; }
.membership-name { font-size: 1rem; font-weight: 600; margin: 0 0 0.25rem; }
.membership-pts { font-size: 0.82rem; color: #265073; font-weight: 500; margin: 0 0 0.5rem; font-family: 'DM Mono', monospace; }
.membership-desc { font-size: 0.82rem; color: #6b7280; margin: 0 0 1rem; }
.card-actions { display: flex; gap: 0.5rem; }
.empty-text { color: #9ca3af; font-size: 0.875rem; padding: 1rem 0; }

/* Action buttons */
.action-buttons { display: flex; gap: 0.5rem; }
.btn-icon {
  width: 30px; height: 30px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  display: flex; align-items: center; justify-content: center;
  font-size: 0.75rem;
  transition: all 0.15s;
}
.btn-icon.edit { background: #fef3c7; color: #d97706; }
.btn-icon.del  { background: #fee2e2; color: #dc2626; }
.btn-icon:hover { filter: brightness(0.9); transform: scale(1.05); }

/* Loading */
.loading-inline { display: flex; justify-content: center; padding: 3rem; }
.spinner {
  width: 32px; height: 32px;
  border: 3px solid #e5e7eb;
  border-top-color: #265073;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}
@keyframes spin { to { transform: rotate(360deg); } }

/* Modal */
.modal-overlay {
  position: fixed; inset: 0;
  background: rgba(0,0,0,0.45);
  display: flex; align-items: center; justify-content: center;
  z-index: 100; padding: 1rem;
}
.modal {
  background: #fff;
  border-radius: 20px;
  padding: 2rem;
  width: 100%; max-width: 480px;
  position: relative;
  box-shadow: 0 20px 60px rgba(0,0,0,0.15);
}
.modal-close {
  position: absolute; top: 1rem; right: 1rem;
  background: #f3f4f6; border: none;
  border-radius: 8px; width: 32px; height: 32px;
  cursor: pointer; color: #374151;
}
.modal-title { font-size: 1.15rem; font-weight: 600; margin: 0 0 1.5rem; letter-spacing: -0.02em; }

.form-group { margin-bottom: 1rem; }
.form-group label { display: block; font-size: 0.8rem; font-weight: 500; color: #374151; margin-bottom: 0.375rem; }
.form-input {
  width: 100%; box-sizing: border-box;
  padding: 0.625rem 0.875rem;
  border: 1.5px solid #e5e7eb;
  border-radius: 10px;
  font-size: 0.875rem;
  outline: none;
  font-family: 'DM Sans', sans-serif;
  transition: border-color 0.2s;
}
.form-input:focus { border-color: #265073; }
.form-textarea { resize: vertical; min-height: 80px; }

.modal-footer { display: flex; gap: 0.75rem; margin-top: 1.5rem; justify-content: flex-end; }
.btn-cancel {
  padding: 0.625rem 1.25rem;
  background: #f3f4f6; border: none;
  border-radius: 10px; font-size: 0.875rem;
  cursor: pointer; color: #374151;
  font-family: 'DM Sans', sans-serif;
}
.btn-primary {
  padding: 0.625rem 1.5rem;
  background: #265073; color: #fff;
  border: none; border-radius: 10px;
  font-size: 0.875rem; font-weight: 500;
  cursor: pointer;
  font-family: 'DM Sans', sans-serif;
  transition: background 0.2s;
}
.btn-primary:hover:not(:disabled) { background: #1e3f5a; }
.btn-primary:disabled { opacity: 0.6; cursor: not-allowed; }

/* Toast */
.toast {
  position: fixed; bottom: 1.5rem; right: 1.5rem;
  padding: 0.75rem 1.25rem;
  border-radius: 12px;
  font-size: 0.875rem; font-weight: 500;
  display: flex; align-items: center; gap: 0.5rem;
  box-shadow: 0 8px 25px rgba(0,0,0,0.12);
  z-index: 200;
}
.toast--success { background: #065f46; color: #d1fae5; }
.toast--error   { background: #991b1b; color: #fee2e2; }
.toast-enter-active, .toast-leave-active { transition: all 0.3s ease; }
.toast-enter-from, .toast-leave-to { opacity: 0; transform: translateY(12px); }

/* Responsive */
@media (max-width: 768px) {
  .config-layout { flex-direction: column; }
  .config-nav { flex-direction: row; flex-wrap: wrap; min-width: unset; position: static; }
  .tab-btn span { display: none; }
  .tab-btn i { width: auto; }
}
</style>