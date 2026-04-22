<template>
  <div class="galeria-grid" :class="{ 'solo-una': misImagenes.length === 1 }" v-if="misImagenes.length > 0">
    <div class="foto-grande" :class="{ 'full-width': misImagenes.length === 1 }">
      <!-- Soporta tanto array de strings como objetos de la BD -->
      <img :src="misImagenes[0]?.URL || misImagenes[0]" alt="Hotel Vista Exterior">
    </div>

    <div class="fotos-secundarias-col" v-if="misImagenes.length > 1">
      <img v-if="misImagenes[1]" :src="misImagenes[1]?.URL || misImagenes[1]" class="foto-pequena border-top-right">

      <div class="fila-abajo" v-if="misImagenes.length > 2">
        <img v-if="misImagenes[2]" :src="misImagenes[2]?.URL || misImagenes[2]" class="foto-pequena border-bottom-left-fix">
        <img v-if="misImagenes[3]" :src="misImagenes[3]?.URL || misImagenes[3]" class="foto-pequena border-bottom-right">
      </div>
    </div>
  </div>
  <div v-else class="img-sin-foto-detalle" style="height: 480px; display: flex; align-items: center; justify-content: center; background: #f0f0f0; border-radius: 15px;">
     <div style="text-align: center; color: #999;">
        <i class="fas fa-image fa-3x"></i>
        <p>No hay imágenes disponibles para este hospedaje</p>
     </div>
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
/* Contenedor principal de la galería */
.galeria-grid {
  display: grid;
  /* Dividimos en dos columnas: la primera es 1.5 veces más ancha que la segunda */
  grid-template-columns: 1.5fr 1fr;
  /* Espacio de 12px entre todas las fotos (gap) */
  gap: 12px;
  /* Altura fija para que todas las fotos se alineen perfectamente */
  height: 480px; 
  width: 100%;
  margin-bottom: 30px;
}

/* Estilos generales para todas las imágenes de la galería */
img {
  width: 100%;
  height: 100%;
  object-fit: cover; /* Mantiene la proporción sin estirar la foto */
  display: block;
}

/* Estilos específicos para la columna 1 (Foto Grande) */
.foto-grande img {
  border-radius: 15px 0 0 15px; /* Bordes redondeados solo a la izquierda */
}

.foto-grande.full-width img {
  border-radius: 15px;
}

/* Estilos para la columna 2 (fotos pequeñas) */
.fotos-secundarias-col {
  display: grid;
  /* Esta columna se divide en dos filas: una para la foto de arriba y otra para las de abajo */
  grid-template-rows: 1fr 1fr; 
  gap: 12px;
}

/* Bordes redondeados para la foto de arriba a la derecha */
.border-top-right {
  border-radius: 0 15px 0 0;
}

/* Estilos para la fila inferior de la columna derecha (2 fotos pequeñas) */
.fila-abajo {
  display: grid;
  /* Se divide en dos columnas iguales */
  grid-template-columns: 1fr 1fr; 
  gap: 12px;
}

/* Borde redondeado para la última foto (abajo a la derecha) */
.border-bottom-right {
  border-radius: 0 0 15px 0;
}

/* Esta clase es opcional, depende de si quieres redondear el borde interior */
.border-bottom-left-fix {
    border-radius: 0;
}
</style>