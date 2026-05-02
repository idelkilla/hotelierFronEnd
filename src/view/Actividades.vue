<template>
  <div class="actividades-view-wrapper">
    <HeaderComponent />

    <div class="actividades-main-content">
      <!-- Buscador arriba, ancho completo -->
      <div class="search-row">
        <ActividadesSerch />
      </div>

      <!-- Layout principal: filtros izquierda, resultados derecha -->
      <div class="actividades-layout">
        <aside class="actividades-filtros">
          <FiltrosActividades />
        </aside>

        <div class="actividades-resultados">
          <!-- cards aquí -->
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import HeaderComponent from "../components/Header.vue";
import ActividadesSerch from "../components/ActividadesSearch.vue";
import FiltrosActividades from "../components/FiltrosActividades.vue";
</script>

<style scoped>
.actividades-view-wrapper {
  background-color: #ffffff;
  min-height: 100vh;
  width: 100%;
}

.actividades-main-content {
  max-width: 1300px;
  margin: 0 auto;
  padding: 90px 40px 40px; /* 100px top compensa el header fijo */
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.search-row {
  width: 100%;
  display: flex;
  justify-content: flex-end;
}

.actividades-layout {
  display: flex;
  gap: 24px;
  align-items: flex-start;
}

.actividades-filtros {
  width: 240px; /* Reducimos el ancho base del contenedor */
  flex-shrink: 0;
  position: sticky;
  top: 150px; /* Aumentado para bajar más la posición de los filtros */
  /* Escalamos el contenido al 90% para que todo se vea más pequeño */
  transform: scale(0.9);
  transform-origin: top left;
}

.actividades-resultados {
  flex: 1;
}

:deep(.actividades-search) {
  width: 950px !important;
  transform: scale(0.9);
  transform-origin: right top;
}

:deep(.info-banner) {
  display: none !important;
}
</style>