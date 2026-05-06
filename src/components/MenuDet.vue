<template>
  <div class="search-section-container">
    <div class="search-bar-content">
      <FormSearch
        :initial-destino="searchDestino"
        :initial-entrada="searchEntrada"
        :initial-salida="searchSalida"
        :initial-huespedes="habitaciones"
        compact
        :is-habitaciones="isHabitaciones"
      />

      <!-- Barra ver propiedades — solo en detalle -->
      <div v-if="isDetalle && !isHabitaciones" class="detalle-subbar">
        <button class="btn-volver" @click="$router.back()">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M19 12H5"/><path d="M12 19l-7-7 7-7"/>
          </svg>
          Ver todas las propiedades
        </button>

        <div class="detalle-actions">
          <button class="btn-accion">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/>
              <polyline points="16 6 12 2 8 6"/><line x1="12" y1="2" x2="12" y2="15"/>
            </svg>
            Compartir
          </button>
          <button class="btn-accion" :class="{ guardado: isSaved }" @click="toggleGuardar">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24"
              :fill="isSaved ? '#e00' : 'none'" stroke="currentColor" stroke-width="2"
              stroke-linecap="round" stroke-linejoin="round">
              <path d="M19.5 12.572l-7.5 7.428l-7.5 -7.428a5 5 0 1 1 7.5 -6.566a5 5 0 1 1 7.5 6.572"/>
            </svg>
            {{ isSaved ? 'Guardado' : 'Guardar' }}
          </button>
        </div>
      </div>

      <!-- Tabs — solo en resultados -->
      <div v-if="!isDetalle && !isHabitaciones" class="accommodation-tabs">
        <div class="slider-background" :class="sliderClass"></div>

        <button class="tab" :class="{ active: activeTab === 'all' }" @click="activeTab = 'all'">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
            <path d="M7 9m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0"/>
            <path d="M22 17v-3h-20"/><path d="M2 8v9"/>
            <path d="M12 14h10v-2a3 3 0 0 0 -3 -3h-7v5z"/>
          </svg>
          Todos los hospedajes
        </button>

        <button class="tab" :class="{ active: activeTab === 'Hotel' }" @click="activeTab = 'Hotel'">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
            <path d="M3 21l18 0"/><path d="M9 8l1 0"/><path d="M9 12l1 0"/>
            <path d="M9 16l1 0"/><path d="M14 8l1 0"/><path d="M14 12l1 0"/>
            <path d="M14 16l1 0"/><path d="M5 21v-16a2 2 0 0 1 2 -2h10a2 2 0 0 1 2 2v16"/>
          </svg>
          Hoteles
        </button>

        <button class="tab" :class="{ active: activeTab === 'Casa' }" @click="activeTab = 'Casa'">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
            <path d="M5 12l-2 0l9 -9l9 9l-2 0"/>
            <path d="M5 12v7a2 2 0 0 0 2 2h10a2 2 0 0 0 2 -2v-7"/>
            <path d="M9 21v-6a2 2 0 0 1 2 -2h2a2 2 0 0 1 2 2v6"/>
          </svg>
          Casa
        </button>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import FormSearch from './FormSearch.vue';
import { apiFetch } from '../services/api';

const props = defineProps({
  isDetalle: { type: Boolean, default: false },
  isHabitaciones: { type: Boolean, default: false }
});

const route = useRoute();
const isSaved = ref(false);

const searchDestino = ref(route.query.destino || '');
const searchEntrada = ref(route.query.entrada || '');
const searchSalida  = ref(route.query.salida  || '');
const habitaciones  = ref(
  route.query.huespedes
    ? JSON.parse(route.query.huespedes)
    : [{ adultos: 2, ninos: 0, edadesNinos: [] }]
);
const activeTab = ref('all');

watch(() => route.query, (q) => {
  searchDestino.value = q.destino || '';
  searchEntrada.value = q.entrada || '';
  searchSalida.value  = q.salida  || '';
  if (q.huespedes) habitaciones.value = JSON.parse(q.huespedes);
}, { deep: true });

const sliderClass = computed(() => `pos-${activeTab.value}`);

// ── Favoritos ─────────────────────────────────────────────────
// Verifica si el hospedaje actual ya está en favoritos al cargar
onMounted(async () => {
  if (!props.isDetalle) return
  const id = route.params.id
  if (!id) return
  try {
    const res = await apiFetch(`/favoritos/check/${id}`)
    isSaved.value = res.esFavorito
  } catch { /* sin sesión, queda en false */ }
})

// También re-verifica si el usuario navega a otro detalle sin recargar
watch(() => route.params.id, async (id) => {
  if (!props.isDetalle || !id) return
  try {
    const res = await apiFetch(`/favoritos/check/${id}`)
    isSaved.value = res.esFavorito
  } catch { isSaved.value = false }
})

async function toggleGuardar() {
  const id = route.params.id
  if (!id) return
  
  // Verificamos si hay token antes de intentar guardar
  if (!localStorage.getItem('user_token')) {
    alert('Debes iniciar sesión para guardar favoritos')
    return
  }

  try {
    if (isSaved.value) {
      // Si ya está guardado, lo eliminamos
      await apiFetch(`/favoritos/${id}`, { method: 'DELETE' })
      isSaved.value = false
    } else {
      // Si no está guardado, lo agregamos
      await apiFetch(`/favoritos/${id}`, { method: 'POST' })
      isSaved.value = true
    }
  } catch (e) {
    console.error('Error al actualizar favorito:', e.message)
    alert('Hubo un problema al actualizar tus favoritos. Intenta de nuevo.')
  }
}
</script>

<style scoped>
.search-section-container {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0;
  box-sizing: border-box;
}

.search-bar-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: transparent;
  padding: 0;
  box-shadow: none;
}

/* =====================
   BARRA DETALLE
   ===================== */
.detalle-subbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 25px;
  padding: 0 0 4px 0;
  width: 100%;
}

.btn-volver {
  display: flex;
  align-items: center;
  gap: 6px;
  background: none;
  border: none;
  cursor: pointer;
  font-size: 14px;
  font-weight: 600;
  color: #113955;
  padding: 6px 8px;
  border-radius: 8px;
  transition: background 0.15s;
}

.btn-volver:hover {
  background: #f0f0f0;
  text-decoration: underline;
}

.detalle-actions {
  display: flex;
  gap: 8px;
}

.btn-accion {
  display: flex;
  align-items: center;
  gap: 6px;
  background: none;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 7px 14px;
  font-size: 14px;
  font-weight: 500;
  color: #333;
  cursor: pointer;
  transition: background 0.15s, border-color 0.15s;
}

.btn-accion:hover {
  background: #f5f5f5;
  border-color: #bbb;
}

.btn-accion.guardado {
  color: #e00;
  border-color: #e00;
}

/* =====================
   TABS
   ===================== */
.accommodation-tabs {
  background-color: #e9f1f6;
  border-radius: 500px;
  display: flex;
  position: relative;
  padding: 6px;
  margin: 32px auto 0 auto;
  width: 100%;
  align-items: center;
}

.tab {
  flex: 1;
  border: none;
  background: none;
  padding: 12px 20px;
  cursor: pointer;
  font-size: 15px;
  color: #113955;
  display: flex;
  z-index: 1;
  outline: none;
  align-items: center;
  justify-content: center;
  gap: 10px;
  border-radius: 40px;
  transition: background 0.2s;
}

.tab.active {
  background-color: #cbd9e6;
  color: #113955;
  font-weight: 700;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.tab:focus, .tab:active { outline: none; }
</style>