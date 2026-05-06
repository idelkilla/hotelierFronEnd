<template>
  <section class="reviews-section">

    <!-- Header con score + subcategorías -->
    <div class="reviews-header">
      <div class="rating-summary">
        <span class="rating-score">{{ averageRating.toFixed(1) }}</span>
        <span class="rating-label-main">/10</span>
        <span class="rating-word">{{ palabraRating }}</span>
        <span class="rating-count">{{ reviews.length }} opiniones verificadas</span>
      </div>

      <div class="subcategories">
        <div class="subcat-row" v-for="cat in subcategorias" :key="cat.label">
          <span class="subcat-value">{{ cat.value.toFixed(1) }}</span>
          <span class="subcat-label">{{ cat.label }}</span>
        </div>
      </div>
    </div>

    <!-- Filtros -->
    <div class="reviews-filters">
      <button
        v-for="filter in filters"
        :key="filter.value"
        class="filter-btn"
        :class="{ active: activeFilter === filter.value }"
        @click="activeFilter = filter.value"
      >
        {{ filter.label }}
      </button>
    </div>

    <!-- Grid de reseñas 2 columnas -->
    <div class="reviews-grid">
      <article v-for="review in filteredReviews" :key="review.id" class="review-card">
        <div class="review-score-badge">{{ (review.rating * 2).toFixed(0) }}/10</div>
        <div class="review-body">
          <p class="review-rating-word">{{ palabraPorCalificacion(review.rating) }}</p>
          <p class="review-text" :class="{ expanded: review.expanded }">
            {{ review.text }}
          </p>
          <button
            v-if="review.text && review.text.length > 160"
            class="read-more"
            @click="review.expanded = !review.expanded"
          >
            {{ review.expanded ? 'Ver menos' : 'Ver más' }}
          </button>
          <p class="reviewer-name">{{ review.name }}</p>
          <p class="reviewer-meta">{{ review.date }}</p>
          <p class="verified-tag">Opinión verificada</p>
        </div>
      </article>
    </div>

    <!-- Ver todas -->
    <div class="ver-todas-wrapper">
      <button class="ver-todas-btn">Ver las {{ reviews.length }} opiniones</button>
    </div>

    <!-- Formulario -->
    <div class="write-review">
      <h3 class="write-title">Comparte tu experiencia</h3>
      <div class="star-input">
        <span
          v-for="i in 5" :key="i"
          class="star-select"
          :class="{ active: i <= newReview.rating, hover: i <= hoverRating }"
          @mouseover="hoverRating = i"
          @mouseleave="hoverRating = 0"
          @click="newReview.rating = i"
        >★</span>
        <span class="rating-label">{{ ratingLabel }}</span>
      </div>
      <textarea
        v-model="newReview.text"
        class="review-textarea"
        placeholder="Cuéntanos tu experiencia en este hospedaje..."
        rows="4"
      ></textarea>
      <button
        class="submit-btn"
        :disabled="!newReview.rating || !newReview.text"
        @click="submitReview"
      >
        Publicar reseña
      </button>
    </div>

  </section>
</template>
<script setup>
import { ref, computed, reactive, onMounted, watch } from 'vue'
import { apiFetch } from '../services/api'

const props = defineProps({
  hospedajeId: {
    type: [String, Number],
    required: true
  }
})

// ── Estado ──────────────────────────────────────────────────
const reviews = ref([])
const averageRating = computed(() => {
  if (!reviews.value.length) return 0
  const total = reviews.value.reduce((sum, r) => sum + r.calificacion, 0)
  return total / reviews.value.length
})

const activeFilter = ref('all')
const filters = [
  { label: 'Todas', value: 'all' },
  { label: 'Recientes', value: 'recent' }
]
const filteredReviews = computed(() => {
  let filtered = reviews.value
  if (activeFilter.value === 'recent') {
    // Assuming 'date' property exists and is sortable, or sort by id if no date
    filtered = [...filtered].sort((a, b) => b.id - a.id) // Example: sort by ID for 'recent'
  }
  return filtered
})

const newReview = reactive({ rating: 0, text: '' })
const hoverRating = ref(0)
const ratingLabel = computed(() => '')
const submitReview = () => { console.log('Enviando reseña...') }

const palabraRating = computed(() => {
  // Use averageRating.value here
  const v = averageRating.value * 2 // convierte escala 1-5 a 1-10
  if (v >= 9) return 'Excepcional'
  if (v >= 8) return 'Excelente'
  if (v >= 7) return 'Muy buena'
  if (v >= 6) return 'Buena'
  if (v >= 5) return 'Regular'
  return 'Baja'
})

watch(hoverRating, (newVal) => {
  if (newVal === 0) {
    ratingLabel.value = ''
    return
  }
  const v = newVal * 2
  if (v >= 9) ratingLabel.value = 'Excepcional'
  else if (v >= 8) ratingLabel.value = 'Excelente'
  else if (v >= 7) ratingLabel.value = 'Muy buena'
  else if (v >= 6) ratingLabel.value = 'Buena'
  else if (v >= 5) ratingLabel.value = 'Regular'
  else ratingLabel.value = 'Baja'
})

function palabraPorCalificacion(r) {
  const v = r * 2
  if (v >= 9) return 'Excepcional'
  if (v >= 8) return 'Excelente'
  if (v >= 7) return 'Muy buena'
  if (v >= 6) return 'Buena'
  if (v >= 5) return 'Regular'
  return 'Baja'
}

const subcategorias = computed(() => {
  if (!reviews.value.length) return []
  // Assuming 'calificacion' is the main rating.
  // For subcategories, we'd ideally have specific ratings (e.g., r.limpieza, r.servicios).
  // Since we only have 'calificacion', we'll use a weighted average or mock values for now.
  const baseAvg = averageRating.value * 2; // Convert to 1-10 scale
  return [
    { label: 'Limpieza',  value: Math.min(10, baseAvg * 0.95) }, // Slightly lower
    { label: 'Servicios', value: Math.min(10, baseAvg * 0.90) }, // Even lower
    { label: 'Ubicación', value: Math.min(10, baseAvg * 1.05) }, // Slightly higher
    { label: 'Calidad-precio', value: Math.min(10, baseAvg * 0.98) },
  ]
})

// ── Cargar reseñas ──────────────────────────────────────────
async function cargarResenas() {
  if (!props.hospedajeId) return
  try {
    const data = await apiFetch(`/hospedaje/${props.hospedajeId}/resenas`)
    if (Array.isArray(data)) {
      reviews.value = data.map(r => ({ ...r, expanded: false }))
    }
  } catch (e) {
    console.error('Error cargando reseñas:', e)
    reviews.value = []
  }
}

onMounted(cargarResenas)
watch(() => props.hospedajeId, cargarResenas)
</script>
<style scoped>
.reviews-section {
  font-family: 'Segoe UI', sans-serif;
  width: 100%;
  color: #1c2b3a;
}

/* ── Header ── */
.reviews-header {
  display: flex;
  align-items: center;
  gap: 3rem;
  margin-bottom: 1.5rem;
}

.rating-summary {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 2px;
  min-width: 120px;
}

.rating-score {
  font-size: 3rem;
  font-weight: 800;
  color: #1a3a5c;
  line-height: 1;
}

.rating-label-main {
  font-size: 1.1rem;
  color: #666;
  font-weight: 600;
}

.rating-word {
  font-size: 1rem;
  font-weight: 700;
  color: #1a3a5c;
}

.rating-count {
  font-size: 0.8rem;
  color: #888;
}

.subcategories {
  display: flex;
  gap: 2rem;
}

.subcat-row {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
}

.subcat-value {
  font-size: 1.3rem;
  font-weight: 700;
  color: #1a3a5c;
}

.subcat-label {
  font-size: 0.78rem;
  color: #666;
}

/* ── Filtros ── */
.reviews-filters {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
  margin-bottom: 1.5rem;
}

.filter-btn {
  padding: 0.38rem 1rem;
  border: 1.5px solid #ccddf0;
  border-radius: 99px;
  background: #fff;
  font-size: 0.82rem;
  color: #5a7a99;
  cursor: pointer;
  transition: all 0.15s;
}

.filter-btn:hover  { border-color: #2563a8; color: #2563a8; }
.filter-btn.active { background: #1a3a5c; border-color: #1a3a5c; color: #fff; }

/* ── Grid 2 columnas ── */
.reviews-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
  margin-bottom: 1.5rem;
}

/* ── Tarjeta horizontal ── */
.review-card {
  background: #fff;
  border: 1px solid #e0e8f0;
  border-radius: 12px;
  padding: 1.2rem 1.4rem;
  display: flex;
  gap: 1rem;
  align-items: flex-start;
  transition: box-shadow 0.2s;
}

.review-card:hover { box-shadow: 0 4px 18px rgba(37,99,168,0.1); }

.review-score-badge {
  background: #1a3a5c;
  color: #fff;
  font-size: 0.9rem;
  font-weight: 700;
  padding: 0.4rem 0.65rem;
  border-radius: 8px;
  flex-shrink: 0;
  height: fit-content;
}

.review-body {
  display: flex;
  flex-direction: column;
  gap: 3px;
  flex: 1;
}

.review-rating-word {
  font-size: 0.9rem;
  font-weight: 700;
  color: #1a3a5c;
  margin: 0;
}

.review-text {
  font-size: 0.85rem;
  line-height: 1.55;
  color: #444;
  margin: 0;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.review-text.expanded {
  -webkit-line-clamp: unset;
  overflow: visible;
}

.read-more {
  background: none;
  border: none;
  font-size: 0.78rem;
  color: #2563a8;
  cursor: pointer;
  padding: 0;
  text-align: left;
  text-decoration: underline;
}

.reviewer-name {
  font-size: 0.82rem;
  font-weight: 600;
  color: #333;
  margin: 4px 0 0;
}

.reviewer-meta {
  font-size: 0.76rem;
  color: #888;
  margin: 0;
}

.verified-tag {
  font-size: 0.72rem;
  color: #888;
  margin: 0;
}

/* ── Ver todas ── */
.ver-todas-wrapper {
  display: flex;
  justify-content: center;
  margin-bottom: 2rem;
}

.ver-todas-btn {
  padding: 0.6rem 2rem;
  border: 1.5px solid #1a3a5c;
  border-radius: 99px;
  background: #fff;
  color: #1a3a5c;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.15s;
}

.ver-todas-btn:hover { background: #1a3a5c; color: #fff; }

/* ── Formulario ── */
.write-review {
  background: #f0f5fb;
  border: 1px solid #ccddf0;
  border-radius: 14px;
  padding: 1.75rem 2rem;
}

.write-title {
  font-size: 1.1rem;
  font-weight: 700;
  color: #1a3a5c;
  margin: 0 0 1rem;
}

.star-input {
  display: flex;
  align-items: center;
  gap: 4px;
  margin-bottom: 1rem;
}

.star-select {
  font-size: 2rem;
  color: #c9d9ec;
  cursor: pointer;
  transition: color 0.1s, transform 0.1s;
}

.star-select.active,
.star-select.hover { color: #f5a623; transform: scale(1.15); }

.rating-label {
  font-size: 0.83rem;
  color: #5a7a99;
  margin-left: 0.75rem;
}

.review-textarea {
  width: 100%;
  border: 1.5px solid #ccddf0;
  border-radius: 10px;
  padding: 0.9rem 1rem;
  font-family: inherit;
  font-size: 0.88rem;
  color: #1c2b3a;
  background: #fff;
  resize: vertical;
  box-sizing: border-box;
  transition: border-color 0.15s;
  margin-bottom: 1rem;
}

.review-textarea:focus        { outline: none; border-color: #2563a8; }
.review-textarea::placeholder { color: #8dacc8; }

.submit-btn {
  padding: 0.65rem 1.75rem;
  background: #1a3a5c;
  color: #fff;
  border: none;
  border-radius: 99px;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.15s;
}

.submit-btn:hover:not(:disabled)  { background: #2563a8; }
.submit-btn:disabled              { opacity: 0.4; cursor: not-allowed; }

/* ── Responsive ── */
@media (max-width: 640px) {
  .reviews-grid     { grid-template-columns: 1fr; }
  .reviews-header   { flex-direction: column; gap: 1rem; }
  .subcategories    { gap: 1.2rem; }
}
</style>