<template>
  <div class="main-container">
    <Header />
    <BuscadorPrincipal :is-detalle="true" />

    <div class="layout-detalle">
      <GaleriaCollage :imagenesBd="imagenesHotel" />
    </div>
    <div class="layout-detalle" style="gap: 0">
      <DetallesHotel />
    </div>

    <FooterComponent />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import Header from '../components/Header.vue'
import BuscadorPrincipal from '../components/MenuDet.vue'
import GaleriaCollage from '../components/GaleriaCollage.vue'
import DetallesHotel from '../components/DetallesHotel.vue'
import FooterComponent from '../components/footer.vue'
import { API, apiFetch } from '../services/api'

const route = useRoute()
const BASE = API

const imagenesHotel = ref([])

onMounted(async () => {
  const id = route.params.id
  if (!id) return 
  try {
    const data = await apiFetch(`/hospedaje/${id}/imagenes`)
    if (Array.isArray(data)) {
      imagenesHotel.value = data
      console.log('✅ Imágenes cargadas:', data.length)
    } else {
      console.warn('El backend no devolvió un array de imágenes:', data)
    }
  } catch (e) {
    console.error('Fallo al conectar con el backend (Imágenes):', e.message)
  }
})
</script>

<style scoped>
.main-container {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 80px; /* Espacio justo para el header fijo */
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
  .main-container { padding-top: 100px; }
  .layout-detalle { width: 95%; margin: 10px auto; gap: 15px; }
}
</style>