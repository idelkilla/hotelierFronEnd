<template>
  <section class="ofs-wrapper">
    <div class="ofs-container">

      <!-- Header -->
      <div class="ofs-header" v-if="!loading && !error">
        <div class="ofs-header__left">
          <h2 class="ofs-title">Ofertas de última hora para el fin de semana</h2>
          <p class="ofs-subtitle">Descuento mínimo del 20% para tu próxima escapada de fin de semana</p>
        </div>
        <button class="ofs-btn-all">Ver todas las ofertas</button>
      </div>

      <!-- Loading / Error States -->
      <div v-if="loading" class="ofs-loading">
        <span class="spinner"></span>
        <p>Buscando las mejores ofertas...</p>
      </div>

      <div v-else-if="error" class="ofs-error">
        <p>{{ error }}</p>
      </div>

      <!-- Grid -->
      <div class="ofs-grid">
        <div
          v-for="hotel in hotels"
          :key="hotel.id"
          class="ofs-card"
        >
          <!-- Imagen con carrusel -->
          <div class="ofs-card__img-wrap">
            <img
              :src="hotel.images[currentImage[hotel.id] || 0]"
              :alt="hotel.name"
              class="ofs-card__img"
            />

            <span v-if="hotel.vip" class="ofs-card__vip">VIP Access</span>

            <button
              class="ofs-card__fav"
              :class="{ 'ofs-card__fav--active': favorites.includes(hotel.id) }"
              @click.stop="toggleFav(hotel.id)"
            >
              ♥
            </button>

            <button class="ofs-card__arr ofs-card__arr--l" @click.stop="prevImg(hotel)">‹</button>
            <button class="ofs-card__arr ofs-card__arr--r" @click.stop="nextImg(hotel)">›</button>
          </div>

          <!-- Info -->
          <div class="ofs-card__body">
            <div class="ofs-card__name">{{ hotel.name }}</div>
            <div class="ofs-card__loc">{{ hotel.location }}</div>

            <div class="ofs-card__rating">
              <span class="ofs-rating-badge">{{ hotel.score }}</span>
              <span class="ofs-rating-label">{{ ratingLabel(hotel.score) }}</span>
              <span class="ofs-rating-count">({{ hotel.reviews }} opiniones)</span>
            </div>

            <div
              class="ofs-disc-badge"
              :class="hotel.vip ? 'ofs-disc-badge--vip' : 'ofs-disc-badge--green'"
            >
              <span v-if="hotel.vip">🏷 Precio para socios: ${{ hotel.discountAmount }} de dto.</span>
              <span v-else>${{ hotel.discountAmount }} de dto.</span>
            </div>

            <div class="ofs-price-per-night">${{ hotel.pricePerNight }} por noche</div>
            <div class="ofs-price-total">
              ${{ hotel.discountedTotal }} <s>${{ hotel.originalTotal }}</s>
            </div>
            <div class="ofs-price-per-night">${{ hotel.pricePerNight }} por noche</div>
            <div class="ofs-price-taxes">Total con impuestos y cargos</div>
            <a href="#" class="ofs-taxes-link">✓ Total con impuestos y cargos</a>
          </div>
        </div>
      </div>

    </div>
  </section>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { apiFetch } from '../services/api'

const hotels       = ref([])
const loading      = ref(true)
const error        = ref(null)
const favorites    = ref([])
const currentImage = ref({})

onMounted(async () => {
  try {
    const data = await apiFetch('/hospedajes/ofertas-finde')
    hotels.value = data.map(h => ({
      id:              h.id,
      name:            h.nombre,
      location:        `${h.ciudad}, ${h.pais}`,
      score:           0,
      reviews:         0,
      vip:             false,
      discountAmount:  Number(h.ahorro_noche),
      pricePerNight:   Number(h.precio_noche_oferta),
      discountedTotal: Number(h.precio_noche_oferta) * 2,
      originalTotal:   Number(h.precio_noche_original) * 2,
      images:          (h.imagenes ?? []).map(i => i.url),
    }))
  } catch (e) {
    error.value = 'No se pudieron cargar las ofertas.'
  } finally {
    loading.value = false
  }
})

function toggleFav(id) {
  const i = favorites.value.indexOf(id)
  if (i === -1) favorites.value.push(id)
  else favorites.value.splice(i, 1)
}

function prevImg(hotel) {
  const cur = currentImage.value[hotel.id] || 0
  currentImage.value[hotel.id] = (cur - 1 + hotel.images.length) % hotel.images.length
}

function nextImg(hotel) {
  const cur = currentImage.value[hotel.id] || 0
  currentImage.value[hotel.id] = (cur + 1) % hotel.images.length
}

function ratingLabel(score) {
  if (score >= 9.5) return 'Excepcional'
  if (score >= 9)   return 'Excepcional'
  if (score >= 8.5) return 'Excelente'
  if (score >= 8)   return 'Muy buena'
  if (score >= 7)   return 'Buena'
  return 'Aceptable'
}
</script>

<style scoped>
/* ── Wrapper: mismo padding/estructura que .page-wrapper ── */
.ofs-wrapper {
  background-color: #ffffff;
  padding: 3rem 2rem;
  font-family: 'Inter', sans-serif;
  display: flex;
  justify-content: center;
  border-bottom: 1px solid #e2e2e2;
}

.ofs-container {
  max-width: 1152px;
  width: 100%;
}

/* ── Header ── */
.ofs-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1.5rem;
  gap: 1rem;
}

.ofs-title {
  font-size: 24px;
  font-weight: 600;
  color: #191e3b;
  letter-spacing: -0.02em;
  margin-bottom: 4px;
  line-height: 1.3;
}

.ofs-subtitle {
  font-size: 14px;
  color: #444444;
}

.ofs-btn-all {
  padding: 8px 20px;
  border: 1.5px solid #191e3b;
  border-radius: 9999px;
  color: #191e3b;
  font-size: 14px;
  font-weight: 600;
  background: none;
  cursor: pointer;
  white-space: nowrap;
  flex-shrink: 0;
  transition: background 0.2s, color 0.2s;
  font-family: 'Inter', sans-serif;
}
.ofs-btn-all:hover { background: #191e3b; color: #fff; }

/* ── Grid ── */
.ofs-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
}

/* ── Card ── */
.ofs-card { cursor: pointer; }

.ofs-card__img-wrap {
  position: relative;
  border-radius: 12px;
  overflow: hidden;
  aspect-ratio: 4 / 3;
}

.ofs-card__img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  transition: transform 0.4s ease;
}
.ofs-card:hover .ofs-card__img { transform: scale(1.04); }

.ofs-card__vip {
  position: absolute;
  top: 10px;
  left: 10px;
  background: #191e3b;
  color: #fff;
  font-size: 11px;
  font-weight: 600;
  padding: 4px 8px;
  border-radius: 6px;
  z-index: 2;
}

.ofs-card__fav {
  position: absolute;
  top: 8px;
  right: 8px;
  width: 32px;
  height: 32px;
  background: #fff;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2;
  cursor: pointer;
  border: none;
  font-size: 16px;
  color: #d1d5db;
  box-shadow: 0 1px 4px rgba(0,0,0,0.2);
  transition: transform 0.2s, color 0.2s;
}
.ofs-card__fav:hover         { transform: scale(1.15); }
.ofs-card__fav--active       { color: #e11d48; }

.ofs-card__arr {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 28px;
  height: 28px;
  background: rgba(255,255,255,0.88);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 2;
  font-size: 16px;
  color: #191e3b;
  border: none;
  box-shadow: 0 1px 4px rgba(0,0,0,0.2);
  transition: background 0.2s;
}
.ofs-card__arr:hover         { background: #fff; }
.ofs-card__arr--l            { left: 8px; }
.ofs-card__arr--r            { right: 8px; }

/* ── Card body ── */
.ofs-card__body { padding: 10px 2px 0; }

.ofs-card__name {
  font-size: 14px;
  font-weight: 600;
  color: #191e3b;
  margin-bottom: 2px;
  line-height: 1.3;
}

.ofs-card__loc {
  font-size: 13px;
  color: #6b7280;
  margin-bottom: 6px;
}

.ofs-card__rating {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 8px;
}

.ofs-rating-badge {
  background: #0d6b3a;
  color: #fff;
  font-size: 11.5px;
  font-weight: 700;
  padding: 2px 7px;
  border-radius: 5px;
}
.ofs-rating-label { font-size: 13px; font-weight: 600; color: #191e3b; }
.ofs-rating-count { font-size: 12px; color: #6b7280; }

.ofs-disc-badge {
  display: inline-block;
  padding: 4px 9px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 600;
  margin-bottom: 6px;
}
.ofs-disc-badge--vip   { background: #191e3b; color: #facc15; }
.ofs-disc-badge--green { background: #166534; color: #bbf7d0; }

.ofs-price-per-night { font-size: 13px; color: #6b7280; margin-bottom: 1px; }

.ofs-price-total {
  font-size: 15px;
  font-weight: 700;
  color: #191e3b;
  margin-bottom: 1px;
}
.ofs-price-total s { color: #9ca3af; font-weight: 400; }

.ofs-price-taxes { font-size: 12px; color: #6b7280; margin-bottom: 4px; }

.ofs-taxes-link {
  font-size: 12px;
  color: #0d6b3a;
  font-weight: 500;
  text-decoration: none;
}
.ofs-taxes-link:hover { text-decoration: underline; }

/* ── States ── */
.ofs-loading, .ofs-error {
  text-align: center;
  padding: 3rem;
  color: #6b7280;
}

.spinner {
  width: 32px;
  height: 32px;
  border: 3px solid #e5e7eb;
  border-top-color: #191e3b;
  border-radius: 50%;
  display: inline-block;
  animation: spin 0.8s linear infinite;
  margin-bottom: 1rem;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.ofs-error {
  background: #fef2f2;
  border-radius: 12px;
  color: #dc2626;
}

/* ── Responsive ── */
@media (max-width: 1024px) {
  .ofs-grid { grid-template-columns: repeat(2, 1fr); }
}

@media (max-width: 600px) {
  .ofs-header   { flex-direction: column; }
  .ofs-grid     { grid-template-columns: 1fr; }
  .ofs-title    { font-size: 20px; }
}
</style>