<template>
   <div class="search-section-container">
      <div class="search-bar-content">
        <FormSearch
          :initial-destino="searchDestino"
          :initial-entrada="searchEntrada"
          :initial-salida="searchSalida"
          :initial-huespedes="habitaciones"
          compact
        />

        <div class="accommodation-tabs">
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
import { ref, computed, watch } from 'vue';
import { useRoute } from 'vue-router';
import FormSearch from './FormSearch.vue';

const route = useRoute();

const searchDestino = ref(route.query.destino || '');
const searchEntrada = ref(route.query.entrada || '');
const searchSalida = ref(route.query.salida || '');
const habitaciones = ref(
  route.query.huespedes ? JSON.parse(route.query.huespedes) : [{ adultos: 2, ninos: 0, edadesNinos: [] }]
);
const activeTab = ref('all');

// Vigilamos los cambios en la URL para sincronizar el buscador
watch(() => route.query, (q) => {
  searchDestino.value = q.destino || '';
  searchEntrada.value = q.entrada || '';
  searchSalida.value = q.salida || '';
  if (q.huespedes) {
    habitaciones.value = JSON.parse(q.huespedes);
  }
}, { deep: true });

const sliderClass = computed(() => `pos-${activeTab.value}`);
</script>

<style scoped>

/* --- RESTO DEL CÓDIGO (Sin cambios de lógica) --- */
.main-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    background-color: #ffffff;
    width: 100%;
    padding-bottom: 100px;
    margin-top: 70px;
    padding-top: 90px; 
  background-color: #ffffff;
}

.input-group svg.icon, 
.input-group .icon {
    width: 28px !important;
    height: 28px !important;
    min-width: 28px !important;
    margin-right: 12px !important;
    display: block !important;
}

.input-group svg.icon path {
    stroke-width: 1.5; 
}

.search-section-container {
    width: 80%; 
    max-width: 80%; 
    margin-top: 4px;
    margin-left: auto;
    margin-right: auto;
    font-family: 'Inter', 'Pli', sans-serif;
    font-weight: bold;
}

.search-bar-content {
    display: flex;
    flex-direction: column;
    background-color: transparent;
    padding: 0; 
    box-shadow: none; 
}

.search-box-icon {
    width: 10px; 
    height: 10px;
    color: #1a4f78;
    margin-right: 12px;
    flex-shrink: 0;
}

.search-inputs-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    border: 1px solid #dddddd; 
    border-radius: 8px; 
    overflow: hidden; 
    margin-bottom: 0;
    padding: 0;
}

.dropdown-container {
    position: relative;
    flex-grow: 1; 
}

.dropdown-container:after {
    content: '';
    position: absolute;
    right: 0;
    top: 15%;
    height: 70%;
    width: 1px;
    background-color: #dddddd;
    overflow: hidden;
    z-index: 10;
}





.input-row {
    display: flex;
    align-items: center;
    font-weight: bold;
    color: #113955;
}

.input-row input {
    border: none;
    outline: none;
    width: 100%;
    font-size: 16px;
    font-weight: bold;
    color: #113955;
    background: transparent;
    padding-left: 2px;
}

.input-row input::-webkit-inner-spin-button,
.input-row input::-webkit-outer-spin-button {
    -webkit-appearance: none;
    margin: 0;
}





.input-group {
    flex-grow: 1; 
    display: flex;
    align-items: center;
    padding: 5px 10px; 
    border-radius: 0; 
    cursor: pointer;
    position: relative;
    transition: background-color 0.1s;
}

.input-group:hover {
    background-color: #f8f8f8;
}

.date-input::after, .guests-input::after {
    content: ''; 
    position: absolute;
    right: 0;
    top: 15%;
    height: 70%;
    width: 1px;
    background-color: #eee;
}

.input-group .icon {
    width: 20px;
    height: 20px;
    color: #333;
    margin-right: 10px;
}

.input-text-area {
    display: flex;
    flex-direction: column;
    line-height: 1.2;
    width: 100%; 
    padding-top:6px;
}

.input-text-area label {
    font-size: 12px;
    color: #888;
    font-weight: 500;
}

.input-text-area input {
    border: none;
    outline: none;
    font-size: 14px;
    font-weight: bold;
    color: #333;
    width: 100%;
    background: none;
padding-top:2px ;
}

.input-text-area input::placeholder {
    color: #333; 
    font-weight: bold;
}

.search-button {
    background-color: #1a4f78; 
    color: white;
    padding: 12px 27px;
    border: none;
    font-weight: bold;
    cursor: pointer;
    transition: background-color 0.2s;
    margin-left: 0; 
    border-radius: 0 8px 8px 0; 
    height: 70px; 
    flex-shrink: 0; 
    
}

.search-button:hover {
    background-color: #113955;
}

.accommodation-tabs {
    background-color: #e9f1f6;
    border-radius: 500px;
    display: flex;
    position: relative;
    padding: 6px;
    margin: 25px auto;
    width: 80%;
    max-width: 800px;
    align-items: center;
}

.tab {
    flex: 1;
    border: none;
    background: none;
    padding: 12px 20px;
    cursor: pointer;
    font-size: 16px;
    color: #113955;
    display: flex;
    z-index: 1;
    outline: none;
    align-items: center;
    justify-content: center;
    gap: 12px;
}

.tab.active {
    background-color: #cbd9e6; 
    color: #113955; 
    font-weight: 700;
    border-radius: 40px; 
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    box-sizing: border-box;
}

.tab:focus {
    outline: none;
}

.tab:active {
    outline: none;
}

</style>