<template>
  <section class="reviews-section">

    <h1 class="reseñas">Reseñas</h1>
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
        <div class="review-top">
          <div class="reviewer-info">
            <div class="avatar" :style="{ background: review.avatarColor }">
              {{ review.initials }}
            </div>
            <div>
              <p class="reviewer-name">{{ review.name }}</p>
              <p class="reviewer-meta">{{ review.country }} · {{ review.date }}</p>
            </div>
          </div>
          <div class="review-stars">
            <span v-for="i in 5" :key="i" class="star sm" :class="{ filled: i <= review.rating }">★</span>
          </div>
        </div>

        <p class="review-text" :class="{ expanded: review.expanded }">
          {{ review.text }}
        </p>

        <button
          v-if="review.text.length > 180"
          class="read-more"
          @click="review.expanded = !review.expanded"
        >
          {{ review.expanded ? 'Mostrar menos ▲' : 'Leer más ▼' }}
        </button>

        <div class="review-tags">
          <span v-for="tag in review.tags" :key="tag" class="tag">{{ tag }}</span>
        </div>

        <div class="review-helpful">
          <span class="helpful-label">¿Útil?</span>
          <button class="helpful-btn" @click="review.likes++">
            👍 {{ review.likes }}
          </button>
        </div>
      </article>
    </div>

    <!-- Formulario -->
    <div class="write-review">
      <h3 class="write-title">Comparte tu experiencia</h3>
      <div class="star-input">
        <span
          v-for="i in 5"
          :key="i"
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
import { ref, computed, reactive } from 'vue'

const activeFilter = ref('all')
const hoverRating = ref(0)

const filters = [
  { label: 'Todos', value: 'all' },
  { label: '5 estrellas', value: 5 },
  { label: '4 estrellas', value: 4 },
  { label: '3 estrellas', value: 3 },
]

const categories = ref([
  { label: 'Limpieza',         value: 4.8 },
  { label: 'Ubicación',        value: 4.6 },
  { label: 'Comunicación',     value: 4.9 },
  { label: 'Calidad / precio', value: 4.5 },
  { label: 'Comodidad',        value: 4.7 },
])

const reviews = ref([
  {
    id: 1,
    name: 'María López',
    initials: 'ML',
    avatarColor: '#2563a8',
    country: 'México',
    date: 'Marzo 2025',
    rating: 5,
    text: 'Un lugar absolutamente increíble. La habitación estaba impecable, el anfitrión fue muy atento y la ubicación es perfecta para explorar la ciudad. Definitivamente volvería a quedarme aquí.',
    tags: ['Limpieza', 'Ubicación'],
    likes: 12,
    expanded: false,
  },
  {
    id: 2,
    name: 'Carlos Ramírez',
    initials: 'CR',
    avatarColor: '#1a4a80',
    country: 'Colombia',
    date: 'Febrero 2025',
    rating: 4,
    text: 'Muy buena experiencia en general. El desayuno incluido fue una sorpresa agradable y la cama es muy cómoda. Solo mejoraría la señal de WiFi en los cuartos.',
    tags: ['Comodidad', 'Desayuno'],
    likes: 7,
    expanded: false,
  },
  {
    id: 3,
    name: 'Ana Fernández',
    initials: 'AF',
    avatarColor: '#0e7490',
    country: 'Argentina',
    date: 'Enero 2025',
    rating: 5,
    text: 'Todo perfecto desde el check-in hasta el check-out. El anfitrión estuvo disponible en todo momento y la propiedad es tal cual aparece en las fotos, incluso mejor.',
    tags: ['Comunicación', 'Valor'],
    likes: 19,
    expanded: false,
  },
  {
    id: 4,
    name: 'Tomás García',
    initials: 'TG',
    avatarColor: '#3b5ea6',
    country: 'Chile',
    date: 'Diciembre 2024',
    rating: 3,
    text: 'El hospedaje está bien ubicado pero esperaba un poco más por el precio. La habitación es cómoda aunque algo pequeña.',
    tags: ['Ubicación'],
    likes: 3,
    expanded: false,
  },
])

const newReview = reactive({ rating: 0, text: '' })

const averageRating = computed(() =>
  reviews.value.reduce((s, r) => s + r.rating, 0) / reviews.value.length
)

const filteredReviews = computed(() =>
  activeFilter.value === 'all'
    ? reviews.value
    : reviews.value.filter(r => r.rating === activeFilter.value)
)

const ratingLabel = computed(() => {
  const labels = ['', 'Malo', 'Regular', 'Bueno', 'Muy bueno', 'Excelente']
  const val = hoverRating.value || newReview.rating
  return val ? labels[val] : 'Selecciona una puntuación'
})

function submitReview() {
  if (!newReview.rating || !newReview.text.trim()) return
  reviews.value.unshift({
    id: Date.now(),
    name: 'Tú',
    initials: 'TÚ',
    avatarColor: '#2563a8',
    country: 'Tu país',
    date: 'Ahora',
    rating: newReview.rating,
    text: newReview.text,
    tags: [],
    likes: 0,
    expanded: false,
  })
  newReview.rating = 0
  newReview.text = ''
}
</script>

<style scoped>
.reviews-section {
  font-family: 'Segoe UI', sans-serif;
  width: 100%;
  color: #1c2b3a;
}

/* ── Header ── */
.reviews-header {
  display: grid;
  grid-template-columns: 140px 1fr;
  gap: 2rem;
  background: #e8f0fb;
  border: 1px solid #ccddf0;
  border-radius: 14px;
  padding: 1.5rem 2rem;
  margin-bottom: 1.5rem;
}

.rating-summary {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.4rem;
  border-right: 1px solid #ccddf0;
  padding-right: 2rem;
}

.rating-score {
  font-size: 3rem;
  font-weight: 700;
  color: #1a3a5c;
  line-height: 1;
}

.rating-count {
  font-size: 0.8rem;
  color: #5a7a99;
}

.rating-stars,
.review-stars {
  display: flex;
  gap: 2px;
}

.star        { font-size: 18px; color: #c9d9ec; }
.star.filled { color: #f5a623; }
.star.sm     { font-size: 14px; }

.reseñas{  
    position: relative;
  top: -20px;

}
/* ── Barras categoría ── */
.category-ratings {
  display: flex;
  flex-direction: column;
  gap: 0.55rem;
  justify-content: center;
}

.category-row {
  display: grid;
  grid-template-columns: 150px 1fr 32px;
  align-items: center;
  gap: 0.75rem;
}

.category-label { font-size: 0.83rem; color: #1c2b3a; }

.progress-bar {
  height: 6px;
  background: #c9d9ec;
  border-radius: 99px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: #2563a8;
  border-radius: 99px;
}

.category-value {
  font-size: 0.82rem;
  font-weight: 600;
  color: #1a3a5c;
  text-align: right;
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

.filter-btn:hover        { border-color: #2563a8; color: #2563a8; }
.filter-btn.active       { background: #1a3a5c; border-color: #1a3a5c; color: #fff; }

/* ── Grid 2 columnas ── */
.reviews-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.25rem;
  margin-bottom: 2.5rem;
}

/* ── Tarjeta ── */
.review-card {
  background: #fff;
  border: 1px solid #ccddf0;
  border-radius: 14px;
  padding: 1.25rem 1.4rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  transition: box-shadow 0.2s;
}

.review-card:hover { box-shadow: 0 4px 18px rgba(37, 99, 168, 0.12); }

.review-top {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.reviewer-info {
  display: flex;
  gap: 0.65rem;
  align-items: center;
}

.avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.75rem;
  font-weight: 700;
  color: #fff;
  flex-shrink: 0;
}

.reviewer-name {
  font-size: 0.93rem;
  font-weight: 600;
  color: #1a3a5c;
  margin: 0 0 2px;
}

.reviewer-meta {
  font-size: 0.76rem;
  color: #5a7a99;
  margin: 0;
}

.review-text {
  font-size: 0.88rem;
  line-height: 1.6;
  color: #2c4a62;
  margin: 0;
  display: -webkit-box;
  line-clamp: 3;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  flex: 1;
}

.review-text.expanded {
  line-clamp: unset;
  -webkit-line-clamp: unset;
}

.read-more {
  background: none;
  border: none;
  font-size: 0.78rem;
  color: #2563a8;
  cursor: pointer;
  padding: 0;
  align-self: flex-start;
}

.read-more:hover { text-decoration: underline; }

.review-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.35rem;
}

.tag {
  font-size: 0.72rem;
  background: #e8f0fb;
  color: #2563a8;
  border: 1px solid #ccddf0;
  padding: 0.18rem 0.6rem;
  border-radius: 99px;
}

.review-helpful {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  border-top: 1px solid #ccddf0;
  padding-top: 0.65rem;
}

.helpful-label { font-size: 0.76rem; color: #5a7a99; }

.helpful-btn {
  background: none;
  border: 1px solid #ccddf0;
  border-radius: 99px;
  padding: 0.2rem 0.7rem;
  font-size: 0.76rem;
  color: #5a7a99;
  cursor: pointer;
  transition: all 0.15s;
}

.helpful-btn:hover { border-color: #2563a8; color: #2563a8; }

/* ── Formulario ── */
.write-review {
  background: #e8f0fb;
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
.star-select.hover {
  color: #f5a623;
  transform: scale(1.15);
}

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
  transition: background 0.15s, transform 0.1s;
}

.submit-btn:hover:not(:disabled)  { background: #2563a8; }
.submit-btn:active:not(:disabled) { transform: scale(0.98); }
.submit-btn:disabled              { opacity: 0.4; cursor: not-allowed; }

/* ── Responsive ── */
@media (max-width: 640px) {
  .reviews-header        { grid-template-columns: 1fr; gap: 1rem; }
  .rating-summary        { flex-direction: row; border-right: none; border-bottom: 1px solid #ccddf0; padding-right: 0; padding-bottom: 1rem; }
  .category-row          { grid-template-columns: 110px 1fr 28px; }
  .reviews-grid          { grid-template-columns: 1fr; }
}
</style>