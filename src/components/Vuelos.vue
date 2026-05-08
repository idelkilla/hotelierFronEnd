<template>
  <div class="main-container">
    <Header />
    <div class="centered-content">

      <!-- Buscador superior -->
      <div class="search-wrapper">
        <VuelosSearch 
          :initial-destino="route.query.id_destino" 
          :initial-entrada="route.query.fecha_salida"
          :initial-salida="route.query.fecha_regreso"
        />
      </div>

      <!-- Layout principal: Filtros (izq) + Resultados (der) -->
      <div class="vuelos-layout">
        <FiltrosVuelos 
          :id-origen="route.query.id_origen"
          :id-destino="route.query.id_destino"
          @filtros-cambiados="aplicarFiltros"
        />

        <div class="vuelos-resultados">
          <OpcionesVuelos :vuelos-data="vuelosFiltrados" :loading="loading" />
        </div>
      </div>
    </div>
  </div>
  <FooterComponent />
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import { useRoute } from 'vue-router';
import Header from "../components/Header.vue";
import VuelosSearch from "../components/VuelosSearch.vue";
import FiltrosVuelos from '../components/FiltrosVuelos.vue';
import OpcionesVuelos from '../components/OpcionesVuelos.vue';
import FooterComponent from '../components/footer.vue';

const route = useRoute();
const vuelosOriginales = ref([]);
const vuelosFiltrados = ref([]);
const loading = ref(false);

const fetchVuelos = async () => {
  loading.value = true;
  try {
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
    const params = new URLSearchParams(route.query);
    const response = await fetch(`${API_URL}/api/vuelos/buscar?${params.toString()}`);
    if (!response.ok) throw new Error('Error al obtener los vuelos');
    vuelosOriginales.value = await response.json();
    vuelosFiltrados.value = vuelosOriginales.value;
  } catch (error) {
    console.error('Error fetching flights:', error);
    vuelosOriginales.value = [];
    vuelosFiltrados.value = [];
  } finally {
    loading.value = false;
  }
};

const aplicarFiltros = (filtros) => {
  // Filtramos la lista original basándonos en los eventos que emite FiltrosVuelos.vue
  vuelosFiltrados.value = vuelosOriginales.value.filter(v => {
    // 1. Filtro por nombre (Aerolínea)
    if (filtros.nombre && !v.aerolinea.toLowerCase().includes(filtros.nombre.toLowerCase())) return false;

    // 2. Filtro por Aerolínea (IDs de proveedores)
    if (filtros.aerolineas.length > 0 && !filtros.aerolineas.includes(v.id_proveedor)) return false;

    // 3. Filtro por Clase de cabina
    if (filtros.claseId && v.ID_CLASE !== filtros.claseId) return false;

    // 4. Filtro por Duración (convertimos minutos a horas)
    const horas = v.DURACION_MINUTOS / 60;
    if (horas > filtros.tiempoMaximoHoras) return false;

    // Nota: El filtro de escalas se aplicaría aquí si el objeto 'v' tuviera esa propiedad
    return true;
  });
};

onMounted(fetchVuelos);
// Refrescar resultados cuando cambien los parámetros de búsqueda en la URL
watch(() => route.query, fetchVuelos);
</script>

<style>
/* Reutilizamos el centrado global definido en Carros.vue */
.centered-content {
  max-width: 1200px;
  margin: 0 auto;
}
</style>

<style scoped>
.search-wrapper {
  padding: 80px 0 20px 0;
  background-color: #ffffff;
  position: relative;
  z-index: 100;
}

.search-wrapper :deep(.vuelos-search) {
  width: 100%;
  transform: scale(0.9);
  transform-origin: top center;
}

.vuelos-layout {
  display: flex;
  gap: 24px;
  padding: 0 20px;
  align-items: flex-start;
  margin-bottom: 60px;
}
.vuelos-resultados {
  flex: 1;
  min-width: 0;
}
</style>