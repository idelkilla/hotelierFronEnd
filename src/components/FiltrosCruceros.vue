<template>
  <div class="filtros-cruceros">

    <div class="filtro-card">
      <h3 class="filtro-titulo">Filtros más usados</h3>
      <label class="filtro-opcion"><input type="checkbox" v-model="filtros.todoIncluido" /> Todo incluido</label>
      <label class="filtro-opcion"><input type="checkbox" v-model="filtros.soloAdultos" /> Solo adultos</label>
      <label class="filtro-opcion"><input type="checkbox" v-model="filtros.ofertasUltimaHora" /> Ofertas de última hora</label>
    </div>

    <div class="filtro-card">
      <h3 class="filtro-titulo">Línea de cruceros</h3>
      <label v-for="linea in lineasCrucero" :key="linea" class="filtro-opcion">
        <input type="checkbox" v-model="filtros.lineas" :value="linea" /> {{ linea }}
      </label>
    </div>

    <div class="filtro-card">
      <h3 class="filtro-titulo">Tipo de camarote</h3>
      <label v-for="tipo in tiposCamarote" :key="tipo" class="filtro-opcion">
        <input type="checkbox" v-model="filtros.camarotes" :value="tipo" /> {{ tipo }}
      </label>
    </div>

    <div class="filtro-card">
      <h3 class="filtro-titulo">Tipo de experiencia</h3>
      <label v-for="exp in experiencias" :key="exp" class="filtro-opcion">
        <input type="radio" name="experiencia" v-model="filtros.experiencia" :value="exp" /> {{ exp }}
      </label>
    </div>

    <div class="filtro-card">
      <h3 class="filtro-titulo">Número de escalas</h3>
      <label v-for="escala in escalas" :key="escala.value" class="filtro-opcion">
        <input type="radio" name="escalas" v-model="filtros.escalas" :value="escala.value" /> {{ escala.label }}
      </label>
    </div>

    <div class="filtro-card">
      <h3 class="filtro-titulo">Actividades a bordo</h3>
      <label v-for="act in actividades" :key="act" class="filtro-opcion">
        <input type="checkbox" v-model="filtros.actividades" :value="act" /> {{ act }}
      </label>
    </div>

    <div class="filtro-card">
      <h3 class="filtro-titulo">Servicios incluidos</h3>
      <label class="filtro-opcion"><input type="checkbox" v-model="filtros.wifi" /> WiFi</label>
      <label class="filtro-opcion"><input type="checkbox" v-model="filtros.bebidas" /> Bebidas</label>
      <label class="filtro-opcion"><input type="checkbox" v-model="filtros.excursiones" /> Excursiones</label>
    </div>

    <div class="filtro-card">
      <h3 class="filtro-titulo">Rango de precios</h3>
      <div class="precio-inputs">
        <div class="precio-field">
          <label class="precio-label">Mínimo</label>
          <div class="precio-input-wrapper">
            <span class="precio-signo">$</span>
            <input type="number" v-model="filtros.precioMin" min="0" placeholder="0" />
          </div>
        </div>
        <div class="precio-field">
          <label class="precio-label">Máximo</label>
          <div class="precio-input-wrapper">
            <span class="precio-signo">$</span>
            <input type="number" v-model="filtros.precioMax" min="0" placeholder="0" />
          </div>
        </div>
      </div>
    </div>

    <div class="filtro-card">
      <h3 class="filtro-titulo">Valoración</h3>
      <label v-for="val in valoraciones" :key="val.value" class="filtro-opcion">
        <input type="radio" name="valoracion" v-model="filtros.valoracion" :value="val.value" />
        <span class="estrellas">{{ val.stars }}</span> {{ val.label }}
      </label>
    </div>

    <div class="filtro-card">
      <h3 class="filtro-titulo">Accesibilidad y más</h3>
      <label class="filtro-opcion"><input type="checkbox" v-model="filtros.accesible" /> Adaptado para personas con discapacidad</label>
      <label class="filtro-opcion"><input type="checkbox" v-model="filtros.descuentos" /> Con descuentos activos</label>
    </div>

  </div>
</template>

<script setup>
import { reactive } from 'vue'

const lineasCrucero = [
  'Royal Caribbean',
  'Carnival Cruise Line',
  'Norwegian Cruise Line',
  'MSC Cruises',
  'Celebrity Cruises',
  'Costa Cruceros',
  'Princess Cruises',
]

const tiposCamarote = ['Interior', 'Exterior', 'Balcón', 'Suite']

const experiencias = ['Familiar', 'Solo adultos', 'Lujo', 'Aventura']

const escalas = [
  { label: 'Sin escalas', value: 0 },
  { label: '1 escala', value: 1 },
  { label: '2 escalas', value: 2 },
  { label: '3 o más escalas', value: 3 },
]

const actividades = ['Piscina', 'Casino', 'Spa', 'Shows', 'Gimnasio', 'Mini golf']

const valoraciones = [
  { value: 5, stars: '★★★★★', label: '5 estrellas' },
  { value: 4, stars: '★★★★☆', label: '4 estrellas o más' },
  { value: 3, stars: '★★★☆☆', label: '3 estrellas o más' },
]

const filtros = reactive({
  todoIncluido: false,
  soloAdultos: false,
  ofertasUltimaHora: false,
  lineas: [],
  camarotes: [],
  experiencia: '',
  escalas: null,
  actividades: [],
  wifi: false,
  bebidas: false,
  excursiones: false,
  precioMin: 0,
  precioMax: 0,
  valoracion: null,
  accesible: false,
  descuentos: false,
})
</script>

<style scoped>
.filtros-cruceros {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.filtro-card {
  background: #fff;
  border: 0.5px solid #e0e0e0;
  border-radius: 12px;
  padding: 1rem 1.25rem;
  display: flex;
  flex-direction: column;
}

.filtro-titulo {
  font-size: 15px;
  font-weight: 600;
  color: #265073;
  margin-bottom: 12px;
}

.filtro-opcion {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 6px 0;
  font-size: 14px;
  color: #333;
  cursor: pointer;
}

.filtro-opcion input[type="checkbox"],
.filtro-opcion input[type="radio"] {
  appearance: none;
  -webkit-appearance: none;
  width: 18px;
  height: 18px;
  border: 1.5px solid #aab0bc;
  border-radius: 50%; /* Hace que todos sean circulares */
  cursor: pointer;
  background: white;
  flex-shrink: 0;
  position: relative;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
}

.filtro-opcion input[type="checkbox"]:checked,
.filtro-opcion input[type="radio"]:checked {
  border-color: #113955; /* Borde azul al seleccionar */
  background-color: white;
}

.filtro-opcion input[type="checkbox"]:checked::after,
.filtro-opcion input[type="radio"]:checked::after {
  content: '';
  position: absolute;
  width: 10px;
  height: 10px;
  background-color: #113955; /* Punto central azul */
  border-radius: 50%;
}

.estrellas {
  color: #f5a623;
  letter-spacing: 1px;
}

/* Precio */
.precio-inputs {
  display: flex;
  gap: 12px;
}

.precio-field {
  flex: 1;
  border: 0.5px solid #dadce0;
  border-radius: 10px;
  padding: 8px 12px;
}

.precio-label {
  font-size: 11px;
  color: #888;
  display: block;
  margin-bottom: 2px;
}

.precio-input-wrapper {
  display: flex;
  align-items: center;
  gap: 2px;
}

.precio-signo {
  font-size: 15px;
  font-weight: 500;
  color: #265073;
}

.precio-input-wrapper input {
  border: none;
  outline: none;
  font-size: 15px;
  font-weight: 500;
  color: #265073;
  width: 100%;
  background: transparent;
}
</style>