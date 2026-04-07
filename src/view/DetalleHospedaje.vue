<template>
  <div class="main-container">
    <Header />

    <BuscadorPrincipal />
  

    <div class="layout-detalle">
       
    </div>
  </div>
</template>

<script setup>
// IMPORTANTE: Aquí traemos los componentes de su carpeta
import Header from "../components/Header.vue";
import BuscadorPrincipal from "../components/MenuDet.vue";
// No necesitas escribir más lógica aquí por ahora, 
// porque el CSS y el HTML ya viven dentro de BuscadorPrincipal.vue
</script>

<style scoped>
/* Solo estilos para organizar la página, no para el buscador */
.main-container {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 90px; 
  background-color: #ffffff;
}

.layout-detalle {
  max-width: 1200px;
  width: 100%;
  margin: 20px auto;
}
</style>