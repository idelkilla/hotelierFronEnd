<!-- view/DetalleActividad.vue -->
<template>
  <div class="detalle-wrapper">
    <HeaderComponent />

    <div v-if="actividad" class="detalle-content">

      <!-- Hero -->
      <div class="hero">
        <img :src="actividad.imagen" :alt="actividad.titulo" class="hero-img" />
        <div class="hero-overlay" />
        <div class="hero-inner">
          <button class="btn-back" @click="$router.back()">
            <svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
              <polyline points="15 18 9 12 15 6"/>
            </svg>
            Volver
          </button>
          <div class="hero-meta">
            <span class="badge-tipo">{{ actividad.tipo }}</span>
            <span v-if="actividad.oferta" class="badge-oferta">🏷 Oferta</span>
          </div>
          <h1 class="hero-titulo">{{ actividad.titulo }}</h1>
          <div class="hero-chips">
            <span class="hchip">
              <svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
              {{ actividad.duracion }}
            </span>
            <span class="hchip">
              <svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
              {{ actividad.ubicacion }}
            </span>
            <span class="hchip hchip-rating">
              ★ {{ actividad.rating }} · {{ actividad.label }} · {{ actividad.opiniones }} opiniones
            </span>
          </div>
        </div>
        <FooterComponent />
      </div>

      <!-- Galería de miniaturas -->
      <div class="galeria">
        <img
          v-for="(img, i) in actividad.galeria"
          :key="i"
          :src="img"
          :alt="`Foto ${i+1}`"
          class="galeria-img"
          :class="{ activa: galeriaActiva === i }"
          @click="galeriaActiva = i"
        />
      </div>

      <!-- Layout principal -->
      <div class="main-layout">

        <!-- Columna izquierda: info -->
        <div class="col-info">

          <!-- Descripción -->
          <section class="seccion">
            <h2>Sobre esta actividad</h2>
            <p>{{ actividad.descripcion }}</p>
          </section>

          <!-- Beneficios rápidos -->
          <div class="beneficios-grid">
            <div v-if="actividad.cancelacion" class="bene-item">
              <div class="bene-icon green">
                <svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>
              </div>
              <div>
                <strong>Cancelación gratuita</strong>
                <span>Cancela sin costo hasta 24h antes</span>
              </div>
            </div>
            <div v-if="actividad.familias" class="bene-item">
              <div class="bene-icon blue">
                <svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
              </div>
              <div>
                <strong>Apto para familias</strong>
                <span>Niños bienvenidos</span>
              </div>
            </div>
            <div class="bene-item">
              <div class="bene-icon gold">
                <svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
              </div>
              <div>
                <strong>{{ actividad.duracion }}</strong>
                <span>Duración estimada</span>
              </div>
            </div>
            <div class="bene-item">
              <div class="bene-icon navy">
                <svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/></svg>
              </div>
              <div>
                <strong>Guía bilingüe</strong>
                <span>Español e inglés</span>
              </div>
            </div>
          </div>

          <!-- Incluye / No incluye -->
          <section class="seccion dos-col">
            <div>
              <h2>¿Qué incluye?</h2>
              <ul class="check-list">
                <li v-for="item in actividad.incluye" :key="item">
                  <span class="check green">✓</span> {{ item }}
                </li>
              </ul>
            </div>
            <div>
              <h2>No incluye</h2>
              <ul class="check-list">
                <li v-for="item in actividad.noIncluye" :key="item">
                  <span class="check red">✕</span> {{ item }}
                </li>
              </ul>
            </div>
          </section>

          <!-- Punto de encuentro -->
          <section class="seccion">
            <h2>Punto de encuentro</h2>
            <div class="encuentro-box">
              <svg width="18" height="18" fill="none" stroke="#265073" stroke-width="2" viewBox="0 0 24 24"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
              <span>{{ actividad.puntoEncuentro }}</span>
            </div>
          </section>

          <!-- Horarios disponibles -->
          <section class="seccion">
            <h2>Horarios disponibles</h2>
            <div class="horarios-list">
              <span v-for="h in actividad.horarios" :key="h" class="horario-tag">🕐 {{ h }}</span>
            </div>
          </section>

        </div>

        <!-- Columna derecha: reserva -->
        <div class="col-reserva">
          <div class="reserva-card">

            <div class="precio-header">
              <span class="desde">desde</span>
              <span class="precio">${{ actividad.precio }}</span>
              <span class="por">por adulto</span>
            </div>

            <!-- Fecha -->
            <div class="campo">
              <label>📅 Fecha</label>
              <input type="date" v-model="reserva.fecha" :min="hoy" />
            </div>

            <!-- Tickets -->
            <div class="campo">
              <label>🎟 Tickets</label>
              <div class="ticket-opciones">
                <div v-for="ticket in tiposTicket" :key="ticket.tipo" class="ticket-row">
                  <div class="ticket-info">
                    <span class="ticket-tipo">{{ ticket.tipo }}</span>
                    <span class="ticket-precio">${{ ticket.precio }}<small>/persona</small></span>
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
              <label>🕐 Horario de inicio</label>
              <div class="horarios-sel">
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
            <Transition name="slide-up">
              <div v-if="totalPersonas > 0" class="resumen">
                <div class="resumen-row" v-for="t in tiposConCantidad" :key="t.tipo">
                  <span>{{ t.tipo }} × {{ t.cantidad }}</span>
                  <span>${{ t.precio * t.cantidad }}</span>
                </div>
                <div class="resumen-total">
                  <span>Total estimado</span>
                  <span>${{ totalPrecio }}</span>
                </div>
              </div>
            </Transition>

            <button
              class="btn-reservar"
              :disabled="!puedeReservar"
              @click="reservar"
            >
              {{ puedeReservar ? '🎫 Reservar ahora' : 'Selecciona fecha y tickets' }}
            </button>

            <div class="garantias">
              <span v-if="actividad.cancelacion">✓ Cancelación gratuita</span>
              <span>🔒 Pago seguro</span>
              <span>✉ Voucher por email</span>
            </div>

          </div>
        </div>
      </div>

    </div>

    <!-- Confirmación -->
    <Transition name="confirm-fade">
      <div v-if="confirmado" class="confirm-overlay">
        <div class="confirm-box">
          <div class="confirm-icon">✓</div>
          <h3>¡Reserva confirmada!</h3>
          <p>Recibirás tu voucher por correo electrónico.<br/>¡Que disfrutes la experiencia!</p>
          <button @click="$router.push('/Actividades')">Ver más actividades</button>
        </div>
      </div>
    </Transition>

  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import HeaderComponent from '../components/Header.vue'
import FooterComponent from '../components/footer.vue'

const route = useRoute()
const hoy = new Date().toISOString().split('T')[0]
const confirmado = ref(false)
const galeriaActiva = ref(0)
const reserva = ref({ fecha: '', horario: '' })

// Base de datos local de actividades (misma que en ActividadesResultados)
const todasLasActividades = [
  {
    id: 1,
    titulo: 'AMBER COVE - Cataratas de Damajagua y Almuerzo Tour',
    tipo: 'Excursión', duracion: '5 h', ubicacion: 'Puerto Plata',
    rating: 9.2, label: 'Magnífica', opiniones: 135, precio: 60,
    cancelacion: true, familias: true, oferta: false,
    imagen: 'https://images.unsplash.com/photo-1504701954957-2010ec3bcec1?w=1200&q=80',
    galeria: [
      'https://images.unsplash.com/photo-1504701954957-2010ec3bcec1?w=400&q=80',
      'https://images.unsplash.com/photo-1501854140801-50d01698950b?w=400&q=80',
      'https://images.unsplash.com/photo-1511497584788-876760111969?w=400&q=80',
      'https://images.unsplash.com/photo-1518173946687-a4c8892bbd9f?w=400&q=80',
    ],
    descripcion: 'Sumérgete en la naturaleza dominicana con una visita guiada a las espectaculares Cataratas de Damajagua. Escala las rocas, salta desde las cascadas y disfruta de un almuerzo típico dominicano incluido en el recorrido. Una experiencia que combina aventura, naturaleza y gastronomía local.',
    horarios: ['8:00 a.m.', '9:00 a.m.', '10:00 a.m.'],
    puntoEncuentro: 'Lobby del Amber Cove Cruise Center, Puerto Plata',
    incluye: ['Transporte de ida y vuelta', 'Guía bilingüe', 'Almuerzo típico dominicano', 'Equipo de seguridad', 'Entrada a las cataratas'],
    noIncluye: ['Bebidas alcohólicas', 'Propinas', 'Seguro de viaje'],
  },
  {
    id: 2,
    titulo: 'Sosua Party Boat - Snorkeling + Snack + BBQ',
    tipo: 'Acuático', duracion: '4 h', ubicacion: 'Sosúa',
    rating: 9.0, label: 'Magnífica', opiniones: 11, precio: 69,
    cancelacion: true, familias: false, oferta: false,
    imagen: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=1200&q=80',
    galeria: [
      'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400&q=80',
      'https://images.unsplash.com/photo-1502680390469-be75c86b636f?w=400&q=80',
      'https://images.unsplash.com/photo-1505118380757-91f5f5632de0?w=400&q=80',
    ],
    descripcion: 'Zarpa desde Sosúa a bordo de un catamarán con música en vivo, bebidas ilimitadas y el mejor snorkeling del norte dominicano. Una fiesta en el mar que no olvidarás, con BBQ en la playa incluido.',
    horarios: ['9:00 a.m.', '1:00 p.m.'],
    puntoEncuentro: 'Muelle de Sosúa, frente al Kiosko Marino',
    incluye: ['Bebidas ilimitadas', 'Snack a bordo', 'BBQ en la playa', 'Equipo de snorkeling', 'DJ y música en vivo'],
    noIncluye: ['Traslado al muelle', 'Propinas', 'Fotos profesionales'],
  },
  {
    id: 3,
    titulo: 'Tour por la ciudad de Puerto Plata y teleférico',
    tipo: 'Ciudad', duracion: '4 h 40 min', ubicacion: 'Puerto Plata',
    rating: 9.2, label: 'Magnífica', opiniones: 69, precio: 60,
    cancelacion: true, familias: true, oferta: false,
    imagen: 'https://images.unsplash.com/photo-1596422846543-75c6fc197f07?w=1200&q=80',
    galeria: [
      'https://images.unsplash.com/photo-1596422846543-75c6fc197f07?w=400&q=80',
      'https://images.unsplash.com/photo-1569288052389-dac9b01c9c05?w=400&q=80',
      'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&q=80',
    ],
    descripcion: 'Descubre la historia y cultura del norte dominicano. Visita el Fuerte San Felipe, sube en el único teleférico del Caribe hasta el Pico Isabel de Torres y disfruta vistas panorámicas espectaculares a 800 metros de altura.',
    horarios: ['8:30 a.m.', '10:00 a.m.', '2:00 p.m.'],
    puntoEncuentro: 'Parque Central de Puerto Plata, frente a la Catedral',
    incluye: ['Guía turístico bilingüe', 'Transporte en bus con A/C', 'Boleto del teleférico', 'Tiempo libre en mercado artesanal'],
    noIncluye: ['Entradas a museos adicionales', 'Almuerzo', 'Propinas'],
  },
  {
    id: 4,
    titulo: 'Aventura en ATV por los campos dominicanos',
    tipo: 'Aventura', duracion: '3 h', ubicacion: 'Santiago',
    rating: 8.7, label: 'Muy buena', opiniones: 42, precio: 45,
    cancelacion: false, familias: false, oferta: true,
    imagen: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=1200&q=80',
    galeria: [
      'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=400&q=80',
      'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=400&q=80',
      'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=400&q=80',
    ],
    descripcion: 'Vive la adrenalina recorriendo los campos y montañas del Cibao en cuatrimoto. Pasa por ríos, fincas de cacao y vistas impresionantes del Valle del Cibao. Ideal para quienes buscan aventura y naturaleza.',
    horarios: ['7:00 a.m.', '10:00 a.m.', '3:00 p.m.'],
    puntoEncuentro: 'Base ATV Cibao Adventures, Km 14 Autopista Duarte, Santiago',
    incluye: ['Cuatrimoto individual o doble', 'Casco y equipo de protección', 'Guía experto', 'Snack y agua'],
    noIncluye: ['Seguro adicional', 'Transporte al punto de partida', 'Propinas'],
  },
  {
    id: 5,
    titulo: 'Catamarán al atardecer con cena y música en vivo',
    tipo: 'Acuático', duracion: '2 h 30 min', ubicacion: 'Samaná',
    rating: 9.5, label: 'Magnífica', opiniones: 88, precio: 85,
    cancelacion: true, familias: false, oferta: false,
    imagen: 'https://images.unsplash.com/photo-1502680390469-be75c86b636f?w=1200&q=80',
    galeria: [
      'https://images.unsplash.com/photo-1502680390469-be75c86b636f?w=400&q=80',
      'https://images.unsplash.com/photo-1505118380757-91f5f5632de0?w=400&q=80',
      'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400&q=80',
    ],
    descripcion: 'Una experiencia romántica e inolvidable navegando la Bahía de Samaná al atardecer. Incluye cena de mariscos, música en vivo y brindis con champán mientras el sol se oculta en el horizonte.',
    horarios: ['5:00 p.m.', '6:00 p.m.'],
    puntoEncuentro: 'Marina Santa Bárbara, Samaná',
    incluye: ['Cena de mariscos y pescado fresco', 'Copa de champán', 'Música en vivo', 'Bebidas no alcohólicas ilimitadas'],
    noIncluye: ['Bebidas alcohólicas adicionales', 'Transporte a la marina', 'Propinas'],
  },
  {
    id: 6,
    titulo: 'Excursión a la Cascada El Limón desde Samaná',
    tipo: 'Naturaleza', duracion: '6 h', ubicacion: 'Samaná',
    rating: 8.9, label: 'Muy buena', opiniones: 31, precio: 55,
    cancelacion: true, familias: true, oferta: true,
    imagen: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1200&q=80',
    galeria: [
      'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&q=80',
      'https://images.unsplash.com/photo-1504701954957-2010ec3bcec1?w=400&q=80',
      'https://images.unsplash.com/photo-1518173946687-a4c8892bbd9f?w=400&q=80',
    ],
    descripcion: 'Emprende una aventura a caballo o a pie hasta la majestuosa Cascada El Limón, una de las más altas del Caribe con 52 metros de altura. Nada en su poza natural y siente la energía de la selva tropical dominicana.',
    horarios: ['8:00 a.m.', '9:00 a.m.'],
    puntoEncuentro: 'Plaza Turística de El Limón, Las Terrenas, Samaná',
    incluye: ['Caballo y guía local', 'Almuerzo típico', 'Agua y frutas frescas', 'Acceso a la cascada'],
    noIncluye: ['Propinas al guía', 'Fotos profesionales', 'Seguro de viaje'],
  },
]

const actividad = computed(() =>
  todasLasActividades.find(a => a.id === Number(route.params.id))
)

const tiposTicket = ref([
  { tipo: 'Adulto',  precio: 0, edad: '18+ años',  cantidad: 0 },
  { tipo: 'Niño',    precio: 0, edad: '3–17 años',  cantidad: 0 },
  { tipo: 'Bebé',    precio: 0, edad: '0–2 años',   cantidad: 0 },
])

// Sincronizar precios cuando carga la actividad
computed(() => {
  if (actividad.value) {
    tiposTicket.value[0].precio = actividad.value.precio
    tiposTicket.value[1].precio = Math.round(actividad.value.precio * 0.6)
    tiposTicket.value[2].precio = 0
  }
})

// Inicializar precios al montar
if (actividad.value) {
  tiposTicket.value[0].precio = actividad.value.precio
  tiposTicket.value[1].precio = Math.round(actividad.value.precio * 0.6)
  tiposTicket.value[2].precio = 0
}

const cambiarCantidad = (ticket, delta) => {
  ticket.cantidad = Math.max(0, ticket.cantidad + delta)
}

const tiposConCantidad  = computed(() => tiposTicket.value.filter(t => t.cantidad > 0))
const totalPersonas     = computed(() => tiposTicket.value.reduce((s, t) => s + t.cantidad, 0))
const totalPrecio       = computed(() => tiposTicket.value.reduce((s, t) => s + t.precio * t.cantidad, 0))
const puedeReservar     = computed(() => reserva.value.fecha && reserva.value.horario && totalPersonas.value > 0)

const reservar = () => { if (puedeReservar.value) confirmado.value = true }
</script>

<style scoped>
.detalle-wrapper {
  background: #f7f9fc;
  min-height: 100vh;
}

/* Hero */
.hero {
  position: relative;
  height: 420px;
  overflow: hidden;
}
.hero-img {
  width: 100%; height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease;
}
.hero:hover .hero-img { transform: scale(1.03); }
.hero-overlay {
  position: absolute; inset: 0;
  background: linear-gradient(to bottom, rgba(0,0,0,0.15) 0%, rgba(10,22,44,0.72) 100%);
}
.hero-inner {
  position: absolute; inset: 0;
  display: flex; flex-direction: column;
  justify-content: flex-end;
  padding: 40px;
  max-width: 1300px; margin: 0 auto;
  left: 0; right: 0;
}
.btn-back {
  position: absolute; top: 90px; left: 40px;
  display: flex; align-items: center; gap: 6px;
  background: rgba(255,255,255,0.15);
  backdrop-filter: blur(6px);
  border: 1px solid rgba(255,255,255,0.3);
  color: white; font-size: 14px; font-weight: 600;
  padding: 8px 16px; border-radius: 20px;
  cursor: pointer; transition: background 0.2s;
}
.btn-back:hover { background: rgba(255,255,255,0.28); }
.hero-meta { display: flex; gap: 8px; margin-bottom: 10px; }
.badge-tipo {
  background: rgba(255,255,255,0.9); color: #1a3a5c;
  font-size: 11px; font-weight: 800;
  padding: 4px 12px; border-radius: 20px;
  text-transform: uppercase; letter-spacing: .6px;
}
.badge-oferta {
  background: #fff3e0; color: #b85c00;
  font-size: 11px; font-weight: 700;
  padding: 4px 12px; border-radius: 20px;
}
.hero-titulo {
  font-size: 32px; font-weight: 900;
  color: white; line-height: 1.2;
  margin: 0 0 14px; max-width: 720px;
  text-shadow: 0 2px 12px rgba(0,0,0,0.3);
}
.hero-chips { display: flex; flex-wrap: wrap; gap: 8px; }
.hchip {
  display: flex; align-items: center; gap: 5px;
  background: rgba(255,255,255,0.15);
  backdrop-filter: blur(4px);
  border: 1px solid rgba(255,255,255,0.25);
  color: white; font-size: 13px; font-weight: 500;
  padding: 5px 12px; border-radius: 20px;
}
.hchip-rating { background: rgba(26,58,92,0.7); }

/* Galería */
.galeria {
  display: flex; gap: 10px;
  padding: 16px 40px;
  background: #fff;
  border-bottom: 1px solid #e2e8f0;
  overflow-x: auto;
}
.galeria-img {
  width: 90px; height: 60px;
  object-fit: cover; border-radius: 8px;
  cursor: pointer; opacity: 0.65;
  border: 2.5px solid transparent;
  transition: all 0.2s; flex-shrink: 0;
}
.galeria-img:hover, .galeria-img.activa {
  opacity: 1; border-color: #265073;
}

/* Layout */
.detalle-content { max-width: 1300px; margin: 0 auto; }
.main-layout {
  display: grid;
  grid-template-columns: 1fr 340px;
  gap: 32px;
  padding: 32px 40px 60px;
  align-items: start;
}

/* Info */
.col-info { display: flex; flex-direction: column; gap: 28px; }

.seccion { display: flex; flex-direction: column; gap: 14px; }
.seccion h2 {
  font-size: 20px; font-weight: 800;
  color: #1a1a2e; margin: 0;
  padding-bottom: 10px;
  border-bottom: 2px solid #e2e8f0;
}
.seccion p { font-size: 15px; color: #555; line-height: 1.8; margin: 0; }

.seccion.dos-col {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
}
.seccion.dos-col h2 { grid-column: unset; }

.check-list { list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 8px; }
.check-list li { display: flex; align-items: center; gap: 8px; font-size: 14px; color: #444; }
.check { font-size: 13px; font-weight: 800; width: 20px; height: 20px; border-radius: 50%; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.check.green { background: #e8f5ee; color: #1a7a50; }
.check.red   { background: #fdeaea; color: #c0392b; }

/* Beneficios */
.beneficios-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}
.bene-item {
  display: flex; align-items: center; gap: 12px;
  background: #fff; border: 1.5px solid #e2e8f0;
  border-radius: 12px; padding: 14px;
}
.bene-icon {
  width: 40px; height: 40px; border-radius: 10px;
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0;
}
.bene-icon.green { background: #e8f5ee; color: #1a7a50; }
.bene-icon.blue  { background: #e8f0fb; color: #1a3a8c; }
.bene-icon.gold  { background: #fef9e7; color: #b7860a; }
.bene-icon.navy  { background: #eaf0f7; color: #265073; }
.bene-item > div:last-child { display: flex; flex-direction: column; gap: 2px; }
.bene-item strong { font-size: 13px; color: #1a1a2e; }
.bene-item span   { font-size: 12px; color: #888; }

/* Encuentro */
.encuentro-box {
  display: flex; align-items: center; gap: 10px;
  background: #eaf0f7; border-radius: 10px;
  padding: 14px 16px;
  font-size: 14px; color: #265073; font-weight: 500;
}

/* Horarios info */
.horarios-list { display: flex; flex-wrap: wrap; gap: 8px; }
.horario-tag {
  background: #f1f5f9;
  font-size: 13px; color: #444;
  padding: 6px 14px; border-radius: 20px;
  font-weight: 500;
}

/* Reserva */
.col-reserva { 
  position: sticky; 
  top: 180px; 
  margin-top: 60px;
}

.reserva-card {
  background: #fff;
  border: 1.5px solid #e2e8f0;
  border-radius: 20px;
  padding: 24px;
  display: flex; flex-direction: column; gap: 18px;
  box-shadow: 0 8px 32px rgba(0,0,0,0.07);
}

.precio-header { display: flex; align-items: baseline; gap: 6px; }
.desde { font-size: 12px; color: #888; }
.precio { font-size: 36px; font-weight: 900; color: #1a1a2e; }
.por   { font-size: 12px; color: #888; }

.campo { display: flex; flex-direction: column; gap: 8px; }
.campo label { font-size: 13px; font-weight: 700; color: #1a1a2e; }
.campo input[type="date"] {
  border: 1.5px solid #d0d8e4; border-radius: 10px;
  padding: 10px 12px; font-size: 14px; color: #333;
  outline: none; width: 100%; font-family: inherit;
}
.campo input[type="date"]:focus { border-color: #265073; }

.ticket-opciones { display: flex; flex-direction: column; gap: 10px; }
.ticket-row {
  display: flex; justify-content: space-between; align-items: center;
  padding: 10px 12px;
  border: 1.5px solid #e2e8f0; border-radius: 10px;
  background: #fafbfd;
}
.ticket-info { display: flex; flex-direction: column; gap: 1px; }
.ticket-tipo  { font-size: 13px; font-weight: 700; color: #1a1a2e; }
.ticket-precio { font-size: 13px; color: #265073; font-weight: 600; }
.ticket-precio small { font-size: 10px; color: #aaa; font-weight: 400; }
.ticket-edad  { font-size: 11px; color: #999; }

.counter { display: flex; align-items: center; gap: 8px; }
.counter button {
  width: 30px; height: 30px;
  border: 1.5px solid #d0d8e4; border-radius: 50%;
  background: #fff; font-size: 16px; font-weight: 600;
  cursor: pointer; display: flex; align-items: center; justify-content: center;
  color: #265073; transition: all 0.15s;
}
.counter button:hover:not(:disabled) { background: #265073; color: white; border-color: #265073; }
.counter button:disabled { opacity: 0.3; cursor: default; }
.counter span { font-size: 15px; font-weight: 700; color: #1a1a2e; min-width: 20px; text-align: center; }

.horarios-sel { display: flex; flex-wrap: wrap; gap: 7px; }
.horario-btn {
  padding: 7px 14px; border: 1.5px solid #d0d8e4;
  border-radius: 20px; background: #fff;
  font-size: 13px; color: #555; cursor: pointer;
  transition: all 0.15s;
}
.horario-btn:hover  { border-color: #265073; color: #265073; }
.horario-btn.activo { background: #265073; color: white; border-color: #265073; }

.resumen {
  background: #f1f5f9; border-radius: 12px; padding: 14px;
  display: flex; flex-direction: column; gap: 6px;
}
.resumen-row {
  display: flex; justify-content: space-between;
  font-size: 13px; color: #555;
}
.resumen-total {
  display: flex; justify-content: space-between;
  font-size: 16px; font-weight: 800; color: #1a1a2e;
  border-top: 1.5px solid #dde3ec;
  margin-top: 4px; padding-top: 10px;
}

.btn-reservar {
  width: 100%; padding: 14px;
  background: #265073; color: white;
  border: none; border-radius: 25px;
  font-size: 15px; font-weight: 700; cursor: pointer;
  transition: background 0.2s, transform 0.15s;
}
.btn-reservar:hover:not(:disabled) { background: #1a3d5c; transform: translateY(-1px); }
.btn-reservar:disabled { background: #b0bac8; cursor: default; transform: none; }

.garantias {
  display: flex; flex-direction: column; gap: 5px;
  align-items: center;
}
.garantias span { font-size: 12px; color: #888; }

/* Confirmación */
.confirm-overlay {
  position: fixed; inset: 0;
  background: rgba(10,20,40,0.65);
  display: flex; align-items: center; justify-content: center;
  z-index: 999; backdrop-filter: blur(4px);
}
.confirm-box {
  background: white; border-radius: 24px;
  padding: 48px 40px; text-align: center;
  display: flex; flex-direction: column; align-items: center; gap: 16px;
  max-width: 400px; width: 90%;
  box-shadow: 0 24px 80px rgba(0,0,0,0.2);
}
.confirm-icon {
  width: 80px; height: 80px;
  background: #1a7a50; color: white;
  border-radius: 50%; font-size: 36px;
  display: flex; align-items: center; justify-content: center;
  animation: pop 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
}
@keyframes pop {
  from { transform: scale(0); opacity: 0; }
  to   { transform: scale(1); opacity: 1; }
}
.confirm-box h3 { font-size: 26px; font-weight: 900; color: #1a1a2e; margin: 0; }
.confirm-box p  { font-size: 15px; color: #666; margin: 0; line-height: 1.7; }
.confirm-box button {
  padding: 12px 36px;
  background: #265073; color: white;
  border: none; border-radius: 25px;
  font-size: 15px; font-weight: 700; cursor: pointer;
  transition: background 0.2s;
}
.confirm-box button:hover { background: #1a3d5c; }

/* Transitions */
.slide-up-enter-active { transition: all 0.3s ease; }
.slide-up-leave-active { transition: all 0.2s ease; }
.slide-up-enter-from   { opacity: 0; transform: translateY(8px); }
.slide-up-leave-to     { opacity: 0; transform: translateY(8px); }

.confirm-fade-enter-active { transition: opacity 0.25s; }
.confirm-fade-leave-active { transition: opacity 0.2s; }
.confirm-fade-enter-from, .confirm-fade-leave-to { opacity: 0; }

@media (max-width: 900px) {
  .main-layout { grid-template-columns: 1fr; padding: 20px; }
  .hero-titulo  { font-size: 22px; }
  .hero-inner   { padding: 20px; }
  .beneficios-grid { grid-template-columns: 1fr; }
  .seccion.dos-col { grid-template-columns: 1fr; }
  .galeria { padding: 12px 20px; }
  .col-reserva { position: static; }
}
</style>