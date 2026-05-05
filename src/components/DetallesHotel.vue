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
          <span class="material-symbols-outlined">check_circle</span>
          {{ s.nombre }}
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
    </div>

    <!-- Card reserva -->
    <div class="card-reserva">
      <div class="precio-noche">
        <span class="monto">${{ precioBase }}</span>
        <span class="etiqueta">/noche</span>
      </div>

      <div class="inputs-fecha date-field" ref="dateFieldRef">
        <div class="campo" @click="abrirCalendario('inicio')">
          <label>CHECK-IN</label>
          <input type="text" readonly :value="checkInDisplay"
                 placeholder="Añadir fecha" class="readonly-input" />
        </div>
        <div class="campo" @click="abrirCalendario('fin')">
          <label>CHECK-OUT</label>
          <input type="text" readonly :value="checkOutDisplay"
                 placeholder="Añadir fecha" class="readonly-input" />
        </div>
      </div>

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

      <div class="campo-personas" id="guest-field">
        <label>HUÉSPEDES</label>
        <div class="personas-input-wrapper" @click="toggleHuespedes">
          <span class="material-symbols-outlined personas-icon">person</span>
          <input type="text" readonly :value="resumenHuespedes"
                 class="readonly-input-personas" />
          <span class="material-symbols-outlined dropdown-icon">expand_more</span>
        </div>
        <GuestSelector v-if="mostrarHuespedes"
                       v-model="habitacionesGuest"
                       @close="mostrarHuespedes = false" />
      </div>

      <div class="desglose">
        <div class="linea">
          <span>${{ precioBase }} x {{ noches }} noche{{ noches !== 1 ? 's' : '' }}</span>
          <span>${{ totalPrecio }}</span>
        </div>
        <hr />
        <div class="linea total">
          <span>Total</span>
          <span>${{ totalPrecio }}</span>
        </div>
      </div>

      <button class="btn-reservar">Reservar</button>
    </div>
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
import { API } from '../services/api'

const props = defineProps({ hotel: Object })
const route = useRoute()
const BASE = API

// ── Estado global ─────────────────────────────────────────────
const loading    = ref(true)
const hospedaje  = ref({})
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
const fechaInicio       = ref('')
const fechaFin          = ref('')
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

// ── Fetch desde la BD ─────────────────────────────────────────
async function cargarTodo() {
  const id = route.params.id
  if (!id) {
    console.error('No se encontró el ID en la ruta')
    return
  }

  try {
    const [infoRes, serviciosRes, anfitrionRes] = await Promise.all([
      fetch(`${BASE}/hospedaje/${id}`),
      fetch(`${BASE}/hospedaje/${id}/servicios`),
      fetch(`${BASE}/hospedaje/${id}/anfitrion`),
    ])

    // Info principal
    if (infoRes.ok) hospedaje.value = await infoRes.json()
    else console.error('Error al cargar info principal:', infoRes.status)

    // Servicios
    if (serviciosRes.ok) servicios.value = await serviciosRes.json()

    // Anfitrión (puede no existir, no rompemos el render)
    if (anfitrionRes.ok) {
      const a = await anfitrionRes.json()
      host.value = {
        name:  `${a.nombre} ${a.apellidos ?? ''}`.trim(),
        cargo: a.cargo ?? 'Anfitrión',
        years: a.anios_en_plataforma ?? 1,
        photo: `https://ui-avatars.com/api/?name=${encodeURIComponent(a.nombre)}&background=2c537a&color=fff&size=128`,
      }
    }

    // Precio base: primera habitación disponible como referencia
    await cargarPrecioBase(id)

  } catch (e) {
    console.error('Error cargando hospedaje:', e)
  } finally {
    loading.value = false
  }
}

async function cargarPrecioBase(id) {
  try {
    // Trae el precio mínimo de las habitaciones del hospedaje
    const res = await fetch(
      `${BASE}/hospedaje/${id}/disponibilidad` +
      `?desde=${hoy()}&hasta=${manana()}`
    )
    if (res.ok) {
      const rows = await res.json()
      if (rows.length) {
        precioBase.value = Number(rows[0].precio_efectivo)
      }
    }
  } catch { /* sin disponibilidad hoy, precio queda en 0 */ }
}

// Recarga precio cuando el usuario elige fechas
watch([fechaInicio, fechaFin], async ([ini, fin]) => {
  if (!ini || !fin) return

  const dIni = new Date(ini)
  const dFin = new Date(fin)
  if (isNaN(dIni.getTime()) || isNaN(dFin.getTime()) || dFin <= dIni) return

  const id = route.params.id
  try {
    const res = await fetch(
      `${BASE}/hospedaje/${id}/disponibilidad?desde=${ini}&hasta=${fin}`
    )
    if (res.ok) {
      const rows = await res.json()
      if (rows.length) precioBase.value = Number(rows[0].precio_efectivo)
    }
  } catch (e) {
    console.error('Error disponibilidad:', e)
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