<template>
  <div class="actividades-search">
    <!-- Aviso de eventos -->
    <div class="info-banner">
      <span class="material-symbols-outlined banner-icon">confirmation_number</span>
      <p>
        ¿Quieres ir a un evento deportivo, concierto o festival de música?
        <a href="#" class="link-entradas">Buscar entradas</a>
      </p>
    </div>

    <div class="search-fields-dynamic">

      <!-- Destino -->
      <div class="dynamic-field-wrapper" id="act-destination-wrapper" style="position: relative;">
        <div class="field-group border-style">
          <label>Destino</label>
          <div class="input-with-icon" :class="{ 'has-chip': selectedUbicacion && destinoActivo === false && selectedUbicacion }">
            <span class="material-symbols-outlined custom-icon">location_on</span>

            <div v-if="selectedUbicacion" class="location-chip" @click="editarDestino">
              <span class="chip-text">{{ labelUbicacion }}</span>
              <button class="chip-clear" @click.stop="clearDestino">
                <span class="material-symbols-outlined" style="font-size:14px">close</span>
              </button>
            </div>

            <input
              v-else
              type="text"
              v-model="busquedaDestino"
              @input="fetchUbicaciones"
              @focus="abrirMenu"
              placeholder="Destino"
              autocomplete="off"
            />
          </div>
        </div>

        <LocationDropdown
          v-if="mostrarDropdown"
          :loading="loadingUbicaciones"
          :items="sugerencias"
          @select="seleccionarUbicacion"
        />
      </div>

      <!-- Fechas -->
      <div class="dynamic-field-wrapper date-field" style="position: relative;">
        <div class="field-group border-style" @click="toggleCalendar">
          <label>Fechas</label>
          <div class="input-with-icon">
            <span class="material-symbols-outlined custom-icon">calendar_month</span>
            <input
              type="text"
              readonly
              :value="resumenFechas"
              placeholder="Entrada — Salida"
              class="readonly-input"
            />
          </div>
        </div>
        <CalendarSelector
          v-if="mostrarCalendario"
          @update:dates="onDatesSelected"
          @close="mostrarCalendario = false"
        />
      </div>

      <!-- Botón buscar -->
      <div class="search-button-container">
        <BuscarButton @click="handleSearch" />
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import BuscarButton from './ButtonSearch.vue'
import CalendarSelector from './CalendarSelector.vue'
import LocationDropdown from './LocationDropdown.vue'

const props = defineProps({
  initialDestino: String,
  initialEntrada: String,
  initialSalida:  String,
})

const API_URL = import.meta.env.VITE_API_URL || 'https://hotelierbackend-1.onrender.com'
const router  = useRouter()

const busquedaDestino    = ref(props.initialDestino || '')
const selectedUbicacion  = ref(null)
const labelUbicacion     = ref('')
const destinoActivo      = ref(false)
const sugerencias        = ref([])
const mostrarDropdown    = ref(false)
const loadingUbicaciones = ref(false)
const mostrarCalendario  = ref(false)
const fechaInicio        = ref(props.initialEntrada || '')
const fechaFin           = ref(props.initialSalida  || '')

function onDatesSelected(dates) {
  fechaInicio.value = dates.start
  fechaFin.value    = dates.end
}

function fmtFecha(str) {
  if (!str) return ''
  if (!str.includes('-')) return str
  const [y, m, d] = str.split('-').map(Number)
  return new Date(y, m - 1, d).toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })
}

const resumenFechas = computed(() => {
  if (!fechaInicio.value) return ''
  if (fechaFin.value === 'FLEXIBLE') return fechaInicio.value
  const ini = fmtFecha(fechaInicio.value)
  const fin  = fechaFin.value ? fmtFecha(fechaFin.value) : '...'
  return `${ini} — ${fin}`
})

const toggleCalendar = () => {
  mostrarCalendario.value = !mostrarCalendario.value
  mostrarDropdown.value   = false
}

async function fetchUbicaciones() {
  destinoActivo.value      = true
  mostrarDropdown.value    = true
  mostrarCalendario.value  = false
  loadingUbicaciones.value = true
  try {
    const res = await fetch(`${API_URL}/api/search/ubicaciones?q=${encodeURIComponent(busquedaDestino.value)}`)
    sugerencias.value = await res.json()
  } catch {
    sugerencias.value = []
  } finally {
    loadingUbicaciones.value = false
  }
}

const abrirMenu = () => {
  destinoActivo.value      = true
  mostrarDropdown.value    = true
  mostrarCalendario.value  = false
  loadingUbicaciones.value = true
  fetch(`${API_URL}/api/search/ubicaciones?q=${encodeURIComponent(busquedaDestino.value)}`)
    .then(r => r.json())
    .then(d => sugerencias.value = d)
    .catch(() => sugerencias.value = [])
    .finally(() => loadingUbicaciones.value = false)
}

function seleccionarUbicacion(loc) {
  selectedUbicacion.value = loc
  busquedaDestino.value   = `${loc.ubicacion}, ${loc.ciudad}, ${loc.pais}`
  labelUbicacion.value    = `${loc.ciudad}, ${loc.pais}`
  destinoActivo.value     = false
  mostrarDropdown.value   = false
}

function clearDestino() {
  selectedUbicacion.value = null
  labelUbicacion.value    = ''
  busquedaDestino.value   = ''
  destinoActivo.value     = false
  mostrarDropdown.value   = false
}

function editarDestino() {
  clearDestino()
  destinoActivo.value = true
}

async function handleSearch() {
  if (!busquedaDestino.value || !fechaInicio.value || !fechaFin.value) {
    alert('Por favor completa destino y fechas')
    return
  }
  router.push({
    path: '/actividades',
    query: {
      destino:      busquedaDestino.value,
      id_ubicacion: selectedUbicacion.value?.id ?? '',
      entrada:      fechaInicio.value,
      salida:       fechaFin.value,
    }
  })
}

const handleOutsideClick = (e) => {
  if (!e.target.closest('#act-destination-wrapper') && !e.target.closest('.date-field')) {
    destinoActivo.value     = false
    mostrarDropdown.value   = false
    mostrarCalendario.value = false
  }
}

onMounted(()  => window.addEventListener('mousedown', handleOutsideClick))
onUnmounted(() => window.removeEventListener('mousedown', handleOutsideClick))
</script>

<style src="../assets/css/FormSearch.css"></style>