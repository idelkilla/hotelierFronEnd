<template>
  <div class="main-container">
    <Header />
    <BuscadorPrincipal />

    <div class="layout-detalle">
      <GaleriaCollage :imagenesBd="imagenesHotel" />
    </div>
    <div class="layout-detalle">
      <DetallesHotel />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import Header from "../components/Header.vue";
import BuscadorPrincipal from "../components/MenuDet.vue";
import GaleriaCollage from "../components/GaleriaCollage.vue";
import DetallesHotel from "../components/DetallesHotel.vue";

// Imágenes de prueba — reemplazar con fetch cuando esté el backend
const imagenesHotel = ref([
  'https://images.pexels.com/photos/271639/pexels-photo-271639.jpeg',
  'https://images.pexels.com/photos/164595/pexels-photo-164595.jpeg',
  'https://images.pexels.com/photos/261102/pexels-photo-261102.jpeg',
  'https://images.pexels.com/photos/189296/pexels-photo-189296.jpeg',
  'https://images.pexels.com/photos/258154/pexels-photo-258154.jpeg',
])
</script>

<style scoped>
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
  width: 90%;
  margin: 20px auto;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

@media (max-width: 768px) {
  .main-container { padding-top: 70px; }
  .layout-detalle { width: 95%; margin: 10px auto; gap: 15px; }
}
</style>