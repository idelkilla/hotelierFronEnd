<template>
  <div class="vuelos-resultados">

    <div class="resultados-header">
      <h2 class="resultados-titulo">Vuelos de salida recomendados</h2>
      <p class="resultados-subtitulo">
        Información sobre el orden de los resultados y los precios personalizados
      </p>
    </div>

    <div class="vuelos-lista">
      <div
        v-for="(vuelo, index) in vuelos"
        :key="index"
        class="vuelo-card"
        :class="{ 'tiene-oferta': vuelo.oferta }"
      >
        <div v-if="vuelo.oferta" class="oferta-banner">
          <span class="oferta-icono">🧳</span>
          <span class="oferta-texto">Oferta: arma tu viaje y ahorra</span>
          <span class="oferta-desc">{{ vuelo.oferta }}</span>
        </div>

        <div class="vuelo-contenido">
          <div class="vuelo-aerolinea-logo">
            <img v-if="vuelo.logo" :src="vuelo.logo" :alt="vuelo.aerolinea" class="logo-img" />
            <span v-else class="avion-icon">✈</span>
          </div>
          <div class="vuelo-info">
            <div class="vuelo-horario">
              <span class="hora">{{ vuelo.horaSalida }}</span>
              <span class="linea-escala">
                <span class="linea"></span>
                <span v-if="vuelo.escalas > 0" class="punto-escala"></span>
                <span class="linea"></span>
              </span>
              <span class="hora">{{ vuelo.horaLlegada }}</span>
              <span v-if="vuelo.diasExtra" class="dias-extra">+{{ vuelo.diasExtra }}</span>
            </div>
            <div class="vuelo-ruta">{{ vuelo.origen }} — {{ vuelo.destino }}</div>
            <div class="vuelo-aerolinea-nombre">{{ vuelo.aerolinea }}</div>
          </div>
          <div class="vuelo-duracion">
            <div class="duracion-texto">
              {{ vuelo.duracion }} •
              <strong>{{ vuelo.escalas === 0 ? 'Directo' : `${vuelo.escalas} escala${vuelo.escalas > 1 ? 's' : ''}` }}</strong>
            </div>
            <div v-if="vuelo.escalaDetalle" class="escala-detalle">{{ vuelo.escalaDetalle }}</div>
          </div>
          <div class="vuelo-precio-wrap">
            <span class="vuelo-precio" :class="{ 'precio-oferta': vuelo.esOferta }">
              ${{ vuelo.precio.toLocaleString() }}
            </span>
            <span class="precio-tipo">Redondo por pasajero</span>
          </div>
        </div>

        <div class="vuelo-footer">
          <button class="btn-detalles" @click="abrirModal(vuelo)">Detalles del vuelo</button>
        </div>
      </div>
    </div>

    <!-- ═══════════ MODAL ═══════════ -->
    <Teleport to="body">
      <Transition name="modal-fade">
        <div v-if="modalVuelo" class="modal-overlay" @click.self="cerrarModal">
          <div class="modal-shell">

            <!-- ── VISTA DETALLE ── -->
            <Transition name="panel-slide" mode="out-in">
              <div v-if="paso === 'detalle'" key="detalle" class="modal-panel">

                <div class="mh">
                  <button class="mh-close" @click="cerrarModal" aria-label="Cerrar">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                  </button>
                  <span class="mh-title">Detalles del vuelo</span>
                  <div style="width:32px"></div>
                </div>

                <div class="modal-scroll">
                  <!-- Tramo visual -->
                  <div class="tramo-card">
                    <div class="tramo-top">
                      <div class="tramo-airline">
                        <span class="airline-dot">✈</span>
                        <span class="airline-name">{{ modalVuelo.aerolinea }}</span>
                        <span class="flight-code">{{ modalVuelo.codigoVuelo }}</span>
                      </div>
                      <span class="tramo-class-badge">{{ modalVuelo.clase }}</span>
                    </div>

                    <div class="tramo-route">
                      <div class="route-point">
                        <div class="rp-time">{{ modalVuelo.horaSalida }}</div>
                        <div class="rp-date">{{ modalVuelo.fechaSalida }}</div>
                        <div class="rp-iata">{{ modalVuelo.origen.match(/\((\w+)\)/)?.[1] || '—' }}</div>
                        <div class="rp-city">{{ modalVuelo.ciudadOrigen }}</div>
                      </div>

                      <div class="route-middle">
                        <div class="rm-duration">{{ modalVuelo.duracion }}</div>
                        <div class="rm-line">
                          <div class="rm-dot rm-dot-left"></div>
                          <div class="rm-track"></div>
                          <div v-if="modalVuelo.escalas > 0" class="rm-stop">
                            <div class="rm-stop-dot"></div>
                            <div class="rm-stop-label">{{ modalVuelo.escalaDetalle }}</div>
                          </div>
                          <div class="rm-track"></div>
                          <div class="rm-dot rm-dot-right"></div>
                        </div>
                        <div class="rm-escala-txt">
                          {{ modalVuelo.escalas === 0 ? 'Vuelo directo' : `${modalVuelo.escalas} escala` }}
                        </div>
                      </div>

                      <div class="route-point route-point-right">
                        <div class="rp-time">{{ modalVuelo.horaLlegada }}</div>
                        <div class="rp-date">{{ modalVuelo.fechaLlegada }}</div>
                        <div class="rp-iata">{{ modalVuelo.destino.match(/\((\w+)\)/)?.[1] || '—' }}</div>
                        <div class="rp-city">{{ modalVuelo.ciudadDestino }}</div>
                      </div>
                    </div>
                  </div>

                  <!-- Info grid -->
                  <div class="info-grid">
                    <div class="ig-item">
                      <span class="ig-label">Avión</span>
                      <span class="ig-val">{{ modalVuelo.avion }}</span>
                    </div>
                    <div class="ig-item">
                      <span class="ig-label">Clase</span>
                      <span class="ig-val">{{ modalVuelo.clase }}</span>
                    </div>
                    <div class="ig-item">
                      <span class="ig-label">Distancia</span>
                      <span class="ig-val">{{ modalVuelo.distancia }}</span>
                    </div>
                    <div class="ig-item">
                      <span class="ig-label">Escalas</span>
                      <span class="ig-val">{{ modalVuelo.escalas === 0 ? 'Ninguna' : modalVuelo.escalaDetalle }}</span>
                    </div>
                  </div>

                  <!-- Servicios -->
                  <div class="servicios-wrap">
                    <div class="sw-title">Servicios a bordo</div>
                    <div class="sw-pills">
                      <span v-for="s in modalVuelo.servicios" :key="s.nombre" class="sw-pill">
                        {{ s.icon }} {{ s.nombre }}
                      </span>
                    </div>
                  </div>

                  <!-- Incluido -->
                  <div class="incluido-wrap">
                    <div class="incl-row">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#15803d" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                      Equipaje de mano (1 pieza) incluido
                    </div>
                    <div class="incl-row">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#15803d" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                      Cancelación flexible disponible
                    </div>
                    <div class="incl-row incl-warn">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#b45309" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                      Equipaje facturado se paga por separado
                    </div>
                  </div>
                </div>

                <!-- Footer detalle -->
                <div class="mf-detalle">
                  <div class="mf-precio-col">
                    <span class="mf-precio">${{ modalVuelo.precio.toLocaleString() }}</span>
                    <span class="mf-precio-sub">por pasajero · redondo</span>
                  </div>
                  <button class="btn-continuar" @click="paso = 'reserva'">
                    Reservar ahora
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="9 18 15 12 9 6"/></svg>
                  </button>
                </div>

              </div>

              <!-- ── VISTA RESERVA (multi-paso) ── -->
              <div v-else key="reserva" class="modal-panel">

                <div class="mh">
                  <button class="mh-close" @click="paso = 'detalle'" aria-label="Volver">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="15 18 9 12 15 6"/></svg>
                  </button>
                  <span class="mh-title">Reservar vuelo</span>
                  <button class="mh-x" @click="cerrarModal">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                  </button>
                </div>

                <!-- Steps indicator -->
                <div class="steps-bar">
                  <div
                    v-for="(s, i) in pasoReservaLabels"
                    :key="i"
                    class="step-node"
                    :class="{
                      'sn-active': pasoReserva === i,
                      'sn-done':   pasoReserva > i
                    }"
                  >
                    <div class="sn-circle">
                      <svg v-if="pasoReserva > i" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="3.5"><polyline points="20 6 9 17 4 12"/></svg>
                      <span v-else>{{ i + 1 }}</span>
                    </div>
                    <span class="sn-label">{{ s }}</span>
                    <div v-if="i < pasoReservaLabels.length - 1" class="sn-line" :class="{ 'sn-line-done': pasoReserva > i }"></div>
                  </div>
                </div>

                <!-- Mini resumen vuelo -->
                <div class="mini-fly">
                  <div class="mfly-seg">
                    <span class="mfly-iata">{{ modalVuelo.origen.match(/\((\w+)\)/)?.[1] || '—' }}</span>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#64748b" stroke-width="2"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
                    <span class="mfly-iata">{{ modalVuelo.destino.match(/\((\w+)\)/)?.[1] || '—' }}</span>
                  </div>
                  <span class="mfly-info">{{ modalVuelo.horaSalida }} · {{ modalVuelo.aerolinea }} · {{ modalVuelo.fechaSalida }}</span>
                  <span class="mfly-price">${{ modalVuelo.precio.toLocaleString() }}</span>
                </div>

                <div class="modal-scroll">

                  <!-- ─ PASO 0: Pasajero ─ -->
                  <Transition name="step-slide" mode="out-in">
                    <div v-if="pasoReserva === 0" key="p0">

                      <div class="form-block">
                        <div class="fb-head">
                          <div class="fb-icon">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                          </div>
                          Datos del pasajero principal
                        </div>
                        <div class="fb-note">
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                          Debe coincidir exactamente con tu pasaporte (exigido por las autoridades migratorias - programa API)
                        </div>
                        <div class="fg-row">
                          <div class="fg-field">
                            <label>Nombre(s) <span class="req">*</span></label>
                            <input v-model="form.nombre" type="text" placeholder="Como aparece en el pasaporte" :class="{ err: errores.nombre }" />
                            <span v-if="errores.nombre" class="err-msg">Requerido</span>
                          </div>
                          <div class="fg-field">
                            <label>Apellido(s) <span class="req">*</span></label>
                            <input v-model="form.apellido" type="text" placeholder="Como aparece en el pasaporte" :class="{ err: errores.apellido }" />
                            <span v-if="errores.apellido" class="err-msg">Requerido</span>
                          </div>
                        </div>
                        <div class="fg-row">
                          <div class="fg-field">
                            <label>Fecha de nacimiento <span class="req">*</span></label>
                            <input v-model="form.fechaNacimiento" type="date" :class="{ err: errores.fechaNacimiento }" />
                            <span v-if="errores.fechaNacimiento" class="err-msg">Requerido</span>
                          </div>
                          <div class="fg-field">
                            <label>Género <span class="req">*</span></label>
                            <select v-model="form.genero" :class="{ err: errores.genero }">
                              <option value="">Seleccionar...</option>
                              <option value="M">Masculino</option>
                              <option value="F">Femenino</option>
                            </select>
                            <span v-if="errores.genero" class="err-msg">Requerido</span>
                          </div>
                        </div>
                        <div class="fg-row">
                          <div class="fg-field">
                            <label>Nacionalidad <span class="req">*</span></label>
                            <select v-model="form.nacionalidad" :class="{ err: errores.nacionalidad }">
                              <option value="">Seleccionar...</option>
                              <option value="DO">Dominicana</option>
                              <option value="US">Estadounidense</option>
                              <option value="MX">Mexicana</option>
                              <option value="CO">Colombiana</option>
                              <option value="ES">Española</option>
                              <option value="other">Otra</option>
                            </select>
                            <span v-if="errores.nacionalidad" class="err-msg">Requerido</span>
                          </div>
                          <div class="fg-field">
                            <label>País de residencia <span class="req">*</span></label>
                            <input v-model="form.pais" type="text" placeholder="Ej: República Dominicana" :class="{ err: errores.pais }" />
                            <span v-if="errores.pais" class="err-msg">Requerido</span>
                          </div>
                        </div>
                      </div>

                      <div class="form-block">
                        <div class="fb-head">
                          <div class="fb-icon">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="M7 4v16M17 4v16M2 12h20"/></svg>
                          </div>
                          Documento de viaje (Pasaporte)
                        </div>
                        <div class="fg-row">
                          <div class="fg-field">
                            <label>Número de pasaporte <span class="req">*</span></label>
                            <input v-model="form.pasaporte" type="text" placeholder="Ej: AB123456" :class="{ err: errores.pasaporte }" />
                            <span v-if="errores.pasaporte" class="err-msg">Requerido</span>
                          </div>
                          <div class="fg-field">
                            <label>País emisor <span class="req">*</span></label>
                            <select v-model="form.paisEmisorp" :class="{ err: errores.paisEmisorp }">
                              <option value="">Seleccionar...</option>
                              <option value="DO">República Dominicana</option>
                              <option value="US">Estados Unidos</option>
                              <option value="MX">México</option>
                              <option value="other">Otro</option>
                            </select>
                            <span v-if="errores.paisEmisorp" class="err-msg">Requerido</span>
                          </div>
                        </div>
                        <div class="fg-row">
                          <div class="fg-field">
                            <label>Fecha de vencimiento <span class="req">*</span></label>
                            <input v-model="form.vencimientoPasaporte" type="date" :class="{ err: errores.vencimientoPasaporte }" />
                            <span v-if="errores.vencimientoPasaporte" class="err-msg">Debe vencer después del viaje</span>
                          </div>
                          <div class="fg-field">
                            <label>Número de programa viajero frecuente</label>
                            <input v-model="form.viajeroFrecuente" type="text" placeholder="Opcional" />
                          </div>
                        </div>

                        <div class="passport-tip">
                          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#1d4ed8" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                          <span>Para vuelos internacionales tu pasaporte debe tener al menos <strong>6 meses de vigencia</strong> después de la fecha de regreso.</span>
                        </div>
                      </div>

                      <div class="form-block">
                        <div class="fb-head">
                          <div class="fb-icon">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 2.18h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 9.91a16 16 0 0 0 6 6l.92-.92a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                          </div>
                          Contacto
                        </div>
                        <div class="fg-row">
                          <div class="fg-field fg-full">
                            <label>Correo electrónico <span class="req">*</span></label>
                            <input v-model="form.email" type="email" placeholder="Se enviarán tus tickets aquí" :class="{ err: errores.email }" />
                            <span v-if="errores.email" class="err-msg">Email inválido</span>
                          </div>
                        </div>
                        <div class="fg-row">
                          <div class="fg-field">
                            <label>Teléfono / WhatsApp <span class="req">*</span></label>
                            <input v-model="form.telefono" type="tel" placeholder="+1 809 000 0000" :class="{ err: errores.telefono }" />
                            <span v-if="errores.telefono" class="err-msg">Requerido</span>
                          </div>
                          <div class="fg-field">
                            <label>Contacto de emergencia</label>
                            <input v-model="form.contactoEmergencia" type="text" placeholder="Nombre y teléfono" />
                          </div>
                        </div>
                      </div>

                    </div>

                    <!-- ─ PASO 1: Preferencias ─ -->
                    <div v-else-if="pasoReserva === 1" key="p1">

                      <div class="form-block">
                        <div class="fb-head">
                          <div class="fb-icon">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/></svg>
                          </div>
                          Asiento y equipaje
                        </div>
                        <div class="fg-row">
                          <div class="fg-field">
                            <label>Preferencia de asiento</label>
                            <select v-model="form.asiento">
                              <option value="">Sin preferencia</option>
                              <option value="ventana">Ventana</option>
                              <option value="pasillo">Pasillo</option>
                              <option value="medio">Medio</option>
                              <option value="emergencia">Salida de emergencia</option>
                            </select>
                          </div>
                          <div class="fg-field">
                            <label>Equipaje adicional</label>
                            <select v-model="form.equipaje">
                              <option value="0">Sin equipaje facturado</option>
                              <option value="1">1 maleta (23 kg) — +$45</option>
                              <option value="2">2 maletas (23 kg c/u) — +$80</option>
                            </select>
                          </div>
                        </div>
                      </div>

                      <div class="form-block">
                        <div class="fb-head">
                          <div class="fb-icon">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 8h1a4 4 0 0 1 0 8h-1"/><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"/><line x1="6" y1="1" x2="6" y2="4"/><line x1="10" y1="1" x2="10" y2="4"/><line x1="14" y1="1" x2="14" y2="4"/></svg>
                          </div>
                          Servicios especiales
                        </div>
                        <div class="fg-row">
                          <div class="fg-field">
                            <label>Comida especial</label>
                            <select v-model="form.comida">
                              <option value="">Estándar</option>
                              <option value="vegetarian">Vegetariana</option>
                              <option value="vegan">Vegana</option>
                              <option value="halal">Halal</option>
                              <option value="kosher">Kosher</option>
                              <option value="gluten">Sin gluten</option>
                              <option value="diabetic">Diabético</option>
                            </select>
                          </div>
                          <div class="fg-field">
                            <label>Asistencia especial</label>
                            <select v-model="form.asistencia">
                              <option value="">Ninguna</option>
                              <option value="wchr">Silla de ruedas (aeropuerto)</option>
                              <option value="wchc">Silla de ruedas (avión)</option>
                              <option value="umnr">Menor no acompañado</option>
                              <option value="blind">Viajero con discapacidad visual</option>
                            </select>
                          </div>
                        </div>
                        <div class="fg-row">
                          <div class="fg-field fg-full">
                            <label>Solicitudes adicionales</label>
                            <textarea v-model="form.solicitudes" rows="2" placeholder="Alergias, celebraciones, peticiones especiales..."></textarea>
                          </div>
                        </div>
                      </div>

                      <!-- Documentación migratoria -->
                      <div class="form-block">
                        <div class="fb-head">
                          <div class="fb-icon">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                          </div>
                          Documentación migratoria
                        </div>
                        <div class="fg-row">
                          <div class="fg-field">
                            <label>¿Tienes visa para el destino?</label>
                            <select v-model="form.tieneVisa">
                              <option value="">Seleccionar...</option>
                              <option value="si">Sí</option>
                              <option value="no">No requerida para mi pasaporte</option>
                              <option value="tramite">En trámite</option>
                            </select>
                          </div>
                          <div class="fg-field">
                            <label>Motivo del viaje</label>
                            <select v-model="form.motivoViaje">
                              <option value="">Seleccionar...</option>
                              <option value="turismo">Turismo / vacaciones</option>
                              <option value="negocios">Negocios</option>
                              <option value="estudio">Estudios</option>
                              <option value="familia">Visita familiar</option>
                              <option value="transito">Tránsito</option>
                            </select>
                          </div>
                        </div>
                        <div class="api-notice">
                          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#1d4ed8" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                          <span>Esta información se comparte con las autoridades migratorias del país de destino mediante el sistema <strong>API (Información Anticipada de Pasajeros)</strong>, según exige la ley de aviación internacional.</span>
                        </div>
                      </div>

                    </div>

                    <!-- ─ PASO 2: Pago ─ -->
                    <div v-else-if="pasoReserva === 2" key="p2">

                      <!-- Resumen final -->
                      <div class="resumen-final">
                        <div class="rf-title">Resumen de tu reserva</div>
                        <div class="rf-row"><span>Vuelo</span><span>{{ modalVuelo.ciudadOrigen }} → {{ modalVuelo.ciudadDestino }}</span></div>
                        <div class="rf-row"><span>Fecha</span><span>{{ modalVuelo.fechaSalida }}</span></div>
                        <div class="rf-row"><span>Aerolínea</span><span>{{ modalVuelo.aerolinea }} · {{ modalVuelo.codigoVuelo }}</span></div>
                        <div class="rf-row"><span>Pasajero</span><span>{{ form.nombre }} {{ form.apellido }}</span></div>
                        <div class="rf-row"><span>Asiento</span><span>{{ form.asiento || 'Sin preferencia' }}</span></div>
                        <div class="rf-sep"></div>
                        <div class="rf-row rf-total">
                          <span>Total</span>
                          <span class="rf-total-val">${{ totalConEquipaje.toLocaleString() }}</span>
                        </div>
                      </div>

                      <div class="form-block">
                        <div class="fb-head">
                          <div class="fb-icon">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>
                          </div>
                          Método de pago
                        </div>

                        <div class="metodos-pago">
                          <label class="mp-opt" :class="{ 'mp-sel': form.metodoPago === 'tarjeta' }">
                            <input type="radio" v-model="form.metodoPago" value="tarjeta" />
                            <span>💳 Tarjeta crédito / débito</span>
                          </label>
                          <label class="mp-opt" :class="{ 'mp-sel': form.metodoPago === 'transferencia' }">
                            <input type="radio" v-model="form.metodoPago" value="transferencia" />
                            <span>🏦 Transferencia bancaria</span>
                          </label>
                        </div>

                        <div v-if="form.metodoPago === 'tarjeta'" class="fg-row" style="margin-top:12px">
                          <div class="fg-field fg-full">
                            <label>Número de tarjeta <span class="req">*</span></label>
                            <input
                              v-model="form.tarjeta"
                              type="text"
                              placeholder="0000  0000  0000  0000"
                              maxlength="19"
                              @input="formatarTarjeta"
                              :class="{ err: errores.tarjeta }"
                            />
                            <span v-if="errores.tarjeta" class="err-msg">Número inválido</span>
                          </div>
                        </div>
                        <div v-if="form.metodoPago === 'tarjeta'" class="fg-row">
                          <div class="fg-field">
                            <label>Vencimiento <span class="req">*</span></label>
                            <input v-model="form.vencimiento" type="text" placeholder="MM/AA" maxlength="5" :class="{ err: errores.vencimiento }" />
                            <span v-if="errores.vencimiento" class="err-msg">Requerido</span>
                          </div>
                          <div class="fg-field">
                            <label>CVV <span class="req">*</span></label>
                            <input v-model="form.cvv" type="text" placeholder="123" maxlength="4" :class="{ err: errores.cvv }" />
                            <span v-if="errores.cvv" class="err-msg">Requerido</span>
                          </div>
                        </div>
                        <div v-if="form.metodoPago === 'tarjeta'" class="fg-row">
                          <div class="fg-field fg-full">
                            <label>Nombre en la tarjeta <span class="req">*</span></label>
                            <input v-model="form.nombreTarjeta" type="text" placeholder="Como aparece en la tarjeta" :class="{ err: errores.nombreTarjeta }" />
                            <span v-if="errores.nombreTarjeta" class="err-msg">Requerido</span>
                          </div>
                        </div>

                        <div v-if="form.metodoPago === 'transferencia'" class="transferencia-info">
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#1d4ed8" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                          Recibirás los datos bancarios por correo tras confirmar. La reserva se valida en 1–2 días hábiles.
                        </div>
                      </div>

                      <label class="terminos-check" :class="{ 'tc-err': errores.terminos }">
                        <input type="checkbox" v-model="form.terminos" />
                        <span>Acepto los <a href="#" @click.prevent>términos y condiciones</a> y confirmo que los datos del pasajero son correctos</span>
                      </label>
                      <span v-if="errores.terminos" class="err-msg" style="display:block;margin-top:4px;">Debes aceptar los términos</span>

                    </div>

                    <!-- ─ PASO 3: Confirmación ─ -->
                    <div v-else-if="pasoReserva === 3" key="p3" class="confirmacion">
                      <div class="conf-icono">
                        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#15803d" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                      </div>
                      <h3 class="conf-titulo">¡Reserva confirmada!</h3>
                      <p class="conf-sub">Revisa tu correo electrónico para los tickets y detalles del vuelo.</p>
                      <div class="conf-codigo">
                        <span class="cc-label">Código de reserva</span>
                        <span class="cc-val">#FL-{{ codigoReserva }}</span>
                      </div>
                      <div class="conf-detalles">
                        <div class="cd-row">
                          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#265073" stroke-width="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                          Confirmación enviada a <strong>{{ form.email }}</strong>
                        </div>
                        <div class="cd-row">
                          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#265073" stroke-width="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07"/><path d="M2.18 2.18l19.64 19.64"/></svg>
                          Check-in online disponible 24 h antes del vuelo
                        </div>
                      </div>
                      <button class="btn-continuar" style="width:100%;justify-content:center;margin-top:8px;" @click="cerrarModal">
                        Cerrar
                      </button>
                    </div>
                  </Transition>
                </div>

                <!-- Footer reserva -->
                <div v-if="pasoReserva < 3" class="mf-reserva">
                  <button v-if="pasoReserva > 0" class="btn-atras" @click="pasoReserva--">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="15 18 9 12 15 6"/></svg>
                    Atrás
                  </button>
                  <div v-else></div>
                  <div class="mfr-right">
                    <span class="mfr-step">{{ pasoReserva + 1 }} / {{ pasoReservaLabels.length }}</span>
                    <button class="btn-continuar" @click="avanzarPasoReserva">
                      {{ pasoReserva === 2 ? 'Confirmar reserva' : 'Continuar' }}
                      <svg v-if="pasoReserva < 2" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="9 18 15 12 9 6"/></svg>
                    </button>
                  </div>
                </div>

              </div>
            </Transition>

          </div>
        </div>
      </Transition>
    </Teleport>

  </div>
</template>

<script setup>
import { ref, computed } from 'vue';

const modalVuelo   = ref(null);
const paso         = ref('detalle');   // 'detalle' | 'reserva'
const pasoReserva  = ref(0);           // 0 pasajero · 1 preferencias · 2 pago · 3 confirmación
const codigoReserva = ref('');

const pasoReservaLabels = ['Pasajero', 'Preferencias', 'Pago'];

const abrirModal = (vuelo) => {
  modalVuelo.value = vuelo;
  paso.value = 'detalle';
  pasoReserva.value = 0;
  resetForm();
  limpiarErrores();
  document.body.style.overflow = 'hidden';
};

const cerrarModal = () => {
  modalVuelo.value = null;
  paso.value = 'detalle';
  document.body.style.overflow = '';
};

const form = ref({
  // Pasajero
  nombre: '', apellido: '', fechaNacimiento: '', genero: '',
  nacionalidad: '', pais: '',
  // Pasaporte
  pasaporte: '', paisEmisorp: '', vencimientoPasaporte: '', viajeroFrecuente: '',
  // Contacto
  email: '', telefono: '', contactoEmergencia: '',
  // Preferencias
  asiento: '', equipaje: '0', comida: '', asistencia: '', solicitudes: '',
  tieneVisa: '', motivoViaje: '',
  // Pago
  metodoPago: 'tarjeta',
  tarjeta: '', vencimiento: '', cvv: '', nombreTarjeta: '',
  terminos: false,
});

const errores = ref({});

const resetForm = () => {
  Object.keys(form.value).forEach(k => {
    if (typeof form.value[k] === 'boolean') form.value[k] = false;
    else form.value[k] = '';
  });
  form.value.equipaje = '0';
  form.value.metodoPago = 'tarjeta';
};

const limpiarErrores = () => { errores.value = {}; };

const formatarTarjeta = () => {
  form.value.tarjeta = form.value.tarjeta
    .replace(/\D/g, '').replace(/(.{4})/g, '$1 ').trim().substring(0, 19);
};

const totalConEquipaje = computed(() => {
  if (!modalVuelo.value) return 0;
  const extras = { '0': 0, '1': 45, '2': 80 };
  return modalVuelo.value.precio + (extras[form.value.equipaje] || 0);
});

const validarPasoActual = () => {
  limpiarErrores();
  const e = {};

  if (pasoReserva.value === 0) {
    if (!form.value.nombre.trim())            e.nombre = true;
    if (!form.value.apellido.trim())          e.apellido = true;
    if (!form.value.fechaNacimiento)          e.fechaNacimiento = true;
    if (!form.value.genero)                   e.genero = true;
    if (!form.value.nacionalidad)             e.nacionalidad = true;
    if (!form.value.pais.trim())              e.pais = true;
    if (!form.value.pasaporte.trim())         e.pasaporte = true;
    if (!form.value.paisEmisorp)              e.paisEmisorp = true;
    if (!form.value.vencimientoPasaporte)     e.vencimientoPasaporte = true;
    if (!form.value.email.includes('@'))      e.email = true;
    if (!form.value.telefono.trim())          e.telefono = true;
  }

  if (pasoReserva.value === 2) {
    if (form.value.metodoPago === 'tarjeta') {
      if (form.value.tarjeta.replace(/\s/g,'').length < 16) e.tarjeta = true;
      if (!form.value.vencimiento)           e.vencimiento = true;
      if (!form.value.cvv)                   e.cvv = true;
      if (!form.value.nombreTarjeta.trim())  e.nombreTarjeta = true;
    }
    if (!form.value.terminos)                e.terminos = true;
  }

  errores.value = e;
  return Object.keys(e).length === 0;
};

const avanzarPasoReserva = () => {
  if (!validarPasoActual()) return;
  if (pasoReserva.value < 2) {
    pasoReserva.value++;
  } else {
    codigoReserva.value = Math.random().toString(36).substring(2, 8).toUpperCase();
    pasoReserva.value = 3;
  }
};

const vuelos = ref([
  {
    horaSalida: '10:01 a.m.', horaLlegada: '1:00 p.m.', diasExtra: 1,
    origen: 'Santiago d... (STI)', destino: 'Estambul (IST)',
    ciudadOrigen: 'Santiago de los Caballeros', ciudadDestino: 'Estambul',
    fechaSalida: 'vie., 15 may.', fechaLlegada: 'sáb., 16 may.',
    aerolinea: 'Aerolíneas múltiples', codigoVuelo: 'AA1917',
    duracion: '19 h 59 min', escalas: 1, escalaDetalle: '5 h 48 min en JFK',
    precio: 1528, esOferta: true, logo: null, oferta: null,
    avion: 'Boeing 737-800', clase: 'Económica', distancia: '750 mi',
    servicios: [{ icon: '📶', nombre: 'Wifi' }, { icon: '🔌', nombre: 'Enchufe' }, { icon: '🎬', nombre: 'Entretenimiento' }],
  },
  {
    horaSalida: '8:11 a.m.', horaLlegada: '1:00 p.m.', diasExtra: 1,
    origen: 'Santiago d... (STI)', destino: 'Estambul (IST)',
    ciudadOrigen: 'Santiago de los Caballeros', ciudadDestino: 'Estambul',
    fechaSalida: 'vie., 15 may.', fechaLlegada: 'sáb., 16 may.',
    aerolinea: 'Aerolíneas múltiples', codigoVuelo: 'B61234',
    duracion: '21 h 49 min', escalas: 1, escalaDetalle: '7 h 50 min en JFK',
    precio: 1528, esOferta: false, logo: null, oferta: null,
    avion: 'Airbus A320', clase: 'Económica', distancia: '820 mi',
    servicios: [{ icon: '📶', nombre: 'Wifi' }, { icon: '🔌', nombre: 'Enchufe' }],
  },
  {
    horaSalida: '1:37 p.m.', horaLlegada: '2:10 p.m.', diasExtra: 1,
    origen: 'Santiago d... (STI)', destino: 'Estambul (IST)',
    ciudadOrigen: 'Santiago de los Caballeros', ciudadDestino: 'Estambul',
    fechaSalida: 'vie., 15 may.', fechaLlegada: 'sáb., 16 may.',
    aerolinea: 'Aerolíneas múltiples', codigoVuelo: 'TK001',
    duracion: '17 h 33 min', escalas: 1, escalaDetalle: '4 h 14 min en BOS',
    precio: 1894, esOferta: false, logo: null,
    oferta: 'Reserva este vuelo con un hotel y obtén 4 noches de hospedaje gratis',
    avion: 'Boeing 777', clase: 'Económica', distancia: '910 mi',
    servicios: [{ icon: '📶', nombre: 'Wifi' }, { icon: '🎬', nombre: 'Entretenimiento' }],
  },
  {
    horaSalida: '10:01 a.m.', horaLlegada: '1:00 p.m.', diasExtra: 1,
    origen: 'Santiago (STI)', destino: 'Estambul (IST)',
    ciudadOrigen: 'Santiago de los Caballeros', ciudadDestino: 'Estambul',
    fechaSalida: 'vie., 15 may.', fechaLlegada: 'sáb., 16 may.',
    aerolinea: 'JetBlue Airways', codigoVuelo: 'JB509',
    duracion: '19 h 59 min', escalas: 1, escalaDetalle: '5 h 48 min en JFK',
    precio: 1528, esOferta: false, logo: null, oferta: null,
    avion: 'Airbus A321', clase: 'Económica', distancia: '750 mi',
    servicios: [{ icon: '📶', nombre: 'Wifi' }, { icon: '🔌', nombre: 'Enchufe' }, { icon: '🎬', nombre: 'Entretenimiento' }],
  },
]);
</script>

<style scoped>
/* ── Base lista de vuelos (sin cambios) ─────────────────────────────────── */
.vuelos-resultados { display: flex; flex-direction: column; gap: 16px; width: 100%; }
.resultados-header { margin-bottom: 4px; }
.resultados-titulo { font-size: 20px; font-weight: 700; color: #113955; margin: 0 0 4px; }
.resultados-subtitulo { font-size: 13px; color: #6b7280; margin: 0; }
.vuelos-lista { display: flex; flex-direction: column; gap: 12px; }
.vuelo-card { background: #fff; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden; transition: box-shadow 0.2s; }
.vuelo-card:hover { box-shadow: 0 4px 16px rgba(17,57,85,0.1); }
.oferta-banner { display: flex; align-items: center; gap: 10px; background: #fef9e7; border-bottom: 1px solid #f9e79f; padding: 8px 16px; font-size: 13px; }
.oferta-icono { font-size: 16px; }
.oferta-texto { background: #f1c40f; color: #113955; font-weight: 700; padding: 3px 10px; border-radius: 20px; font-size: 12px; }
.oferta-desc { color: #27ae60; font-weight: 500; font-size: 13px; }
.vuelo-contenido { display: flex; align-items: center; gap: 16px; padding: 16px; }
.vuelo-aerolinea-logo { width: 44px; flex-shrink: 0; display: flex; align-items: center; justify-content: center; }
.logo-img { width: 100%; object-fit: contain; }
.avion-icon { font-size: 24px; color: #113955; }
.vuelo-info { flex: 1.5; min-width: 0; }
.vuelo-horario { display: flex; align-items: center; gap: 8px; margin-bottom: 4px; }
.hora { font-size: 15px; font-weight: 600; color: #113955; white-space: nowrap; }
.linea-escala { display: flex; align-items: center; flex: 1; max-width: 80px; }
.linea { flex: 1; height: 1.5px; background: #94a3b8; }
.punto-escala { width: 7px; height: 7px; border-radius: 50%; background: #94a3b8; flex-shrink: 0; }
.dias-extra { font-size: 11px; color: #e74c3c; font-weight: 600; }
.vuelo-ruta { font-size: 12px; color: #6b7280; }
.vuelo-aerolinea-nombre { font-size: 12px; color: #6b7280; margin-top: 2px; }
.vuelo-duracion { flex: 1; text-align: center; }
.duracion-texto { font-size: 13px; color: #113955; }
.escala-detalle { font-size: 12px; color: #6b7280; margin-top: 2px; }
.vuelo-precio-wrap { text-align: right; flex-shrink: 0; display: flex; flex-direction: column; align-items: flex-end; gap: 4px; }
.vuelo-precio { font-size: 22px; font-weight: 700; color: #113955; }
.vuelo-precio.precio-oferta { color: #27ae60; }
.precio-tipo { font-size: 11px; color: #6b7280; }
.vuelo-footer { display: flex; justify-content: flex-end; padding: 8px 16px; border-top: 1px solid #f1f5f9; }
.btn-detalles { background: none; border: none; color: #2980b9; font-size: 13px; font-weight: 500; cursor: pointer; }
.btn-detalles:hover { text-decoration: underline; }

/* ══════════════════════════════════════════════════════
   MODAL
══════════════════════════════════════════════════════ */

/* Animaciones */
.modal-fade-enter-active, .modal-fade-leave-active { transition: opacity 0.22s ease; }
.modal-fade-enter-from, .modal-fade-leave-to { opacity: 0; }
.modal-fade-enter-active .modal-shell { transition: transform 0.28s cubic-bezier(0.34,1.56,0.64,1), opacity 0.22s; }
.modal-fade-enter-from .modal-shell { transform: translateY(32px) scale(0.97); opacity: 0; }

.panel-slide-enter-active, .panel-slide-leave-active { transition: opacity 0.18s ease, transform 0.18s ease; }
.panel-slide-enter-from { opacity: 0; transform: translateX(20px); }
.panel-slide-leave-to   { opacity: 0; transform: translateX(-20px); }

.step-slide-enter-active, .step-slide-leave-active { transition: opacity 0.15s ease, transform 0.15s ease; }
.step-slide-enter-from { opacity: 0; transform: translateX(16px); }
.step-slide-leave-to   { opacity: 0; transform: translateX(-16px); }

/* Overlay */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(5, 15, 30, 0.6);
  backdrop-filter: blur(4px);
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

/* Shell */
.modal-shell {
  width: 100%;
  max-width: 560px;
  max-height: 92vh;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 32px 80px rgba(0,0,0,0.28);
  background: #fff;
  display: flex;
  flex-direction: column;
}

.modal-panel {
  display: flex;
  flex-direction: column;
  height: 100%;
  max-height: 92vh;
}

/* Modal header */
.mh {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  border-bottom: 1px solid #e8ecf0;
  background: #fff;
  flex-shrink: 0;
}
.mh-title { font-size: 16px; font-weight: 700; color: #0f2d45; }
.mh-close, .mh-x {
  width: 32px; height: 32px;
  border-radius: 50%;
  border: 1.5px solid #e2e8f0;
  background: none;
  cursor: pointer;
  display: flex; align-items: center; justify-content: center;
  color: #374151;
  transition: background 0.15s;
}
.mh-close:hover, .mh-x:hover { background: #f1f5f9; }

/* Steps bar */
.steps-bar {
  display: flex;
  align-items: center;
  padding: 12px 20px 8px;
  background: #fff;
  flex-shrink: 0;
}
.step-node {
  display: flex;
  align-items: center;
  flex: 1;
}
.sn-circle {
  width: 26px; height: 26px;
  border-radius: 50%;
  border: 2px solid #d1d9e0;
  background: #fff;
  color: #9ca3af;
  font-size: 11px; font-weight: 700;
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0;
  transition: all 0.25s;
}
.sn-active .sn-circle { border-color: #113955; background: #113955; color: #fff; box-shadow: 0 0 0 3px rgba(17,57,85,0.15); }
.sn-done  .sn-circle  { border-color: #15803d; background: #15803d; color: #fff; }
.sn-label { font-size: 11px; font-weight: 600; color: #9ca3af; margin-left: 5px; white-space: nowrap; }
.sn-active .sn-label { color: #113955; }
.sn-done   .sn-label { color: #15803d; }
.sn-line { flex: 1; height: 2px; background: #e2e8f0; margin: 0 6px; border-radius: 2px; transition: background 0.3s; }
.sn-line-done { background: #15803d; }

/* Mini fly strip */
.mini-fly {
  display: flex;
  align-items: center;
  gap: 10px;
  background: #f0f7ff;
  border-bottom: 1px solid #dbeafe;
  padding: 10px 20px;
  flex-shrink: 0;
}
.mfly-seg { display: flex; align-items: center; gap: 6px; }
.mfly-iata { font-size: 16px; font-weight: 800; color: #113955; }
.mfly-info { font-size: 11px; color: #6b7280; flex: 1; }
.mfly-price { font-size: 16px; font-weight: 700; color: #113955; white-space: nowrap; }

/* Scroll area */
.modal-scroll {
  flex: 1;
  overflow-y: auto;
  padding: 16px 20px;
  scrollbar-width: thin;
  scrollbar-color: #cbd5e1 transparent;
}
.modal-scroll::-webkit-scrollbar { width: 4px; }
.modal-scroll::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 4px; }

/* ── Vista detalle ─────────────────────────────────── */
.tramo-card {
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 14px;
  padding: 16px;
  margin-bottom: 16px;
}
.tramo-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
}
.tramo-airline { display: flex; align-items: center; gap: 8px; }
.airline-dot { font-size: 16px; }
.airline-name { font-size: 13px; font-weight: 700; color: #113955; }
.flight-code { font-size: 11px; color: #94a3b8; background: #f1f5f9; border-radius: 4px; padding: 2px 6px; }
.tramo-class-badge { font-size: 11px; font-weight: 600; color: #1d4ed8; background: #eff6ff; border-radius: 6px; padding: 3px 8px; }

.tramo-route {
  display: flex;
  align-items: flex-start;
  gap: 8px;
}
.route-point { flex-shrink: 0; width: 90px; }
.route-point-right { text-align: right; }
.rp-time { font-size: 22px; font-weight: 800; color: #0f2d45; line-height: 1; }
.rp-date { font-size: 11px; color: #94a3b8; margin: 2px 0; }
.rp-iata { font-size: 13px; font-weight: 700; color: #113955; }
.rp-city { font-size: 11px; color: #64748b; line-height: 1.3; }

.route-middle {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 6px;
  gap: 4px;
}
.rm-duration { font-size: 11px; color: #94a3b8; }
.rm-line {
  display: flex;
  align-items: center;
  width: 100%;
  gap: 0;
  position: relative;
}
.rm-dot {
  width: 8px; height: 8px;
  border-radius: 50%;
  background: #113955;
  flex-shrink: 0;
}
.rm-track { flex: 1; height: 1.5px; background: #94a3b8; }
.rm-stop {
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
}
.rm-stop-dot {
  width: 6px; height: 6px;
  border-radius: 50%;
  border: 2px solid #f59e0b;
  background: #fff;
}
.rm-stop-label {
  position: absolute;
  top: 12px;
  font-size: 9px;
  color: #f59e0b;
  white-space: nowrap;
  font-weight: 600;
}
.rm-escala-txt { font-size: 10px; color: #94a3b8; margin-top: 10px; }

/* Info grid detalle */
.info-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1px;
  background: #e8ecf0;
  border: 1px solid #e8ecf0;
  border-radius: 10px;
  overflow: hidden;
  margin-bottom: 14px;
}
.ig-item {
  background: #fff;
  display: flex;
  justify-content: space-between;
  padding: 10px 14px;
  font-size: 13px;
}
.ig-label { color: #94a3b8; }
.ig-val { font-weight: 600; color: #113955; }

/* Servicios */
.servicios-wrap { margin-bottom: 14px; }
.sw-title { font-size: 12px; font-weight: 600; color: #374151; margin-bottom: 8px; }
.sw-pills { display: flex; flex-wrap: wrap; gap: 6px; }
.sw-pill { font-size: 12px; color: #374151; background: #f1f5f9; border-radius: 20px; padding: 4px 10px; }

/* Incluido */
.incluido-wrap { display: flex; flex-direction: column; gap: 7px; }
.incl-row { display: flex; align-items: center; gap: 7px; font-size: 13px; color: #374151; }
.incl-warn { color: #92400e; }

/* Footer detalle */
.mf-detalle {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 20px 18px;
  border-top: 1px solid #e8ecf0;
  background: #fff;
  flex-shrink: 0;
}
.mf-precio-col { display: flex; flex-direction: column; }
.mf-precio { font-size: 24px; font-weight: 800; color: #0f2d45; line-height: 1; }
.mf-precio-sub { font-size: 11px; color: #94a3b8; margin-top: 2px; }

/* Botón continuar / reservar */
.btn-continuar {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: #113955;
  color: #fff;
  border: none;
  border-radius: 25px;
  padding: 11px 22px;
  font-size: 14px; font-weight: 700;
  cursor: pointer;
  transition: background 0.2s, transform 0.15s;
}
.btn-continuar:hover { background: #0c2a40; transform: translateY(-1px); }

/* ── Formulario de reserva ──────────────────────────────── */
.form-block {
  background: #fff;
  border: 1px solid #e8ecf0;
  border-radius: 14px;
  padding: 14px 16px;
  margin-bottom: 12px;
}
.fb-head {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px; font-weight: 700;
  color: #0f2d45;
  margin-bottom: 12px;
}
.fb-icon {
  width: 26px; height: 26px;
  background: #eef4fb;
  border-radius: 7px;
  display: flex; align-items: center; justify-content: center;
  color: #113955;
  flex-shrink: 0;
}
.fb-note {
  display: flex;
  align-items: flex-start;
  gap: 6px;
  font-size: 11px;
  color: #64748b;
  background: #f8fafc;
  border-radius: 8px;
  padding: 8px 10px;
  margin-bottom: 12px;
  line-height: 1.5;
}

.fg-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
  margin-bottom: 10px;
}
.fg-field { display: flex; flex-direction: column; gap: 4px; }
.fg-full { grid-column: 1 / -1; }

.fg-field label { font-size: 11px; font-weight: 600; color: #374151; }
.req { color: #dc2626; }

.fg-field input,
.fg-field select,
.fg-field textarea {
  border: 1.5px solid #e2e8f0;
  border-radius: 9px;
  padding: 8px 11px;
  font-size: 13px;
  color: #0f172a;
  outline: none;
  background: #fff;
  font-family: inherit;
  transition: border-color 0.2s, box-shadow 0.2s;
  appearance: none;
}
.fg-field input:focus,
.fg-field select:focus,
.fg-field textarea:focus {
  border-color: #113955;
  box-shadow: 0 0 0 3px rgba(17,57,85,0.1);
}
.fg-field input::placeholder,
.fg-field textarea::placeholder { color: #9ca3af; }
.fg-field textarea { resize: vertical; }
.fg-field select {
  background-image: url("data:image/svg+xml,%3Csvg width='10' height='6' viewBox='0 0 10 6' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1l4 4 4-4' stroke='%2364748b' stroke-width='1.5' fill='none' stroke-linecap='round'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 10px center;
  padding-right: 28px;
  cursor: pointer;
}

.err { border-color: #dc2626 !important; box-shadow: 0 0 0 3px rgba(220,38,38,0.1) !important; }
.err-msg { font-size: 10px; color: #dc2626; font-weight: 500; }

/* Passport tip */
.passport-tip {
  display: flex;
  align-items: flex-start;
  gap: 7px;
  font-size: 12px;
  color: #1e40af;
  background: #eff6ff;
  border-radius: 8px;
  padding: 9px 11px;
  margin-top: 4px;
  line-height: 1.5;
}

/* API notice */
.api-notice {
  display: flex;
  align-items: flex-start;
  gap: 7px;
  font-size: 11px;
  color: #1e40af;
  background: #eff6ff;
  border-radius: 8px;
  padding: 9px 11px;
  margin-top: 8px;
  line-height: 1.5;
}

/* Resumen final */
.resumen-final {
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  overflow: hidden;
  margin-bottom: 14px;
}
.rf-title { font-size: 12px; font-weight: 700; color: #113955; padding: 10px 14px 8px; border-bottom: 1px solid #e2e8f0; }
.rf-row { display: flex; justify-content: space-between; padding: 8px 14px; font-size: 12px; color: #374151; border-bottom: 0.5px solid #f1f5f9; }
.rf-row span:last-child { font-weight: 500; text-align: right; }
.rf-sep { height: 1px; background: #e2e8f0; }
.rf-total { font-weight: 700; font-size: 13px; background: #fff; }
.rf-total-val { font-size: 18px; font-weight: 800; color: #113955; }

/* Métodos pago */
.metodos-pago { display: flex; gap: 8px; flex-wrap: wrap; }
.mp-opt {
  flex: 1; min-width: 140px;
  display: flex;
  align-items: center;
  gap: 8px;
  border: 1.5px solid #e2e8f0;
  border-radius: 10px;
  padding: 10px 12px;
  cursor: pointer;
  font-size: 13px; font-weight: 500;
  color: #374151;
  transition: border-color 0.15s, background 0.15s;
}
.mp-opt:hover { border-color: #113955; }
.mp-sel { border-color: #113955 !important; background: #f0f7ff; color: #113955; }
.mp-opt input { display: none; }

.transferencia-info {
  display: flex;
  align-items: flex-start;
  gap: 7px;
  font-size: 12px;
  color: #1e40af;
  background: #eff6ff;
  border-radius: 8px;
  padding: 9px 11px;
  margin-top: 10px;
  line-height: 1.5;
}

/* Términos */
.terminos-check {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  font-size: 12px;
  color: #374151;
  cursor: pointer;
  margin-top: 4px;
  line-height: 1.5;
}
.terminos-check input { margin-top: 2px; accent-color: #113955; }
.terminos-check a { color: #113955; }
.tc-err { color: #dc2626; }

/* Footer reserva */
.mf-reserva {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 20px 18px;
  border-top: 1px solid #e8ecf0;
  background: #fff;
  flex-shrink: 0;
}
.btn-atras {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  background: none;
  border: 1.5px solid #e2e8f0;
  border-radius: 25px;
  padding: 9px 16px;
  font-size: 13px; font-weight: 600;
  color: #374151;
  cursor: pointer;
  transition: border-color 0.2s, color 0.2s;
}
.btn-atras:hover { border-color: #113955; color: #113955; }
.mfr-right { display: flex; align-items: center; gap: 10px; }
.mfr-step { font-size: 11px; color: #94a3b8; }

/* Confirmación */
.confirmacion {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 16px 8px 24px;
}
.conf-icono {
  width: 70px; height: 70px;
  background: #f0fdf4;
  border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  margin-bottom: 14px;
}
.conf-titulo { font-size: 22px; font-weight: 800; color: #0f172a; margin: 0 0 6px; }
.conf-sub { font-size: 13px; color: #64748b; margin: 0 0 16px; line-height: 1.5; }
.conf-codigo {
  background: #f1f5f9;
  border-radius: 10px;
  padding: 10px 24px;
  margin-bottom: 14px;
  display: flex; flex-direction: column; align-items: center; gap: 3px;
}
.cc-label { font-size: 10px; text-transform: uppercase; letter-spacing: 0.8px; color: #94a3b8; font-weight: 600; }
.cc-val { font-size: 22px; font-weight: 800; color: #113955; letter-spacing: 2px; }
.conf-detalles {
  display: flex; flex-direction: column; gap: 7px;
  background: #f8fafc; border-radius: 10px;
  padding: 12px 16px; width: 100%; margin-bottom: 8px;
}
.cd-row { display: flex; align-items: center; gap: 8px; font-size: 12px; color: #374151; }

/* Responsive */
@media (max-width: 640px) {
  .modal-overlay { align-items: flex-end; padding: 0; }
  .modal-shell { max-width: 100%; max-height: 95vh; border-radius: 20px 20px 0 0; }
  .fg-row { grid-template-columns: 1fr; }
  .tramo-route { flex-direction: column; align-items: stretch; gap: 12px; }
  .route-middle { flex-direction: row; padding: 0; }
  .info-grid { grid-template-columns: 1fr; }
}
/* ═══════════════════════════════════════════════════
   RESPONSIVE
═══════════════════════════════════════════════════ */

/* ── Tablet (≤ 768px) ── */
@media (max-width: 768px) {
  .resultados-titulo { font-size: 17px; }

  .vuelo-contenido {
    flex-wrap: wrap;
    gap: 12px;
  }

  .vuelo-duracion {
    flex: 0 0 100%;
    text-align: left;
    border-top: 1px solid #f1f5f9;
    padding-top: 8px;
  }

  .vuelo-precio-wrap {
    flex: 1;
    align-items: flex-end;
  }

  .mini-fly {
    flex-wrap: wrap;
    gap: 6px;
  }
}

/* ── Mobile (≤ 640px) ── */
@media (max-width: 640px) {
  /* Modal: sube desde abajo */
  .modal-overlay { align-items: flex-end; padding: 0; }
  .modal-shell   { max-width: 100%; max-height: 95vh; border-radius: 20px 20px 0 0; }

  /* Formularios: columna simple */
  .fg-row { grid-template-columns: 1fr; }

  /* Ruta en el detalle */
  .tramo-route   { flex-direction: column; align-items: stretch; gap: 12px; }
  .route-middle  { flex-direction: row; padding: 0; }
  .route-point   { width: auto; }
  .info-grid     { grid-template-columns: 1fr; }

  /* Tarjeta de vuelo */
  .vuelo-contenido {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
    padding: 12px;
  }

  .vuelo-aerolinea-logo { display: none; }

  .vuelo-horario { gap: 6px; }
  .hora          { font-size: 14px; }
  .vuelo-precio  { font-size: 18px; }

  .vuelo-duracion {
    width: 100%;
    text-align: left;
    border-top: 1px solid #f1f5f9;
    padding-top: 8px;
  }

  .vuelo-precio-wrap {
    width: 100%;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    border-top: 1px solid #f1f5f9;
    padding-top: 8px;
  }

  /* Oferta banner */
  .oferta-banner { flex-wrap: wrap; gap: 6px; padding: 8px 12px; }
  .oferta-desc   { font-size: 12px; }

  /* Steps bar más compacto */
  .sn-label  { display: none; }
  .steps-bar { padding: 10px 16px 6px; }

  /* Footer modal */
  .mf-detalle  { flex-direction: column; align-items: stretch; gap: 10px; }
  .mf-reserva  { flex-wrap: wrap; gap: 8px; }
  .btn-continuar { justify-content: center; width: 100%; }
  .btn-atras     { justify-content: center; }
  .mfr-right     { width: 100%; flex-direction: column; }
}
</style>