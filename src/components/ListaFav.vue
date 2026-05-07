<template>
  <div class="favoritos">

    <!-- HEADER -->
    <div class="header">
      <div class="header-left">
        <h2>Mis favoritos</h2>
        <p class="subtitle" v-if="!cargando && !error">
          {{ favoritos.length }} hospedaje{{ favoritos.length !== 1 ? 's' : '' }} guardado{{ favoritos.length !== 1 ? 's' : '' }}
        </p>
      </div>
    </div>

    <!-- CARGANDO -->
    <div v-if="cargando" class="estado-wrap">
      <div class="skeleton" v-for="n in 3" :key="n"></div>
    </div>

    <!-- ERROR -->
    <div v-else-if="error" class="estado-wrap estado-error">
      <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
      <p>{{ error }}</p>
    </div>

    <!-- LISTA -->
    <div v-else-if="favoritos.length > 0" class="lista">
      <div
        class="hotel-card"
        v-for="hotel in favoritos"
        :key="hotel.id"
        @click="irADetalle(hotel.id)"
      >
        <!-- Imagen -->
        <div class="img-wrap">
          <img
            :src="hotel.imagen || defaultImage"
            :alt="hotel.nombre || 'Hospedaje favorito'"
            @error="onImageError($event)"
          />
          <!-- Botón corazón encima de la imagen -->
          <button
            class="heart-btn"
            @click.stop="quitarFavorito(hotel.id)"
            title="Quitar de favoritos"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="#e00" stroke="#e00" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
              <path d="M19.5 12.572l-7.5 7.428l-7.5 -7.428a5 5 0 1 1 7.5 -6.566a5 5 0 1 1 7.5 6.572"/>
            </svg>
          </button>
        </div>

        <!-- Info -->
        <div class="info">
          <div class="info-top">
            <div>
              <p class="location">{{ hotel.location || 'Ubicación' }}</p>
              <h3>{{ hotel.nombre || 'Hospedaje sin nombre' }}</h3>
              <p class="description">{{ hotel.descripcion || 'Hospedaje seleccionado por su excelente ubicación, confort y calidad de servicio.' }}</p>
            </div>
          </div>

          <div class="info-footer">
            <div class="tags">
              <span class="tag">{{ hotel.amenidad || 'Hospedaje' }}</span>
            </div>
            <div class="precio-wrap">
              <span class="precio">${{ hotel.precio ?? 0 }}</span>
              <span class="precio-label">por noche</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- VACÍO -->
    <div v-else class="estado-wrap estado-vacio">
      <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M19.5 12.572l-7.5 7.428l-7.5 -7.428a5 5 0 1 1 7.5 -6.566a5 5 0 1 1 7.5 6.572"/>
      </svg>
      <p>No tienes hospedajes guardados aún.</p>
      <button class="btn-explorar" @click="$router.push('/hospedajes')">Explorar hospedajes</button>
    </div>

  </div>
</template>

<script>
import { apiFetch } from '../services/api'

export default {
  name: 'Favoritos',
  data() {
    return {
      defaultImage: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&q=80',
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
      this.error = null
      try {
        const data = await apiFetch('/favoritos')
        this.favoritos = data.map(h => ({
          ...h,
          location: `${h.ciudad}, ${h.pais}`,
          imagen:   h.imagen,
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
    irADetalle(id) {
      const hoy = new Date()
      // Calculamos el próximo viernes
      const diffViernes = (5 - hoy.getDay() + 7) % 7
      const proximoViernes = new Date(hoy)
      proximoViernes.setDate(hoy.getDate() + (diffViernes === 0 ? 7 : diffViernes))
      
      // Calculamos el domingo siguiente al viernes
      const proximoDomingo = new Date(proximoViernes)
      proximoDomingo.setDate(proximoViernes.getDate() + 2)

      this.$router.push({
        path: `/hospedaje/${id}`,
        query: {
          entrada: proximoViernes.toISOString().split('T')[0],
          salida:  proximoDomingo.toISOString().split('T')[0],
          huespedes: JSON.stringify([{ adultos: 2, ninos: 0, edadesNinos: [] }])
        }
      })
    },
    onImageError(e) {
      e.target.src = this.defaultImage
    }
  }
}
</script>

<style scoped>
/* CONTENEDOR */
.favoritos {
  max-width: 900px;
  margin: 0 auto;
  padding: 40px 24px 80px;
  font-family: 'DM Sans', sans-serif;
  color: #113955;
}

/* HEADER */
.header {
  margin-bottom: 32px;
  border-bottom: 1px solid #e8eef3;
  padding-bottom: 24px;
}
.eyebrow {
  font-size: 11px;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: #7a9bb5;
  margin: 0 0 6px;
}
h2 {
  font-size: 28px;
  font-weight: 700;
  color: #113955;
  margin: 0 0 4px;
  line-height: 1.15;
}
.subtitle {
  font-size: 13px;
  color: #7a9bb5;
  margin: 0;
}

/* SKELETON */
.skeleton {
  height: 160px;
  background: linear-gradient(90deg, #f0f4f8 25%, #e4eaf0 50%, #f0f4f8 75%);
  background-size: 200% 100%;
  animation: shimmer 1.4s infinite;
  border-radius: 14px;
  margin-bottom: 16px;
}
@keyframes shimmer {
  0%   { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}

/* ESTADOS */
.estado-wrap {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80px 24px;
  gap: 14px;
  color: #7a9bb5;
  text-align: center;
}
.estado-error { color: #c0392b; }
.estado-vacio svg { opacity: 0.35; }
.estado-vacio p {
  font-size: 15px;
  color: #7a9bb5;
  margin: 0;
}
.btn-explorar {
  margin-top: 8px;
  background: #113955;
  color: #fff;
  border: none;
  border-radius: 24px;
  padding: 10px 24px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
}
.btn-explorar:hover { background: #1a5276; }

/* LISTA */
.lista {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

/* CARD — horizontal igual que los resultados de búsqueda */
.hotel-card {
  display: flex;
  background: #fff;
  border: 1px solid #dde7ef;
  border-radius: 14px;
  overflow: hidden;
  cursor: pointer;
  transition: box-shadow 0.25s, transform 0.25s;
}
.hotel-card:hover {
  box-shadow: 0 8px 28px -8px rgba(17, 57, 85, 0.14);
  transform: translateY(-2px);
}

/* IMAGEN */
.img-wrap {
  position: relative;
  width: 220px;
  min-width: 220px;
  height: 160px;
  flex-shrink: 0;
}
.img-wrap img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

/* BOTÓN CORAZÓN */
.heart-btn {
  position: absolute;
  top: 10px;
  right: 10px;
  width: 32px;
  height: 32px;
  background: rgba(255,255,255,0.88);
  border: none;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  backdrop-filter: blur(4px);
  transition: background 0.2s, transform 0.15s;
  box-shadow: 0 1px 4px rgba(0,0,0,0.12);
}
.heart-btn:hover {
  background: #fff;
  transform: scale(1.1);
}

/* INFO */
.info {
  flex: 1;
  padding: 18px 20px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  min-width: 0;
}
.info-top { flex: 1; }

.location {
  font-size: 11px;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: #7a9bb5;
  margin: 0 0 4px;
}
.info h3 {
  font-size: 17px;
  font-weight: 700;
  color: #113955;
  margin: 0 0 6px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.description {
  font-size: 12.5px;
  color: #7a9bb5;
  line-height: 1.55;
  margin: 0;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* FOOTER DE CARD */
.info-footer {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  margin-top: 14px;
  gap: 12px;
}
.tags { display: flex; gap: 6px; flex-wrap: wrap; }
.tag {
  font-size: 11px;
  color: #2980b9;
  background: #eaf4fb;
  border: 1px solid #c5dff0;
  padding: 3px 10px;
  border-radius: 20px;
  white-space: nowrap;
}

.precio-wrap {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  flex-shrink: 0;
}
.precio {
  font-size: 18px;
  font-weight: 700;
  color: #113955;
}
.precio-label {
  font-size: 10.5px;
  color: #7a9bb5;
}

/* RESPONSIVE */
@media (max-width: 600px) {
  .hotel-card { flex-direction: column; }
  .img-wrap {
    width: 100%;
    min-width: unset;
    height: 180px;
  }
}
</style>