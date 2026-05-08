<template>
  <section v-if="mostrarSeccion" class="cp-section">
    <div class="cp-inner">

      <!-- Continúa con tus planes -->
      <div class="cp-block">
        <h2 class="cp-titulo">Continúa con tus planes de viaje</h2>

        <div class="cp-cards-row">
          <!-- Tarjetas de reserva -->
          <div
            v-for="r in reservasPendientes"
            :key="r.id_reserva"
            class="cp-card cp-card--reserva"
          >
            <div class="cp-card-img">
              <img v-if="r.imagen_portada" :src="r.imagen_portada" :alt="r.ubicacion" />
              <div v-else class="cp-card-img-placeholder">
                <span class="material-symbols-outlined">hotel</span>
              </div>
            </div>

            <div class="cp-card-body">
              <button class="cp-close" @click="descartarReserva(r.id_reserva)" title="Descartar">
                <span class="material-symbols-outlined">close</span>
              </button>

              <div class="cp-card-nombre">{{ r.tipo_habitacion || 'Alojamiento' }}</div>
              <div class="cp-card-ubicacion">{{ r.ubicacion }}</div>
              <div class="cp-card-meta">{{ fmtFecha(r.fecha_inicio) }} – {{ fmtFecha(r.fecha_fin) }}</div>
              <div class="cp-card-huespedes" v-if="r.huesped_nombre">
                {{ r.huesped_nombre }} {{ r.huesped_apellidos }}
              </div>

              <div v-if="r.calificacion" class="cp-rating">
                <span class="cp-rating-badge">{{ r.calificacion }}</span>
                <span class="cp-rating-label">{{ labelCalificacion(r.calificacion) }}</span>
                <span v-if="r.total_opiniones" class="cp-rating-opiniones">({{ r.total_opiniones }})</span>
              </div>

              <div class="cp-card-precio" v-if="r.precio_total">
                ${{ Number(r.precio_total).toLocaleString('es-DO') }}
              </div>

              <router-link
                to="/mis-viajes"
                class="cp-btn-finalizar"
              >
                {{ r.estado_label === 'pendiente' ? 'Finalizar reservación' : 'Ver reserva' }}
              </router-link>
            </div>
          </div>

          <!-- Tarjeta "Sigue buscando" -->
          <div class="cp-card cp-card--buscar" @click="irABuscar">
            <div class="cp-search-icon-wrap">
              <span class="material-symbols-outlined">search</span>
            </div>
            <p class="cp-buscar-texto">
              Sigue buscando hospedajes
              <span v-if="ultimaBusqueda"><br><strong>en {{ labelDestino(ultimaBusqueda) }}</strong></span>
            </p>
          </div>
        </div>
      </div>

      <!-- Búsquedas recientes -->
      <div v-if="busquedasRecientes.length" class="cp-block">
        <h2 class="cp-titulo">Tus búsquedas recientes</h2>
        <div class="cp-recientes-row">
          <div
            v-for="(b, i) in busquedasRecientes"
            :key="i"
            class="cp-reciente"
            @click="repetirBusqueda(b)"
          >
            <div class="cp-reciente-icon">
              <span class="material-symbols-outlined">location_on</span>
            </div>
            <div class="cp-reciente-info">
              <div class="cp-reciente-destino">{{ labelDestino(b) }}</div>
              <div class="cp-reciente-meta">{{ fmtFecha(b.entrada) }} – {{ fmtFecha(b.salida) }}</div>
              <div class="cp-reciente-huespedes">
                {{ totalPersonas(b.huespedes) }} pasajeros · {{ b.huespedes?.length || 1 }} habitación
              </div>
            </div>
            <button class="cp-reciente-del" @click.stop="eliminarBusqueda(i)" title="Eliminar">
              <span class="material-symbols-outlined">close</span>
            </button>
          </div>
        </div>
      </div>

    </div>
  </section>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { apiFetch } from '../services/api'

const router = useRouter()

const reservasPendientes = ref([])
const busquedasRecientes = ref([])

// La sección se muestra si hay búsquedas recientes O reservas pendientes
const mostrarSeccion = computed(
  () => busquedasRecientes.value.length > 0 || reservasPendientes.value.length > 0
)

const ultimaBusqueda = computed(() => busquedasRecientes.value[0] ?? null)

// ── Helpers ──────────────────────────────────────────────────
function fmtFecha(str) {
  if (!str) return '—'
  const d = new Date(str)
  if (isNaN(d)) return str
  return d.toLocaleDateString('es-DO', { day: 'numeric', month: 'short', weekday: 'short' })
}

function labelDestino(b) {
  if (!b) return ''
  const partes = (b.label || b.destino || '').split(',')
  return partes[0]?.trim() || b.destino || ''
}

function totalPersonas(huespedes) {
  if (!Array.isArray(huespedes)) return 1
  return huespedes.reduce((acc, h) => acc + (h.adultos || 0) + (h.ninos || 0), 0)
}

function labelCalificacion(score) {
  if (!score) return ''
  const n = Number(score)
  if (n >= 9.5) return 'Excepcional'
  if (n >= 9)   return 'Magnífica'
  if (n >= 8.5) return 'Excelente'
  if (n >= 8)   return 'Muy buena'
  if (n >= 7)   return 'Buena'
  return 'Aceptable'
}

// ── Reservas pendientes ──────────────────────────────────────
async function cargarReservas() {
  const token = localStorage.getItem('user_token')
  if (!token) return

  try {
    const data = await apiFetch('/reservas/mis-reservas')

    // DEBUG: quita este log cuando todo funcione
    console.log('[ContinuaPlanes] reservas recibidas:', data)

    const desc = JSON.parse(localStorage.getItem('reservas_descartadas') || '[]')

    reservasPendientes.value = data
      .filter(r => {
        const estado = (r.estado || r.ESTADO || '').toLowerCase()
        const id     = r.id_reserva || r.ID_RESERVA
        const estaDescartada = desc.includes(id)
        const esValida = estado.includes('confirm') || estado.includes('pend')
        return esValida && !estaDescartada
      })
      .slice(0, 2)
      .map(r => ({
        id_reserva:       r.id_reserva        || r.ID_RESERVA,
        tipo_habitacion:  r.tipo_habitacion    || r.TIPO_HABITACION  || r.nombre_habitacion,
        ubicacion:        r.ubicacion          || r.UBICACION        || r.nombre_hotel,
        fecha_inicio:     r.fecha_inicio       || r.FECHA_INICIO     || r.check_in,
        fecha_fin:        r.fecha_fin          || r.FECHA_FIN        || r.check_out,
        precio_total:     r.precio_total       || r.PRECIO_TOTAL,
        imagen_portada:   r.imagen_portada     || r.IMAGEN_PORTADA   || r.imagen || r.foto,
        huesped_nombre:   r.huesped_nombre     || r.HUESPED_NOMBRE,
        huesped_apellidos:r.huesped_apellidos  || r.HUESPED_APELLIDOS,
        calificacion:     r.calificacion       || r.rating           || r.puntuacion,
        total_opiniones:  r.total_opiniones    || r.opiniones        || r.reviews,
        estado_label:    (r.estado || r.ESTADO || '').toLowerCase(),
      }))
  } catch (e) {
    console.error('[ContinuaPlanes] error cargando reservas:', e)
  }
}

function descartarReserva(id) {
  reservasPendientes.value = reservasPendientes.value.filter(r => r.id_reserva !== id)
  const prev = JSON.parse(localStorage.getItem('reservas_descartadas') || '[]')
  localStorage.setItem('reservas_descartadas', JSON.stringify([...prev, id]))
}

// ── Búsquedas recientes ──────────────────────────────────────
function cargarBusquedas() {
  try {
    busquedasRecientes.value = JSON.parse(localStorage.getItem('busquedas_recientes') || '[]')
  } catch {
    busquedasRecientes.value = []
  }
}

function eliminarBusqueda(i) {
  busquedasRecientes.value.splice(i, 1)
  localStorage.setItem('busquedas_recientes', JSON.stringify(busquedasRecientes.value))
}

function repetirBusqueda(b) {
  router.push({
    path: '/head',
    query: {
      destino:      b.destino,
      id_ubicacion: b.id_ubicacion || '',
      entrada:      b.entrada,
      salida:       b.salida,
      huespedes:    JSON.stringify(b.huespedes),
    }
  })
}

function irABuscar() {
  if (ultimaBusqueda.value) repetirBusqueda(ultimaBusqueda.value)
  else window.scrollTo({ top: 0, behavior: 'smooth' })
}

onMounted(() => {
  cargarReservas()
  cargarBusquedas()
})
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600&display=swap');

.cp-section {
  font-family: 'DM Sans', sans-serif;
  background: #EBF3FB;
  padding: 36px 0;
}

.cp-inner {
  max-width: 1100px;
  margin: 0 auto;
  padding: 0 24px;
  display: flex;
  flex-direction: column;
  gap: 32px;
}

.cp-block { display: flex; flex-direction: column; gap: 14px; }

.cp-titulo {
  font-size: 1.15rem;
  font-weight: 600;
  color: #111827;
  letter-spacing: -0.015em;
}

/* ── Cards row ── */
.cp-cards-row {
  display: flex;
  gap: 14px;
  flex-wrap: wrap;
  align-items: stretch;
}

/* ── Card base ── */
.cp-card {
  border-radius: 16px;
  overflow: hidden;
  background: #fff;
  transition: box-shadow 0.22s, transform 0.22s;
  cursor: pointer;
}
.cp-card:hover {
  box-shadow: 0 6px 24px rgba(0, 0, 0, 0.12);
  transform: translateY(-2px);
}

/* ── Card reserva ── */
.cp-card--reserva {
  display: flex;
  width: 350px;
  max-width: 100%;
  border: 1px solid #e2e8f0;
  box-shadow: 0 1px 4px rgba(0,0,0,0.05), 0 4px 16px rgba(0,0,0,0.05);
}

.cp-card-img {
  width: 115px;
  flex-shrink: 0;
  background: #f1f5f9;
  overflow: hidden;
}
.cp-card-img img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}
.cp-card-img-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #94a3b8;
  font-size: 2rem;
}

.cp-card-body {
  flex: 1;
  padding: 14px 14px 14px 13px;
  display: flex;
  flex-direction: column;
  gap: 3px;
  position: relative;
  min-width: 0;
}

.cp-close {
  position: absolute;
  top: 9px;
  right: 9px;
  background: none;
  border: none;
  cursor: pointer;
  color: #9ca3af;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: color 0.15s, background 0.15s;
}
.cp-close:hover { color: #374151; background: #f1f5f9; }
.cp-close .material-symbols-outlined { font-size: 15px; }

.cp-card-nombre {
  font-size: 13.5px;
  font-weight: 600;
  color: #111827;
  padding-right: 22px;
  line-height: 1.3;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.cp-card-ubicacion { font-size: 11.5px; color: #6b7280; }
.cp-card-meta      { font-size: 11.5px; color: #4b5563; margin-top: 3px; }
.cp-card-huespedes { font-size: 11px;   color: #9ca3af; }

.cp-rating {
  display: flex;
  align-items: center;
  gap: 5px;
  margin-top: 5px;
}
.cp-rating-badge {
  background: #15803d;
  color: #fff;
  border-radius: 6px;
  padding: 2px 7px;
  font-size: 11.5px;
  font-weight: 700;
}
.cp-rating-label   { font-size: 11.5px; color: #374151; font-weight: 500; }
.cp-rating-opiniones { font-size: 11px; color: #9ca3af; }

.cp-card-precio {
  font-size: 13px;
  font-weight: 600;
  color: #1d4e73;
  margin-top: 2px;
}

.cp-btn-finalizar {
  display: inline-block;
  margin-top: 9px;
  padding: 6px 15px;
  background: #1d4e73;
  color: #fff;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  text-decoration: none;
  border: none;
  cursor: pointer;
  transition: background 0.18s;
  align-self: flex-start;
  letter-spacing: 0.01em;
}
.cp-btn-finalizar:hover { background: #163d5a; }

/* ── Card Sigue buscando ── */
.cp-card--buscar {
  width: 195px;
  min-height: 130px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 10px;
  border: 1.5px dashed #c7d7e8;
  background: #f0f7ff;
  padding: 20px;
  text-align: center;
  box-shadow: none;
}
.cp-card--buscar:hover {
  border-color: #1d4e73;
  background: #e6f1fb;
  transform: translateY(-2px);
}

.cp-search-icon-wrap {
  width: 46px;
  height: 46px;
  background: #dbeafe;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}
.cp-search-icon-wrap .material-symbols-outlined {
  font-size: 22px;
  color: #1d4e73;
}
.cp-buscar-texto {
  font-size: 12.5px;
  color: #4b5563;
  line-height: 1.5;
  margin: 0;
}
.cp-buscar-texto strong { color: #1d4e73; font-weight: 600; }

/* ── Búsquedas recientes ── */
.cp-recientes-row {
  display: flex;
  gap: 11px;
  flex-wrap: wrap;
}

.cp-reciente {
  display: flex;
  align-items: center;
  gap: 11px;
  background: #fff;
  border: 1px solid #e2e8f0;
  border-radius: 13px;
  padding: 13px 14px;
  cursor: pointer;
  transition: box-shadow 0.2s, border-color 0.2s;
  width: 270px;
  max-width: 100%;
  position: relative;
}
.cp-reciente:hover {
  box-shadow: 0 3px 14px rgba(0, 0, 0, 0.08);
  border-color: #1d4e73;
}

.cp-reciente-icon {
  width: 36px;
  height: 36px;
  background: #e6f1fb;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  color: #1d4e73;
}
.cp-reciente-icon .material-symbols-outlined { font-size: 17px; }

.cp-reciente-info { flex: 1; min-width: 0; }
.cp-reciente-destino {
  font-size: 13px;
  font-weight: 600;
  color: #111827;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.cp-reciente-meta    { font-size: 11.5px; color: #6b7280; margin-top: 2px; }
.cp-reciente-huespedes { font-size: 11px; color: #9ca3af; }

.cp-reciente-del {
  background: none;
  border: none;
  cursor: pointer;
  color: #d1d5db;
  padding: 4px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  flex-shrink: 0;
  transition: color 0.15s, background 0.15s;
}
.cp-reciente-del:hover { color: #ef4444; background: #fef2f2; }
.cp-reciente-del .material-symbols-outlined { font-size: 15px; }

/* ── Responsive ── */
@media (max-width: 640px) {
  .cp-card--reserva { width: 100%; }
  .cp-card--buscar  { width: 100%; min-height: 80px; flex-direction: row; justify-content: flex-start; }
  .cp-reciente      { width: 100%; }
}
</style>