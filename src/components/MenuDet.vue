<template>
   <div class="search-section-container">
      <div class="search-bar-content">
        <div class="search-inputs-row">
          <div class="dropdown-container">
            <div class="input-group location-input">
              <svg class="icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 11.5C10.621 11.5 9.5 10.379 9.5 9C9.5 7.621 10.621 6.5 12 6.5C13.379 6.5 14.5 7.621 14.5 9C14.5 10.379 13.379 11.5 12 11.5Z" stroke="#333" stroke-width="1.5"/>
                <path d="M12 21C14.773 18.026 18.5 14.5 18.5 9.5C18.5 5.358 15.029 2 12 2C8.971 2 5.5 5.358 5.5 9.5C5.5 14.5 9.227 18.026 12 21Z" stroke="#333" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              <div class="input-text-area">
                <label>¿A dónde quieres ir?</label>
                <input type="text" v-model="searchDestino" placeholder="Sosúa, Puerto Plata República..." />
              </div>
            </div>
          </div>

          <div class="input-group date-input">
            <svg class="icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="3" y="4" width="18" height="18" rx="2" stroke="#333" stroke-width="1.5"/>
              <path d="M7 2V4" stroke="#333" stroke-width="1.5" stroke-linecap="round"/>
              <path d="M17 2V4" stroke="#333" stroke-width="1.5" stroke-linecap="round"/>
              <path d="M3 8H21" stroke="#333" stroke-width="1.5" stroke-linecap="round"/>
            </svg>
            <div class="input-text-area">
              <label>Entrada</label>
              <input type="date" v-model="searchEntrada" />
            </div>
          </div>

          <div class="input-group date-input">
            <svg class="icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="3" y="4" width="18" height="18" rx="2" stroke="#333" stroke-width="1.5"/>
              <path d="M7 2V4" stroke="#333" stroke-width="1.5" stroke-linecap="round"/>
              <path d="M17 2V4" stroke="#333" stroke-width="1.5" stroke-linecap="round"/>
              <path d="M3 8H21" stroke="#333" stroke-width="1.5" stroke-linecap="round"/>
            </svg>
            <div class="input-text-area">
              <label>Salida</label>
              <input type="date" v-model="searchSalida" />
            </div>
          </div>

          <div class="input-group guests-input">
            <svg class="icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M16 7C16 9.20914 14.2091 11 12 11C9.79086 11 8 9.20914 8 7C8 4.79086 9.79086 3 12 3C14.2091 3 16 4.79086 16 7Z" stroke="#333" stroke-width="1.5"/>
              <path d="M12 14C16.4183 14 20 17.1333 20 21H4C4 17.1333 7.58172 14 12 14Z" stroke="#333" stroke-width="1.5"/>
            </svg>
            <div class="input-text-area">
              <label>Huéspedes</label>
              <input type="text" :value="resumenHuespedes" readonly />
            </div>
          </div>

          <button class="search-button" @click="ejecutarBusqueda">Buscar</button>
        </div>

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
import { ref, computed } from 'vue';

// 1. Variables de estado
const searchDestino = ref('');
const searchEntrada = ref('');
const searchSalida = ref('');
const activeTab = ref('all');

// 2. Props y Emits (Para avisar al componente padre que buscamos algo)
const emit = defineEmits(['buscar']);

// 3. Lógica
const resumenHuespedes = computed(() => {
  return "3 Personas y 4 Niños"; // Aquí puedes poner tu lógica de habitaciones
});

const sliderClass = computed(() => {
  return `pos-${activeTab.value}`;
});

const cambiarTab = (tab) => {
  activeTab.value = tab;
  // Avisamos que cambió el tipo de alojamiento
  emit('buscar', { tipo: tab, destino: searchDestino.value });
};

const enviarBusqueda = () => {
  emit('buscar', {
    destino: searchDestino.value,
    entrada: searchEntrada.value,
    salida: searchSalida.value,
    tipo: activeTab.value
  });
};
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