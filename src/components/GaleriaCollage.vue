<template>
  <div class="galeria-grid" :class="gridClass" v-if="misImagenes.length > 0">
    <!-- Foto grande izquierda -->
    <div class="foto-grande">
      <img :src="misImagenes[0]?.URL || misImagenes[0]" alt="Vista Principal" />
    </div>

    <!-- Columna del medio -->
    <div class="fotos-secundarias-col" v-if="misImagenes.length > 1">
      <img
        v-if="misImagenes[1]"
        :src="misImagenes[1]?.URL || misImagenes[1]"
        :class="{ 'border-top-right': misImagenes.length <= 3 }"
      />
      <img
        v-if="misImagenes[2]"
        :src="misImagenes[2]?.URL || misImagenes[2]"
        :class="{ 'border-bottom-right': misImagenes.length <= 3 }"
      />
    </div>

    <!-- Columna derecha -->
    <div class="fotos-secundarias-col ultima-col" v-if="misImagenes.length > 3">
      <img v-if="misImagenes[3]" :src="misImagenes[3]?.URL || misImagenes[3]" />
      <img v-if="misImagenes[4]" :src="misImagenes[4]?.URL || misImagenes[4]" />
    </div>
  </div>

  <div v-else class="sin-fotos">
    <p>No hay imágenes disponibles</p>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  imagenesBd: {
    type: Array,
    default: () => [],
  },
})

const misImagenes = computed(() => props.imagenesBd)

const gridClass = computed(() => {
  const n = misImagenes.value.length
  if (n === 1) return 'solo-una'
  if (n <= 3) return 'dos-cols'
  return 'tres-cols'
})
</script>

<style scoped>
.galeria-grid {
  display: grid;
  grid-template-rows: 1fr 1fr;
  gap: 8px;
  height: 380px;
  width: 100%;
  border-radius: 15px;
  overflow: hidden;
}

/* Layout con 3 columnas (5 fotos) */
.galeria-grid.tres-cols {
  grid-template-columns: 2fr 1fr 1fr;
}

/* Layout con 2 columnas (2-3 fotos) */
.galeria-grid.dos-cols {
  grid-template-columns: 2fr 1fr;
}

/* Layout solo 1 foto */
.galeria-grid.solo-una {
  grid-template-columns: 1fr;
}

/* --- Foto grande --- */
.foto-grande {
  grid-column: 1;
  grid-row: 1 / 3;
  overflow: hidden;
}

.foto-grande img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 15px 0 0 15px;
}

.solo-una .foto-grande img {
  border-radius: 15px;
}

/* --- Columnas secundarias --- */
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
  border-radius: 0;
}

/* Bordes de la última columna visible */

/* Cuando hay solo 2 cols (col del medio es la última) */
.dos-cols .fotos-secundarias-col img:first-child {
  border-radius: 0 15px 0 0;
}
.dos-cols .fotos-secundarias-col img:last-child {
  border-radius: 0 0 15px 0;
}

/* Cuando hay 3 cols, bordes solo en la última columna */
.tres-cols .ultima-col img:first-child {
  border-radius: 0 15px 0 0;
}
.tres-cols .ultima-col img:last-child {
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
    grid-template-columns: 1fr !important;
    height: 200px;
  }
  .fotos-secundarias-col {
    display: none;
  }
  .foto-grande {
    grid-row: 1;
    grid-column: 1;
  }
  .foto-grande img {
    border-radius: 12px !important;
  }
}
</style>
