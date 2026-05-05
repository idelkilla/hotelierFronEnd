<template>
  <div class="galeria-grid" v-if="misImagenes.length > 0">
    
    <!-- Foto grande izquierda -->
    <div class="foto-grande">
      <img :src="misImagenes[0]?.URL || misImagenes[0]" alt="Vista Principal">
    </div>

    <!-- Grid 2x2 derecha -->
    <div class="fotos-grid-derecha" v-if="misImagenes.length > 1">
      <img v-if="misImagenes[1]" :src="misImagenes[1]?.URL || misImagenes[1]" class="top-left">
      <img v-if="misImagenes[2]" :src="misImagenes[2]?.URL || misImagenes[2]" class="top-right">
      <img v-if="misImagenes[3]" :src="misImagenes[3]?.URL || misImagenes[3]" class="bottom-left">
      <img v-if="misImagenes[4]" :src="misImagenes[4]?.URL || misImagenes[4]" class="bottom-right">
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
  grid-template-columns: 1fr 1fr;
  gap: 8px;
  height: 380px;
  width: 100%;
  border-radius: 15px;
  overflow: hidden;
}

/* --- Foto grande izquierda --- */
.foto-grande {
  height: 100%;
  overflow: hidden;
}

.foto-grande img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 15px 0 0 15px;
}

/* --- Grid 2x2 derecha --- */
.fotos-grid-derecha {
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: 1fr 1fr;
  gap: 8px;
  height: 100%;
}

.fotos-grid-derecha img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 0;
}

/* Bordes redondeados solo en las esquinas exteriores */
.fotos-grid-derecha img.top-right {
  border-radius: 0 15px 0 0;
}
.fotos-grid-derecha img.bottom-right {
  border-radius: 0 0 15px 0;
}

/* --- Sin fotos --- */
.sin-fotos {
  height: 380px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f0f0f0;
  border-radius: 15px;
  color: #999;
}

/* --- Mobile --- */
@media (max-width: 768px) {
  .galeria-grid {
    grid-template-columns: 1fr;
    height: 200px;
  }
  .fotos-grid-derecha { display: none; }
  .foto-grande img { border-radius: 12px; }
}
</style>