<template>
  <div class="dynamic-field-wrapper" id="destination-wrapper" style="position: relative; flex: 2.5;">
    <div class="field-group border-style">
      <label>¿A dónde quieres ir?</label>
      <div class="input-with-icon">
        <span class="material-symbols-outlined custom-icon">location_on</span>
        <input 
          type="text" 
          :value="modelValue" 
          @input="onInput"
          @focus="abrirMenu"
          @blur="cerrarConRetraso"
          placeholder="Destino" 
          autocomplete="off"
        >
      </div>
    </div>

    <div v-if="mostrarDropdown" class="location-dropdown">
      <div v-if="loading" class="location-item">
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
          <span class="loc-name">{{ loc.ubicacion }}</span>
          <span class="loc-details">{{ loc.ciudad }}, {{ loc.pais }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps(['modelValue'])
const emit = defineEmits(['update:modelValue', 'focus'])

const API_URL = import.meta.env.VITE_API_URL || 'https://hotelierbackend-1.onrender.com'
const sugerencias = ref([])
const mostrarDropdown = ref(false)
const loading = ref(false)
const busquedaRealizada = ref(false)

// Añade un timeout para evitar llamadas excesivas (Debounce)
let timeout = null

const onInput = (e) => {
  const value = e.target.value
  emit('update:modelValue', value)
  clearTimeout(timeout)
  timeout = setTimeout(() => {
    fetchUbicaciones(value)
  }, 300) // Espera 300ms después de que el usuario deje de escribir
}

const cerrarConRetraso = () => {
  // El retraso permite que el evento @mousedown de la sugerencia se ejecute antes de que desaparezca el div
  setTimeout(() => { mostrarDropdown.value = false }, 200)
}

const abrirMenu = () => {
  mostrarDropdown.value = true
  emit('focus')
  if (props.modelValue) fetchUbicaciones(props.modelValue)
}

async function fetchUbicaciones(query) {
  if (!query) {
    sugerencias.value = []
    return
  }
  busquedaRealizada.value = true
  loading.value = true
  try {
    console.log(`📡 Llamando a: ${API_URL}/api/search/ubicaciones?q=${query}`)
    const res = await fetch(`${API_URL}/api/search/ubicaciones?q=${encodeURIComponent(query)}`)
    if (!res.ok) throw new Error(`HTTP Error: ${res.status}`)
    const data = await res.json()
    sugerencias.value = data
  } catch (error) {
    // Si ves este error en la consola, el problema es la conexión con Render o CORS
    console.error("🚨 Error de conexión o CORS en la búsqueda:", error.message)
    sugerencias.value = []
  } finally {
    loading.value = false
  }
}

function seleccionarUbicacion(loc) {
  const fullText = `${loc.ubicacion}, ${loc.ciudad}, ${loc.pais}`
  emit('update:modelValue', fullText)
  mostrarDropdown.value = false
}

// Método expuesto para que el padre pueda cerrarlo desde fuera
defineExpose({ cerrar: () => mostrarDropdown.value = false })
</script>