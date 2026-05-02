<template>
  <div class="main-container">
    <Header />

    <div class="detalle-page">
      <!-- Breadcrumb -->
      <div class="breadcrumb">
        <button class="btn-back" @click="router.back()">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="15 18 9 12 15 6"/></svg>
          Volver
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
              <img :src="crucero.imagen" :alt="crucero.nombre" class="img-main" />
            </div>
            <div class="galeria-thumbs">
              <img v-for="(img, i) in galeria" :key="i" :src="img" :alt="`Foto ${i+1}`" class="img-thumb" />
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

      <!-- ═══════════════════════════════════════════════════════════
           MODAL DE RESERVA
      ════════════════════════════════════════════════════════════ -->
      <Teleport to="body">
        <Transition name="modal-fade">
          <div v-if="modalAbierto" class="modal-overlay" @click.self="cerrarModal">
            <div class="modal-card" role="dialog" aria-modal="true">

              <!-- Header del modal -->
              <div class="modal-header">
                <div class="modal-header-info">
                  <p class="modal-linea">{{ crucero?.linea }}</p>
                  <h2 class="modal-titulo">{{ crucero?.nombre }}</h2>
                </div>
                <button class="modal-cerrar" @click="cerrarModal" aria-label="Cerrar">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                  </svg>
                </button>
              </div>

              <!-- Barra de progreso de pasos -->
              <div class="modal-steps">
                <div
                  v-for="(paso, i) in pasos"
                  :key="i"
                  class="step-item"
                  :class="{
                    'step-active':    pasoActual === i,
                    'step-done':      pasoActual > i,
                    'step-upcoming':  pasoActual < i
                  }"
                >
                  <div class="step-circle">
                    <svg v-if="pasoActual > i" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
                      <polyline points="20 6 9 17 4 12"/>
                    </svg>
                    <span v-else>{{ i + 1 }}</span>
                  </div>
                  <span class="step-label">{{ paso }}</span>
                  <div v-if="i < pasos.length - 1" class="step-line" :class="{ 'step-line-done': pasoActual > i }"></div>
                </div>
              </div>

              <!-- ── PASO 1: Datos del pasajero ── -->
              <Transition name="step-fade" mode="out-in">
                <div v-if="pasoActual === 0" key="paso0" class="modal-body">
                  <div class="modal-section-title">
                    <div class="section-icon">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                    </div>
                    Datos del pasajero principal
                  </div>

                  <div class="form-row">
                    <div class="form-group">
                      <label class="form-label">Nombre <span class="req">*</span></label>
                      <input v-model="reserva.nombre" type="text" class="form-input" :class="{ 'input-error': errores.nombre }" placeholder="Ej: Carlos" />
                      <span v-if="errores.nombre" class="error-msg">Campo requerido</span>
                    </div>
                    <div class="form-group">
                      <label class="form-label">Apellido <span class="req">*</span></label>
                      <input v-model="reserva.apellido" type="text" class="form-input" :class="{ 'input-error': errores.apellido }" placeholder="Ej: Martínez" />
                      <span v-if="errores.apellido" class="error-msg">Campo requerido</span>
                    </div>
                  </div>

                  <div class="form-row">
                    <div class="form-group">
                      <label class="form-label">Correo electrónico <span class="req">*</span></label>
                      <input v-model="reserva.email" type="email" class="form-input" :class="{ 'input-error': errores.email }" placeholder="correo@ejemplo.com" />
                      <span v-if="errores.email" class="error-msg">Ingresa un email válido</span>
                    </div>
                    <div class="form-group">
                      <label class="form-label">Teléfono / WhatsApp <span class="req">*</span></label>
                      <input v-model="reserva.telefono" type="tel" class="form-input" :class="{ 'input-error': errores.telefono }" placeholder="+1 809 000 0000" />
                      <span v-if="errores.telefono" class="error-msg">Campo requerido</span>
                    </div>
                  </div>

                  <div class="form-row">
                    <div class="form-group">
                      <label class="form-label">N.º de pasaporte <span class="req">*</span></label>
                      <input v-model="reserva.pasaporte" type="text" class="form-input" :class="{ 'input-error': errores.pasaporte }" placeholder="AB123456" />
                      <span v-if="errores.pasaporte" class="error-msg">Campo requerido</span>
                    </div>
                    <div class="form-group">
                      <label class="form-label">Vencimiento del pasaporte <span class="req">*</span></label>
                      <input v-model="reserva.vencimientoPasaporte" type="date" class="form-input" :class="{ 'input-error': errores.vencimiento }" />
                      <span v-if="errores.vencimiento" class="error-msg">Campo requerido</span>
                    </div>
                  </div>

                  <div class="form-row">
                    <div class="form-group">
                      <label class="form-label">Fecha de nacimiento <span class="req">*</span></label>
                      <input v-model="reserva.fechaNacimiento" type="date" class="form-input" :class="{ 'input-error': errores.fechaNacimiento }" />
                      <span v-if="errores.fechaNacimiento" class="error-msg">Campo requerido</span>
                    </div>
                    <div class="form-group">
                      <label class="form-label">Nacionalidad <span class="req">*</span></label>
                      <select v-model="reserva.nacionalidad" class="form-input form-select" :class="{ 'input-error': errores.nacionalidad }">
                        <option value="">Selecciona...</option>
                        <option value="DO">República Dominicana</option>
                        <option value="US">Estados Unidos</option>
                        <option value="MX">México</option>
                        <option value="CO">Colombia</option>
                        <option value="VE">Venezuela</option>
                        <option value="AR">Argentina</option>
                        <option value="ES">España</option>
                        <option value="other">Otra</option>
                      </select>
                      <span v-if="errores.nacionalidad" class="error-msg">Campo requerido</span>
                    </div>
                  </div>

                  <div class="modal-section-title" style="margin-top: 24px;">
                    <div class="section-icon">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                    </div>
                    Composición del grupo
                  </div>

                  <div class="form-row">
                    <div class="form-group">
                      <label class="form-label">Adultos (12+)</label>
                      <div class="counter-group">
                        <button class="counter-btn" @click="reserva.adultos = Math.max(1, reserva.adultos - 1)">−</button>
                        <span class="counter-val">{{ reserva.adultos }}</span>
                        <button class="counter-btn" @click="reserva.adultos++">+</button>
                      </div>
                    </div>
                    <div class="form-group">
                      <label class="form-label">Niños (2–11)</label>
                      <div class="counter-group">
                        <button class="counter-btn" @click="reserva.ninos = Math.max(0, reserva.ninos - 1)">−</button>
                        <span class="counter-val">{{ reserva.ninos }}</span>
                        <button class="counter-btn" @click="reserva.ninos++">+</button>
                      </div>
                    </div>
                    <div class="form-group">
                      <label class="form-label">Bebés (0–1)</label>
                      <div class="counter-group">
                        <button class="counter-btn" @click="reserva.bebes = Math.max(0, reserva.bebes - 1)">−</button>
                        <span class="counter-val">{{ reserva.bebes }}</span>
                        <button class="counter-btn" @click="reserva.bebes++">+</button>
                      </div>
                    </div>
                  </div>

                  <div class="pasajeros-tag">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                    {{ totalPasajeros }} pasajero{{ totalPasajeros !== 1 ? 's' : '' }} en total
                  </div>
                </div>
              </Transition>

              <!-- ── PASO 2: Cabina ── -->
              <Transition name="step-fade" mode="out-in">
                <div v-if="pasoActual === 1" key="paso1" class="modal-body">
                  <div class="modal-section-title">
                    <div class="section-icon">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>
                    </div>
                    Selecciona tu cabina
                  </div>

                  <div class="cabinas-modal-grid">
                    <div
                      v-for="cabina in crucero?.cabinas"
                      :key="cabina.tipo"
                      class="cabina-modal-card"
                      :class="{ 'cabina-modal-sel': reserva.cabina === cabina.tipo }"
                      @click="reserva.cabina = cabina.tipo"
                    >
                      <div class="cabina-modal-check" v-if="reserva.cabina === cabina.tipo">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg>
                      </div>
                      <div class="cabina-modal-header">
                        <div class="cabina-modal-tipo">{{ cabina.tipo }}</div>
                        <div class="cabina-modal-precio">${{ cabina.precio }}<span>/p.</span></div>
                      </div>
                      <div class="cabina-modal-desc">{{ cabina.descripcion }}</div>
                      <div class="cabina-modal-total" v-if="reserva.cabina === cabina.tipo">
                        Total: ${{ (cabina.precio * (reserva.adultos + reserva.ninos)).toLocaleString() }}
                      </div>
                    </div>
                  </div>

                  <div class="info-nota">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#265073" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                    Los precios son por persona. Los bebés no generan cargo adicional.
                  </div>
                </div>
              </Transition>

              <!-- ── PASO 3: Pago ── -->
              <Transition name="step-fade" mode="out-in">
                <div v-if="pasoActual === 2" key="paso2" class="modal-body">
                  <div class="modal-section-title">
                    <div class="section-icon">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>
                    </div>
                    Resumen de tu reserva
                  </div>

                  <div class="resumen-box">
                    <div class="resumen-row">
                      <span class="resumen-key">Crucero</span>
                      <span class="resumen-val">{{ crucero?.nombre }}</span>
                    </div>
                    <div class="resumen-row">
                      <span class="resumen-key">Pasajeros</span>
                      <span class="resumen-val">{{ reserva.adultos }} adulto{{ reserva.adultos !== 1 ? 's' : '' }}{{ reserva.ninos ? `, ${reserva.ninos} niño${reserva.ninos !== 1 ? 's' : ''}` : '' }}{{ reserva.bebes ? `, ${reserva.bebes} bebé${reserva.bebes !== 1 ? 's' : ''}` : '' }}</span>
                    </div>
                    <div class="resumen-row">
                      <span class="resumen-key">Cabina</span>
                      <span class="resumen-val">{{ reserva.cabina }}</span>
                    </div>
                    <div class="resumen-row">
                      <span class="resumen-key">Salida</span>
                      <span class="resumen-val">{{ crucero?.fecha_salida }}</span>
                    </div>
                    <div class="resumen-row">
                      <span class="resumen-key">Regreso</span>
                      <span class="resumen-val">{{ crucero?.fecha_regreso }}</span>
                    </div>
                    <div class="resumen-sep"></div>
                    <div class="resumen-row resumen-total-row">
                      <span>Total estimado</span>
                      <span class="resumen-total-val">${{ totalReserva.toLocaleString() }}</span>
                    </div>
                  </div>

                  <div class="modal-section-title" style="margin-top: 20px;">
                    <div class="section-icon">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>
                    </div>
                    Método de pago
                  </div>

                  <div class="pago-opciones">
                    <label class="pago-opcion" :class="{ 'pago-sel': reserva.metodoPago === 'tarjeta' }">
                      <input type="radio" v-model="reserva.metodoPago" value="tarjeta" />
                      <div class="pago-opcion-content">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>
                        <div>
                          <div class="pago-name">Tarjeta de crédito / débito</div>
                          <div class="pago-sub">Visa, Mastercard, Amex</div>
                        </div>
                      </div>
                    </label>
                    <label class="pago-opcion" :class="{ 'pago-sel': reserva.metodoPago === 'transferencia' }">
                      <input type="radio" v-model="reserva.metodoPago" value="transferencia" />
                      <div class="pago-opcion-content">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="17 1 21 5 17 9"/><path d="M3 11V9a4 4 0 0 1 4-4h14"/><polyline points="7 23 3 19 7 15"/><path d="M21 13v2a4 4 0 0 1-4 4H3"/></svg>
                        <div>
                          <div class="pago-name">Transferencia bancaria</div>
                          <div class="pago-sub">Confirmación en 1–2 días hábiles</div>
                        </div>
                      </div>
                    </label>
                    <label class="pago-opcion" :class="{ 'pago-sel': reserva.metodoPago === 'deposito' }">
                      <input type="radio" v-model="reserva.metodoPago" value="deposito" />
                      <div class="pago-opcion-content">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
                        <div>
                          <div class="pago-name">Depósito en efectivo</div>
                          <div class="pago-sub">Western Union, punto autorizado</div>
                        </div>
                      </div>
                    </label>
                  </div>

                  <div class="solicitudes-row">
                    <label class="form-label">Solicitudes especiales (opcional)</label>
                    <textarea v-model="reserva.solicitudes" class="form-input form-textarea" rows="3" placeholder="Dieta especial, accesibilidad, celebraciones, etc."></textarea>
                  </div>

                  <label class="check-terminos" :class="{ 'check-error': errores.terminos }">
                    <input type="checkbox" v-model="reserva.terminos" />
                    <span>Acepto los <a href="#" @click.prevent>términos y condiciones</a> y la <a href="#" @click.prevent>política de privacidad</a></span>
                  </label>
                  <span v-if="errores.terminos" class="error-msg" style="display:block; margin-top: 4px;">Debes aceptar los términos para continuar</span>
                </div>
              </Transition>

              <!-- ── PASO 4: Confirmación ── -->
              <Transition name="step-fade" mode="out-in">
                <div v-if="pasoActual === 3" key="paso3" class="modal-body modal-exito">
                  <div class="exito-icono">
                    <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="#1a7f4b" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                  </div>
                  <h3 class="exito-titulo">¡Reserva recibida!</h3>
                  <p class="exito-sub">Te contactaremos en menos de 24 horas para confirmar los detalles.</p>
                  <div class="exito-codigo">
                    <span class="codigo-label">Tu código de reserva</span>
                    <span class="codigo-val">#CR-{{ codigoReserva }}</span>
                  </div>
                  <div class="exito-detalle">
                    <div class="exito-row">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#265073" stroke-width="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                      Confirmación enviada a <strong>{{ reserva.email }}</strong>
                    </div>
                    <div class="exito-row" v-if="reserva.telefono">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#265073" stroke-width="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 2.18h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 9.91a16 16 0 0 0 6 6l.92-.92a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 21.73 17z"/></svg>
                      Te llamaremos al <strong>{{ reserva.telefono }}</strong>
                    </div>
                  </div>
                  <button class="btn-reservar" style="margin-top: 24px;" @click="cerrarModal">Cerrar</button>
                </div>
              </Transition>

              <!-- Footer del modal -->
              <div v-if="pasoActual < 3" class="modal-footer">
                <button class="btn-modal-sec" v-if="pasoActual > 0" @click="pasoActual--">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="15 18 9 12 15 6"/></svg>
                  Atrás
                </button>
                <div v-else></div>
                <div class="footer-right">
                  <span class="footer-paso-label">Paso {{ pasoActual + 1 }} de {{ pasos.length }}</span>
                  <button class="btn-modal-pri" @click="avanzarPaso">
                    {{ pasoActual === 2 ? 'Confirmar reserva' : 'Continuar' }}
                    <svg v-if="pasoActual < 2" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="9 18 15 12 9 6"/></svg>
                  </button>
                </div>
              </div>

            </div>
          </div>
        </Transition>
      </Teleport>

    </div> <!-- Cierre de detalle-page -->
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import Header from "../components/Header.vue"

const route = useRoute()
const router = useRouter()

// ─── DATA ────────────────────────────────────────────────────────────────────
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
      features: ['Piscinas y toboganes acuáticos','Zona infantil Adventure Ocean','Casino a bordo','Restaurantes de especialidad','Teatro y espectáculos','Spa y gimnasio'],
    },
    cabinas: [
      { tipo: 'Interior', precio: 489, descripcion: 'Cómoda cabina sin ventana, ideal para quienes pasan poco tiempo en el cuarto.' },
      { tipo: 'Exterior', precio: 589, descripcion: 'Ventana fija con vista al mar para disfrutar de la luz natural.' },
      { tipo: 'Balcón', precio: 689, descripcion: 'Balcón privado para admirar los amaneceres y atardeceres.' },
      { tipo: 'Suite', precio: 1199, descripcion: 'Espacio amplio con sala de estar, jacuzzi y mayordomía.' },
    ],
    resenas: [
      { autor: 'Carlos M.', fecha: 'mar 2025', estrellas: 5, texto: 'Viaje increíble con la familia. Perfect Day at CocoCay superó todas las expectativas.' },
      { autor: 'Ana P.', fecha: 'feb 2025', estrellas: 4, texto: 'Muy buena experiencia en general. Nassau es hermoso.' },
      { autor: 'Roberto G.', fecha: 'ene 2025', estrellas: 5, texto: 'Perfecta relación calidad-precio. Ya tenemos ganas de repetir.' },
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
      features: ['Bar de hielo (Ice Bar)','Espectáculos de Broadway','Restaurantes todo incluido','Piscinas interiores y exteriores','Spa con sauna y baño turco','Zona de deportes acuáticos'],
    },
    cabinas: [
      { tipo: 'Studio', precio: 1290, descripcion: 'Cabina individual con lounge privado exclusivo para viajeros solos.' },
      { tipo: 'Interior', precio: 1390, descripcion: 'Cabina doble cómoda sin ventana.' },
      { tipo: 'Balcón', precio: 1590, descripcion: 'Balcón privado con vistas al Mediterráneo.' },
      { tipo: 'Suite Haven', precio: 2499, descripcion: 'Complejo privado con piscina, restaurante y mayordomo.' },
    ],
    resenas: [
      { autor: 'María L.', fecha: 'abr 2025', estrellas: 5, texto: 'El Mediterráneo desde el mar es una experiencia única. Santorini al amanecer fue mágico.' },
      { autor: 'Javier T.', fecha: 'mar 2025', estrellas: 4, texto: 'Excelente itinerario, cada puerto vale la pena. Los espectáculos de Broadway son sorprendentemente buenos.' },
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
      features: ['Cubierta de observación para glaciares','Guías de naturaleza a bordo','Excursiones de avistamiento de ballenas','Restaurante especializado en mariscos','Programa de charlas sobre Alaska','Zona de kayak y actividades'],
    },
    cabinas: [
      { tipo: 'Interior', precio: 899, descripcion: 'Cabina cómoda, perfecta para quienes van a explorar todo el día.' },
      { tipo: 'Exterior', precio: 999, descripcion: 'Ventana para ver los paisajes de Alaska desde tu cabina.' },
      { tipo: 'Balcón', precio: 1199, descripcion: 'Balcón privado ideal para fotografiar glaciares y fauna.' },
    ],
    resenas: [
      { autor: 'Diana R.', fecha: 'ago 2024', estrellas: 5, texto: 'Ver el Glaciar Hubbard desde el barco fue la experiencia de mi vida. Vimos orcas y ballenas jorobadas.' },
      { autor: 'Fernando S.', fecha: 'jul 2024', estrellas: 3, texto: 'El itinerario es espectacular pero el barco es el más antiguo de los tres que hemos tomado.' },
    ],
  },
])

// ─── COMPUTED ─────────────────────────────────────────────────────────────────
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

const galeria = computed(() => [
  'https://images.unsplash.com/photo-1599640842225-85d111c60e6b?w=300&q=80',
  'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=300&q=80',
  'https://images.unsplash.com/photo-1513407030348-c983a97b98d8?w=300&q=80',
])

// ─── HELPERS ──────────────────────────────────────────────────────────────────
function ratingClass(pct) {
  if (pct >= 90) return 'rating-excelente'
  if (pct >= 70) return 'rating-bueno'
  return 'rating-regular'
}

// ─── MODAL RESERVA ────────────────────────────────────────────────────────────
const modalAbierto = ref(false)
const pasoActual  = ref(0)
const pasos       = ['Pasajeros', 'Cabina', 'Pago']
const codigoReserva = ref('')

const reserva = ref({
  nombre: '', apellido: '', email: '', telefono: '',
  pasaporte: '', vencimientoPasaporte: '', fechaNacimiento: '', nacionalidad: '',
  adultos: 2, ninos: 0, bebes: 0,
  cabina: '', metodoPago: 'tarjeta', terminos: false, solicitudes: ''
})

const errores = ref({
  nombre: false, apellido: false, email: false, telefono: false,
  pasaporte: false, vencimiento: false, fechaNacimiento: false, nacionalidad: false,
  terminos: false
})

const totalPasajeros = computed(() =>
  reserva.value.adultos + reserva.value.ninos + reserva.value.bebes
)

const totalReserva = computed(() => {
  if (!crucero.value) return 0
  const cab = crucero.value.cabinas.find(c => c.tipo === reserva.value.cabina)
  const precio = cab ? cab.precio : crucero.value.precio_por_persona
  return precio * (reserva.value.adultos + reserva.value.ninos)
})

function abrirModal() {
  reserva.value.cabina = cabinaSeleccionada.value || crucero.value?.cabinas[0]?.tipo || ''
  pasoActual.value = 0
  // Limpiar errores
  Object.keys(errores.value).forEach(k => errores.value[k] = false)
  modalAbierto.value = true
  document.body.style.overflow = 'hidden'
}

function cerrarModal() {
  modalAbierto.value = false
  document.body.style.overflow = ''
}

function validarPaso() {
  // Limpiar errores previos
  Object.keys(errores.value).forEach(k => errores.value[k] = false)

  if (pasoActual.value === 0) {
    let ok = true
    if (!reserva.value.nombre.trim())            { errores.value.nombre = true; ok = false }
    if (!reserva.value.apellido.trim())          { errores.value.apellido = true; ok = false }
    if (!reserva.value.email.includes('@'))      { errores.value.email = true; ok = false }
    if (!reserva.value.telefono.trim())          { errores.value.telefono = true; ok = false }
    if (!reserva.value.pasaporte.trim())         { errores.value.pasaporte = true; ok = false }
    if (!reserva.value.vencimientoPasaporte)     { errores.value.vencimiento = true; ok = false }
    if (!reserva.value.fechaNacimiento)          { errores.value.fechaNacimiento = true; ok = false }
    if (!reserva.value.nacionalidad)             { errores.value.nacionalidad = true; ok = false }
    return ok
  }

  if (pasoActual.value === 1) {
    return !!reserva.value.cabina
  }

  if (pasoActual.value === 2) {
    if (!reserva.value.terminos) {
      errores.value.terminos = true
      return false
    }
    return true
  }

  return true
}

function avanzarPaso() {
  if (!validarPaso()) return

  if (pasoActual.value < 2) {
    pasoActual.value++
  } else {
    codigoReserva.value = Math.random().toString(36).substring(2, 8).toUpperCase()
    pasoActual.value = 3
  }
}
</script>

<style scoped>
/* ── Base ─────────────────────────────────────────────────────────────────── */
.main-container {
  background-color: #ffffff;
  min-height: 100vh;
}

.detalle-page {
  max-width: 1100px;
  width: 100%;
  margin: 0 auto;
  padding: 24px 16px 60px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
}

.breadcrumb { margin-top: 20px; margin-bottom: 16px; }

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
  transform: translateY(30px);
}
.btn-back:hover { text-decoration: underline; }

.detalle-layout {
  display: grid;
  grid-template-columns: 1fr 300px;
  gap: 28px;
  align-items: start;
}

/* ── Detalle header ──────────────────────────────────────────────────────── */
.detalle-header { margin-top: 40px; margin-bottom: 18px; }
.linea-nombre { font-size: 12px; font-weight: 700; color: #265073; text-transform: uppercase; letter-spacing: 0.6px; margin: 0 0 4px; }
.crucero-titulo { font-size: 24px; font-weight: 700; color: #1a1a1a; margin: 0 0 10px; line-height: 1.25; }
.header-badges { display: flex; gap: 8px; flex-wrap: wrap; }
.badge { font-size: 12px; font-weight: 600; padding: 4px 12px; border-radius: 20px; }
.badge-blue  { background: #e8f0f7; color: #265073; }
.badge-green { background: #e6f4ec; color: #1a7f4b; }

/* ── Galería ─────────────────────────────────────────────────────────────── */
.galeria { margin-bottom: 20px; }
.galeria-main { position: relative; margin-bottom: 8px; }
.img-main { width: 100%; height: 320px; object-fit: cover; border-radius: 14px; }
.galeria-thumbs { display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; }
.img-thumb { width: 100%; height: 90px; object-fit: cover; border-radius: 8px; cursor: pointer; transition: opacity 0.2s; }
.img-thumb:hover { opacity: 0.85; }

/* ── Secciones ───────────────────────────────────────────────────────────── */
.seccion-card { border: 0.5px solid #dadce0; border-radius: 14px; padding: 20px; background: #fff; margin-bottom: 16px; }
.seccion-titulo { font-size: 17px; font-weight: 700; color: #1a1a1a; margin: 0 0 16px; }

/* ── Itinerario ──────────────────────────────────────────────────────────── */
.itinerario { display: flex; flex-direction: column; }
.parada { display: flex; gap: 14px; }
.parada-linea { display: flex; flex-direction: column; align-items: center; width: 16px; flex-shrink: 0; }
.parada-dot { width: 10px; height: 10px; border-radius: 50%; background: #b0c4d4; flex-shrink: 0; margin-top: 3px; }
.dot-primario { background: #265073; width: 12px; height: 12px; }
.parada-connector { width: 2px; flex: 1; min-height: 20px; background: #d8e6f0; margin: 3px 0; }
.parada-info { display: flex; flex-wrap: wrap; align-items: baseline; gap: 8px; padding-bottom: 14px; }
.parada-ciudad { font-size: 14px; font-weight: 600; color: #1a1a1a; }
.parada-dia { font-size: 12px; color: #265073; font-weight: 500; }
.parada-nota { font-size: 12px; color: #888; width: 100%; margin-top: -4px; }

/* ── Barco ───────────────────────────────────────────────────────────────── */
.barco-metrics { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; margin-bottom: 16px; }
.metric { background: #f4f7fa; border-radius: 10px; padding: 12px 8px; text-align: center; }
.metric-num { display: block; font-size: 20px; font-weight: 700; color: #265073; }
.metric-lbl { display: block; font-size: 11px; color: #888; margin-top: 2px; }
.barco-features { display: flex; flex-wrap: wrap; gap: 8px; }
.feature-pill { display: inline-flex; align-items: center; gap: 5px; font-size: 12px; color: #444; background: #f0f4f8; border-radius: 20px; padding: 5px 12px; }

/* ── Cabinas ─────────────────────────────────────────────────────────────── */
.cabinas-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px; }
.cabina-card { border: 1.5px solid #dadce0; border-radius: 12px; padding: 14px; cursor: pointer; transition: border-color 0.2s, background 0.2s; }
.cabina-card:hover { border-color: #265073; }
.cabina-selected { border-color: #265073 !important; background: #f0f6fb; }
.cabina-tipo { font-size: 14px; font-weight: 700; color: #1a1a1a; margin-bottom: 4px; }
.cabina-precio { font-size: 22px; font-weight: 700; color: #265073; margin-bottom: 4px; }
.cabina-por { font-size: 13px; color: #888; font-weight: 400; }
.cabina-desc { font-size: 12px; color: #666; line-height: 1.4; }

/* ── Amenidades ──────────────────────────────────────────────────────────── */
.amenidades-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
.amenidad-row { display: flex; align-items: center; gap: 8px; font-size: 13px; color: #333; }
.amenidad-no { color: #aaa; }

/* ── Reseñas ─────────────────────────────────────────────────────────────── */
.rating-header { display: flex; align-items: center; gap: 14px; margin-bottom: 18px; }
.rating-big { font-size: 22px; font-weight: 700; color: #fff; padding: 8px 14px; border-radius: 8px; }
.rating-excelente { background: #1a7f4b; }
.rating-bueno     { background: #2e7d32; }
.rating-regular   { background: #f57c00; }
.rating-label-big { font-size: 16px; font-weight: 700; color: #1a1a1a; }
.rating-count-big { font-size: 12px; color: #888; }
.resenas-lista { display: flex; flex-direction: column; gap: 14px; }
.resena { border-top: 0.5px solid #e8eaed; padding-top: 14px; }
.resena-header { display: flex; align-items: center; gap: 10px; margin-bottom: 6px; }
.resena-avatar { width: 34px; height: 34px; border-radius: 50%; background: #265073; color: #fff; font-size: 14px; font-weight: 700; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.resena-autor { font-size: 13px; font-weight: 600; color: #1a1a1a; }
.resena-fecha { font-size: 11px; color: #999; }
.resena-stars { margin-left: auto; }
.star { color: #f0a500; font-size: 14px; }
.star-off { color: #ddd; }
.resena-texto { font-size: 13px; color: #555; line-height: 1.5; }

/* ── Precio sticky ───────────────────────────────────────────────────────── */
.col-sticky { position: sticky; top: 24px; }
.precio-card { border: 0.5px solid #dadce0; border-radius: 14px; padding: 20px; background: #fff; box-shadow: 0 2px 12px rgba(0,0,0,0.07); }
.precio-desde { font-size: 11px; color: #888; }
.precio-monto { font-size: 32px; font-weight: 700; color: #1a1a1a; line-height: 1.1; }
.precio-sub { font-size: 12px; color: #888; margin-bottom: 4px; }
.precio-antes-row { display: flex; align-items: center; gap: 8px; font-size: 13px; margin-bottom: 4px; }
.precio-tachado { text-decoration: line-through; color: #bbb; }
.precio-total-txt { color: #666; }
.precio-sep { height: 0.5px; background: #e8eaed; margin: 12px 0; }
.precio-detalle { display: flex; align-items: center; gap: 7px; font-size: 12px; color: #666; margin-bottom: 6px; }
.cabina-sel-info { font-size: 13px; color: #265073; background: #f0f6fb; border-radius: 8px; padding: 8px 10px; margin-bottom: 10px; }
.btn-reservar { width: 100%; background: #265073; color: #fff; border: none; border-radius: 25px; padding: 12px; font-size: 15px; font-weight: 700; cursor: pointer; transition: background 0.2s; margin-top: 4px; }
.btn-reservar:hover { background: #1a3d5c; }
.btn-sub { font-size: 11px; color: #1a7f4b; text-align: center; margin-top: 8px; }
.not-found { text-align: center; padding: 80px 0; color: #888; }

/* ══════════════════════════════════════════════════════════════════
   MODAL DE RESERVA
══════════════════════════════════════════════════════════════════ */

/* Transición del overlay */
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.25s ease;
}
.modal-fade-enter-active .modal-card,
.modal-fade-leave-active .modal-card {
  transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.25s ease;
}
.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}
.modal-fade-enter-from .modal-card {
  transform: translateY(40px) scale(0.96);
  opacity: 0;
}

/* Transición entre pasos */
.step-fade-enter-active,
.step-fade-leave-active {
  transition: opacity 0.18s ease, transform 0.18s ease;
}
.step-fade-enter-from { opacity: 0; transform: translateX(14px); }
.step-fade-leave-to   { opacity: 0; transform: translateX(-14px); }

/* Overlay */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(10, 20, 35, 0.55);
  backdrop-filter: blur(3px);
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
}

/* Card del modal */
.modal-card {
  background: #ffffff;
  border-radius: 20px;
  width: 100%;
  max-width: 580px;
  max-height: 90vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  box-shadow: 0 24px 80px rgba(0, 0, 0, 0.25);
}

/* Header del modal */
.modal-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  padding: 20px 24px 0;
  flex-shrink: 0;
}

.modal-header-info { flex: 1; min-width: 0; }

.modal-linea {
  font-size: 11px;
  font-weight: 700;
  color: #265073;
  text-transform: uppercase;
  letter-spacing: 0.7px;
  margin: 0 0 3px;
}

.modal-titulo {
  font-size: 17px;
  font-weight: 700;
  color: #1a1a1a;
  margin: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  line-height: 1.3;
}

.modal-cerrar {
  flex-shrink: 0;
  margin-left: 12px;
  width: 32px;
  height: 32px;
  background: #f4f6f8;
  border: none;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #555;
  transition: background 0.15s;
}
.modal-cerrar:hover { background: #e8eaed; }

/* Pasos */
.modal-steps {
  display: flex;
  align-items: center;
  padding: 16px 24px 4px;
  flex-shrink: 0;
  position: relative;
}

.step-item {
  display: flex;
  align-items: center;
  flex: 1;
  position: relative;
}

.step-circle {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 700;
  flex-shrink: 0;
  transition: background 0.3s, color 0.3s, border-color 0.3s;
  border: 2px solid #dadce0;
  background: #fff;
  color: #aaa;
  z-index: 1;
}

.step-active .step-circle {
  background: #265073;
  border-color: #265073;
  color: #fff;
  box-shadow: 0 0 0 4px rgba(38, 80, 115, 0.15);
}

.step-done .step-circle {
  background: #1a7f4b;
  border-color: #1a7f4b;
  color: #fff;
}

.step-label {
  font-size: 11px;
  font-weight: 600;
  color: #aaa;
  margin-left: 6px;
  white-space: nowrap;
  transition: color 0.3s;
}
.step-active .step-label { color: #265073; }
.step-done .step-label   { color: #1a7f4b; }

.step-line {
  flex: 1;
  height: 2px;
  background: #e0e0e0;
  margin: 0 8px;
  border-radius: 2px;
  transition: background 0.3s;
}
.step-line-done { background: #1a7f4b; }

/* Body scrollable */
.modal-body {
  flex: 1;
  overflow-y: auto;
  padding: 16px 24px 8px;
  scrollbar-width: thin;
  scrollbar-color: #d0d7df transparent;
}
.modal-body::-webkit-scrollbar { width: 4px; }
.modal-body::-webkit-scrollbar-thumb { background: #d0d7df; border-radius: 4px; }

/* Títulos de sección dentro del modal */
.modal-section-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  font-weight: 700;
  color: #1a1a1a;
  margin-bottom: 14px;
}

.section-icon {
  width: 28px;
  height: 28px;
  background: #e8f0f7;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #265073;
  flex-shrink: 0;
}

/* Formulario */
.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  margin-bottom: 12px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.form-label {
  font-size: 12px;
  font-weight: 600;
  color: #444;
}

.req { color: #e53935; }

.form-input {
  padding: 9px 12px;
  border: 1.5px solid #dadce0;
  border-radius: 10px;
  font-size: 13px;
  color: #1a1a1a;
  outline: none;
  transition: border-color 0.2s, box-shadow 0.2s;
  background: #fff;
  font-family: inherit;
}
.form-input:focus {
  border-color: #265073;
  box-shadow: 0 0 0 3px rgba(38, 80, 115, 0.1);
}
.input-error {
  border-color: #e53935 !important;
  box-shadow: 0 0 0 3px rgba(229, 57, 53, 0.1) !important;
}
.error-msg {
  font-size: 11px;
  color: #e53935;
  font-weight: 500;
}

.form-select { appearance: none; background-image: url("data:image/svg+xml,%3Csvg width='10' height='6' viewBox='0 0 10 6' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1L5 5L9 1' stroke='%23888' stroke-width='1.5' stroke-linecap='round'/%3E%3C/svg%3E"); background-repeat: no-repeat; background-position: right 12px center; padding-right: 32px; cursor: pointer; }

.form-textarea { resize: vertical; min-height: 72px; line-height: 1.5; }

/* Counter */
.counter-group {
  display: flex;
  align-items: center;
  gap: 0;
  border: 1.5px solid #dadce0;
  border-radius: 10px;
  overflow: hidden;
  width: fit-content;
}

.counter-btn {
  width: 36px;
  height: 36px;
  background: #f4f6f8;
  border: none;
  cursor: pointer;
  font-size: 18px;
  color: #444;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.15s;
  line-height: 1;
}
.counter-btn:hover { background: #e8eaed; }

.counter-val {
  min-width: 36px;
  text-align: center;
  font-size: 15px;
  font-weight: 700;
  color: #1a1a1a;
  padding: 0 8px;
}

.pasajeros-tag {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: #e8f0f7;
  color: #265073;
  font-size: 12px;
  font-weight: 600;
  padding: 6px 12px;
  border-radius: 20px;
  margin-top: 8px;
}

/* Cabinas modal */
.cabinas-modal-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
  margin-bottom: 14px;
}

.cabina-modal-card {
  border: 1.5px solid #dadce0;
  border-radius: 12px;
  padding: 14px;
  cursor: pointer;
  transition: border-color 0.2s, background 0.2s, box-shadow 0.2s;
  position: relative;
  overflow: hidden;
}
.cabina-modal-card:hover { border-color: #265073; box-shadow: 0 2px 8px rgba(38,80,115,0.12); }
.cabina-modal-sel {
  border-color: #265073 !important;
  background: #f0f6fb;
  box-shadow: 0 2px 12px rgba(38,80,115,0.15) !important;
}

.cabina-modal-check {
  position: absolute;
  top: 10px;
  right: 10px;
  width: 20px;
  height: 20px;
  background: #265073;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.cabina-modal-header {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  margin-bottom: 4px;
}

.cabina-modal-tipo {
  font-size: 14px;
  font-weight: 700;
  color: #1a1a1a;
}

.cabina-modal-precio {
  font-size: 17px;
  font-weight: 700;
  color: #265073;
}
.cabina-modal-precio span { font-size: 11px; color: #999; font-weight: 400; }

.cabina-modal-desc {
  font-size: 11px;
  color: #777;
  line-height: 1.4;
}

.cabina-modal-total {
  font-size: 11px;
  font-weight: 700;
  color: #1a7f4b;
  margin-top: 6px;
  background: #e6f4ec;
  padding: 3px 8px;
  border-radius: 6px;
  display: inline-block;
}

.info-nota {
  display: flex;
  align-items: flex-start;
  gap: 7px;
  font-size: 12px;
  color: #557a99;
  background: #eef4fa;
  border-radius: 8px;
  padding: 10px 12px;
}

/* Resumen */
.resumen-box {
  border: 1px solid #e8eaed;
  border-radius: 12px;
  overflow: hidden;
}

.resumen-row {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 10px 14px;
  font-size: 13px;
  gap: 12px;
}
.resumen-row:not(:last-child) { border-bottom: 0.5px solid #f0f2f4; }

.resumen-key { color: #777; flex-shrink: 0; }
.resumen-val { color: #1a1a1a; font-weight: 500; text-align: right; }

.resumen-sep { height: 1px; background: #e0e4e8; margin: 0; }

.resumen-total-row {
  background: #f4f7fa;
  font-weight: 700;
  font-size: 14px;
  color: #1a1a1a;
}
.resumen-total-val {
  font-size: 18px;
  font-weight: 800;
  color: #265073;
}

/* Pago */
.pago-opciones {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 14px;
}

.pago-opcion {
  display: flex;
  align-items: center;
  border: 1.5px solid #dadce0;
  border-radius: 12px;
  padding: 12px 14px;
  cursor: pointer;
  transition: border-color 0.2s, background 0.2s;
}
.pago-opcion:hover { border-color: #265073; }
.pago-sel { border-color: #265073 !important; background: #f0f6fb; }

.pago-opcion input[type="radio"] { display: none; }

.pago-opcion-content {
  display: flex;
  align-items: center;
  gap: 12px;
  color: #444;
  width: 100%;
}
.pago-sel .pago-opcion-content { color: #265073; }

.pago-name { font-size: 13px; font-weight: 600; color: #1a1a1a; }
.pago-sub  { font-size: 11px; color: #999; }

.solicitudes-row { margin-bottom: 14px; display: flex; flex-direction: column; gap: 5px; }

.check-terminos {
  display: flex;
  align-items: flex-start;
  gap: 9px;
  font-size: 12px;
  color: #555;
  cursor: pointer;
  line-height: 1.5;
}
.check-terminos input { margin-top: 2px; accent-color: #265073; flex-shrink: 0; }
.check-terminos a { color: #265073; }
.check-error { color: #e53935; }

/* Footer modal */
.modal-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 14px 24px 20px;
  border-top: 0.5px solid #e8eaed;
  flex-shrink: 0;
  background: #fff;
}

.footer-right {
  display: flex;
  align-items: center;
  gap: 12px;
}

.footer-paso-label {
  font-size: 12px;
  color: #aaa;
  font-weight: 500;
}

.btn-modal-sec {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  background: none;
  border: 1.5px solid #dadce0;
  border-radius: 25px;
  padding: 9px 18px;
  font-size: 13px;
  font-weight: 600;
  color: #555;
  cursor: pointer;
  transition: border-color 0.2s, color 0.2s;
}
.btn-modal-sec:hover { border-color: #265073; color: #265073; }

.btn-modal-pri {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: #265073;
  color: #fff;
  border: none;
  border-radius: 25px;
  padding: 10px 22px;
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
  transition: background 0.2s, transform 0.15s;
}
.btn-modal-pri:hover { background: #1a3d5c; transform: translateY(-1px); }
.btn-modal-pri:disabled { background: #b0c4d4; cursor: not-allowed; transform: none; }

/* Éxito */
.modal-exito {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 28px 24px 20px;
}

.exito-icono {
  width: 72px;
  height: 72px;
  background: #e6f4ec;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 16px;
}

.exito-titulo {
  font-size: 22px;
  font-weight: 800;
  color: #1a1a1a;
  margin: 0 0 8px;
}

.exito-sub {
  font-size: 14px;
  color: #666;
  margin: 0 0 18px;
  line-height: 1.5;
}

.exito-codigo {
  background: #f4f7fa;
  border-radius: 12px;
  padding: 12px 24px;
  margin-bottom: 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}

.codigo-label { font-size: 11px; color: #888; font-weight: 500; text-transform: uppercase; letter-spacing: 0.5px; }
.codigo-val { font-size: 24px; font-weight: 800; color: #265073; letter-spacing: 2px; }

.exito-detalle {
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 100%;
  background: #f9fafb;
  border-radius: 10px;
  padding: 12px 16px;
}

.exito-row {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  color: #555;
}

/* ── Responsive ──────────────────────────────────────────────────────────── */
@media (max-width: 768px) {
  .detalle-layout { grid-template-columns: 1fr; }
  .col-sticky { position: static; order: -1; }
  .barco-metrics { grid-template-columns: repeat(2, 1fr); }
  .cabinas-grid { grid-template-columns: 1fr; }
  .amenidades-grid { grid-template-columns: 1fr; }

  .modal-card { max-height: 95vh; border-radius: 16px 16px 0 0; margin-top: auto; }
  .modal-overlay { align-items: flex-end; padding: 0; }
  .form-row { grid-template-columns: 1fr; }
  .cabinas-modal-grid { grid-template-columns: 1fr; }
}
</style>