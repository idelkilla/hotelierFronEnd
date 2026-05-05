<template>
  <div class="galeria-grid" :class="layoutClass" v-if="misImagenes.length > 0">
    
    <!-- Foto grande izquierda -->
    <div class="foto-grande">
      <img :src="misImagenes[0]?.URL || misImagenes[0]" alt="Vista Principal">
    </div>

    <!-- 2 imágenes: solo una columna derecha apilada -->
    <template v-if="misImagenes.length >= 2 && misImagenes.length <= 3">
      <div class="fotos-secundarias-col">
        <img v-if="misImagenes[1]" :src="misImagenes[1]?.URL || misImagenes[1]" class="top-right-img">
        <img v-if="misImagenes[2]" :src="misImagenes[2]?.URL || misImagenes[2]" class="bottom-right-img">
      </div>
    </template>

    <!-- 4-5 imágenes: grid 2x2 a la derecha -->
    <div class="fotos-grid-derecha" v-if="misImagenes.length >= 4">
      <img v-if="misImagenes[1]" :src="misImagenes[1]?.URL || misImagenes[1]">
      <img v-if="misImagenes[2]" :src="misImagenes[2]?.URL || misImagenes[2]" class="top-right">
      <img v-if="misImagenes[3]" :src="misImagenes[3]?.URL || misImagenes[3]">
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

const layoutClass = computed(() => {
  const n = misImagenes.value.length;
  if (n === 1) return 'layout-1';
  if (n <= 3) return 'layout-2';  // foto grande + columna derecha
  return 'layout-5';              // foto grande + 2x2
});
</script>

<style scoped>
/* =====================
   BASE
   ===================== */
.galeria-grid {
  display: grid;
  gap: 8px;
  height: 380px;
  width: 100%;
  border-radius: 15px;
  overflow: hidden;
}

/* =====================
   LAYOUT 1 FOTO
   ===================== */
.layout-1 {
  grid-template-columns: 1fr;
}
.layout-1 .foto-grande img {
  border-radius: 15px;
}

/* =====================
   LAYOUT 2-3 FOTOS
   foto grande | columna apilada
   ===================== */
.layout-2 {
  grid-template-columns: 1fr 1fr;
}

.fotos-secundarias-col {
  display: flex;
  flex-direction: column;
  gap: 8px;
  height: 100%;
}

.fotos-secundarias-col img {
  width: 100%;
  flex: 1;
  object-fit: cover;
}

/* Si solo hay 1 imagen en la columna derecha, borde completo derecho */
.fotos-secundarias-col img:only-child {
  border-radius: 0 15px 15px 0;
}
.fotos-secundarias-col img.top-right-img {
  border-radius: 0 15px 0 0;
}
.fotos-secundarias-col img.bottom-right-img {
  border-radius: 0 0 15px 0;
}

/* =====================
   LAYOUT 4-5 FOTOS
   foto grande | 2x2
   ===================== */
.layout-5 {
  grid-template-columns: 2fr 1fr;
}

.fotos-grid-derecha {
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: 1fr 1fr;
  gap: 8px;
  height: 100%;
  overflow: hidden;
}

.fotos-grid-derecha img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.fotos-grid-derecha img.top-right {
  border-radius: 0 15px 0 0;
}
.fotos-grid-derecha img.bottom-right {
  border-radius: 0 0 15px 0;
}

/* =====================
   FOTO GRANDE (compartida)
   ===================== */
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

/* =====================
   SIN FOTOS
   ===================== */
.sin-fotos {
  height: 380px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f0f0f0;
  border-radius: 15px;
  color: #999;
}

/* =====================
   MOBILE
   ===================== */
@media (max-width: 768px) {
  .galeria-grid {
    grid-template-columns: 1fr !important;
    height: 200px;
  }
  .fotos-secundarias-col,
  .fotos-grid-derecha { display: none; }
  .foto-grande img { border-radius: 12px !important; }
}
</style>