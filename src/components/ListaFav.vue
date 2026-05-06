<template>
  <div class="favoritos">
    <!-- HEADER -->
    <div class="header">
      <p class="eyebrow">Curated Selection</p>
      <h2>Mis Hoteles Favoritos</h2>
      <p class="subtitle">Aquí se muestran todos los hoteles disponibles y tus favoritos.</p>
    </div>
<!-- Estados de carga/error -->
<div v-if="cargando" class="empty">Cargando favoritos...</div>
<div v-else-if="error" class="empty" style="color:#e05555">{{ error }}</div>
    <!-- GRID DE FAVORITOS -->
    <div v-if="favoritos.length > 0" class="grid">
      <div class="hotel-card" v-for="hotel in favoritos" :key="hotel.id">
        <!-- Imagen -->
        <div class="img-wrap">
          <img
            :src="hotel.imagen || defaultImage"
            :alt="hotel.nombre || 'Hotel favorito'"
            @error="onImageError($event)"
          />
          <div class="heart-badge">
            <svg viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.27 2 8.5 2 5.41 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.08C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.41 22 8.5c0 3.77-3.4 6.86-8.55 11.53L12 21.35z"/></svg>
          </div>
        </div>

        <!-- Info -->
        <div class="info">
          <p class="location">{{ hotel.location || 'Ubicación' }}</p>
          <h3>{{ hotel.nombre || 'Hotel sin nombre' }}</h3>
          <p class="description">
            {{ hotel.descripcion || 'Hotel seleccionado por su excelente ubicación, confort y calidad de servicio.' }}
          </p>

          <div class="meta-footer">
            <span class="price">${{ hotel.precio ?? 0 }} <small>/ noche</small></span>
            <span class="amenity">{{ hotel.amenidad || 'Servicio premium' }}</span>
          </div>

          <div class="btns">
            <button class="remove-btn" @click.stop="quitarFavorito(hotel.id)">Quitar</button>
            <button class="reservar-btn">Reservar</button>
          </div>

          <span class="badge">★ Favorito</span>
        </div>
      </div>
    </div>

    <!-- VACÍO -->
    <div v-else class="empty">
      No tienes hospedajes favoritos aún. ¡Explora y guarda los que te gusten! 🏨
    </div>
  </div>
</template>

<script>import { apiFetch } from '../services/api'  // ajusta el path si difiere

export default {
  name: "Favoritos",
  data() {
    return {
      defaultImage: "https://images.unsplash.com/photo-1566073771259-6a8506099945",
      favoritos: [],
      cargando: true,
      error: null
    }
  },
  async mounted() {
    await this.cargarFavoritos()
  },
  methods: {
    async cargarFavoritos() {
      this.cargando = true
      this.error    = null
      try {
        const data = await apiFetch('/favoritos')
        this.favoritos = data.map(h => ({
          ...h,
          location: `${h.ciudad}, ${h.pais}`,
          imagen:   h.imagen  || this.defaultImage,
          amenidad: h.tipo    || 'Hospedaje',
          precio:   h.precio  ? Math.round(Number(h.precio)) : 0,
          nombre:   h.nombre  || 'Hospedaje sin nombre',
        }))
      } catch (e) {
        this.error = 'No se pudieron cargar los favoritos. ¿Estás autenticado?'
      } finally {
        this.cargando = false
      }
    },
    async quitarFavorito(id) {
      try {
        await apiFetch(`/favoritos/${id}`, { method: 'DELETE' })
        this.favoritos = this.favoritos.filter(h => h.id !== id)
      } catch (e) {
        alert('Error al quitar favorito')
      }
    },
    onImageError(e) {
      e.target.src = this.defaultImage
    }
  }
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;600&family=DM+Sans:wght@300;400;500&display=swap');

/* VARIABLES */
:root {
  --primary: #265073;
  --accent: #2D9596;
  --mint: #9AD0C2;
  --cream: #ECF4D6;
}

/* CONTENEDOR */
.favoritos {
  max-width: 1200px;
  margin: 60px auto;
  padding: 40px;
  font-family: 'DM Sans', sans-serif;
  color: #265073;
  background: #ffffff;
}

/* HEADER */
.eyebrow {
  font-size: 10px;
  letter-spacing: 0.3em;
  text-transform: uppercase;
  color: #2D9596;
  margin-bottom: 10px;
}
h2 {
  font-family: 'Cormorant Garamond', serif;
  font-size: 42px;
  font-weight: 400;
  color: #265073;
  margin: 0 0 6px;
  line-height: 1.1;
}
.subtitle {
  font-size: 13px;
  color: rgba(38, 80, 115, 0.45);
  margin: 0 0 40px;
}
.empty {
  text-align: center;
  padding: 60px;
  color: rgba(38, 80, 115, 0.35);
  font-size: 14px;
}

/* GRID */
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 22px;
}

/* CARD */
.hotel-card {
  background: #fff;
  border-radius: 14px;
  overflow: hidden;
  border: 1px solid rgba(38, 80, 115, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;

  display: flex;
  flex-direction: column;
  height: 100%;
}
.hotel-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 12px 32px -10px rgba(38, 80, 115, 0.15);
}

/* IMAGEN */
.img-wrap {
  position: relative;
  width: 100%;
  height: 175px;
  overflow: hidden;
}
.img-wrap img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  transition: transform 0.4s ease;
}
.hotel-card:hover .img-wrap img {
  transform: scale(1.04);
}
.heart-badge {
  position: absolute;
  top: 12px;
  right: 12px;
  width: 30px;
  height: 30px;
  background: rgba(255, 255, 255, 0.85);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}
.heart-badge svg {
  width: 14px;
  height: 14px;
  fill: #2D9596;
  stroke: #2D9596;
  stroke-width: 1;
}

/* INFO */
.info {

  padding: 16px 18px 18px;
  display: flex;
  flex-direction: column;
  flex: 1;
  height: 100%;

}
.location {
  font-size: 10px;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: #9AD0C2;
  margin-bottom: 5px;
}
.info h3 {
  font-family: 'Cormorant Garamond', serif;
  font-size: 20px;
  font-weight: 400;
  color: #265073;
  margin: 0 0 8px;
  line-height: 1.2;
}
.description {
  font-size: 12px;
  color: rgba(38, 80, 115, 0.5);
  line-height: 1.65;
  margin: 0 0 14px;

  display: -webkit-box;
  -webkit-line-clamp: 3;
  line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;

  min-height: 60px;
}

/* FOOTER DE CARD */
.meta-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: 12px;
  border-top: 1px solid rgba(38, 80, 115, 0.07);
}
.price {
  font-size: 14px;
  font-weight: 500;
  color: #265073;
}
.price small {
  font-size: 10px;
  color: rgba(38, 80, 115, 0.4);
  font-weight: 300;
}
.amenity {
  font-size: 10px;
  color: #2D9596;
  background: rgba(45, 149, 150, 0.07);
  padding: 4px 10px;
  border-radius: 20px;
  border: 1px solid rgba(45, 149, 150, 0.18);
}

/* BOTONES */
.btns {
  display: flex;
  gap: 8px;
  margin-top: 12px;

   margin-top: auto;
}
.remove-btn {
  flex: 1;
  background: transparent;
  border: 1px solid rgba(38, 80, 115, 0.18);
  color: rgba(38, 80, 115, 0.5);
  font-size: 10px;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  padding: 8px 10px;
  border-radius: 20px;
  cursor: pointer;
  font-family: 'DM Sans', sans-serif;
  transition: all 0.2s;
}
.remove-btn:hover {
  border-color: rgba(38, 80, 115, 0.4);
  color: #265073;
}
.reservar-btn {
  flex: 1.5;
  background: #265073;
  border: none;
  color: #ECF4D6;
  font-size: 10px;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  padding: 8px 10px;
  border-radius: 20px;
  cursor: pointer;
  font-family: 'DM Sans', sans-serif;
  font-weight: 500;
  transition: background 0.2s;
}
.reservar-btn:hover {
  background: #2D9596;
}

/* BADGE */
.badge {
  display: inline-block;
  font-size: 9px;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: #2D9596;
  margin-top: 8px;
}
</style>
