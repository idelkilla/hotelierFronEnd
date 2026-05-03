<template>
  <div class="usr-page">
    <!-- Tabs bar -->
    <div class="usr-tabs-bar">
      <div class="usr-tabs">
        <button
          :class="['usr-tab', { active: vista === 'agregar' }]"
          @click="navegar('agregar')"
        >
          <i class="fas fa-plus"></i> Agregar
        </button>
        <button
          :class="['usr-tab', { active: vista === 'consultar' }]"
          @click="navegar('consultar')"
        >
          <i class="fas fa-list"></i> Consultar
        </button>
      </div>

      <div v-if="vista === 'agregar'" class="usr-tabs-actions">
        <button class="usr-btn-secondary" @click="$router.back()">
          Cancelar
        </button>
        <button
          class="usr-btn-primary"
          :disabled="guardando"
          @click="guardarUsuario"
        >
          {{ guardando ? 'Guardando...' : labelGuardar }}
          <i class="fas fa-check"></i>
        </button>
      </div>
    </div>

    <!-- Alerta -->
    <div
      v-if="alerta.mensaje"
      :class="['usr-alerta', `usr-alerta--${alerta.tipo}`]"
    >
      <i
        :class="
          alerta.tipo === 'error'
            ? 'fas fa-exclamation-circle'
            : 'fas fa-check-circle'
        "
      ></i>
      {{ alerta.mensaje }}
      <button @click="alerta.mensaje = ''"><i class="fas fa-times"></i></button>
    </div>

    <!-- ══ VISTA: AGREGAR ══ -->
    <div v-if="vista === 'agregar'">
      <!-- Sub-tabs -->
      <div class="usr-subtabs">
        <button
          :class="['usr-stab', { active: subtab === 'empleado' }]"
          @click="navegar('agregar', 'empleado')"
        >
          <i class="fas fa-id-badge"></i> Empleado
        </button>
        <button
          :class="['usr-stab', { active: subtab === 'cliente' }]"
          @click="navegar('agregar', 'cliente')"
        >
          <i class="fas fa-user"></i> Cliente
        </button>
        <button
          :class="['usr-stab', { active: subtab === 'miembro' }]"
          @click="navegar('agregar', 'miembro')"
        >
          <i class="fas fa-star"></i> Miembro
        </button>
      </div>

      <!-- Formulario empleado -->
      <AgregarEmpleadoForm
        v-if="subtab === 'empleado'"
        ref="empleadoRef"
        @alerta="mostrarAlerta"
      />

      <!-- Formulario cliente -->
      <AgregarClienteForm
        v-else-if="subtab === 'cliente'"
        ref="clienteRef"
        @alerta="mostrarAlerta"
      />

      <!-- Formulario miembro -->
      <AgregarMiembroForm
        v-else-if="subtab === 'miembro'"
        ref="miembroRef"
        @alerta="mostrarAlerta"
      />
    </div>

    <!-- ══ VISTA: CONSULTAR ══ -->
    <div v-else-if="vista === 'consultar'">
      <!-- Sub-tabs consulta -->
      <div class="usr-subtabs">
        <button
          :class="['usr-stab', { active: filtroTipo === 'todos' }]"
          @click="filtroTipo = 'todos'"
        >
          Todos
        </button>
        <button
          :class="['usr-stab', { active: filtroTipo === 'empleado' }]"
          @click="filtroTipo = 'empleado'"
        >
          Empleados
        </button>
        <button
          :class="['usr-stab', { active: filtroTipo === 'cliente' }]"
          @click="filtroTipo = 'cliente'"
        >
          Clientes
        </button>
        <button
          :class="['usr-stab', { active: filtroTipo === 'miembro' }]"
          @click="filtroTipo = 'miembro'"
        >
          Miembros
        </button>
      </div>

      <!-- Panel edición -->
      <Transition name="slide">
        <div v-if="editando" class="usr-edit-panel">
          <div class="usr-edit-header">
            <h2>
              <i class="fas fa-edit"></i> Editar usuario · {{ editando.tipo }}
            </h2>
            <button class="usr-close" @click="editando = null">
              <i class="fas fa-times"></i>
            </button>
          </div>
          <div v-if="cargandoDetalle" class="usr-loading">
            <i class="fas fa-spinner fa-spin"></i> Cargando...
          </div>
          <EditarUsuarioPanel
            v-else
            :usuario="editando"
            :catalogos="catalogos"
            @guardado="onGuardado"
            @eliminado="onEliminado"
            @alerta="mostrarAlerta"
          />
        </div>
      </Transition>

      <!-- Tabla -->
      <div v-if="cargandoLista" class="usr-loading-full">
        <i class="fas fa-spinner fa-spin"></i> Cargando usuarios...
      </div>
      <div v-else>
        <!-- Búsqueda -->
        <div class="usr-search-bar">
          <i class="fas fa-search"></i>
          <input
            v-model="busqueda"
            type="text"
            placeholder="Buscar por nombre, correo o ID..."
          />
        </div>

        <div class="usr-table-wrap">
          <table class="usr-list-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Nombre</th>
                <th>Tipo</th>
                <th>Correo</th>
                <th>Estado</th>
                <th>Membresía</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="u in usuariosFiltrados"
                :key="u.id"
                :class="{ 'row-active': editando?.id === u.id }"
              >
                <td class="usr-id">{{ u.id }}</td>
                <td>
                  <div class="usr-name-cell">
                    <div
                      class="usr-avatar"
                      :style="{
                        background: avatarBg(u.tipo),
                        color: avatarColor(u.tipo),
                      }"
                    >
                      {{ iniciales(u.nombre) }}
                    </div>
                    <span>{{ u.nombre }}</span>
                  </div>
                </td>
                <td>
                  <span :class="['usr-badge', tipoBadge(u.tipo)]">{{
                    u.tipo
                  }}</span>
                </td>
                <td class="usr-email">{{ u.correo }}</td>
                <td>
                  <span
                    :class="[
                      'usr-badge',
                      u.estado === 'A' ? 'badge-activo' : 'badge-inactivo',
                    ]"
                  >
                    {{ u.estado === 'A' ? 'Activo' : 'Inactivo' }}
                  </span>
                </td>
                <td>
                  <span
                    v-if="u.nivel_membresia"
                    :class="['usr-badge', nivelBadge(u.nivel_membresia)]"
                  >
                    {{ u.nivel_membresia }}
                  </span>
                  <span v-else class="usr-muted">—</span>
                </td>
                <td>
                  <button class="usr-btn-edit" @click="abrirEdicion(u)">
                    <i class="fas fa-pen"></i> Editar
                  </button>
                </td>
              </tr>
              <tr v-if="!usuariosFiltrados.length">
                <td colspan="7" class="usr-empty">
                  No se encontraron usuarios.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import AgregarEmpleadoForm from './AdminAgregarEmpleado.vue'
import AgregarClienteForm from './AdminAgregarCliente.vue'
import AgregarMiembroForm from './AdminAgregarMiembro.vue'
import EditarUsuarioPanel from './adminEditarUsuario.vue'

const API_BASE =
  import.meta.env.VITE_API_URL || 'https://hotelierbackend-1.onrender.com/api'

const route = useRoute()
const router = useRouter()

// ── Estado ──────────────────────────────────────────────────────
const vista = ref('agregar')
const subtab = ref('empleado')
const filtroTipo = ref('todos')
const busqueda = ref('')
const usuarios = ref([])
const editando = ref(null)
const catalogos = reactive({ puestos: [], cargos: [], nivelMembresia: [] })

const guardando = ref(false)
const cargandoLista = ref(false)
const cargandoDetalle = ref(false)
const alerta = reactive({ mensaje: '', tipo: 'error' })

// Refs a los sub-formularios
const empleadoRef = ref(null)
const clienteRef = ref(null)
const miembroRef = ref(null)

// ── Computed ─────────────────────────────────────────────────────
const labelGuardar = computed(() => {
  const map = {
    empleado: 'Guardar empleado',
    cliente: 'Guardar cliente',
    miembro: 'Asignar membresía',
  }
  return map[subtab.value] || 'Guardar'
})

const usuariosFiltrados = computed(() => {
  let list = usuarios.value
  if (filtroTipo.value !== 'todos') {
    list = list.filter((u) => u.tipo.toLowerCase() === filtroTipo.value)
  }
  if (busqueda.value.trim()) {
    const q = busqueda.value.toLowerCase()
    list = list.filter(
      (u) =>
        u.nombre.toLowerCase().includes(q) ||
        (u.correo || '').toLowerCase().includes(q) ||
        String(u.id).includes(q),
    )
  }
  return list
})

// ── Helpers ──────────────────────────────────────────────────────
const mostrarAlerta = (mensaje, tipo = 'error') => {
  alerta.mensaje = mensaje
  alerta.tipo = tipo
  if (tipo === 'exito')
    setTimeout(() => {
      alerta.mensaje = ''
    }, 4000)
}

const iniciales = (nombre = '') =>
  nombre
    .split(' ')
    .slice(0, 2)
    .map((p) => p[0])
    .join('')
    .toUpperCase()

const avatarBg = (tipo) =>
  ({ Empleado: '#E6F1FB', Cliente: '#EEEDFE', Miembro: '#E1F5EE' })[tipo] ||
  '#F1EFE8'
const avatarColor = (tipo) =>
  ({ Empleado: '#0C447C', Cliente: '#3C3489', Miembro: '#085041' })[tipo] ||
  '#444441'

const tipoBadge = (tipo) =>
  ({
    Empleado: 'badge-empleado',
    Cliente: 'badge-cliente',
    Miembro: 'badge-miembro',
  })[tipo] || ''

const nivelBadge = (nivel) =>
  ({
    Bronze: 'badge-amber',
    Silver: 'badge-blue',
    Gold: 'badge-gold',
    Platinum: 'badge-purple',
  })[nivel] || 'badge-gray'

// ── API ──────────────────────────────────────────────────────────
const apiFetch = async (path, options = {}) => {
  const token = localStorage.getItem('user_token')
  const headers = { 'Content-Type': 'application/json', ...options.headers }
  if (token) headers['Authorization'] = `Bearer ${token}`
  const res = await fetch(`${API_BASE}${path}`, { headers, ...options })
  if (!res.ok) {
    const e = await res.json().catch(() => ({}))
    throw new Error(e.message || `Error ${res.status}`)
  }
  return res.json()
}

// ── Guardar desde sub-formularios ────────────────────────────────
const guardarUsuario = async () => {
  guardando.value = true
  try {
    if (subtab.value === 'empleado') await empleadoRef.value?.guardar()
    else if (subtab.value === 'cliente') await clienteRef.value?.guardar()
    else if (subtab.value === 'miembro') await miembroRef.value?.guardar()
  } finally {
    guardando.value = false
  }
}

// ── Sincronización con Rutas ──────────────────────────────────
const syncRoute = () => {
  const path = route.path
  if (path.includes('/consultar')) {
    vista.value = 'consultar'
    if (usuarios.value.length === 0) cargarListadoSilencioso()
  } else {
    vista.value = 'agregar'
    if (path.includes('/cliente')) subtab.value = 'cliente'
    else if (path.includes('/miembro')) subtab.value = 'miembro'
    else subtab.value = 'empleado'
  }
}

watch(() => route.path, syncRoute, { immediate: true })

const navegar = (v, s = null) => {
  let path = '/admin/usuarios'
  if (v === 'consultar') {
    router.push(`${path}/consultar`)
  } else {
    router.push(`${path}/agregar/${s || subtab.value}`)
  }
}

// ── Consultar listado unificado ──────────────────────────────────
const cargarListado = async () => {
  editando.value = null
  cargandoLista.value = true
  await cargarListadoSilencioso()
}

const cargarListadoSilencioso = async () => {
  try {
    const res = await apiFetch('/usuarios')
    usuarios.value = Array.isArray(res) ? res : []
  } catch (e) {
    mostrarAlerta('Error cargando usuarios: ' + e.message)
  } finally {
    cargandoLista.value = false
  }
}

// ── Abrir edición ────────────────────────────────────────────────
const abrirEdicion = async (u) => {
  editando.value = u
  cargandoDetalle.value = true
  try {
    const det = await apiFetch(`/usuarios/${u.id}?tipo=${u.tipo.toLowerCase()}`)
    editando.value = { ...u, ...det }
  } catch (e) {
    mostrarAlerta('Error cargando detalle: ' + e.message)
  } finally {
    cargandoDetalle.value = false
  }
}

const onGuardado = async () => {
  mostrarAlerta('Usuario actualizado.', 'exito')
  await cargarListado()
  editando.value = null
}
const onEliminado = async () => {
  mostrarAlerta('Usuario eliminado.', 'exito')
  await cargarListado()
  editando.value = null
}

// ── Catálogos ────────────────────────────────────────────────────
onMounted(async () => {
  try {
    const [puestos, niveles] = await Promise.all([
      apiFetch('/catalogos/puestos'),
      apiFetch('/catalogos/niveles-membresia'),
    ])
    catalogos.puestos = puestos
    catalogos.nivelMembresia = niveles
  } catch (e) {
    mostrarAlerta('Error cargando catálogos: ' + e.message)
  }
})
</script>

<style scoped>
.usr-page {
  padding: 28px 36px;
  max-width: 1200px;
  margin: 0 auto;
  font-family: 'Inter', sans-serif;
}

/* ── Tabs bar ── */
.usr-tabs-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 2px solid #e8ecf4;
  margin-bottom: 0;
}
.usr-tabs {
  display: flex;
}
.usr-tab {
  padding: 10px 24px;
  font-size: 14px;
  font-weight: 600;
  color: #94a3b8;
  background: none;
  border: none;
  cursor: pointer;
  border-bottom: 2px solid transparent;
  margin-bottom: -2px;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.2s;
}
.usr-tab.active {
  color: #265073;
  border-bottom-color: #265073;
}
.usr-tab:hover:not(.active) {
  color: #475569;
}
.usr-tabs-actions {
  display: flex;
  gap: 10px;
}

/* ── Sub-tabs ── */
.usr-subtabs {
  display: flex;
  gap: 0;
  border-bottom: 1px solid #e8ecf4;
  margin-bottom: 24px;
}
.usr-stab {
  padding: 9px 20px;
  font-size: 13px;
  font-weight: 600;
  color: #94a3b8;
  background: none;
  border: none;
  cursor: pointer;
  border-bottom: 2px solid transparent;
  margin-bottom: -1px;
  display: flex;
  align-items: center;
  gap: 7px;
  transition: all 0.2s;
}
.usr-stab.active {
  color: #265073;
  border-bottom-color: #265073;
}
.usr-stab:hover:not(.active) {
  color: #475569;
}

/* ── Botones ── */
.usr-btn-primary {
  background: #265073;
  color: #fff;
  border: none;
  padding: 10px 20px;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
  transition: background 0.2s;
}
.usr-btn-primary:hover:not(:disabled) {
  background: #1e3f5a;
}
.usr-btn-primary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
.usr-btn-secondary {
  background: #fff;
  color: #475569;
  border: 1px solid #e2e8f0;
  padding: 10px 20px;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}
.usr-btn-secondary:hover {
  background: #f8fafc;
}
.usr-btn-edit {
  background: #fff;
  color: #265073;
  border: 1px solid #cbd5e1;
  padding: 6px 12px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}
.usr-btn-edit:hover {
  background: #f0f7ff;
  border-color: #265073;
}

/* ── Alerta ── */
.usr-alerta {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 16px;
  border-radius: 8px;
  margin: 16px 0;
  font-size: 14px;
}
.usr-alerta--error {
  background: #fef2f2;
  color: #b91c1c;
  border: 1px solid #fca5a5;
}
.usr-alerta--exito {
  background: #f0fdf4;
  color: #15803d;
  border: 1px solid #86efac;
}
.usr-alerta button {
  margin-left: auto;
  background: none;
  border: none;
  cursor: pointer;
  opacity: 0.6;
}

/* ── Búsqueda ── */
.usr-search-bar {
  display: flex;
  align-items: center;
  gap: 10px;
  border: 1px solid #e2e8f0;
  border-radius: 9px;
  padding: 9px 14px;
  margin-bottom: 16px;
  background: #fff;
}
.usr-search-bar i {
  color: #94a3b8;
}
.usr-search-bar input {
  border: none;
  outline: none;
  font-size: 14px;
  color: #0f172a;
  background: transparent;
  width: 100%;
  font-family: inherit;
}

/* ── Tabla ── */
.usr-table-wrap {
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
  overflow: hidden;
}
.usr-list-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 13px;
}
.usr-list-table th {
  text-align: left;
  font-size: 11px;
  font-weight: 700;
  color: #94a3b8;
  padding: 12px 14px;
  border-bottom: 1px solid #e8ecf4;
  background: #f8fafc;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}
.usr-list-table td {
  padding: 12px 14px;
  border-bottom: 1px solid #f1f5f9;
  color: #0f172a;
  vertical-align: middle;
}
.usr-list-table tr:last-child td {
  border-bottom: none;
}
.usr-list-table tr:hover td {
  background: #fcfdfe;
}
.usr-list-table tr.row-active td {
  background: #f0f7ff;
}

.usr-id {
  color: #94a3b8;
  font-size: 12px;
}
.usr-email {
  color: #64748b;
  font-size: 12px;
}
.usr-muted {
  color: #94a3b8;
  font-size: 12px;
}
.usr-empty {
  text-align: center;
  color: #94a3b8;
  padding: 30px;
}

.usr-name-cell {
  display: flex;
  align-items: center;
  gap: 9px;
}
.usr-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 700;
}

/* ── Badges ── */
.usr-badge {
  display: inline-flex;
  align-items: center;
  font-size: 11px;
  font-weight: 600;
  padding: 3px 9px;
  border-radius: 20px;
}
.badge-empleado {
  background: #e6f1fb;
  color: #0c447c;
}
.badge-cliente {
  background: #eeedfe;
  color: #3c3489;
}
.badge-miembro {
  background: #e1f5ee;
  color: #085041;
}
.badge-activo {
  background: #f0fdf4;
  color: #15803d;
}
.badge-inactivo {
  background: #fef2f2;
  color: #b91c1c;
}
.badge-amber {
  background: #faeeda;
  color: #633806;
}
.badge-blue {
  background: #e6f1fb;
  color: #0c447c;
}
.badge-gold {
  background: #faeeda;
  color: #854f0b;
}
.badge-purple {
  background: #eeedfe;
  color: #3c3489;
}
.badge-gray {
  background: #f1efe8;
  color: #444441;
}

/* ── Panel edición ── */
.usr-edit-panel {
  background: #fff;
  border: 1px solid #e8ecf4;
  border-radius: 12px;
  margin-bottom: 24px;
  overflow: hidden;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.08);
}
.usr-edit-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 24px;
  border-bottom: 1px solid #e8ecf4;
  background: #f8fafc;
}
.usr-edit-header h2 {
  font-size: 15px;
  font-weight: 700;
  color: #0f172a;
  margin: 0;
}
.usr-close {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 16px;
  color: #94a3b8;
}
.usr-close:hover {
  color: #0f172a;
}

/* ── Loading ── */
.usr-loading {
  padding: 40px;
  text-align: center;
  color: #94a3b8;
  font-size: 14px;
}
.usr-loading-full {
  padding: 60px;
  text-align: center;
  color: #94a3b8;
  font-size: 14px;
}

/* ── Animación ── */
.slide-enter-active,
.slide-leave-active {
  transition: all 0.3s ease-out;
}
.slide-enter-from,
.slide-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>
