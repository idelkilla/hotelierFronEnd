<template>
  <div class="autos-search">

    <!-- Tabs principales -->
    <div class="vuelos-tabs">
      <button
        v-for="tab in tabs" :key="tab.id"
        :class="['vuelo-tab', { active: tipoAuto === tab.id }]"
        @click="tipoAuto = tab.id"
      >
        {{ tab.label }}
      </button>
    </div>

    <!-- ── RENTA DE AUTOS ──────────────────────────────────── -->
    <div v-if="tipoAuto === 'RENTA'" class="search-fields-dynamic">

      <!-- Entrega -->
      <div class="dynamic-field-wrapper" style="position:relative;" ref="entregaWrapper">
        <div class="field-group border-style">
          <label>Entrega</label>
          <div class="input-with-icon" :class="{ 'has-chip': selectedEntrega && entregaActivo }">
            <span class="material-symbols-outlined custom-icon">location_on</span>
            <div v-if="selectedEntrega && entregaActivo" class="location-chip" @click="editarEntrega">
              <span class="chip-text">{{ labelEntrega }}</span>
              <button class="chip-clear" @click.stop="clearEntrega">
                <span class="material-symbols-outlined" style="font-size:14px">close</span>
              </button>
            </div>
            <input
              v-else
              type="text"
              :value="entregaActivo ? entrega : (selectedEntrega ? labelEntrega : entrega)"
              @input="e => { entrega = e.target.value; fetchEntrega() }"
              autocomplete="off"
              placeholder="Entrega"
              @focus="abrirDropEntrega"
            />
          </div>
        </div>
        <LocationDropdown
          v-if="mostrarDropEntrega"
          :loading="loadingEntrega"
          :items="sugerenciasEntrega"
          @select="seleccionarEntrega"
        />
      </div>

      <!-- Devolución -->
      <div class="dynamic-field-wrapper" style="position:relative;" ref="devolucionWrapper">
        <div class="field-group border-style">
          <label>Devolución</label>
          <div class="input-with-icon" :class="{ 'has-chip': selectedDevolucion && devolucionActivo }">
            <span class="material-symbols-outlined custom-icon">location_on</span>
            <div v-if="selectedDevolucion && devolucionActivo" class="location-chip" @click="editarDevolucion">
              <span class="chip-text">{{ labelDevolucion }}</span>
              <button class="chip-clear" @click.stop="clearDevolucion">
                <span class="material-symbols-outlined" style="font-size:14px">close</span>
              </button>
            </div>
            <input
              v-else
              type="text"
              :value="devolucionActivo ? devolucion : (selectedDevolucion ? labelDevolucion : devolucion)"
              @input="e => { devolucion = e.target.value; fetchDevolucion() }"
              autocomplete="off"
              placeholder="Devolución (igual a la entrega)"
              @focus="abrirDropDevolucion"
            />
          </div>
        </div>
        <LocationDropdown
          v-if="mostrarDropDevolucion"
          :loading="loadingDevolucion"
          :items="sugerenciasDevolucion"
          @select="seleccionarDevolucion"
        />
      </div>

      <!-- Fechas -->
      <div class="dynamic-field-wrapper date-field" style="position:relative;">
        <div class="field-group border-style" @click="toggleCalendario">
          <label>Fechas</label>
          <div class="input-with-icon">
            <span class="material-symbols-outlined custom-icon">calendar_month</span>
            <input type="text" readonly :value="resumenFechas" placeholder="Entrada — Salida" class="readonly-input" />
          </div>
        </div>
        <CalendarSelector
          v-if="mostrarCalendario"
          :range="true"
          @update:dates="onDatesSelected"
          @close="mostrarCalendario = false"
        />
      </div>

      <!-- Hora entrega -->
      <div class="dynamic-field-wrapper" style="flex: 0 0 140px; min-width: 120px;">
        <div class="field-group border-style">
          <label>Entrega</label>
          <div class="input-with-icon">
            <span class="material-symbols-outlined custom-icon">schedule</span>
            <select v-model="horaEntrega" class="readonly-input" style="padding-left: 40px; cursor:pointer; appearance:auto;">
              <option v-for="h in horas" :key="h" :value="h">{{ h }}</option>
            </select>
          </div>
        </div>
      </div>

      <!-- Hora devolución -->
      <div class="dynamic-field-wrapper" style="flex: 0 0 140px; min-width: 120px;">
        <div class="field-group border-style">
          <label>Devolución</label>
          <div class="input-with-icon">
            <span class="material-symbols-outlined custom-icon">schedule</span>
            <select v-model="horaDevolucion" class="readonly-input" style="padding-left: 40px; cursor:pointer; appearance:auto;">
              <option v-for="h in horas" :key="h" :value="h">{{ h }}</option>
            </select>
          </div>
        </div>
      </div>

      <!-- Buscar -->
      <div class="search-button-container">
        <BuscarButton @click="handleSearch" />
      </div>
    </div>

    <!-- Extras debajo de renta -->
    <div v-if="tipoAuto === 'RENTA'" class="autos-extras-row">
      <button class="autos-extra-btn">Mostrar tarifas AARP</button>

      <div style="position: relative;">
        <button class="autos-extra-btn autos-extra-btn--dropdown" @click="toggleDescuento">
          Códigos de descuento
          <span class="material-symbols-outlined" style="font-size:16px; margin-left:4px">expand_more</span>
        </button>

        <!-- Popup descuento -->
        <div v-if="mostrarDescuento" class="descuento-popup">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:16px;">
            <span style="font-size:14px; font-weight:600; color:#333;">Código de descuento</span>
            <button @click="limpiarDescuento" style="background:none; border:none; color:#265073; font-size:13px; font-weight:600; cursor:pointer;">Borrar</button>
          </div>

          <div class="field-group border-style" style="margin-bottom:10px;">
            <div class="input-with-icon">
              <select v-model="arrendadora" style="width:100%; height:48px; border:1px solid #dadce0; border-radius:12px; padding:0 12px; font-size:14px; color:#333; appearance:auto; cursor:pointer;">
                <option value="">Arrendadora preferida</option>
                <option>Hertz</option>
                <option>Avis</option>
                <option>Budget</option>
                <option>Enterprise</option>
                <option>National</option>
              </select>
            </div>
          </div>

          <div class="field-group border-style" style="margin-bottom:16px;">
            <div class="input-with-icon">
              <select v-model="tipoDescuento" style="width:100%; height:48px; border:1px solid #dadce0; border-radius:12px; padding:0 12px; font-size:14px; color:#999; appearance:auto; cursor:pointer;">
                <option value="">Tipo de descuento</option>
                <option>Corporativo</option>
                <option>AAA</option>
                <option>AARP</option>
                <option>Gobierno</option>
              </select>
            </div>
          </div>

          <button class="btn-listo" @click="mostrarDescuento = false">Listo</button>
        </div>
      </div>
    </div>

    <!-- ── TRASLADO AL AEROPUERTO ─────────────────────────── -->
    <div v-if="tipoAuto === 'TRASLADO'">

      <!-- Sub-tabs dirección -->
      <div class="traslado-tabs">
        <button
          v-for="dir in direcciones" :key="dir.id"
          :class="['traslado-tab', { active: direccion === dir.id }]"
          @click="direccion = dir.id"
        >
          {{ dir.label }}
        </button>
      </div>

      <!-- Fila 1: Aeropuerto + Hotel -->
      <div class="search-fields-dynamic" style="margin-top: 16px;">
        <div class="dynamic-field-wrapper" style="position:relative;" ref="aeropuertoWrapper">
          <div class="field-group border-style">
            <div class="input-with-icon" :class="{ 'has-chip': selectedAeropuerto && aeropuertoActivo }">
              <span class="material-symbols-outlined custom-icon">location_on</span>
              <div v-if="selectedAeropuerto && aeropuertoActivo" class="location-chip" @click="editarAeropuerto">
                <span class="chip-text">{{ labelAeropuerto }}</span>
                <button class="chip-clear" @click.stop="clearAeropuerto">
                  <span class="material-symbols-outlined" style="font-size:14px">close</span>
                </button>
              </div>
              <input
                v-else
                type="text"
                :value="aeropuertoActivo ? aeropuerto : (selectedAeropuerto ? labelAeropuerto : aeropuerto)"
                @input="e => { aeropuerto = e.target.value; fetchAeropuerto() }"
                @focus="abrirDropAeropuerto"
                placeholder="Aeropuerto"
                autocomplete="off"
              />
            </div>
          </div>
          <LocationDropdown
            v-if="mostrarDropAeropuerto"
            :loading="loadingAeropuerto"
            :items="sugerenciasAeropuerto"
            @select="seleccionarAeropuerto"
          />
        </div>

        <div class="dynamic-field-wrapper" style="position:relative;">
          <div class="field-group border-style">
            <div class="input-with-icon">
              <span class="material-symbols-outlined custom-icon">hotel</span>
              <input type="text" v-model="hotel" placeholder="Hotel" autocomplete="off" />
            </div>
          </div>
        </div>
      </div>

      <!-- Fila 2: Personas + Fecha + Hora + Buscar -->
      <div class="search-fields-dynamic" style="margin-top: 10px;">

        <!-- Personas -->
        <div class="dynamic-field-wrapper" style="position:relative; flex: 0 0 200px;">
          <div class="field-group border-style" @click="togglePersonas">
            <label>Personas</label>
            <div class="input-with-icon">
              <span class="material-symbols-outlined custom-icon">person</span>
              <input type="text" readonly :value="`${personas} persona${personas > 1 ? 's' : ''}`" class="readonly-input" />
            </div>
          </div>
          <!-- Mini popup personas -->
          <div v-if="mostrarPersonas" class="guest-popup" style="width:240px;">
            <div style="display:flex; align-items:center; justify-content:space-between; padding:8px 0;">
              <span style="font-size:14px; color:#333;">Personas</span>
              <div style="display:flex; align-items:center; gap:12px;">
                <button class="count-btn" @click="personas = Math.max(1, personas-1)">−</button>
                <span style="font-size:15px; font-weight:600; min-width:20px; text-align:center;">{{ personas }}</span>
                <button class="count-btn" @click="personas++">+</button>
              </div>
            </div>
            <button class="btn-listo" style="margin-top:12px;" @click="mostrarPersonas = false">Listo</button>
          </div>
        </div>

        <!-- Fecha -->
        <div class="dynamic-field-wrapper date-field" style="position:relative;">
          <div class="field-group border-style" @click="toggleCalendarioTraslado">
            <label>Fecha de llegada del vuelo</label>
            <div class="input-with-icon">
              <span class="material-symbols-outlined custom-icon">calendar_month</span>
              <input type="text" readonly :value="fmtFecha(fechaTraslado)" placeholder="Seleccionar" class="readonly-input" />
            </div>
          </div>
          <CalendarSelector
            v-if="mostrarCalendarioTraslado"
            :range="false"
            @update:dates="d => { fechaTraslado = d.start; mostrarCalendarioTraslado = false }"
            @close="mostrarCalendarioTraslado = false"
          />
        </div>

        <!-- Hora -->
        <div class="dynamic-field-wrapper" style="flex: 0 0 180px; min-width:140px;">
          <div class="field-group border-style">
            <label>Hora de llegada del vuelo</label>
            <div class="input-with-icon">
              <span class="material-symbols-outlined custom-icon">schedule</span>
              <select v-model="horaTraslado" style="width:100%; height:52px; border:1px solid #dadce0; border-radius:15px; padding:0 12px 0 45px; font-size:14px; color:#333; appearance:auto; cursor:pointer; background:#fff; outline:none;">
                <option v-for="h in horas" :key="h" :value="h">{{ h }}</option>
              </select>
            </div>
          </div>
        </div>

        <!-- Buscar -->
        <div class="search-button-container">
          <BuscarButton @click="handleSearch" />
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import BuscarButton from '../components/ButtonSearch.vue'
import CalendarSelector from '../components/CalendarSelector.vue'
import LocationDropdown from '../components/LocationDropdown.vue'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'
const router = useRouter()

const props = defineProps({
  initialDestino: String,
  initialEntrada: String,
  initialSalida: String,
})

// ── Tabs ──────────────────────────────────────────────────
const tabs = [
  { id: 'RENTA',    label: 'Renta de autos' },
  { id: 'TRASLADO', label: 'Traslado del/al aeropuerto' },
]
const tipoAuto = ref('RENTA')

const direcciones = [
  { id: 'AEROPUERTO_HOTEL', label: 'Del aeropuerto al hotel' },
  { id: 'HOTEL_AEROPUERTO', label: 'Del hotel al aeropuerto' },
  { id: 'REDONDO',          label: 'Redondo' },
]
const direccion = ref('AEROPUERTO_HOTEL')

// ── Horas ─────────────────────────────────────────────────
const horas = Array.from({ length: 48 }, (_, i) => {
  const h = Math.floor(i / 2)
  const m = i % 2 === 0 ? '00' : '30'
  const ampm = h < 12 ? 'a.m.' : 'p.m.'
  const h12 = h === 0 ? 12 : h > 12 ? h - 12 : h
  return `${h12}:${m} ${ampm}`
})

// ── Renta: campos ─────────────────────────────────────────
const entrega = ref('')
const devolucion = ref('')
const selectedEntrega = ref(null)
const labelEntrega = ref('')
const entregaActivo = ref(false)
const selectedDevolucion = ref(null)
const labelDevolucion = ref('')
const devolucionActivo = ref(false)
const mostrarDropEntrega = ref(false)
const mostrarDropDevolucion = ref(false)
const loadingEntrega = ref(false)
const loadingDevolucion = ref(false)
const sugerenciasEntrega = ref([])
const sugerenciasDevolucion = ref([])
const horaEntrega = ref('10:30 a.m.')
const horaDevolucion = ref('10:30 a.m.')

const entregaWrapper = ref(null)
const devolucionWrapper = ref(null)

async function fetchLugar(q, sugerencias, loading) {
  loading.value = true
  try {
    const res = await fetch(`${API_URL}/api/search/aeropuertos?q=${q}`)
    sugerencias.value = await res.json()
  } catch { sugerencias.value = [] }
  finally { loading.value = false }
}

const abrirDropEntrega = () => { entregaActivo.value = true; mostrarDropEntrega.value = true; fetchLugar(entrega.value, sugerenciasEntrega, loadingEntrega) }
const abrirDropDevolucion = () => { devolucionActivo.value = true; mostrarDropDevolucion.value = true; fetchLugar(devolucion.value, sugerenciasDevolucion, loadingDevolucion) }
const fetchEntrega = () => fetchLugar(entrega.value, sugerenciasEntrega, loadingEntrega)
const fetchDevolucion = () => fetchLugar(devolucion.value, sugerenciasDevolucion, loadingDevolucion)

function seleccionarEntrega(loc) {
  selectedEntrega.value = loc
  entrega.value = `${loc.ubicacion}, ${loc.ciudad}`
  labelEntrega.value = loc.iata ? `${loc.iata} · ${loc.ciudad}` : loc.ciudad
  entregaActivo.value = false
  mostrarDropEntrega.value = false
}
function seleccionarDevolucion(loc) {
  selectedDevolucion.value = loc
  devolucion.value = `${loc.ubicacion}, ${loc.ciudad}`
  labelDevolucion.value = loc.iata ? `${loc.iata} · ${loc.ciudad}` : loc.ciudad
  devolucionActivo.value = false
  mostrarDropDevolucion.value = false
}
function clearEntrega() { selectedEntrega.value = null; labelEntrega.value = ''; entrega.value = ''; entregaActivo.value = false; mostrarDropEntrega.value = false }
function clearDevolucion() { selectedDevolucion.value = null; labelDevolucion.value = ''; devolucion.value = ''; devolucionActivo.value = false; mostrarDropDevolucion.value = false }
function editarEntrega() { clearEntrega(); nextTick(() => entregaWrapper.value?.querySelector('input')?.focus()) }
function editarDevolucion() { clearDevolucion(); nextTick(() => devolucionWrapper.value?.querySelector('input')?.focus()) }

// ── Fechas renta ──────────────────────────────────────────
const fechaInicio = ref(props.initialEntrada || '')
const fechaFin = ref(props.initialSalida || '')
const mostrarCalendario = ref(false)
const toggleCalendario = () => (mostrarCalendario.value = !mostrarCalendario.value)
function onDatesSelected(dates) { fechaInicio.value = dates.start; fechaFin.value = dates.end; mostrarCalendario.value = false }
function fmtFecha(str) {
  if (!str) return ''
  const [y, m, d] = str.split('-').map(Number)
  return new Date(y, m - 1, d).toLocaleDateString('es-ES', { weekday: 'short', day: 'numeric', month: 'short' })
}
const resumenFechas = computed(() => {
  if (!fechaInicio.value) return ''
  return `${fmtFecha(fechaInicio.value)}${fechaFin.value ? ' — ' + fmtFecha(fechaFin.value) : ''}`
})

// ── Descuento popup ───────────────────────────────────────
const mostrarDescuento = ref(false)
const arrendadora = ref('')
const tipoDescuento = ref('')
const toggleDescuento = () => (mostrarDescuento.value = !mostrarDescuento.value)
function limpiarDescuento() { arrendadora.value = ''; tipoDescuento.value = '' }

// ── Traslado ──────────────────────────────────────────────
const aeropuerto = ref('')
const selectedAeropuerto = ref(null)
const labelAeropuerto = ref('')
const aeropuertoActivo = ref(false)
const mostrarDropAeropuerto = ref(false)
const loadingAeropuerto = ref(false)
const sugerenciasAeropuerto = ref([])
const aeropuertoWrapper = ref(null)

const hotel = ref('')
const personas = ref(1)
const mostrarPersonas = ref(false)
const fechaTraslado = ref('')
const mostrarCalendarioTraslado = ref(false)
const horaTraslado = ref('10:30 a.m.')

const abrirDropAeropuerto = () => { aeropuertoActivo.value = true; mostrarDropAeropuerto.value = true; fetchAeropuerto() }
const fetchAeropuerto = () => fetchLugar(aeropuerto.value, sugerenciasAeropuerto, loadingAeropuerto)

function seleccionarAeropuerto(loc) {
  selectedAeropuerto.value = loc
  aeropuerto.value = `${loc.ubicacion}, ${loc.ciudad}`
  labelAeropuerto.value = loc.iata ? `${loc.iata} · ${loc.ciudad}` : loc.ciudad
  aeropuertoActivo.value = false
  mostrarDropAeropuerto.value = false
}
function clearAeropuerto() { selectedAeropuerto.value = null; labelAeropuerto.value = ''; aeropuerto.value = ''; aeropuertoActivo.value = false; mostrarDropAeropuerto.value = false }
function editarAeropuerto() { clearAeropuerto(); nextTick(() => aeropuertoWrapper.value?.querySelector('input')?.focus()) }

const togglePersonas = () => (mostrarPersonas.value = !mostrarPersonas.value)
const toggleCalendarioTraslado = () => (mostrarCalendarioTraslado.value = !mostrarCalendarioTraslado.value)

// ── Search ────────────────────────────────────────────────
function handleSearch() {
  if (tipoAuto.value === 'RENTA') {
    router.push({ path: '/autos', query: { tipo: 'RENTA', entrega: entrega.value, devolucion: devolucion.value, entrada: fechaInicio.value, salida: fechaFin.value, hora_entrega: horaEntrega.value, hora_devolucion: horaDevolucion.value } })
  } else {
    router.push({ path: '/autos', query: { tipo: 'TRASLADO', direccion: direccion.value, aeropuerto: aeropuerto.value, hotel: hotel.value, personas: personas.value, fecha: fechaTraslado.value, hora: horaTraslado.value } })
  }
}

// ── Cierre fuera ──────────────────────────────────────────
const handleOutsideClick = (e) => {
  if (!e.target.closest('.dynamic-field-wrapper') && !e.target.closest('.descuento-popup') && !e.target.closest('.autos-extra-btn')) {
    mostrarDropEntrega.value = false
    mostrarDropDevolucion.value = false
    mostrarCalendario.value = false
    mostrarDescuento.value = false
    mostrarPersonas.value = false
    mostrarCalendarioTraslado.value = false
    mostrarDropAeropuerto.value = false
    entregaActivo.value = false
    devolucionActivo.value = false
    aeropuertoActivo.value = false
  }
}
onMounted(() => window.addEventListener('mousedown', handleOutsideClick))
onUnmounted(() => window.removeEventListener('mousedown', handleOutsideClick))
</script>

<style scoped>
@import '../assets/css/FormSearch.css';

.autos-search { padding: 12px 0; width: 100%; }

.traslado-tabs {
  display: flex;
  gap: 8px;
  margin: 16px 0 4px;
  flex-wrap: wrap;
}
.traslado-tab {
  background: none;
  border: 1px solid #dadce0;
  border-radius: 20px;
  padding: 6px 16px;
  font-size: 13px;
  font-weight: 500;
  color: #555;
  cursor: pointer;
  transition: all 0.2s;
}
.traslado-tab:hover { border-color: #265073; color: #265073; }
.traslado-tab.active {
  border: 2px solid #265073;
  color: #265073;
  font-weight: 700;
  background: #fff;
}

.autos-extras-row {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-top: 14px;
  flex-wrap: wrap;
}
.autos-extra-btn {
  display: inline-flex;
  align-items: center;
  background: none;
  border: 1px solid #dadce0;
  border-radius: 20px;
  padding: 6px 16px;
  font-size: 13px;
  color: #444;
  cursor: pointer;
  transition: border-color 0.2s;
}
.autos-extra-btn:hover { border-color: #265073; color: #265073; }

.descuento-popup {
  position: absolute;
  top: calc(100% + 6px);
  left: 0;
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.15);
  padding: 20px;
  width: 300px;
  z-index: 2000;
}

@media (max-width: 768px) {
  .traslado-tabs { gap: 6px; }
  .traslado-tab { font-size: 12px; padding: 5px 12px; }
  .autos-extras-row { gap: 8px; }
}
</style>

<style scoped>
@import '../assets/css/FormSearch.css';
</style>