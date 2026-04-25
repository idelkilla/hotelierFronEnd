<template>
  <div :class="['search-container', { 'compact-mode': compact }]">
    <div v-if="!compact" class="hero">
      <h1>Vivimos para viajar</h1>
    </div>

    <!-- Card compacta mobile / form desktop -->
    <div :class="['form-box', { 'compact-form-box': compact }]">
      <!-- Opciones (Hospedaje, Vuelos, etc.) -->
      <div v-if="!compact" class="options">
        <div v-for="option in options" :key="option.id"
          :class="['item', { active: activeOption === option.id }]"
          @click="selectOption(option.id)">
          <img :src="getIconPath(option.icon_img)" :alt="option.label" />
          <span>{{ option.label }}</span>
        </div>
      </div>

      <VuelosSearch
        v-if="activeOption === 'vuelos'"
        :initialDestino="busquedaDestino"
        :initialEntrada="fechaInicio"
        :initialSalida="fechaFin"
      />

      <template v-else>
        <!-- Campos de búsqueda — stack vertical en mobile -->
        <div class="search-fields-dynamic">

          <!-- Destino -->
          <div class="dynamic-field-wrapper" id="destination-wrapper" style="position: relative;">
            <div class="field-group border-style">
              <label>¿A dónde quieres ir?</label>
              <div class="input-with-icon">
                <span class="material-symbols-outlined custom-icon">location_on</span>
                <input type="text" v-model="busquedaDestino" @focus="abrirMenu" @input="fetchUbicaciones"
                  placeholder="Destino" autocomplete="off" />
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
                <input type="text" readonly :value="resumenFechas" placeholder="Entrada — Salida"
                  class="readonly-input" />
              </div>
            </div>
            <CalendarSelector v-if="mostrarCalendario" @update:dates="onDatesSelected"
              @close="mostrarCalendario = false" />
          </div>

          <!-- Huéspedes -->
          <div class="dynamic-field-wrapper" id="guest-wrapper" style="position: relative;">
            <div class="field-group border-style" @click="toggleHuespedes">
              <label>Huéspedes</label>
              <div class="input-with-icon">
                <span class="material-symbols-outlined custom-icon">person</span>
                <input type="text" readonly :value="resumenHuespedes" class="readonly-input" />
              </div>
            </div>
            <GuestSelector v-if="mostrarHuespedes" v-model="habitaciones" @close="mostrarHuespedes = false" />
          </div>

          <!-- Botón buscar -->
          <div class="search-button-container">
            <BuscarButton @click="handleSearch" />
          </div>

        </div>

        <!-- Extras -->
        <div v-if="!compact" class="extra-options-row">
          <div class="checkbox-group">
            <label class="custom-checkbox">
              <input type="checkbox" v-model="agregarVuelo" />
              <span class="checkmark"></span>
              Agregar un vuelo
            </label>
            <label class="custom-checkbox">
              <input type="checkbox" v-model="agregarAuto" />
              <span class="checkmark"></span>
              Agregar un auto
            </label>
          </div>

          <div v-if="agregarVuelo" class="origin-field-container" id="origin-wrapper" style="position: relative;">
            <div class="field-group border-style">
              <label>Origen</label>
              <div class="input-with-icon">
                <span class="material-symbols-outlined custom-icon">location_on</span>
                <input type="text" v-model="origenVuelo" @focus="abrirMenuOrigen" @input="fetchUbicacionesOrigen"
                  placeholder="¿Desde dónde viajas?" autocomplete="off" />
              </div>
            </div>

            <LocationDropdown
              v-if="mostrarDropdownOrigen"
              :loading="loadingUbicacionesOrigen"
              :items="sugerenciasOrigen"
              @select="seleccionarUbicacionOrigen"
            />
          </div>
        </div>
      </template>

    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import BuscarButton from './ButtonSearch.vue'
import GuestSelector from './GuestSelector.vue'
import CalendarSelector from './CalendarSelector.vue'
import LocationDropdown from './LocationDropdown.vue'
import VuelosSearch from './VuelosSearch.vue'

const props = defineProps({
  compact: Boolean,
  initialDestino: String,
  initialEntrada: String,
  initialSalida: String,
  initialHuespedes: Array,
});

const API_URL = 'http://localhost:3000'
const router  = useRouter()

const activeOption      = ref('hospedaje')
const busquedaDestino   = ref(props.initialDestino || '')
const origenVuelo       = ref('')
const fechaInicio       = ref(props.initialEntrada || '')
const fechaFin          = ref(props.initialSalida || '')
const selectedUbicacion = ref(null)
const sugerencias       = ref([])
const sugerenciasOrigen = ref([])
const mostrarDropdown   = ref(false)
const mostrarDropdownOrigen = ref(false)
const mostrarHuespedes  = ref(false)
const mostrarCalendario = ref(false)
const loadingUbicaciones = ref(false)
const loadingUbicacionesOrigen = ref(false)
const agregarVuelo      = ref(false)
const agregarAuto       = ref(false)

// Sincronizar con props cuando cambian (ej. al navegar entre resultados)
watch(() => props.initialDestino, (val) => busquedaDestino.value = val || '')
watch(() => props.initialEntrada, (val) => fechaInicio.value = val || '')
watch(() => props.initialSalida,  (val) => fechaFin.value = val || '')
watch(() => props.initialHuespedes, (val) => {
  if (val) habitaciones.value = JSON.parse(JSON.stringify(val))
}, { deep: true })

function onDatesSelected(dates) {
  fechaInicio.value = dates.start
  fechaFin.value    = dates.end
}

function fmtFecha(str) {
  if (!str) return ''
  const [y, m, d] = str.split('-').map(Number)
  return new Date(y, m - 1, d).toLocaleDateString('es-ES', {
    day: 'numeric', month: 'short',
  })
}

const resumenFechas = computed(() => {
  if (!fechaInicio.value) return ''
  const ini = fmtFecha(fechaInicio.value)
  const fin  = fechaFin.value ? fmtFecha(fechaFin.value) : '...'
  return `${ini} — ${fin}`
})

const habitaciones = ref(props.initialHuespedes ? JSON.parse(JSON.stringify(props.initialHuespedes)) : [{ adultos: 2, ninos: 0, edadesNinos: [] }]);

const resumenHuespedes = computed(() => {
  const totalPersonas = habitaciones.value.reduce((acc, h) => acc + h.adultos + h.ninos, 0)
  return `${totalPersonas} personas, ${habitaciones.value.length} habitación`
})

const options = ref([
  { id: 'hospedaje',   label: 'Hospedaje',   icon_img: 'bed'     },
  { id: 'vuelos',      label: 'Vuelos',       icon_img: 'flight'  },
  { id: 'autos',       label: 'Autos',        icon_img: 'car'     },
  { id: 'paquetes',    label: 'Paquetes',     icon_img: 'package' },
  { id: 'actividades', label: 'Actividades',  icon_img: 'ticket'  },
  { id: 'cruceros',    label: 'Cruceros',     icon_img: 'cruise'  },
])

const toggleCalendar = () => {
  mostrarCalendario.value = !mostrarCalendario.value
  mostrarHuespedes.value  = false
  mostrarDropdown.value   = false
}

const toggleHuespedes = () => {
  mostrarHuespedes.value  = !mostrarHuespedes.value
  mostrarCalendario.value = false
  mostrarDropdown.value   = false
}

async function fetchUbicaciones() {
  mostrarDropdown.value    = true
  mostrarHuespedes.value   = false
  mostrarCalendario.value  = false
  loadingUbicaciones.value = true
  selectedUbicacion.value  = null
  try {
    const res = await fetch(`${API_URL}/api/search/ubicaciones?q=${busquedaDestino.value}`)
    sugerencias.value = await res.json()
  } catch {
    sugerencias.value = []
  } finally {
    loadingUbicaciones.value = false
  }
}

async function fetchUbicacionesOrigen() {
  mostrarDropdownOrigen.value = true
  cerrarTodos()
  loadingUbicacionesOrigen.value = true
  try {
    const res = await fetch(`${API_URL}/api/search/ubicaciones?q=${origenVuelo.value}`)
    sugerenciasOrigen.value = await res.json()
  } catch {
    sugerenciasOrigen.value = []
  } finally {
    loadingUbicacionesOrigen.value = false
  }
}

const abrirMenu = fetchUbicaciones
const abrirMenuOrigen = fetchUbicacionesOrigen

function seleccionarUbicacion(loc) {
  selectedUbicacion.value = loc
  busquedaDestino.value   = `${loc.ubicacion}, ${loc.ciudad}, ${loc.pais}`
  mostrarDropdown.value   = false
}

function seleccionarUbicacionOrigen(loc) {
  origenVuelo.value = `${loc.ubicacion}, ${loc.ciudad}, ${loc.pais}`
  mostrarDropdownOrigen.value = false
}

function selectOption(id) { activeOption.value = id }

function getIconPath(name) {
  return new URL(`../assets/img/iconos/light__${name}.svg`, import.meta.url).href
}

function cerrarTodos() {
  mostrarDropdown.value   = false
  mostrarHuespedes.value  = false
  mostrarCalendario.value = false
  mostrarDropdownOrigen.value = false
}

async function handleSearch() {
  if (!busquedaDestino.value || !fechaInicio.value || !fechaFin.value) {
    alert('Por favor completa destino y fechas')
    return
  }
  router.push({
    path: '/head',
    query: {
      destino:      busquedaDestino.value,
      id_ubicacion: selectedUbicacion.value?.id ?? '',
      entrada:      fechaInicio.value,
      salida:       fechaFin.value,
      huespedes:    JSON.stringify(habitaciones.value),
    }
  })
}

const handleOutsideClick = (e) => {
  if (!e.target.closest('#destination-wrapper') &&
      !e.target.closest('#guest-wrapper') &&
      !e.target.closest('#origin-wrapper') &&
      !e.target.closest('.date-field'))
    cerrarTodos()
}

onMounted(()  => window.addEventListener('mousedown', handleOutsideClick))
onUnmounted(() => window.removeEventListener('mousedown', handleOutsideClick))
</script>

<style scoped>
@import '../assets/css/FormSearch.css';

/* Estilos para el modo compacto (usado en Cuerpo.vue) */
.search-container.compact-mode {
  background: transparent !important;
  padding: 0 !important;
  margin: 0 !important;
  min-height: auto !important;
  box-shadow: none !important;
}

.compact-form-box {
  background: white !important;
  margin: 0 auto !important;
  padding: 10px !important;
  border-radius: 12px !important;
  box-shadow: none !important;
}
</style>