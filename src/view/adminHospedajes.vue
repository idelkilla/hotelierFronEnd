<template>
  <div class="adm-page">

    <!-- Tabs -->
    <div class="adm-tabs-bar">
      <div class="adm-tabs">
        <button :class="['adm-tab', { active: vista === 'agregar' }]" @click="navegar('agregar')">
          <i class="fas fa-plus"></i> Agregar
        </button>
        <button :class="['adm-tab', { active: vista === 'consultar' }]" @click="navegar('consultar')">
          <i class="fas fa-list"></i> Consultar
        </button>
      </div>

      <!-- Botones solo visibles en tab Agregar -->
      <div v-if="vista === 'agregar'" class="adm-tabs-actions">
        <button class="adm-btn-secondary" :disabled="formRef?.guardando" @click="formRef.guardarBorrador()">
          {{ formRef?.guardando ? 'Guardando...' : 'Guardar Borrador' }}
        </button>
        <button class="adm-btn-primary" :disabled="formRef?.publicando" @click="formRef.publicar()">
          {{ formRef?.publicando ? 'Publicando...' : 'Publicar Propiedad' }}
        </button>
      </div>
    </div>
    <!-- ══ VISTA: AGREGAR ══ -->
    <div v-if="vista === 'agregar'" class="adm-view-container">
      <!-- Se recomienda que adminAgregarHotel.vue se comporte como un componente formulario -->
      <AgregarHotelForm ref="formRef" />
    </div>

    <!-- ══ VISTA: CONSULTAR ══ -->
    <div v-else-if="vista === 'consultar'" class="adm-view-container">

      <!-- Alerta -->
      <div v-if="alerta.mensaje" :class="['adm-alerta', `adm-alerta--${alerta.tipo}`]">
        <i :class="alerta.tipo === 'error' ? 'fas fa-exclamation-circle' : 'fas fa-check-circle'"></i>
        {{ alerta.mensaje }}
        <button @click="alerta.mensaje = ''"><i class="fas fa-times"></i></button>
      </div>

      <!-- Panel de edición (slide-in cuando hay selección) -->
      <Transition name="slide">
        <div v-if="editando" class="adm-edit-panel">
          <div class="adm-edit-header">
            <h2><i class="fas fa-edit"></i> Editar Propiedad #{{ editando.ID_HOSPEDAJE }}</h2>
            <button class="adm-close" @click="cerrarEdicion"><i class="fas fa-times"></i></button>
          </div>

          <div v-if="cargandoDetalle" class="adm-loading">
            <i class="fas fa-spinner fa-spin"></i> Cargando...
          </div>

          <div v-else class="adm-edit-body">
            <!-- Información básica -->
            <div class="adm-section">
              <div class="adm-section-title"><i class="fas fa-info-circle"></i> Información Básica</div>
              <div class="adm-field">
                <label>Nombre</label>
                <input v-model="editForm.nombre" type="text" />
              </div>
              <div class="adm-field">
                <label>Descripción</label>
                <textarea v-model="editForm.descripcion" rows="3"></textarea>
              </div>
              <div class="adm-field">
                <label>Tipo de Propiedad</label>
                <AppSelect v-model="editForm.id_tipo_hospedaje"
                  :options="tiposHospedaje.map(t => ({ value: t.ID_TIPO, label: t.NOMBRE_TIPO }))" />
              </div>
            </div>

            <!-- Políticas -->
            <div class="adm-section">
              <div class="adm-section-title"><i class="fas fa-shield-alt"></i> Políticas</div>
              <div class="adm-row">
                <div class="adm-field">
                  <label>Check-in</label>
                  <input v-model="editForm.checkin" type="time" />
                </div>
                <div class="adm-field">
                  <label>Check-out</label>
                  <input v-model="editForm.checkout" type="time" />
                </div>
              </div>
              <div class="adm-field">
                <label>Cancelación</label>
                <AppSelect v-model="editForm.cancelacion" :options="[
                  { value: 'flexible', label: 'Flexible (reembolso hasta 24h)' },
                  { value: 'moderada', label: 'Moderada (reembolso hasta 5 días)' },
                  { value: 'estricta', label: 'Estricta (sin reembolso)' },
                ]" />
              </div>
              <div class="adm-toggles">
                <label class="adm-toggle">
                  <span>Mascotas</span>
                  <div :class="{ on: editForm.mascotas }" class="adm-switch"
                    @click="editForm.mascotas = !editForm.mascotas">
                    <div class="adm-switch-thumb"></div>
                  </div>
                </label>
                <label class="adm-toggle">
                  <span>Fumar</span>
                  <div :class="{ on: editForm.fumar }" class="adm-switch"
                    @click="editForm.fumar = !editForm.fumar">
                    <div class="adm-switch-thumb"></div>
                  </div>
                </label>
              </div>
            </div>

            <!-- Ubicación -->
            <div class="adm-section">
              <div class="adm-section-title"><i class="fas fa-map-marker-alt"></i> Ubicación</div>
              <div class="adm-field">
                <label>País</label>
                <AppSelect v-model="editForm.id_pais"
                  :options="paises.map(p => ({ value: p.ID_PAIS, label: p.NOMBRE }))"
                  placeholder="Seleccionar país..."
                  @change="cargarCiudadesEdit" />
              </div>
              <div class="adm-field">
                <label>Ciudad</label>
                <AppSelect v-model="editForm.id_ciudad"
                  :options="ciudadesEdit.map(c => ({ value: c.ID_CIUDAD, label: c.NOMBRE }))"
                  :disabled="!ciudadesEdit.length"
                  placeholder="Seleccionar ciudad..." />
              </div>
              <div class="adm-row">
                <div class="adm-field">
                  <label>Latitud</label>
                  <input v-model.number="editForm.latitud" type="number" step="0.00000001" />
                </div>
                <div class="adm-field">
                  <label>Longitud</label>
                  <input v-model.number="editForm.longitud" type="number" step="0.00000001" />
                </div>
              </div>
              <div class="adm-field">
                <label>Nombre de zona</label>
                <input v-model="editForm.nombre_ubicacion" type="text" />
              </div>
            </div>

            <!-- Amenidades -->
            <div class="adm-section">
              <div class="adm-section-title"><i class="fas fa-concierge-bell"></i> Amenidades</div>
              <div class="adm-amenities">
                <label v-for="s in servicios" :key="s.ID_SERVICIO_INCLUIDO" class="adm-amenity">
                  <input type="checkbox" :value="s.ID_SERVICIO_INCLUIDO"
                    v-model="editForm.servicios_incluidos" />
                  <span>{{ s.NOMBRE }}</span>
                </label>
              </div>
            </div>

            <!-- Habitaciones -->
            <div class="adm-section">
              <div class="adm-section-title">
                <i class="fas fa-bed"></i> Habitaciones
                <button class="adm-btn-add" @click="agregarHabEdit">
                  <i class="fas fa-plus"></i> Agregar
                </button>
              </div>
              <table class="adm-table" v-if="editForm.habitaciones.length">
                <thead>
                  <tr>
                    <th>Tipo</th><th>Adultos</th><th>Niños</th><th>Precio/Noche</th><th></th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(hab, i) in editForm.habitaciones" :key="i">
                    <td>
                      <AppSelect v-model="hab.id_tipo_habitacion"
                        :options="tiposHabitacion.map(t => ({ value: t.ID_TIPO_HABITACION, label: t.NOMBRE }))"
                        placeholder="Tipo..." />
                    </td>
                    <td><input type="number" v-model.number="hab.capacidad_adulto" min="1" /></td>
                    <td><input type="number" v-model.number="hab.capacidad_ninos" min="0" /></td>
                    <td>
                      <div class="adm-price">
                        <span>$</span>
                        <input type="number" v-model.number="hab.precio_noche" min="0" step="0.01" />
                      </div>
                    </td>
                    <td>
                      <button class="adm-icon-btn" @click="eliminarHabEdit(i, hab)">
                        <i class="fas fa-trash"></i>
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
              <div v-else class="adm-empty">Sin habitaciones.</div>
            </div>

            <!-- Acciones -->
            <div class="adm-edit-actions">
              <button class="adm-btn-secondary" @click="cerrarEdicion">Cancelar</button>
              <button class="adm-btn-danger" @click="confirmarEliminar(editando.ID_HOSPEDAJE)">
                <i class="fas fa-trash"></i> Eliminar
              </button>
              <button class="adm-btn-primary" :disabled="guardandoEdit" @click="guardarEdicion">
                {{ guardandoEdit ? 'Guardando...' : 'Guardar Cambios' }}
                <i class="fas fa-check"></i>
              </button>
            </div>
          </div>
        </div>
      </Transition>

      <!-- Tabla listado -->
      <div v-if="cargandoLista" class="adm-loading-full">
        <i class="fas fa-spinner fa-spin"></i> Cargando hospedajes...
      </div>

      <div v-else class="adm-table-wrap">
        <table class="adm-list-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Portada</th>
              <th>Nombre</th>
              <th>Tipo</th>
              <th>Ubicación</th>
              <th>Ciudad</th>
              <th>País</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="h in hospedajes" :key="h.ID_HOSPEDAJE"
              :class="{ 'row-active': editando?.ID_HOSPEDAJE === h.ID_HOSPEDAJE }">
              <td class="adm-id">{{ h.ID_HOSPEDAJE }}</td>
              <td>
                <img v-if="h.IMAGEN_PORTADA" :src="h.IMAGEN_PORTADA" class="adm-thumb" />
                <div v-else class="adm-thumb adm-thumb-empty"><i class="fas fa-image"></i></div>
              </td>
              <td class="adm-nombre">{{ h.NOMBRE }}</td>
              <td><span class="adm-badge">{{ h.TIPO_HOSPEDAJE }}</span></td>
              <td>{{ h.UBICACION }}</td>
              <td>{{ h.CIUDAD }}</td>
              <td>{{ h.PAIS }}</td>
              <td>
                <button class="adm-btn-edit" @click="abrirEdicion(h)">
                  <i class="fas fa-pen"></i> Editar
                </button>
              </td>
            </tr>
          </tbody>
        </table>
        <div v-if="!hospedajes.length" class="adm-empty">No hay hospedajes registrados.</div>
      </div>
    </div>

    <!-- Modal confirmar eliminar -->
    <div v-if="modalEliminar" class="adm-overlay" @click.self="modalEliminar = null">
      <div class="adm-modal">
        <i class="fas fa-exclamation-triangle adm-modal-icon"></i>
        <h3>¿Eliminar propiedad?</h3>
        <p>Esta acción no se puede deshacer. Se eliminarán también las habitaciones e imágenes asociadas.</p>
        <div class="adm-modal-actions">
          <button class="adm-btn-secondary" @click="modalEliminar = null">Cancelar</button>
          <button class="adm-btn-danger" :disabled="eliminando" @click="ejecutarEliminar">
            {{ eliminando ? 'Eliminando...' : 'Sí, eliminar' }}
          </button>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, reactive, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import AppSelect from '@/components/AppSelect.vue'
import AgregarHotelForm from './adminAgregarHotel.vue'
import { apiFetch } from '../services/api'

const route = useRoute()
const router = useRouter()

const formRef = ref(null)
const API_BASE = import.meta.env.VITE_API_URL || 'https://hotelierbackend-1.onrender.com/api'

// ── Estado global ──────────────────────────────────────────────
const vista      = ref('agregar')
const hospedajes = ref([])
const editando   = ref(null)
const editForm   = reactive({
  nombre: '', descripcion: '', id_tipo_hospedaje: '',
  checkin: '', checkout: '', cancelacion: '', mascotas: false, fumar: false,
  id_pais: '', id_ciudad: '', latitud: '', longitud: '', nombre_ubicacion: '',
  servicios_incluidos: [], habitaciones: [],
})

// ── Catálogos ──────────────────────────────────────────────────
const tiposHospedaje  = ref([])
const tiposHabitacion = ref([])
const paises          = ref([])
const ciudadesEdit    = ref([])
const servicios       = ref([])

// ── UI ──────────────────────────────────────────────────────────
const cargandoLista   = ref(false)
const cargandoDetalle = ref(false)
const guardandoEdit   = ref(false)
const eliminando      = ref(false)
const modalEliminar   = ref(null)
const alerta = reactive({ mensaje: '', tipo: 'error' })

const mostrarAlerta = (mensaje, tipo = 'error') => {
  alerta.mensaje = mensaje
  alerta.tipo    = tipo
  if (tipo === 'exito') setTimeout(() => { alerta.mensaje = '' }, 4000)
}

// ── Cargar catálogos al montar ──────────────────────────────────
onMounted(async () => {
  try {
    const [resTipos, resHab, resPaises, resSrv] = await Promise.all([
      apiFetch('/catalogos/tipos-hospedaje'),
      apiFetch('/catalogos/tipos-habitacion'),
      apiFetch('/catalogos/paises'),
      apiFetch('/catalogos/servicios-incluidos'),
    ])
    tiposHospedaje.value  = resTipos
    tiposHabitacion.value = resHab
    paises.value          = resPaises
    servicios.value       = resSrv
  } catch (e) {
    mostrarAlerta('Error cargando catálogos: ' + e.message)
  }
})

// ── Sincronización con Rutas ──────────────────────────────────
const syncRoute = () => {
  const path = route.path
  if (path.includes('/consultar')) {
    vista.value = 'consultar'
    if (hospedajes.value.length === 0) cargarListadoSilencioso()
  } else {
    vista.value = 'agregar'
  }
}

watch(() => route.path, syncRoute, { immediate: true })

const navegar = (v) => {
  router.push(`/admin/hospedajes/${v}`)
}

// ── Consultar listado ───────────────────────────────────────────
const cargarListado = async () => {
  editando.value = null
  cargandoLista.value = true
  await cargarListadoSilencioso()
}

const cargarListadoSilencioso = async () => {
  try {
    hospedajes.value = await apiFetch('/hospedajes')
  } catch (e) { //
    mostrarAlerta('Error cargando hospedajes: ' + e.message)
  } finally {
    cargandoLista.value = false
  }
}

// ── Abrir edición ───────────────────────────────────────────────
const abrirEdicion = async (h) => {
  editando.value        = h
  cargandoDetalle.value = true
  ciudadesEdit.value    = []
  try {
    const det = await apiFetch(`/hospedajes/${h.ID_HOSPEDAJE}`) //
    if (det.ID_PAIS) {
      ciudadesEdit.value = await apiFetch(`/catalogos/ciudades?id_pais=${det.ID_PAIS}`)
    }
    Object.assign(editForm, {
      nombre:              det.NOMBRE,
      descripcion:         det.DESCRIPCION,
      id_tipo_hospedaje:   det.ID_TIPO || '',
      checkin:             det.CHECKIN?.slice(0, 5) || '15:00',
      checkout:            det.CHECKOUT?.slice(0, 5) || '11:00',
      cancelacion:         det.CANCELACION,
      mascotas:            !!det.MASCOTAS,
      fumar:               !!det.FUMAR,
      id_pais:             det.ID_PAIS,
      id_ciudad:           det.ID_CIUDAD,
      latitud:             parseFloat(det.LATITUD),
      longitud:            parseFloat(det.LONGITUD),
      nombre_ubicacion:    det.NOMBRE_UBICACION,
      servicios_incluidos: det.amenidades.map(a => a.ID_SERVICIO_INCLUIDO),
      habitaciones:        det.habitaciones.map(hab => ({
        id_habitacion:      hab.ID_HABITACION,
        id_tipo_habitacion: hab.ID_TIPO_HABITACION || '',
        capacidad_adulto:   hab.CAPACIDAD_ADULTO,
        capacidad_ninos:    hab.CAPACIDAD_NINOS,
        precio_noche:       parseFloat(hab.PRECIO_NOCHE),
      })),
    })
  } catch (e) {
    mostrarAlerta('Error cargando detalle: ' + e.message)
  } finally {
    cargandoDetalle.value = false
  }
}

const cerrarEdicion = () => { editando.value = null }

const cargarCiudadesEdit = async () => {
  editForm.id_ciudad = ''
  ciudadesEdit.value = []
  if (!editForm.id_pais) return
  try {
    ciudadesEdit.value = await apiFetch(`/catalogos/ciudades?id_pais=${editForm.id_pais}`)
  } catch (e) {
    mostrarAlerta('Error cargando ciudades: ' + e.message)
  }
}

// ── Habitaciones en edición ─────────────────────────────────────
const agregarHabEdit = () => {
  editForm.habitaciones.push({
    id_tipo_habitacion: '', capacidad_adulto: 2, capacidad_ninos: 0, precio_noche: 0,
  })
}
const eliminarHabEdit = async (i, hab) => {
  if (hab.id_habitacion) {
    try {
      await apiFetch(`/habitaciones/${hab.id_habitacion}`, { method: 'DELETE' })
    } catch (e) {
      mostrarAlerta('Error eliminando habitación: ' + e.message)
      return
    }
  }
  editForm.habitaciones.splice(i, 1)
}

// ── Guardar edición ─────────────────────────────────────────────
const guardarEdicion = async () => {
  guardandoEdit.value = true
  const id = editando.value.ID_HOSPEDAJE
  try {
    await apiFetch(`/hospedajes/${id}`, {
      method: 'PUT',
      body: JSON.stringify({
        nombre:              editForm.nombre,
        descripcion:         editForm.descripcion,
        id_tipo_hospedaje:   editForm.id_tipo_hospedaje,
        checkin:             editForm.checkin,
        checkout:            editForm.checkout,
        cancelacion:         editForm.cancelacion,
        mascotas:            editForm.mascotas,
        fumar:               editForm.fumar,
        servicios_incluidos: editForm.servicios_incluidos,
        ubicacion: {
          nombre:    editForm.nombre_ubicacion,
          latitud:   editForm.latitud,
          longitud:  editForm.longitud,
          id_ciudad: editForm.id_ciudad,
        },
      }),
    })
    const nuevas = editForm.habitaciones.filter(h => !h.id_habitacion)
    if (nuevas.length) {
      await apiFetch(`/hospedajes/${id}/habitaciones`, { //
        method: 'POST',
        body: JSON.stringify(nuevas.map(h => ({
          id_tipo_habitacion: h.id_tipo_habitacion,
          capacidad_adulto:   h.capacidad_adulto,
          capacidad_ninos:    h.capacidad_ninos,
          precio_noche:       h.precio_noche,
        }))),
      })
    }
    const existentes = editForm.habitaciones.filter(h => h.id_habitacion)
    for (const hab of existentes) {
      await apiFetch(`/habitaciones/${hab.id_habitacion}`, {
        method: 'PUT',
        body: JSON.stringify({
          id_tipo_habitacion: hab.id_tipo_habitacion,
          capacidad_adulto:   hab.capacidad_adulto,
          capacidad_ninos:    hab.capacidad_ninos,
          precio_noche:       hab.precio_noche,
        }),
      })
    }
    mostrarAlerta('Propiedad actualizada correctamente.', 'exito')
    await cargarListado()
    editando.value = null
  } catch (e) {
    mostrarAlerta('Error al guardar: ' + e.message)
  } finally {
    guardandoEdit.value = false
  }
}

// ── Eliminar ────────────────────────────────────────────────────
const confirmarEliminar = (id) => { modalEliminar.value = id }
const ejecutarEliminar  = async () => {
  eliminando.value = true
  try { //
    await apiFetch(`/hospedajes/${modalEliminar.value}`, { method: 'DELETE' }) //
    mostrarAlerta('Propiedad eliminada.', 'exito')
    modalEliminar.value = null
    editando.value      = null
    await cargarListado()
  } catch (e) {
    mostrarAlerta('Error al eliminar: ' + e.message)
  } finally {
    eliminando.value = false
  }
}
</script>

<style scoped>
.adm-page { padding: 28px 36px; max-width: 1200px; margin: 0 auto; font-family: 'Inter', sans-serif; }

/* ── Tabs bar ── */
.adm-tabs-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 2px solid #e8ecf4;
  margin-bottom: 28px;
}
.adm-tabs { display: flex; gap: 0; }
.adm-tab {
  padding: 10px 24px; font-size: 14px; font-weight: 600; color: #94a3b8;
  background: none; border: none; cursor: pointer; border-bottom: 2px solid transparent;
  margin-bottom: -2px; display: flex; align-items: center; gap: 8px; transition: all 0.2s; }
.adm-tab.active { color: #265073; border-bottom-color: #265073; }
.adm-tab:hover:not(.active) { color: #475569; }
.adm-tabs-actions { display: flex; gap: 10px; }

/* ── Botones ── */
.adm-btn-primary {
  background: #265073; color: #fff; border: none;
  padding: 10px 20px; border-radius: 8px; font-size: 13px; font-weight: 600; cursor: pointer;
  display: flex; align-items: center; gap: 6px; transition: background 0.2s; }
.adm-btn-primary:hover:not(:disabled) { background: #1e3f5a; }
.adm-btn-primary:disabled { opacity: 0.6; cursor: not-allowed; }

.adm-btn-secondary {
  background: #fff; color: #475569; border: 1px solid #e2e8f0;
  padding: 10px 20px; border-radius: 8px; font-size: 13px; font-weight: 600; cursor: pointer; transition: all 0.2s; }
.adm-btn-secondary:hover:not(:disabled) { background: #f8fafc; border-color: #94a3b8; }
.adm-btn-secondary:disabled { opacity: 0.6; cursor: not-allowed; }

.adm-btn-danger {
  background: #fff; color: #dc2626; border: 1px solid #fecaca;
  padding: 10px 20px; border-radius: 8px; font-size: 13px; font-weight: 600; cursor: pointer; transition: all 0.2s; }
.adm-btn-danger:hover:not(:disabled) { background: #fef2f2; }
.adm-btn-danger:disabled { opacity: 0.6; cursor: not-allowed; }

.adm-btn-add {
  margin-left: auto; background: #f0f7ff; color: #265073; border: 1px solid #bfdbfe;
  padding: 5px 12px; border-radius: 6px; font-size: 12px; font-weight: 600; cursor: pointer; }
.adm-btn-edit {
  background: #fff; color: #265073; border: 1px solid #cbd5e1; padding: 6px 12px;
  border-radius: 6px; font-size: 12px; font-weight: 600; cursor: pointer; transition: all 0.2s; }
.adm-btn-edit:hover { background: #f1f5f9; border-color: #265073; }

/* ── Alertas ── */
.adm-alerta {
  display: flex; align-items: center; gap: 10px; padding: 12px 16px;
  border-radius: 8px; margin-bottom: 16px; font-size: 14px; }
.adm-alerta--error { background: #fef2f2; color: #b91c1c; border: 1px solid #fca5a5; }
.adm-alerta--exito { background: #f0fdf4; color: #15803d; border: 1px solid #86efac; }
.adm-alerta button { margin-left: auto; background: none; border: none; cursor: pointer; opacity: .6; }

/* ── Tabla listado ── */
.adm-table-wrap { overflow-x: auto; background: #fff; border-radius: 12px; box-shadow: 0 1px 3px rgba(0,0,0,0.1); }
.adm-list-table { width: 100%; border-collapse: collapse; font-size: 13px; }
.adm-list-table th {
  text-align: left; font-size: 11px; font-weight: 700; color: #94a3b8; padding: 12px 14px;
  border-bottom: 1px solid #e8ecf4; text-transform: uppercase; letter-spacing: 0.5px; background: #f8fafc; }
.adm-list-table td { padding: 12px 14px; border-bottom: 1px solid #f1f5f9; color: #0f172a; vertical-align: middle; }
.adm-list-table tr:hover td { background: #fcfdfe; }
.adm-list-table tr.row-active td { background: #f0f7ff; }

.adm-thumb { width: 44px; height: 44px; border-radius: 8px; object-fit: cover; border: 1px solid #e2e8f0; display: flex; align-items: center; justify-content: center; background: #f8fafc; color: #94a3b8; }
.adm-badge { background: #eef5fb; color: #265073; font-size: 11px; font-weight: 600; padding: 3px 8px; border-radius: 20px; }
.adm-id { color: #94a3b8; font-size: 12px; }
.adm-nombre { font-weight: 600; }

/* ── Panel de edición ── */
.adm-edit-panel {
  background: #fff; border: 1px solid #e8ecf4; border-radius: 12px;
  margin-bottom: 24px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1); }
.adm-edit-header {
  display: flex; justify-content: space-between; align-items: center;
  padding: 16px 24px; border-bottom: 1px solid #e8ecf4; background: #f8fafc; }
.adm-edit-header h2 { font-size: 15px; font-weight: 700; color: #0f172a; margin: 0; }
.adm-close { background: none; border: none; cursor: pointer; font-size: 16px; color: #94a3b8; }
.adm-close:hover { color: #0f172a; }

.adm-edit-body { padding: 24px; display: flex; flex-direction: column; gap: 24px; }
.adm-section { border: 1px solid #e8ecf4; border-radius: 10px; padding: 18px 20px; }
.adm-section-title {
  font-size: 13px; font-weight: 700; color: #0f172a; margin-bottom: 16px;
  display: flex; align-items: center; gap: 8px; }

.adm-field { display: flex; flex-direction: column; gap: 6px; margin-bottom: 12px; }
.adm-field label { font-size: 12px; font-weight: 600; color: #475569; }
.adm-field input, .adm-field textarea {
  border: 1px solid #e2e8f0; border-radius: 8px; padding: 10px 12px;
  font-size: 14px; outline: none; transition: all 0.2s; font-family: inherit; }
.adm-field input:focus, .adm-field textarea:focus {
  border-color: #265073; box-shadow: 0 0 0 2px rgba(38,80,115,0.1); }

.adm-row { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }

/* Toggles */
.adm-toggles { display: flex; flex-direction: column; gap: 12px; }
.adm-toggle { display: flex; justify-content: space-between; align-items: center; cursor: pointer; }
.adm-toggle span { font-size: 13px; color: #475569; }
.adm-switch {
  width: 40px; height: 22px; border-radius: 11px; background: #e2e8f0;
  position: relative; transition: background 0.2s; cursor: pointer; flex-shrink: 0; }
.adm-switch.on { background: #265073; }
.adm-switch-thumb {
  position: absolute; top: 3px; left: 3px; width: 16px; height: 16px;
  border-radius: 50%; background: #fff; transition: transform 0.2s; }
.adm-switch.on .adm-switch-thumb { transform: translateX(18px); }

/* Amenidades */
.adm-amenities { display: grid; grid-template-columns: repeat(auto-fill, minmax(160px, 1fr)); gap: 8px; }
.adm-amenity { display: flex; align-items: center; gap: 8px; font-size: 13px; color: #475569; cursor: pointer; }
.adm-amenity input { cursor: pointer; accent-color: #265073; }

/* Tabla habitaciones */
.adm-table { width: 100%; border-collapse: collapse; font-size: 13px; }
.adm-table th {
  text-align: left; font-size: 11px; font-weight: 700; color: #94a3b8;
  padding: 8px 10px; border-bottom: 1px solid #e8ecf4; background: #f8fafc; }
.adm-table td { padding: 8px 10px; border-bottom: 1px solid #f1f5f9; }
.adm-table input[type="number"] { width: 60px; border: 1px solid #e2e8f0; border-radius: 6px; padding: 6px 8px; font-size: 13px; }
.adm-price { display: flex; align-items: center; gap: 4px; }
.adm-price span { color: #94a3b8; font-size: 13px; }
.adm-price input { width: 80px; }
.adm-icon-btn { background: none; border: none; color: #ef4444; cursor: pointer; padding: 4px; }

.adm-edit-actions {
  display: flex; justify-content: flex-end; gap: 10px;
  padding-top: 8px; border-top: 1px solid #e8ecf4; }

/* ── Estados ── */
.adm-loading { padding: 40px; text-align: center; color: #94a3b8; font-size: 14px; }
.adm-loading-full { padding: 60px; text-align: center; color: #94a3b8; font-size: 14px; }
.adm-empty { padding: 20px; text-align: center; color: #94a3b8; font-size: 13px; }

/* ── Modal eliminar ── */
.adm-overlay {
  position: fixed; inset: 0; background: rgba(0,0,0,0.4);
  display: flex; align-items: center; justify-content: center; z-index: 1000; }
.adm-modal {
  background: #fff; border-radius: 12px; padding: 32px 28px;
  max-width: 400px; width: 90%; text-align: center; }
.adm-modal-icon { font-size: 36px; color: #f59e0b; margin-bottom: 12px; display: block; }
.adm-modal h3 { font-size: 17px; font-weight: 700; color: #0f172a; margin: 0 0 8px; }
.adm-modal p { font-size: 13px; color: #64748b; margin: 0 0 24px; }
.adm-modal-actions { display: flex; gap: 10px; justify-content: center; }

/* ── Animaciones ── */
.slide-enter-active, .slide-leave-active { transition: all 0.3s ease-out; }
.slide-enter-from, .slide-leave-to { opacity: 0; transform: translateY(-10px); }
</style>