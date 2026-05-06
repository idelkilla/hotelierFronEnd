<template>
  <div class="filtros-autos">
    <button class="filter-toggle" @click="drawerAbierto = !drawerAbierto">
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" 
        fill="none" stroke="#888" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>
      </svg>
      Filtros
      <span v-if="cantidadFiltros > 0" class="filtros-badge">{{ cantidadFiltros }}</span>
    </button>

    <!-- Overlay oscuro (mobile) -->
    <div v-if="drawerAbierto" class="filtros-overlay" @click="drawerAbierto = false"></div>

    <!-- Drawer / panel de filtros -->
    <div class="filtros-panel" :class="{ 'panel-abierto': drawerAbierto }">

      <!-- Header del drawer (solo visible en mobile) -->
      <div class="drawer-header">
        <div class="drawer-handle"></div>
        <div class="drawer-top-row">
          <span class="drawer-titulo">Filtros</span>
          <button class="drawer-cerrar" @click="drawerAbierto = false">✕</button>
        </div>
      </div>

      <!-- Contenido de filtros -->
      <div class="filtros-contenido">

        <div class="filter-card-box">
          <p class="filter-card-title">Busca por nombre</p>
          <div class="name-search-wrapper">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"
              fill="none" stroke="#888" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>
            </svg>
            <input type="text" v-model="searchByName" placeholder="" class="name-search-input" />
          </div>
        </div>

        <div class="filtro-card">
          <h3 class="filtro-titulo">Filtros más usados</h3>
          <label class="filtro-opcion"><input type="checkbox" v-model="filtros.cancelacion" /> Cancelación gratuita</label>
          <label class="filtro-opcion"><input type="checkbox" v-model="filtros.suv" /> Camioneta SUV</label>
          <label class="filtro-opcion"><input type="checkbox" v-model="filtros.seisPasajeros" /> 6 o más pasajeros</label>
        </div>

        <div class="filtro-card">
          <h3 class="filtro-titulo">Rango de precios</h3>
          <div class="precio-inputs">
            <div class="precio-field">
              <label class="precio-label">Mínimo</label>
              <div class="precio-input-wrapper">
                <span class="precio-signo">$</span>
                <input type="number" v-model="filtros.precioMin" min="0" placeholder="0" />
              </div>
            </div>
            <div class="precio-field">
              <label class="precio-label">Máximo</label>
              <div class="precio-input-wrapper">
                <span class="precio-signo">$</span>
                <input type="number" v-model="filtros.precioMax" min="0" placeholder="0" />
              </div>
            </div>
          </div>
        </div>

        <div class="filtro-card">
          <h3 class="filtro-titulo">Tipo de auto</h3>
          <label v-for="tipo in tiposAuto" :key="tipo" class="filtro-opcion">
            <input type="checkbox" v-model="filtros.tipos" :value="tipo" /> {{ tipo }}
          </label>
        </div>

        <div class="filtro-card">
          <h3 class="filtro-titulo">Capacidad</h3>
          <label class="filtro-opcion"><input type="radio" v-model="filtros.capacidad" value="2-5" /> 2–5 pasajeros</label>
          <label class="filtro-opcion"><input type="radio" v-model="filtros.capacidad" value="6+" /> 6 o más pasajeros</label>
        </div>

        <div class="filtro-card">
          <h3 class="filtro-titulo">Especificaciones</h3>
          <label class="filtro-opcion"><input type="checkbox" v-model="filtros.automatico" /> Automático</label>
          <label class="filtro-opcion"><input type="checkbox" v-model="filtros.kmIlimitado" /> Kilometraje ilimitado</label>
          <label class="filtro-opcion"><input type="checkbox" v-model="filtros.kmLimitado" /> Kilometraje limitado</label>
          <label class="filtro-opcion"><input type="checkbox" v-model="filtros.traccion4x4" /> Tracción total / 4x4</label>
        </div>

        <div class="filtro-card">
          <h3 class="filtro-titulo">Autos eléctricos</h3>
          <label class="filtro-opcion"><input type="checkbox" v-model="filtros.electrico" /> Eléctrico</label>
          <label class="filtro-opcion"><input type="checkbox" v-model="filtros.hibrido" /> Híbrido</label>
        </div>

      </div>

      <!-- Footer con botón aplicar (solo mobile) -->
      <div class="drawer-footer">
        <button class="btn-limpiar" @click="limpiarFiltros">Limpiar</button>
        <button class="btn-aplicar" @click="drawerAbierto = false">Aplicar filtros</button>
      </div>

    </div>
  </div>
</template>

<script setup>
import { reactive, ref, computed } from 'vue'

const emit = defineEmits(['update:filtros'])

const drawerAbierto = ref(false)
const searchByName = ref('')

const tiposAuto = [
  'Mini', 'Económico', 'Compacto', 'Mediano', 'Estándar',
  'Grande', 'Especial', 'Lujo', 'Convertible', 'Minivan',
  'Camioneta SUV', 'Van', 'Camioneta pickup', 'Auto deportivo', 'Otro'
]

const filtros = reactive({
  cancelacion: false,
  suv: false,
  seisPasajeros: false,
  tipos: [],
  capacidad: '',
  automatico: false,
  kmIlimitado: false,
  kmLimitado: false,
  traccion4x4: false,
  precioMin: 0,
  precioMax: 500,
  rating: '',
  electrico: false,
  hibrido: false,
})

const cantidadFiltros = computed(() => {
  let count = 0
  if (filtros.cancelacion) count++
  if (filtros.suv) count++
  if (filtros.seisPasajeros) count++
  if (filtros.automatico) count++
  if (filtros.kmIlimitado) count++
  if (filtros.kmLimitado) count++
  if (filtros.traccion4x4) count++
  if (filtros.electrico) count++
  if (filtros.hibrido) count++
  if (filtros.capacidad) count++
  count += filtros.tipos.length
  return count
})

function limpiarFiltros() {
  filtros.cancelacion = false
  filtros.suv = false
  filtros.seisPasajeros = false
  filtros.tipos = []
  filtros.capacidad = ''
  filtros.automatico = false
  filtros.kmIlimitado = false
  filtros.kmLimitado = false
  filtros.traccion4x4 = false
  filtros.precioMin = 0
  filtros.precioMax = 500
  filtros.electrico = false
  filtros.hibrido = false
  searchByName.value = ''
}
</script>

<style scoped>

/* ── PANEL / DRAWER ────────────────────────── */
.filtros-panel {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.filtros-toggle-btn  { display: none; }
.filtros-overlay     { display: none; }
.drawer-header       { display: none; }
.drawer-footer       { display: none; }

/* ── MOBILE: ≤ 768px ────────────────────────── */
@media (max-width: 768px) {

  /* Botón que abre el drawer */
  .filtros-toggle-btn {
    display: flex;
    align-items: center;
    gap: 8px;
    background: #113955;
    color: white;
    border: none;
    border-radius: 20px;
    padding: 9px 18px;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
  }

  .filtros-badge {
    background: white;
    color: #113955;
    border-radius: 10px;
    padding: 1px 7px;
    font-size: 12px;
    font-weight: 700;
  }

  /* Overlay oscuro */
  .filtros-overlay {
    display: block;
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.45);
    z-index: 100;
  }

  /* Panel como bottom sheet */
  .filtros-panel {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 101;
    background: #fff;
    border-radius: 16px 16px 0 0;
    max-height: 90vh;
    transform: translateY(100%);
    transition: transform 0.3s ease;
    gap: 0;
    box-shadow: 0 -4px 24px rgba(0, 0, 0, 0.12);
  }

  .filtros-panel.panel-abierto {
    transform: translateY(0);
  }

  /* Handle y header del drawer */
  .drawer-header {
    display: block;
    padding: 12px 16px 8px;
    position: sticky;
    top: 0;
    background: #fff;
    z-index: 1;
    border-bottom: 0.5px solid #e0e0e0;
  }

  .drawer-handle {
    width: 36px;
    height: 4px;
    background: #dadce0;
    border-radius: 2px;
    margin: 0 auto 10px;
  }

  .drawer-top-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .drawer-titulo {
    font-size: 16px;
    font-weight: 600;
    color: #113955;
  }

  .drawer-cerrar {
    background: none;
    border: none;
    font-size: 18px;
    color: #666;
    cursor: pointer;
    line-height: 1;
  }

  /* Área scrolleable de filtros */
  .filtros-contenido {
    overflow-y: auto;
    padding: 12px 16px;
    display: flex;
    flex-direction: column;
    gap: 10px;
    flex: 1;
  }

  /* Footer con botones */
  .drawer-footer {
    display: flex;
    gap: 10px;
    padding: 12px 16px;
    border-top: 0.5px solid #e0e0e0;
    background: #fff;
    position: sticky;
    bottom: 0;
  }

  .btn-limpiar {
    flex: 1;
    background: none;
    border: 1px solid #aab0bc;
    border-radius: 8px;
    padding: 10px;
    font-size: 14px;
    font-weight: 500;
    color: #333;
    cursor: pointer;
  }

  .btn-aplicar {
    flex: 2;
    background: #113955;
    border: none;
    border-radius: 8px;
    padding: 10px;
    font-size: 14px;
    font-weight: 500;
    color: white;
    cursor: pointer;
  }
}

/* ── TARJETAS DE FILTROS ────────────────────── */
.filtros-autos { display: flex; flex-direction: column; gap: 10px; }

.filtro-card {
  background: #fff;
  border: 0.5px solid #e0e0e0;
  border-radius: 12px;
  padding: 12px 15px;
  display: flex;
  flex-direction: column;
}

.filtro-titulo {
  font-size: 15px;
  font-weight: 600;
  color: #265073;
  margin-bottom: 8px;
}

.filtro-opcion {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 6px 0;
  font-size: 14px;
  color: #333;
  cursor: pointer;
}

.filtro-opcion input[type="checkbox"],
.filtro-opcion input[type="radio"] {
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

.filtro-opcion input[type="checkbox"]:checked,
.filtro-opcion input[type="radio"]:checked {
  border-color: #113955;
  background-color: white;
}

.filtro-opcion input[type="checkbox"]:checked::after,
.filtro-opcion input[type="radio"]:checked::after {
  content: '';
  position: absolute;
  width: 10px;
  height: 10px;
  background-color: #113955;
  border-radius: 50%;
}

.precio-inputs { display: flex; gap: 12px; }

.precio-field {
  flex: 1;
  border: 0.5px solid #dadce0;
  border-radius: 10px;
  padding: 8px 12px;
}

.precio-label {
  font-size: 11px;
  color: #888;
  display: block;
  margin-bottom: 2px;
}

.precio-input-wrapper { display: flex; align-items: center; gap: 2px; }

.precio-signo {
  font-size: 15px;
  font-weight: 500;
  color: #265073;
}

.precio-input-wrapper input {
  border: none;
  outline: none;
  font-size: 15px;
  font-weight: 500;
  color: #265073;
  width: 100%;
  background: transparent;
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