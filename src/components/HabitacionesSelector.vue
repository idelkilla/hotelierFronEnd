<template>
  <section class="hab-section" v-if="!loading">
    <h2 class="hab-titulo">Elige tu habitación</h2>

    <!-- Selector horizontal (Estilo MenuDet) -->
    <div class="hab-menu-container">
      <MenuDet is-habitaciones :initial-entrada="fechaInicio" :initial-salida="fechaFin" :initial-huespedes="huespedesParsed" />
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
              @click="$emit('seleccionarHabitacion', hab)"
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
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { apiFetch } from '../services/api'
import MenuDet from './MenuDet.vue'
import { ref, computed, watch, onMounted } from 'vue'

const props = defineProps({
  fechaInicio: { type: String, default: '' },
  fechaFin: { type: String, default: '' },
  resumenHuespedes: { type: String, default: '' },
  noches: { type: Number, default: 0 },
})

defineEmits(['seleccionarHabitacion', 'abrirCalendario'])

const route = useRoute()
const loading = ref(true)
const habitaciones = ref([])
const tipoActivo = ref('Todos')

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
</style>
