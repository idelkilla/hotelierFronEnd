<template>
  <div class="resultados-cruceros">

    <div v-for="crucero in cruceros" :key="crucero.id" class="crucero-card">


      <!-- Favorito -->
      <button class="btn-favorito" @click="toggleFav(crucero)" :class="{ activo: crucero.favorito }">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
        </svg>
      </button>

      <!-- Imagen -->
      <div class="card-img-wrapper">
        <img :src="crucero.imagen" :alt="crucero.nombre" class="card-img" />
      </div>

      <!-- Info central -->
      <div class="card-info">
        <p class="crucero-linea">{{ crucero.linea }}</p>
        <h3 class="crucero-nombre">{{ crucero.nombre }}</h3>

        <div class="crucero-specs">
          <span class="spec">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
            {{ crucero.noches }} noches
          </span>
          <span class="spec">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
            {{ crucero.escalas }} destinos
          </span>
          <span class="spec">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
            {{ crucero.tipo_experiencia }}
          </span>
        </div>

        <div class="crucero-ruta">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
          <span>{{ crucero.ruta }}</span>
        </div>

        <div class="crucero-salida">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
          <span>Sale el {{ crucero.fecha_salida }}</span>
        </div>

        <!-- Amenidades -->
        <div class="crucero-amenidades">
          <span v-if="crucero.todo_incluido" class="amenidad">✓ Todo incluido</span>
          <span v-if="crucero.wifi" class="amenidad">✓ WiFi</span>
          <span v-if="crucero.excursiones" class="amenidad">✓ Excursiones</span>
          <span v-if="crucero.cancelacion" class="amenidad amenidad-green">✓ Cancelación gratuita</span>
        </div>
      </div>

      <!-- Rating + precio -->
      <div class="card-derecha">
        <div class="crucero-rating" v-if="crucero.arrendadora">
          <span class="arrendadora-badge">{{ crucero.linea_corta }}</span>
          <span class="rating-pct" :class="ratingClass(crucero.rating_pct)">{{ crucero.rating_pct }}%</span>
          <div>
            <span class="rating-label">{{ crucero.rating_label }}</span>
            <span class="rating-count">{{ crucero.rating_count }} reseñas</span>
          </div>
        </div>

        <div class="card-precio">
          <div class="precio-desde">desde</div>
          <div class="precio-monto">${{ crucero.precio_por_persona }}</div>
          <div class="precio-sub">por persona</div>
          <div class="precio-total" v-if="crucero.precio_antes">
            <span class="precio-antes">${{ crucero.precio_antes }}</span>
            ${{ crucero.precio_total }} total
          </div>
          <button class="btn-reservar" @click="verDetalle(crucero.id)">Ver crucero</button>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const verDetalle = (id) => {
  router.push(`/cruceros/${id}`)
}

const cruceros = ref([
  {
    id: 1,
    nombre: 'Caribe Oriental — Nassau & Perfect Day',
    linea: 'Royal Caribbean International',
    linea_corta: 'Royal Caribbean',
    imagen: 'https://images.unsplash.com/photo-1548574505-5e239809ee19?w=400&q=80',
    noches: 5,
    escalas: 3,
    tipo_experiencia: 'Familiar',
    ruta: 'Miami → Nassau → Perfect Day → Miami',
    fecha_salida: '14 jun 2025',
    todo_incluido: false,
    wifi: true,
    excursiones: true,
    cancelacion: true,
    rating_pct: 92,
    rating_label: 'Excelente',
    rating_count: 1284,
    precio_por_persona: 489,
    precio_antes: 620,
    precio_total: 1960,
    descuento: '$131',
    precio_socio: true,
    oferta: true,
    favorito: false,
  },
  {
    id: 2,
    nombre: 'Mediterráneo Clásico — Italia, Grecia & Croacia',
    linea: 'Norwegian Cruise Line',
    linea_corta: 'Norwegian',
    imagen: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400&q=80',
    noches: 10,
    escalas: 6,
    tipo_experiencia: 'Solo adultos',
    ruta: 'Barcelona → Roma → Atenas → Dubrovnik → Barcelona',
    fecha_salida: '2 jul 2025',
    todo_incluido: true,
    wifi: true,
    excursiones: false,
    cancelacion: true,
    rating_pct: 88,
    rating_label: 'Muy bueno',
    rating_count: 876,
    precio_por_persona: 1290,
    precio_antes: 1580,
    precio_total: 2580,
    descuento: '$290',
    precio_socio: true,
    oferta: false,
    favorito: true,
  },
  {
    id: 3,
    nombre: 'Alaska — Glaciares & Vida Salvaje',
    linea: 'Carnival Cruise Line',
    linea_corta: 'Carnival',
    imagen: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&q=80',
    noches: 7,
    escalas: 4,
    tipo_experiencia: 'Aventura',
    ruta: 'Seattle → Juneau → Skagway → Glaciar Hubbard → Seattle',
    fecha_salida: '19 jul 2025',
    todo_incluido: false,
    wifi: false,
    excursiones: true,
    cancelacion: false,
    rating_pct: 79,
    rating_label: 'Bueno',
    rating_count: 543,
    precio_por_persona: 899,
    precio_antes: null,
    precio_total: 1798,
    descuento: null,
    precio_socio: false,
    oferta: false,
    favorito: false,
  },
])

function toggleFav(crucero) {
  crucero.favorito = !crucero.favorito
}

function ratingClass(pct) {
  if (pct >= 90) return 'rating-excelente'
  if (pct >= 70) return 'rating-bueno'
  return 'rating-regular'
}
</script>

<style scoped>
.resultados-cruceros {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.crucero-card {
  position: relative;
  display: grid;
  grid-template-columns: 260px 1fr auto;
  grid-template-rows: auto 1fr;
  gap: 0 16px;
  border: 0.5px solid #dadce0;
  border-radius: 14px;
  padding: 16px;
  background: #fff;
  align-items: start;
}

/* Badges */
.card-badges {
  grid-column: 2 / 4;
  display: flex;
  gap: 8px;
  margin-bottom: 8px;
  flex-wrap: wrap;
}

.badge {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
}
.badge-oferta { background: #1a7f4b; color: #fff; }
.badge-socio  { background: #265073; color: #fff; }

/* Descuento */
.card-descuento {
  position: absolute;
  top: 16px;
  right: 16px;
  background: #265073;
  color: #fff;
  font-size: 12px;
  font-weight: 700;
  padding: 5px 12px;
  border-radius: 20px;
}

/* Favorito */
.btn-favorito {
  position: absolute;
  top: 10px;
  left: 10px;
  width: 36px;
  height: 36px;
  background: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  z-index: 20;
  padding: 0;
  outline: none;
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  transition: transform 0.2s;
  color: #ff385c;
}
.btn-favorito:hover { transform: scale(1.1); }
.btn-favorito.activo svg { fill: #ff385c; stroke: #ff385c; }

/* Imagen */
.card-img-wrapper {
  grid-column: 1;
  grid-row: 1 / 4;
  display: flex;
  align-items: center;
  justify-content: center;
}
.card-img {
  width: 100%;
  height: 180px;
  object-fit: cover;
  border-radius: 10px;
}

/* Info */
.card-info {
  grid-column: 2;
  grid-row: 2;
  display: flex;
  flex-direction: column;
  gap: 5px; /* Reducimos el espacio general entre los bloques de texto */
}

.crucero-linea {
  font-size: 12px;
  color: #265073;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin: 8px 0 0 0; /* Mantenemos solo el margen superior para alinear con la imagen */
}

.crucero-nombre {
  font-size: 17px;
  font-weight: 700;
  color: #1a1a1a;
  margin: 0; /* Quitamos el margen por defecto del h3 que separaba los nombres */
}

.crucero-specs {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
}

.spec {
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 13px;
  color: #444;
}

.crucero-ruta, .crucero-salida {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  color: #666;
}

.crucero-amenidades {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  margin-top: 4px;
}

.amenidad {
  font-size: 12px;
  color: #555;
}
.amenidad-green { color: #1a7f4b; font-weight: 500; }

/* Derecha: rating + precio */
.card-derecha {
  grid-column: 3;
  grid-row: 2;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 12px;
  min-width: 160px;
}

.crucero-rating {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
  justify-content: flex-end;
}

.arrendadora-badge {
  background: #265073;
  color: #fff;
  font-size: 11px;
  font-weight: 700;
  padding: 3px 8px;
  border-radius: 4px;
}

.rating-pct {
  font-size: 12px;
  font-weight: 700;
  color: #fff;
  padding: 3px 8px;
  border-radius: 4px;
}
.rating-excelente { background: #1a7f4b; }
.rating-bueno     { background: #2e7d32; }
.rating-regular   { background: #f57c00; }

.rating-label {
  font-size: 13px;
  font-weight: 600;
  color: #333;
  display: block;
  text-align: right;
}
.rating-count {
  font-size: 11px;
  color: #888;
  text-align: right;
  display: block;
}

/* Precio */
.card-precio {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 2px;
}

.precio-desde {
  font-size: 11px;
  color: #888;
}

.precio-monto {
  font-size: 28px;
  font-weight: 700;
  color: #1a1a1a;
}

.precio-sub {
  font-size: 11px;
  color: #888;
}

.precio-total {
  font-size: 13px;
  color: #666;
}

.precio-antes {
  text-decoration: line-through;
  color: #999;
  margin-right: 4px;
}

.btn-reservar {
  margin-top: 10px;
  background: #265073;
  color: #fff;
  border: none;
  border-radius: 25px;
  padding: 10px 24px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
  white-space: nowrap;
}
.btn-reservar:hover { background: #1a3d5c; }

@media (max-width: 768px) {
  .crucero-card {
    grid-template-columns: 1fr;
  }
  .card-img-wrapper { grid-column: 1; grid-row: auto; }
  .card-badges      { grid-column: 1; }
  .card-info        { grid-column: 1; grid-row: auto; }
  .card-derecha     { grid-column: 1; grid-row: auto; align-items: flex-start; }
}
</style>