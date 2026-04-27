<template>
  <div class="cruceros-search">
    <!-- Aviso teléfono expertos -->
    <div class="info-banner">
      <span class="material-symbols-outlined banner-icon">phone</span>
      <p>Asesoría de expertos en cruceros: <strong>1-866-403-9848</strong></p>
    </div>

    <div class="search-fields-dynamic">

      <!-- Destino -->
      <div class="dynamic-field-wrapper" id="cru-destination-wrapper" style="position: relative;">
        <div class="field-group border-style">
          <label>Destino</label>
          <div class="input-with-icon" :class="{ 'has-chip': selectedUbicacion }">
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

      <!-- Rango de fechas de salida -->
      <div class="dynamic-field-wrapper date-field" style="position: relative;">
        <div class="field-group border-style" @click="toggleCalendar">
          <label>Rango de fechas de salida</label>
          <div class="input-with-icon">
            <span class="material-symbols-outlined custom-icon">calendar_month</span>
            <input
              type="text"
              readonly
              :value="resumenFechas"
              placeholder="Rango de fechas de salida"
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

      <!-- Duración -->
      <div class="dynamic-field-wrapper" id="cru-duracion-wrapper" style="position: relative;">
        <div class="field-group border-style" @click="toggleDuracion">
          <label>Duración</label>
          <div class="input-with-icon">
            <span class="material-symbols-outlined custom-icon">schedule</span>
            <input
              type="text"
              readonly
              :value="resumenDuracion"
              class="readonly-input"
            />
          </div>
        </div>

        <!-- Dropdown duración -->
        <div v-if="mostrarDuracion" class="duracion-dropdown">
          <div
            v-for="opt in duracionOpciones"
            :key="opt.value"
            :class="['duracion-item', { selected: duracionSeleccionada === opt.value }]"
            @click="seleccionarDuracion(opt)"
          >
            {{ opt.label }}
          </div>
        </div>
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

const API_URL = 'http://localhost:3000'
const router  = useRouter()

const busquedaDestino    = ref('')
const selectedUbicacion  = ref(null)
const labelUbicacion     = ref('')
const sugerencias        = ref([])
const mostrarDropdown    = ref(false)
const loadingUbicaciones = ref(false)
const mostrarCalendario  = ref(false)
const mostrarDuracion    = ref(false)
const fechaInicio        = ref('')
const fechaFin           = ref('')

// Duración — valor por defecto "3 a 9 noches"
const duracionSeleccionada = ref('3-9')
const duracionOpciones = [
  { value: 'any',   label: 'Cualquier duración'  },
  { value: '1-3',   label: '1 a 3 noches'         },
  { value: '3-5',   label: '3 a 5 noches'         },
  { value: '3-9',   label: '3 a 9 noches'         },
  { value: '6-9',   label: '6 a 9 noches'         },
  { value: '10-14', label: '10 a 14 noches'        },
  { value: '15+',   label: '15 noches o más'       },
]

const resumenDuracion = computed(() => {
  const opt = duracionOpciones.find(o => o.value === duracionSeleccionada.value)
  return opt ? opt.label : ''
})

function seleccionarDuracion(opt) {
  duracionSeleccionada.value = opt.value
  mostrarDuracion.value      = false
}

function onDatesSelected(dates) {
  fechaInicio.value       = dates.start
  fechaFin.value          = dates.end
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
  mostrarDuracion.value   = false
}

const toggleDuracion = () => {
  mostrarDuracion.value   = !mostrarDuracion.value
  mostrarCalendario.value = false
  mostrarDropdown.value   = false
}

async function fetchUbicaciones() {
  mostrarDropdown.value    = true
  mostrarCalendario.value  = false
  mostrarDuracion.value    = false
  loadingUbicaciones.value = true
  try {
    const res = await fetch(`${API_URL}/api/search/ubicaciones?q=${busquedaDestino.value}`)
    sugerencias.value = await res.json()
  } catch {
    sugerencias.value = []
  } finally {
    loadingUbicaciones.value = false
  }
}

const abrirMenu = () => {
  mostrarDropdown.value    = true
  mostrarCalendario.value  = false
  mostrarDuracion.value    = false
  loadingUbicaciones.value = true
  fetch(`${API_URL}/api/search/ubicaciones?q=${busquedaDestino.value}`)
    .then(r => r.json())
    .then(d => sugerencias.value = d)
    .catch(() => sugerencias.value = [])
    .finally(() => loadingUbicaciones.value = false)
}

function seleccionarUbicacion(loc) {
  selectedUbicacion.value = loc
  busquedaDestino.value   = `${loc.ubicacion}, ${loc.ciudad}, ${loc.pais}`
  labelUbicacion.value    = `${loc.ciudad}, ${loc.pais}`
  mostrarDropdown.value   = false
}

function clearDestino() {
  selectedUbicacion.value = null
  labelUbicacion.value    = ''
  busquedaDestino.value   = ''
  mostrarDropdown.value   = false
}

function editarDestino() { clearDestino() }

async function handleSearch() {
  router.push({
    path: '/cruceros',
    query: {
      destino:      busquedaDestino.value,
      id_ubicacion: selectedUbicacion.value?.id ?? '',
      entrada:      fechaInicio.value,
      salida:       fechaFin.value,
      duracion:     duracionSeleccionada.value,
    }
  })
}

const handleOutsideClick = (e) => {
  if (
    !e.target.closest('#cru-destination-wrapper') &&
    !e.target.closest('.date-field') &&
    !e.target.closest('#cru-duracion-wrapper')
  ) {
    mostrarDropdown.value   = false
    mostrarCalendario.value = false
    mostrarDuracion.value   = false
  }
}

onMounted(()  => window.addEventListener('mousedown', handleOutsideClick))
onUnmounted(() => window.removeEventListener('mousedown', handleOutsideClick))
</script>

<style scoped>
@import "../assets/css/FormSearch.css";
</style>