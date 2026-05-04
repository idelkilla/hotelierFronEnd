<template>
  <div class="dynamic-field-wrapper" id="destination-wrapper" style="position: relative; flex: 2.5;">
    <div class="field-group border-style">
      <label>¿A dónde quieres ir?</label>
      <div class="input-with-icon">
        <span class="material-symbols-outlined custom-icon">location_on</span>
        <input 
          type="text" 
          :value="destinoActivo ? busquedaDestino : labelUbicacion" 
          @input="e => { busquedaDestino = e.target.value }" 
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
          {{ getIcon(loc) }}
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
import { ref, watch } from 'vue';

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
const debounceTimer = ref(null)

watch(() => props.modelValue, (newVal) => {
  if (!destinoActivo.value) {
    busquedaDestino.value = newVal || ''
  }
})

watch(busquedaDestino, (newVal) => {
  clearTimeout(debounceTimer.value)
  
  if (!newVal.trim()) {
    sugerencias.value = []
    busquedaRealizada.value = false
    loadingUbicaciones.value = false
    return
  }

  loadingUbicaciones.value = true
  debounceTimer.value = setTimeout(() => {
    fetchUbicaciones()
  }, 300)
})

const cerrarConRetraso = () => {
  setTimeout(() => { mostrarDropdown.value = false }, 200)
}

const abrirMenu = () => {
  mostrarDropdown.value = true
  emit('focus')
  if (busquedaDestino.value.trim()) fetchUbicaciones()
}

async function fetchUbicaciones() {
  try {
    const query = encodeURIComponent(busquedaDestino.value.trim())
    const res = await fetch(`${API_URL}/api/search/ubicaciones?q=${query}`)
    
    if (!res.ok) throw new Error(`Error HTTP ${res.status}`)
    
    const data = await res.json()
    sugerencias.value = data.map(item => ({
      ...item,
      label: [item.ubicacion, item.ciudad, item.pais]
        .filter(part => part && part.trim())
        .join(', ')
    }))
    busquedaRealizada.value = true
  } catch (err) {
    console.error("Error:", err)
    sugerencias.value = []
  } finally {
    loadingUbicaciones.value = false
  }
}

function getIcon(loc) {
  if (loc.icono) return loc.icono
  const nombre = (loc.ubicacion || '').toLowerCase()
  return nombre.includes('aeropuerto') ? 'local_airport' : 'location_on'
}

function seleccionarUbicacion(loc) {
  selectedUbicacion.value = loc
  labelUbicacion.value = `${loc.ubicacion}, ${loc.ciudad}`
  busquedaDestino.value = `${loc.ubicacion}, ${loc.ciudad}`
  destinoActivo.value = false
  mostrarDropdown.value = false
  emit('update:modelValue', busquedaDestino.value)
}

defineExpose({ cerrar: () => mostrarDropdown.value = false })
</script>
