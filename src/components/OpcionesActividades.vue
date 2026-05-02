<!-- components/ActividadesResultados.vue -->
<template>
  <div class="resultados-actividades">

    <!-- Top bar -->
   

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
        <img :src="a.imagen" :alt="a.titulo" class="card-img" />
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
          <span class="rating-badge">{{ a.rating }}</span>
          <span class="rating-label">{{ a.label }}</span>
          <span class="rating-count">{{ a.opiniones }} opiniones</span>
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
        <button class="btn-reservar" @click="verDetalle(a.id)">Ver actividad</button>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const orden = ref('default')

const actividades = ref([
  { id: 1, titulo: 'AMBER COVE - Cataratas de Damajagua y Almuerzo Tour', tipo: 'Excursión', duracion: '5 h', ubicacion: 'Puerto Plata', rating: 9.2, label: 'Magnífica', opiniones: 135, precio: 60, cancelacion: true, familias: true,  oferta: false, favorito: false, imagen: 'https://images.unsplash.com/photo-1504701954957-2010ec3bcec1?w=400&q=80' },
  { id: 2, titulo: 'Sosua Party Boat - Snorkeling + Snack + BBQ Alimentos y Bebidas', tipo: 'Acuático', duracion: '4 h', ubicacion: 'Sosúa', rating: 9.0, label: 'Magnífica', opiniones: 11, precio: 69, cancelacion: true, familias: false, oferta: false, favorito: false, imagen: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400&q=80' },
  { id: 3, titulo: 'Tour por la ciudad de Puerto Plata y teleférico', tipo: 'Ciudad', duracion: '4 h 40 min', ubicacion: 'Puerto Plata', rating: 9.2, label: 'Magnífica', opiniones: 69, precio: 60, cancelacion: true, familias: true,  oferta: false, favorito: false, imagen: 'https://images.unsplash.com/photo-1596422846543-75c6fc197f07?w=400&q=80' },
  { id: 4, titulo: 'Aventura en ATV por los campos dominicanos', tipo: 'Aventura', duracion: '3 h', ubicacion: 'Santiago', rating: 8.7, label: 'Muy buena', opiniones: 42, precio: 45, cancelacion: false, familias: false, oferta: true,  favorito: false, imagen: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=400&q=80' },
  { id: 5, titulo: 'Catamarán al atardecer con cena y música en vivo', tipo: 'Acuático', duracion: '2 h 30 min', ubicacion: 'Samaná', rating: 9.5, label: 'Magnífica', opiniones: 88, precio: 85, cancelacion: true, familias: false, oferta: false, favorito: true,  imagen: 'https://images.unsplash.com/photo-1502680390469-be75c86b636f?w=400&q=80' },
  { id: 6, titulo: 'Excursión a la Cascada El Limón desde Samaná', tipo: 'Naturaleza', duracion: '6 h', ubicacion: 'Samaná', rating: 8.9, label: 'Muy buena', opiniones: 31, precio: 55, cancelacion: true, familias: true,  oferta: true,  favorito: false, imagen: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&q=80' },
])

const actividadesOrdenadas = computed(() => {
  const arr = [...actividades.value]
  if (orden.value === 'price-asc')  arr.sort((a, b) => a.precio - b.precio)
  if (orden.value === 'price-desc') arr.sort((a, b) => b.precio - a.precio)
  if (orden.value === 'rating')     arr.sort((a, b) => b.rating - a.rating)
  return arr
})

const toggleFav = (a) => { a.favorito = !a.favorito }
const verDetalle = (id) => router.push({ name: 'DetalleActividad', params: { id } })
</script>

<style scoped>
.resultados-actividades {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

/* Top bar */
.top-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 4px;
}
.count { font-size: 16px; font-weight: 600; color: #1a1a2e; }
.sort-select {
  font-size: 13px; padding: 8px 12px;
  border: 1.5px solid #d0d5e0; border-radius: 8px;
  background: #fff; color: #333; outline: none; cursor: pointer;
}
.sort-select:focus { border-color: #1a73e8; }

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
.rating-badge {
  background: #1a3a5c; color: white;
  font-size: 12px; font-weight: 700;
  padding: 3px 8px; border-radius: 6px;
}
.rating-label { font-size: 13px; font-weight: 600; color: #1a1a2e; }
.rating-count { font-size: 12px; color: #888; }

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