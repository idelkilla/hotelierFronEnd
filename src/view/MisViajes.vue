<template>
  <div class="mis-viajes">
    <Header />

    <div class="mv-content-wrapper">
      <div class="mv-page-header">
        <span class="mv-header__eyebrow">Panel de viajero</span>
        <h1 class="mv-header__title">Mis viajes</h1>
        <p class="mv-header__sub">Todo tu historial de reservas en un solo lugar</p>
      </div>

      <main class="mv-main-content">

    <div v-if="loading" class="mv-loading">
      <div class="mv-spinner"></div>
      <p>Cargando tus reservas…</p>
    </div>

    <div v-else-if="error" class="mv-error">
      <p>{{ error }}</p>
      <button class="mv-btn mv-btn--primary" @click="cargarReservas">Reintentar</button>
    </div>

    <template v-else>
      <section class="mv-stats" aria-label="Resumen de viajes">
        <div class="mv-stat" v-for="stat in stats" :key="stat.label">
          <p class="mv-stat__label">{{ stat.label }}</p>
          <p class="mv-stat__value">{{ stat.value }}</p>
        </div>
      </section>

      <div class="mv-filters" role="group" aria-label="Filtrar reservas">
        <button
          v-for="f in filtros"
          :key="f.key"
          class="mv-filter"
          :class="{ 'mv-filter--active': filtroActivo === f.key }"
          @click="filtroActivo = f.key"
        >
          {{ f.label }}
          <span class="mv-filter__count">{{ contarFiltro(f.key) }}</span>
        </button>
      </div>

      <div class="mv-list" v-if="reservasFiltradas.length">
        <article
          class="mv-card"
          v-for="(r, i) in reservasFiltradas"
          :key="r.id_reserva"
          :style="{ '--delay': `${i * 60}ms` }"
        >
          <div class="mv-card__accent" :style="{ background: colorEstado(r.estado).accent }"></div>

          <div class="mv-card__content">
            <div class="mv-card__top">
              <div class="mv-card__icon-wrap" :style="{ background: colorEstado(r.estado).bg }">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
                  :stroke="colorEstado(r.estado).accent" stroke-width="2"
                  stroke-linecap="round" stroke-linejoin="round">
                  <rect x="2" y="7" width="20" height="14" rx="2"/>
                  <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>
                </svg>
              </div>
              <div class="mv-card__info">
                <div class="mv-card__row">
                  <h2 class="mv-card__title">{{ r.ubicacion }}</h2>
                  <span class="mv-badge"
                    :style="{ background: colorEstado(r.estado).bg, color: colorEstado(r.estado).text }">
                    {{ r.estado }}
                  </span>
                </div>
                <p class="mv-card__location">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                    stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                    <circle cx="12" cy="10" r="3"/>
                  </svg>
                  {{ r.ubicacion }}
                  <span class="mv-card__id">· #{{ r.id_reserva }}</span>
                </p>
              </div>
            </div>

            <div class="mv-card__meta">
              <div class="mv-meta-item" v-if="r.fecha_inicio">
                <span class="mv-meta-item__label">Entrada</span>
                <span class="mv-meta-item__value">{{ fmtFecha(r.fecha_inicio) }}</span>
              </div>
              <div class="mv-meta-item" v-if="r.fecha_fin">
                <span class="mv-meta-item__label">Salida</span>
                <span class="mv-meta-item__value">{{ fmtFecha(r.fecha_fin) }}</span>
              </div>
              <div class="mv-meta-item" v-if="r.cantidad_noche">
                <span class="mv-meta-item__label">Duración</span>
                <span class="mv-meta-item__value">{{ r.cantidad_noche }} noches</span>
              </div>
              <div class="mv-meta-item" v-if="r.tipo_habitacion">
                <span class="mv-meta-item__label">Habitación</span>
                <span class="mv-meta-item__value">{{ r.tipo_habitacion }}</span>
              </div>
              <div class="mv-meta-item" v-if="r.huesped_nombre">
                <span class="mv-meta-item__label">Huésped principal</span>
                <span class="mv-meta-item__value">{{ r.huesped_nombre }} {{ r.huesped_apellidos }}</span>
              </div>
              <div class="mv-meta-item">
                <span class="mv-meta-item__label">Tipo de pago</span>
                <span class="mv-meta-item__value">{{ r.tipo_pago === 'despues' ? 'Pagar después' : 'Pagado' }}</span>
              </div>
              <div class="mv-meta-item" v-if="r.fecha_limite_cancelacion">
                <span class="mv-meta-item__label">Límite cancelación</span>
                <span class="mv-meta-item__value">{{ fmtFecha(r.fecha_limite_cancelacion) }}</span>
              </div>
            </div>

            <div class="mv-card__footer">
              <div class="mv-card__tags">
                <span class="mv-tag" v-if="r.imagen_portada">Con imagen</span>
                <span class="mv-tag" v-if="r.tipo_pago === 'despues'">Pago pendiente</span>
                <span class="mv-tag" v-if="r.monto_recargo > 0">Recargo aplicado</span>
              </div>
              <div class="mv-card__actions">
                <span class="mv-card__price">
                  ${{ Number(r.precio_total || 0).toLocaleString('es-DO', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) }}
                </span>
                <button class="mv-btn mv-btn--ghost" @click="verDetalle(r)">Ver detalle</button>
                <button
                  v-if="puedeGestionar(r)"
                  class="mv-btn mv-btn--outline"
                  :disabled="cancelando === r.id_reserva"
                  @click="confirmarCancelacion(r)"
                >
                  {{ cancelando === r.id_reserva ? 'Cancelando…' : 'Cancelar' }}
                </button>
              </div>
            </div>
          </div>
        </article>
      </div>

      <div class="mv-empty" v-else>
        <div class="mv-empty__icon">✈</div>
        <p class="mv-empty__text">No hay reservas en esta categoría</p>
        <button class="mv-btn mv-btn--primary" @click="filtroActivo = 'todas'">Ver todas</button>
      </div>
    </template>
      </main>
    </div>

    <transition name="fade">
      <div class="mv-modal-backdrop" v-if="reservaSeleccionada" @click.self="reservaSeleccionada = null">
        <div class="mv-modal">
          <button class="mv-modal__close" @click="reservaSeleccionada = null" aria-label="Cerrar">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor"
              stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
          <div class="mv-modal__accent" :style="{ background: colorEstado(reservaSeleccionada.estado).accent }"></div>
          <div class="mv-modal__body">
            <span class="mv-badge mv-badge--lg"
              :style="{ background: colorEstado(reservaSeleccionada.estado).bg, color: colorEstado(reservaSeleccionada.estado).text }">
              {{ reservaSeleccionada.estado }}
            </span>
            <h2 class="mv-modal__title">{{ reservaSeleccionada.ubicacion }}</h2>
            <p class="mv-modal__sub">Reserva #{{ reservaSeleccionada.id_reserva }}</p>

            <div class="mv-modal__grid">
              <div class="mv-modal__item" v-for="(val, label) in detalleModal(reservaSeleccionada)" :key="label">
                <span class="mv-modal__item-label">{{ label }}</span>
                <span class="mv-modal__item-val">{{ val }}</span>
              </div>
            </div>

            <div class="mv-modal__price-row">
              <span class="mv-modal__price-label">Total reserva</span>
              <span class="mv-modal__price">
                ${{ Number(reservaSeleccionada.precio_total || 0).toLocaleString('es-DO', { minimumFractionDigits: 2 }) }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </transition>

    <Toast
      ref="toastRef"
    />

    <FooterComponent />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, reactive } from 'vue'
import { apiGet, apiDelete } from '../services/api.js'
import Header from '../components/Header.vue'
import FooterComponent from '../components/footer.vue'
import Toast from '../components/alert.vue'

const reservas   = ref([])
const loading    = ref(true)
const error      = ref(null)
const filtroActivo       = ref('todas')
const reservaSeleccionada = ref(null)
const cancelando = ref(null)
const toastRef   = ref(null)

async function cargarReservas() {
  loading.value = true
  error.value   = null
  try {
    const data = await apiGet('/reservas/mis-reservas')
    reservas.value = (data || []).map(res => {
      const normalized = {}
      Object.keys(res).forEach(key => {
        normalized[key.toLowerCase()] = res[key]
      })
      return normalized
    })
  } catch (err) {
    error.value = err.message || 'No se pudieron cargar tus reservas.'
  } finally {
    loading.value = false
  }
}

onMounted(cargarReservas)
function colorEstado(estado) {
  const e = (estado || '').toLowerCase()
  if (e.includes('confirm'))  return { accent: '#1a6b3c', bg: '#d4f0e0', text: '#1a6b3c' }
  if (e.includes('pendiente')) return { accent: '#d97706', bg: '#fde8c0', text: '#92520a' }
  if (e.includes('cancel'))   return { accent: '#c0392b', bg: '#fdd8d8', text: '#8b1a1a' }
  return { accent: '#888888', bg: '#ebebeb', text: '#4a4a4a' }
}
const filtros = [
  { key: 'todas',       label: 'Todas'       },
  { key: 'proximas',    label: 'Próximas'    },
  { key: 'completadas', label: 'Completadas' },
  { key: 'canceladas',  label: 'Canceladas'  },
]

function matchFiltro(r) {
  const f = filtroActivo.value
  const e = (r.estado || '').toLowerCase()
  if (f === 'todas')       return true
  if (f === 'proximas')    return e.includes('confirm') || e.includes('pendiente')
  if (f === 'completadas') return e.includes('complet')
  if (f === 'canceladas')  return e.includes('cancel')
  return true
}

const reservasFiltradas = computed(() => reservas.value.filter(matchFiltro))

function contarFiltro(key) {
  const prev = filtroActivo.value
  filtroActivo.value = key
  const count = reservasFiltradas.value.length
  filtroActivo.value = prev
  return count
}

const stats = computed(() => {
  const activas = reservas.value.filter(r => !(r.estado || '').toLowerCase().includes('cancel'))
  const gastado = activas.reduce((s, r) => s + Number(r.precio_total || 0), 0)
  const proximas = reservas.value.filter(r => {
    const e = (r.estado || '').toLowerCase()
    return e.includes('confirm') || e.includes('pendiente')
  })
  return [
    { label: 'Total de viajes',  value: reservas.value.length },
    { label: 'Próximas',         value: proximas.length },
    { label: 'Completadas',      value: reservas.value.filter(r => (r.estado || '').toLowerCase().includes('complet')).length },
    { label: 'Total gastado',    value: '$' + gastado.toLocaleString('es-DO', { minimumFractionDigits: 0, maximumFractionDigits: 0 }) },
  ]
})

function fmtFecha(str) {
  if (!str) return '—'
  const d = new Date(str)
  if (isNaN(d)) return str
  const meses = ['ene','feb','mar','abr','may','jun','jul','ago','sep','oct','nov','dic']
  return `${d.getUTCDate()} ${meses[d.getUTCMonth()]} ${d.getUTCFullYear()}`
}

function verDetalle(r) {
  reservaSeleccionada.value = r
}

function detalleModal(r) {
  const obj = {}
  if (r.fecha_inicio)              obj['Entrada']           = fmtFecha(r.fecha_inicio)
  if (r.fecha_fin)                 obj['Salida']            = fmtFecha(r.fecha_fin)
  if (r.cantidad_noche)            obj['Duración']          = `${r.cantidad_noche} noches`
  if (r.tipo_habitacion)           obj['Habitación']        = r.tipo_habitacion
  if (r.huesped_nombre)            obj['Huésped']           = `${r.huesped_nombre} ${r.huesped_apellidos || ''}`
  if (r.tipo_pago)                 obj['Tipo de pago']      = r.tipo_pago === 'despues' ? 'Pagar después' : 'Pagado ahora'
  if (r.fecha_limite_cancelacion)  obj['Límite cancelación']= fmtFecha(r.fecha_limite_cancelacion)
  return obj
}

function toDateOnlyUTC(fechaStr) {
  if (!fechaStr) return null
  const d = new Date(String(fechaStr) + 'T00:00:00Z')
  if (isNaN(d)) return null
  return d.toISOString().split('T')[0]
}

function puedeGestionar(r) {
  const e = (r.estado || '').toLowerCase()
  if (!e.includes('confirm') && !e.includes('pendiente')) return false
  if (!r.fecha_limite_cancelacion) return true

  const hoyStr = new Date().toISOString().split('T')[0]
  const limiteStr = toDateOnlyUTC(r.fecha_limite_cancelacion)
  if (!limiteStr) return true

  return limiteStr >= hoyStr
}

async function confirmarCancelacion(r) {
  const idReserva = Number(r.id_reserva)
  if (!window.confirm(`¿Cancelar la reserva #${r.id_reserva}? Esta acción no se puede deshacer.`)) return
  if (!Number.isFinite(idReserva)) {
    toastRef.value?.show('error', 'ID de reserva inválido.')
    return
  }

  cancelando.value = idReserva
  try {
    await apiDelete(`/reservas/${idReserva}/cancelar`)

    const idx = reservas.value.findIndex(x => Number(x.id_reserva) === idReserva)
    if (idx !== -1) reservas.value[idx].estado = 'Cancelada'

    toastRef.value?.show('success', 'Reserva cancelada exitosamente.')
    reservaSeleccionada.value = null

    await cargarReservas()
  } catch (err) {
    toastRef.value?.show('error', err.message || 'Error al cancelar la reserva.')
  } finally {
    cancelando.value = null
  }
}
</script>

<style scoped>
.mis-viajes {
  --c-bg: #ffffff;
  --c-surface: #ffffff;
  --c-border: #e2e8f0;
  --c-text: #113955;
  --c-muted: #6b7280;
  --font-display: 'Inter', 'Helvetica Neue', 'Helvetica', Arial, sans-serif;
  --font-body: 'Inter', 'Helvetica Neue', 'Helvetica', Arial, sans-serif;
  --radius-sm: 6px;
  --radius-md: 10px;
  --radius-lg: 16px;
  --color-primary: #113955;
  --color-primary-dark: #0c2a40;
  padding-top: 80px;
  background: var(--c-bg);
  min-height: 100vh;
  font-family: 'Inter', var(--font-body);
  color: var(--c-text);
}
.mv-content-wrapper {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1.5rem 4rem;
}
.mv-page-header {
  margin-bottom: 2.5rem;
}
.mv-header__eyebrow {
  display: block;
  font-size: 11px;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--c-muted);
  margin-bottom: 6px; /* Ajustado para el nuevo header */
}
.mv-header__title {
  font-family: var(--font-display);
  font-size: 36px;
  font-weight: 400;
  line-height: 1.1;
  margin: 0 0 4px;
  letter-spacing: -0.02em; /* Ajustado para el nuevo header */
}
.mv-header__sub {
  font-size: 14px;
  color: var(--c-muted);
  margin: 0;
}

/* ── Loading / Error ── */
.mv-loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 4rem 2rem;
  gap: 16px;
  color: var(--c-muted);
  font-size: 14px;
}
.mv-spinner {
  width: 28px;
  height: 28px;
  border: 2.5px solid var(--c-border);
  border-top-color: var(--c-text);
  border-radius: 50%;
  animation: spin .7s linear infinite;
}
@keyframes spin { to { transform: rotate(360deg); } }

.mv-error {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 3rem 2rem;
  gap: 12px;
  color: #8b1a1a;
  font-size: 14px;
}

/* ── Botones ── */
.mv-btn {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  padding: 9px 18px;
  border-radius: var(--radius-sm);
  font-size: 13.5px;
  font-family: var(--font-body);
  font-weight: 500;
  cursor: pointer;
  border: 1.5px solid transparent;
  transition: all 0.15s ease;
}
.mv-btn:disabled { opacity: 0.5; cursor: not-allowed; }

.mv-btn--primary {
  background: var(--color-primary); /* Usar variable de color primario */
  color: #fff;
}
.mv-btn--primary:hover:not(:disabled) { background: var(--color-primary-dark); }

.mv-btn--outline {
  background: transparent;
  color: var(--c-text);
  border-color: var(--c-border);
}
.mv-btn--outline:hover:not(:disabled) { border-color: var(--c-text); }
.mv-btn--ghost {
  background: transparent; /* Ajustado para el nuevo header */
  color: var(--c-muted);
  border-color: transparent;
  padding-inline: 8px;
}
.mv-btn--ghost:hover { color: var(--c-text); }

/* ── Stats ── */
.mv-stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 10px;
  margin-bottom: 1.75rem;
}
.mv-stat {
  background: var(--c-surface);
  border: 1px solid var(--c-border);
  border-radius: var(--radius-md);
  padding: 14px 16px;
}
.mv-stat__label {
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--c-muted);
  margin: 0 0 6px;
}
.mv-stat__value {
  font-family: var(--font-display);
  font-size: 26px;
  font-weight: 400;
  color: var(--c-text);
  margin: 0;
}

/* ── Filtros ── */
.mv-filters {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  margin-bottom: 1.5rem;
}
.mv-filter {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 14px;
  border-radius: 999px;
  border: 1px solid var(--c-border);
  background: var(--c-surface);
  font-size: 13px;
  font-family: var(--font-body);
  color: var(--c-muted);
  cursor: pointer;
}
.mv-filter:hover { border-color: var(--color-primary); color: var(--color-primary); }
.mv-filter--active {
  background: var(--color-primary);
  border-color: var(--color-primary);
  color: #fff;
}
.mv-filter__count {
  font-size: 11px;
  background: rgba(255,255,255,0.25);
  border-radius: 999px;
  padding: 1px 6px;
  min-width: 18px;
  text-align: center;
}
.mv-filter:not(.mv-filter--active) .mv-filter__count {
  background: var(--c-bg); /* Ajustado para el nuevo header */
  color: var(--c-muted);
}

/* ── Cards ── */
.mv-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.mv-card {
  display: flex;
  background: var(--c-surface); /* Ajustado para el nuevo header */
  border: 1px solid var(--c-border);
  border-radius: var(--radius-lg);
  overflow: hidden;
  transition: box-shadow 0.2s, transform 0.2s;
  animation: slideIn 0.35s ease both;
  animation-delay: var(--delay, 0ms);
}

.mv-card:hover { /* Ajustado para el nuevo header */
  box-shadow: 0 4px 20px rgba(0,0,0,0.07);
  transform: translateY(-1px);
}
@keyframes slideIn {
  from { opacity: 0; transform: translateY(10px); }
  to   { opacity: 1; transform: translateY(0); }
}
.mv-card__accent {
  width: 5px;
  flex-shrink: 0; /* Ajustado para el nuevo header */
}
.mv-card__content {
  flex: 1;
  padding: 1.1rem 1.25rem;
  min-width: 0;
}
.mv-card__top {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  margin-bottom: 1rem;
}
.mv-card__icon-wrap {
  width: 40px;
  height: 40px;
  border-radius: var(--radius-sm);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.mv-card__info { flex: 1; min-width: 0; }
.mv-card__row {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 8px;
  flex-wrap: wrap;
}
.mv-card__title { /* Ajustado para el nuevo header */
  font-size: 15px;
  font-weight: 600;
  margin: 0 0 3px;
  letter-spacing: -0.01em;
}
.mv-card__location {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 13px;
  color: var(--c-muted);
  margin: 0; /* Ajustado para el nuevo header */
  flex-wrap: wrap;
}
.mv-card__id {
  color: var(--c-border);
  margin-left: 2px;
}

/* ── Meta grid ── */
.mv-card__meta {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(130px, 1fr));
  gap: 10px 20px;
  padding: 1rem 0;
  border-top: 1px solid var(--c-border);
  border-bottom: 1px solid var(--c-border);
  margin-bottom: 0.75rem;
}
.mv-meta-item {
  display: flex;
  flex-direction: column;
  gap: 2px;
}
.mv-meta-item__label {
  font-size: 10px;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--c-muted);
}
.mv-meta-item__value { /* Ajustado para el nuevo header */
  font-size: 13px;
  color: var(--c-text);
  font-weight: 500;
}

/* ── Footer de card ── */
.mv-card__footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}
.mv-card__tags { display: flex; gap: 6px; flex-wrap: wrap; }
.mv-tag {
  font-size: 11.5px; /* Ajustado para el nuevo header */
  padding: 3px 9px;
  background: var(--c-bg);
  border: 1px solid var(--c-border);
  border-radius: 999px;
  color: var(--c-muted);
}
.mv-card__actions {
  display: flex;
  align-items: center;
  gap: 6px;
}
.mv-card__price {
  font-family: var(--font-display); /* Ajustado para el nuevo header */
  font-size: 17px;
  font-weight: 400;
  color: var(--c-text);
  margin-right: 4px;
}

/* ── Badge ── */
.mv-badge {
  display: inline-flex;
  align-items: center;
  padding: 3px 10px;
  border-radius: var(--radius-sm);
  font-size: 12px;
  font-weight: 500; /* Ajustado para el nuevo header */
  white-space: nowrap;
  flex-shrink: 0;
}
.mv-badge--lg { padding: 5px 14px; font-size: 13px; }

/* ── Empty ── */
.mv-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 4rem 2rem;
  gap: 12px;
}
.mv-empty__icon { font-size: 40px; opacity: 0.25; } /* Ajustado para el nuevo header */
.mv-empty__text { font-size: 14px; color: var(--c-muted); margin: 0; }

/* ── Modal ── */
.mv-modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
  padding: 1rem;
}
.mv-modal { /* Ajustado para el nuevo header */
  background: var(--c-surface);
  border-radius: var(--radius-lg);
  max-width: 480px;
  width: 100%;
  overflow: hidden;
  position: relative;
  animation: modalIn 0.2s ease;
}
@keyframes modalIn {
  from { opacity: 0; transform: scale(0.97) translateY(8px); }
  to   { opacity: 1; transform: scale(1) translateY(0); }
}
.mv-modal__accent { height: 5px; }
.mv-modal__close {
  position: absolute; /* Ajustado para el nuevo header */
  top: 14px;
  right: 14px;
  width: 32px;
  height: 32px;
  border-radius: var(--radius-sm);
  border: 1px solid var(--c-border);
  background: var(--c-surface);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--c-muted);
}
.mv-modal__close:hover { color: var(--c-text); }
.mv-modal__body { padding: 1.5rem; }
.mv-modal__title { /* Ajustado para el nuevo header */
  font-family: var(--font-display);
  font-size: 22px;
  font-weight: 400;
  margin: 10px 0 4px;
  letter-spacing: -0.02em;
}
.mv-modal__sub {
  font-size: 13px;
  color: var(--c-muted);
  margin: 0 0 1.25rem; /* Ajustado para el nuevo header */
}
.mv-modal__grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px 20px;
  margin-bottom: 1.25rem;
}
.mv-modal__item { display: flex; flex-direction: column; gap: 2px; }
.mv-modal__item-label {
  font-size: 10px;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--c-muted);
}
.mv-modal__item-val { /* Ajustado para el nuevo header */
  font-size: 13.5px;
  font-weight: 500;
  color: var(--c-text);
}
.mv-modal__price-row {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  border-top: 1px solid var(--c-border);
  padding-top: 1rem;
}
.mv-modal__price-label { font-size: 13px; color: var(--c-muted); }
.mv-modal__price { /* Ajustado para el nuevo header */
  font-family: var(--font-display);
  font-size: 28px;
  font-weight: 400;
  letter-spacing: -0.02em;
}

/* ── Toast ── */
.mv-toast {
  position: fixed;
  bottom: 1.5rem;
  left: 50%;
  transform: translateX(-50%);
  padding: 10px 20px;
  border-radius: var(--radius-sm);
  font-size: 13.5px;
  font-weight: 500;
  z-index: 200;
  white-space: nowrap;
  box-shadow: 0 4px 16px rgba(0,0,0,0.15);
}
.mv-toast--success { background: #1a6b3c; color: #fff; }
.mv-toast--error   { background: #c0392b; color: #fff; }

/* ── Transitions ── */
.fade-enter-active, .fade-leave-active { transition: opacity 0.2s; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>
