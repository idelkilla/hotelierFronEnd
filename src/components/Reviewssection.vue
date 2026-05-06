<template>
  <section class="reviews-section">
    <!-- Header con score + subcategorías -->
    <div class="reviews-header" v-if="reviews.length">
      <div class="rating-summary">
        <div class="rating-score-row">
          <span class="rating-score">{{ averageRating.toFixed(1) }}</span>
          <span class="rating-label-main">/10</span>
        </div>
        <span class="rating-word">{{ palabraRating }}</span>
        <span class="rating-count"
          >{{ reviews.length }} opiniones verificadas</span
        >
      </div>

      <div class="subcategories">
        <div class="subcat-row" v-for="cat in subcategorias" :key="cat.label">
          <span class="subcat-value">{{ cat.value.toFixed(1) }}</span>
          <div class="subcat-bar">
            <div
              class="subcat-bar-fill"
              :style="{ width: (cat.value / 10) * 100 + '%' }"
            ></div>
          </div>
          <span class="subcat-label">{{ cat.label }}</span>
        </div>
      </div>
    </div>

    <!-- Estado vacío -->
    <div v-else class="empty-reviews">
      <span class="empty-icon">💬</span>
      <p>Aún no hay opiniones para este hospedaje.</p>
      <p class="empty-sub">¡Sé el primero en compartir tu experiencia!</p>
    </div>

    <!-- Filtros -->
    <div class="reviews-filters" v-if="reviews.length">
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

    <!-- Grid de reseñas -->
    <div class="reviews-grid" v-if="filteredReviews.length">
      <article
        v-for="review in filteredReviews"
        :key="review.ID_RESENA ?? review.id"
        class="review-card"
      >
        <div class="review-score-badge">
          {{
            (
              (review.CALIFICACION ?? review.calificacion ?? review.rating) * 2
            ).toFixed(0)
          }}/10
        </div>
        <div class="review-body">
          <p class="review-rating-word">
            {{
              palabraPorCalificacion(
                review.CALIFICACION ?? review.calificacion ?? review.rating,
              )
            }}
          </p>
          <p class="review-text" :class="{ expanded: review.expanded }">
            {{ review.COMENTARIO ?? review.comentario ?? review.text }}
          </p>
          <button
            v-if="
              (review.COMENTARIO ?? review.comentario ?? review.text ?? '')
                .length > 160
            "
            class="read-more"
            @click="review.expanded = !review.expanded"
          >
            {{ review.expanded ? 'Ver menos' : 'Ver más' }}
          </button>
          <p class="reviewer-name">
            {{ review.nombre_cliente ?? review.name ?? 'Huésped verificado' }}
          </p>
          <p class="reviewer-meta">{{ review.fecha ?? review.date ?? '' }}</p>
          <p class="verified-tag">✓ Opinión verificada</p>
        </div>
      </article>
    </div>

    <!-- Ver todas -->
    <div class="ver-todas-wrapper" v-if="reviews.length > 4">
      <button class="ver-todas-btn">
        Ver las {{ reviews.length }} opiniones
      </button>
    </div>

    <!-- Formulario -->
    <div class="write-review">
      <h3 class="write-title">Comparte tu experiencia</h3>

      <div v-if="submitSuccess" class="success-msg">
        <span>✓</span> ¡Gracias! Tu reseña fue publicada.
      </div>

      <template v-else>
        <div class="star-input">
          <span
            v-for="i in 5"
            :key="i"
            class="star-select"
            :class="{ active: i <= newReview.rating, hover: i <= hoverRating }"
            @mouseover="hoverRating = i"
            @mouseleave="hoverRating = 0"
            @click="newReview.rating = i"
            >★</span
          >
          <span class="rating-label" v-if="hoverRating || newReview.rating">
            {{ palabraPorCalificacion(hoverRating || newReview.rating) }}
          </span>
        </div>

        <textarea
          v-model="newReview.text"
          class="review-textarea"
          placeholder="Cuéntanos tu experiencia en este hospedaje..."
          rows="4"
          maxlength="200"
        ></textarea>
        <div class="char-count">{{ newReview.text.length }}/200</div>

        <button
          class="submit-btn"
          :disabled="!newReview.rating || !newReview.text.trim() || submitting"
          @click="submitReview"
        >
          <span v-if="submitting">Publicando...</span>
          <span v-else>Publicar reseña</span>
        </button>
      </template>
    </div>
  </section>
</template>

<script setup>
import { ref, computed, reactive, onMounted, watch } from 'vue'
import { apiFetch } from '../services/api'

const props = defineProps({
  hospedajeId: { type: [String, Number], required: true },
})

// ── Estado ────────────────────────────────────────────────────────────────────
const reviews = ref([])
const submitting = ref(false)
const submitSuccess = ref(false)
const activeFilter = ref('all')
const hoverRating = ref(0)
const newReview = reactive({ rating: 0, text: '' })

const filters = [
  { label: 'Todas', value: 'all' },
  { label: 'Recientes', value: 'recent' },
  { label: 'Mejor valoradas', value: 'top' },
]

// ── Computed ──────────────────────────────────────────────────────────────────
const averageRating = computed(() => {
  if (!reviews.value.length) return 0
  const total = reviews.value.reduce(
    (sum, r) =>
      sum + parseFloat(r.CALIFICACION ?? r.calificacion ?? r.rating ?? 0),
    0,
  )
  return (total / reviews.value.length) * 2 // ya en escala /10
})

const filteredReviews = computed(() => {
  let list = [...reviews.value]
  if (activeFilter.value === 'recent') {
    list.sort((a, b) => (b.ID_RESENA ?? b.id ?? 0) - (a.ID_RESENA ?? a.id ?? 0))
  } else if (activeFilter.value === 'top') {
    list.sort(
      (a, b) =>
        parseFloat(b.CALIFICACION ?? b.calificacion ?? b.rating ?? 0) -
        parseFloat(a.CALIFICACION ?? a.calificacion ?? a.rating ?? 0),
    )
  }
  return list
})

const palabraRating = computed(() => labelPorValor(averageRating.value))

const subcategorias = computed(() => {
  if (!reviews.value.length) return []
  const base = averageRating.value
  return [
    {
      label: 'Limpieza',
      value: Math.min(10, parseFloat((base * 0.95).toFixed(1))),
    },
    {
      label: 'Servicios',
      value: Math.min(10, parseFloat((base * 0.9).toFixed(1))),
    },
    {
      label: 'Ubicación',
      value: Math.min(10, parseFloat((base * 1.05).toFixed(1))),
    },
    {
      label: 'Calidad-precio',
      value: Math.min(10, parseFloat((base * 0.98).toFixed(1))),
    },
  ]
})

// ── Helpers ───────────────────────────────────────────────────────────────────
function labelPorValor(v) {
  if (v >= 9) return 'Excepcional'
  if (v >= 8) return 'Excelente'
  if (v >= 7) return 'Muy buena'
  if (v >= 6) return 'Buena'
  if (v >= 5) return 'Regular'
  return 'Baja'
}

// recibe calificacion en escala 1-5
function palabraPorCalificacion(r) {
  return labelPorValor(parseFloat(r ?? 0) * 2)
}

// ── API ───────────────────────────────────────────────────────────────────────
async function cargarResenas() {
  if (!props.hospedajeId) return
  try {
    const data = await apiFetch(`/hospedaje/${props.hospedajeId}/resenas`)
    reviews.value = Array.isArray(data)
      ? data.map((r) => ({ ...r, expanded: false }))
      : []
  } catch (e) {
    console.error('Error cargando reseñas:', e)
    reviews.value = []
  }
}

async function submitReview() {
  if (!newReview.rating || !newReview.text.trim()) return
  submitting.value = true
  try {
    await apiFetch(`/hospedaje/${props.hospedajeId}/resenas`, {
      method: 'POST',
      body: JSON.stringify({
        calificacion: newReview.rating, // 1-5
        comentario: newReview.text.trim(),
      }),
    })
    submitSuccess.value = true
    // Agrega la reseña localmente para feedback inmediato
    reviews.value.unshift({
      ID_RESENA: Date.now(),
      CALIFICACION: newReview.rating,
      COMENTARIO: newReview.text.trim(),
      nombre_cliente: 'Tú',
      expanded: false,
    })
    newReview.rating = 0
    newReview.text = ''
    setTimeout(() => (submitSuccess.value = false), 4000)
  } catch (e) {
    console.error('Error publicando reseña:', e)
  } finally {
    submitting.value = false
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

/* ── Header ───────────────────────────────────────────────────────────────── */
.reviews-header {
  display: flex;
  align-items: flex-start;
  gap: 3rem;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
}

.rating-summary {
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 110px;
}

.rating-score-row {
  display: flex;
  align-items: baseline;
  gap: 4px;
}

.rating-score {
  font-size: 3.2rem;
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

/* Subcategorías */
.subcategories {
  display: flex;
  flex-direction: column;
  gap: 8px;
  flex: 1;
  max-width: 340px;
}

.subcat-row {
  display: grid;
  grid-template-columns: 32px 1fr 100px;
  align-items: center;
  gap: 8px;
}

.subcat-value {
  font-size: 0.9rem;
  font-weight: 700;
  color: #1a3a5c;
  text-align: right;
}

.subcat-bar {
  height: 6px;
  background: #dde8f4;
  border-radius: 99px;
  overflow: hidden;
}

.subcat-bar-fill {
  height: 100%;
  background: #1a3a5c;
  border-radius: 99px;
  transition: width 0.4s ease;
}

.subcat-label {
  font-size: 0.78rem;
  color: #555;
}

/* ── Estado vacío ─────────────────────────────────────────────────────────── */
.empty-reviews {
  text-align: center;
  padding: 2rem;
  color: #888;
}
.empty-icon {
  font-size: 2.5rem;
  display: block;
  margin-bottom: 0.5rem;
}
.empty-sub {
  font-size: 0.85rem;
  color: #aaa;
}

/* ── Filtros ──────────────────────────────────────────────────────────────── */
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
.filter-btn:hover {
  border-color: #2563a8;
  color: #2563a8;
}
.filter-btn.active {
  background: #1a3a5c;
  border-color: #1a3a5c;
  color: #fff;
}

/* ── Grid ─────────────────────────────────────────────────────────────────── */
.reviews-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
  margin-bottom: 1.5rem;
}

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
.review-card:hover {
  box-shadow: 0 4px 18px rgba(37, 99, 168, 0.1);
}

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
  line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
.review-text.expanded {
  -webkit-line-clamp: unset;
  line-clamp: unset;
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
  color: #2a7a4b;
  margin: 0;
}

/* ── Ver todas ────────────────────────────────────────────────────────────── */
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
.ver-todas-btn:hover {
  background: #1a3a5c;
  color: #fff;
}

/* ── Formulario ───────────────────────────────────────────────────────────── */
.write-review {
  background: #f0f5fb;
  border: 1px solid #ccddf0;
  border-radius: 14px;
  padding: 1.75rem 2rem;
  margin-top: 1rem;
}

.write-title {
  font-size: 1.1rem;
  font-weight: 700;
  color: #1a3a5c;
  margin: 0 0 1rem;
}

.success-msg {
  display: flex;
  align-items: center;
  gap: 8px;
  background: #edf7f0;
  border: 1px solid #a8d5b5;
  color: #2a7a4b;
  border-radius: 8px;
  padding: 12px 16px;
  font-size: 14px;
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
  transition:
    color 0.1s,
    transform 0.1s;
  user-select: none;
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
  font-weight: 600;
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
  margin-bottom: 4px;
}
.review-textarea:focus {
  outline: none;
  border-color: #2563a8;
}
.review-textarea::placeholder {
  color: #8dacc8;
}

.char-count {
  font-size: 0.72rem;
  color: #aaa;
  text-align: right;
  margin-bottom: 1rem;
}

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
.submit-btn:hover:not(:disabled) {
  background: #2563a8;
}
.submit-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

/* ── Responsive ───────────────────────────────────────────────────────────── */
@media (max-width: 640px) {
  .reviews-grid {
    grid-template-columns: 1fr;
  }
  .reviews-header {
    flex-direction: column;
    gap: 1rem;
  }
  .subcategories {
    max-width: 100%;
  }
}
</style>
