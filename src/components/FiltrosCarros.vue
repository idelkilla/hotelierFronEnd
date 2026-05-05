<template>
  <div class="filtros-autos">
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
        placeholder=""
        class="name-search-input"
      />
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
</template>

<script setup>
import { reactive } from 'vue'

const emit = defineEmits(['update:filtros'])

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
  precioMax: 500,
  rating: '',
  electrico: false,
  hibrido: false,
})
</script>

<style scoped>
.filtros-autos { display: flex; flex-direction: column; gap: 10px; } /* Menos espacio entre tarjetas */

.filtro-card {
  background: #fff;
  border: 0.5px solid #e0e0e0;
  border-radius: 12px;
  padding: 12px 15px; /* Relleno reducido para que el cuadro no sea tan grande */
  display: flex;
  flex-direction: column;
}

.filtro-titulo {
  font-size: 15px;
  font-weight: 600;
  color: #265073;
  margin-bottom: 8px; /* Título más pegado a las opciones */
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
  width: 16px;
  height: 16px;
  border: 1.5px solid #aab0bc;
  border-radius: 4px;
  cursor: pointer;
  background: white;
  flex-shrink: 0;
  position: relative;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
}

.filtro-opcion input[type="checkbox"] {
  border-radius: 50%; /* Checkboxes circulares */
  width: 18px; /* Tamaño ajustado para ser como en FiltrosVuelos */
  height: 18px;
}

.filtro-opcion input[type="radio"] {
  border-radius: 50%; /* Radio buttons redondos */
  width: 18px; /* Tamaño ajustado para ser como en FiltrosVuelos */
  height: 18px;
}

.filtro-opcion input[type="checkbox"]:checked,
.filtro-opcion input[type="radio"]:checked {
  border-color: #113955; /* Borde azul cuando seleccionado */
  background-color: white; /* Fondo blanco */
}

.filtro-opcion input[type="checkbox"]:checked::after,
.filtro-opcion input[type="radio"]:checked::after {
  content: '';
  position: absolute;
  width: 10px; /* Tamaño del punto de selección */
  height: 10px; /* Tamaño del punto de selección */
  background-color: #113955; /* Color del punto de selección */
  border-radius: 50%; /* Punto de selección redondo */
}

.filtro-rango-label {
  font-size: 13px;
  font-weight: 600;
  color: #265073;
  margin-bottom: 8px;
}

input[type=range] { width: 100%; accent-color: #265073; }

.filtro-rango-vals {
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  color: #888;
  margin-top: 4px;
}
.precio-inputs {
  display: flex;
  gap: 12px;
}

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

.precio-input-wrapper {
  display: flex;
  align-items: center;
  gap: 2px;
}

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