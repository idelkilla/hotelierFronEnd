<template>
  <div class="calendar-modal">

    <!-- Tabs -->
    <div class="cal-tabs" v-if="range">
      <button v-for="tab in tabs" :key="tab.id"
        :class="['cal-tab', { active: activeTab === tab.id }]"
        @click="activeTab = tab.id">{{ tab.label }}</button>
    </div>

    <!-- ── CALENDARIO ─────────────────────────────────── -->
    <template v-if="activeTab === 'calendario'">
      <div class="cal-grid">

        <!-- Mes 1 -->
        <div class="cal-month">
          <div class="cal-month-header">
            <button class="cal-nav" @click="navigate(-1)" aria-label="Anterior">
              <svg width="18" height="18" viewBox="0 0 24 24">
                <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" fill="currentColor"/>
              </svg>
            </button>
            <span>{{ monthName(viewYear, viewMonth) }}</span>
            <span class="cal-nav" style="visibility:hidden" />
          </div>
          <div class="cal-week-header">
            <span v-for="d in DAYS" :key="d">{{ d }}</span>
          </div>
          <div class="cal-days">
            <div v-for="e in startOffset(viewYear, viewMonth)" :key="'e1-'+e" class="cal-day empty" />
            <div v-for="day in daysInMonth(viewYear, viewMonth)" :key="'m1-'+day"
              :class="dayClasses(viewYear, viewMonth, day)"
              @click="handleClick(viewYear, viewMonth, day)"
              @mouseenter="hovering = makeDate(viewYear, viewMonth, day)"
              @mouseleave="hovering = null">
              <span class="cal-day-inner">{{ day }}</span>
            </div>
          </div>
        </div>

        <div class="cal-divider" />

        <!-- Mes 2 -->
        <div class="cal-month">
          <div class="cal-month-header">
            <span class="cal-nav" style="visibility:hidden" />
            <span>{{ monthName(nextYear, nextMonth) }}</span>
            <button class="cal-nav" @click="navigate(1)" aria-label="Siguiente">
              <svg width="18" height="18" viewBox="0 0 24 24">
                <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z" fill="currentColor"/>
              </svg>
            </button>
          </div>
          <div class="cal-week-header">
            <span v-for="d in DAYS" :key="d">{{ d }}</span>
          </div>
          <div class="cal-days">
            <div v-for="e in startOffset(nextYear, nextMonth)" :key="'e2-'+e" class="cal-day empty" />
            <div v-for="day in daysInMonth(nextYear, nextMonth)" :key="'m2-'+day"
              :class="dayClasses(nextYear, nextMonth, day)"
              @click="handleClick(nextYear, nextMonth, day)"
              @mouseenter="hovering = makeDate(nextYear, nextMonth, day)"
              @mouseleave="hovering = null">
              <span class="cal-day-inner">{{ day }}</span>
            </div>
          </div>
        </div>

      </div>
    </template>

    <!-- ── FECHAS FLEXIBLES ───────────────────────────── -->
    <template v-else>
      <div class="flex-body">

        <!-- Duración -->
        <div class="flex-section">
          <h3 class="flex-title">¿Cuánto tiempo te quedarás?</h3>
          <div class="flex-chips">
            <button v-for="dur in duraciones" :key="dur.id"
              :class="['cal-chip', { active: duracionSel === dur.id }]"
              @click="duracionSel = dur.id">{{ dur.label }}</button>
          </div>
          <label class="flex-weekend">
            <input type="checkbox" v-model="incluyeFinde" />
            <span class="flex-check-box" :class="{ checked: incluyeFinde }">
              <svg v-if="incluyeFinde" width="11" height="11" viewBox="0 0 12 12" fill="none">
                <path d="M2 6l3 3 5-5" stroke="white" stroke-width="2" stroke-linecap="round"/>
              </svg>
            </span>
            Debe incluir el fin de semana
          </label>
        </div>

        <div class="flex-divider" />

        <!-- Meses -->
        <div class="flex-section">
          <h3 class="flex-title">¿Cuándo quieres viajar?</h3>
          <p class="flex-subtitle">Puedes elegir más de un mes.</p>
          <div class="flex-months">
            <button v-for="mes in mesesDisponibles" :key="mes.key"
              :class="['flex-month-card', { active: mesesSel.includes(mes.key) }]"
              @click="toggleMes(mes.key)">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" stroke-width="1.6" stroke-linecap="round">
                <rect x="3" y="4" width="18" height="18" rx="2"/>
                <line x1="3" y1="9" x2="21" y2="9"/>
                <line x1="8" y1="2" x2="8" y2="6"/>
                <line x1="16" y1="2" x2="16" y2="6"/>
              </svg>
              <span class="flex-month-name">{{ mes.nombre }}</span>
              <span class="flex-month-year">{{ mes.year }}</span>
            </button>
          </div>
        </div>

      </div>
    </template>

    <!-- Footer compartido (Visible tanto en Calendario como en Flexibles) -->
    <div class="cal-footer">
      <!-- Los chips de proximidad solo se muestran en la pestaña de calendario y si es rango -->
      <div class="cal-footer-top" v-if="activeTab === 'calendario' && range">
        <button v-for="chip in chips" :key="chip.id"
          :class="['cal-chip', { active: activeChip === chip.id }]"
          @click="selectChip(chip.id)">
          <svg v-if="chip.id !== 'exactas'" width="14" height="14" viewBox="0 0 24 24"
            fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
            <line x1="12" y1="5" x2="12" y2="19"/>
            <line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
          {{ chip.label }}
        </button>
      </div>
      <div class="cal-actions">
        <button class="btn-clear" @click="clearDates">Borrar fechas</button>
        <button class="btn-done" @click="confirmSelection">Listo</button>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  modelValue: { type: Object, default: () => ({ start: null, end: null }) },
  range: { type: Boolean, default: true },
})
const emit = defineEmits(['update:modelValue', 'range-selected', 'update:dates', 'close'])

function formatDateStr(date) {
  if (!date) return ''
  return `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,'0')}-${String(date.getDate()).padStart(2,'0')}`
}

const DAYS = ['lun','mar','mié','jue','vie','sáb','dom']
const tabs = [
  { id: 'calendario', label: 'Calendario' },
  { id: 'flexibles',  label: 'Fechas flexibles' },
]
const chips = [
  { id: 'exactas', label: 'Fechas exactas' },
  { id: '1dia',    label: '± 1 día'        },
  { id: '2dias',   label: '± 2 días'       },
  { id: '3dias',   label: '± 3 días'       },
  { id: '7dias',   label: '± 7 días'       },
]
const duraciones = [
  { id: '1n',  label: '1 noche'    },
  { id: '2n',  label: '2-3 noches' },
  { id: '4n',  label: '4-5 noches' },
  { id: '6n',  label: '6-7 noches' },
]

// Estado general
const activeTab   = ref('calendario')
const activeChip  = ref('exactas')
const duracionSel = ref('1n')
const incluyeFinde = ref(false)
const mesesSel    = ref([])

const today = new Date(); today.setHours(0,0,0,0)
const viewYear  = ref(today.getFullYear())
const viewMonth = ref(today.getMonth())

const rangeStart   = ref(props.modelValue?.start ?? null)
const rangeEnd     = ref(props.modelValue?.end   ?? null)
const hovering     = ref(null)
const displayStart = ref(null)
const displayEnd   = ref(null)

const nextYear  = computed(() => viewMonth.value === 11 ? viewYear.value + 1 : viewYear.value)
const nextMonth = computed(() => (viewMonth.value + 1) % 12)

// Próximos 6 meses para el tab flexible
const mesesDisponibles = computed(() => {
  const meses = []
  const NOMBRES = ['Enero','Febrero','Marzo','Abril','Mayo','Junio',
                   'Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre']
  for (let i = 0; i < 6; i++) {
    const d = new Date(today.getFullYear(), today.getMonth() + i, 1)
    meses.push({
      key:    `${d.getFullYear()}-${d.getMonth()}`,
      nombre: NOMBRES[d.getMonth()],
      year:   d.getFullYear(),
    })
  }
  return meses
})

function toggleMes(key) {
  const idx = mesesSel.value.indexOf(key)
  if (idx === -1) mesesSel.value.push(key)
  else            mesesSel.value.splice(idx, 1)
}

function makeDate(y, m, d) {
  const date = new Date(y, m, d); date.setHours(0,0,0,0); return date
}
function monthName(y, m) {
  return new Intl.DateTimeFormat('es-ES', { month: 'long', year: 'numeric' }).format(new Date(y, m, 1))
}
function daysInMonth(y, m) { return new Date(y, m+1, 0).getDate() }
function startOffset(y, m) { return (new Date(y, m, 1).getDay() + 6) % 7 }

function dayClasses(y, m, day) {
  const date = makeDate(y, m, day)
  const t = date.getTime()
  const cls = ['cal-day']

  if (date < today) return [...cls, 'past']
  if (t === today.getTime()) cls.push('today')

  // Si no es un rango, solo marcamos el día seleccionado como inicio y fin (círculo azul simple)
  if (!props.range) {
    if (rangeStart.value && t === rangeStart.value.getTime()) {
      cls.push('range-start', 'range-end')
    }
    return cls
  }

  const lo_date = activeChip.value !== 'exactas' && displayStart.value ? displayStart.value : rangeStart.value
  const hi_date = activeChip.value !== 'exactas' && displayEnd.value   ? displayEnd.value   : (rangeEnd.value ?? hovering.value ?? null)

  if (lo_date) {
    const start  = lo_date.getTime()
    const rawEnd = hi_date?.getTime() ?? null
    const lo = rawEnd !== null ? Math.min(start, rawEnd) : start
    const hi = rawEnd !== null ? Math.max(start, rawEnd) : start

    if      (t === lo && t === hi) cls.push('range-start', 'range-end')
    else if (t === lo)             cls.push('range-start')
    else if (t === hi)             cls.push('range-end')
    else if (t > lo && t < hi)    cls.push('in-range')
  }

  return cls
}

function handleClick(y, m, day) {
  const date = makeDate(y, m, day)
  if (date < today) return

  // Selección única: cualquier clic establece el día y limpia cualquier rango previo
  if (!props.range) {
    rangeStart.value = date
    rangeEnd.value   = null
    displayStart.value = null
    displayEnd.value   = null
    activeChip.value = 'exactas'
    return
  }

  if (!rangeStart.value || rangeEnd.value) {
    rangeStart.value = date
    rangeEnd.value   = null
    displayStart.value = null
    displayEnd.value   = null
    activeChip.value = 'exactas'
    if (!props.range) emitRange()
  } else if (date.getTime() === rangeStart.value.getTime()) {
    rangeStart.value = null
  } else if (date < rangeStart.value) {
    rangeEnd.value   = rangeStart.value
    rangeStart.value = date
  } else {
    rangeEnd.value = date
  }
}

const flexibleSummary = computed(() => {
  const dur = duraciones.find(d => d.id === duracionSel.value)?.label || ''
  const selectedMonthNames = mesesSel.value.map(key => {
    const mes = mesesDisponibles.value.find(m => m.key === key)
    return mes ? mes.nombre : ''
  }).filter(Boolean)
  
  let monthStr = ''
  if (selectedMonthNames.length > 0) {
    monthStr = ' en ' + selectedMonthNames.join(', ')
  }
  
  const weekend = incluyeFinde.value ? ' (incl. finde)' : ''
  return `${dur}${monthStr}${weekend}`
})

function confirmSelection() {
  if (activeTab.value === 'flexibles') {
    emit('update:dates', { start: flexibleSummary.value, end: 'FLEXIBLE' })
  } else {
    emitRange()
  }
  emit('close')
}

function emitRange() {
  const payload = { start: rangeStart.value, end: rangeEnd.value }
  emit('update:modelValue', payload)
  emit('range-selected', payload)
  emit('update:dates', {
    start: formatDateStr(rangeStart.value),
    end:   formatDateStr(rangeEnd.value),
  })
}

function clearDates() {
  if (activeTab.value === 'calendario') {
    rangeStart.value = null
    rangeEnd.value   = null
    displayStart.value = null
    displayEnd.value   = null
    emitRange()
  } else {
    // Limpia la selección de fechas flexibles
    mesesSel.value = []
    duracionSel.value = '1n'
    incluyeFinde.value = false
    emit('update:dates', { start: '', end: '' })
  }
}

function selectChip(id) {
  activeChip.value = id
  if (!rangeStart.value || !rangeEnd.value) return
  const offsetMap = { exactas: 0, '1dia': 1, '2dias': 2, '3dias': 3, '7dias': 7 }
  const offset = offsetMap[id] ?? 0
  const newStart = new Date(rangeStart.value.getTime() - offset * 86400000)
  const newEnd   = new Date(rangeEnd.value.getTime()   + offset * 86400000)
  displayStart.value = newStart < today ? today : newStart
  displayEnd.value   = newEnd
}

function navigate(dir) {
  viewMonth.value += dir
  if (viewMonth.value > 11) { viewMonth.value = 0;  viewYear.value++ }
  if (viewMonth.value < 0)  { viewMonth.value = 11; viewYear.value-- }
}
</script>

<style scoped src="../assets/css/CalendarSelector.css"></style>
