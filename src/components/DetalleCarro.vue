<template>
  <div class="detalle-container">

    <!-- HEADER -->
    <div class="detalle-header">
      <button class="back-btn" @click="$router.back()">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M19 12H5M12 5l-7 7 7 7"/>
        </svg>
        Ver todos los autos
      </button>
    </div>

    <!-- CUERPO PRINCIPAL -->
    <div class="detalle-body">

      <!-- COLUMNA IZQUIERDA -->
      <div class="col-left">

        <!-- GALERÍA -->
        <div class="gallery-card">
          <div class="gallery-main">
            <button class="g-arrow g-prev" @click="prevImg">&#10094;</button>
            <img
              :src="imagenes[imgActual]"
              :alt="'Foto ' + (imgActual + 1)"
              class="gallery-img"
            />
            <button class="g-arrow g-next" @click="nextImg">&#10095;</button>
            <div class="gallery-counter">{{ imgActual + 1 }} / {{ imagenes.length }}</div>
          </div>
          <div class="gallery-thumbs">
            <div
              v-for="(img, i) in imagenes"
              :key="i"
              class="thumb"
              :class="{ active: i === imgActual }"
              @click="imgActual = i"
            >
              <img :src="img" :alt="'Miniatura ' + (i + 1)" />
            </div>
          </div>
        </div>

        <!-- INFO DEL AUTO -->
        <div class="info-card">
          <h1 class="auto-titulo">Camioneta SUV mediana</h1>
          <p class="auto-subtitulo">Suzuki Grand Vitara o similar</p>

          <div class="features-grid">
            <div class="feat">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
              5 pasajeros
            </div>
            <div class="feat">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/><line x1="12" y1="12" x2="12" y2="16"/><line x1="10" y1="14" x2="14" y2="14"/></svg>
              5 puertas
            </div>
            <div class="feat">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 3H5a2 2 0 0 0-2 2v4m6-6h10a2 2 0 0 1 2 2v4M9 3v18m0 0h10a2 2 0 0 0 2-2v-4M9 21H5a2 2 0 0 1-2-2v-4m0 0h18"/></svg>
              Aire acondicionado
            </div>
            <div class="feat">
              Automático
            </div>
            <div class="feat">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
              Kilometraje ilimitado
            </div>
            <div class="feat">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v3H3V5z"/><path d="M3 8h18v13a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8z"/><path d="M8 12h8M8 16h5"/></svg>
              Entrega con tanque lleno
            </div>
          </div>

          <hr class="divider" />

          <div class="proveedor-row">
            <span class="badge-alamo">Alamo</span>
            <span class="proveedor-loc">en el aeropuerto de STI</span>
          </div>

          <!-- RATING ROW con enlace funcional -->
          <div class="rating-row">
            <span class="rating-badge">57%</span>
            <div>
              <p class="rating-label">Aceptable</p>
              <p class="rating-count">71 puntuaciones verificadas</p>
            </div>
            <a class="rating-link" @click="mostrarReviews = !mostrarReviews">
              Ver detalles de la puntuación →
            </a>
          </div>

          <!-- PANEL DE OPINIONES (se despliega al hacer clic) -->
          <div v-if="mostrarReviews" class="reviews-panel">
            <div class="reviews-header">
              <span class="reviews-title">Opiniones verificadas</span>
              <button class="reviews-close" @click="mostrarReviews = false">✕</button>
            </div>
            <div class="reviews-score-bar">
              <div class="score-circle">57<span>%</span></div>
              <div class="score-labels">
                <p class="score-label-main">Aceptable</p>
                <p class="score-label-sub">Basado en 71 puntuaciones verificadas</p>
              </div>
            </div>
            <div class="reviews-list">
              <div v-for="review in reviews" :key="review.id" class="review-item">
                <div class="review-top">
                  <div class="review-avatar">{{ review.iniciales }}</div>
                  <div class="review-meta">
                    <p class="review-name">{{ review.nombre }}</p>
                    <p class="review-date">{{ review.fecha }}</p>
                  </div>
                  <div class="review-rating" :class="review.clase">{{ review.nota }}</div>
                </div>
                <p class="review-text">{{ review.texto }}</p>
              </div>
            </div>
          </div>

        </div>

        <!-- CANCELACIÓN -->
        <div class="info-card cancel-card">
          <div class="cancel-row">
            <div class="cancel-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#1a56db" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
            </div>
            <div>
              <p class="cancel-title">Cancelación gratuita</p>
              <p class="cancel-desc">Cancela sin costo antes de recoger el auto</p>
            </div>
          </div>
        </div>

        <!-- INFO DEL PROPIETARIO -->
        <div class="info-card owner-card">
          <p class="owner-title">Información del propietario</p>
          <div class="owner-row">
            <div class="owner-avatar">JM</div>
            <div class="owner-meta">
              <p class="owner-name">Juan Martínez</p>
              <p class="owner-since">Propietario desde enero 2021</p>
            </div>
            <div class="owner-badge">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#1a56db" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
              Verificado
            </div>
          </div>

          <div class="owner-stats">
            <div class="owner-stat">
              <span class="stat-val">4.2★</span>
              <span class="stat-lbl">Calificación</span>
            </div>
            <div class="owner-stat">
              <span class="stat-val">38</span>
              <span class="stat-lbl">Rentas</span>
            </div>
            <div class="owner-stat">
              <span class="stat-val">97%</span>
              <span class="stat-lbl">Respuesta</span>
            </div>
          </div>

          <div class="owner-contact">
            <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#113955" stroke-width="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.77 1h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.75a16 16 0 0 0 5.45 5.45l1.1-1.1a2 2 0 0 1 2.11-.45c.9.34 1.85.57 2.81.7A2 2 0 0 1 21.23 15l-.31 1.92z"/></svg>
            829-958-9983
          </div>
        </div>

      </div>

      <!-- COLUMNA DERECHA -->
      <div class="col-right">

        <!-- PRECIO -->
        <div class="info-card">
          <p class="price-big">${{ precioPorDia }} <span>por día</span></p>
          <p class="precio-verde">✓ Cancelación gratuita</p>
          <div class="politicas">
            <div class="politica-row">Paga al recoger el auto</div>
            <div class="politica-row">Reserva sin tarjeta de crédito</div>
          </div>
          <button class="btn-reservar" @click="mostrarModal = true">Reservar ahora</button>
        </div>

        <!-- BENEFICIOS -->
        <div class="info-card">
          <p class="section-title">Beneficios extra al rentar este auto</p>
          <div class="benefit-row">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#15803d" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
            Check-in en línea
          </div>
          <div class="benefit-row">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#15803d" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
            Sin filas al llegar
          </div>
        </div>

        <!-- ONEKEY -->
        <div class="info-card onkey-card">
          <div class="onkey-row">
            <div class="onkey-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"/></svg>
            </div>
            <span>Acumula OneKeyCash por esta renta de auto</span>
          </div>
        </div>

        <!-- DETALLES DEL PRECIO -->
        <div class="info-card">
          <p class="section-title">Detalles del precio</p>
          <div class="precio-detalle-row">
            <span>${{ precioPorDia }} × {{ dias }} día{{ dias !== 1 ? 's' : '' }}</span>
            <span>${{ (precioPorDia * dias).toFixed(2) }}</span>
          </div>
          <div class="precio-detalle-row">
            <span>Impuestos y cargos</span>
            <span>Incluidos</span>
          </div>
          <div class="precio-total-row">
            <span>Total</span>
            <span>${{ (precioPorDia * dias).toFixed(2) }}</span>
          </div>
        </div>

      </div>
    </div>

    <!-- MODAL RESERVA -->
    <div v-if="mostrarModal" class="modal-overlay" @click.self="mostrarModal = false">
      <div class="modal-card">

        <div class="modal-header">
          <h2>Confirmar reserva</h2>
          <button class="modal-close" @click="mostrarModal = false">✕</button>
        </div>

        <div class="modal-auto-info">
          <div class="modal-auto-row">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#113955" stroke-width="2"><rect x="1" y="3" width="15" height="13" rx="2"/><path d="M16 8h4l3 5v3h-7V8z"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>
            <div>
              <p class="modal-auto-nombre">Camioneta SUV mediana</p>
              <p class="modal-auto-sub">Santiago, República Dominicana (STI Aeropuerto)</p>
              <p class="modal-auto-sub">vie., 15 may. – sáb., 16 may.</p>
              <div class="modal-auto-specs">
  <span>
    <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
    5
  </span>
  <span>
    <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/><line x1="12" y1="12" x2="12" y2="16"/><line x1="10" y1="14" x2="14" y2="14"/></svg>
    5
  </span>
  <span>
    <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 3H5a2 2 0 0 0-2 2v4m6-6h10a2 2 0 0 1 2 2v4M9 3v18m0 0h10a2 2 0 0 0 2-2v-4M9 21H5a2 2 0 0 1-2-2v-4m0 0h18"/></svg>
    Aire acondicionado
  </span>
  <span>
    <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83"/></svg>
    Automático
  </span>
</div>
            </div>
          </div>
          <div class="modal-precio-resumen">
            <div class="modal-precio-row">
              <span>A pagar hoy</span>
              <span class="verde">$0.00</span>
            </div>
            <div class="modal-precio-row">
              <span>A pagar en mostrador</span>
              <span>${{ (precioPorDia * dias).toFixed(2) }}</span>
            </div>
            <div class="modal-precio-row total">
              <span>Total</span>
              <span>${{ (precioPorDia * dias).toFixed(2) }}</span>
            </div>
            <p class="modal-nota">Las tarifas se muestran en dólares estadounidenses.</p>
          </div>
        </div>

        <hr class="modal-divider" />

        <div class="modal-cancelacion">
          <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#113955" stroke-width="1.5"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/><path d="M9 16l2 2 4-4"/></svg>
          <div>
            <p class="modal-cancel-title">Cancelación gratuita si cambias de planes</p>
            <p class="modal-cancel-desc">Cancela sin cargos antes del vie., 15 may. 10:30 a.m.</p>
          </div>
        </div>

        <hr class="modal-divider" />

        <div class="modal-form">
          <h3>¿Quién será el conductor?</h3>
          <p class="modal-form-sub">* Requerido</p>

          <div class="form-group">
            <label>Nombre completo *</label>
            <input v-model="form.nombre" type="text" placeholder="Nombre y apellidos" :class="{ 'input-error': errores.nombre }" />
            <span v-if="errores.nombre" class="error-msg">Ingresa el nombre completo</span>
          </div>

          <div class="form-group">
            <label>Correo electrónico *</label>
            <input v-model="form.email" type="email" placeholder="correo@ejemplo.com" :class="{ 'input-error': errores.email }" />
            <span v-if="errores.email" class="error-msg">Ingresa un correo válido</span>
          </div>

          <div class="form-group">
            <label>Teléfono *</label>
            <input v-model="form.telefono" type="tel" placeholder="+1 (809) 000-0000" :class="{ 'input-error': errores.telefono }" />
            <span v-if="errores.telefono" class="error-msg">Ingresa un teléfono válido</span>
          </div>

          <div class="form-group">
            <label>Número de licencia *</label>
            <input v-model="form.licencia" type="text" placeholder="Ej: B-123456" :class="{ 'input-error': errores.licencia }" />
            <span v-if="errores.licencia" class="error-msg">Ingresa el número de licencia</span>
          </div>
        </div>

        <button class="btn-confirmar" @click="confirmarReserva">
          Confirmar reserva
        </button>

        <div v-if="reservaExitosa" class="reserva-exitosa">
          <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#15803d" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
          ¡Reserva confirmada! Te enviaremos los detalles por correo.
        </div>

      </div>
    </div>
</div>

</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

const imagenes    = ref([])
const imgActual   = ref(0)
const precioPorDia = ref(33)

async function fetchImagenes(id) {
  const mock = {
    1: [
      'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?w=1280&q=80',
      'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=1280&q=80',
      'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=1280&q=80',
      'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=1280&q=80',
    ],
    2: [
      'https://images.unsplash.com/photo-1606016159991-dfe4f2746ad5?w=1280&q=80',
      'https://images.unsplash.com/photo-1571127236794-81c9bbb0de1c?w=1280&q=80',
      'https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=1280&q=80',
      'https://images.unsplash.com/photo-1548790360-0a657d7a7a44?w=1280&q=80',
    ],
    3: [
      'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=1280&q=80',
      'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?w=1280&q=80',
      'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=1280&q=80',
      'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=1280&q=80',
    ],
  }
  return mock[id] ?? mock[1]
}

onMounted(async () => {
  imagenes.value = await fetchImagenes(Number(route.params.id))
})

const dias = computed(() => {
  const entrada = route.query.entrada
  const salida  = route.query.salida
  if (!entrada || !salida) return 1
  return Math.max(1, Math.round((new Date(salida) - new Date(entrada)) / 86400000))
})

function nextImg() {
  imgActual.value = (imgActual.value + 1) % imagenes.value.length
}
function prevImg() {
  imgActual.value = (imgActual.value - 1 + imagenes.value.length) % imagenes.value.length
}

// ── MODAL RESERVA ────────────────────────────────────────
const mostrarModal   = ref(false)
const reservaExitosa = ref(false)

const form = ref({ nombre: '', email: '', telefono: '', licencia: '' })
const errores = ref({ nombre: false, email: false, telefono: false, licencia: false })

function confirmarReserva() {
  errores.value.nombre   = !form.value.nombre.trim()
  errores.value.email    = !form.value.email.includes('@')
  errores.value.telefono = !form.value.telefono.trim()
  errores.value.licencia = !form.value.licencia.trim()

  if (Object.values(errores.value).some(Boolean)) return

  reservaExitosa.value = true
  setTimeout(() => {
    mostrarModal.value   = false
    reservaExitosa.value = false
    form.value = { nombre: '', email: '', telefono: '', licencia: '' }
  }, 2500)
}

// ── PANEL DE OPINIONES ───────────────────────────────────
const mostrarReviews = ref(false)

const reviews = ref([
  {
    id: 1,
    iniciales: 'MR',
    nombre: 'María R.',
    fecha: 'abril 2025',
    nota: '8/10',
    clase: 'nota-buena',
    texto: 'El auto estaba limpio y en buenas condiciones. La entrega en el aeropuerto fue muy rápida. Lo recomendaría.',
  },
  {
    id: 2,
    iniciales: 'JL',
    nombre: 'José L.',
    fecha: 'marzo 2025',
    nota: '5/10',
    clase: 'nota-media',
    texto: 'El proceso de recogida tomó más tiempo de lo esperado. El auto funcionó bien pero tenía algunos rayones que no estaban documentados.',
  },
  {
    id: 3,
    iniciales: 'AC',
    nombre: 'Ana C.',
    fecha: 'febrero 2025',
    nota: '7/10',
    clase: 'nota-buena',
    texto: 'Buena experiencia en general. El aire acondicionado funcionaba perfectamente, ideal para el calor de Santiago.',
  },
  {
    id: 4,
    iniciales: 'PD',
    nombre: 'Pedro D.',
    fecha: 'enero 2025',
    nota: '4/10',
    clase: 'nota-mala',
    texto: 'Tuve problemas con el kilometraje al devolver el auto. El personal no fue muy amable al resolver la situación.',
  },
])
</script>

<style scoped>
/* ── CONTENEDOR ───────────────────────────────────────── */
.detalle-container {
  max-width: 1100px;
  margin: 70px auto 100px;
  padding: 0 20px;
  font-family: sans-serif;
}

/* ── HEADER ───────────────────────────────────────────── */
.detalle-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 0;
  border-bottom: 1px solid #e5e7eb;
  margin-bottom: 24px;
}

.back-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  background: none;
  border: none;
  font-size: 15px;
  font-weight: 600;
  color: #113955;
  cursor: pointer;
  padding: 0;
}
.back-btn:hover { text-decoration: underline; }

/* ── LAYOUT PRINCIPAL ─────────────────────────────────── */
.detalle-body {
  display: grid;
  grid-template-columns: 1fr 300px;
  gap: 24px;
  align-items: start;
}

.col-left  { display: flex; flex-direction: column; gap: 16px; }
.col-right { display: flex; flex-direction: column; gap: 16px; }

/* ── CARDS GENÉRICOS ──────────────────────────────────── */
.info-card {
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 20px 22px;
}

/* ── GALERÍA ──────────────────────────────────────────── */
.gallery-card {
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  overflow: hidden;
}

.gallery-main {
  position: relative;
  height: 300px;
  background: #111;
  overflow: hidden;
}

.gallery-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  transition: opacity 0.25s;
}

.g-arrow {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: rgba(255,255,255,0.92);
  border: none;
  border-radius: 50%;
  width: 34px;
  height: 34px;
  cursor: pointer;
  font-size: 13px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #113955;
  z-index: 2;
  box-shadow: 0 1px 6px rgba(0,0,0,0.2);
  transition: background 0.15s;
}
.g-arrow:hover { background: #fff; }
.g-prev { left: 10px; }
.g-next { right: 10px; }

.gallery-counter {
  position: absolute;
  bottom: 10px;
  right: 14px;
  background: rgba(0,0,0,0.55);
  color: #fff;
  font-size: 12px;
  padding: 3px 9px;
  border-radius: 20px;
}

.gallery-thumbs {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 2px;
  background: #e5e7eb;
}

.thumb {
  height: 72px;
  overflow: hidden;
  cursor: pointer;
  opacity: 0.6;
  transition: opacity 0.2s;
}
.thumb:hover { opacity: 0.85; }
.thumb.active {
  opacity: 1;
  outline: 2px solid #113955;
  outline-offset: -2px;
}
.thumb img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

/* ── INFO AUTO ────────────────────────────────────────── */
.auto-titulo {
  font-size: 22px;
  font-weight: 700;
  color: #113955;
  margin-bottom: 4px;
}
.auto-subtitulo {
  font-size: 14px;
  color: #666;
  margin-bottom: 18px;
}

.features-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px 24px;
}

.feat {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: #333;
}
.feat svg { flex-shrink: 0; color: #555; }

.divider {
  border: none;
  border-top: 1px solid #e5e7eb;
  margin: 18px 0;
}

.proveedor-row {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
}

.badge-alamo {
  background: #2563EB;
  color: #fff;
  font-size: 11px;
  font-weight: 600;
  padding: 3px 10px;
  border-radius: 4px;
}
.proveedor-loc { font-size: 13px; color: #666; }

.rating-row {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-top: 12px;
  flex-wrap: wrap;
}

.rating-badge {
  background: #f3f4f6;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  padding: 4px 10px;
  font-size: 13px;
  font-weight: 600;
  color: #333;
  flex-shrink: 0;
}
.rating-label  { font-size: 15px; font-weight: 700; color: #333; }
.rating-count  { font-size: 12px; color: #888; }
.rating-link {
  font-size: 13px;
  color: #1a56db;
  cursor: pointer;
  margin-left: auto;
  white-space: nowrap;
  user-select: none;
}
.rating-link:hover { text-decoration: underline; }

/* ── PANEL DE OPINIONES ───────────────────────────────── */
.reviews-panel {
  margin-top: 16px;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  overflow: hidden;
  background: #fafafa;
}

.reviews-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  background: #fff;
  border-bottom: 1px solid #e5e7eb;
}
.reviews-title {
  font-size: 14px;
  font-weight: 700;
  color: #113955;
}
.reviews-close {
  background: none;
  border: none;
  font-size: 15px;
  color: #888;
  cursor: pointer;
  padding: 2px 6px;
  border-radius: 50%;
}
.reviews-close:hover { background: #f3f4f6; }

.reviews-score-bar {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 14px 16px;
  border-bottom: 1px solid #e5e7eb;
  background: #fff;
}

.score-circle {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: #f3f4f6;
  border: 2px solid #d1d5db;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  font-weight: 700;
  color: #113955;
  flex-shrink: 0;
}
.score-circle span { font-size: 12px; font-weight: 400; color: #888; }
.score-label-main  { font-size: 15px; font-weight: 700; color: #333; }
.score-label-sub   { font-size: 12px; color: #888; margin-top: 2px; }

.reviews-list { display: flex; flex-direction: column; }

.review-item {
  padding: 14px 16px;
  border-bottom: 1px solid #e5e7eb;
  background: #fff;
}
.review-item:last-child { border-bottom: none; }

.review-top {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 8px;
}

.review-avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: #dbeafe;
  color: #1d4ed8;
  font-size: 12px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.review-meta { flex: 1; }
.review-name { font-size: 13px; font-weight: 700; color: #333; }
.review-date { font-size: 12px; color: #888; margin-top: 1px; }

.review-rating {
  font-size: 12px;
  font-weight: 700;
  padding: 3px 9px;
  border-radius: 20px;
  flex-shrink: 0;
}
.nota-buena { background: #dcfce7; color: #15803d; }
.nota-media { background: #fef9c3; color: #854d0e; }
.nota-mala  { background: #fee2e2; color: #b91c1c; }

.review-text { font-size: 13px; color: #555; line-height: 1.6; }

/* ── CANCELACIÓN ──────────────────────────────────────── */
.cancel-card { padding: 16px 22px; }
.cancel-row  { display: flex; align-items: center; gap: 14px; }
.cancel-icon {
  width: 40px;
  height: 40px;
  background: #eff6ff;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.cancel-title { font-size: 14px; font-weight: 700; color: #113955; }
.cancel-desc  { font-size: 13px; color: #666; margin-top: 2px; }

/* ── PRECIO ───────────────────────────────────────────── */
.col-right .info-card { /* Asegura que todas las info-card de la columna derecha tengan este padding */
  padding: 20px 22px;
}
.price-big {
  font-size: 30px;
  font-weight: 700;
  color: #111;
  margin-bottom: 4px;
}
.price-big span { font-size: 15px; font-weight: 400; color: #666; }
.precio-verde   { color: #15803d; font-size: 14px; margin-bottom: 10px; }

.politicas { margin-bottom: 4px; }
.politica-row {
  font-size: 13px;
  color: #555;
  padding: 5px 0;
  border-bottom: 1px solid #f3f4f6;
}
.politica-row:last-child { border-bottom: none; }

.btn-reservar {
  width: 100%;
  padding: 13px;
  background: #113955;
  color: #fff;
  border: none;
  border-radius: 8px;
  font-size: 15px;
  font-weight: 700;
  cursor: pointer;
  margin-top: 12px;
  transition: background 0.2s;
}
.btn-reservar:hover { background: #0d2d45; }

/* ── BENEFICIOS ───────────────────────────────────────── */
.section-title { font-size: 14px; font-weight: 700; color: #113955; margin-bottom: 10px; }
.benefit-row {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  color: #555;
  margin-bottom: 6px;
}

/* ── ONEKEY ───────────────────────────────────────────── */
.onkey-row  { display: flex; align-items: center; gap: 12px; font-size: 13px; color: #555; }
.onkey-icon {
  width: 38px;
  height: 38px;
  border-radius: 50%;
  background: #f3f4f6;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  color: #113955;
}

/* ── DETALLES PRECIO ──────────────────────────────────── */
.precio-detalle-row {
  display: flex;
  justify-content: space-between;
  font-size: 13px;
  color: #555;
  padding: 5px 0;
  border-bottom: 1px solid #f3f4f6;
}
.precio-total-row {
  display: flex;
  justify-content: space-between;
  font-size: 15px;
  font-weight: 700;
  color: #111;
  padding: 10px 0 0;
}

/* ── MODAL ────────────────────────────────────────────── */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.5);
  z-index: 999;
  display: flex;
   align-items: flex-start;   /* ← cambia center por flex-start */
  justify-content: center;
  padding: 20px;
  padding-top: 80px;   
}
.modal-card {
  background: #fff;
  border-radius: 16px;
  width: 100%;
  max-width: 580px;
  max-height: 90vh;
  overflow-y: auto;
  padding: 28px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.modal-header h2 { font-size: 20px; font-weight: 700; color: #113955; }
.modal-close {
  background: none;
  border: none;
  font-size: 18px;
  cursor: pointer;
  color: #666;
  padding: 4px 8px;
  border-radius: 50%;
}
.modal-close:hover { background: #f3f4f6; }

.modal-auto-row   { display: flex; gap: 12px; align-items: flex-start; margin-bottom: 14px; }
.modal-auto-nombre { font-size: 15px; font-weight: 700; color: #1a56db; margin-bottom: 2px; }
.modal-auto-sub    { font-size: 13px; color: #555; }
.modal-auto-specs  { display: flex; gap: 10px; flex-wrap: wrap; margin-top: 6px; font-size: 12px; color: #444; }

.modal-precio-resumen { background: #f9fafb; border-radius: 10px; padding: 14px; }
.modal-precio-row {
  display: flex;
  justify-content: space-between;
  font-size: 13px;
  color: #555;
  padding: 4px 0;
}
.modal-precio-row.total {
  font-size: 15px;
  font-weight: 700;
  color: #111;
  border-top: 1px solid #e5e7eb;
  margin-top: 6px;
  padding-top: 8px;
}
.verde      { color: #15803d; font-weight: 600; }
.modal-nota { font-size: 11px; color: #999; margin-top: 6px; }

.modal-divider { border: none; border-top: 1px solid #e5e7eb; margin: 0; }

.modal-cancelacion { display: flex; gap: 14px; align-items: flex-start; }
.modal-cancel-title { font-size: 14px; font-weight: 700; color: #113955; }
.modal-cancel-desc  { font-size: 13px; color: #666; margin-top: 2px; }

/* ── FORMULARIO ──────────────────────────────────────── */
.modal-form h3      { font-size: 17px; font-weight: 700; color: #113955; margin-bottom: 4px; }
.modal-form-sub     { font-size: 12px; color: #e31c1c; margin-bottom: 14px; }
.form-group         { display: flex; flex-direction: column; gap: 5px; margin-bottom: 14px; }
.form-group label   { font-size: 13px; font-weight: 600; color: #333; }
.form-group input   {
  padding: 10px 14px;
  border: 1.5px solid #d1d5db;
  border-radius: 8px;
  font-size: 14px;
  outline: none;
  transition: border 0.2s;
}
.form-group input:focus { border-color: #113955; }
.input-error            { border-color: #e31c1c !important; }
.error-msg              { font-size: 12px; color: #e31c1c; }

.btn-confirmar {
  width: 100%;
  padding: 14px;
  background: #113955;
  color: #fff;
  border: none;
  border-radius: 8px;
  font-size: 15px;
  font-weight: 700;
  cursor: pointer;
  transition: background 0.2s;
}
.btn-confirmar:hover { background: #0d2d45; }

.reserva-exitosa {
  display: flex;
  align-items: center;
  gap: 10px;
  background: #f0fdf4;
  border: 1px solid #bbf7d0;
  border-radius: 8px;
  padding: 14px;
  font-size: 14px;
  font-weight: 600;
  color: #15803d;
}

/* ── RESPONSIVE ───────────────────────────────────────── */
@media (max-width: 768px) {
  .detalle-body          { grid-template-columns: 1fr; }
  .col-right             { order: -1; }
  .gallery-main          { height: 220px; }
  .gallery-thumbs        { grid-template-columns: repeat(4, 1fr); }
  .features-grid         { grid-template-columns: 1fr; }
  .rating-link           { margin-left: 0; width: 100%; }
}

@media (max-width: 480px) {
  .detalle-container { padding: 0 12px; margin-top: 55px; }
  .auto-titulo       { font-size: 18px; }
  .price-big         { font-size: 24px; }
  .gallery-main      { height: 190px; }
  .thumb             { height: 56px; }
}
/* ── PROPIETARIO ──────────────────────────────────────── */
.owner-title { /* Mantener el estilo del título */
  font-size: 14px;
  font-weight: 700;
  color: #113955;
  margin-bottom: 14px;
}

.owner-row {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
}

.owner-avatar {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: #dbeafe;
  color: #1d4ed8;
  font-size: 13px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.owner-meta { flex: 1; }
.owner-name  { font-size: 14px; font-weight: 700; color: #222; }
.owner-since { font-size: 12px; color: #888; margin-top: 2px; }

.owner-badge {
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 12px;
  font-weight: 600;
  color: #1a56db;
  background: #eff6ff;
  border: 1px solid #bfdbfe;
  border-radius: 20px;
  padding: 4px 10px;
  flex-shrink: 0;
}

.owner-stats {
  display: flex;
  justify-content: space-around;
  background: #f9fafb;
  border-radius: 10px;
  padding: 12px 0;
  margin-bottom: 14px;
}

.owner-stat {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 3px;
}
.stat-val { font-size: 16px; font-weight: 700; color: #113955; }
.stat-lbl { font-size: 11px; color: #888; }

.owner-contact {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  color: #555;
  border-top: 1px solid #f3f4f6;
  padding-top: 12px;
}
</style>