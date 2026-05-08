<template>
  <div class="detalle-page">

    <!-- Breadcrumb -->
    <div class="breadcrumb">
      <button class="btn-back" @click="router.back()">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="15 18 9 12 15 6"/></svg>
        Volver a resultados
      </button>
    </div>

    <div v-if="crucero" class="detalle-layout">

      <!-- COLUMNA IZQUIERDA -->
      <div class="col-main">

        <!-- Header -->
        <div class="detalle-header">
          <p class="linea-nombre">{{ crucero.linea }}</p>
          <h1 class="crucero-titulo">{{ crucero.nombre }}</h1>
          <div class="header-badges">
            <span class="badge badge-blue">{{ crucero.noches }} noches</span>
            <span class="badge badge-blue">{{ crucero.escalas }} destinos</span>
            <span class="badge badge-blue">{{ crucero.tipo_experiencia }}</span>
            <span v-if="crucero.cancelacion" class="badge badge-green">✓ Cancelación gratuita</span>
          </div>
        </div>

        <!-- Galería -->
        <div class="galeria">
          <div class="galeria-main">
            <img 
              :src="crucero.imagen" 
              :alt="crucero.nombre" 
              class="img-main" 
              fetchpriority="high" />
            <button class="btn-favorito" @click="toggleFav(crucero)" :class="{ activo: crucero.favorito }">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
              </svg>
            </button>
          </div>
          <div class="galeria-thumbs">
            <img 
              v-for="(img, i) in galeria" 
              :key="i" 
              :src="img" 
              :alt="`Foto ${i+1}`" 
              class="img-thumb" 
              loading="lazy" />
          </div>
        </div>

        <!-- Itinerario -->
        <div class="seccion-card">
          <h2 class="seccion-titulo">Itinerario</h2>
          <div class="itinerario">
            <div v-for="(parada, i) in crucero.itinerario" :key="i" class="parada">
              <div class="parada-linea">
                <div class="parada-dot" :class="{ 'dot-primario': i === 0 || i === crucero.itinerario.length - 1 }"></div>
                <div v-if="i < crucero.itinerario.length - 1" class="parada-connector"></div>
              </div>
              <div class="parada-info">
                <span class="parada-ciudad">{{ parada.ciudad }}</span>
                <span class="parada-dia">{{ parada.dia }}</span>
                <span v-if="parada.nota" class="parada-nota">{{ parada.nota }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- El barco -->
        <div class="seccion-card">
          <h2 class="seccion-titulo">El barco</h2>
          <div class="barco-metrics">
            <div class="metric">
              <span class="metric-num">{{ crucero.barco.pasajeros.toLocaleString() }}</span>
              <span class="metric-lbl">pasajeros</span>
            </div>
            <div class="metric">
              <span class="metric-num">{{ crucero.barco.cubiertas }}</span>
              <span class="metric-lbl">cubiertas</span>
            </div>
            <div class="metric">
              <span class="metric-num">{{ crucero.barco.ano }}</span>
              <span class="metric-lbl">año de lanzamiento</span>
            </div>
            <div class="metric">
              <span class="metric-num">{{ crucero.barco.longitud }}m</span>
              <span class="metric-lbl">eslora</span>
            </div>
          </div>
          <div class="barco-features">
            <span v-for="f in crucero.barco.features" :key="f" class="feature-pill">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
              {{ f }}
            </span>
          </div>
        </div>

        <!-- Tipos de cabina -->
        <div class="seccion-card">
          <h2 class="seccion-titulo">Elige tu cabina</h2>
          <div class="cabinas-grid">
            <div
              v-for="cabina in crucero.cabinas"
              :key="cabina.tipo"
              class="cabina-card"
              :class="{ 'cabina-selected': cabinaSeleccionada === cabina.tipo }"
              @click="cabinaSeleccionada = cabina.tipo"
            >
              <div class="cabina-tipo">{{ cabina.tipo }}</div>
              <div class="cabina-precio">${{ cabina.precio }}<span class="cabina-por">/p.</span></div>
              <div class="cabina-desc">{{ cabina.descripcion }}</div>
            </div>
          </div>
        </div>

        <!-- Amenidades -->
        <div class="seccion-card">
          <h2 class="seccion-titulo">¿Qué incluye?</h2>
          <div class="amenidades-grid">
            <div v-for="a in amenidades" :key="a.label" class="amenidad-row" :class="{ 'amenidad-no': !a.incluido }">
              <svg v-if="a.incluido" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#1a7f4b" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
              <svg v-else width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#bbb" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              <span>{{ a.label }}</span>
            </div>
          </div>
        </div>

        <!-- Reseñas -->
        <div class="seccion-card">
          <h2 class="seccion-titulo">Reseñas de viajeros</h2>
          <div class="rating-header">
            <div class="rating-big" :class="ratingClass(crucero.rating_pct)">{{ crucero.rating_pct }}%</div>
            <div>
              <div class="rating-label-big">{{ crucero.rating_label }}</div>
              <div class="rating-count-big">{{ crucero.rating_count.toLocaleString() }} reseñas verificadas</div>
            </div>
          </div>
          <div class="resenas-lista">
            <div v-for="r in crucero.resenas" :key="r.autor" class="resena">
              <div class="resena-header">
                <div class="resena-avatar">{{ r.autor[0] }}</div>
                <div>
                  <div class="resena-autor">{{ r.autor }}</div>
                  <div class="resena-fecha">{{ r.fecha }}</div>
                </div>
                <div class="resena-stars">
                  <span v-for="s in 5" :key="s" class="star" :class="{ 'star-off': s > r.estrellas }">★</span>
                </div>
              </div>
              <p class="resena-texto">{{ r.texto }}</p>
            </div>
          </div>
        </div>

      </div>

      <!-- COLUMNA DERECHA sticky -->
      <div class="col-sticky">
        <div class="precio-card">
          <div class="precio-desde">desde</div>
          <div class="precio-monto">${{ precioActual }}</div>
          <div class="precio-sub">por persona</div>
          <div v-if="crucero.precio_antes" class="precio-antes-row">
            <span class="precio-tachado">${{ crucero.precio_antes }}</span>
            <span class="precio-total-txt">${{ crucero.precio_total }} total</span>
          </div>

          <div class="precio-sep"></div>

          <div class="precio-detalle">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
            Sale el {{ crucero.fecha_salida }}
          </div>
          <div class="precio-detalle">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
            {{ crucero.noches }} noches · regresa {{ crucero.fecha_regreso }}
          </div>
          <div class="precio-detalle">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
            Sale desde {{ crucero.puerto_salida }}
          </div>

          <div class="precio-sep"></div>

          <div class="cabina-sel-info" v-if="cabinaSeleccionada">
            Cabina seleccionada: <strong>{{ cabinaSeleccionada }}</strong>
          </div>

<button class="btn-reservar" @click="abrirModal">Reservar ahora</button>
          <p class="btn-sub" v-if="crucero.cancelacion">✓ Cancelación gratuita hasta 48 h antes</p>
        </div>
      </div>

    </div>

    <!-- Estado vacío -->
    <div v-else class="not-found">
      <p>No se encontró este crucero.</p>
      <button class="btn-back" @click="router.back()">Volver</button>
    </div>
<!-- Modal Reserva -->
<div v-if="modalAbierto" class="modal-overlay" @click.self="modalAbierto = false">
  <div class="modal-card">

    <div class="modal-header">
      <div>
        <p class="modal-linea">{{ crucero?.linea }}</p>
        <h2 class="modal-titulo">Reservar: {{ crucero?.nombre }}</h2>
      </div>
      <button class="modal-cerrar" @click="modalAbierto = false">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
        </svg>
      </button>
    </div>

    <!-- Pasos -->
    <div class="modal-pasos">
      <div
        v-for="(paso, i) in pasos"
        :key="i"
        class="paso-item"
        :class="{ 'paso-activo': pasoActual === i, 'paso-completado': pasoActual > i }"
      >
        <div class="paso-circulo">
          <svg v-if="pasoActual > i" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
            <polyline points="20 6 9 17 4 12"/>
          </svg>
          <span v-else>{{ i + 1 }}</span>
        </div>
        <span class="paso-label">{{ paso }}</span>
      </div>
    </div>

    <!-- PASO 1: Pasajeros -->
    <div v-if="pasoActual === 0" class="modal-body">
      <h3 class="paso-titulo">Datos del pasajero principal</h3>

      <div class="form-row">
        <div class="form-group">
          <label>Nombre *</label>
          <input v-model="reserva.nombre" type="text" placeholder="Ej: Carlos" />
        </div>
        <div class="form-group">
          <label>Apellido *</label>
          <input v-model="reserva.apellido" type="text" placeholder="Ej: Martínez" />
        </div>
      </div>

      <div class="form-row">
        <div class="form-group">
          <label>Correo electrónico *</label>
          <input v-model="reserva.email" type="email" placeholder="correo@ejemplo.com" />
        </div>
        <div class="form-group">
          <label>Teléfono / WhatsApp *</label>
          <input v-model="reserva.telefono" type="tel" placeholder="+1 809 000 0000" />
        </div>
      </div>

      <div class="form-row">
        <div class="form-group">
          <label>Fecha de nacimiento *</label>
          <input v-model="reserva.fechaNacimiento" type="date" />
        </div>
        <div class="form-group">
          <label>Nacionalidad *</label>
          <select v-model="reserva.nacionalidad">
            <option value="">Seleccionar...</option>
            <option>Dominicana</option>
            <option>Estadounidense</option>
            <option>Española</option>
            <option>Mexicana</option>
            <option>Colombiana</option>
            <option>Venezolana</option>
            <option>Otra</option>
          </select>
        </div>
      </div>

      <div class="form-row">
        <div class="form-group">
          <label>N.º de pasaporte *</label>
          <input v-model="reserva.pasaporte" type="text" placeholder="AB123456" />
        </div>
        <div class="form-group">
          <label>Vencimiento del pasaporte *</label>
          <input v-model="reserva.vencimientoPasaporte" type="date" />
        </div>
      </div>

      <h3 class="paso-titulo" style="margin-top: 24px;">Composición del grupo</h3>
      <div class="form-row">
        <div class="form-group">
          <label>Adultos (18+)</label>
          <div class="counter">
            <button @click="reserva.adultos = Math.max(1, reserva.adultos - 1)">−</button>
            <span>{{ reserva.adultos }}</span>
            <button @click="reserva.adultos++">+</button>
          </div>
        </div>
        <div class="form-group">
          <label>Niños (2–17)</label>
          <div class="counter">
            <button @click="reserva.ninos = Math.max(0, reserva.ninos - 1)">−</button>
            <span>{{ reserva.ninos }}</span>
            <button @click="reserva.ninos++">+</button>
          </div>
        </div>
        <div class="form-group">
          <label>Bebés (&lt; 2)</label>
          <div class="counter">
            <button @click="reserva.bebes = Math.max(0, reserva.bebes - 1)">−</button>
            <span>{{ reserva.bebes }}</span>
            <button @click="reserva.bebes++">+</button>
          </div>
        </div>
      </div>
    </div>

    <!-- PASO 2: Cabina y preferencias -->
    <div v-if="pasoActual === 1" class="modal-body">
      <h3 class="paso-titulo">Tipo de cabina</h3>
      <div class="cabinas-modal-grid">
        <div
          v-for="cabina in crucero?.cabinas"
          :key="cabina.tipo"
          class="cabina-modal-card"
          :class="{ 'cabina-modal-sel': reserva.cabina === cabina.tipo }"
          @click="reserva.cabina = cabina.tipo"
        >
          <div class="cabina-modal-tipo">{{ cabina.tipo }}</div>
          <div class="cabina-modal-precio">${{ cabina.precio }}<span>/p.</span></div>
          <div class="cabina-modal-desc">{{ cabina.descripcion }}</div>
        </div>
      </div>

      <h3 class="paso-titulo" style="margin-top: 24px;">Preferencias especiales</h3>
      <div class="form-row">
        <div class="form-group form-full">
          <label>Restricciones alimentarias</label>
          <select v-model="reserva.alimentacion">
            <option value="">Sin restricciones</option>
            <option>Vegetariano</option>
            <option>Vegano</option>
            <option>Sin gluten</option>
            <option>Sin mariscos</option>
            <option>Halal</option>
            <option>Kosher</option>
          </select>
        </div>
      </div>
      <div class="form-row">
        <div class="form-group form-full">
          <label>¿Alguna necesidad de accesibilidad o movilidad?</label>
          <input v-model="reserva.accesibilidad" type="text" placeholder="Ej: silla de ruedas, habitación adaptada..." />
        </div>
      </div>
      <div class="form-row">
        <div class="form-group form-full">
          <label>Ocasión especial a bordo</label>
          <select v-model="reserva.ocasion">
            <option value="">Ninguna</option>
            <option>Luna de miel</option>
            <option>Aniversario</option>
            <option>Cumpleaños</option>
            <option>Viaje de negocios</option>
          </select>
        </div>
      </div>
    </div>

    <!-- PASO 3: Pago y confirmación -->
    <div v-if="pasoActual === 2" class="modal-body">
      <h3 class="paso-titulo">Resumen de tu reserva</h3>

      <div class="resumen-box">
        <div class="resumen-row">
          <span>Crucero</span>
          <span>{{ crucero?.nombre }}</span>
        </div>
        <div class="resumen-row">
          <span>Salida</span>
          <span>{{ crucero?.fecha_salida }} · {{ crucero?.puerto_salida }}</span>
        </div>
        <div class="resumen-row">
          <span>Cabina</span>
          <span>{{ reserva.cabina || cabinaSeleccionada || crucero?.cabinas[0].tipo }}</span>
        </div>
        <div class="resumen-row">
          <span>Pasajeros</span>
          <span>{{ reserva.adultos }} adulto{{ reserva.adultos > 1 ? 's' : '' }}{{ reserva.ninos ? ` · ${reserva.ninos} niño${reserva.ninos > 1 ? 's' : ''}` : '' }}{{ reserva.bebes ? ` · ${reserva.bebes} bebé${reserva.bebes > 1 ? 's' : ''}` : '' }}</span>
        </div>
        <div class="resumen-sep"></div>
        <div class="resumen-row resumen-total">
          <span>Total estimado</span>
          <span>${{ totalReserva.toLocaleString() }}</span>
        </div>
      </div>

      <h3 class="paso-titulo" style="margin-top: 20px;">Método de pago</h3>
      <div class="pago-opciones">
        <label class="pago-opcion" :class="{ 'pago-sel': reserva.metodoPago === 'tarjeta' }">
          <input type="radio" v-model="reserva.metodoPago" value="tarjeta" />
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>
          Tarjeta de crédito / débito
        </label>
        <label class="pago-opcion" :class="{ 'pago-sel': reserva.metodoPago === 'transferencia' }">
          <input type="radio" v-model="reserva.metodoPago" value="transferencia" />
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="17 1 21 5 17 9"/><path d="M3 11V9a4 4 0 0 1 4-4h14"/><polyline points="7 23 3 19 7 15"/><path d="M21 13v2a4 4 0 0 1-4 4H3"/></svg>
          Transferencia bancaria
        </label>
        <label class="pago-opcion" :class="{ 'pago-sel': reserva.metodoPago === 'deposito' }">
          <input type="radio" v-model="reserva.metodoPago" value="deposito" />
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
          Solo depósito (30%)
        </label>
      </div>

      <div v-if="reserva.metodoPago === 'tarjeta'" class="form-row" style="margin-top:16px;">
        <div class="form-group form-full">
          <label>Número de tarjeta</label>
          <input type="text" placeholder="•••• •••• •••• ••••" maxlength="19" />
        </div>
        <div class="form-group">
          <label>Vencimiento</label>
          <input type="text" placeholder="MM/AA" maxlength="5" />
        </div>
        <div class="form-group">
          <label>CVV</label>
          <input type="text" placeholder="•••" maxlength="4" />
        </div>
      </div>

      <label class="check-terminos">
        <input type="checkbox" v-model="reserva.terminos" />
        Acepto los <a href="#" style="color:#265073;">términos y condiciones</a> y la <a href="#" style="color:#265073;">política de cancelación</a>
      </label>
    </div>

    <!-- PASO 4: Éxito -->
    <div v-if="pasoActual === 3" class="modal-body modal-exito">
      <div class="exito-icono">
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#1a7f4b" stroke-width="2">
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
          <polyline points="22 4 12 14.01 9 11.01"/>
        </svg>
      </div>
      <h3 class="exito-titulo">¡Reserva confirmada!</h3>
      <p class="exito-texto">Hemos enviado la confirmación a <strong>{{ reserva.email }}</strong>. Un agente se pondrá en contacto contigo en menos de 24 horas.</p>
      <div class="exito-codigo">
        Código de reserva: <strong>#CR-{{ codigoReserva }}</strong>
      </div>
      <button class="btn-reservar" style="margin-top: 20px; max-width: 240px;" @click="modalAbierto = false">
        Cerrar
      </button>
    </div>

    <!-- Footer del modal -->
    <div v-if="pasoActual < 3" class="modal-footer">
      <button class="btn-modal-sec" v-if="pasoActual > 0" @click="pasoActual--">Atrás</button>
      <div v-else></div>
      <button
        class="btn-modal-pri"
        @click="avanzarPaso"
        :disabled="!puedeContinuar"
      >
        {{ pasoActual === 2 ? 'Confirmar reserva' : 'Continuar' }}
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="9 18 15 12 9 6"/></svg>
      </button>
    </div>

  </div>
</div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

// ─── DATA ───────────────────────────────────────────────────────────────────
// En producción esto vendría de un store (Pinia) o de una llamada a API.
// Por ahora se define aquí para que la página funcione de forma autónoma.
const todosLosCruceros = ref([
  {
    id: 1,
    nombre: 'Caribe Oriental — Nassau & Perfect Day',
    linea: 'Royal Caribbean International',
    linea_corta: 'Royal Caribbean',
    imagen: 'https://images.unsplash.com/photo-1548574505-5e239809ee19?w=900&q=80',
    noches: 5,
    escalas: 3,
    tipo_experiencia: 'Familiar',
    ruta: 'Miami → Nassau → Perfect Day → Miami',
    puerto_salida: 'Miami, Florida',
    fecha_salida: '14 jun 2025',
    fecha_regreso: '19 jun 2025',
    todo_incluido: false,
    wifi: true,
    excursiones: true,
    cancelacion: true,
    arrendadora: true,
    rating_pct: 92,
    rating_label: 'Excelente',
    rating_count: 1284,
    precio_por_persona: 489,
    precio_antes: 620,
    precio_total: 1960,
    favorito: false,
    itinerario: [
      { ciudad: 'Miami, Florida', dia: 'Día 1 · Salida', nota: 'Embarque desde las 11:00 am' },
      { ciudad: 'Nassau, Bahamas', dia: 'Día 2', nota: 'Puerto · 8:00 am – 6:00 pm' },
      { ciudad: 'Perfect Day at CocoCay', dia: 'Día 3', nota: 'Playa privada' },
      { ciudad: 'Día en el mar', dia: 'Día 4', nota: null },
      { ciudad: 'Miami, Florida', dia: 'Día 5 · Regreso', nota: 'Desembarque hasta las 9:00 am' },
    ],
    barco: {
      nombre: 'Symphony of the Seas',
      pasajeros: 5400,
      cubiertas: 18,
      ano: 2006,
      longitud: 362,
      features: [
        'Piscinas y toboganes acuáticos',
        'Zona infantil Adventure Ocean',
        'Casino a bordo',
        'Restaurantes de especialidad',
        'Teatro y espectáculos',
        'Spa y gimnasio',
      ],
    },
    cabinas: [
      { tipo: 'Interior', precio: 489, descripcion: 'Cómoda cabina sin ventana, ideal para quienes pasan poco tiempo en el cuarto.' },
      { tipo: 'Exterior', precio: 589, descripcion: 'Ventana fija con vista al mar para disfrutar de la luz natural.' },
      { tipo: 'Balcón', precio: 689, descripcion: 'Balcón privado para admirar los amaneceres y atardeceres.' },
      { tipo: 'Suite', precio: 1199, descripcion: 'Espacio amplio con sala de estar, jacuzzi y mayordomía.' },
    ],
    resenas: [
      { autor: 'Carlos M.', fecha: 'mar 2025', estrellas: 5, texto: 'Viaje increíble con la familia. Perfect Day at CocoCay superó todas las expectativas. El personal del barco siempre atento y amable.' },
      { autor: 'Ana P.', fecha: 'feb 2025', estrellas: 4, texto: 'Muy buena experiencia en general. Nassau es hermoso. Solo le quito una estrella porque el WiFi era lento en algunas zonas del barco.' },
      { autor: 'Roberto G.', fecha: 'ene 2025', estrellas: 5, texto: 'Perfecta relación calidad-precio. Ya tenemos ganas de repetir. La comida en los restaurantes de especialidad está deliciosa.' },
    ],
  },
  {
    id: 2,
    nombre: 'Mediterráneo Clásico — Italia, Grecia & Croacia',
    linea: 'Norwegian Cruise Line',
    linea_corta: 'Norwegian',
    imagen: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=900&q=80',
    noches: 10,
    escalas: 6,
    tipo_experiencia: 'Solo adultos',
    ruta: 'Barcelona → Roma → Atenas → Dubrovnik → Barcelona',
    puerto_salida: 'Barcelona, España',
    fecha_salida: '2 jul 2025',
    fecha_regreso: '12 jul 2025',
    todo_incluido: true,
    wifi: true,
    excursiones: false,
    cancelacion: true,
    arrendadora: true,
    rating_pct: 88,
    rating_label: 'Muy bueno',
    rating_count: 876,
    precio_por_persona: 1290,
    precio_antes: 1580,
    precio_total: 2580,
    favorito: true,
    itinerario: [
      { ciudad: 'Barcelona, España', dia: 'Día 1 · Salida', nota: 'Embarque desde las 12:00 pm' },
      { ciudad: 'Marsella, Francia', dia: 'Día 2', nota: 'Puerto · 8:00 am – 5:00 pm' },
      { ciudad: 'Roma (Civitavecchia), Italia', dia: 'Día 3', nota: 'Puerto · 7:00 am – 8:00 pm' },
      { ciudad: 'Nápoles, Italia', dia: 'Día 4', nota: 'Puerto · 8:00 am – 6:00 pm' },
      { ciudad: 'Santorini, Grecia', dia: 'Día 6', nota: 'Anclaje · 7:00 am – 7:00 pm' },
      { ciudad: 'Atenas (Pireo), Grecia', dia: 'Día 7', nota: 'Puerto · 7:00 am – 8:00 pm' },
      { ciudad: 'Dubrovnik, Croacia', dia: 'Día 9', nota: 'Puerto · 8:00 am – 6:00 pm' },
      { ciudad: 'Barcelona, España', dia: 'Día 11 · Regreso', nota: 'Desembarque hasta las 9:00 am' },
    ],
    barco: {
      nombre: 'Norwegian Epic',
      pasajeros: 4100,
      cubiertas: 19,
      ano: 2010,
      longitud: 329,
      features: [
        'Bar de hielo (Ice Bar)',
        'Espectáculos de Broadway',
        'Restaurantes todo incluido',
        'Piscinas interiores y exteriores',
        'Spa con sauna y baño turco',
        'Zona de deportes acuáticos',
      ],
    },
    cabinas: [
      { tipo: 'Studio', precio: 1290, descripcion: 'Cabina individual con lounge privado exclusivo para viajeros solos.' },
      { tipo: 'Interior', precio: 1390, descripcion: 'Cabina doble cómoda sin ventana.' },
      { tipo: 'Balcón', precio: 1590, descripcion: 'Balcón privado con vistas al Mediterráneo.' },
      { tipo: 'Suite Haven', precio: 2499, descripcion: 'Complejo privado con piscina, restaurante y mayordomo.' },
    ],
    resenas: [
      { autor: 'María L.', fecha: 'abr 2025', estrellas: 5, texto: 'El Mediterráneo desde el mar es una experiencia única. Santorini al amanecer desde la cubierta fue mágico. Todo incluido hace que te olvides del presupuesto.' },
      { autor: 'Javier T.', fecha: 'mar 2025', estrellas: 4, texto: 'Excelente itinerario, cada puerto vale la pena. Los espectáculos de Broadway a bordo son sorprendentemente buenos.' },
    ],
  },
  {
    id: 3,
    nombre: 'Alaska — Glaciares & Vida Salvaje',
    linea: 'Carnival Cruise Line',
    linea_corta: 'Carnival',
    imagen: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=900&q=80',
    noches: 7,
    escalas: 4,
    tipo_experiencia: 'Aventura',
    ruta: 'Seattle → Juneau → Skagway → Glaciar Hubbard → Seattle',
    puerto_salida: 'Seattle, Washington',
    fecha_salida: '19 jul 2025',
    fecha_regreso: '26 jul 2025',
    todo_incluido: false,
    wifi: false,
    excursiones: true,
    cancelacion: false,
    arrendadora: true,
    rating_pct: 79,
    rating_label: 'Bueno',
    rating_count: 543,
    precio_por_persona: 899,
    precio_antes: null,
    precio_total: 1798,
    favorito: false,
    itinerario: [
      { ciudad: 'Seattle, Washington', dia: 'Día 1 · Salida', nota: 'Embarque desde las 10:00 am' },
      { ciudad: 'Victoria, BC, Canadá', dia: 'Día 2', nota: 'Puerto · 6:00 pm – 11:00 pm' },
      { ciudad: 'Juneau, Alaska', dia: 'Día 3', nota: 'Puerto · 7:00 am – 9:00 pm' },
      { ciudad: 'Skagway, Alaska', dia: 'Día 4', nota: 'Puerto · 7:00 am – 7:00 pm' },
      { ciudad: 'Glaciar Hubbard', dia: 'Día 5', nota: 'Navegación por el glaciar' },
      { ciudad: 'Ketchikan, Alaska', dia: 'Día 6', nota: 'Puerto · 7:00 am – 1:00 pm' },
      { ciudad: 'Seattle, Washington', dia: 'Día 8 · Regreso', nota: 'Desembarque hasta las 9:00 am' },
    ],
    barco: {
      nombre: 'Carnival Spirit',
      pasajeros: 2124,
      cubiertas: 12,
      ano: 2001,
      longitud: 293,
      features: [
        'Cubierta de observación para glaciares',
        'Guías de naturaleza a bordo',
        'Excursiones de avistamiento de ballenas',
        'Restaurante especializado en mariscos',
        'Programa de charlas sobre Alaska',
        'Zona de kayak y actividades',
      ],
    },
    cabinas: [
      { tipo: 'Interior', precio: 899, descripcion: 'Cabina cómoda, perfecta para quienes van a explorar todo el día.' },
      { tipo: 'Exterior', precio: 999, descripcion: 'Ventana para ver los paisajes de Alaska desde tu cabina.' },
      { tipo: 'Balcón', precio: 1199, descripcion: 'Balcón privado ideal para fotografiar glaciares y fauna.' },
    ],
    resenas: [
      { autor: 'Diana R.', fecha: 'ago 2024', estrellas: 5, texto: 'Ver el Glaciar Hubbard desde el barco fue la experiencia de mi vida. Vimos orcas, ballenas jorobadas y osos. Completamente recomendado.' },
      { autor: 'Fernando S.', fecha: 'jul 2024', estrellas: 3, texto: 'El itinerario es espectacular pero el barco es el más antiguo de los tres que hemos tomado. Las instalaciones podrían mejorar.' },
    ],
  },
])

// ─── COMPUTED ────────────────────────────────────────────────────────────────
const crucero = computed(() =>
  todosLosCruceros.value.find(c => c.id === Number(route.params.id))
)

const cabinaSeleccionada = ref(null)

const precioActual = computed(() => {
  if (!crucero.value) return 0
  if (cabinaSeleccionada.value) {
    const cab = crucero.value.cabinas.find(c => c.tipo === cabinaSeleccionada.value)
    return cab ? cab.precio : crucero.value.precio_por_persona
  }
  return crucero.value.precio_por_persona
})

const amenidades = computed(() => {
  if (!crucero.value) return []
  return [
    { label: 'Todo incluido (comidas y bebidas)', incluido: crucero.value.todo_incluido },
    { label: 'WiFi a bordo', incluido: crucero.value.wifi },
    { label: 'Excursiones opcionales', incluido: crucero.value.excursiones },
    { label: 'Cancelación gratuita', incluido: crucero.value.cancelacion },
    { label: 'Propinas incluidas', incluido: crucero.value.todo_incluido },
    { label: 'Traslado al puerto', incluido: false },
  ]
})

const galeria = computed(() => {
  // Imágenes extra para los thumbnails
  const extras = [
    'https://images.unsplash.com/photo-1599640842225-85d111c60e6b?w=300&q=80',
    'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=300&q=80',
    'https://images.unsplash.com/photo-1513407030348-c983a97b98d8?w=300&q=80',
  ]
  return extras
})

// ─── MÉTODOS ─────────────────────────────────────────────────────────────────
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
/* ── Layout base ─────────────────────────────────────────────────────────── */
.detalle-page {
  max-width: 1100px;
  margin: 0 auto;
  padding: 24px 16px 60px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
}

.breadcrumb {
  margin-bottom: 16px;
}

.btn-back {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: none;
  border: none;
  cursor: pointer;
  font-size: 14px;
  color: #265073;
  font-weight: 500;
  padding: 0;
}
.btn-back:hover { text-decoration: underline; }

.detalle-layout {
  display: grid;
  grid-template-columns: 1fr 300px;
  gap: 28px;
  align-items: start;
}

/* ── Header ──────────────────────────────────────────────────────────────── */
.detalle-header {
  margin-bottom: 18px;
}

.linea-nombre {
  font-size: 12px;
  font-weight: 700;
  color: #265073;
  text-transform: uppercase;
  letter-spacing: 0.6px;
  margin: 0 0 4px;
}

.crucero-titulo {
  font-size: 24px;
  font-weight: 700;
  color: #1a1a1a;
  margin: 0 0 10px;
  line-height: 1.25;
}

.header-badges {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.badge {
  font-size: 12px;
  font-weight: 600;
  padding: 4px 12px;
  border-radius: 20px;
}
.badge-blue  { background: #e8f0f7; color: #265073; }
.badge-green { background: #e6f4ec; color: #1a7f4b; }

/* ── Galería ─────────────────────────────────────────────────────────────── */
.galeria {
  margin-bottom: 20px;
}

.galeria-main {
  position: relative;
  margin-bottom: 8px;
}

.img-main {
  width: 100%;
  height: 320px;
  object-fit: cover;
  border-radius: 14px;
}

.btn-favorito {
  position: absolute;
  top: 12px;
  right: 12px;
  width: 38px;
  height: 38px;
  background: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(0,0,0,0.15);
  color: #ff385c;
  transition: transform 0.2s;
}
.btn-favorito:hover { transform: scale(1.1); }
.btn-favorito.activo svg { fill: #ff385c; }

.galeria-thumbs {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
}

.img-thumb {
  width: 100%;
  height: 90px;
  object-fit: cover;
  border-radius: 8px;
  cursor: pointer;
  transition: opacity 0.2s;
}
.img-thumb:hover { opacity: 0.85; }

/* ── Secciones ───────────────────────────────────────────────────────────── */
.seccion-card {
  border: 0.5px solid #dadce0;
  border-radius: 14px;
  padding: 20px;
  background: #fff;
  margin-bottom: 16px;
}

.seccion-titulo {
  font-size: 17px;
  font-weight: 700;
  color: #1a1a1a;
  margin: 0 0 16px;
}

/* ── Itinerario ──────────────────────────────────────────────────────────── */
.itinerario {
  display: flex;
  flex-direction: column;
}

.parada {
  display: flex;
  gap: 14px;
}

.parada-linea {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 16px;
  flex-shrink: 0;
}

.parada-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: #b0c4d4;
  flex-shrink: 0;
  margin-top: 3px;
}
.dot-primario { background: #265073; width: 12px; height: 12px; }

.parada-connector {
  width: 2px;
  flex: 1;
  min-height: 20px;
  background: #d8e6f0;
  margin: 3px 0;
}

.parada-info {
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  gap: 8px;
  padding-bottom: 14px;
}

.parada-ciudad {
  font-size: 14px;
  font-weight: 600;
  color: #1a1a1a;
}

.parada-dia {
  font-size: 12px;
  color: #265073;
  font-weight: 500;
}

.parada-nota {
  font-size: 12px;
  color: #888;
  width: 100%;
  margin-top: -4px;
}

/* ── Barco ───────────────────────────────────────────────────────────────── */
.barco-metrics {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;
  margin-bottom: 16px;
}

.metric {
  background: #f4f7fa;
  border-radius: 10px;
  padding: 12px 8px;
  text-align: center;
}

.metric-num {
  display: block;
  font-size: 20px;
  font-weight: 700;
  color: #265073;
}

.metric-lbl {
  display: block;
  font-size: 11px;
  color: #888;
  margin-top: 2px;
}

.barco-features {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.feature-pill {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  font-size: 12px;
  color: #444;
  background: #f0f4f8;
  border-radius: 20px;
  padding: 5px 12px;
}

/* ── Cabinas ─────────────────────────────────────────────────────────────── */
.cabinas-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
}

.cabina-card {
  border: 1.5px solid #dadce0;
  border-radius: 12px;
  padding: 14px;
  cursor: pointer;
  transition: border-color 0.2s, background 0.2s;
}
.cabina-card:hover { border-color: #265073; }
.cabina-selected { border-color: #265073 !important; background: #f0f6fb; }

.cabina-tipo {
  font-size: 14px;
  font-weight: 700;
  color: #1a1a1a;
  margin-bottom: 4px;
}

.cabina-precio {
  font-size: 22px;
  font-weight: 700;
  color: #265073;
  margin-bottom: 4px;
}

.cabina-por {
  font-size: 13px;
  color: #888;
  font-weight: 400;
}

.cabina-desc {
  font-size: 12px;
  color: #666;
  line-height: 1.4;
}

/* ── Amenidades ──────────────────────────────────────────────────────────── */
.amenidades-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
}

.amenidad-row {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  color: #333;
}

.amenidad-no { color: #aaa; }

/* ── Reseñas ─────────────────────────────────────────────────────────────── */
.rating-header {
  display: flex;
  align-items: center;
  gap: 14px;
  margin-bottom: 18px;
}

.rating-big {
  font-size: 22px;
  font-weight: 700;
  color: #fff;
  padding: 8px 14px;
  border-radius: 8px;
}
.rating-excelente { background: #1a7f4b; }
.rating-bueno     { background: #2e7d32; }
.rating-regular   { background: #f57c00; }

.rating-label-big {
  font-size: 16px;
  font-weight: 700;
  color: #1a1a1a;
}

.rating-count-big {
  font-size: 12px;
  color: #888;
}

.resenas-lista {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.resena {
  border-top: 0.5px solid #e8eaed;
  padding-top: 14px;
}

.resena-header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 6px;
}

.resena-avatar {
  width: 34px;
  height: 34px;
  border-radius: 50%;
  background: #265073;
  color: #fff;
  font-size: 14px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.resena-autor {
  font-size: 13px;
  font-weight: 600;
  color: #1a1a1a;
}

.resena-fecha {
  font-size: 11px;
  color: #999;
}

.resena-stars {
  margin-left: auto;
}

.star { color: #f0a500; font-size: 14px; }
.star-off { color: #ddd; }

.resena-texto {
  font-size: 13px;
  color: #555;
  line-height: 1.5;
}

/* ── Card precio sticky ──────────────────────────────────────────────────── */
.col-sticky {
  position: sticky;
  top: 24px;
}

.precio-card {
  border: 0.5px solid #dadce0;
  border-radius: 14px;
  padding: 20px;
  background: #fff;
  box-shadow: 0 2px 12px rgba(0,0,0,0.07);
}

.precio-desde {
  font-size: 11px;
  color: #888;
}

.precio-monto {
  font-size: 32px;
  font-weight: 700;
  color: #1a1a1a;
  line-height: 1.1;
}

.precio-sub {
  font-size: 12px;
  color: #888;
  margin-bottom: 4px;
}

.precio-antes-row {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  margin-bottom: 4px;
}

.precio-tachado {
  text-decoration: line-through;
  color: #bbb;
}

.precio-total-txt {
  color: #666;
}

.precio-sep {
  height: 0.5px;
  background: #e8eaed;
  margin: 12px 0;
}

.precio-detalle {
  display: flex;
  align-items: center;
  gap: 7px;
  font-size: 12px;
  color: #666;
  margin-bottom: 6px;
}

.cabina-sel-info {
  font-size: 13px;
  color: #265073;
  background: #f0f6fb;
  border-radius: 8px;
  padding: 8px 10px;
  margin-bottom: 10px;
}

.btn-reservar {
  width: 100%;
  background: #265073;
  color: #fff;
  border: none;
  border-radius: 25px;
  padding: 12px;
  font-size: 15px;
  font-weight: 700;
  cursor: pointer;
  transition: background 0.2s;
  margin-top: 4px;
}
.btn-reservar:hover { background: #1a3d5c; }

.btn-sub {
  font-size: 11px;
  color: #1a7f4b;
  text-align: center;
  margin-top: 8px;
}

/* ── Not found ───────────────────────────────────────────────────────────── */
.not-found {
  text-align: center;
  padding: 80px 0;
  color: #888;
}

/* ── Responsive ──────────────────────────────────────────────────────────── */
@media (max-width: 768px) {
  .detalle-layout {
    grid-template-columns: 1fr;
  }
  .col-sticky {
    position: static;
    order: -1;
  }
  .barco-metrics {
    grid-template-columns: repeat(2, 1fr);
  }
  .cabinas-grid {
    grid-template-columns: 1fr;
  }
  .amenidades-grid {
    grid-template-columns: 1fr;
  }
}
</style>