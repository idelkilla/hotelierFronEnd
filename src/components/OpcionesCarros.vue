<template>
  <div class="resultados-autos">

    <div v-for="auto in autos" :key="auto.id" class="auto-card">

      

      <!-- Descuento top derecha -->
     
      <!-- Favorito -->
      <button class="btn-favorito" @click="toggleFav(auto)" :class="{ activo: auto.favorito }">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
        </svg>
      </button>

      <!-- Imagen -->
      <div class="card-img-wrapper">
        <img :src="auto.imagen" :alt="auto.nombre" class="card-img" />
      </div>

      <!-- Info central -->
      <div class="card-info">
        <h3 class="auto-nombre">{{ auto.nombre }}</h3>
        <p class="auto-modelo">{{ auto.modelo }}</p>

        <div class="auto-specs">
          <span class="spec">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
            {{ auto.pasajeros }}
          </span>
          <span class="spec">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
            {{ auto.transmision }}
          </span>
        </div>

        <div class="auto-specs" style="margin-top: 6px">
          <span class="spec">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
            {{ auto.kilometraje }}
          </span>
        </div>

        <div class="auto-ubicacion">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
          <div>
            <span class="ubicacion-ciudad">{{ auto.ciudad }}</span><br/>
            <span class="ubicacion-dist">{{ auto.distancia }}</span><br/>
            <span class="ubicacion-dir">{{ auto.direccion }}</span>
          </div>
        </div>
      </div>

      <!-- Beneficios + rating -->
      
      <!-- Precio + botón -->
      <div class="card-precio">
        <div class="precio-por-dia">${{ auto.precio_dia }}</div>
        <div class="precio-total">
          <span class="precio-antes" v-if="auto.precio_antes">${{ auto.precio_antes }}</span>
          ${{ auto.precio_total }} total
        </div><button class="btn-reservar" @click="verDetalle(auto.id)">Reservar</button>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const verDetalle = (id) => {
  router.push({ name: 'DetalleCarros', params: { id } })
}

const autos = ref([
  {
    id: 1,
    nombre: 'Camioneta SUV mediana',
    modelo: 'Nissan Rogue o similar',
    imagen: 'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?w=300&q=80',
    pasajeros: 5,
    transmision: 'Automático',
    kilometraje: 'Kilometraje ilimitado',
    ciudad: 'Miami',
    distancia: '2.1 mi de Miami International Autodrome',
    direccion: '18990 Nw 2nd Ave',
    credito: 'Acumula $18.59 en crédito OneKeyCash',
    cancelacion: true,
    pago: true,
    sin_tarjeta: true,
    arrendadora: 'enterprise',
    rating_pct: 71,
    rating_label: 'Bueno',
    rating_count: 7,
    precio_dia: 33,
    precio_antes: 1025,
    precio_total: 929,
    descuento: '$96',
    precio_socio: true,
    oferta: false,
    favorito: false,
  },
  {
    id: 2,
    nombre: 'Tesla SUV estándar',
    modelo: 'Chevrolet Equinox o similar',
    imagen: 'https://images.unsplash.com/photo-1606016159991-dfe4f2746ad5?w=300&q=80',
    pasajeros: 5,
    transmision: 'Automático',
    kilometraje: 'Kilometraje ilimitado',
    ciudad: 'Hollywood',
    distancia: '3 mi de Miami International Autodrome',
    direccion: '2150 S State Rd 7',
    credito: 'Acumula $17.95 en crédito OneKeyCash',
    cancelacion: true,
    pago: true,
    sin_tarjeta: true,
    arrendadora: 'enterprise',
    rating_pct: 100,
    rating_label: 'Excelente',
    rating_count: 7,
    precio_dia: 32,
    precio_antes: 990,
    precio_total: 898,
    descuento: '$92',
    precio_socio: true,
    oferta: true,
    favorito: true,
  },
  {
    id: 3,
    nombre: 'Camioneta SUV mediana con tracción total',
    modelo: 'Toyota RAV4 AWD o similar',
    imagen: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=300&q=80',
    pasajeros: 5,
    transmision: 'Automático',
    kilometraje: 'Kilometraje ilimitado',
    ciudad: 'Miami',
    distancia: '1.8 mi de Miami International Autodrome',
    direccion: '3900 NW 25th St',
    credito: 'Acumula $21.00 en crédito OneKeyCash',
    cancelacion: true,
    pago: true,
    sin_tarjeta: false,
    arrendadora: 'enterprise',
    rating_pct: 85,
    rating_label: 'Muy bueno',
    rating_count: 12,
    precio_dia: 37,
    precio_antes: 1120,
    precio_total: 1014,
    descuento: '$106',
    precio_socio: true,
    oferta: false,
    favorito: false,
  },
])

function toggleFav(auto) {
  auto.favorito = !auto.favorito
}

function ratingClass(pct) {
  if (pct >= 90) return 'rating-excelente'
  if (pct >= 70) return 'rating-bueno'
  return 'rating-regular'
}
</script>

<style scoped>
.resultados-autos {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.auto-card {
  position: relative;
  display: grid;
  grid-template-columns: 220px 1fr 1fr 160px;
  grid-template-rows: auto 1fr;
  gap: 0 20px;
  border: 0.5px solid #dadce0;
  border-radius: 14px;
  padding: 16px;
  background: #fff;
  align-items: stretch; /* Hace que los elementos de la cuadrícula se estiren verticalmente */
}

/* Badges */
.card-badges {
  grid-column: 2 / 4;
  display: flex;
  gap: 8px;
  margin-bottom: 6px;
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

.badge-oferta {
  background: #1a7f4b;
  color: #fff;
}

.badge-socio {
  background: #265073;
  color: #fff;
}

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
}

.auto-nombre {
  font-size: 18px;
  font-weight: 700;
  color: #1a1a1a;
  margin-bottom: 2px;
}

.auto-modelo {
  font-size: 13px;
  color: #666;
  margin-bottom: 10px;
}

.auto-specs {
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

.auto-ubicacion {
  display: flex;
  align-items: flex-start;
  gap: 6px;
  margin-top: 10px;
  font-size: 12px;
  color: #555;
}

.auto-ubicacion svg { margin-top: 2px; flex-shrink: 0; }

.ubicacion-ciudad { font-weight: 600; color: #333; font-size: 13px; }
.ubicacion-dist { color: #666; }
.ubicacion-dir { color: #888; }

/* Beneficios */
.card-beneficios {
  grid-column: 3;
  grid-row: 2;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.beneficio {
  font-size: 13px;
  color: #1a7f4b;
}

.credito {
  font-weight: 500;
}

.auto-rating {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 12px;
  flex-wrap: wrap;
}

.arrendadora-badge {
  background: #1a7f4b;
  color: #fff;
  font-size: 11px;
  font-weight: 700;
  padding: 3px 8px;
  border-radius: 4px;
  text-transform: lowercase;
}

.rating-pct {
  font-size: 12px;
  font-weight: 700;
  color: #fff;
  padding: 3px 8px;
  border-radius: 4px;
}

.rating-excelente { background: #1a7f4b; }
.rating-bueno { background: #2e7d32; }
.rating-regular { background: #f57c00; }

.rating-label {
  font-size: 13px;
  font-weight: 600;
  color: #333;
  display: block;
}

.rating-count {
  font-size: 11px;
  color: #888;
}

/* Precio */
.card-precio {
  grid-column: 4;
  grid-row: 2;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  justify-content: flex-end;
  margin-top: auto;
  align-self: stretch;
  gap: 4px;
  min-width: unset; /* Elimina el min-width para que 'width' sea el que mande */
  width: 160px;    /* Establece el ancho fijo para la columna de precio */
}

.precio-por-dia {
  font-size: 28px;
  font-weight: 700;
  color: #1a1a1a;
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
  margin-top: 20px;
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

.btn-reservar:hover {
  background: #1a3d5c;
}

@media (max-width: 768px) {
  .auto-card {
   grid-template-columns: 220px 1fr 1fr 160px;
  gap: 0 20px;
  }

  .card-img-wrapper { grid-column: 1; grid-row: auto; }
  .card-badges { grid-column: 1; }
  .card-info { grid-column: 1; grid-row: auto; }
  .card-beneficios { grid-column: 1; grid-row: auto; }
  .card-precio { grid-column: 1; grid-row: auto; align-items: flex-start; }
}
</style>