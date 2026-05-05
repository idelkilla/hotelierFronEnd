<template>
  <div class="main-container">
    <Header />
    <BuscadorPrincipal />

    <div class="layout-detalle">
      <GaleriaCollage :imagenesBd="imagenesHotel" />
    </div>
    <div class="layout-detalle" style="gap: 0">
      <DetallesHotel />
    </div>

    <div class="layout-detalle">
      <Reviewssection />
    </div>
    <FooterComponent />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import Header from '../components/Header.vue'
import BuscadorPrincipal from '../components/MenuDet.vue'
import GaleriaCollage from '../components/GaleriaCollage.vue'
import DetallesHotel from '../components/DetallesHotel.vue'
import Reviewssection from '../components/Reviewssection.vue'
import FooterComponent from '../components/footer.vue'

const route = useRoute()
const BASE = import.meta.env.VITE_API_URL || 'https://hotelierbackend-1.onrender.com/api'

const imagenesHotel = ref([])

onMounted(async () => {
  const id = route.params.id
  try {
    const res = await fetch(`${BASE}/hospedaje/${id}/imagenes`)
    if (!res.ok) throw new Error(`Error HTTP: ${res.status}`)
    
    const data = await res.json()
    if (Array.isArray(data)) {
      imagenesHotel.value = data
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