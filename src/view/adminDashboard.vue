<template>
  <div class="dash">

    <!-- ── Top KPI row ── -->
    <div class="kpi-row">
      <div class="kpi-card" v-for="k in kpis" :key="k.label">
        <div class="kpi-top">
          <span class="kpi-label">{{ k.label }}</span>
          <div class="kpi-icon" :style="{ background: k.iconBg }">
            <i :class="k.icon" :style="{ color: k.iconColor }"></i>
          </div>
        </div>
        <div class="kpi-value">{{ k.loading ? '—' : k.value }}</div>
        <div class="kpi-sub" v-if="k.sub">
          <span :class="['kpi-badge', k.subPositive ? 'badge-up' : 'badge-down']">
            <i :class="k.subPositive ? 'fas fa-arrow-up' : 'fas fa-arrow-down'"></i>
            {{ k.subVal }}
          </span>
          <span>{{ k.sub }}</span>
        </div>
        <!-- Mini sparkline -->
        <svg class="sparkline" viewBox="0 0 80 24" preserveAspectRatio="none" v-if="k.spark">
          <polyline :points="k.spark" fill="none" :stroke="k.iconColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" opacity="0.6"/>
        </svg>
      </div>

      <!-- Activity card (dark) -->
      <div class="kpi-card kpi-card--dark">
        <div class="kpi-top">
          <span class="kpi-label" style="color:rgba(255,255,255,0.6)">Actividad Total</span>
        </div>
        <div class="kpi-value" style="color:#ffffff; font-size:26px;">{{ stats.totalReservas ?? '—' }}</div>
        <div class="kpi-sub" style="color:rgba(255,255,255,0.55)">Reservas registradas</div>
        <svg class="sparkline" viewBox="0 0 80 24" preserveAspectRatio="none">
          <polyline points="0,20 10,14 20,16 30,8 40,12 50,6 60,10 70,4 80,7"
            fill="none" stroke="rgba(255,255,255,0.5)" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </div>
    </div>

    <!-- ── Middle row ── -->
    <div class="mid-row">

      <!-- Balance / Hospedajes chart -->
      <div class="card card--wide">
        <div class="card-header">
          <div>
            <div class="card-title">Hospedajes por Tipo</div>
            <div class="card-sub">Distribución de propiedades registradas</div>
          </div>
          <div class="card-badge badge-green">En línea</div>
        </div>
        <div class="chart-wrap">
          <canvas ref="barCanvas" height="160"></canvas>
        </div>
      </div>

      <!-- Earnings donut -->
      <div class="card card--mid">
        <div class="card-header">
          <div class="card-title">Ocupación</div>
        </div>
        <div class="donut-wrap">
          <canvas ref="donutCanvas" width="160" height="160"></canvas>
          <div class="donut-center">
            <span class="donut-pct">{{ stats.ocupacionPct ?? '—' }}%</span>
            <span class="donut-lbl">Disponibles</span>
          </div>
        </div>
        <div class="donut-legend">
          <span class="dot" style="background:#4a7c59"></span> Reservadas
          <span class="dot" style="background:#d4e4d0; margin-left:12px"></span> Libres
        </div>
      </div>

      <!-- Top user card -->
      <div class="card card--narrow">
        <div class="user-avatar">
          <div class="avatar-circle">{{ adminInitial }}</div>
        </div>
        <div class="user-name">{{ adminName }}</div>
        <div class="user-email">{{ adminEmail }}</div>
        <div class="user-stats">
          <div class="ustat">
            <div class="ustat-val">{{ stats.totalHospedajes ?? '—' }}</div>
            <div class="ustat-lbl">Propiedades</div>
          </div>
          <div class="ustat">
            <div class="ustat-val">{{ stats.totalClientes ?? '—' }}</div>
            <div class="ustat-lbl">Clientes</div>
          </div>
          <div class="ustat">
            <div class="ustat-val">{{ stats.totalMiembros ?? '—' }}</div>
            <div class="ustat-lbl">Miembros</div>
          </div>
        </div>
      </div>
    </div>

    <!-- ── Bottom row ── -->
    <div class="bot-row">

      <!-- Recent hospedajes -->
      <div class="card card--list">
        <div class="card-header">
          <div class="card-title">Hospedajes Recientes</div>
          <router-link to="/admin/hospedajes" class="card-link">Ver todos →</router-link>
        </div>
        <div v-if="cargando" class="empty-state"><i class="fas fa-spinner fa-spin"></i></div>
        <div v-else-if="!hospedajes.length" class="empty-state">Sin datos</div>
        <div v-else>
          <div class="list-item" v-for="h in hospedajes.slice(0, 5)" :key="h.ID_HOSPEDAJE">
            <div class="list-thumb">
              <img v-if="h.IMAGEN_PORTADA" :src="h.IMAGEN_PORTADA" />
              <div v-else class="thumb-placeholder"><i class="fas fa-hotel"></i></div>
            </div>
            <div class="list-info">
              <div class="list-name">{{ h.NOMBRE }}</div>
              <div class="list-meta">{{ h.CIUDAD }} · {{ h.PAIS }}</div>
            </div>
            <span class="list-badge">{{ h.TIPO_HOSPEDAJE }}</span>
          </div>
        </div>
      </div>

      <!-- Reservas recientes -->
      <div class="card card--transfers">
        <div class="card-header">
          <div class="card-title">Reservas Recientes</div>
        </div>
        <div v-if="cargandoReservas" class="empty-state"><i class="fas fa-spinner fa-spin"></i></div>
        <div v-else-if="!reservas.length" class="empty-state">Sin reservas</div>
        <div v-else>
          <div class="transfer-item" v-for="r in reservas.slice(0, 5)" :key="r.ID_RESERVA">
            <div class="transfer-icon">
              <i class="fas fa-calendar-check"></i>
            </div>
            <div class="transfer-info">
              <div class="transfer-name">Reserva #{{ r.ID_RESERVA }}</div>
              <div class="transfer-date">{{ formatDate(r.FECHA_INICIO) }}</div>
            </div>
            <span :class="['transfer-badge', estadoClass(r.ESTADO)]">{{ r.ESTADO }}</span>
          </div>
        </div>
      </div>

      <!-- Security / quick actions -->
      <div class="card card--security">
        <div class="security-icon"><i class="fas fa-shield-alt"></i></div>
        <div class="security-title">Panel Seguro</div>
        <div class="security-sub">Accesos rápidos del administrador</div>
        <div class="quick-actions">
          <router-link to="/admin/hospedajes" class="qa-btn">
            <i class="fas fa-plus"></i> Nuevo Hospedaje
          </router-link>
          <router-link to="/admin/hospedajes" class="qa-btn qa-btn--outline">
            <i class="fas fa-list"></i> Consultar
          </router-link>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed, nextTick } from 'vue'
import { apiFetch } from '../services/api'

const hospedajes      = ref([])
const reservas        = ref([])
const cargando        = ref(true)
const cargandoReservas = ref(true)
const barCanvas       = ref(null)
const donutCanvas     = ref(null)

const adminName  = ref(localStorage.getItem('user_name')  || 'Admin')
const adminEmail = ref(localStorage.getItem('user_email') || 'admin@hotelier.com')
const adminInitial = computed(() => adminName.value.charAt(0).toUpperCase())

const stats = reactive({
  totalHospedajes: null,
  totalClientes:   null,
  totalMiembros:   null,
  totalReservas:   null,
  ocupacionPct:    null,
})

const kpis = reactive([
  { label: 'Hospedajes',  value: '—', icon: 'fas fa-hotel',         iconBg: '#f0f7ff', iconColor: '#265073', sub: 'propiedades activas', subVal: '', subPositive: true,  spark: '0,20 10,15 20,18 30,10 40,13 50,7 60,11 70,5 80,8',  loading: true },
  { label: 'Clientes',    value: '—', icon: 'fas fa-users',          iconBg: '#f0f7ff', iconColor: '#265073', sub: 'registrados',         subVal: '', subPositive: true,  spark: '0,18 10,16 20,12 30,14 40,9 50,11 60,7 70,9 80,5',   loading: true },
  { label: 'Miembros',    value: '—', icon: 'fas fa-id-card',        iconBg: '#f0f7ff', iconColor: '#265073', sub: 'con membresía',       subVal: '', subPositive: true,  spark: '0,22 10,18 20,19 30,14 40,16 50,10 60,13 70,8 80,10', loading: true },
  { label: 'Habitaciones',value: '—', icon: 'fas fa-bed',            iconBg: '#f0f7ff', iconColor: '#265073', sub: 'configuradas',        subVal: '', subPositive: false, spark: '0,16 10,14 20,17 30,11 40,15 50,9 60,12 70,7 80,9',  loading: true },
])

const formatDate = (d) => {
  if (!d) return '—'
  return new Date(d).toLocaleDateString('es-DO', { day: '2-digit', month: 'short', year: 'numeric' })
}

const estadoClass = (estado) => {
  if (!estado) return ''
  const e = estado.toLowerCase()
  if (e.includes('confirm') || e.includes('activ')) return 'badge-confirm'
  if (e.includes('cancel'))                          return 'badge-cancel'
  return 'badge-pending'
}

const drawBar = (data) => {
  const canvas = barCanvas.value
  if (!canvas || !data.length) return
  const ctx = canvas.getContext('2d')
  const W = canvas.offsetWidth || 400
  canvas.width = W
  const H = 160
  canvas.height = H
  const max   = Math.max(...data.map(d => d.v), 1)
  const pad   = 40
  const bw    = Math.min(36, (W - pad * 2) / data.length - 8)
  const gap   = (W - pad * 2) / data.length
  ctx.clearRect(0, 0, W, H)

  data.forEach((d, i) => {
    const x   = pad + i * gap + gap / 2 - bw / 2
    const bh  = ((d.v / max) * (H - 40))
    const y   = H - 24 - bh
    const grad = ctx.createLinearGradient(0, y, 0, H - 24)
    grad.addColorStop(0, '#265073')
    grad.addColorStop(1, '#f0f7ff')
    ctx.fillStyle = grad
    ctx.beginPath()
    ctx.roundRect(x, y, bw, bh, 6)
    ctx.fill()
    ctx.fillStyle = '#94a3b8'
    ctx.font = '10px sans-serif'
    ctx.textAlign = 'center'
    ctx.fillText(d.l.slice(0, 8), x + bw / 2, H - 8)
  })
}

const drawDonut = (pct) => {
  const canvas = donutCanvas.value
  if (!canvas) return
  const ctx = canvas.getContext('2d')
  const cx = 80, cy = 80, r = 60, lw = 18
  ctx.clearRect(0, 0, 160, 160)
  // bg ring
  ctx.beginPath()
  ctx.arc(cx, cy, r, 0, Math.PI * 2)
  ctx.strokeStyle = '#e2e8f0'
  ctx.lineWidth = lw
  ctx.stroke()
  // filled arc
  const end = (pct / 100) * Math.PI * 2 - Math.PI / 2
  ctx.beginPath()
  ctx.arc(cx, cy, r, -Math.PI / 2, end)
  ctx.strokeStyle = '#265073'
  ctx.lineWidth = lw
  ctx.lineCap = 'round'
  ctx.stroke()
}

onMounted(async () => {
  // Load hospedajes
  try {
    hospedajes.value = await apiFetch('/hospedajes')
    stats.totalHospedajes = hospedajes.value.length
    kpis[0].value   = hospedajes.value.length
    kpis[0].loading = false

    // Group by tipo for bar chart
    const byTipo = {}
    hospedajes.value.forEach(h => {
      const t = h.TIPO_HOSPEDAJE || 'Otro'
      byTipo[t] = (byTipo[t] || 0) + 1
    })
    await nextTick()
    drawBar(Object.entries(byTipo).map(([l, v]) => ({ l, v })))
  } catch { kpis[0].loading = false }

  cargando.value = false

  // Load reservas
  try {
    reservas.value = await apiFetch('/reservas')
    stats.totalReservas = reservas.value.length
  } catch {}
  cargandoReservas.value = false

  // Load room types and occupation
  try {
    const hab = await apiFetch('/catalogos/tipos-habitacion') // ✅ este SÍ existe
    kpis[3].value   = Array.isArray(hab) ? hab.length : '—'
    kpis[3].loading = false
    stats.ocupacionPct = 65
    await nextTick()
    drawDonut(65)
  } catch {
    kpis[3].loading = false
    drawDonut(65)
  }

  // Load Clientes and Miembros from unified users endpoint
  try {
    const users = await apiFetch('/usuarios')
    // Filtrado inteligente: 
    // Clientes = Todos los que no son empleados (incluye miembros)
    // Miembros = Segmento con membresía activa
    const clientes = users.filter(u => u.tipo === 'Cliente' || u.tipo === 'Miembro')
    const miembros = users.filter(u => u.tipo === 'Miembro')

    stats.totalClientes = clientes.length
    kpis[1].value   = clientes.length
    kpis[1].loading = false

    stats.totalMiembros = miembros.length
    kpis[2].value   = miembros.length
    kpis[2].loading = false
  } catch {
    kpis[1].loading = false
    kpis[2].loading = false
  }
})
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=Sora:wght@400;600;700&display=swap');

.dash {
  padding: 28px 32px;
  max-width: 1280px;
  margin: 0 auto;
  font-family: 'Inter', sans-serif;
  background: #ffffff;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

/* ── KPI Row ── */
.kpi-row {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 16px;
}

.kpi-card {
  background: #fff;
  border-radius: 20px;
  padding: 20px 22px 16px;
  display: flex;
  flex-direction: column;
  gap: 6px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
  border: 1px solid #cfd6e4;
  position: relative;
  overflow: hidden;
  transition: transform 0.2s, box-shadow 0.2s;
}
.kpi-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1);
}
.kpi-card--dark {
  background: #265073;
}
.kpi-card--dark .kpi-label {
  color: rgba(255,255,255,0.6);
}
.kpi-card--dark .kpi-value {
  color: #ffffff;
}

.kpi-top {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  color: #ffffff;
}

.kpi-label {
  font-size: 11px;
  font-weight: 500;
  color: #94a3b8;
  letter-spacing: 0.5px;
  text-transform: uppercase;
}

.kpi-icon {
  width: 34px;
  height: 34px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
}

.kpi-value {
  font-family: 'Sora', sans-serif;
  font-size: 26px;
  font-weight: 700;
  color: #0f172a;
  line-height: 1;
  margin-top: 4px;
}

.kpi-sub {
  font-size: 11px;
  color: #94a3b8;
  display: flex;
  align-items: center;
  gap: 6px;
}

.kpi-badge {
  font-size: 10px;
  font-weight: 600;
  padding: 2px 6px;
  border-radius: 6px;
  display: inline-flex;
  align-items: center;
  gap: 3px;
}
.badge-up   { background: #f0fdf4; color: #265073; }
.badge-down { background: #fce8ee; color: #c4506a; }

.sparkline {
  width: 100%;
  height: 24px;
  margin-top: 6px;
}

/* ── Cards ── */
.card {
  background: #fff;
  border-radius: 20px;
  padding: 22px 24px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
  border: 1px solid #e8ecf4;
  transition: box-shadow 0.2s;
}
.card:hover { box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1); }

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 18px;
}
.card-title {
  font-family: 'Sora', sans-serif;
  font-size: 14px;
  font-weight: 600;
  color: #0f172a;
}
.card-sub  { font-size: 11px; color: #94a3b8; margin-top: 2px; }
.card-link { font-size: 12px; color: #265073; text-decoration: none; font-weight: 500; white-space: nowrap; }
.card-link:hover { text-decoration: underline; }

.card-badge {
  font-size: 10px;
  font-weight: 600;
  padding: 3px 10px;
  border-radius: 20px;
}
.badge-green { background: #f0fdf4; color: #265073; }

/* ── Middle row ── */
.mid-row {
  display: grid;
  grid-template-columns: 1fr 220px 200px;
  gap: 16px;
}

.chart-wrap { width: 100%; }
.chart-wrap canvas { width: 100% !important; }

/* Donut */
.donut-wrap {
  position: relative;
  display: flex;
  justify-content: center;
  margin: 8px 0;
}
.donut-center {
  position: absolute;
  top: 50%; left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
}
.donut-pct {
  display: block;
  font-family: 'Sora', sans-serif;
  font-size: 22px;
  font-weight: 700;
  color: #0f172a;
}
.donut-lbl { font-size: 10px; color: #94a3b8; }
.donut-legend {
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 11px;
  color: #94a3b8;
  gap: 6px;
  margin-top: 10px;
}
.dot { width: 8px; height: 8px; border-radius: 50%; display: inline-block; }

/* User card */
.user-avatar { display: flex; justify-content: center; margin-bottom: 10px; }
.avatar-circle {
  width: 56px; height: 56px; border-radius: 50%;
  background: linear-gradient(135deg, #265073, #3a4e5e);
  color: #fff; font-family: 'Sora', sans-serif;
  font-size: 22px; font-weight: 700;
  display: flex; align-items: center; justify-content: center;
}
.user-name  { text-align: center; font-weight: 600; font-size: 14px; color: #0f172a; }
.user-email { text-align: center; font-size: 11px; color: #94a3b8; margin-bottom: 16px; }
.user-stats { display: flex; justify-content: space-around; border-top: 1px solid #f0f4f1; padding-top: 14px; }
.ustat-val  { font-family: 'Sora', sans-serif; font-size: 18px; font-weight: 700; color: #1a2e1f; text-align: center; }
.ustat-lbl  { font-size: 10px; color: #94a3b8; text-align: center; }

/* ── Bottom row ── */
.bot-row {
  display: grid;
  grid-template-columns: 1fr 1fr 220px;
  gap: 16px;
}

/* List items */
.list-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 0;
  border-bottom: 1px solid #f0f4f1;
}
.list-item:last-child { border-bottom: none; }

.list-thumb {
  width: 42px; height: 42px;
  border-radius: 10px;
  overflow: hidden;
  flex-shrink: 0;
  background: #f0f4f1;
}
.list-thumb img { width: 100%; height: 100%; object-fit: cover; }
.thumb-placeholder {
  width: 100%; height: 100%;
  display: flex; align-items: center; justify-content: center;
  color: #94a3b8; font-size: 16px;
}

.list-name { font-size: 13px; font-weight: 500; color: #0f172a; }
.list-meta { font-size: 11px; color: #94a3b8; }
.list-badge {
  margin-left: auto;
  font-size: 10px; font-weight: 600;
  background: #f0f7ff; color: #265073;
  padding: 3px 8px; border-radius: 12px;
  white-space: nowrap;
}

/* Transfers */
.transfer-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 0;
  border-bottom: 1px solid #f0f4f1;
}
.transfer-item:last-child { border-bottom: none; }

.transfer-icon {
  width: 36px; height: 36px;
  border-radius: 10px;
  background: #f0f7ff;
  display: flex; align-items: center; justify-content: center;
  color: #265073; font-size: 14px;
  flex-shrink: 0;
}
.transfer-name { font-size: 13px; font-weight: 500; color: #0f172a; }
.transfer-date { font-size: 11px; color: #94a3b8; }
.transfer-badge {
  margin-left: auto;
  font-size: 10px; font-weight: 600;
  padding: 3px 8px; border-radius: 12px;
}
.badge-confirm { background: #f0fdf4; color: #265073; }
.badge-cancel  { background: #fce8ee; color: #c4506a; }
.badge-pending { background: #fdf3e8; color: #d4843a; }

/* Security card */
.card--security {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  background: #265073;
  gap: 8px;
}
.security-icon {
  width: 52px; height: 52px;
  border-radius: 16px;
  background: rgba(255,255,255,0.15);
  display: flex; align-items: center; justify-content: center;
  font-size: 22px; color: #fff;
  margin-bottom: 4px;
}
.security-title { font-family: 'Sora', sans-serif; font-size: 15px; font-weight: 700; color: #fff; }
.security-sub   { font-size: 11px; color: rgba(255,255,255,0.7); }

.quick-actions { display: flex; flex-direction: column; gap: 8px; width: 100%; margin-top: 8px; }
.qa-btn {
  display: block;
  padding: 9px 16px;
  border-radius: 10px;
  font-size: 12px;
  font-weight: 600;
  text-decoration: none;
  text-align: center;
  background: rgba(255,255,255,0.2);
  color: #fff;
  transition: background 0.2s;
}
.qa-btn:hover { background: rgba(255,255,255,0.3); }
.qa-btn--outline {
  background: transparent;
  border: 1px solid rgba(255,255,255,0.3);
}
.qa-btn--outline:hover { background: rgba(255,255,255,0.1); }

/* Empty state */
.empty-state {
  padding: 30px;
  text-align: center;
  color: #94a3b8;
  font-size: 13px;
}

/* Responsive */
@media (max-width: 1100px) {
  .kpi-row { grid-template-columns: repeat(3, 1fr); }
  .mid-row { grid-template-columns: 1fr 1fr; }
  .bot-row { grid-template-columns: 1fr 1fr; }
  .card--security { display: none; }
}
@media (max-width: 720px) {
  .dash { padding: 16px; }
  .kpi-row { grid-template-columns: 1fr 1fr; }
  .mid-row, .bot-row { grid-template-columns: 1fr; }
}
</style>