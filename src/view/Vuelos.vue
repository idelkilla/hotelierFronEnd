<template>
  <div class="vuelos-view-wrapper">
    <Header />
    
    <div class="vuelos-main-content-layout">
      <div class="filters-column">
        <FiltrosVuelos 
          :id-origen="busqueda.id_origen" 
          :id-destino="busqueda.id_destino" 
          @filtros-cambiados="aplicarFiltros" 
        />
      </div>

      <div class="vuelos-right-column">
<<<<<<< HEAD
        <!-- El buscador de vuelos -->
=======
>>>>>>> 25e2efbbea94fd3fdcc03124745f6221802e0781
        <div class="vuelos-search-wrapper">
          <VuelosBuscar :initial-destino="route.query.destino" />
        </div>
         <div class="vuelos-search-wrapper">
          <OpcionesVuelos :vuelos-data="vuelosResultados" :loading="cargando" />
        </div>
      </div>
    </div>
  </div>
  <FooterComponent />
</template>

<style scoped>
.vuelos-view-wrapper {
  background-color:#ffffff!important;
  min-height: 100vh;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 0; 
}

.vuelos-main-content-layout {
  width: 100%;
  max-width: 1300px;
  margin: 80px auto 0;
  padding: 0 20px;
  display: flex;
  gap: 24px;
  align-items: flex-start;
}

.filters-column {
  margin-top: 30px;
}

:deep(.vuelos-search) {
  width: 100%;
  max-width: 950px;
  display: flex;
  flex-direction: column;
  background: transparent !important;
  border: none !important;
  box-shadow: none !important;
}
.vuelos-right-column {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
}

.vuelos-search-wrapper {
  width: 100%;
}

.search-top-layer {
  position: relative;
  z-index: 100;
}

:deep(.vuelos-tabs) {
  order: 2; 
  margin: 5px 90px 15px;
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
<<<<<<< HEAD
  padding: 10px 64px !important; /* Relleno idéntico al de cuerpo.css */
=======
  padding: 10px 64px !important;
>>>>>>> 25e2efbbea94fd3fdcc03124745f6221802e0781
  padding: 10px 32px !important; 
  border: none !important;
  background: none !important;
  color: #113955 !important;
  font-size: 15px !important;
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
  order: 1;
}

@media (max-width: 768px) {
  .vuelos-main-content-layout {
    flex-direction: column;
    gap: 10px;
    padding: 0 12px;
    margin-top: 70px;
    align-items: stretch;
  }

  .vuelos-right-column {
    display: contents;
  }

  .search-top-layer {
    order: 1;
  }

  .filters-column {
    order: 2;
    margin: 0;
    display: flex;
    justify-content: center;
    width: 100%;
  }

  .vuelos-search-wrapper:not(.search-top-layer) {
    order: 3;
  }

  :deep(.vuelos-tabs) {
    margin: 5px 0 10px !important;
    width: 100% !important;
    justify-content: space-between;
    padding: 3px;
  }

  :deep(.vuelo-tab) {
    padding: 8px 10px !important;
    font-size: 12px !important;
    flex: 1;
    min-width: 0;
  }
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
  busqueda.value.id_origen = route.query.id_origen || null;
  busqueda.value.id_destino = route.query.id_destino || null;

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

watch(() => route.query, ejecutarBusqueda, { deep: true });

function aplicarFiltros(filtros) {
  console.log('Filtros aplicados:', filtros);
  const query = { ...route.query };

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