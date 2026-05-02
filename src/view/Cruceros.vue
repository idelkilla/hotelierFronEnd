<template>
  <div class="main-container">
    <Header />

    <div class="CrucerosSerch">
      <CrucerosSearch />
    </div>

    <div class="cruceros-layout">
      <aside class="cruceros-filtros">
        <FiltroCruceros />
      </aside>

      <div class="cruceros-resultados">
        <OpcionesCruceros />
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref } from 'vue';
import Header from "../components/Header.vue";
import CrucerosSearch from "../components/CrucerosSearch.vue";
import FiltroCruceros from "../components/FiltrosCruceros.vue";
import OpcionesCruceros from "../components/OpcionesCruceros.vue";
</script>

<style scoped>
.main-container {
  background-color: #ffffff;
  min-height: 100vh;
  overflow: visible; /* ← añade esto */
}

.CrucerosSerch {
  background-color: #ffffff;
  padding-top: 90px;
  display: flex;
  flex-direction: column;
  width: 100%;
  align-items: flex-end;
  padding-right: 40px;
}

:deep(.cruceros-search) {
  transform: scale(0.95);
  transform-origin: right top;
  width: 950px !important;
}

:deep(.vuelos-tabs),
:deep(.cruceros-tabs) {
  margin-left: auto !important;
  margin-right: 0px !important;
  display: flex !important;
  width: fit-content !important;
}

.cruceros-layout {
  display: flex;
  gap: 24px;
  padding: 40px 40px;
  background-color: #ffffff;
  align-items: flex-start; /* ← clave: sin esto el sticky no funciona */
}

.cruceros-filtros {
  width: 260px;
  flex-shrink: 0;
  position: sticky;
  top: 70px; /* ← header son 60px + 10px de aire */
  height: fit-content; /* ← esto también es necesario */
}

.cruceros-resultados {
  flex: 1;
}
</style>