<template>
  <div class="galeria-grid">
    <div class="foto-grande">
      <img :src="misImagenes[0]" alt="Hotel Vista Exterior">
    </div>

    <div class="fotos-secundarias-col">
      <img :src="misImagenes[1]" class="foto-pequena border-top-right">

      <div class="fila-abajo">
        <img :src="misImagenes[2]" class="foto-pequena border-bottom-left-fix">
        <img :src="misImagenes[3]" class="foto-pequena border-bottom-right">
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

// --- PASO A: Imágenes fijas de internet (SOLO TEMPORAL) ---
const misImagenes = ref([
  'https://images.pexels.com/photos/271639/pexels-photo-271639.jpeg?auto=compress&cs=tinysrgb&w=800', // Grande Izquierda
  'https://images.pexels.com/photos/164595/pexels-photo-164595.jpeg?auto=compress&cs=tinysrgb&w=400', // Derecha Arriba
  'https://images.pexels.com/photos/261102/pexels-photo-261102.jpeg?auto=compress&cs=tinysrgb&w=400', // Derecha Abajo Izq
  'https://images.pexels.com/photos/189296/pexels-photo-189296.jpeg?auto=compress&cs=tinysrgb&w=400'  // Derecha Abajo Der
]);

// --- PASO B: Preparación para Base de Datos ---
// Cuando la base de datos funcione, borramos el Paso A y usamos esto:
// defineProps(['imagenesBd']); 
// Y en el template cambiamos 'misImagenes' por 'imagenesBd'.
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