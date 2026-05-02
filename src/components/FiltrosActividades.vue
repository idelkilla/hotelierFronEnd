<!-- components/FiltrosActividades.vue -->
<template>
  <aside class="filtros-panel">

    <!-- Búsqueda -->
    <div class="filtro-card">
      <h3>Busca una actividad</h3>
      <div class="search-box">
        <svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
          <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
        </svg>
        <input v-model="filtros.busqueda" type="text" placeholder="Buscar por palabra clave" />
      </div>
    </div>

    <!-- Puntuación -->
    <div class="filtro-card">
      <h3>Puntuación de los viajeros</h3>
      <label v-for="op in puntuaciones" :key="op.value" class="radio-option">
        <input type="radio" name="puntuacion" v-model="filtros.puntuacion" :value="op.value"/>
        <div class="radio-custom"></div>
        <span>{{ op.label }}</span>
      </label>
    </div>

    <!-- Presupuesto -->
    <div class="filtro-card">
      <h3>Presupuesto</h3>
      <label v-for="op in presupuestos" :key="op.value" class="check-option">
        <input type="checkbox" v-model="filtros.presupuesto" :value="op.value"/>
        <div class="check-custom"></div>
        <span>{{ op.label }}</span>
      </label>
    </div>

    <!-- Recomendaciones -->
    <div class="filtro-card">
      <h3>Recomendaciones</h3>
      <label v-for="op in recomendaciones" :key="op.value" class="check-option">
        <input type="checkbox" v-model="filtros.recomendaciones" :value="op.value"/>
        <div class="check-custom"></div>
        <span>{{ op.label }}</span>
      </label>
    </div>

    <!-- Hora de inicio -->
    <div class="filtro-card">
      <h3>Hora de inicio</h3>
      <label v-for="op in horas" :key="op.value" class="check-option">
        <input type="checkbox" v-model="filtros.horas" :value="op.value"/>
        <div class="check-custom"></div>
        <span>{{ op.label }}</span>
      </label>
    </div>

   
  </aside>
</template>

<script setup>
import { reactive } from 'vue'

const filtros = reactive({
  busqueda: '',
  puntuacion: 'cualquiera',
  presupuesto: [],
  recomendaciones: [],
  horas: [],
  duracion: [],
})

const puntuaciones = [
  { value: 'cualquiera', label: 'Cualquiera' },
  { value: '9', label: 'Magnífica 9+' },
  { value: '8', label: 'Muy buena 8+' },
  { value: '7', label: 'Buena 7+' },
]

const presupuestos = [
  { value: '0-25', label: 'Menos de $25' },
  { value: '25-50', label: '$25 a $50' },
  { value: '50-75', label: '$50 a $75' },
  { value: '75-100', label: '$75 a $100' },
  { value: '100+', label: 'Más de $100' },
]

const recomendaciones = [
  { value: 'cancelacion', label: 'Cancelación gratuita' },
  { value: 'ofertas', label: 'Ofertas' },
  { value: 'familias', label: 'Para familias' },
  { value: 'nuevo', label: 'Nuevo en Expedia' },
]

const horas = [
  { value: 'manana', label: '6:00 a.m. – 12:00 p.m. (mañana)' },
  { value: 'tarde', label: '12:00 – 5:00 p.m. (tarde)' },
  { value: 'noche', label: '5:00 – 12:00 a.m. (noche)' },
  { value: 'cualquiera', label: 'Cualquier hora' },
]

const duraciones = [
  { value: '1h', label: 'Menos de 1 hora' },
  { value: '1-4h', label: 'De 1 a 4 horas' },
  { value: '4h-1d', label: 'De 4 horas a 1 día' },
  { value: '1d+', label: 'Más de 1 día', disabled: true },
]

const limpiarFiltros = () => {
  filtros.busqueda = ''
  filtros.puntuacion = 'cualquiera'
  filtros.presupuesto = []
  filtros.recomendaciones = []
  filtros.horas = []
  filtros.duracion = []
}

defineEmits(['cambio'])
</script>

<style scoped>
.filtros-panel {
  width: 280px;
  min-width: 260px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

/* Cada sección es una tarjeta separada */
.filtro-card {
  background: #ffffff;
  border: 1.5px solid #e2e8f0;
  border-radius: 14px;
  padding: 18px 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.filtro-card h3 {
  font-size: 15px;
  font-weight: 700;
  color: #1a3a5c;
  margin: 0;
}

/* Search */
.search-box {
  display: flex;
  align-items: center;
  gap: 8px;
  border: 1.5px solid #d0d8e4;
  border-radius: 10px;
  padding: 10px 12px;
  background: #fff;
  transition: border 0.2s;
}
.search-box:focus-within {
  border-color: #1a73e8;
}
.search-box svg {
  color: #94a3b8;
  flex-shrink: 0;
}
.search-box input {
  border: none;
  background: transparent;
  outline: none;
  font-size: 14px;
  color: #333;
  width: 100%;
}
.search-box input::placeholder {
  color: #b0bac8;
}

/* Radio */
.radio-option {
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
}
.radio-option input[type="radio"] {
  display: none;
}
.radio-custom {
  width: 20px;
  height: 20px;
  border: 2px solid #c8d0dc;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: border-color 0.2s;
}
.radio-option input[type="radio"]:checked ~ .radio-custom {
  border-color: #113955;
}
.radio-option input[type="radio"]:checked ~ .radio-custom::after {
  content: '';
  width: 10px;
  height: 10px;
  background: #113955;
  border-radius: 50%;
}
.radio-option span {
  font-size: 14px;
  color: #374151;
}

/* Checkbox */
.check-option {
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
}
.check-option input[type="checkbox"] {
  display: none;
}
.check-custom {
  width: 20px;
  height: 20px;
  border: 2px solid #c8d0dc;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: all 0.15s;
}
.check-option input[type="checkbox"]:checked ~ .check-custom {
  background: white;
  border-color: #113955;
}
.check-option input[type="checkbox"]:checked ~ .check-custom::after {
  content: '';
  width: 10px;
  height: 10px;
  background: #113955;
  border-radius: 50%;
}
.check-option input[type="checkbox"]:disabled ~ .check-custom {
  background: #f1f5f9;
  border-color: #dde3ec;
}
.check-option input[type="checkbox"]:disabled ~ span {
  color: #c0c8d4;
}
.check-option span {
  font-size: 14px;
  color: #374151;
}

/* Botón limpiar */
.btn-limpiar {
  width: 100%;
  padding: 12px;
  border: 1.5px solid #1a73e8;
  color: #1a73e8;
  background: transparent;
  border-radius: 10px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}
.btn-limpiar:hover {
  background: #1a73e8;
  color: white;
}
</style>