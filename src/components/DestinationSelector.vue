<template>
  <div class="dynamic-field-wrapper" id="destination-wrapper" style="position: relative; flex: 2.5;">
    <div class="field-group border-style">
      <label>¿A dónde quieres ir?</label>
      <div class="input-with-icon">
        <span class="material-symbols-outlined custom-icon">location_on</span>
        <input 
          type="text" 
          :value="destinoActivo ? busquedaDestino : labelUbicacion" 
          @input="e => { busquedaDestino = e.target.value; fetchUbicaciones() }" 
          @focus="abrirMenu"
          @blur="cerrarConRetraso"
          placeholder="Destino" 
          autocomplete="off"
        >
      </div>
    </div>

    <div v-if="mostrarDropdown" class="location-dropdown">
      <div v-if="loadingUbicaciones" class="location-item">
        <span class="loc-details">Cargando ubicaciones...</span>
      </div>
      <div v-else-if="busquedaRealizada && sugerencias.length === 0" class="location-item">
        <span class="loc-details">No se encontraron ubicaciones</span>
      </div>
      
      <div 
        v-for="loc in sugerencias" 
        :key="loc.id" 
        class="location-item" 
        @mousedown="seleccionarUbicacion(loc)"
      >
        <span class="material-symbols-outlined icon-gray">
          {{ loc.id_tipo === 1 ? 'apartment' : ([2, 3].includes(loc.id_tipo) ? 'local_airport' : 'location_on') }}
        </span>
        <div class="location-text">
          <span class="loc-name">{{ loc.label }}</span>
          <span class="loc-details">{{ loc.pais }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'

const props = defineProps(['modelValue'])
const emit = defineEmits(['update:modelValue', 'focus'])

const API_URL = import.meta.env.VITE_API_URL || 'https://hotelierbackend-1.onrender.com'
const sugerencias = ref([])
const mostrarDropdown = ref(false)
const loadingUbicaciones = ref(false)
const busquedaRealizada = ref(false)
const selectedUbicacion = ref(null)
const labelUbicacion = ref('')
const destinoActivo = ref(false)
const busquedaDestino = ref(props.modelValue || '')

// Sincronizar estado interno si modelValue cambia desde fuera (ej. reset del formulario)
watch(() => props.modelValue, (newVal) => {
  if (!destinoActivo.value) {
    busquedaDestino.value = newVal || ''
  }
})

const cerrarConRetraso = () => {
  // El retraso permite que el evento @mousedown de la sugerencia se ejecute antes de que desaparezca el div
  setTimeout(() => { mostrarDropdown.value = false }, 200)
}

const abrirMenu = () => {
  mostrarDropdown.value = true
  emit('focus')
  fetchUbicaciones()
}

async function fetchUbicaciones() {
  destinoActivo.value = true
  mostrarDropdown.value = true
  loadingUbicaciones.value = true
  
  try {
    const res = await fetch(`${API_URL}/api/search/ubicaciones?q=${encodeURIComponent(busquedaDestino.value)}`)
    const data = await res.json()
    
    // IMPORTANTE: Mapeamos los datos para que coincidan con lo que el dropdown espera
    sugerencias.value = data.map(item => ({
      ...item,
      label: `${item.ubicacion}, ${item.ciudad}` // Creamos una prop amigable para mostrar
    }))
    busquedaRealizada.value = true
  } catch (err) {
    console.error("Error al buscar:", err)
    sugerencias.value = []
  } finally {
    loadingUbicaciones.value = false
  }
}

function seleccionarUbicacion(loc) {
  selectedUbicacion.value = loc
  // Usamos 'ubicacion' porque así viene en tu JSON del backend
  labelUbicacion.value = `${loc.ubicacion}, ${loc.ciudad}` 
  busquedaDestino.value = `${loc.ubicacion}, ${loc.ciudad}`
  
  destinoActivo.value = false
  mostrarDropdown.value = false
  emit('update:modelValue', busquedaDestino.value)
}

// Método expuesto para que el padre pueda cerrarlo desde fuera
defineExpose({ cerrar: () => mostrarDropdown.value = false })
</script>