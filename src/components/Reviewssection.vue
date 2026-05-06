<template>
  <section class="reviews-section">
    <!-- ── HEADER: Score + Subcategorías ─────────────────────── -->
    <div class="reviews-header" v-if="reviews.length">
      <div class="score-block">
        <div class="score-pill">
          <span class="score-num">{{ averageRating.toFixed(1) }}</span>
          <span class="score-denom">/10</span>
        </div>
        <div class="score-meta">
          <span class="score-word">{{ palabraRating }}</span>
          <span class="score-count"
            >{{ reviews.length }} opiniones verificadas</span
          >
        </div>
      </div>

      <div class="divider-v"></div>

      <div class="subcategories">
        <div class="subcat-row" v-for="cat in subcategorias" :key="cat.label">
          <span class="subcat-label">{{ cat.label }}</span>
          <div class="subcat-track">
            <div
              class="subcat-fill"
              :style="{ width: (cat.value / 10) * 100 + '%' }"
            ></div>
          </div>
          <span class="subcat-value">{{ cat.value.toFixed(1) }}</span>
        </div>
      </div>
    </div>

    <!-- ── EMPTY STATE ─────────────────────────────────────────── -->
    <div v-else class="empty-state">
      <div class="empty-icon-wrap">
        <svg viewBox="0 0 40 40" fill="none" class="empty-svg">
          <circle cx="20" cy="20" r="19" stroke="#c8d8ea" stroke-width="1.5" />
          <path
            d="M12 25c0-4.418 3.582-8 8-8s8 3.582 8 8"
            stroke="#94afc7"
            stroke-width="1.5"
            stroke-linecap="round"
          />
          <circle cx="15" cy="17" r="1.5" fill="#94afc7" />
          <circle cx="25" cy="17" r="1.5" fill="#94afc7" />
        </svg>
      </div>
      <p class="empty-title">Sin opiniones todavía</p>
      <p class="empty-sub">
        Sé el primero en compartir tu experiencia con este hospedaje.
      </p>
    </div>

    <!-- ── FILTROS ─────────────────────────────────────────────── -->
    <div class="filters-bar" v-if="reviews.length">
      <button
        v-for="filter in filters"
        :key="filter.value"
        class="filter-chip"
        :class="{ active: activeFilter === filter.value }"
        @click="activeFilter = filter.value"
      >
        {{ filter.label }}
      </button>
    </div>

    <!-- ── GRID DE RESEÑAS ────────────────────────────────────── -->
    <div class="reviews-grid" v-if="filteredReviews.length">
      <article
        v-for="review in filteredReviews"
        :key="review.ID_RESENA ?? review.id ?? Math.random()"
        class="review-card"
      >
        <div class="card-top">
          <div
            class="score-badge"
            :class="scoreTier((review.CALIFICACION ?? review.calificacion) * 2)"
          >
            {{ ((review.CALIFICACION ?? review.calificacion) * 2).toFixed(0) }}
          </div>
          <div class="card-header-text">
            <span class="card-rating-word">
              {{
                palabraPorCalificacion(
                  review.CALIFICACION ?? review.calificacion ?? review.rating,
                )
              }}
            </span>
            <div class="stars-row">
              <span
                v-for="i in 5"
                :key="i"
                class="star-icon"
                :class="{
                  lit:
                    i <=
                    Math.round(review.CALIFICACION ?? review.calificacion ?? 0),
                }"
                >★</span
              >
            </div>
          </div>
        </div>

        <p class="review-text" :class="{ expanded: review.expanded }">
          {{ review.COMENTARIO ?? review.comentario ?? review.text }}
        </p>
        <button
          v-if="
            (review.COMENTARIO ?? review.comentario ?? review.text ?? '')
              .length > 160
          "
          class="read-more-btn"
          @click="review.expanded = !review.expanded"
        >
          {{ review.expanded ? 'Ver menos ↑' : 'Ver más ↓' }}
        </button>

        <div class="reviewer-row">
          <div class="avatar">
            {{
              (review.nombre_cliente ?? review.nombre ?? 'HU')
                .slice(0, 2)
                .toUpperCase()
            }}
          </div>
          <div class="reviewer-info">
            <span class="reviewer-name">
              {{ review.nombre_cliente ?? review.name ?? 'Huésped verificado' }}
            </span>
            <span class="reviewer-meta">
              {{ review.fecha ?? review.date ?? 'Reciente' }}
              <span class="verified-badge">
                <svg viewBox="0 0 12 12" fill="none" class="check-icon">
                  <circle
                    cx="6"
                    cy="6"
                    r="5.5"
                    fill="#15803d"
                    stroke="#15803d"
                  />
                  <path
                    d="M3.5 6l1.8 1.8L8.5 4.5"
                    stroke="#fff"
                    stroke-width="1.2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
                Verificada
              </span>
            </span>
          </div>
        </div>
      </article>
    </div>

    <!-- ── VER TODAS ──────────────────────────────────────────── -->
    <div class="ver-todas-wrap" v-if="reviews.length > 4">
      <button class="ver-todas-btn">
        <span>Ver las {{ reviews.length }} opiniones</span>
        <svg viewBox="0 0 16 16" fill="none" class="btn-arrow">
          <path
            d="M3 8h10M9 4l4 4-4 4"
            stroke="currentColor"
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      </button>
    </div>

    <!-- ── FORMULARIO ─────────────────────────────────────────── -->
    <div class="write-review-box">
      <div class="write-review-header">
        <div class="write-icon-wrap">
          <svg viewBox="0 0 20 20" fill="none" class="write-icon">
            <path
              d="M14.5 2.5a2.121 2.121 0 013 3L6 17l-4 1 1-4L14.5 2.5z"
              stroke="#1a3a5c"
              stroke-width="1.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </div>
        <div>
          <h3 class="write-title">Comparte tu experiencia</h3>
          <p class="write-sub">
            Tu opinión ayuda a otros viajeros a elegir mejor.
          </p>
        </div>
      </div>

      <div v-if="submitSuccess" class="alert alert-success">
        <svg viewBox="0 0 20 20" fill="none" class="alert-icon">
          <circle cx="10" cy="10" r="9" stroke="#15803d" stroke-width="1.5" />
          <path
            d="M6 10l2.5 2.5L14 7"
            stroke="#15803d"
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
        ¡Gracias! Tu reseña ha sido publicada exitosamente.
      </div>

      <template v-else>
        <!-- Stars -->
        <div class="rating-input-group">
          <label class="input-label">Calificación general</label>
          <div class="stars-input-row">
            <span
              v-for="i in 5"
              :key="i"
              class="star-btn"
              :class="{
                active: i <= newReview.rating,
                hover: i <= hoverRating,
              }"
              @mouseover="hoverRating = i"
              @mouseleave="hoverRating = 0"
              @click="newReview.rating = i"
              >★</span
            >
            <span
              class="rating-label-text"
              v-if="hoverRating || newReview.rating"
            >
              {{ palabraPorCalificacion(hoverRating || newReview.rating) }}
            </span>
          </div>
        </div>

        <!-- Textarea -->
        <div class="textarea-group">
          <label class="input-label">Tu comentario</label>
          <textarea
            v-model="newReview.text"
            class="review-textarea"
            placeholder="¿Qué te pareció la limpieza, la ubicación, el servicio...?"
            rows="4"
            maxlength="200"
          ></textarea>
          <span class="char-counter">{{ newReview.text.length }}/200</span>
        </div>

        <!-- Submit -->
        <div class="form-actions">
          <div v-if="!userToken" class="login-hint">
            <svg viewBox="0 0 16 16" fill="none" class="hint-icon">
              <circle cx="8" cy="8" r="7" stroke="#b45309" stroke-width="1.2" />
              <path
                d="M8 5v3M8 10.5v.5"
                stroke="#b45309"
                stroke-width="1.2"
                stroke-linecap="round"
              />
            </svg>
            Inicia sesión para publicar tu reseña
          </div>
          <button
            class="submit-btn"
            :disabled="
              !newReview.rating ||
              !newReview.text.trim() ||
              submitting ||
              !userToken
            "
            @click="submitReview"
          >
            <span v-if="submitting" class="btn-loading">
              <span class="spinner"></span> Publicando...
            </span>
            <span v-else>Publicar reseña</span>
          </button>
        </div>
      </template>

      <div v-if="errorMessage" class="alert alert-error">
        <svg viewBox="0 0 20 20" fill="none" class="alert-icon">
          <circle cx="10" cy="10" r="9" stroke="#dc2626" stroke-width="1.5" />
          <path
            d="M7 7l6 6M13 7l-6 6"
            stroke="#dc2626"
            stroke-width="1.5"
            stroke-linecap="round"
          />
        </svg>
        {{ errorMessage }}
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, computed, reactive, onMounted, watch, onUnmounted } from 'vue'
import { apiFetch } from '../services/api'

const props = defineProps({
  hospedajeId: { type: [String, Number], required: true },
})

const reviews = ref([])
const submitting = ref(false)
const submitSuccess = ref(false)
const errorMessage = ref('')
const activeFilter = ref('all')
const hoverRating = ref(0)
const userToken = ref(Boolean(localStorage.getItem('user_token')))
const newReview = reactive({ rating: 0, text: '' })

const updateTokenStatus = () => {
  userToken.value = Boolean(localStorage.getItem('user_token'))
}

const filters = [
  { label: 'Todas', value: 'all' },
  { label: 'Más recientes', value: 'recent' },
  { label: 'Mejor valoradas', value: 'top' },
]

// ── Computed ────────────────────────────────────────────────────
const averageRating = computed(() => {
  if (!reviews.value.length) return 0
  const total = reviews.value.reduce(
    (sum, r) =>
      sum + parseFloat(r.CALIFICACION ?? r.calificacion ?? r.rating ?? 0),
    0,
  )
  return (total / reviews.value.length) * 2
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

// ── Helpers ─────────────────────────────────────────────────────
function labelPorValor(v) {
  if (v >= 9) return 'Excepcional'
  if (v >= 8) return 'Excelente'
  if (v >= 7) return 'Muy buena'
  if (v >= 6) return 'Buena'
  if (v >= 5) return 'Regular'
  return 'Baja'
}
function palabraPorCalificacion(r) {
  return labelPorValor(parseFloat(r ?? 0) * 2)
}
function scoreTier(v) {
  if (v >= 9) return 'tier-exceptional'
  if (v >= 8) return 'tier-excellent'
  if (v >= 7) return 'tier-good'
  if (v >= 6) return 'tier-ok'
  return 'tier-low'
}

// ── API ─────────────────────────────────────────────────────────
async function cargarResenas() {
  if (!props.hospedajeId) return
  try {
    const data = await apiFetch(`/hospedaje/${props.hospedajeId}/resenas`)
    const list = Array.isArray(data)
      ? data
      : Array.isArray(data?.resenas)
        ? data.resenas
        : Array.isArray(data?.reviews)
          ? data.reviews
          : []
    reviews.value = list.map((r) => ({ ...r, expanded: false }))
  } catch (e) {
    console.error('Error cargando reseñas:', e)
    reviews.value = []
  }
}

async function submitReview() {
  if (!newReview.rating || !newReview.text.trim()) return
  const token = localStorage.getItem('user_token')
  if (!token) {
    errorMessage.value = 'Debes iniciar sesión para publicar una reseña.'
    setTimeout(() => (errorMessage.value = ''), 4000)
    return
  }
  submitting.value = true
  errorMessage.value = ''
  try {
    await apiFetch(`/hospedaje/${props.hospedajeId}/resenas`, {
      method: 'POST',
      body: JSON.stringify({
        calificacion: newReview.rating,
        rating: newReview.rating,
        comentario: newReview.text.trim(),
        text: newReview.text.trim(),
      }),
    })
    await cargarResenas()
    submitSuccess.value = true
    newReview.rating = 0
    newReview.text = ''
    setTimeout(() => (submitSuccess.value = false), 5000)
  } catch (e) {
    errorMessage.value = e.message?.includes('403')
      ? 'Solo los perfiles de cliente pueden publicar reseñas.'
      : e.message || 'Error al publicar la reseña.'
    setTimeout(() => (errorMessage.value = ''), 5000)
  } finally {
    submitting.value = false
  }
}

onMounted(() => {
  window.addEventListener('storage', updateTokenStatus)
  updateTokenStatus()
  cargarResenas()
})
onUnmounted(() => window.removeEventListener('storage', updateTokenStatus))
watch(() => props.hospedajeId, cargarResenas)
</script>

<style scoped>
/* ── Tokens ──────────────────────────────────────────────────── */
:root {
  --navy: #0f2744;
  --navy-mid: #1a3a5c;
  --navy-soft: #2563a8;
  --surface: #f8fafc;
  --border: #e2eaf4;
  --text: #1c2b3a;
  --muted: #64748b;
  --radius: 12px;
}

/* ── Layout ──────────────────────────────────────────────────── */
.reviews-section {
  font-family: 'Segoe UI', 'Helvetica Neue', sans-serif;
  color: var(--text, #1c2b3a);
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 0;
}

/* ── Header ──────────────────────────────────────────────────── */
.reviews-header {
  display: flex;
  align-items: center;
  gap: 2rem;
  background: #f0f6ff;
  border: 1px solid #c8d8ea;
  border-radius: 14px;
  padding: 1.5rem 2rem;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
}

.score-block {
  display: flex;
  align-items: center;
  gap: 1rem;
  flex-shrink: 0;
}

.score-pill {
  background: #0f2744;
  color: #fff;
  border-radius: 10px;
  padding: 0.6rem 1rem;
  display: flex;
  align-items: baseline;
  gap: 3px;
  box-shadow: 0 4px 12px rgba(15, 39, 68, 0.25);
}
.score-num {
  font-size: 2.4rem;
  font-weight: 800;
  line-height: 1;
  letter-spacing: -1px;
}
.score-denom {
  font-size: 0.9rem;
  font-weight: 500;
  opacity: 0.7;
}

.score-meta {
  display: flex;
  flex-direction: column;
  gap: 2px;
}
.score-word {
  font-size: 1rem;
  font-weight: 700;
  color: #0f2744;
}
.score-count {
  font-size: 0.78rem;
  color: #64748b;
}

.divider-v {
  width: 1px;
  height: 56px;
  background: #c8d8ea;
  flex-shrink: 0;
}

/* Subcategorías */
.subcategories {
  display: flex;
  flex-direction: column;
  gap: 8px;
  flex: 1;
  min-width: 220px;
}

.subcat-row {
  display: grid;
  grid-template-columns: 110px 1fr 36px;
  align-items: center;
  gap: 10px;
}
.subcat-label {
  font-size: 0.78rem;
  color: #475569;
}
.subcat-track {
  height: 6px;
  background: #dde8f4;
  border-radius: 99px;
  overflow: hidden;
}
.subcat-fill {
  height: 100%;
  background: linear-gradient(90deg, #1a3a5c, #2563a8);
  border-radius: 99px;
  transition: width 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}
.subcat-value {
  font-size: 0.78rem;
  font-weight: 700;
  color: #0f2744;
  text-align: right;
}

/* ── Empty ───────────────────────────────────────────────────── */
.empty-state {
  text-align: center;
  padding: 3rem 1rem;
  background: #f8fafc;
  border: 1.5px dashed #c8d8ea;
  border-radius: 14px;
  margin-bottom: 1.5rem;
}
.empty-icon-wrap {
  display: flex;
  justify-content: center;
  margin-bottom: 0.75rem;
}
.empty-svg {
  width: 48px;
  height: 48px;
}
.empty-title {
  font-size: 1rem;
  font-weight: 700;
  color: #0f2744;
  margin: 0 0 4px;
}
.empty-sub {
  font-size: 0.83rem;
  color: #64748b;
  margin: 0;
}

/* ── Filtros ─────────────────────────────────────────────────── */
.filters-bar {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
  margin-bottom: 1.25rem;
}
.filter-chip {
  padding: 0.3rem 0.9rem;
  border: 1.5px solid #c8d8ea;
  border-radius: 99px;
  background: #fff;
  font-size: 0.8rem;
  font-weight: 500;
  color: #475569;
  cursor: pointer;
  transition: all 0.15s;
  line-height: 1.6;
}
.filter-chip:hover {
  border-color: #1a3a5c;
  color: #1a3a5c;
}
.filter-chip.active {
  background: #0f2744;
  border-color: #0f2744;
  color: #fff;
}

/* ── Grid de cards ───────────────────────────────────────────── */
.reviews-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
  margin-bottom: 1.25rem;
}

.review-card {
  background: #fff;
  border: 1px solid #e2eaf4;
  border-radius: 14px;
  padding: 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 10px;
  transition:
    box-shadow 0.2s,
    transform 0.2s;
}
.review-card:hover {
  box-shadow: 0 8px 24px rgba(15, 39, 68, 0.09);
  transform: translateY(-1px);
}

.card-top {
  display: flex;
  align-items: flex-start;
  gap: 12px;
}

/* Score badge con colores semánticos */
.score-badge {
  font-size: 1.15rem;
  font-weight: 800;
  min-width: 46px;
  height: 46px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  letter-spacing: -0.5px;
}
.tier-exceptional {
  background: #dcfce7;
  color: #15803d;
}
.tier-excellent {
  background: #dbeafe;
  color: #1d4ed8;
}
.tier-good {
  background: #e0f2fe;
  color: #0369a1;
}
.tier-ok {
  background: #fef9c3;
  color: #854d0e;
}
.tier-low {
  background: #fee2e2;
  color: #b91c1c;
}

.card-header-text {
  display: flex;
  flex-direction: column;
  gap: 3px;
}
.card-rating-word {
  font-size: 0.9rem;
  font-weight: 700;
  color: #0f2744;
}
.stars-row {
  display: flex;
  gap: 1px;
}
.star-icon {
  font-size: 0.8rem;
  color: #d1dce8;
}
.star-icon.lit {
  color: #f59e0b;
}

.review-text {
  font-size: 0.84rem;
  line-height: 1.6;
  color: #475569;
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

.read-more-btn {
  background: none;
  border: none;
  font-size: 0.77rem;
  color: #2563a8;
  cursor: pointer;
  padding: 0;
  text-align: left;
  font-weight: 600;
  width: fit-content;
}

.reviewer-row {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-top: auto;
  padding-top: 10px;
  border-top: 1px solid #f0f6ff;
}

.avatar {
  width: 34px;
  height: 34px;
  border-radius: 50%;
  background: linear-gradient(135deg, #1a3a5c, #2563a8);
  color: #fff;
  font-size: 0.72rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  letter-spacing: 0.5px;
}

.reviewer-info {
  display: flex;
  flex-direction: column;
  gap: 1px;
}
.reviewer-name {
  font-size: 0.8rem;
  font-weight: 600;
  color: #1c2b3a;
}
.reviewer-meta {
  font-size: 0.72rem;
  color: #94a3b8;
  display: flex;
  align-items: center;
  gap: 6px;
}

.verified-badge {
  display: inline-flex;
  align-items: center;
  gap: 3px;
  font-size: 0.7rem;
  color: #15803d;
  font-weight: 600;
}
.check-icon {
  width: 11px;
  height: 11px;
}

/* ── Ver todas ───────────────────────────────────────────────── */
.ver-todas-wrap {
  display: flex;
  justify-content: center;
  margin-bottom: 1.75rem;
}
.ver-todas-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 0.6rem 1.75rem;
  border: 1.5px solid #0f2744;
  border-radius: 99px;
  background: #fff;
  color: #0f2744;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.15s;
}
.ver-todas-btn:hover {
  background: #0f2744;
  color: #fff;
}
.btn-arrow {
  width: 16px;
  height: 16px;
  transition: transform 0.2s;
}
.ver-todas-btn:hover .btn-arrow {
  transform: translateX(3px);
}

/* ── Formulario ──────────────────────────────────────────────── */
.write-review-box {
  border: 1px solid #e2eaf4;
  border-radius: 14px;
  padding: 1.75rem;
  background: #f8fafc;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.write-review-header {
  display: flex;
  align-items: flex-start;
  gap: 12px;
}
.write-icon-wrap {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  background: #e8f0fb;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.write-icon {
  width: 18px;
  height: 18px;
}
.write-title {
  font-size: 1rem;
  font-weight: 700;
  color: #0f2744;
  margin: 0 0 2px;
}
.write-sub {
  font-size: 0.78rem;
  color: #64748b;
  margin: 0;
}

/* Inputs */
.rating-input-group,
.textarea-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.input-label {
  font-size: 0.78rem;
  font-weight: 600;
  color: #475569;
  letter-spacing: 0.03em;
  text-transform: uppercase;
}

.stars-input-row {
  display: flex;
  align-items: center;
  gap: 4px;
}
.star-btn {
  font-size: 1.9rem;
  color: #d1dce8;
  cursor: pointer;
  transition:
    color 0.1s,
    transform 0.1s;
  user-select: none;
  line-height: 1;
}
.star-btn.active,
.star-btn.hover {
  color: #f59e0b;
  transform: scale(1.2);
}
.rating-label-text {
  font-size: 0.84rem;
  font-weight: 600;
  color: #1a3a5c;
  margin-left: 8px;
}

.textarea-group {
  position: relative;
}
.review-textarea {
  width: 100%;
  border: 1.5px solid #d1dce8;
  border-radius: 10px;
  padding: 0.875rem 1rem;
  font-family: inherit;
  font-size: 0.875rem;
  color: #1c2b3a;
  background: #fff;
  resize: vertical;
  box-sizing: border-box;
  transition:
    border-color 0.15s,
    box-shadow 0.15s;
  min-height: 100px;
}
.review-textarea:focus {
  outline: none;
  border-color: #1a3a5c;
  box-shadow: 0 0 0 3px rgba(26, 58, 92, 0.08);
}
.review-textarea::placeholder {
  color: #b0c2d8;
}
.char-counter {
  font-size: 0.72rem;
  color: #94a3b8;
  text-align: right;
  margin-top: 2px;
}

/* Actions */
.form-actions {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  flex-wrap: wrap;
}

.login-hint {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.8rem;
  color: #b45309;
  background: #fffbeb;
  border: 1px solid #fde68a;
  border-radius: 8px;
  padding: 6px 12px;
}
.hint-icon {
  width: 15px;
  height: 15px;
  flex-shrink: 0;
}

.submit-btn {
  padding: 0.65rem 1.75rem;
  background: linear-gradient(135deg, #0f2744, #1a3a5c);
  color: #fff;
  border: none;
  border-radius: 99px;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  box-shadow: 0 2px 8px rgba(15, 39, 68, 0.25);
  display: inline-flex;
  align-items: center;
  gap: 8px;
  margin-left: auto;
}
.submit-btn:hover:not(:disabled) {
  background: linear-gradient(135deg, #1a3a5c, #2563a8);
  box-shadow: 0 4px 14px rgba(15, 39, 68, 0.3);
  transform: translateY(-1px);
}
.submit-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
  box-shadow: none;
  transform: none;
}

.btn-loading {
  display: flex;
  align-items: center;
  gap: 8px;
}
.spinner {
  width: 14px;
  height: 14px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top-color: #fff;
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
  display: inline-block;
}
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* Alerts */
.alert {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 0.875rem 1rem;
  border-radius: 10px;
  font-size: 0.875rem;
  font-weight: 500;
}
.alert-success {
  background: #f0fdf4;
  border: 1px solid #bbf7d0;
  color: #15803d;
}
.alert-error {
  background: #fef2f2;
  border: 1px solid #fecaca;
  color: #dc2626;
}
.alert-icon {
  width: 18px;
  height: 18px;
  flex-shrink: 0;
}

/* ── Responsive ──────────────────────────────────────────────── */
@media (max-width: 680px) {
  .reviews-grid {
    grid-template-columns: 1fr;
  }
  .reviews-header {
    flex-direction: column;
    gap: 1rem;
  }
  .divider-v {
    display: none;
  }
  .subcategories {
    width: 100%;
  }
  .subcat-row {
    grid-template-columns: 90px 1fr 30px;
  }
  .write-review-box {
    padding: 1.25rem;
  }
  .form-actions {
    flex-direction: column;
    align-items: stretch;
  }
  .submit-btn {
    margin-left: 0;
    justify-content: center;
  }
}
</style>
