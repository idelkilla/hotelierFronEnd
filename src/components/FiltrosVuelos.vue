<template>
  <div>

    <!-- BOTÓN FILTROS — solo visible en móvil -->
    <button class="btn-filtros-mobile" @click="drawerAbierto = true">
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"
        fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <line x1="4" y1="6" x2="20" y2="6"/>
        <line x1="8" y1="12" x2="20" y2="12"/>
        <line x1="12" y1="18" x2="20" y2="18"/>
      </svg>
      Filtros
      <span v-if="totalFiltrosActivos > 0" class="filtros-badge">{{ totalFiltrosActivos }}</span>
    </button>

    <!-- OVERLAY + DRAWER (móvil) -->
    <Teleport to="body">
      <Transition name="overlay-fade">
        <div v-if="drawerAbierto" class="drawer-overlay" @click="drawerAbierto = false" />
      </Transition>
      <Transition name="drawer-slide">
        <div v-if="drawerAbierto" class="drawer-panel">

          <div class="drawer-handle"></div>

          <div class="drawer-header">
            <span class="drawer-titulo">Filtros</span>
            <button class="drawer-close" @click="drawerAbierto = false">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
          </div>

          <div class="drawer-scroll">
            <div class="filter-card-box">
              <p class="filter-card-title">Busca por nombre</p>
              <div class="name-search-wrapper">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"
                  fill="none" stroke="#888" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>
                </svg>
                <input type="text" v-model="searchByName" placeholder="ej., Marriott" class="name-search-input" />
              </div>
            </div>

            <div class="filtro-card">
              <p class="filtro-titulo">Escalas</p>
              <div v-for="escala in escalas" :key="escala.valor" class="filtro-opcion">
                <input type="checkbox" v-model="escala.seleccionada" />
                <span class="filtro-label">{{ escala.label }}</span>
              </div>
            </div>

            <div class="filtro-card">
              <p class="filtro-titulo">Tipo de aerolínea</p>
              <div v-for="aerolinea in aerolineas" :key="aerolinea.nombre" class="filtro-opcion">
                <input type="checkbox" v-model="aerolinea.seleccionada" />
                <span class="filtro-label">{{ aerolinea.nombre }} ({{ aerolinea.vuelos }})</span>
                <span class="filtro-precio">${{ aerolinea.precio.toLocaleString() }}</span>
              </div>
            </div>

            <div class="filtro-card">
              <p class="filtro-titulo">Tiempo total de viaje</p>
              <span class="slider-val">
                {{ tiempoMaximo === 35 ? 'Menos de 35 h' : `Menos de ${tiempoMaximo} h` }}
              </span>
              <input type="range" min="1" max="35" v-model.number="tiempoMaximo" />
            </div>

            <div class="filtro-card">
              <p class="filtro-titulo">Clase preferida</p>
              <div v-for="clase in clases" :key="clase.valor" class="clase-opcion">
                <input type="radio" name="clase-drawer" :value="clase.valor" v-model="claseSeleccionada" />
                <div>
                  <div class="clase-nombre">{{ clase.label }}</div>
                  <div v-if="clase.nota" class="clase-desc">{{ clase.nota }}</div>
                </div>
              </div>
            </div>
          </div>

          <div class="drawer-footer">
            <button class="btn-limpiar" @click="limpiarFiltros">Limpiar todo</button>
            <button class="btn-aplicar" @click="drawerAbierto = false">Ver resultados</button>
          </div>

        </div>
      </Transition>
    </Teleport>

    <!-- SIDEBAR DESKTOP (igual que el original) -->
    <div class="filtros-sidebar">

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
            placeholder="ej., Marriott"
            class="name-search-input"
          />
        </div> 
      </div>

      <div class="filtro-card">
        <p class="filtro-titulo">Escalas</p>
        <div v-for="escala in escalas" :key="escala.valor" class="filtro-opcion">
          <input type="checkbox" v-model="escala.seleccionada" />
          <span class="filtro-label">{{ escala.label }}</span>
        </div>
      </div>

      <div class="filtro-card">
        <p class="filtro-titulo">Tipo de aerolínea</p>
        <div v-for="aerolinea in aerolineas" :key="aerolinea.nombre" class="filtro-opcion">
          <input type="checkbox" v-model="aerolinea.seleccionada" />
          <span class="filtro-label">{{ aerolinea.nombre }} ({{ aerolinea.vuelos }})</span>
          <span class="filtro-precio">${{ aerolinea.precio.toLocaleString() }}</span>
        </div>
      </div>

      <div class="filtro-card">
        <p class="filtro-titulo">Tiempo total de viaje</p>
        <span class="slider-val">
          {{ tiempoMaximo === 35 ? 'Menos de 35 h' : `Menos de ${tiempoMaximo} h` }}
        </span>
        <input type="range" min="1" max="35" v-model.number="tiempoMaximo" />
      </div>

      <div class="filtro-card">
        <p class="filtro-titulo">Clase preferida</p>
        <div v-for="clase in clases" :key="clase.valor" class="clase-opcion">
          <input type="radio" name="clase-sidebar" :value="clase.valor" v-model="claseSeleccionada" />
          <div>
            <div class="clase-nombre">{{ clase.label }}</div>
            <div v-if="clase.nota" class="clase-desc">{{ clase.nota }}</div>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';

const emit = defineEmits(['filtros-cambiados']);

const drawerAbierto = ref(false);
const searchByName  = ref('');

const aerolineas = ref([
  { nombre: 'JetBlue Airways',     vuelos: 20, precio: 1528,  seleccionada: false },
  { nombre: 'LOT-Polish Airlines', vuelos: 10, precio: 2205,  seleccionada: false },
  { nombre: 'Turkish Airlines',    vuelos: 10, precio: 1528,  seleccionada: false },
  { nombre: 'American Airlines',   vuelos: 3,  precio: 3859,  seleccionada: false },
  { nombre: 'Lufthansa',           vuelos: 3,  precio: 13447, seleccionada: false },
  { nombre: 'Delta',               vuelos: 2,  precio: 4686,  seleccionada: false },
]);

const escalas = ref([
  { label: '1 escala',        valor: '1',  seleccionada: false },
  { label: '2 escalas o más', valor: '2+', seleccionada: false },
]);

const clases = ref([
  { label: 'Económica básica',  valor: 'basica',    nota: 'Es posible que las tarifas no incluyan asientos ni equipaje' },
  { label: 'Económica',         valor: 'economica', nota: null },
  { label: 'Económica Premium', valor: 'premium',   nota: null },
  { label: 'Ejecutiva',         valor: 'ejecutiva', nota: null },
]);

const claseSeleccionada = ref('basica');
const tiempoMaximo = ref(35);

const totalFiltrosActivos = computed(() => {
  return aerolineas.value.filter(x => x.seleccionada).length
    + escalas.value.filter(x => x.seleccionada).length
    + (tiempoMaximo.value < 35 ? 1 : 0)
    + (claseSeleccionada.value !== 'basica' ? 1 : 0)
    + (searchByName.value.trim() ? 1 : 0);
});

const limpiarFiltros = () => {
  aerolineas.value.forEach(a => a.seleccionada = false);
  escalas.value.forEach(e => e.seleccionada = false);
  claseSeleccionada.value = 'basica';
  tiempoMaximo.value = 35;
  searchByName.value = '';
};

// Emite los filtros al padre cada vez que cambian
watch(
  [aerolineas, escalas, claseSeleccionada, tiempoMaximo, searchByName],
  () => {
    emit('filtros-cambiados', {
      searchByName:      searchByName.value,
      aerolineas:        aerolineas.value.filter(a => a.seleccionada).map(a => a.nombre),
      escalas:           escalas.value.filter(e => e.seleccionada).map(e => e.valor),
      clase:             claseSeleccionada.value,
      tiempoMaximoHoras: tiempoMaximo.value,
    });
  },
  { deep: true }
);
</script>

<style scoped>
/* ═══════════════════════════════════
   BOTÓN FILTROS — solo móvil
═══════════════════════════════════ */
.btn-filtros-mobile {
  display: none;
}

@media (max-width: 768px) {
  .btn-filtros-mobile {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    background: #fff;
    border: 1.5px solid #d1d5db;
    border-radius: 20px;
    padding: 9px 18px;
    font-size: 14px;
    font-weight: 600;
    color: #113955;
    cursor: pointer;
    box-shadow: 0 1px 4px rgba(0,0,0,0.08);
    transition: border-color 0.2s;
  }
  .btn-filtros-mobile:hover { border-color: #113955; }
}

.filtros-badge {
  background: #113955;
  color: #fff;
  font-size: 11px;
  font-weight: 700;
  border-radius: 50%;
  width: 18px; height: 18px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

/* ═══════════════════════════════════
   OVERLAY
═══════════════════════════════════ */
.drawer-overlay {
  position: fixed;
  inset: 0;
  background: rgba(5, 15, 30, 0.55);
  z-index: 9998;
  backdrop-filter: blur(2px);
}
.overlay-fade-enter-active, .overlay-fade-leave-active { transition: opacity 0.25s ease; }
.overlay-fade-enter-from,   .overlay-fade-leave-to     { opacity: 0; }

/* ═══════════════════════════════════
   DRAWER
═══════════════════════════════════ */
.drawer-panel {
  position: fixed;
  bottom: 0; left: 0; right: 0;
  z-index: 9999;
  background: #fff;
  border-radius: 20px 20px 0 0;
  max-height: 88vh;
  display: flex;
  flex-direction: column;
  box-shadow: 0 -8px 40px rgba(0,0,0,0.18);
}

.drawer-slide-enter-active, .drawer-slide-leave-active {
  transition: transform 0.32s cubic-bezier(0.32, 1, 0.56, 1);
}
.drawer-slide-enter-from, .drawer-slide-leave-to { transform: translateY(100%); }

.drawer-handle {
  width: 36px; height: 4px;
  background: #d1d5db;
  border-radius: 4px;
  margin: 12px auto 0;
  flex-shrink: 0;
}

.drawer-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 20px;
  border-bottom: 1px solid #f1f5f9;
  flex-shrink: 0;
}

.drawer-titulo {
  font-size: 16px;
  font-weight: 700;
  color: #113955;
}

.drawer-close {
  width: 32px; height: 32px;
  border-radius: 50%;
  border: 1.5px solid #e2e8f0;
  background: none;
  cursor: pointer;
  display: flex; align-items: center; justify-content: center;
  color: #374151;
  transition: background 0.15s;
}
.drawer-close:hover { background: #f1f5f9; }

.drawer-scroll {
  flex: 1;
  overflow-y: auto;
  padding: 16px 20px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  scrollbar-width: thin;
  scrollbar-color: #cbd5e1 transparent;
}

.drawer-footer {
  display: flex;
  gap: 10px;
  padding: 14px 20px 32px;
  border-top: 1px solid #f1f5f9;
  flex-shrink: 0;
}

.btn-limpiar {
  flex: 1;
  border: 1.5px solid #e2e8f0;
  background: none;
  border-radius: 12px;
  padding: 12px;
  font-size: 14px; font-weight: 600;
  color: #6b7280;
  cursor: pointer;
  transition: border-color 0.2s;
}
.btn-limpiar:hover { border-color: #113955; color: #113955; }

.btn-aplicar {
  flex: 2;
  background: #113955;
  color: #fff;
  border: none;
  border-radius: 12px;
  padding: 12px;
  font-size: 14px; font-weight: 700;
  cursor: pointer;
  transition: background 0.2s;
}
.btn-aplicar:hover { background: #0c2a40; }

/* ═══════════════════════════════════
   SIDEBAR DESKTOP
═══════════════════════════════════ */
.filtros-sidebar {
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 280px;
  flex-shrink: 0;
  position: sticky;
  top: 110px;
  margin-top: 160px;
}

@media (max-width: 768px) {
  .filtros-sidebar { display: none; }
}

/* ═══════════════════════════════════
   ESTILOS ORIGINALES (sin cambios)
═══════════════════════════════════ */
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

input[type="range"] {
  width: 100%;
  accent-color: #113955;
}

.filter-card-box {
  background: #ffffff;
  border: 1px solid #d1d5db;
  border-radius: 12px;
  padding: 18px 20px;
}

.filter-card-title {
  font-size: 15px;
  font-weight: bold;
  color: #113955;
  margin: 0 0 14px 0;
}

.name-search-wrapper {
  display: flex;
  align-items: center;
  gap: 10px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  padding: 8px 12px;
  background: white;
}

.name-search-input {
  border: none;
  outline: none;
  width: 100%;
  font-size: 14px;
  color: #333;
}
</style>