<template>
  <div class="filtros-sidebar">
    <!-- Busca por nombre -->
    <div class="filter-card-box">
    <p class="filter-card-title">Busca por nombre</p>
    <div class="name-search-wrapper">
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" 
        fill="none" stroke="#888" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>
      </svg>
      <input
        type="text"
        v-model="searchByName"
        placeholder="ej., Aerolínea"
        class="name-search-input"
      />
    </div> 
  </div>

    <!-- Skeleton mientras carga -->
    <template v-if="cargando">
      <div v-for="i in 4" :key="i" class="filtro-card skeleton-card">
        <div class="sk-title"></div>
        <div class="sk-line" v-for="j in 3" :key="j"></div>
      </div>
    </template>

    <!-- Error -->
    <div v-else-if="errorMsg" class="filtro-card error-card">
      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24"
        fill="none" stroke="currentColor" stroke-width="2">
        <circle cx="12" cy="12" r="10"/>
        <line x1="12" y1="8" x2="12" y2="12"/>
        <line x1="12" y1="16" x2="12.01" y2="16"/>
      </svg>
      <span>{{ errorMsg }}</span>
      <button class="retry-btn" @click="cargarFiltros">Reintentar</button>
    </div>

    <!-- Filtros cargados -->
    <template v-else>
       <!-- Escalas -->
      <div class="filtro-card">
        <p class="filtro-titulo">Escalas</p>
        <div v-for="escala in escalas" :key="escala.valor" class="filtro-opcion">
          <input type="checkbox" v-model="escala.seleccionada" :id="`escala-${escala.valor}`" />
          <label :for="`escala-${escala.valor}`" class="filtro-label">
            {{ escala.label }}
            <span class="filtro-conteo" v-if="escala.conteo !== undefined"> ({{ escala.conteo }})</span>
          </label>
        </div>
      </div>

       <!-- Aerolíneas (dinámicas desde DB) -->
      <div class="filtro-card">
        <p class="filtro-titulo">Tipo de aerolínea</p>
        <p v-if="!aerolineas.length" class="sin-datos">Sin aerolíneas disponibles</p>
        <div v-for="a in aerolineas" :key="a.id" class="filtro-opcion">
          <input type="checkbox" v-model="a.seleccionada" :id="`aero-${a.id}`" />
          <label :for="`aero-${a.id}`" class="filtro-label">
            {{ a.nombre }} <span class="filtro-conteo">({{ a.vuelos }})</span>
          </label>
          <span class="filtro-precio">${{ a.precio.toLocaleString() }}</span>
        </div>
      </div>

       <!-- Tiempo de viaje (rango real desde DB) -->
      <div class="filtro-card">
        <p class="filtro-titulo">Tiempo total de viaje</p>
        <span class="slider-val">
          {{ tiempoMaximo >= duracion.maxHoras
            ? `Hasta ${duracion.maxHoras} h`
            : `Menos de ${tiempoMaximo} h` }}
        </span>
        <input
          type="range"
          :min="duracion.minHoras"
          :max="duracion.maxHoras"
          v-model.number="tiempoMaximo"
        />
        <div class="slider-limits">
          <span>{{ duracion.minHoras }} h</span>
          <span>{{ duracion.maxHoras }} h</span>
        </div>
      </div>

       <!-- Clase preferida (dinámica desde CLASE_CABINA) -->
      <div class="filtro-card">
        <p class="filtro-titulo">Clase preferida</p>
        <div v-for="clase in clases" :key="clase.id" class="clase-opcion">
          <input type="radio" name="clase" :value="clase.id"
            v-model="claseSeleccionada" :id="`clase-${clase.id}`" />
          <label :for="`clase-${clase.id}`">
            <div class="clase-nombre">{{ clase.label }}</div>
          </label>
        </div>
      </div>
     </template>
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'

// ── Props opcionales: origen y destino para filtrar resultados ─────────────
const props = defineProps({
  idOrigen:  { type: [Number, String], default: null },
  idDestino: { type: [Number, String], default: null },
})

const emit = defineEmits(['filtros-cambiados'])

// Toma la URL del .env de Vite  →  VITE_API_URL=http://localhost:10000/api
const API_BASE = import.meta.env.VITE_API_URL ?? 'http://localhost:10000/api'

// ── Estado reactivo ────────────────────────────────────────────────────────
const cargando          = ref(true)
const errorMsg          = ref(null)
const searchByName      = ref('')
const aerolineas        = ref([])
const clases            = ref([])
const claseSeleccionada = ref(null)
const tiempoMaximo      = ref(35)
const duracion          = ref({ minHoras: 1, maxHoras: 35 })

const escalas = ref([
  { label: 'Directo',         valor: '0',  seleccionada: false, conteo: undefined },
  { label: '1 escala',        valor: '1',  seleccionada: false, conteo: undefined },
  { label: '2 escalas o más', valor: '2+', seleccionada: false, conteo: undefined },
])

// ── Carga filtros desde /api/filtros/vuelos ────────────────────────────────
async function cargarFiltros() {
  cargando.value = true
  errorMsg.value = null

  try {
    const params = new URLSearchParams()
    if (props.idOrigen)  params.set('id_origen',  props.idOrigen)
    if (props.idDestino) params.set('id_destino', props.idDestino)

    const res = await fetch(`${API_BASE}/search/filtros/vuelos?${params}`, {
      credentials: 'include',          // envía cookies si usas auth
    })
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    const text = await res.text();
    const data = JSON.parse(text);

    aerolineas.value = (data.aerolineas ?? []).map(a => ({ ...a, seleccionada: false }))

    clases.value = data.clases ?? []
    if (clases.value.length && !claseSeleccionada.value) {
      claseSeleccionada.value = clases.value[0].id
    }

    duracion.value     = data.duracion ?? { minHoras: 1, maxHoras: 35 }
    tiempoMaximo.value = duracion.value.maxHoras

    escalas.value[0].conteo = data.escalas?.directo    ?? 0
    escalas.value[1].conteo = data.escalas?.una_escala ?? 0
    escalas.value[2].conteo = data.escalas?.dos_o_mas  ?? 0

  } catch (e) {
    console.error('[FiltrosSidebar]', e)
    errorMsg.value = 'No se pudieron cargar los filtros.'
  } finally {
    cargando.value = false
  }
}

onMounted(cargarFiltros)
watch(() => [props.idOrigen, props.idDestino], cargarFiltros)

// ── Emite los filtros activos al componente padre ──────────────────────────
watch(
  [searchByName, aerolineas, escalas, claseSeleccionada, tiempoMaximo],
  () => {
    emit('filtros-cambiados', {
      nombre:            searchByName.value,
      aerolineas:        aerolineas.value.filter(a => a.seleccionada).map(a => a.id),
      escalas:           escalas.value.filter(e => e.seleccionada).map(e => e.valor),
      claseId:           claseSeleccionada.value,
      tiempoMaximoHoras: tiempoMaximo.value,
    })
  },
  { deep: true }
)
</script>

<style scoped>
.filtros-sidebar {
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 280px;
  
  flex-shrink: 0;
  position: sticky;
  top: 110px; /* queda fijo bajo el header al hacer scroll */
  margin-top: 160px; /* Baja la posición inicial de los filtros */
}

.filtro-card {
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 16px;
}

.filtro-titulo {
  font-size: 14px;
  font-weight: 600;
  color: #113955;
  margin: 0 0 12px;
}

.filtro-opcion {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 6px 0;
  cursor: pointer;
}

.filtro-opcion input[type="checkbox"] {
  appearance: none;
  -webkit-appearance: none;
  width: 18px;
  height: 18px;
  border: 1.5px solid #aab0bc;
  border-radius: 50%;
  cursor: pointer;
  background: white;
  flex-shrink: 0;
  position: relative;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
}

.filtro-opcion input[type="checkbox"]:checked {
  border-color: #113955;
  background-color: white;
}

.filtro-opcion input[type="checkbox"]:checked::after {
  content: '';
  width: 10px;
  height: 10px;
  background-color: #113955;
  border-radius: 50%;
}

.filtro-label {
  font-size: 13px;
  color: #1a1a1a;
  flex: 1;
}

.filtro-precio {
  font-size: 12px;
  color: #6b7280;
}

.clase-opcion {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  padding: 8px 0;
  border-bottom: 1px solid #f1f5f9;
  cursor: pointer;
}

.clase-opcion:last-child {
  border-bottom: none;
}

.clase-opcion input[type="radio"] {
  appearance: none;
  -webkit-appearance: none;
  width: 18px;
  height: 18px;
  border: 1.5px solid #aab0bc;
  border-radius: 50%;
  cursor: pointer;
  background: white;
  position: relative;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 2px;
  flex-shrink: 0;
}

.clase-opcion input[type="radio"]:checked {
  border-color: #113955;
}

.clase-opcion input[type="radio"]:checked::after {
  content: '';
  width: 10px;
  height: 10px;
  background-color: #113955;
  border-radius: 50%;
}

.clase-nombre {
  font-size: 13px;
  font-weight: 500;
  color: #113955;
}

.clase-desc {
  font-size: 11px;
  color: #6b7280;
  line-height: 1.4;
  margin-top: 2px;
}

.slider-val {
  font-size: 13px;
  font-weight: 500;
  color: #113955;
  display: block;
  margin-bottom: 8px;
}
input[type="range"]  { width: 100%; accent-color: #113955; }
.slider-limits {
  display: flex;
  justify-content: space-between;
  font-size: 11px;
  color: #9ca3af;
  margin-top: 4px;
}

/* Skeleton */
.skeleton-card { pointer-events: none; }
.sk-title, .sk-line {
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: shimmer 1.4s infinite;
  border-radius: 6px;
  margin-bottom: 10px;
}
.sk-title { height: 14px; width: 60%; }
.sk-line  { height: 12px; width: 100%; }
@keyframes shimmer {
  0%   { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}

/* Error */
.error-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  color: #b91c1c;
  font-size: 13px;
  text-align: center;
}
.retry-btn {
  padding: 6px 14px;
  font-size: 12px;
  border: 1px solid #b91c1c;
  background: white;
  color: #b91c1c;
  border-radius: 8px;
  cursor: pointer;
}
.retry-btn:hover { background: #fef2f2; }
.sin-datos { font-size: 12px; color: #9ca3af; }
</style>