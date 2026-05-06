<template>
  <div class="vuelos-view-wrapper">
    <Header />
    
    <!-- Nuevo contenedor para el layout de dos columnas -->
    <div class="vuelos-main-content-layout">
      <!-- Columna izquierda para los filtros -->
      <div class="filters-column">
        <FiltrosVuelos 
          :id-origen="busqueda.id_origen" 
          :id-destino="busqueda.id_destino" 
          @filtros-cambiados="aplicarFiltros" 
        />
      </div>

      <!-- Columna derecha para el buscador y resultados -->
      <div class="vuelos-right-column">
        <!-- El buscador de vuelos -->
        <div class="vuelos-search-wrapper">
          <VuelosBuscar :initial-destino="route.query.destino" />
        </div>
         <div class="vuelos-search-wrapper">
          <OpcionesVuelos :vuelos-data="vuelosResultados" :loading="cargando" />
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
  margin: 110px auto 0; /* Aumentado para evitar que el header lo tape */
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
  margin: 5px 90px 15px; /* Reducido para que la sección sea menos alta */
  margin-bottom: 20px;
  background-color: #e9f1f6;
  border-radius: 500px;
  padding: 4px;
  width: fit-content;
  border-bottom: none !important;
  display: flex;
  align-items: center;
  border-bottom: none !important;
}

:deep(.vuelo-tab) {
  border-radius: 40px !important;
  padding: 10px 64px !important; /* Relleno idéntico al de cuerpo.css */
  padding: 10px 32px !important; 
  border: none !important;
  background: none !important;
  color: #113955 !important;
  font-size: 15px !important; /* Tamaño de fuente idéntico al de cuerpo.css */
  font-size: 14px !important;
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
import { ref, onMounted, watch } from 'vue';
import { useRoute } from 'vue-router';
import Header from "../components/Header.vue";
import VuelosBuscar from"../components/VuelosSearch.vue";
import FiltrosVuelos from"../components/FiltrosVuelos.vue";
import OpcionesVuelos from '../components/OpcionesVuelos.vue';
import { buscarVuelos } from '../services/vueloService';
import { useRouter } from 'vue-router';

const route = useRoute();
const router = useRouter();
const vuelosResultados = ref([]);
const cargando = ref(false);

const busqueda = ref({
  id_origen: route.query.id_origen || null,
  id_destino: route.query.id_destino || null
});

async function ejecutarBusqueda() {
  // Sincronizar IDs para que el sidebar de filtros sepa qué buscar
  busqueda.value.id_origen = route.query.id_origen || null;
  busqueda.value.id_destino = route.query.id_destino || null;

  // Solo buscar si hay al menos un origen o destino
  if (!route.query.id_origen && !route.query.id_destino) return;

  cargando.value = true;
  try {
    const data = await buscarVuelos(route.query);
    vuelosResultados.value = data;
  } catch (error) {
    console.error('Error en búsqueda de vuelos:', error);
  } finally {
    cargando.value = false;
  }
}

onMounted(ejecutarBusqueda);

// Reaccionar a cambios en la URL (cuando el usuario hace clic en Buscar)
watch(() => route.query, ejecutarBusqueda, { deep: true });

function aplicarFiltros(filtros) {
  console.log('Filtros aplicados:', filtros);
  const query = { ...route.query };

  // Mapeo de filtros emitidos a parámetros de URL que entiende el backend
  if (filtros.nombre) query.nombre = filtros.nombre;
  else delete query.nombre;

  if (filtros.aerolineas?.length) query.aerolineas = filtros.aerolineas.join(',');
  else delete query.aerolineas;

  if (filtros.escalas?.length) query.escalas = filtros.escalas[0];
  else delete query.escalas;

  if (filtros.claseId) query.clase = filtros.claseId;
  if (filtros.tiempoMaximoHoras) query.tiempo_max = filtros.tiempoMaximoHoras;

  router.push({ query });
}
</script>