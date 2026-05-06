<template>
  <div class="contenedor-detalles" v-if="!loading">
    <div class="info-hotel">
      <h1 class="nombre-hotel">{{ hospedaje.nombre }}</h1>
      <div class="rating-ubicacion">
        <span class="ubicacion">{{ hospedaje.ciudad }}, {{ hospedaje.pais }}</span>
      </div>

      <h2 class="subtitulo">Sobre {{ hospedaje.nombre }}</h2>
      <p class="descripcion">{{ hospedaje.descripcion }}</p>

      <h2 class="subtitulo">Servicios</h2>
      <div class="servicios-grid">
        <div class="servicio" v-for="s in servicios" :key="s.nombre">
          <span class="material-symbols-outlined servicio-icono">{{ iconoServicio(s.nombre) }}</span>
          <span class="servicio-nombre">{{ s.nombre }}</span>
        </div>
        <!-- fallback si no hay servicios en BD -->
        <p v-if="!servicios.length" class="sin-datos">Sin servicios registrados</p>
      </div>

      <!-- Anfitrión -->
      <div class="host-integration-section" v-if="host.name">
        <h2 class="subtitulo">Sobre el anfitrión</h2>
        <div class="host-card-simple">
          <img :src="host.photo" alt="Host" class="host-img-circle" />
          <div class="host-text">
            <p class="host-name-title">{{ host.name }}</p>
            <p class="host-meta-info">
              {{ host.cargo }} · {{ host.years }} años recibiendo huéspedes
            </p>
          </div>
        </div>
      </div>

      <HabitacionesSelector
        :fecha-inicio="fechaInicio"
        :fecha-fin="fechaFin"
        :resumen-huespedes="resumenHuespedes"
        :noches="noches"
        @abrir-calendario="abrirCalendario"
        @seleccionar-habitacion="onSeleccionarHabitacion"
      />

      <ReviewsSection />
    </div>

    <!-- Selectores flotantes -->
    <CalendarSelector
      v-if="mostrarCalendario"
      :model-value="{
        start: (campoEditando === 'inicio' ? fechaInicio : fechaFin)
               ? new Date((campoEditando === 'inicio' ? fechaInicio : fechaFin) + 'T00:00:00')
               : null,
        end: null
      }"
      :range="false"
      @update:dates="onDatesSelected"
      @close="mostrarCalendario = false"
    />
    <GuestSelector v-if="mostrarHuespedes"
                   v-model="habitacionesGuest"
                   @close="mostrarHuespedes = false" />
  </div>

  <!-- Loading -->
  <div v-else class="loading-state">
    <p>Cargando...</p>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onBeforeUnmount } from 'vue'
import { useRoute } from 'vue-router'
import CalendarSelector from './CalendarSelector.vue'
import GuestSelector from './GuestSelector.vue'
import HabitacionesSelector from './HabitacionesSelector.vue'
import ReviewsSection from './ReviewsSection.vue'
import { API, apiFetch } from '../services/api'

const props = defineProps({ hotel: Object })
const route = useRoute()
const BASE = API

// ── Estado global ─────────────────────────────────────────────
const loading    = ref(true)
const hospedaje  = ref({ nombre: '', ciudad: '', pais: '', descripcion: '' })
const servicios  = ref([])
const host       = ref({ name: '', photo: '', cargo: '', years: 0 })
const precioBase = ref(0)

// ── Huéspedes ─────────────────────────────────────────────────
const mostrarHuespedes  = ref(false)
const habitacionesGuest = ref(
  route.query.huespedes
    ? JSON.parse(route.query.huespedes)
    : [{ adultos: 2, ninos: 0, edadesNinos: [] }]
)
const resumenHuespedes = computed(() => {
  const total = habitacionesGuest.value.reduce((a, h) => a + h.adultos + h.ninos, 0)
  const txtP  = total === 1 ? 'persona' : 'personas'
  const txtH  = habitacionesGuest.value.length === 1 ? 'habitación' : 'habitaciones'
  return `${total} ${txtP}, ${habitacionesGuest.value.length} ${txtH}`
})

// ── Calendario ────────────────────────────────────────────────
const mostrarCalendario = ref(false)
const fechaInicio       = ref(route.query.entrada || '')
const fechaFin          = ref(route.query.salida || '')
const campoEditando     = ref('inicio')
const dateFieldRef      = ref(null)

function abrirCalendario(campo) {
  campoEditando.value    = campo
  mostrarCalendario.value = true
  mostrarHuespedes.value  = false
}
function toggleHuespedes() {
  mostrarHuespedes.value  = !mostrarHuespedes.value
  if (mostrarHuespedes.value) mostrarCalendario.value = false
}
function onDatesSelected(dates) {
  const sel = dates.start
  if (campoEditando.value === 'inicio') {
    fechaInicio.value = sel
    if (fechaFin.value && sel >= fechaFin.value) fechaFin.value = ''
  } else {
    if (fechaInicio.value && sel <= fechaInicio.value) return
    fechaFin.value = sel
  }
  mostrarCalendario.value = false
}
function fmt(str) {
  if (!str) return ''
  const [y, m, d] = str.split('-').map(Number)
  return `${String(d).padStart(2,'0')}/${String(m).padStart(2,'0')}/${y}`
}
const checkInDisplay  = computed(() => fmt(fechaInicio.value))
const checkOutDisplay = computed(() => fmt(fechaFin.value))
const noches = computed(() => {
  if (!fechaInicio.value || !fechaFin.value) return 0
  const [y1,m1,d1] = fechaInicio.value.split('-').map(Number)
  const [y2,m2,d2] = fechaFin.value.split('-').map(Number)
  return Math.max(1, Math.round(
    (new Date(y2,m2-1,d2) - new Date(y1,m1-1,d1)) / 86400000
  ))
})
const totalPrecio = computed(() =>
  noches.value > 0 ? precioBase.value * noches.value : 0
)

function onSeleccionarHabitacion(hab) {
  // Por ahora solo un log, después aquí va el flujo de reserva
  console.log('Habitación seleccionada:', hab)
  alert(`Reservando: ${hab.TIPO_HABITACION} - $${hab.PRECIO_NOCHE}/noche`)
}

// ── Fetch desde la BD ─────────────────────────────────────────
async function cargarTodo() {
  const id = route.params.id
  if (!id) {
    console.error('No se encontró el ID en la ruta')
    return
  }

  try {
    const info = await apiFetch(`/hospedaje/${id}`)
    hospedaje.value = info

    const [serviciosData, anfitrionData] = await Promise.allSettled([
      apiFetch(`/hospedaje/${id}/servicios`),
      apiFetch(`/hospedaje/${id}/anfitrion`),
    ])

    if (serviciosData.status === 'fulfilled') {
      servicios.value = serviciosData.value
    }

    if (anfitrionData.status === 'fulfilled' && anfitrionData.value) {
      const a = anfitrionData.value
      host.value.name  = `${a.nombre} ${a.apellidos ?? ''}`.trim()
      host.value.cargo = a.cargo ?? 'Anfitrión'
      host.value.years = a.anios_en_plataforma ?? 1
      host.value.photo = `https://ui-avatars.com/api/?name=${encodeURIComponent(host.value.name)}&background=2c537a&color=fff&size=128`
    }

    await cargarPrecioBase(id)
  } catch (e) {
    console.error('Error cargando hospedaje:', e.message)
  } finally {
    loading.value = false
  }
}

async function cargarPrecioBase(id) {
  try {
    // Intenta con los próximos 30 días para tener más chances de encontrar precio
    const desde = hoy()
    const hasta = (() => {
      const d = new Date(); d.setDate(d.getDate() + 30)
      return d.toISOString().split('T')[0]
    })()
    const rows = await apiFetch(`/hospedaje/${id}/disponibilidad?desde=${desde}&hasta=${hasta}`)
    if (rows && rows.length) {
      // Toma el precio mínimo disponible
      precioBase.value = Math.min(...rows.map(r => Number(r.precio_efectivo)))
    } else {
      // Fallback: busca precio base directo de habitaciones
      const info = await apiFetch(`/hospedaje/${id}/habitaciones-base`)
      if (info && info.length) precioBase.value = Number(info[0].precio_noche)
    }
  } catch (e) {
    console.warn('Sin precio disponible:', e.message)
  }
}

function iconoServicio(nombre) {
  const n = nombre.toLowerCase()
  if (n.includes('piscina') || n.includes('alberca')) return 'pool'
  if (n.includes('wifi') || n.includes('internet'))   return 'wifi'
  if (n.includes('desayuno') || n.includes('comida')) return 'restaurant'
  if (n.includes('gimnasio') || n.includes('gym'))    return 'fitness_center'
  if (n.includes('estacionamiento') || n.includes('parking')) return 'local_parking'
  if (n.includes('aire') || n.includes('ac'))         return 'ac_unit'
  if (n.includes('traslado') || n.includes('aeropuerto')) return 'flight_takeoff'
  if (n.includes('playa'))                            return 'beach_access'
  if (n.includes('spa'))                              return 'spa'
  if (n.includes('bar'))                              return 'local_bar'
  if (n.includes('habitacion') || n.includes('servicio 24')) return 'room_service'
  return 'check'
}

// Recarga precio cuando el usuario elige fechas
watch([fechaInicio, fechaFin], async ([ini, fin]) => {
  if (!ini || !fin) return

  const dIni = new Date(ini)
  const dFin = new Date(fin)
  if (isNaN(dIni.getTime()) || isNaN(dFin.getTime()) || dFin <= dIni) return

  const id = route.params.id
  if (!id) return
  try {
    const rows = await apiFetch(`/hospedaje/${id}/disponibilidad?desde=${ini}&hasta=${fin}`)
    if (rows.length) precioBase.value = Number(rows[0].precio_efectivo)
  } catch (e) {
    console.error('Error disponibilidad:', e.message)
  }
})

// ── Helpers de fecha ──────────────────────────────────────────
function hoy() {
  return new Date().toISOString().split('T')[0]
}
function manana() {
  const d = new Date(); d.setDate(d.getDate() + 1)
  return d.toISOString().split('T')[0]
}

// ── Click fuera ───────────────────────────────────────────────
function handleOutsideClick(e) {
  if (!e.target.closest('.date-field') && !e.target.closest('.calendar-modal'))
    mostrarCalendario.value = false
  if (!e.target.closest('#guest-field'))
    mostrarHuespedes.value = false
}

onMounted(() => {
  cargarTodo()
  window.addEventListener('mousedown', handleOutsideClick)
})
onBeforeUnmount(() => window.removeEventListener('mousedown', handleOutsideClick))
</script>

<style scoped src="../assets/css/DetalleHotel.css"></style>