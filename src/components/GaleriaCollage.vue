<template>
  <div class="galeria-grid" :class="{ 'solo-una': misImagenes.length === 1 }" v-if="misImagenes.length > 0">
    
    <div class="foto-grande" :class="{ 'full-width': misImagenes.length === 1 }">
      <img :src="misImagenes[0]?.URL || misImagenes[0]" alt="Hotel Vista Principal">
    </div>

    <div class="fotos-secundarias-col" v-if="misImagenes.length > 1">
      <img v-if="misImagenes[1]" :src="misImagenes[1]?.URL || misImagenes[1]"
        :class="misImagenes.length <= 3 ? 'border-top-right' : ''">
      <img v-if="misImagenes[2]" :src="misImagenes[2]?.URL || misImagenes[2]"
        :class="misImagenes.length <= 3 ? 'border-bottom-right' : ''">
    </div>

    <div class="fotos-secundarias-col" v-if="misImagenes.length > 3">
      <img v-if="misImagenes[3]" :src="misImagenes[3]?.URL || misImagenes[3]" class="border-top-right">
      <img v-if="misImagenes[4]" :src="misImagenes[4]?.URL || misImagenes[4]" class="border-bottom-right">
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
</script>

<style scoped>
.galeria-grid {
  display: grid;
  grid-template-columns: 2fr 1fr;
  grid-template-rows: 1fr 1fr;
  gap: 8px;
  height: 480px;
  width: 100%;
  border-radius: 15px;
  overflow: hidden;
}

/* Con 5 imágenes activa tercera columna */
.galeria-grid:has(.fotos-secundarias-col:nth-child(3)) {
  grid-template-columns: 2fr 1fr 1fr;
}

.foto-grande {
  grid-row: 1 / 3;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.foto-grande img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 15px 0 0 15px;
}

.foto-grande.full-width img {
  border-radius: 15px;
}

.fotos-secundarias-col {
  display: contents;
  height: 100%;
}

.fotos-secundarias-col img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* Bordes redondeados de las secundarias */
.fotos-secundarias-col:last-child img:first-child { border-radius: 0 15px 0 0; }
.fotos-secundarias-col:last-child img:last-child { border-radius: 0 0 15px 0; }
.fotos-secundarias-col:not(:last-child) img:first-child { border-radius: 0; }
.fotos-secundarias-col:not(:last-child) img:last-child { border-radius: 0; }

.sin-fotos {
  height: 480px;
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
    grid-template-rows: 250px;
    height: 250px;
  }
  .fotos-secundarias-col { display: none; }
  .foto-grande { grid-row: 1; }
  .foto-grande img { border-radius: 12px; }
}
</style>