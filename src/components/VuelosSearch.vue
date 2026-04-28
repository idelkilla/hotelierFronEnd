<template>
  <div class="vuelos-search">

    <!-- Sub-tabs -->
    <div class="vuelos-tabs">
      <button
        v-for="tab in tabs" :key="tab.id"
        :class="['vuelo-tab', { active: tipoViaje === tab.id }]"
        @click="tipoViaje = tab.id"
      >
        {{ tab.label }}
      </button>
    </div>

    <!-- Pasajeros + clase (siempre visible) -->
    <div
      v-if="tipoViaje === 'MULTIDESTINO'"
      class="dynamic-field-wrapper pasajeros-top"
      style="position:relative; max-width: 240px;"
    >
      <div class="field-group border-style" @click="togglePasajeros">
        <label>Pasajeros, clase de cabina</label>
        <div class="input-with-icon">
          <span class="material-symbols-outlined custom-icon">person</span>
          <input type="text" readonly :value="resumenPasajeros" class="readonly-input" />
        </div>
      </div>
      <PasajerosSelector
        v-if="mostrarPasajeros"
        v-model:pasajeros="pasajeros"
        v-model:clase="claseSeleccionada"
        :clases="clases"
        @close="mostrarPasajeros = false"
      />
    </div>

    <!-- ── VIAJE REDONDO / SENCILLO ───────────────────────────── -->
    <div v-if="tipoViaje !== 'MULTIDESTINO'" class="search-fields-dynamic">

      <!-- Origen -->
      <div class="dynamic-field-wrapper" style="position:relative;" ref="origenWrapper">
        <div class="field-group border-style">
          <label>Origen</label>
            <div class="input-with-icon" :class="{ 'has-chip': selectedOrigen && origenActivo }">
            <span class="material-symbols-outlined custom-icon">location_on</span>

            <!-- CHIP cuando hay selección -->
              <div v-if="selectedOrigen && origenActivo" class="location-chip" @click="editarOrigen">
              <span class="chip-text">{{ labelOrigen }}</span>
              <button class="chip-clear" @click.stop="clearOrigen">
                <span class="material-symbols-outlined" style="font-size:14px">close</span>
              </button>
            </div>

              <!-- INPUT cuando no hay selección O cuando no está activo -->
            <input
              v-else
                type="text"
                :value="origenActivo ? origen : (selectedOrigen ? labelOrigen : origen)"
                @input="e => { origen = e.target.value; fetchOrigen() }"
                autocomplete="off"
                placeholder="¿Desde dónde viajas?"
              @focus="abrirDropdownOrigen"
            />
          </div>
        </div>
        <LocationDropdown
          v-if="mostrarDropOrigen"
          :loading="loadingOrigen"
          :items="sugerenciasOrigen"
          @select="seleccionarOrigen"
        />
      </div>

      <!-- Swap -->
      <button class="swap-btn" @click="swapOrigenDestino" title="Intercambiar">
        <span class="material-symbols-outlined">swap_horiz</span>
      </button>

      <!-- Destino -->
      <div class="dynamic-field-wrapper" style="position:relative;" ref="destinoWrapper">
        <div class="field-group border-style">
          <label>Destino</label>
            <div class="input-with-icon" :class="{ 'has-chip': selectedDestino && destinoActivo }">
            <span class="material-symbols-outlined custom-icon">location_on</span>

            <!-- CHIP cuando hay selección -->
              <div v-if="selectedDestino && destinoActivo" class="location-chip" @click="editarDestino">
              <span class="chip-text">{{ labelDestino }}</span>
              <button class="chip-clear" @click.stop="clearDestino">
                <span class="material-symbols-outlined" style="font-size:14px">close</span>
              </button>
            </div>

              <!-- INPUT cuando no hay selección O cuando no está activo -->
            <input
              v-else
                type="text"
                :value="destinoActivo ? destino : (selectedDestino ? labelDestino : destino)"
                @input="e => { destino = e.target.value; fetchDestino() }"
                autocomplete="off"
                placeholder="Destino"
              @focus="abrirDropdownDestino"
            />
          </div>
        </div>
        <LocationDropdown
          v-if="mostrarDropDestino"
          :loading="loadingDestino"
          :items="sugerenciasDestino"
          @select="seleccionarDestino"
        />
      </div>

      <!-- Fechas -->
      <div class="dynamic-field-wrapper date-field" style="position:relative;">
        <div class="field-group border-style" @click="toggleCalendario">
          <label>{{ tipoViaje === 'REDONDO' ? 'Fechas' : 'Fecha' }}</label>
          <div class="input-with-icon">
            <span class="material-symbols-outlined custom-icon">calendar_month</span>
            <input type="text" readonly :value="resumenFechas" placeholder="Seleccionar" class="readonly-input" />
          </div>
        </div>
        <CalendarSelector
          v-if="mostrarCalendario"
          :range="tipoViaje === 'REDONDO'"
          @update:dates="onDatesSelected"
          @close="mostrarCalendario = false"
        />
      </div>

      <!-- Pasajeros + clase -->
      <div class="dynamic-field-wrapper" style="position:relative;" ref="pasajerosWrapper">
        <div class="field-group border-style" @click="togglePasajeros">
          <label>Pasajeros, clase de cabina</label>
          <div class="input-with-icon">
            <span class="material-symbols-outlined custom-icon">person</span>
            <input type="text" readonly :value="resumenPasajeros" class="readonly-input" />
          </div>
        </div>
        <PasajerosSelector
          v-if="mostrarPasajeros"
          v-model:pasajeros="pasajeros"
          v-model:clase="claseSeleccionada"
          :clases="clases"
          @close="mostrarPasajeros = false"
        />
      </div>

      <!-- Buscar -->
      <div class="search-button-container">
        <BuscarButton @click="handleSearch" />
      </div>
    </div>

    <!-- ── MULTIDESTINO ───────────────────────────────────────── -->
    <div v-else class="multidestino-container">

      <div
        v-for="(vuelo, idx) in vuelos"
        :key="idx"
        class="multidestino-row"
      >
        <span class="vuelo-label">Vuelo {{ idx + 1 }}</span>

        <!-- Origen -->
        <div class="dynamic-field-wrapper" style="position:relative; flex:1">
          <div class="field-group border-style">
            <div class="input-with-icon" :class="{ 'has-chip': vuelo.selectedOrigen && vuelo.activoOrigen }">
              <span class="material-symbols-outlined custom-icon">location_on</span>

              <div v-if="vuelo.selectedOrigen && vuelo.activoOrigen" class="location-chip" @click="editarMultiOrigen(idx)">
                <span class="chip-text">{{ vuelo.labelOrigen }}</span>
                <button class="chip-clear" @click.stop="clearMultiOrigen(idx)">
                  <span class="material-symbols-outlined" style="font-size:14px">close</span>
                </button>
              </div>

              <input
                v-else
                type="text"
                :value="vuelo.activoOrigen ? vuelo.origen : (vuelo.selectedOrigen ? vuelo.labelOrigen : vuelo.origen)"
                @input="e => { vuelo.origen = e.target.value; fetchMultiOrigen(idx) }"
                autocomplete="off"
                placeholder="Origen"
                @focus="() => { 
                  cerrarTodos();
                  vuelo.activoOrigen = true; abrirMultiOrigen(idx); }"
              />
            </div>
          </div>
          <LocationDropdown
            v-if="vuelo.mostrarDropOrigen"
            :loading="vuelo.loadingOrigen"
            :items="vuelo.sugerenciasOrigen"
            @select="(loc) => seleccionarMultiOrigen(idx, loc)"
          />
        </div>

        <!-- Swap -->
        <button class="swap-btn" @click="swapMulti(idx)">
          <span class="material-symbols-outlined">swap_horiz</span>
        </button>

        <!-- Destino -->
        <div class="dynamic-field-wrapper" style="position:relative; flex:1">
          <div class="field-group border-style">
            <div class="input-with-icon" :class="{ 'has-chip': vuelo.selectedDestino && vuelo.activoDestino }">
              <span class="material-symbols-outlined custom-icon">location_on</span>

              <div v-if="vuelo.selectedDestino && vuelo.activoDestino" class="location-chip" @click="editarMultiDestino(idx)">
                <span class="chip-text">{{ vuelo.labelDestino }}</span>
                <button class="chip-clear" @click.stop="clearMultiDestino(idx)">
                  <span class="material-symbols-outlined" style="font-size:14px">close</span>
                </button>
              </div>

              <input
                v-else
                type="text"
                :value="vuelo.activoDestino ? vuelo.destino : (vuelo.selectedDestino ? vuelo.labelDestino : vuelo.destino)"
                @input="e => { vuelo.destino = e.target.value; fetchMultiDestino(idx) }"
                autocomplete="off"
                placeholder="Destino"
                @focus="() => { 
                  cerrarTodos();
                  vuelo.activoDestino = true; abrirMultiDestino(idx); }"
              />
            </div>
          </div>
          <LocationDropdown
            v-if="vuelo.mostrarDropDestino"
            :loading="vuelo.loadingDestino"
            :items="vuelo.sugerenciasDestino"
            @select="(loc) => seleccionarMultiDestino(idx, loc)"
          />
        </div>

        <!-- Fecha -->
        <div class="dynamic-field-wrapper date-field" style="position:relative; flex:1">
          <div class="field-group border-style" @click="() => toggleMultiCalendario(idx)">
            <label>Fecha</label>
            <div class="input-with-icon">
              <span class="material-symbols-outlined custom-icon">calendar_month</span>
              <input type="text" readonly :value="fmtFecha(vuelo.fecha)" placeholder="Seleccionar" class="readonly-input" />
            </div>
          </div>
          <CalendarSelector
            v-if="vuelo.mostrarCalendario"
            :range="false"
            @update:dates="(d) => { vuelo.fecha = d.start; vuelo.mostrarCalendario = false }"
            @close="vuelo.mostrarCalendario = false"
          />
        </div>

        <!-- Eliminar (si hay más de 2) -->
        <button v-if="vuelos.length > 2" class="remove-vuelo-btn" @click="quitarVuelo(idx)">
          <span class="material-symbols-outlined">close</span>
        </button>
      </div>

      <!-- Agregar vuelo + Buscar -->
      <div class="multidestino-actions">
        <button class="add-vuelo-btn" @click="agregarVuelo" :disabled="vuelos.length >= 6">
          <span class="material-symbols-outlined">add</span>
          Agregar otro vuelo
        </button>
        <div class="buscar-pill-wrapper">
          <BuscarButton @click="handleSearch" />
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import BuscarButton    from '../components/ButtonSearch.vue'
import CalendarSelector from '../components/CalendarSelector.vue'
import LocationDropdown from '../components/LocationDropdown.vue'
import PasajerosSelector from '../components/PasajerosSelector.vue'

const API_URL = 'http://localhost:3000'
const router  = useRouter()

const props = defineProps({
  initialDestino: String,
  initialEntrada: String,
  initialSalida:  String,
})

// Referencias para detectar clics fuera
const origenWrapper = ref(null)
const destinoWrapper = ref(null)
const pasajerosWrapper = ref(null)

// Sincronizar destino si cambia la prop inicial
watch(() => props.initialDestino, (val) => {
  if (val) destino.value = val
})

const tabs = [
  { id: 'REDONDO',      label: 'Viaje redondo'  },
  { id: 'SENCILLO',     label: 'Viaje sencillo' },
  { id: 'MULTIDESTINO', label: 'Multidestino'   },
]
const tipoViaje = ref('REDONDO')

const clases = ['Económica', 'Business', 'Primera clase']
const pasajeros       = ref(1)
const claseSeleccionada = ref('Económica')
const mostrarPasajeros  = ref(false)
const togglePasajeros   = () => (mostrarPasajeros.value = !mostrarPasajeros.value)
const resumenPasajeros  = computed(
  () => `${pasajeros.value} pasajero${pasajeros.value > 1 ? 's' : ''}, ${claseSeleccionada.value}`
)

const origen  = ref('')
const destino = ref(props.initialDestino || '')
const selectedOrigen  = ref(null)
const labelOrigen     = ref('')
const origenActivo    = ref(false)
const selectedDestino = ref(null)
const labelDestino    = ref('')
const destinoActivo   = ref(false)
const mostrarDropOrigen  = ref(false)
const mostrarDropDestino = ref(false)
const loadingOrigen      = ref(false)
const loadingDestino     = ref(false)
const sugerenciasOrigen  = ref([])
const sugerenciasDestino = ref([])

async function fetchLugares(q, sugerencias, loading, esOrigen = true) {
  loading.value = true
  const endpoint = esOrigen ? 'aeropuertos' : 'ubicaciones'
  try {
    const res = await fetch(`${API_URL}/api/search/${endpoint}?q=${q}`)
    sugerencias.value = await res.json()
  } catch { sugerencias.value = [] }
  finally { loading.value = false }
}
const abrirDropdownOrigen = () => {
  origenActivo.value = true
  mostrarDropOrigen.value = true
  fetchOrigen()
}
const abrirDropdownDestino = () => {
  destinoActivo.value = true
  mostrarDropDestino.value = true
  fetchDestino()
}
const fetchOrigen  = () => fetchLugares(origen.value,  sugerenciasOrigen,  loadingOrigen, true)
const fetchDestino = () => fetchLugares(destino.value, sugerenciasDestino, loadingDestino, false)
function seleccionarOrigen(loc) {
  selectedOrigen.value = loc
  origen.value = `${loc.ubicacion}, ${loc.ciudad}, ${loc.pais}`
  labelOrigen.value = loc.iata 
    ? `${loc.iata} · ${loc.ciudad}` 
    : `${loc.ciudad}, ${loc.pais}`
  origenActivo.value = false
  mostrarDropOrigen.value = false
}
function seleccionarDestino(loc) {
  selectedDestino.value = loc
  destino.value = `${loc.ubicacion}, ${loc.ciudad}, ${loc.pais}`
  labelDestino.value = loc.iata 
    ? `${loc.iata} · ${loc.ciudad}` 
    : `${loc.ciudad}, ${loc.pais}`
  destinoActivo.value = false
  mostrarDropDestino.value = false
}
function swapOrigenDestino() {
  ;[origen.value, destino.value] = [destino.value, origen.value]
  ;[selectedOrigen.value, selectedDestino.value] = [selectedDestino.value, selectedOrigen.value]
  ;[labelOrigen.value, labelDestino.value] = [labelDestino.value, labelOrigen.value]
  ;[origenActivo.value, destinoActivo.value] = [destinoActivo.value, origenActivo.value]
}

function clearOrigen() {
  selectedOrigen.value = null
  labelOrigen.value = ''
  origen.value = ''
  origenActivo.value = false
  mostrarDropOrigen.value = false
}

function clearDestino() {
  selectedDestino.value = null
  labelDestino.value = ''
  destino.value = ''
  destinoActivo.value = false
  mostrarDropDestino.value = false
}

function editarOrigen() {
  clearOrigen()
  nextTick(() => {
    origenWrapper.value?.querySelector('input')?.focus()
  })
}

function editarDestino() {
  clearDestino()
  nextTick(() => {
    destinoWrapper.value?.querySelector('input')?.focus()
  })
}

function clearMultiOrigen(i) {
  vuelos.value[i].origen = ''
  vuelos.value[i].labelOrigen = ''
  vuelos.value[i].activoOrigen = true
  vuelos.value[i].selectedOrigen = null
  vuelos.value[i].mostrarDropOrigen = false
}

function clearMultiDestino(i) {
  vuelos.value[i].destino = ''
  vuelos.value[i].labelDestino = ''
  vuelos.value[i].activoDestino = true
  vuelos.value[i].selectedDestino = null
  vuelos.value[i].mostrarDropDestino = false
}

function editarMultiOrigen(i) {
  clearMultiOrigen(i)
  nextTick(() => {
    const rows = document.querySelectorAll('.multidestino-row')
    rows[i]?.querySelector('input')?.focus()
  })
}

function editarMultiDestino(i) {
  clearMultiDestino(i)
  nextTick(() => {
    const rows = document.querySelectorAll('.multidestino-row')
    // Buscamos los wrappers de campos dinámicos; el destino es el segundo (índice 1)
    const wrappers = rows[i]?.querySelectorAll('.dynamic-field-wrapper')
    wrappers[1]?.querySelector('input')?.focus()
  })
}

const fechaInicio      = ref(props.initialEntrada || '')
const fechaFin         = ref(props.initialSalida  || '')
const mostrarCalendario = ref(false)
const toggleCalendario  = () => (mostrarCalendario.value = !mostrarCalendario.value)
function onDatesSelected(dates) {
  fechaInicio.value = dates.start
  fechaFin.value    = tipoViaje.value === 'REDONDO' ? dates.end : ''
  mostrarCalendario.value = false
}
function fmtFecha(str) {
  if (!str) return ''
  const [y, m, d] = str.split('-').map(Number)
  return new Date(y, m - 1, d).toLocaleDateString('es-ES', { day: 'numeric', month: 'short', weekday: 'short' })
}
const resumenFechas = computed(() => {
  if (!fechaInicio.value) return ''
  if (tipoViaje.value === 'SENCILLO') return fmtFecha(fechaInicio.value)
  const fin = fechaFin.value ? fmtFecha(fechaFin.value) : '...'
  return `${fmtFecha(fechaInicio.value)} — ${fin}`
})

function nuevoVuelo(destPrefill = '') {
  return {
    origen: '', destino: destPrefill,
    labelOrigen: '', labelDestino: '',
    activoOrigen: false, activoDestino: false,
    fecha: '',
    selectedOrigen: null, selectedDestino: null,
    mostrarDropOrigen: false, mostrarDropDestino: false,
    mostrarCalendario: false,
    loadingOrigen: false,    loadingDestino: false,
    sugerenciasOrigen: [],   sugerenciasDestino: [],
  }
}
const vuelos = ref([ nuevoVuelo(props.initialDestino || ''), nuevoVuelo() ])
const agregarVuelo = () => { if (vuelos.value.length < 6) vuelos.value.push(nuevoVuelo()) }
const quitarVuelo  = (i) => vuelos.value.splice(i, 1)
const swapMulti    = (i) => {
  const v = vuelos.value[i]
  ;[v.origen, v.destino] = [v.destino, v.origen]
  ;[v.selectedOrigen, v.selectedDestino] = [v.selectedDestino, v.selectedOrigen]
  ;[v.activoOrigen, v.activoDestino] = [v.activoDestino, v.activoOrigen]
  ;[v.labelOrigen, v.labelDestino] = [v.labelDestino, v.labelOrigen]
}
async function fetchMultiOrigen(i) {
  const v = vuelos.value[i]
  v.mostrarDropOrigen = true; v.loadingOrigen = true
  try {
    const res = await fetch(`${API_URL}/api/search/aeropuertos?q=${v.origen}`)
    v.sugerenciasOrigen = await res.json()
  } catch { v.sugerenciasOrigen = [] }
  finally { v.loadingOrigen = false }
}
async function fetchMultiDestino(i) {
  const v = vuelos.value[i]
  v.mostrarDropDestino = true; v.loadingDestino = true
  try {
    const res = await fetch(`${API_URL}/api/search/ubicaciones?q=${v.destino}`)
    v.sugerenciasDestino = await res.json()
  } catch { v.sugerenciasDestino = [] }
  finally { v.loadingDestino = false }
}
const abrirMultiOrigen  = (i) => { vuelos.value[i].mostrarDropOrigen  = true; fetchMultiOrigen(i)  }
const abrirMultiDestino = (i) => { vuelos.value[i].mostrarDropDestino = true; fetchMultiDestino(i) }
function seleccionarMultiOrigen(i, loc) {
  const v = vuelos.value[i]
  v.selectedOrigen = loc
  v.origen = `${loc.ubicacion}, ${loc.ciudad}, ${loc.pais}`
  v.labelOrigen = loc.iata 
    ? `${loc.iata} · ${loc.ciudad}` 
    : `${loc.ciudad}, ${loc.pais}`
  v.activoOrigen = false
  v.mostrarDropOrigen = false
}
function seleccionarMultiDestino(i, loc) {
  const v = vuelos.value[i]
  v.selectedDestino = loc
  v.destino = `${loc.ubicacion}, ${loc.ciudad}, ${loc.pais}`
  v.labelDestino = loc.iata 
    ? `${loc.iata} · ${loc.ciudad}` 
    : `${loc.ciudad}, ${loc.pais}`
  v.activoDestino = false
  v.mostrarDropDestino = false
}
function toggleMultiCalendario(i) {
  vuelos.value.forEach((v, idx) => { if (idx !== i) v.mostrarCalendario = false })
  vuelos.value[i].mostrarCalendario = !vuelos.value[i].mostrarCalendario
}

const agregarHospedaje = ref(false)
const agregarAuto      = ref(false)

// Cerrar todos los menús abiertos
function cerrarTodos() {
  origenActivo.value  = false
  destinoActivo.value = false
  mostrarDropOrigen.value = false
  mostrarDropDestino.value = false
  mostrarCalendario.value = false
  mostrarPasajeros.value = false
  vuelos.value.forEach(v => {
    v.activoOrigen = false
    v.activoDestino = false
    v.mostrarDropOrigen = false
    v.mostrarDropDestino = false
    v.mostrarCalendario = false
  })
}

const handleOutsideClick = (e) => {
  if (!e.target.closest('.dynamic-field-wrapper') && 
      !e.target.closest('.pasajeros-panel') &&
      !e.target.closest('.calendar-modal')) {
    cerrarTodos()
  }
}

onMounted(() => window.addEventListener('mousedown', handleOutsideClick))
onUnmounted(() => window.removeEventListener('mousedown', handleOutsideClick))

function handleSearch() {
  if (tipoViaje.value === 'MULTIDESTINO') {
    const incompleto = vuelos.value.some(v => !v.origen || !v.destino || !v.fecha)
    if (incompleto) { alert('Completa todos los tramos'); return }
    router.push({
      path: '/vuelos',
      query: {
        tipo: 'MULTIDESTINO',
        vuelos: JSON.stringify(vuelos.value.map(v => ({
          id_origen:  v.selectedOrigen?.id  ?? '',
          id_destino: v.selectedDestino?.id ?? '',
          origen: v.origen, destino: v.destino, fecha: v.fecha,
        }))),
        pasajeros: pasajeros.value, clase: claseSeleccionada.value, con_hospedaje: agregarHospedaje.value,
      }
    })
  } else {
    if (!origen.value || !destino.value || !fechaInicio.value) { alert('Completa origen, destino y fecha'); return }
    router.push({
      path: '/vuelos',
      query: {
        tipo: tipoViaje.value,
        id_origen: selectedOrigen.value?.id  ?? '',
        id_destino: selectedDestino.value?.id ?? '',
        origen: origen.value, destino: destino.value,
        entrada: fechaInicio.value, salida: tipoViaje.value === 'REDONDO' ? fechaFin.value : '',
        pasajeros: pasajeros.value, clase: claseSeleccionada.value,
        con_hospedaje: agregarHospedaje.value, con_auto: agregarAuto.value,
      }
    })
  }
}
</script>

<style scoped>
@import '../assets/css/FormSearch.css';
</style>