<template>
  <div class="main-container">
    <Header />

    <BuscadorPrincipal />

    <div class="layout-detalle">
       <GaleriaCollage />
       
       </div>
       <div class="layout-detalle">
       <DetallesHotel/>
       </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import Header from "../components/Header.vue";
// Importamos tu componente con el nombre que le diste
import BuscadorPrincipal from "../components/MenuDet.vue";
// Importamos el nuevo componente del Collage
import GaleriaCollage from "../components/GaleriaCollage.vue";
// Importamos el detalle de lso hoteles
import DetallesHotel  from "../components/DetallesHotel.vue";
</script>

<style scoped>
/* Contenedor principal: Mantiene el flujo vertical y el fondo blanco */
.main-container {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  /* El padding-top de 90px evita que el Header tape el contenido */
  padding-top: 90px; 
  background-color: #ffffff;
}

/* Contenedor del contenido: Limita el ancho para que no se estire infinito */
.layout-detalle {
  max-width: 1200px;
  width: 90%; /* Deja un pequeño margen en los lados */
  margin: 20px auto;
  display: flex;
  flex-direction: column;
  gap: 20px;
}
</style>