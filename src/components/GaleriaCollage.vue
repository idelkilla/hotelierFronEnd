<template>
  <div class="contenedor-limpio">
    <div class="galeria-grid">
      <div class="foto-principal">
        <img src="https://images.pexels.com/photos/271639/pexels-photo-271639.jpeg" alt="Principal">
      </div>

      <div class="bloque-secundario">
        <img src="https://images.pexels.com/photos/164595/pexels-photo-164595.jpeg" class="img-top">
        
        <div class="fila-inferior">
          <img src="https://images.pexels.com/photos/261102/pexels-photo-261102.jpeg">
          <img src="https://images.pexels.com/photos/189296/pexels-photo-189296.jpeg" class="img-bottom-right">
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.contenedor-limpio {
  background-color: white;
  width: 100%;
  /* Si quieres que toque totalmente el borde superior/inferior, cambia a 0 */
  padding: -30px; 
}

.galeria-grid {
  display: grid;
  grid-template-columns: 1.8fr 1fr;
  gap: 8px;           
  height: 350px;
  
  /* CAMBIOS AQUÍ */
  width: 100%;       /* Ocupa el ancho completo */
  margin: 0;         /* Elimina el margen automático */
}

.bloque-secundario {
  display: grid;
  grid-template-rows: 1fr 1fr;
  gap: 8px;
}

.fila-inferior {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
}

img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

/* Bordes redondeados */
.foto-principal img { border-radius: 12px 0 0 12px; }
.img-top { border-radius: 0 12px 0 0; }
.img-bottom-right { border-radius: 0 0 12px 0; }
</style>