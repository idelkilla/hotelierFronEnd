<template>
  <div class="galeria-grid" :class="gridClass" v-if="misImagenes.length > 0">

    <div class="foto-grande">
      <img :src="getImgUrl(0)" alt="Hotel Vista Principal">
    </div>

    <!-- Segunda columna: Imágenes 2 y 3 -->
    <div class="fotos-secundarias-col" v-if="misImagenes.length >= 2">
      <img v-if="misImagenes[1]" :src="getImgUrl(1)" :class="{ 'rounded-tr': misImagenes.length <= 3 }">
      <img v-if="misImagenes[2]" :src="getImgUrl(2)" :class="{ 'rounded-br': misImagenes.length <= 3 }">
    </div>

    <!-- Tercera columna: Imágenes 4 y 5 -->
    <div class="fotos-secundarias-col" v-if="misImagenes.length >= 4">
      <img v-if="misImagenes[3]" :src="getImgUrl(3)" class="rounded-tr">
      <img v-if="misImagenes[4]" :src="getImgUrl(4)" class="rounded-br">
    </div>
  </div>

  <div v-else class="sin-fotos">
    <p>No hay imágenes disponibles</p>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  imagenesBd: {
    type: Array,
    default: () => []
  }
});

const misImagenes = computed(() => props.imagenesBd);

/**
 * Determina la clase de la cuadrícula según el número de imágenes
 */
const gridClass = computed(() => {
  const count = misImagenes.value.length;
  if (count === 1) return 'cols-1';
  if (count <= 3) return 'cols-2';
  return 'cols-3';
});

/**
 * Extrae la URL de forma segura (soporta strings u objetos con url/URL)
 */
function getImgUrl(index) {
  const img = misImagenes.value[index];
  if (!img) return '';
  if (typeof img === 'string') return img;
  return img.URL || img.url || '';
}
</script>

<style scoped>
.galeria-grid {
  display: grid;
  grid-template-rows: 1fr 1fr;
  gap: 8px;
  height: 380px; /* Reduced height for a more compact look */
  width: 100%;
  border-radius: 15px;
  overflow: hidden;
}

/* Columnas dinámicas */
.galeria-grid.cols-1 { grid-template-columns: 1fr; }
.galeria-grid.cols-2 { grid-template-columns: 2.2fr 1fr; }
.galeria-grid.cols-3 { grid-template-columns: 2fr 1fr 1fr; }

.foto-grande {
  grid-column: 1;
  grid-row: 1 / 3;
  /* ocupa las 2 filas */
  overflow: hidden;
}

.foto-grande img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 15px 0 0 15px;
}

.galeria-grid.cols-1 .foto-grande img {
  border-radius: 15px;
}

.fotos-secundarias-col {
  display: flex; /* Changed to flexbox for simpler vertical stacking */
  flex-direction: column;
  gap: 8px;
  height: 100%;
}

.fotos-secundarias-col img {
  width: 100%;
  flex-grow: 1; /* Distribute available space equally in flex container */
  object-fit: cover;
}

/* Clases de redondeo explícitas */
.rounded-tr { border-radius: 0 15px 0 0 !important; }
.rounded-br { border-radius: 0 0 15px 0 !important; }

.sin-fotos {
  height: 380px; /* Match the main grid height */
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f0f0f0;
  border-radius: 15px;
  color: #999;
}

@media (max-width: 768px) {
  .galeria-grid {
    grid-template-columns: 1fr;
    height: 200px; /* Reduced height for mobile */
  }
  .fotos-secundarias-col { display: none; }
  .foto-grande {
    grid-row: 1;
    grid-column: 1;
  }
  .foto-grande img { border-radius: 12px; }
}
</style>