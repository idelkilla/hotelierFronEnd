<!-- components/DetalleActividadModal.vue -->
<template>
  <Teleport to="body">
    <Transition name="modal-fade">
      <div v-if="visible" class="modal-overlay" @click.self="cerrar">
        <div class="modal-container" role="dialog">

          <!-- Botón cerrar -->
          <button class="btn-close" @click="cerrar">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>

          <!-- Imagen hero -->
          <div class="modal-hero">
            <img :src="actividad.imagen" :alt="actividad.titulo" />
            <div class="hero-gradient" />
            <div class="hero-badges">
              <span class="badge-tipo">{{ actividad.tipo }}</span>
              <span v-if="actividad.oferta" class="badge-oferta">🏷 Oferta</span>
            </div>
            <div class="hero-rating">
              <span class="rating-num">{{ actividad.rating }}</span>
              <div class="rating-info">
                <strong>{{ actividad.label }}</strong>
                <span>{{ actividad.opiniones }} opiniones</span>
              </div>
            </div>
          </div>

          <!-- Contenido -->
          <div class="modal-body">

            <!-- Columna izquierda: info -->
            <div class="col-info">
              <h2 class="act-titulo">{{ actividad.titulo }}</h2>

              <div class="meta-chips">
                <span class="chip">
                  <svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                  {{ actividad.duracion }}
                </span>
                <span class="chip">
                  <svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                  {{ actividad.ubicacion }}
                </span>
                <span v-if="actividad.cancelacion" class="chip chip-green">
                  <svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>
                  Cancelación gratuita
                </span>
                <span v-if="actividad.familias" class="chip chip-blue">
                  <svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                  Apto para familias
                </span>
              </div>

              <p class="descripcion">{{ actividad.descripcion }}</p>

              <!-- Lo que incluye -->
              <div class="seccion">
                <h4>¿Qué incluye?</h4>
                <ul class="incluye-list">
                  <li v-for="item in actividad.incluye" :key="item">
                    <svg width="14" height="14" fill="none" stroke="#1a7a50" stroke-width="2.5" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>
                    {{ item }}
                  </li>
                </ul>
              </div>

              <!-- No incluye -->
              <div class="seccion">
                <h4>No incluye</h4>
                <ul class="incluye-list no-incluye">
                  <li v-for="item in actividad.noIncluye" :key="item">
                    <svg width="14" height="14" fill="none" stroke="#e05252" stroke-width="2.5" viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                    {{ item }}
                  </li>
                </ul>
              </div>

              <!-- Punto de encuentro -->
              <div class="seccion">
                <h4>Punto de encuentro</h4>
                <p class="punto-encuentro">
                  <svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                  {{ actividad.puntoEncuentro }}
                </p>
              </div>
            </div>

            <!-- Columna derecha: reservar -->
            <div class="col-reserva">
              <div class="reserva-card">
                <div class="precio-header">
                  <span class="desde">desde</span>
                  <span class="precio">${{ actividad.precio }}</span>
                  <span class="por">por adulto</span>
                </div>

                <!-- Fecha -->
                <div class="campo">
                  <label>Fecha</label>
                  <input type="date" v-model="reserva.fecha" :min="hoy" />
                </div>

                <!-- Tickets -->
                <div class="campo">
                  <label>Tickets</label>
                  <div class="ticket-opciones">
                    <div v-for="ticket in tiposTicket" :key="ticket.tipo" class="ticket-row">
                      <div class="ticket-info">
                        <span class="ticket-tipo">{{ ticket.tipo }}</span>
                        <span class="ticket-precio">${{ ticket.precio }}</span>
                        <span class="ticket-edad">{{ ticket.edad }}</span>
                      </div>
                      <div class="counter">
                        <button @click="cambiarCantidad(ticket, -1)" :disabled="ticket.cantidad === 0">−</button>
                        <span>{{ ticket.cantidad }}</span>
                        <button @click="cambiarCantidad(ticket, 1)">+</button>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Horario -->
                <div class="campo">
                  <label>Horario de inicio</label>
                  <div class="horarios">
                    <button
                      v-for="h in actividad.horarios"
                      :key="h"
                      class="horario-btn"
                      :class="{ activo: reserva.horario === h }"
                      @click="reserva.horario = h"
                    >{{ h }}</button>
                  </div>
                </div>

                <!-- Resumen -->
                <div v-if="totalPersonas > 0" class="resumen">
                  <div class="resumen-row" v-for="ticket in tiposTicketConCantidad" :key="ticket.tipo">
                    <span>{{ ticket.tipo }} × {{ ticket.cantidad }}</span>
                    <span>${{ ticket.precio * ticket.cantidad }}</span>
                  </div>
                  <div class="resumen-total">
                    <span>Total</span>
                    <span>${{ totalPrecio }}</span>
                  </div>
                </div>

                <button
                  class="btn-reservar"
                  :disabled="!puedeReservar"
                  @click="reservar"
                >
                  {{ puedeReservar ? 'Reservar ahora' : 'Selecciona fecha y tickets' }}
                </button>

                <p class="aviso-cancel" v-if="actividad.cancelacion">
                  <svg width="13" height="13" fill="none" stroke="#1a7a50" stroke-width="2" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>
                  Cancelación gratuita disponible
                </p>

                <p class="aviso-secure">
                  <svg width="13" height="13" fill="none" stroke="#888" stroke-width="2" viewBox="0 0 24 24"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                  Pago seguro garantizado
                </p>
              </div>
            </div>

          </div>

          <!-- Confirmación -->
          <Transition name="confirm-fade">
            <div v-if="confirmado" class="confirm-overlay">
              <div class="confirm-box">
                <div class="confirm-icon">✓</div>
                <h3>¡Reserva confirmada!</h3>
                <p>Recibirás tu voucher por email. <br/>¡Disfruta tu experiencia!</p>
                <button @click="cerrarConfirm">Cerrar</button>
              </div>
            </div>
          </Transition>

        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { ref, computed, watch } from 'vue'

const props = defineProps({
  actividad: { type: Object, required: true },
  visible: { type: Boolean, default: false }
})
const emit = defineEmits(['cerrar'])

const hoy = new Date().toISOString().split('T')[0]

const reserva = ref({ fecha: '', horario: '' })
const confirmado = ref(false)

// Tipos de ticket con cantidad reactiva
const tiposTicket = ref([
  { tipo: 'Adulto', precio: props.actividad.precio, edad: '18+ años', cantidad: 0 },
  { tipo: 'Niño', precio: Math.round(props.actividad.precio * 0.6), edad: '3–17 años', cantidad: 0 },
  { tipo: 'Bebé', precio: 0, edad: '0–2 años', cantidad: 0 },
])

// Reset al abrir con nueva actividad
watch(() => props.actividad, () => {
  tiposTicket.value = [
    { tipo: 'Adulto', precio: props.actividad.precio, edad: '18+ años', cantidad: 0 },
    { tipo: 'Niño', precio: Math.round(props.actividad.precio * 0.6), edad: '3–17 años', cantidad: 0 },
    { tipo: 'Bebé', precio: 0, edad: '0–2 años', cantidad: 0 },
  ]
  reserva.value = { fecha: '', horario: '' }
})

const cambiarCantidad = (ticket, delta) => {
  ticket.cantidad = Math.max(0, ticket.cantidad + delta)
}

const tiposTicketConCantidad = computed(() => tiposTicket.value.filter(t => t.cantidad > 0))
const totalPersonas = computed(() => tiposTicket.value.reduce((s, t) => s + t.cantidad, 0))
const totalPrecio = computed(() => tiposTicket.value.reduce((s, t) => s + t.precio * t.cantidad, 0))
const puedeReservar = computed(() => reserva.value.fecha && reserva.value.horario && totalPersonas.value > 0)

const reservar = () => { if (puedeReservar.value) confirmado.value = true }
const cerrarConfirm = () => { confirmado.value = false; cerrar() }
const cerrar = () => emit('cerrar')
</script>

<style scoped>
/* Overlay */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(10, 20, 40, 0.6);
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  backdrop-filter: blur(3px);
  padding-top: 100px ;
}

/* Contenedor */
.modal-container {
  position: relative;
  background: #fff;
  border-radius: 20px;
  width: 100%;
  max-width: 920px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 24px 80px rgba(0,0,0,0.22);
  display: flex;
  flex-direction: column;
}

/* Scroll personalizado */
.modal-container::-webkit-scrollbar { width: 6px; }
.modal-container::-webkit-scrollbar-track { background: #f1f5f9; }
.modal-container::-webkit-scrollbar-thumb { background: #c8d0dc; border-radius: 3px; }

/* Cerrar */
.btn-close {
  position: absolute;
  top: 14px; right: 14px;
  width: 38px; height: 38px;
  background: rgba(255,255,255,0.92);
  border: none; border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  cursor: pointer; z-index: 10;
  box-shadow: 0 2px 8px rgba(0,0,0,0.15);
  color: #333;
  transition: transform 0.18s;
}
.btn-close:hover { transform: scale(1.1); }

/* Hero */
.modal-hero {
  position: relative;
  height: 260px;
  border-radius: 20px 20px 0 0;
  overflow: hidden;
  flex-shrink: 0;
}
.modal-hero img {
  width: 100%; height: 100%;
  object-fit: cover;
}
.hero-gradient {
  position: absolute;
  inset: 0;
  background: linear-gradient(to bottom, transparent 30%, rgba(10,20,40,0.65));
}
.hero-badges {
  position: absolute;
  top: 16px; left: 16px;
  display: flex; gap: 8px;
}
.badge-tipo {
  background: rgba(255,255,255,0.92);
  color: #1a3a5c;
  font-size: 11px; font-weight: 700;
  padding: 4px 10px; border-radius: 20px;
  text-transform: uppercase; letter-spacing: .5px;
}
.badge-oferta {
  background: #fff3e0;
  color: #b85c00;
  font-size: 11px; font-weight: 700;
  padding: 4px 10px; border-radius: 20px;
}
.hero-rating {
  position: absolute;
  bottom: 14px; left: 16px;
  display: flex; align-items: center; gap: 10px;
}
.rating-num {
  background: #1a3a5c;
  color: white;
  font-size: 16px; font-weight: 800;
  padding: 6px 12px; border-radius: 8px;
}
.rating-info {
  display: flex; flex-direction: column;
  color: white;
}
.rating-info strong { font-size: 14px; }
.rating-info span { font-size: 12px; opacity: 0.85; }

/* Body */
.modal-body {
  display: grid;
  grid-template-columns: 1fr 300px;
  gap: 28px;
  padding: 24px;
}

/* Info */
.col-info { display: flex; flex-direction: column; gap: 16px; }

.act-titulo {
  font-size: 22px; font-weight: 800;
  color: #1a1a2e; line-height: 1.3; margin: 0;
}

.meta-chips { display: flex; flex-wrap: wrap; gap: 8px; }
.chip {
  display: flex; align-items: center; gap: 5px;
  background: #f1f5f9;
  font-size: 12px; color: #555;
  padding: 5px 12px; border-radius: 20px;
  font-weight: 500;
}
.chip-green { background: #e8f5ee; color: #1a7a50; }
.chip-blue  { background: #e8f0fb; color: #1a3a8c; }

.descripcion {
  font-size: 14px; color: #555;
  line-height: 1.7; margin: 0;
}

.seccion { display: flex; flex-direction: column; gap: 8px; }
.seccion h4 {
  font-size: 14px; font-weight: 700;
  color: #1a1a2e; margin: 0;
}
.incluye-list {
  list-style: none; margin: 0; padding: 0;
  display: flex; flex-direction: column; gap: 6px;
}
.incluye-list li {
  display: flex; align-items: center; gap: 7px;
  font-size: 13px; color: #444;
}
.punto-encuentro {
  display: flex; align-items: center; gap: 6px;
  font-size: 13px; color: #555; margin: 0;
}

/* Reserva card */
.col-reserva { display: flex; flex-direction: column; }

.reserva-card {
  border: 1.5px solid #e2e8f0;
  border-radius: 16px;
  padding: 20px;
  display: flex; flex-direction: column; gap: 16px;
  position: sticky;
  top: 100px;
  margin-top: 60px;
}

.precio-header {
  display: flex; align-items: baseline; gap: 6px;
}
.desde { font-size: 12px; color: #888; }
.precio { font-size: 32px; font-weight: 800; color: #1a1a2e; }
.por { font-size: 12px; color: #888; }

.campo { display: flex; flex-direction: column; gap: 6px; }
.campo label { font-size: 13px; font-weight: 700; color: #1a1a2e; }
.campo input[type="date"] {
  border: 1.5px solid #d0d8e4;
  border-radius: 10px;
  padding: 10px 12px;
  font-size: 14px; color: #333;
  outline: none; width: 100%;
  font-family: inherit;
}
.campo input[type="date"]:focus { border-color: #265073; }

/* Tickets */
.ticket-opciones { display: flex; flex-direction: column; gap: 10px; }
.ticket-row {
  display: flex; justify-content: space-between; align-items: center;
  padding: 10px 12px;
  border: 1.5px solid #e2e8f0; border-radius: 10px;
  background: #fafbfd;
}
.ticket-info { display: flex; flex-direction: column; gap: 2px; }
.ticket-tipo { font-size: 13px; font-weight: 700; color: #1a1a2e; }
.ticket-precio { font-size: 13px; color: #265073; font-weight: 600; }
.ticket-edad { font-size: 11px; color: #999; }

.counter {
  display: flex; align-items: center; gap: 8px;
}
.counter button {
  width: 28px; height: 28px;
  border: 1.5px solid #d0d8e4; border-radius: 50%;
  background: #fff; font-size: 16px; font-weight: 600;
  cursor: pointer; display: flex; align-items: center; justify-content: center;
  color: #265073;
  transition: all 0.15s;
}
.counter button:hover:not(:disabled) { background: #265073; color: white; border-color: #265073; }
.counter button:disabled { opacity: 0.35; cursor: default; }
.counter span { font-size: 15px; font-weight: 700; color: #1a1a2e; min-width: 18px; text-align: center; }

/* Horarios */
.horarios { display: flex; flex-wrap: wrap; gap: 7px; }
.horario-btn {
  padding: 7px 14px;
  border: 1.5px solid #d0d8e4;
  border-radius: 20px; background: #fff;
  font-size: 13px; color: #555; cursor: pointer;
  transition: all 0.15s;
}
.horario-btn:hover { border-color: #265073; color: #265073; }
.horario-btn.activo { background: #265073; color: white; border-color: #265073; }

/* Resumen */
.resumen {
  background: #f1f5f9;
  border-radius: 10px; padding: 12px;
  display: flex; flex-direction: column; gap: 6px;
}
.resumen-row {
  display: flex; justify-content: space-between;
  font-size: 13px; color: #555;
}
.resumen-total {
  display: flex; justify-content: space-between;
  font-size: 15px; font-weight: 800; color: #1a1a2e;
  border-top: 1.5px solid #dde3ec;
  margin-top: 4px; padding-top: 8px;
}

/* Botón reservar */
.btn-reservar {
  width: 100%; padding: 13px;
  background: #265073; color: white;
  border: none; border-radius: 25px;
  font-size: 15px; font-weight: 700; cursor: pointer;
  transition: background 0.2s, transform 0.15s;
}
.btn-reservar:hover:not(:disabled) { background: #1a3d5c; transform: translateY(-1px); }
.btn-reservar:disabled { background: #b0bac8; cursor: default; }

.aviso-cancel, .aviso-secure {
  display: flex; align-items: center; gap: 5px;
  font-size: 12px; color: #888; margin: 0;
  justify-content: center;
}
.aviso-cancel { color: #1a7a50; }

/* Confirmación */
.confirm-overlay {
  position: absolute;
  inset: 0;
  background: rgba(255,255,255,0.96);
  display: flex; align-items: center; justify-content: center;
  border-radius: 20px; z-index: 20;
}
.confirm-box {
  text-align: center;
  display: flex; flex-direction: column; align-items: center; gap: 14px;
}
.confirm-icon {
  width: 70px; height: 70px;
  background: #1a7a50; color: white;
  border-radius: 50%; font-size: 32px;
  display: flex; align-items: center; justify-content: center;
  animation: pop 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
}
@keyframes pop {
  from { transform: scale(0); opacity: 0; }
  to   { transform: scale(1); opacity: 1; }
}
.confirm-box h3 { font-size: 24px; font-weight: 800; color: #1a1a2e; margin: 0; }
.confirm-box p  { font-size: 14px; color: #666; margin: 0; line-height: 1.6; }
.confirm-box button {
  padding: 11px 32px;
  background: #265073; color: white;
  border: none; border-radius: 25px;
  font-size: 14px; font-weight: 700; cursor: pointer;
}

/* Transitions */
.modal-fade-enter-active  { transition: opacity 0.25s, transform 0.25s; }
.modal-fade-leave-active  { transition: opacity 0.2s, transform 0.2s; }
.modal-fade-enter-from    { opacity: 0; transform: scale(0.96) translateY(10px); }
.modal-fade-leave-to      { opacity: 0; transform: scale(0.96) translateY(10px); }

.confirm-fade-enter-active { transition: opacity 0.2s; }
.confirm-fade-leave-active { transition: opacity 0.2s; }
.confirm-fade-enter-from, .confirm-fade-leave-to { opacity: 0; }

@media (max-width: 700px) {
  .modal-body { grid-template-columns: 1fr; }
  .modal-hero { height: 200px; }
}
</style>