<template>
  <section class="hab-section" v-if="!loading">
    <h2 class="hab-titulo">Elige tu habitación</h2>

    <!-- Selector horizontal (Estilo MenuDet) -->
    <div class="hab-menu-container">
      <MenuDet is-habitaciones />
    </div>

    <!-- Filtros por tipo -->
    <div class="hab-tipos-filtros" v-if="tiposDisponibles.length">
      <button
        v-for="tipo in ['Todos', ...tiposDisponibles]"
        :key="tipo"
        class="hab-tipo-btn"
        :class="{ active: tipoActivo === tipo }"
        @click="tipoActivo = tipo"
      >
        {{ tipo }}
      </button>
      <span class="hab-conteo"
        >Mostrando {{ habitacionesFiltradas.length }} de
        {{ habitaciones.length }} habitaciones</span
      >
    </div>

    <!-- Grid de habitaciones -->
    <div class="hab-grid" v-if="habitacionesFiltradas.length">
      <div
        class="hab-card"
        v-for="hab in habitacionesFiltradas"
        :key="hab.ID_HABITACION"
      >
        <!-- Imagen / Placeholder -->
        <div class="hab-img-wrapper">
          <div class="hab-placeholder">
            <span class="material-symbols-outlined">bed</span>
          </div>
          <div class="hab-capacidad-badge">
            <span class="material-symbols-outlined" style="font-size: 14px"
              >person</span
            >
            {{ hab.CAPACIDAD_ADULTO }} persona{{
              hab.CAPACIDAD_ADULTO !== 1 ? 's' : ''
            }}
          </div>
        </div>

        <!-- Info -->
        <div class="hab-info">
          <h3 class="hab-nombre">{{ hab.TIPO_HABITACION }}</h3>

          <!-- Servicios incluidos -->
          <div class="hab-servicios" v-if="hab.SERVICIOS?.length">
            <div class="hab-servicio" v-for="s in hab.SERVICIOS" :key="s">
              <span class="material-symbols-outlined">check</span>
              {{ s }}
            </div>
          </div>

          <!-- Detalles -->
          <div class="hab-detalles">
            <span v-if="hab.METROS_CUADRADOS">
              <span class="material-symbols-outlined">straighten</span>
              {{ hab.METROS_CUADRADOS }} m²
            </span>
            <span v-if="hab.CAPACIDAD_NINOS > 0">
              <span class="material-symbols-outlined">child_care</span>
              {{ hab.CAPACIDAD_NINOS }} niño{{
                hab.CAPACIDAD_NINOS !== 1 ? 's' : ''
              }}
            </span>
            <span v-if="hab.TIPO_CAMA">
              <span class="material-symbols-outlined">bed</span>
              {{ hab.TIPO_CAMA }}
            </span>
          </div>

          <p class="hab-descripcion" v-if="hab.DESCRIPCION">
            {{ hab.DESCRIPCION }}
          </p>

          <!-- Precio y botón -->
          <div class="hab-footer">
            <div class="hab-precio">
              <span class="hab-monto"
                >${{ Number(hab.PRECIO_NOCHE).toLocaleString() }}</span
              >
              <span class="hab-por-noche">/noche</span>
              <span class="hab-total" v-if="noches > 0">
                ${{
                  (Number(hab.PRECIO_NOCHE) * noches).toLocaleString()
                }}
                total
              </span>
            </div>
            <button
              class="hab-btn-reservar"
              :disabled="hab.DISPONIBLE === 0"
              @click="abrirModal(hab)"
            >
              {{ hab.DISPONIBLE === 0 ? 'No disponible' : 'Reservar' }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <div class="hab-vacio" v-else>
      <span class="material-symbols-outlined">search_off</span>
      <p>No hay habitaciones disponibles para estas fechas.</p>
    </div>
  </section>

  <div class="hab-loading" v-else>
    <span class="material-symbols-outlined rotating">sync</span>
    Cargando habitaciones...
  </div>

  <!-- Modal de Pago -->
  <ModalPago
    :visible="modalVisible"
    :habitacion="habitacionSeleccionada"
    :noches="noches"
    fecha-limite="2025-05-07"
    @cerrar="modalVisible = false"
    @confirmar="abrirCheckout"
  />

  <!-- Proceso de Checkout -->
  <CheckoutReserva
    :visible="checkoutVisible"
    :habitacion="habitacionSeleccionada"
    :fecha-inicio="fechaInicio"
    :fecha-fin="fechaFin"
    :noches="noches"
    :tipo-pago="tipoPago"
    @cerrar="checkoutVisible = false"
    @reserva-confirmada="onReservaConfirmada"
  />
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { apiFetch } from '../services/api'
import MenuDet from './MenuDet.vue'
import ModalPago from './ModalPago.vue'
import CheckoutReserva from './CheckoutReserva.vue'

const props = defineProps({
  fechaInicio: { type: String, default: '' },
  fechaFin: { type: String, default: '' },
  resumenHuespedes: { type: String, default: '' },
  noches: { type: Number, default: 0 },
})

const emit = defineEmits(['seleccionarHabitacion', 'abrirCalendario'])

const route = useRoute()
const loading = ref(true)
const habitaciones = ref([])
const tipoActivo = ref('Todos')

// ── Estado del Modal de Pago ──────────────────────────────────
const modalVisible = ref(false)
const habitacionSeleccionada = ref(null)
const checkoutVisible = ref(false)
const tipoPago = ref('ahora')

function abrirModal(hab) {
  habitacionSeleccionada.value = hab
  modalVisible.value = true
}

function abrirCheckout(datos) {
  tipoPago.value = datos.tipoPago
  habitacionSeleccionada.value = datos.habitacion
  modalVisible.value = false
  checkoutVisible.value = true
}

function onReservaConfirmada(resp) {
  checkoutVisible.value = false
  emit('seleccionarHabitacion', resp)
}

// ── Tipos disponibles para filtrar ───────────────────────────
const tiposDisponibles = computed(() => [
  ...new Set(habitaciones.value.map((h) => h.TIPO_HABITACION).filter(Boolean)),
])

const habitacionesFiltradas = computed(() =>
  tipoActivo.value === 'Todos'
    ? habitaciones.value
    : habitaciones.value.filter((h) => h.TIPO_HABITACION === tipoActivo.value),
)

// ── Cargar habitaciones ───────────────────────────────────────
async function cargar() {
  const id = route.params.id
  loading.value = true
  try {
    const params =
      props.fechaInicio && props.fechaFin
        ? `?desde=${props.fechaInicio}&hasta=${props.fechaFin}`
        : ''
    habitaciones.value = await apiFetch(
      `/habitaciones/hospedaje/${id}/detalle${params}`,
    )
  } catch (e) {
    console.error('Error cargando habitaciones:', e)
    habitaciones.value = []
  } finally {
    loading.value = false
  }
}

onMounted(cargar)
watch([() => props.fechaInicio, () => props.fechaFin], cargar)
</script>

<style scoped>
.hab-section {
  margin-top: 40px;
  padding-top: 30px;
  border-top: 1px solid #eee;
}
.hab-titulo {
  font-size: 26px;
  font-weight: 700;
  color: #113956;
  margin-bottom: 20px;
}

/* ── Integración de MenuDet ── */
.hab-menu-container {
  display: flex;
  justify-content: center;
  margin-bottom: 30px;
  width: 100%;
}

/* ── Tipos filtros ── */
.hab-tipos-filtros {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
  margin-bottom: 24px;
}

.hab-tipo-btn {
  padding: 7px 16px;
  border: 1.5px solid #ddd;
  border-radius: 99px;
  background: #fff;
  font-size: 13px;
  color: #555;
  cursor: pointer;
  transition: all 0.15s;
}
.hab-tipo-btn:hover {
  border-color: #113956;
  color: #113956;
}
.hab-tipo-btn.active {
  background: #113956;
  border-color: #113956;
  color: #fff;
}

.hab-conteo {
  margin-left: auto;
  font-size: 13px;
  color: #888;
}

/* ── Grid ── */
.hab-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
}

/* ── Card ── */
.hab-card {
  border: 1px solid #e0e8f0;
  border-radius: 12px;
  overflow: hidden;
  background: #fff;
  transition: box-shadow 0.2s;
}
.hab-card:hover {
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

/* ── Imagen / Placeholder ── */
.hab-img-wrapper {
  position: relative;
}
.hab-placeholder {
  width: 100%;
  height: 180px;
  background: linear-gradient(135deg, #e8f0fb, #c8daf0);
  display: flex;
  align-items: center;
  justify-content: center;
}
.hab-placeholder .material-symbols-outlined {
  font-size: 56px;
  color: #6b9ec4;
  opacity: 0.6;
}
.hab-capacidad-badge {
  position: absolute;
  bottom: 10px;
  right: 10px;
  background: rgba(0, 0, 0, 0.55);
  color: #fff;
  font-size: 12px;
  padding: 4px 10px;
  border-radius: 20px;
  display: flex;
  align-items: center;
  gap: 4px;
}

/* ── Info ── */
.hab-info {
  padding: 14px 16px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.hab-nombre {
  font-size: 15px;
  font-weight: 700;
  color: #113956;
  margin: 0;
}

.hab-servicios {
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.hab-servicio {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  color: #2a7a4b;
}
.hab-servicio .material-symbols-outlined {
  font-size: 15px;
  color: #2a7a4b;
}

.hab-detalles {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}
.hab-detalles span {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  color: #666;
}
.hab-detalles .material-symbols-outlined {
  font-size: 15px;
  color: #888;
}

.hab-descripcion {
  font-size: 12px;
  color: #777;
  line-height: 1.5;
  margin: 0;
}

/* ── Footer ── */
.hab-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 4px;
  padding-top: 10px;
  border-top: 1px solid #eee;
}

.hab-precio {
  display: flex;
  align-items: baseline;
  gap: 4px;
  flex-wrap: wrap;
}
.hab-monto {
  font-size: 18px;
  font-weight: 700;
  color: #113956;
}
.hab-por-noche {
  font-size: 12px;
  color: #888;
}
.hab-total {
  font-size: 11px;
  color: #888;
  width: 100%;
}

.hab-btn-reservar {
  background: #113956;
  color: #fff;
  border: none;
  padding: 9px 18px;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
  white-space: nowrap;
}
.hab-btn-reservar:hover:not(:disabled) {
  background: #1e5276;
}
.hab-btn-reservar:disabled {
  background: #ccc;
  cursor: not-allowed;
}

/* ── Estados ── */
.hab-vacio {
  text-align: center;
  padding: 50px;
  color: #aaa;
}
.hab-vacio .material-symbols-outlined {
  font-size: 48px;
  display: block;
  margin-bottom: 10px;
}

.hab-loading {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 40px;
  color: #888;
  font-size: 14px;
}

@keyframes rotate {
  to {
    transform: rotate(360deg);
  }
}
.rotating {
  animation: rotate 1s linear infinite;
  display: inline-block;
}

@media (max-width: 900px) {
  .hab-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
@media (max-width: 580px) {
  .hab-grid {
    grid-template-columns: 1fr;
  }
}
</style>
