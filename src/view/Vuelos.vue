<template>
  <div class="vuelos-view-wrapper">
    <Header />
    
    <!-- Nuevo contenedor para el layout de dos columnas -->
    <div class="vuelos-main-content-layout">
      <!-- Columna izquierda para los filtros -->
      <div class="filters-column">
        <FiltrosVuelos 
          :id-origen="busqueda.idOrigen" 
          :id-destino="busqueda.idDestino" 
          @filtros-cambiados="aplicarFiltros" 
        />
      </div>

      <!-- Columna derecha para el buscador y resultados -->
      <div class="vuelos-right-column">
        <!-- El buscador de vuelos -->
        <div class="vuelos-search-wrapper">
          <VuelosBuscar />
        </div>
         <div class="vuelos-search-wrapper">
          <OpcionesVuelos/>
        </div>
        <!-- Aquí irían los resultados de vuelos si los hubiera -->
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Contenedor principal de la vista de Vuelos */
.vuelos-view-wrapper {
  background-color:#ffffff!important; /* Fondo blanco para toda la pantalla */
  min-height: 100vh;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center; /* Centra el contenido para que no esté pegado a la izquierda */
  padding-top: 0; 
}

/* Nuevo layout de dos columnas para filtros y buscador */
.vuelos-main-content-layout {
  width: 100%;
  max-width: 1300px;
  margin: 60px auto 0; /* Alineado exacto con el alto del header (60px) */
  padding: 0 20px;
  display: flex;
  gap: 24px; /* Espacio entre las columnas */
  align-items: flex-start; /* Alinea las columnas en la parte superior */
}

.filters-column {
  margin-top: 30px; /* Ajustado para alinear con el inicio de los resultados de vuelos */
}


/* Estilos profundos para VuelosSearch sin tocar su código original */
:deep(.vuelos-search) {
  width: 100%;
  max-width: 950px; /* Lo hace más pequeño/compacto */
  display: flex;
  flex-direction: column;
  background: transparent !important;
  border: none !important;
  box-shadow: none !important;
}
/* Estilos para la columna derecha (buscador y resultados) */
.vuelos-right-column {
  flex-grow: 1; /* Ocupa el espacio restante */
  display: flex; /* Para alinear el buscador dentro */
  flex-direction: column; /* Si hay más elementos, se apilarán */
  align-items: flex-end; /* Alinea el contenido de esta columna a la derecha */
  /* No necesitamos justify-content aquí, ya que align-items en flex-direction: column hace lo mismo para el eje transversal */
}

/* Contenedor para el buscador de vuelos dentro de la columna derecha */
.vuelos-search-wrapper {
  width: 100%; /* Ocupa todo el ancho de la columna derecha */
  /* No necesitamos padding o margin-top aquí, ya que el padre .vuelos-main-content-layout los maneja */
  /* No necesitamos display: flex o justify-content aquí, ya que el padre .vuelos-right-column ya alinea su contenido a la derecha */
}
/* Mover los tabs (Viaje redondo...) debajo de los inputs usando order */
:deep(.vuelos-tabs) {
  order: 2; 
  margin: 10px 90px 15px; /* Márgenes reducidos para que los resultados de vuelos suban */
  background-color: #e9f1f6;
  border-radius: 500px;
  padding: 4px;
  width: fit-content;
  border-bottom: none !important;
  display: flex;
  align-items: center;
}

:deep(.vuelo-tab) {
  border-radius: 40px !important;
  padding: 10px 64px !important; /* Relleno idéntico al de cuerpo.css */
  border: none !important;
  background: none !important;
  color: #113955 !important;
  font-size: 15px !important; /* Tamaño de fuente idéntico al de cuerpo.css */
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
  gap: 10px !important;
  white-space: nowrap !important;
  font-weight: 500 !important;
  transition: all 0.2s ease;
}

:deep(.vuelo-tab.active) {
  background-color: #ffffff !important;
  color: #113955 !important;
  font-weight: 700 !important;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.12) !important;
}

:deep(.search-fields-dynamic), 
:deep(.multidestino-container),
:deep(.pasajeros-top) {
  order: 1; /* Los campos de búsqueda van arriba */
}
</style>

<script setup>
import { ref } from 'vue';
import Header from "../components/Header.vue";
import VuelosBuscar from"../components/VuelosSearch.vue";
import FiltrosVuelos from"../components/FiltrosVuelos.vue";
import OpcionesVuelos from '../components/OpcionesVuelos.vue';

const busqueda = ref({
  idOrigen: null,
  idDestino: null
});

const aplicarFiltros = (filtros) => {
  console.log('Filtros aplicados:', filtros);
  // Lógica para filtrar los resultados de vuelos
};
</script>