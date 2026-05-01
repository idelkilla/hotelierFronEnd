<template>
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

    <!-- Aerolíneas -->
    <div class="filtro-card">
      <p class="filtro-titulo">Tipo de aerolínea</p>
      <div v-for="aerolinea in aerolineas" :key="aerolinea.nombre" class="filtro-opcion">
        <input type="checkbox" v-model="aerolinea.seleccionada" />
        <span class="filtro-label">{{ aerolinea.nombre }} ({{ aerolinea.vuelos }})</span>
        <span class="filtro-precio">${{ aerolinea.precio.toLocaleString() }}</span>
      </div>
    </div>

      <!-- Tiempo de viaje -->
    <div class="filtro-card">
      <p class="filtro-titulo">Tiempo total de viaje</p>
      <span class="slider-val">
        {{ tiempoMaximo === 35 ? 'Menos de 35 h' : `Menos de ${tiempoMaximo} h` }}
      </span>
      <input type="range" min="1" max="35" v-model.number="tiempoMaximo" />
    </div>

    <!-- Escalas -->
   

    <!-- Clase preferida -->
    <div class="filtro-card">
      <p class="filtro-titulo">Clase preferida</p>
      <div v-for="clase in clases" :key="clase.valor" class="clase-opcion">
        <input type="radio" name="clase" :value="clase.valor" v-model="claseSeleccionada" />
        <div>
          <div class="clase-nombre">{{ clase.label }}</div>
          <div v-if="clase.nota" class="clase-desc">{{ clase.nota }}</div>
        </div>
      </div>
    </div>

  

  </div>
</template>

<script setup>
import { ref, watch } from 'vue';

const emit = defineEmits(['filtros-cambiados']);

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

// Emite los filtros al padre cada vez que cambian
watch(
  [aerolineas, escalas, claseSeleccionada, tiempoMaximo],
  () => {
    emit('filtros-cambiados', {
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

.filters-column {
    display: flex;
    flex-direction: column;
    font-family: sans-serif;
    gap: 16px;
}

.filters-column > p { display: none; }

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