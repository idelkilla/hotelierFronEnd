<template>
  <div class="contenedor-detalles">
    <div class="info-hotel">
      <h1 class="nombre-hotel">Paradisus Palma Real</h1>
      <div class="rating-ubicacion">
        <span class="ubicacion">Puerto Plata, Rep. Dom</span>
      </div>

      <h2 class="subtitulo">Sobre Paradisus Palma Real</h2>
      <p class="descripcion">
        Paradisus Palma Real es un exclusivo resort boutique ubicado frente a
        una de las playas más tranquilas y privadas de Punta Cana. Este hotel
        combina elegancia contemporánea con detalles caribeños, ofreciendo un
        ambiente sofisticado y relajado al mismo tiempo. Sus instalaciones están
        rodeadas de jardines tropicales, senderos iluminados y áreas diseñadas
        para brindar experiencias de descanso y conexión con la naturaleza.
      </p>

      <h2 class="subtitulo">Servicios</h2>
      <div class="servicios-grid">
        <div class="servicio">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M15 9a1 1 0 1 0 2 0a1 1 0 1 0 -2 0"/><path d="M6 11l4 -2l3.5 3l-1.5 2"/><path d="M3 16.75a2.4 2.4 0 0 0 1 .25a2.4 2.4 0 0 0 2 -1a2.4 2.4 0 0 1 2 -1a2.4 2.4 0 0 1 2 1a2.4 2.4 0 0 0 2 1a2.4 2.4 0 0 0 2 -1a2.4 2.4 0 0 1 2 -1a2.4 2.4 0 0 1 2 1a2.4 2.4 0 0 0 2 1a2.4 2.4 0 0 0 1 -.25"/>
          </svg>Piscina
        </div>
        <div class="servicio">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M2 12h1"/><path d="M6 8h-2a1 1 0 0 0 -1 1v6a1 1 0 0 0 1 1h2"/><path d="M6 7v10a1 1 0 0 0 1 1h1a1 1 0 0 0 1 -1v-10a1 1 0 0 0 -1 -1h-1a1 1 0 0 0 -1 1"/><path d="M9 12h6"/><path d="M15 7v10a1 1 0 0 0 1 1h1a1 1 0 0 0 1 -1v-10a1 1 0 0 0 -1 -1h-1a1 1 0 0 0 -1 1"/><path d="M18 8h2a1 1 0 0 1 1 1v6a1 1 0 0 1 -1 1h-2"/><path d="M22 12h-1"/>
          </svg>GYM
        </div>
        <div class="servicio">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M12 18l.01 0"/><path d="M9.172 15.172a4 4 0 0 1 5.656 0"/><path d="M6.343 12.343a8 8 0 0 1 11.314 0"/><path d="M3.515 9.515c4.686 -4.687 12.284 -4.687 17 0"/>
          </svg>WIFI
        </div>
        <div class="servicio">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M12 3c1.918 0 3.52 1.35 3.91 3.151a4 4 0 0 1 2.09 7.723l0 7.126h-12v-7.126a4 4 0 1 1 2.092 -7.723a4 4 0 0 1 3.908 -3.151"/><path d="M6.161 17.009l11.839 -.009"/>
          </svg>Chef
        </div>
        <div class="servicio">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M2 9a10 10 0 1 0 20 0"/><path d="M12 19a10 10 0 0 1 10 -10"/><path d="M2 9a10 10 0 0 1 10 10"/><path d="M12 4a9.7 9.7 0 0 1 2.99 7.5"/><path d="M9.01 11.5a9.7 9.7 0 0 1 2.99 -7.5"/>
          </svg>Spa
        </div>
      </div>
    </div>

    <!-- ── CARD RESERVA ── -->
    <div class="card-reserva">
      <div class="precio-noche">
        <span class="monto">$890</span>
        <span class="etiqueta">/noche</span>
      </div>

      <!-- Fechas — mismo patrón que FormSearch -->
      <div class="inputs-fecha date-field" ref="dateFieldRef">
        <div class="campo" @click="abrirCalendario('inicio')">
          <label>CHECK-IN</label>
          <input
            type="text"
            readonly
            :value="checkInDisplay"
            placeholder="Añadir fecha"
            class="readonly-input"
          />
        </div>
        <div class="campo" @click="abrirCalendario('fin')">
          <label>CHECK-OUT</label>
          <input
            type="text"
            readonly
            :value="checkOutDisplay"
            placeholder="Añadir fecha"
            class="readonly-input"
          />
        </div>
      </div>

      <!-- Dropdown calendario -->
      <CalendarSelector
        v-if="mostrarCalendario"
        :model-value="{ 
          start: (campoEditando === 'inicio' ? fechaInicio : fechaFin) 
                 ? new Date((campoEditando === 'inicio' ? fechaInicio : fechaFin) + 'T00:00:00') 
                 : null, 
          end: null 
        }"
        :range="false"
        @update:dates="onDatesSelected"
        @close="mostrarCalendario = false"
      />

      <div class="campo-personas" id="guest-field">
        <label>HUÉSPEDES</label>
        <div class="personas-input-wrapper" @click="toggleHuespedes">
          <span class="material-symbols-outlined personas-icon">person</span>
          <input type="text" readonly :value="resumenHuespedes" class="readonly-input-personas" />
          <span class="material-symbols-outlined dropdown-icon">expand_more</span>
        </div>
        <GuestSelector v-if="mostrarHuespedes" v-model="habitaciones" @close="mostrarHuespedes = false" />
      </div>

      <div class="desglose">
        <div class="linea">
          <span>$890 x {{ noches }} noche{{ noches !== 1 ? 's' : '' }}</span>
          <span>${{ totalPrecio }}</span>
        </div>
        <hr />
        <div class="linea total">
          <span>Total</span>
          <span>${{ totalPrecio }}</span>
        </div>
      </div>

      <button class="btn-reservar">Reservar</button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount, watch } from 'vue'
import { useRoute } from 'vue-router'
import CalendarSelector from './CalendarSelector.vue'
import GuestSelector from './GuestSelector.vue'

const props = defineProps({
  hotel: Object
})

// ── Estado de huéspedes (sincronizado con URL como en FormSearch) ──
const route = useRoute()
const mostrarHuespedes = ref(false)
const habitaciones = ref(
  route.query.huespedes ? JSON.parse(route.query.huespedes) : [{ adultos: 2, ninos: 0, edadesNinos: [] }]
)
const resumenHuespedes = computed(() => {
  const totalPersonas = habitaciones.value.reduce((acc, h) => acc + h.adultos + h.ninos, 0)
  const textoPersonas = totalPersonas === 1 ? 'persona' : 'personas'
  const textoHabitaciones = habitaciones.value.length === 1 ? 'habitación' : 'habitaciones'

  return `${totalPersonas} ${textoPersonas}, ${habitaciones.value.length} ${textoHabitaciones}`
})

// ── Estado del calendario (igual que FormSearch) ──────────────────
const mostrarCalendario = ref(false)
const fechaInicio       = ref('')
const fechaFin          = ref('')
const campoEditando     = ref('inicio') // 'inicio' o 'fin'
const dateFieldRef      = ref(null)

function abrirCalendario(campo) {
  campoEditando.value = campo
  mostrarCalendario.value = true
  mostrarHuespedes.value = false // Cierra huéspedes al abrir calendario
}

function toggleHuespedes() {
  mostrarHuespedes.value = !mostrarHuespedes.value
  if (mostrarHuespedes.value) mostrarCalendario.value = false // Cierra calendario al abrir huéspedes
}

// Recibe las fechas desde CalendarSelector — mismo handler que FormSearch
function onDatesSelected(dates) {
  const seleccion = dates.start // En modo range=false, la fecha elegida viene en .start

  if (campoEditando.value === 'inicio') {
    fechaInicio.value = seleccion
    // Si la nueva fecha de entrada es posterior o igual a la salida, reseteamos la salida
    if (fechaFin.value && seleccion >= fechaFin.value) {
      fechaFin.value = ''
    }
  } else {
    // Estamos editando el Check-out
    if (fechaInicio.value && seleccion <= fechaInicio.value) {
      // Evitamos que seleccionen una fecha de salida anterior o igual a la de entrada
      return
    }
    fechaFin.value = seleccion
  }
  
  mostrarCalendario.value = false
}

// ── Display formateado (DD/MM/YYYY) ───────────────────────────────
function fmt(str) {
  if (!str) return ''
  const [y, m, d] = str.split('-').map(Number)
  return `${String(d).padStart(2,'0')}/${String(m).padStart(2,'0')}/${y}`
}

const checkInDisplay  = computed(() => fmt(fechaInicio.value))
const checkOutDisplay = computed(() => fmt(fechaFin.value))

// ── Cálculo de noches y precio ────────────────────────────────────
const noches = computed(() => {
  if (!fechaInicio.value || !fechaFin.value) return 0
  const [y1,m1,d1] = fechaInicio.value.split('-').map(Number)
  const [y2,m2,d2] = fechaFin.value.split('-').map(Number)
  const diff = new Date(y2,m2-1,d2) - new Date(y1,m1-1,d1)
  return Math.max(1, Math.round(diff / 86400000))
})

const totalPrecio = computed(() => noches.value > 0 ? 890 * noches.value : 0)

// ── Cerrar al hacer clic fuera (igual que FormSearch) ─────────────
function handleOutsideClick(e) {
  if (!e.target.closest('.date-field') && !e.target.closest('.calendar-modal')) {
    mostrarCalendario.value = false
  }
  if (!e.target.closest('#guest-field')) {
    mostrarHuespedes.value = false
  }
}

onMounted(()       => window.addEventListener('mousedown', handleOutsideClick))
onBeforeUnmount(() => window.removeEventListener('mousedown', handleOutsideClick))
</script>

<style scoped>
.contenedor-detalles {
  display: flex;
  justify-content: space-between;
  gap: 40px;
  width: 100%;
  margin: 10px 0 60px 0;
  font-family: sans-serif;
  color: #113956;
}

.info-hotel      { flex: 1; min-width: 0; }
.nombre-hotel    { font-size: 32px; margin-bottom: 5px; font-weight: bold; }
.rating-ubicacion{ margin-bottom: 25px; }
.subtitulo       { font-size: 24px; margin: 20px 0 10px 0; font-weight: bold; color: #111e37;margin-top: 12px; }
.descripcion     { line-height: 1.6; color: #444; text-align: justify; }
.servicios-grid  { display: flex; gap: 20px; margin-top: 15px; }
.servicio        { display: flex; align-items: center; gap: 8px; font-size: 14px; }
.servicio svg    { color: #2c537a; }

/* ── Card reserva ── */
.card-reserva {
  flex: 0 0 350px;
  border: 1px solid #ddd;
  border-radius: 15px;
  padding: 25px;
  box-shadow: 0 4px 15px rgba(0,0,0,0.05);
  height: fit-content;
  background-color: white;
  position: relative; /* ancla el calendario debajo */
}

.precio-noche .monto { font-size: 28px; font-weight: bold; }
.etiqueta            { font-size: 14px; color: #666; }

/* Inputs fecha */
.inputs-fecha {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0;                        /* sin gap para que luzca como un bloque */
  margin-top: 20px;
  border: 1px solid #ccc;
  border-radius: 8px;
  overflow: hidden;
  cursor: pointer;
}

.campo {
  padding: 10px 12px;
}

.campo:first-child {
  border-right: 1px solid #ccc;  /* separador vertical entre los dos campos */
}

.campo label {
  display: block;
  font-size: 11px;
  font-weight: bold;
  margin-bottom: 4px;
  color: #666;
}

.readonly-input {
  width: 100%;
  border: none;
  outline: none;
  font-size: 13px;
  color: #113956;
  background: transparent;
  cursor: pointer;
}

.readonly-input::placeholder { color: #aaa; }

/* Calendario flota debajo de la card */
:deep(.calendar-modal) {
  position: absolute;
  top: 0;               /* Alineado a la parte superior de la tarjeta */
  left: auto;
  right: calc(100% + 20px); /* Se desplaza a la izquierda de la tarjeta con un margen */
  transform: none;  
  z-index: 999;
  background: white;
  border-radius: 16px;
  box-shadow: 0 12px 40px rgba(0,0,0,0.15);
  padding: 16px;
  width: max-content;
  max-width: 95vw;
}

.campo-personas { 
  margin-top: 15px; 
  position: relative; 
}
.campo-personas label {
  display: block;
  font-size: 11px;
  font-weight: bold;
  margin-bottom: 5px;
  color: #666;
}

.personas-input-wrapper {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 8px;
  cursor: pointer;
  background: white;
}

.personas-icon {
  font-size: 20px;
  color: #113956;
}

.readonly-input-personas {
  flex: 1;
  border: none;
  outline: none;
  font-size: 13px;
  color: #113956;
  background: transparent;
  cursor: pointer;
}

.dropdown-icon {
  font-size: 20px;
  color: #666;
}

/* Estilos para el modal de huéspedes */
:deep(.guests-dropdown) {
  position: absolute;
  top: 0;               /* Alineado arriba de la tarjeta */
  left: auto;
  right: calc(100% + 20px); /* Desplazado a la izquierda */
  margin-top: 0;
  z-index: 1000;
}

.desglose { margin-top: 25px; }
.linea    { display: flex; justify-content: space-between; margin-bottom: 10px; font-size: 14px; color: #666; }
hr        { border: 0; border-top: 1px solid #eee; margin: 15px 0; }
.total    { font-weight: bold; font-size: 18px; color: #113956; }

.btn-reservar {
  width: 100%;
  background-color: #113956;
  color: white;
  border: none;
  padding: 15px;
  border-radius: 10px;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  margin-top: 15px;
  transition: background 0.3s;
}
.btn-reservar:hover { background-color: #1e3a56; }

/* Responsividad */
@media (max-width: 1024px) {
  .contenedor-detalles {
    flex-direction: column;
    gap: 30px;
  }
  
  .info-hotel {
    max-width: 100%;
  }

  .card-reserva {
    flex: 1;
    width: 100%;
    box-sizing: border-box;
  }

  /* En móviles el calendario se vuelve un modal centrado */
  :deep(.calendar-modal) {
    position: fixed !important;
    top: 50% !important;
    left: 50% !important;
    right: auto !important;
    transform: translate(-50%, -50%) !important;
    width: 90vw !important;
    max-height: 85vh;
    overflow-y: auto;
  }

  :deep(.guests-dropdown) {
    position: fixed !important;
    top: 50% !important;
    left: 50% !important;
    transform: translate(-50%, -50%) !important;
    width: 90vw !important;
  }
}

@media (max-width: 480px) {
  .servicios-grid {
    flex-wrap: wrap;
  }
}
</style>