<template>
  <div class="main-container">
    <Header />

    <!-- Buscador arriba a la derecha -->
    <div class="search-wrapper">
      <AutosSearch />
    </div>

    <!-- Layout dos columnas: filtros izquierda, contenido derecha -->
    <div class="autos-layout">
      <aside class="autos-filtros">
        <FiltrosCarros />
      </aside>
      <div class="autos-resultados">
        <ResuladoCarros />
      </div>
    </div>
  </div>
  <FooterComponent />
</template>

<script setup>
import { ref } from 'vue';
import Header from "../components/Header.vue";
import AutosSearch from "../components/AutosSearch.vue";
import FiltrosCarros from '../components/FiltrosCarros.vue';
import ResuladoCarros from '../components/OpcionesCarros.vue';
import FooterComponent from '../components/footer.vue'
</script>

<style scoped>
.search-wrapper {
  display: flex;
  justify-content: flex-end; /* ALINEACIÓN HORIZONTAL: flex-end (derecha), center (centro), flex-start (izquierda) */
  align-items: flex-start;
  padding: 80px 104px 20px 0; /* El segundo valor (40px) es la distancia desde la derecha si usas flex-end */
  background-color: #ffffff;
  position: relative;
  z-index: 100; /* Asegura que el calendario y dropdowns salgan por encima de las cards y filtros */
}

.search-wrapper :deep(> *) {
  width: 95%;
  transform: scale(0.9);
  transform-origin: top right;
}

/* Forzamos que el contenedor del buscador sea un flex-column para poder reordenar */
.search-wrapper :deep(.autos-search) {
  display: flex;
  flex-direction: column;
}

/* Los campos de búsqueda (inputs) pasan a tener el orden 1 para estar arriba */
.search-wrapper :deep(.search-fields-dynamic) {
  order: 1;
}

/* Reemplaza el bloque de vuelos-tabs en tu View de autos */

.search-wrapper :deep(.vuelos-tabs) {
  display: flex !important;
  order: 2;
  margin-top: 12px !important;
  margin-left: 300px !important;
  margin-right: auto !important;
  width: fit-content !important;

  background-color: #e8edf2;
  border-radius: 500px;
  padding: 4px;
  gap: 0;
}

.search-wrapper :deep(.vuelo-tab) {
  border: none;
  background: none;
  padding: 10px 28px;
  cursor: pointer;
  font-size: 15px;
  color: #555;
  border-radius: 500px;
  font-weight: 500;
  transition: all 0.2s;
  white-space: nowrap;
}

.search-wrapper :deep(.vuelo-tab:hover) {
  color: #113955;
}

.search-wrapper :deep(.vuelo-tab.active) {
  background-color: #ffffff;
  color: #113955;
  font-weight: 700;
  border: 1px solid #d0d8e0;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.08);
}


.search-wrapper :deep(.autos-extras-row) {
  display: none !important;
}

/* Layout dos columnas */
.autos-layout {
  display: flex;
  gap: 24px;
  padding: 0px 40px; /* EL SEGUNDO VALOR (40px) maneja qué tan a la izquierda/derecha está todo el bloque de resultados y filtros */
  align-items: flex-start;
  background-color: #ffffff;
}

.autos-filtros {
  width: 220px; /* Aquí manejas el ancho de la caja de filtros */
  flex-shrink: 0;
  position: sticky;
  top: 10px; /* <--- AQUÍ SE MANEJA EL MARGEN SUPERIOR DE LOS FILTROS */
}

.autos-resultados {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0;
}
</style>