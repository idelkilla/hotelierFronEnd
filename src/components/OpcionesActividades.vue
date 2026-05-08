<!-- components/ActividadesResultados.vue -->
<template>
  <div class="resultados-actividades">

    <!-- Cards -->
    <div v-for="a in actividadesOrdenadas" :key="a.id" class="act-card">

      <!-- Favorito -->
      <button class="btn-favorito" @click="toggleFav(a)" :class="{ activo: a.favorito }">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
        </svg>
      </button>

      <!-- Imagen -->
      <div class="card-img-wrapper">
        <img 
          :src="a.imagen" 
          :alt="a.titulo" 
          class="card-img" 
          loading="lazy" 
          decoding="async" />
        <span v-if="a.oferta" class="img-badge oferta">Oferta</span>
      </div>

      <!-- Info -->
      <div class="card-info">
        <div class="tipo">{{ a.tipo }}</div>
        <h3 class="titulo">{{ a.titulo }}</h3>

        <div class="meta-row">
          <span class="meta-item">
            <svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
            </svg>
            {{ a.duracion }}
          </span>
          <span class="meta-item">
            <svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
            </svg>
            {{ a.ubicacion }}
          </span>
        </div>

        <div class="rating-row">
          <div class="stars-mini">
            <span v-for="i in 5" :key="i" class="star-icon" :class="{ active: i <= Math.round(a.rating / 2) }">★</span>
          </div>
          <span class="rating-badge">{{ a.rating }}</span>
          <span class="rating-label">{{ a.label }}</span>
          <span class="rating-count">{{ a.opiniones }} opiniones</span>
          <span class="rating-count">({{ a.opiniones }} opiniones)</span>
        </div>

        <div class="beneficios">
          <span v-if="a.cancelacion" class="beneficio">
            <svg width="13" height="13" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
            Cancelación gratuita disponible
          </span>
          <span v-if="a.familias" class="beneficio">
            <svg width="13" height="13" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
            Apto para familias
          </span>
        </div>
      </div>

      <!-- Precio -->
      <div class="card-precio">
        <div class="precio-desde">desde</div>
        <div class="precio-amount">${{ a.precio }}</div>
        <div class="precio-sub">impuestos incluidos<br/>por adulto</div>
        <button class="btn-reservar" @click="abrirDetalle(a)">Ver actividad</button>
      </div>

    </div>

    <!-- Modal de detalle -->
    <DetalleActividad
      v-if="actividadSeleccionada"
      :actividad="actividadSeleccionada"
      :visible="modalVisible"
      @cerrar="cerrarModal"
    />

  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import DetalleActividad from '../components/DetalleActividad.vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const verDetalle = (id) => router.push({ name: 'DetalleActividad', params: { id } })
const orden = ref('default')
const modalVisible = ref(false)
const actividadSeleccionada = ref(null)

const actividades = ref([
  {
    id: 1,
    titulo: 'AMBER COVE - Cataratas de Damajagua y Almuerzo Tour',
    tipo: 'Excursión',
    duracion: '5 h',
    ubicacion: 'Puerto Plata',
    rating: 9.2, label: 'Magnífica', opiniones: 135,
    precio: 60,
    cancelacion: true, familias: true, oferta: false, favorito: false,
    imagen: 'https://images.unsplash.com/photo-1504701954957-2010ec3bcec1?w=800&q=80',
    descripcion: 'Sumérgete en la naturaleza dominicana con una visita guiada a las espectaculares Cataratas de Damajagua. Escala las rocas, salta desde las cascadas y disfruta de un almuerzo típico dominicano incluido en el recorrido.',
    horarios: ['8:00 a.m.', '9:00 a.m.', '10:00 a.m.'],
    puntoEncuentro: 'Lobby del Amber Cove Cruise Center, Puerto Plata',
    incluye: ['Transporte de ida y vuelta', 'Guía bilingüe (español/inglés)', 'Almuerzo típico dominicano', 'Equipo de seguridad', 'Entrada a las cataratas'],
    noIncluye: ['Bebidas alcohólicas', 'Propinas', 'Seguro de viaje'],
  },
  {
    id: 2,
    titulo: 'Sosua Party Boat - Snorkeling + Snack + BBQ Alimentos y Bebidas',
    tipo: 'Acuático',
    duracion: '4 h',
    ubicacion: 'Sosúa',
    rating: 9.0, label: 'Magnífica', opiniones: 11,
    precio: 69,
    cancelacion: true, familias: false, oferta: false, favorito: false,
    imagen: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&q=80',
    descripcion: 'Zarpa desde Sosúa a bordo de un catamarán con música en vivo, bebidas ilimitadas y el mejor snorkeling del norte dominicano. Una fiesta en el mar que no olvidarás.',
    horarios: ['9:00 a.m.', '1:00 p.m.'],
    puntoEncuentro: 'Muelle de Sosúa, frente al Kiosko Marino',
    incluye: ['Bebidas ilimitadas (ron, cerveza, refrescos)', 'Snack a bordo', 'BBQ en la playa', 'Equipo de snorkeling', 'DJ y música en vivo'],
    noIncluye: ['Traslado al muelle', 'Propinas', 'Fotos profesionales'],
  },
  {
    id: 3,
    titulo: 'Tour por la ciudad de Puerto Plata y teleférico',
    tipo: 'Ciudad',
    duracion: '4 h 40 min',
    ubicacion: 'Puerto Plata',
    rating: 9.2, label: 'Magnífica', opiniones: 69,
    precio: 60,
    cancelacion: true, familias: true, oferta: false, favorito: false,
    imagen: 'https://images.unsplash.com/photo-1596422846543-75c6fc197f07?w=800&q=80',
    descripcion: 'Descubre la historia y cultura del norte dominicano. Visita el Fuerte San Felipe, sube en el único teleférico del Caribe hasta el Pico Isabel de Torres y disfruta vistas panorámicas espectaculares.',
    horarios: ['8:30 a.m.', '10:00 a.m.', '2:00 p.m.'],
    puntoEncuentro: 'Parque Central de Puerto Plata, frente a la Catedral',
    incluye: ['Guía turístico bilingüe', 'Transporte en bus con A/C', 'Boleto del teleférico', 'Tiempo libre en el mercado artesanal'],
    noIncluye: ['Entradas a museos adicionales', 'Almuerzo', 'Propinas'],
  },
  {
    id: 4,
    titulo: 'Aventura en ATV por los campos dominicanos',
    tipo: 'Aventura',
    duracion: '3 h',
    ubicacion: 'Santiago',
    rating: 8.7, label: 'Muy buena', opiniones: 42,
    precio: 45,
    cancelacion: false, familias: false, oferta: true, favorito: false,
    imagen: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=800&q=80',
    descripcion: 'Vive la adrenalina recorriendo los campos y montañas del Cibao en cuatrimoto. Pasa por ríos, fincas de cacao y vistas impresionantes del Valle del Cibao.',
    horarios: ['7:00 a.m.', '10:00 a.m.', '3:00 p.m.'],
    puntoEncuentro: 'Base ATV Cibao Adventures, Km 14 Autopista Duarte, Santiago',
    incluye: ['Cuatrimoto individual o doble', 'Casco y equipo de protección', 'Guía experto', 'Snack y agua'],
    noIncluye: ['Seguro adicional (opcional)', 'Transporte al punto de partida', 'Propinas'],
  },
  {
    id: 5,
    titulo: 'Catamarán al atardecer con cena y música en vivo',
    tipo: 'Acuático',
    duracion: '2 h 30 min',
    ubicacion: 'Samaná',
    rating: 9.5, label: 'Magnífica', opiniones: 88,
    precio: 85,
    cancelacion: true, familias: false, oferta: false, favorito: true,
    imagen: 'https://images.unsplash.com/photo-1502680390469-be75c86b636f?w=800&q=80',
    descripcion: 'Una experiencia romántica e inolvidable navegando la Bahía de Samaná al atardecer. Incluye cena de mariscos, música en vivo y brindis con champán mientras el sol se oculta en el horizonte.',
    horarios: ['5:00 p.m.', '6:00 p.m.'],
    puntoEncuentro: 'Marina Santa Bárbara, Samaná',
    incluye: ['Cena de mariscos y pescado fresco', 'Copa de champán', 'Música en vivo (merengue y bachata)', 'Bebidas no alcohólicas ilimitadas'],
    noIncluye: ['Bebidas alcohólicas adicionales', 'Transporte a la marina', 'Propinas'],
  },
  {
    id: 6,
    titulo: 'Excursión a la Cascada El Limón desde Samaná',
    tipo: 'Naturaleza',
    duracion: '6 h',
    ubicacion: 'Samaná',
    rating: 8.9, label: 'Muy buena', opiniones: 31,
    precio: 55,
    cancelacion: true, familias: true, oferta: true, favorito: false,
    imagen: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&q=80',
    descripcion: 'Emprende una aventura a caballo o a pie hasta la majestuosa Cascada El Limón, una de las más altas del Caribe con 52 metros de altura. Nada en su poza natural y siente la energía de la selva tropical.',
    horarios: ['8:00 a.m.', '9:00 a.m.'],
    puntoEncuentro: 'Plaza Turística de El Limón, Las Terrenas, Samaná',
    incluye: ['Caballo y guía local', 'Almuerzo típico (pollo, arroz, habichuelas)', 'Agua y frutas frescas', 'Acceso a la cascada'],
    noIncluye: ['Propinas al guía', 'Fotos profesionales', 'Seguro de viaje'],
  },
])

const actividadesOrdenadas = computed(() => {
  const arr = [...actividades.value]
  if (orden.value === 'price-asc')  arr.sort((a, b) => a.precio - b.precio)
  if (orden.value === 'price-desc') arr.sort((a, b) => b.precio - a.precio)
  if (orden.value === 'rating')     arr.sort((a, b) => b.rating - a.rating)
  return arr
})

const toggleFav = (a) => { a.favorito = !a.favorito }

const abrirDetalle = (actividad) => {
  actividadSeleccionada.value = actividad
  modalVisible.value = true
}

const cerrarModal = () => {
  modalVisible.value = false
  setTimeout(() => { actividadSeleccionada.value = null }, 300)
}
</script>

<style scoped>
.resultados-actividades {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

/* Card */
.act-card {
  position: relative;
  display: grid;
  grid-template-columns: 220px 1fr 160px;
  gap: 0 20px;
  border: 0.5px solid #dadce0;
  border-radius: 14px;
  padding: 16px;
  background: #fff;
  align-items: stretch;
  transition: box-shadow 0.2s;
  z-index: 1; /* Establece una base baja para que no tape los dropdowns del buscador */
}
.act-card:hover { box-shadow: 0 6px 24px rgba(0,0,0,0.09); }

/* Favorito */
.btn-favorito {
  position: absolute;
  top: 10px; left: 10px;
  width: 34px; height: 34px;
  background: white; border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  border: none; cursor: pointer; z-index: 10;
  box-shadow: 0 2px 8px rgba(0,0,0,0.15);
  color: #e05252;
  transition: transform 0.2s;
}
.btn-favorito:hover { transform: scale(1.12); }
.btn-favorito.activo svg { fill: #e05252; stroke: #e05252; }

/* Imagen */
.card-img-wrapper {
  position: relative;
  grid-column: 1;
  grid-row: 1;
}
.card-img {
  width: 100%; height: 100%; min-height: 160px;
  object-fit: cover; border-radius: 10px;
}
.img-badge {
  position: absolute; bottom: 10px; left: 10px;
  font-size: 11px; font-weight: 700;
  padding: 4px 10px; border-radius: 20px;
}
.img-badge.oferta { background: #fff3e0; color: #b85c00; }

/* Info */
.card-info {
  grid-column: 2;
  display: flex; flex-direction: column; gap: 8px;
}
.tipo {
  font-size: 11px; font-weight: 700;
  color: #1a3a5c; text-transform: uppercase; letter-spacing: .5px;
}
.titulo {
  font-size: 17px; font-weight: 700;
  color: #1a1a2e; line-height: 1.3;
}
.meta-row { display: flex; gap: 16px; flex-wrap: wrap; }
.meta-item {
  display: flex; align-items: center; gap: 5px;
  font-size: 13px; color: #666;
}
.rating-row { display: flex; align-items: center; gap: 8px; }
.rating-row { display: flex; align-items: center; gap: 8px; margin-top: 4px; }
.stars-mini { display: flex; gap: 1px; }
.star-icon { color: #ddd; font-size: 14px; line-height: 1; }
.star-icon.active { color: #f5a623; }
.rating-badge {
  background: #1a3a5c; color: white;
  font-size: 12px; font-weight: 700;
  padding: 3px 8px; border-radius: 6px;
  background: #265073; 
  color: white;
  font-size: 11px; 
  font-weight: 800;
  padding: 2px 6px; 
  border-radius: 4px;
  margin-left: 2px;
}
.rating-label { font-size: 13px; font-weight: 600; color: #1a1a2e; }
.rating-count { font-size: 12px; color: #888; }
.rating-label { 
  font-size: 13px; 
  font-weight: 700; 
  color: #1a1a2e; 
}
.rating-count { 
  font-size: 12px; 
  color: #717171;
}

.beneficios { display: flex; flex-direction: column; gap: 4px; margin-top: auto; }
.beneficio {
  display: flex; align-items: center; gap: 5px;
  font-size: 13px; color: #1a7a50; font-weight: 500;
}

/* Precio */
.card-precio {
  grid-column: 3;
  display: flex; flex-direction: column;
  align-items: flex-end; justify-content: flex-end;
  gap: 4px;
}
.precio-desde { font-size: 12px; color: #888; }
.precio-amount { font-size: 30px; font-weight: 700; color: #1a1a2e; line-height: 1; }
.precio-sub { font-size: 11px; color: #888; text-align: right; }
.btn-reservar {
  margin-top: 12px;
  background: #265073; color: #fff;
  border: none; border-radius: 25px;
  padding: 10px 22px; font-size: 14px; font-weight: 600;
  cursor: pointer; transition: background 0.2s; white-space: nowrap;
}
.btn-reservar:hover { background: #1a3d5c; }

@media (max-width: 768px) {
  .act-card { grid-template-columns: 1fr; }
  .card-img-wrapper { height: 200px; }
  .card-precio { align-items: flex-start; }
}
</style>