<template>
  <div class="perfil-wrapper">
    <Header />

    <div class="perfil-layout">
      <!-- SIDEBAR -->
      <aside class="travel-sidebar-container">
        <div class="travel-user-header">
          <div :class="['travel-user-avatar', (perfil.photo && perfil.photo.startsWith('initial:')) || !perfil.photo ? 'initial' : '']">
            <template v-if="perfil.photo && perfil.photo.startsWith('http')">
              <img :src="fixPhoto(perfil.photo)" alt="User photo" style="width: 100%; height: 100%; border-radius: 50%; object-fit: cover;" />
            </template>
            <template v-else-if="perfil.photo && perfil.photo.startsWith('initial:')">
              {{ perfil.photo.split(':')[1] }}
            </template>
            <template v-else>
              {{ perfil.initial || '?' }}
            </template>
          </div>
          <h2 class="travel-user-greeting">Hola, <br><strong>{{ perfil.nombre_completo?.split(' ')[0] || 'Viajero' }}</strong></h2>
          <span class="travel-user-email">{{ perfil.email }}</span>
        </div>

        <div class="travel-rewards-card">
          <span class="travel-rewards-badge">{{ perfil.nivel_membresia || 'Blue' }}</span>
          <div class="travel-rewards-label">OneKeyCash</div>
          <div class="travel-rewards-value">${{ (perfil.puntos || 0).toFixed(2) }}</div>
          <button class="travel-rewards-btn">Ver actividad de recompensas →</button>
        </div>

        <nav class="travel-nav-list">
          <button
            v-for="item in navItems"
            :key="item.key"
            class="travel-nav-card"
            :class="{ 'is-active': activeSection === item.key }"
            @click="cambiarSeccion(item.key)"
          >
            <div class="travel-nav-icon" v-html="item.svg"></div>
            <div class="travel-nav-content">
              <span class="travel-nav-title">{{ item.label }}</span>
              <span class="travel-nav-subtitle">{{ item.sub }}</span>
            </div>
            <svg class="travel-nav-arrow" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <polyline points="9 18 15 12 9 6"/>
            </svg>
          </button>
        </nav>

        <button class="signout-btn" @click="confirmarCerrarSesion">Cerrar sesión</button>
      </aside>

      <!-- MAIN CONTENT -->
      <main class="main-content">

        <!-- ═══════════════════════════════════════════════════
             MODAL PERFIL (basico / contacto / aeropuerto / etc)
        ════════════════════════════════════════════════════════ -->
        <transition name="modal-fade">
          <div v-if="mostrarModal" class="modal-overlay" @click.self="cerrarModal">
            <div class="modal-box">
              <div class="modal-header">
                <h3>{{ modalTitles[tipoModal] }}</h3>
                <button class="modal-close" @click="cerrarModal">✕</button>
              </div>

              <template v-if="tipoModal === 'basico'">
                <div class="form-row-2">
                  <div class="form-field">
                    <label>Nombre legal</label>
                    <input v-model="formTemp.nombre_completo" type="text" placeholder="Tu nombre" />
                    <span v-if="errores.nombre_completo" class="error">{{ errores.nombre_completo }}</span>
                  </div>
                  <div class="form-field">
                    <label>Apellidos</label>
                    <input v-model="formTemp.apellidos" type="text" placeholder="Tus apellidos" />
                  </div>
                </div>
                <div class="form-row-2">
                  <div class="form-field">
                    <label>Fecha de nacimiento</label>
                    <input v-model="formTemp.fecha_nacimiento" type="date" />
                  </div>
                  <div class="form-field">
                    <label>Género</label>
                    <select v-model="formTemp.genero">
                      <option value="">Sin información</option>
                      <option value="M">Masculino</option>
                      <option value="F">Femenino</option>
                      <option value="O">Otro</option>
                    </select>
                  </div>
                </div>
                <div class="form-row-2">
                  <div class="form-field">
                    <label>País</label>
                    <select v-model="formTemp.id_pais" @change="onPaisChange" :disabled="cargandoPaises">
                      <option value="">{{ cargandoPaises ? 'Cargando países...' : 'Selecciona un país' }}</option>
                      <option v-for="p in listaPaises" :key="p.ID_PAIS" :value="p.ID_PAIS">{{ p.NOMBRE }}</option>
                    </select>
                  </div>
                  <div class="form-field">
                    <label>Ciudad</label>
                    <select v-model="formTemp.id_ciudad" @change="onCiudadChange" :disabled="!formTemp.id_pais || cargandoCiudades">
                      <option value="">{{ !formTemp.id_pais ? 'Selecciona un país primero' : cargandoCiudades ? 'Cargando...' : 'Selecciona una ciudad' }}</option>
                      <option v-for="c in listaCiudades" :key="c.ID_CIUDAD" :value="c.ID_CIUDAD">{{ c.NOMBRE }}</option>
                    </select>
                  </div>
                </div>
                <div class="form-field">
                  <label>Ubicación / Zona</label>
                  <select v-model="formTemp.id_ubicacion" :disabled="!formTemp.id_ciudad || cargandoUbicaciones">
                    <option value="">{{ !formTemp.id_ciudad ? 'Selecciona una ciudad primero' : cargandoUbicaciones ? 'Cargando...' : listaUbicaciones.length === 0 ? 'Sin ubicaciones' : 'Selecciona una zona' }}</option>
                    <option v-for="u in listaUbicaciones" :key="u.id" :value="u.id">
                      {{ u.nombre }}{{ u.tipo ? ` (${u.tipo})` : '' }}
                    </option>
                  </select>
                </div>
                <div class="form-field">
                  <label>Descripción personal</label>
                  <input v-model="formTemp.descripcion_personal" type="text" placeholder="Cuéntanos sobre ti..." />
                </div>
              </template>

              <template v-if="tipoModal === 'contacto'">
                <div class="form-field">
                  <label>Número de celular</label>
                  <input v-model="formTemp.telefono_numero" type="tel" placeholder="+1 809 000 0000" />
                </div>
                <div class="form-field">
                  <label>Correo electrónico</label>
                  <input v-model="formTemp.email" type="email" placeholder="tu@email.com" />
                  <span v-if="errores.email" class="error">{{ errores.email }}</span>
                </div>
                <div class="form-field">
                  <label>Contacto de emergencias (nombre)</label>
                  <input v-model="formTemp.contacto_emergencia_nombre" type="text" />
                </div>
                <div class="form-field">
                  <label>Contacto de emergencias (teléfono)</label>
                  <input v-model="formTemp.contacto_emergencia_tel" type="tel" />
                </div>
                <div class="form-field">
                  <label>Dirección / Ubicación</label>
                  <input v-model="formTemp.ubicacion_nombre" type="text" placeholder="Ciudad, País" />
                </div>
              </template>

              <template v-if="tipoModal === 'aeropuerto'">
                <div class="form-field">
                  <label>TSA PreCheck</label>
                  <input v-model="formTemp.num_viajero_conocido" type="text" placeholder="Número de viajero conocido" />
                </div>
                <div class="form-field">
                  <label>DHS TRIP / Redress Number</label>
                  <input v-model="formTemp.num_dhs_trip" type="text" placeholder="Número DHS TRIP" />
                </div>
              </template>

              <template v-if="tipoModal === 'documentacion'">
                <div class="form-field">
                  <label>Número de Pasaporte / ID</label>
                  <input v-model="formTemp.documento_numero" type="text" />
                </div>
                <div class="form-row-2">
                  <div class="form-field">
                    <label>Fecha de emisión</label>
                    <input v-model="formTemp.documento_emision" type="date" />
                  </div>
                  <div class="form-field">
                    <label>Fecha de expiración</label>
                    <input v-model="formTemp.documento_expiracion" type="date" />
                  </div>
                </div>
                <div class="form-field">
                  <label>País emisor</label>
                  <input v-model="formTemp.documento_emisor" type="text" placeholder="País emisor" />
                </div>
              </template>

              <template v-if="tipoModal === 'biometricos'">
                <div class="form-row-2">
                  <div class="form-field">
                    <label>Tipo de sangre</label>
                    <select v-model="formTemp.sangre">
                      <option value="">Sin información</option>
                      <option v-for="t in ['A+','A-','B+','B-','O+','O-','AB+','AB-']" :key="t" :value="t">{{ t }}</option>
                    </select>
                  </div>
                  <div class="form-field">
                    <label>Estado civil</label>
                    <input v-model="formTemp.estado_civil" type="text" placeholder="Soltero/a, Casado/a..." />
                  </div>
                </div>
                <div class="form-row-2">
                  <div class="form-field">
                    <label>Estatura (cm)</label>
                    <input v-model="formTemp.estatura" type="number" placeholder="165" />
                  </div>
                  <div class="form-field">
                    <label>Peso (kg)</label>
                    <input v-model="formTemp.peso" type="number" placeholder="60" />
                  </div>
                </div>
                <div class="form-row-2">
                  <div class="form-field">
                    <label>Ocupación</label>
                    <input v-model="formTemp.ocupacion" type="text" />
                  </div>
                  <div class="form-field">
                    <label>Nacionalidad</label>
                    <input v-model="formTemp.nacionalidad" type="text" />
                  </div>
                </div>
              </template>

              <div v-if="guardando"     class="save-status saving">Guardando...</div>
              <div v-if="guardadoOk"    class="save-status ok">✓ Cambios guardados</div>
              <div v-if="guardadoError" class="save-status err">✗ Error al guardar. Intenta de nuevo.</div>

              <button class="btn-confirm" :disabled="guardando" @click="guardarCambios">
                {{ guardando ? 'Guardando...' : 'Guardar cambios' }}
              </button>
            </div>
          </div>
        </transition>

        <!-- ═══════════════════════════════════════════════════
             MODAL TARJETA — campos completos (BD: TIPO, ULTIMOS4,
             NOMBRE_TITULAR, MES_EXP, ANO_EXP, CODIGO_POSTAL, GUARDADA)
        ════════════════════════════════════════════════════════ -->
        <transition name="modal-fade">
          <div v-if="mostrarModalTarjeta" class="modal-overlay" @click.self="cerrarModalTarjeta">
            <div class="modal-box">
              <div class="modal-header">
                <h3>Agregar tarjeta</h3>
                <button class="modal-close" @click="cerrarModalTarjeta">✕</button>
              </div>

              <!-- TIPO → BD: TIPO -->
              <div class="form-field">
                <label>Tipo de tarjeta</label>
                <select v-model="formTarjeta.tipo">
                  <option value="Visa">Visa</option>
                  <option value="Mastercard">Mastercard</option>
                  <option value="Amex">American Express</option>
                </select>
              </div>

              <!-- NUMERO → BD: ULTIMOS4 (backend extrae los últimos 4) -->
              <div class="form-field">
                <label>Número de tarjeta</label>
                <input
                  :value="formTarjeta.numero"
                  @input="formatearNumeroTarjeta"
                  type="text"
                  placeholder="0000 0000 0000 0000"
                  maxlength="19"
                />
              </div>

              <!-- NOMBRE → BD: NOMBRE_TITULAR -->
              <div class="form-field">
                <label>Nombre en la tarjeta</label>
                <input v-model="formTarjeta.nombre" type="text" placeholder="Como aparece en la tarjeta" />
              </div>

              <!-- EXPIRACION → BD: MES_EXP + ANO_EXP (backend hace el split) -->
              <div class="form-row-2">
                <div class="form-field">
                  <label>Vencimiento (MM/AA)</label>
                  <input
                    :value="formTarjeta.expiracion"
                    @input="formatearExpiracion"
                    type="text"
                    placeholder="MM/AA"
                    maxlength="5"
                  />
                </div>
                <!-- CVV → NO se guarda en BD, solo validación visual -->
                <div class="form-field">
                  <label>CVV</label>
                  <input v-model="formTarjeta.cvv" type="password" placeholder="•••" maxlength="4" />
                  <span style="font-size:11px; color:#888; margin-top:2px; display:block;">
                    El CVV no se almacena
                  </span>
                </div>
              </div>

              <!-- CODIGO_POSTAL → BD: CODIGO_POSTAL (opcional, varchar 10) -->
              <div class="form-field">
                <label>Código postal <span style="color:#aaa; font-weight:400;">(opcional)</span></label>
                <input
                  v-model="formTarjeta.codigoPostal"
                  type="text"
                  placeholder="Ej. 10001"
                  maxlength="10"
                />
              </div>

              <!-- GUARDAR → BD: GUARDADA (boolean, default false) -->
              <div class="form-field" style="display:flex; align-items:center; gap:10px; padding:6px 0;">
                <input
                  type="checkbox"
                  id="guardar-tarjeta-check"
                  v-model="formTarjeta.guardar"
                  style="width:16px; height:16px; cursor:pointer; accent-color: var(--color-primary, #265073);"
                />
                <label
                  for="guardar-tarjeta-check"
                  style="font-weight:400; font-size:14px; cursor:pointer; color:var(--color-text-primary, #222); margin:0;"
                >
                  Guardar tarjeta para futuras compras
                </label>
              </div>

              <div v-if="guardandoTarjeta" class="save-status saving">Guardando tarjeta...</div>
              <div v-if="errorTarjeta" class="error" style="margin-bottom:0.5rem;">{{ errorTarjeta }}</div>

              <button class="btn-confirm" :disabled="guardandoTarjeta" @click="guardarTarjeta">
                {{ guardandoTarjeta ? 'Guardando...' : 'Guardar tarjeta' }}
              </button>
            </div>
          </div>
        </transition>

        <!-- MODAL NOTIFICACIÓN -->
        <transition name="modal-fade">
          <div v-if="mostrarModalNotif" class="modal-overlay" @click.self="mostrarModalNotif = false">
            <div class="modal-box">
              <div class="modal-header">
                <h3>{{ notifModalTitulo }}</h3>
                <button class="modal-close" @click="mostrarModalNotif = false">✕</button>
              </div>
              <p style="font-size:14px; color:#555; margin-bottom:1.25rem;">Elige cómo quieres recibir estas notificaciones.</p>
              <div v-for="canal in canalesNotif" :key="canal.key" class="nf-item" style="padding:10px 0; border-bottom:1px solid #eee; display:flex; align-items:center; justify-content:space-between;">
                <span style="font-size:14px;">{{ canal.label }}</span>
                <button class="nf-toggle-btn" :class="{ on: notifConfig[notifModalKey][canal.key] }" @click="notifConfig[notifModalKey][canal.key] = !notifConfig[notifModalKey][canal.key]"></button>
              </div>
              <button class="btn-confirm" style="margin-top:1.25rem;" @click="mostrarModalNotif = false">Listo</button>
            </div>
          </div>
        </transition>

        <!-- MODAL SEGURIDAD -->
        <transition name="modal-fade">
          <div v-if="mostrarModalSeguridad" class="modal-overlay" @click.self="cerrarModalSeguridad">
            <div class="modal-box">
              <div class="modal-header">
                <h3>{{ seguridadModalTitulo }}</h3>
                <button class="modal-close" @click="cerrarModalSeguridad">✕</button>
              </div>
              <div class="form-field">
                <label>{{ seguridadModalLabel }}</label>
                <input v-model="seguridadValor" :type="seguridadTipoInput" :placeholder="seguridadModalPlaceholder" />
              </div>
              <div v-if="seguridadTipoModal === 'password'" class="form-field">
                <label>Nueva contraseña</label>
                <input v-model="seguridadNuevaPass" type="password" placeholder="Nueva contraseña" />
              </div>
              <span v-if="errorSeguridad" class="error">{{ errorSeguridad }}</span>
              <div v-if="seguridadOk" class="save-status ok">✓ Actualizado correctamente</div>
              <button class="btn-confirm" @click="guardarSeguridad">Guardar</button>
            </div>
          </div>
        </transition>

        <!-- ═══════════════════════════════════════
             SECCIÓN: PERFIL
        ════════════════════════════════════════════ -->
        <div v-if="activeSection === 'perfil'" class="section-wrap">
          <h1 class="section-title">{{ perfil.nombre_completo || 'Mi Perfil' }}</h1>

          <div class="info-block">
            <div class="info-block-header">
              <div>
                <h2>Información básica</h2>
                <p class="info-desc">Asegúrate de que estos datos coincidan con tu identificación oficial.</p>
              </div>
              <button class="btn-edit" @click="abrirModal('basico')">Editar</button>
            </div>
            <div class="info-grid-4">
              <div class="info-cell">
                <span class="cell-label">Nombre completo</span>
                <span class="cell-value" :class="{ muted: !perfil.nombre_completo }">
                  {{ [perfil.nombre_completo, perfil.apellidos].filter(Boolean).join(' ') || 'Sin información' }}
                </span>
              </div>
              <div class="info-cell">
                <span class="cell-label">Descripción personal</span>
                <span class="cell-value muted">{{ perfil.descripcion_personal || 'Sin información' }}</span>
              </div>
              <div class="info-cell">
                <span class="cell-label">Fecha de nacimiento</span>
                <span class="cell-value" :class="{ muted: !perfil.fecha_nacimiento }">{{ perfil.fecha_nacimiento || 'Sin información' }}</span>
              </div>
              <div class="info-cell">
                <span class="cell-label">Género</span>
                <span class="cell-value" :class="{ muted: !perfil.genero }">{{ generoLabel(perfil.genero) }}</span>
              </div>
              <div class="info-cell">
                <span class="cell-label">País / Región</span>
                <span class="cell-value" :class="{ muted: !perfil.pais_nombre }">{{ perfil.pais_nombre || 'Sin información' }}</span>
              </div>
            </div>
          </div>

          <div class="info-block">
            <div class="info-block-header">
              <div>
                <h2>Datos de contacto</h2>
                <p class="info-desc">Proporciona la siguiente información para iniciar sesión y recibir alertas.</p>
              </div>
              <button class="btn-edit" @click="abrirModal('contacto')">Editar</button>
            </div>
            <div class="info-grid-4">
              <div class="info-cell">
                <span class="cell-label">Número de celular</span>
                <span class="cell-value" :class="{ muted: !perfil.telefono_numero }">{{ perfil.telefono_numero || 'Sin información' }}</span>
              </div>
              <div class="info-cell">
                <span class="cell-label">Correo electrónico</span>
                <span class="cell-value">{{ perfil.email }}</span>
              </div>
              <div class="info-cell">
                <span class="cell-label">Contacto de emergencias</span>
                <span class="cell-value" :class="{ muted: !perfil.contacto_emergencia_nombre }">
                  {{ perfil.contacto_emergencia_nombre || 'Sin información' }}
                </span>
              </div>
              <div class="info-cell">
                <span class="cell-label">Dirección</span>
                <span class="cell-value" :class="{ muted: !perfil.ubicacion_nombre }">{{ perfil.ubicacion_nombre || 'Sin información' }}</span>
              </div>
            </div>
          </div>

          <div class="info-block">
            <div class="info-block-header">
              <div>
                <h2>Más detalles</h2>
                <p class="info-desc">Agiliza tu reservación al guardar información indispensable de tu viaje.</p>
              </div>
            </div>
            <div class="details-grid">
  <button class="detail-card" @click="abrirModal('aeropuerto')">
    <div class="detail-card-text">
      <span class="detail-title">Seguridad del aeropuerto</span>
      <span class="detail-sub">
        {{ perfil.num_viajero_conocido || perfil.num_dhs_trip
            ? [perfil.num_viajero_conocido ? 'TSA: ' + perfil.num_viajero_conocido : '',
               perfil.num_dhs_trip ? 'DHS: ' + perfil.num_dhs_trip : '']
               .filter(Boolean).join(' · ')
            : 'Números de TSA PreCheck y DHS TRIP (Redress)' }}
      </span>
    </div>
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"/></svg>
  </button>

  <button class="detail-card" @click="abrirModal('documentacion')">
    <div class="detail-card-text">
      <span class="detail-title">Documentos de viaje</span>
      <span class="detail-sub">
        {{ perfil.DOCUMENTACION?.NUMERO_DOCUMENTACION
            ? 'Pasaporte: ' + perfil.DOCUMENTACION.NUMERO_DOCUMENTACION +
              (perfil.DOCUMENTACION.FECHA_EXPIRACION ? ' · Vence ' + perfil.DOCUMENTACION.FECHA_EXPIRACION : '')
            : 'Pasaporte / ID' }}
      </span>
    </div>
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"/></svg>
  </button>

  <button class="detail-card" @click="abrirModal('biometricos')">
    <div class="detail-card-text">
      <span class="detail-title">Datos biográficos & Salud</span>
      <span class="detail-sub">
        {{ [
              perfil.SANGRE    ? 'Sangre: ' + perfil.SANGRE : '',
              perfil.ESTATURA  ? 'Estatura: ' + perfil.ESTATURA + ' cm' : '',
              perfil.PESO      ? 'Peso: ' + perfil.PESO + ' kg' : '',
              perfil.OCUPACION ? perfil.OCUPACION : ''
           ].filter(Boolean).join(' · ') || 'Tipo de sangre, estatura, peso, ocupación' }}
      </span>
    </div>
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"/></svg>
  </button>

  <button class="detail-card">
    <div class="detail-card-text">
      <span class="detail-title">Preferencias de vuelo</span>
      <span class="detail-sub">Preferencia de asiento y aeropuerto más cercano</span>
    </div>
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"/></svg>
  </button>

  <button class="detail-card">
    <div class="detail-card-text">
      <span class="detail-title">Programas de lealtad</span>
      <span class="detail-sub">Viajero frecuente y membresías</span>
    </div>
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"/></svg>
  </button>
</div>
          </div>

          <div class="info-block">
            <div class="info-block-header">
              <div>
                <h2>Personas adicionales</h2>
                <p class="info-desc">Guarda los perfiles de familiares, amigos o compañeros que suelen viajar contigo.</p>
              </div>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="18 15 12 9 6 15"/></svg>
            </div>
            <button class="btn-add-person">Agregar persona adicional</button>
          </div>
        </div>

        <!-- ═══════════════════════════════════════
             SECCIÓN: MIS FAVORITOS
        ════════════════════════════════════════════ -->
        <div v-else-if="activeSection === 'favoritos'" class="section-wrap">
          <h1 class="section-title">Mis Favoritos</h1>
          <p class="info-desc">Hospedajes que has guardado para tus próximos viajes.</p>

          <div v-if="cargandoFav" class="fav-status">Cargando tus favoritos...</div>
          <div v-else-if="favoritos.length === 0" class="fav-empty-state">
            <div class="fav-empty-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="#265073" stroke-width="1.2"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/></svg>
            </div>
            <p>No tienes favoritos guardados todavía.</p>
            <button class="btn-confirm" style="width:auto; padding:10px 24px;" @click="$router.push('/')">Explorar hospedajes</button>
          </div>

          <div v-else class="fav-grid">
            <div v-for="fav in favoritos" :key="fav.id" class="fav-card" @click="irADetalle(fav.id)">
              <div class="fav-card-img">
                <img :src="fav.imagen || 'https://images.unsplash.com/photo-1566073771259-6a8506099945'" alt="Hospedaje" />
                <button class="btn-fav-remove" @click.stop="quitarFavorito(fav.id)" title="Quitar de favoritos">✕</button>
              </div>
              <div class="fav-card-body">
                <span class="fav-tag">{{ fav.tipo || 'Hospedaje' }}</span>
                <h3 class="fav-name">{{ fav.nombre }}</h3>
                <p class="fav-loc">{{ fav.ciudad }}, {{ fav.pais }}</p>
                <div class="fav-footer">
                  <span class="fav-price">${{ Math.round(fav.precio) }} <small>/ noche</small></span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- ═══════════════════════════════════════
             SECCIÓN: NOTIFICACIONES
        ════════════════════════════════════════════ -->
        <div v-else-if="activeSection === 'notificaciones'" class="section-wrap">
          <div class="nf-wrap">
            <div class="nf-header">
              <p class="nf-eyebrow">Mi cuenta</p>
              <h1 class="nf-title">Notificaciones</h1>
            </div>
            <div class="nf-section">
              <p class="nf-section-desc">Elige las notificaciones que quieres recibir.</p>
              <div class="nf-item" @click="abrirModalNotif('general', 'Notificaciones generales')">
                <div class="nf-item-icon">
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <rect x="2" y="2" width="16" height="16" rx="3" fill="#265073"/>
                    <path d="M6 10l3 3 5-5" stroke="#ECF4D6" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                </div>
                <div class="nf-item-text">
                  <p class="nf-item-name">Notificaciones</p>
                  <p class="nf-item-sub">{{ resumenNotif('general') }}</p>
                </div>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" class="nf-chevron">
                  <path d="M6 4l4 4-4 4" stroke="#9AD0C2" stroke-width="1" stroke-linecap="round"/>
                </svg>
              </div>
            </div>
            <div class="nf-divider"></div>
            <div class="nf-section">
              <p class="nf-section-desc">Elige cómo deseas que te notifiquemos sobre las actualizaciones de tu cuenta y de tus recompensas.</p>
              <div class="nf-item" @click="abrirModalNotif('onekey', 'OneKey')">
                <div class="nf-item-icon">
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <circle cx="10" cy="10" r="7" stroke="#265073" stroke-width="1"/>
                    <circle cx="10" cy="10" r="3" stroke="#265073" stroke-width="1"/>
                  </svg>
                </div>
                <div class="nf-item-text">
                  <p class="nf-item-name">OneKey</p>
                  <p class="nf-item-sub">{{ resumenNotif('onekey') }}</p>
                </div>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" class="nf-chevron">
                  <path d="M6 4l4 4-4 4" stroke="#9AD0C2" stroke-width="1" stroke-linecap="round"/>
                </svg>
              </div>
              <div class="nf-item" @click="abrirModalNotif('cuenta', 'Ayuda con la cuenta')">
                <div class="nf-item-icon">
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <rect x="3" y="5" width="14" height="10" rx="1.5" stroke="#265073" stroke-width="1"/>
                    <path d="M3 7l7 5 7-5" stroke="#265073" stroke-width="1" stroke-linecap="round"/>
                  </svg>
                </div>
                <div class="nf-item-text">
                  <p class="nf-item-name">Ayuda con la cuenta</p>
                  <p class="nf-item-sub">{{ resumenNotif('cuenta') }}</p>
                </div>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" class="nf-chevron">
                  <path d="M6 4l4 4-4 4" stroke="#9AD0C2" stroke-width="1" stroke-linecap="round"/>
                </svg>
              </div>
            </div>
          </div>
        </div>

        <!-- ═══════════════════════════════════════
             SECCIÓN: FORMAS DE PAGO
        ════════════════════════════════════════════ -->
        <div v-else-if="activeSection === 'formas-pago'" class="section-wrap">
          <div class="acct-wrap">
            <div class="tabs">
              <div
                v-for="tab in formaPagoTabs"
                :key="tab"
                class="fp-tab"
                :class="{ active: formaPagoTab === tab }"
                @click="formaPagoTab = tab; showPassengerForm = false"
              >{{ tab }}</div>
            </div>

            <!-- TAB: MI CUENTA -->
            <div v-if="formaPagoTab === 'Mi cuenta'" class="fp-panel">
              <div class="fp-section-header">
                <div class="fp-section-title">Métodos de pago guardados</div>
              </div>

              <div v-if="cargandoTarjetas" style="padding:1rem 0; color:#888; font-size:14px;">Cargando tarjetas...</div>
              <div v-if="errorCargaTarjetas" style="padding:0.5rem 0; color:#e53e3e; font-size:13px;">{{ errorCargaTarjetas }}</div>

              <!-- Lista de tarjetas existentes -->
              <div v-if="!cargandoTarjetas && tarjetas.length > 0" style="margin-bottom:1rem;">
                <div v-for="t in tarjetas" :key="t.id" class="fp-row">
                  <div class="fp-row-left-inner">
                    <div class="fp-icon" v-html="iconoTarjeta"></div>
                    <div class="fp-row-left">
                      <div class="fp-row-label">
                        {{ t.tipo }} •••• {{ t.last4 }}
                        <!-- Badge GUARDADA (campo BD) -->
                        <span
                          v-if="t.guardada"
                          style="margin-left:8px; font-size:11px; background:#e6f4ea; color:#1a7a3a; padding:2px 7px; border-radius:20px; font-weight:500; vertical-align:middle;"
                        >Guardada</span>
                      </div>
                      <div class="fp-row-value">
                        {{ t.nombre }} · Vence {{ t.expiracion }}
                        <!-- CODIGO_POSTAL (campo BD) -->
                        <span v-if="t.codigo_postal" style="color:#888;"> · CP {{ t.codigo_postal }}</span>
                      </div>
                    </div>
                  </div>
                  <div class="fp-row-right" style="display:flex; align-items:center; gap:8px;">
                    <!-- Toggle GUARDADA -->
                    <button
                      :title="t.guardada ? 'Quitar de guardadas' : 'Marcar como guardada'"
                      @click="toggleGuardarTarjeta(t)"
                      style="background:none; border:1px solid #ddd; border-radius:6px; padding:3px 8px; font-size:11px; cursor:pointer; color:#555; transition:all .15s;"
                    >{{ t.guardada ? '★ Guardada' : '☆ Guardar' }}</button>
                    <button class="fp-delete-btn" @click="eliminarTarjeta(t.id)" title="Eliminar">✕</button>
                  </div>
                </div>
              </div>

              <!-- Fila para abrir modal de nueva tarjeta -->
              <div class="fp-row" style="cursor:pointer;" @click="abrirModalTarjeta">
                <div class="fp-row-left-inner">
                  <div class="fp-icon" v-html="iconoTarjeta"></div>
                  <div class="fp-row-left">
                    <div class="fp-row-label">Agregar método de pago</div>
                    <div class="fp-row-value muted">
                      {{ cargandoTarjetas ? 'Cargando...' : tarjetas.length === 0 ? 'No tienes tarjetas guardadas' : tarjetas.length + ' tarjeta(s) registrada(s)' }}
                    </div>
                  </div>
                </div>
                <div class="fp-row-right">
                  <span class="fp-badge">Agregar</span>
                  <span class="fp-arrow">›</span>
                </div>
              </div>

              <div v-for="row in formaPagoRowsExtras" :key="row.label" class="fp-row">
                <div class="fp-row-left-inner">
                  <div class="fp-icon" v-html="row.icon"></div>
                  <div class="fp-row-left">
                    <div class="fp-row-label">{{ row.label }}</div>
                    <div class="fp-row-value" :class="{ muted: row.muted }">{{ row.value }}</div>
                  </div>
                </div>
                <div class="fp-row-right">
                  <span v-if="row.badge" class="fp-badge">{{ row.badge }}</span>
                  <span class="fp-arrow">›</span>
                </div>
              </div>
            </div>

            <!-- TAB: OTROS PASAJEROS -->
            <div v-if="formaPagoTab === 'Otros pasajeros'">
              <div v-if="pasajerosGuardados.length > 0" style="margin-bottom:1rem;">
                <div v-for="p in pasajerosGuardados" :key="p.id" class="fp-row">
                  <div class="fp-row-left-inner">
                    <div class="fp-icon">
                      <span style="font-size:14px; font-weight:600; color:#265073;">{{ (p.nombre[0] + (p.apellidos[0] || '')).toUpperCase() }}</span>
                    </div>
                    <div class="fp-row-left">
                      <div class="fp-row-label">{{ p.nombre }} {{ p.apellidos }}</div>
                      <div class="fp-row-value">{{ p.fecha_nacimiento || 'Sin fecha' }} · {{ p.genero === 'M' ? 'Hombre' : p.genero === 'F' ? 'Mujer' : 'Sin género' }}</div>
                    </div>
                  </div>
                  <div class="fp-row-right">
                    <button class="fp-delete-btn" @click="eliminarPasajero(p.id)" title="Eliminar">✕</button>
                  </div>
                </div>
              </div>

              <button v-if="!showPassengerForm" class="fp-add-btn" @click="showPassengerForm = true">Agregar un nuevo pasajero</button>

              <div v-if="showPassengerForm" class="fp-form-container">
                <div class="fp-form-header"><h1 class="fp-form-title">Agregar un nuevo pasajero</h1></div>
                <div class="fp-form-body">
                  <p class="fp-section-label">Información personal</p>
                  <div class="fp-grid-2">
                    <div class="fp-field"><label>Nombre</label><input v-model="formPasajero.nombre" type="text" placeholder="Ej. María" /></div>
                    <div class="fp-field"><label>Segundo nombre</label><input v-model="formPasajero.nombre2" type="text" placeholder="Opcional" /></div>
                  </div>
                  <div class="fp-grid-1">
                    <div class="fp-field"><label>Apellidos</label><input v-model="formPasajero.apellidos" type="text" placeholder="Ej. García López" /></div>
                  </div>
                  <div class="fp-grid-2">
                    <div class="fp-field">
                      <label>Género</label>
                      <div class="fp-radio-group">
                        <label class="fp-radio-label"><input type="radio" v-model="formPasajero.genero" value="M" /><span class="fp-radio-custom"></span>Hombre</label>
                        <label class="fp-radio-label"><input type="radio" v-model="formPasajero.genero" value="F" /><span class="fp-radio-custom"></span>Mujer</label>
                      </div>
                    </div>
                    <div class="fp-field"><label>Fecha de nacimiento</label><input v-model="formPasajero.fecha_nacimiento" type="date" /></div>
                  </div>
                  <div class="fp-grid-2">
                    <div class="fp-field"><label>Teléfono</label><input v-model="formPasajero.telefono" type="tel" placeholder="+1 809 000 0000" /></div>
                    <div class="fp-field"><label>Otro teléfono</label><input v-model="formPasajero.telefono2" type="tel" placeholder="Opcional" /></div>
                  </div>
                  <span v-if="errorPasajero" class="error">{{ errorPasajero }}</span>
                  <div class="fp-actions">
                    <button class="fp-btn-primary" @click="guardarPasajero">Guardar</button>
                    <button class="fp-btn-ghost" @click="showPassengerForm = false; errorPasajero = ''">Cancelar</button>
                  </div>
                </div>
              </div>
            </div>

            <div class="fp-footer-link">
              ¿Tienes preguntas sobre tu cuenta?
              <a href="#">Preguntas frecuentes sobre la configuración de la cuenta</a>
            </div>
          </div>
        </div>

        <!-- SECCIÓN: AYUDA Y COMENTARIOS -->
        <div v-else-if="activeSection === 'ayuda'" class="section-wrap">
          <div class="help-wrapper">
            <h1 class="help-page-title">Ayuda y comentarios</h1>
            <p class="help-page-desc">¿Tienes dudas o comentarios? Queremos conocerlos.</p>
            <div class="help-items-list">
              <button v-for="item in helpItems" :key="item.id" class="help-item" @click="item.action && item.action()">
                <div class="help-item-left">
                  <div class="help-item-icon" v-html="item.iconHtml"></div>
                  <p class="help-item-label">{{ item.label }}</p>
                </div>
                <svg class="help-chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18l6-6-6-6" /></svg>
              </button>
            </div>
          </div>
          <transition name="modal-fade">
            <div v-if="mostrarFormComentario" class="fp-form-container" style="margin-top:1.5rem;">
              <div class="fp-form-header"><h1 class="fp-form-title">Compartir comentarios</h1></div>
              <div class="fp-form-body">
                <div class="fp-field">
                  <label>¿Cómo podemos mejorar?</label>
                  <textarea v-model="textoComentario" rows="4" placeholder="Escribe tu comentario aquí..." style="width:100%; padding:8px; border:1px solid #ddd; border-radius:8px; font-size:14px; resize:vertical;"></textarea>
                </div>
                <div v-if="comentarioEnviado" class="save-status ok">✓ Comentario enviado. ¡Gracias!</div>
                <div class="fp-actions">
                  <button class="fp-btn-primary" @click="enviarComentario">Enviar</button>
                  <button class="fp-btn-ghost" @click="mostrarFormComentario = false; textoComentario = ''; comentarioEnviado = false">Cancelar</button>
                </div>
              </div>
            </div>
          </transition>
        </div>

        <!-- SECCIÓN: SEGURIDAD -->
        <div v-else-if="activeSection === 'seguridad'" class="section-wrap">
          <div class="settings-wrapper">
            <h1 class="sc-page-title">Seguridad y configuración</h1>
            <section class="sc-section">
              <h2 class="sc-section-title">Inicio de sesión y seguridad</h2>
              <p class="sc-section-desc">Mantén tu cuenta protegida con una contraseña segura, además de cerrar sesiones en otros dispositivos que no estés usando.</p>
              <div class="sc-items-list">
                <button v-for="item in loginItems" :key="item.id" class="sc-item" @click="abrirModalSeguridad(item)">
                  <div class="sc-item-left">
                    <div class="sc-item-icon">
                      <svg v-if="item.type === 'email'"   viewBox="0 0 24 24" fill="none" stroke="#2D9596" stroke-width="1.5"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 7l9 6 9-6"/></svg>
                      <svg v-else-if="item.type === 'phone'"    viewBox="0 0 24 24" fill="none" stroke="#2D9596" stroke-width="1.5"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3"/></svg>
                      <svg v-else-if="item.type === 'password'" viewBox="0 0 24 24" fill="none" stroke="#2D9596" stroke-width="1.5"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                      <svg v-else-if="item.type === 'link'"     viewBox="0 0 24 24" fill="none" stroke="#2D9596" stroke-width="1.5"><path d="M10 13a5 5 0 0 0 7.54.54l2-2a5 5 0 0 0-7.07-7.07l-1.5 1.5"/><path d="M14 11a5 5 0 0 0-7.54-.54l-2 2a5 5 0 0 0 7.07 7.07l1.5-1.5"/></svg>
                      <svg v-else-if="item.type === 'devices'"  viewBox="0 0 24 24" fill="none" stroke="#2D9596" stroke-width="1.5"><rect x="3" y="4" width="18" height="12" rx="2"/><path d="M8 20h8"/></svg>
                    </div>
                    <div>
                      <p class="sc-item-label">{{ item.label }}</p>
                      <p v-if="item.value" class="sc-item-value">{{ item.value }}</p>
                    </div>
                  </div>
                  <svg class="sc-chevron" viewBox="0 0 24 24" fill="none" stroke="#9AD0C2" stroke-width="1.5"><path d="M9 18l6-6-6-6"/></svg>
                </button>
              </div>
            </section>
            <div class="sc-divider"></div>
            <section class="sc-section">
              <h2 class="sc-section-title">Administración de la cuenta</h2>
              <p class="sc-section-desc">Más opciones de administración de tus datos, como la eliminación de tu cuenta.</p>
              <div class="sc-items-list">
                <button v-for="item in accountItems" :key="item.id" class="sc-item">
                  <div class="sc-item-left">
                    <div class="sc-item-icon">
                      <svg viewBox="0 0 24 24" fill="none" stroke="#2D9596" stroke-width="1.5"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 16-4 16 0"/></svg>
                    </div>
                    <p class="sc-item-label">{{ item.label }}</p>
                  </div>
                  <svg class="sc-chevron" viewBox="0 0 24 24" fill="none" stroke="#9AD0C2" stroke-width="1.5"><path d="M9 18l6-6-6-6"/></svg>
                </button>
              </div>
              <p class="sc-danger-link" @click="confirmarEliminarCuenta">Eliminar cuenta</p>
              <p class="sc-danger-desc">Elimina tus datos y cuenta de forma permanente.</p>
            </section>
          </div>
        </div>

        <!-- SECCIÓN: CRÉDITOS -->
        <div v-else-if="activeSection === 'creditos'" class="section-wrap">
          <div class="credits-wrapper">
            <p class="cr-section-label">Créditos</p>
            <div class="cr-tip-card">
              <div class="cr-tip-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="#9AD0C2" stroke-width="1.5" stroke-linecap="round"><circle cx="12" cy="12" r="10"/><path d="M12 8v4M12 16h.01"/></svg>
              </div>
              <div>
                <p class="cr-tip-title">Usa tu crédito antes de que venza</p>
                <p class="cr-tip-body">La política de vencimiento varía según la aerolínea. Te recomendamos reservar y completar tu viaje antes de la fecha límite.</p>
              </div>
            </div>
            <div class="cr-available-section">
              <p class="cr-available-label">Créditos disponibles</p>
              <div class="cr-divider"></div>
              <div v-if="creditos.length > 0">
                <div v-for="c in creditos" :key="c.id" class="fp-row" style="margin-bottom:.5rem;">
                  <div class="fp-row-left-inner">
                    <div class="fp-icon">
                      <svg viewBox="0 0 24 24" fill="none" stroke="#2D9596" stroke-width="1.5" stroke-linecap="round" width="16" height="16"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 10h18"/></svg>
                    </div>
                    <div class="fp-row-left">
                      <div class="fp-row-label">{{ c.aerolinea }}</div>
                      <div class="fp-row-value">${{ c.monto }} · Vence {{ c.vencimiento }}</div>
                    </div>
                  </div>
                  <button class="fp-delete-btn" @click="eliminarCredito(c.id)">✕</button>
                </div>
              </div>
              <div v-else class="cr-empty-state">
                <div class="cr-empty-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="#2D9596" stroke-width="1.5" stroke-linecap="round"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 10h18"/></svg>
                </div>
                <p>No tienes créditos disponibles</p>
              </div>
              <button v-if="!mostrarFormCredito" class="fp-add-btn" style="margin-top:1rem;" @click="mostrarFormCredito = true">Agregar crédito de aerolínea</button>
              <div v-if="mostrarFormCredito" class="fp-form-container" style="margin-top:1rem;">
                <div class="fp-form-body">
                  <div class="fp-grid-2">
                    <div class="fp-field"><label>Aerolínea</label><input v-model="formCredito.aerolinea" type="text" placeholder="Ej. American Airlines" /></div>
                    <div class="fp-field"><label>Monto (USD)</label><input v-model="formCredito.monto" type="number" placeholder="150" /></div>
                  </div>
                  <div class="fp-field"><label>Fecha de vencimiento</label><input v-model="formCredito.vencimiento" type="date" /></div>
                  <span v-if="errorCredito" class="error">{{ errorCredito }}</span>
                  <div class="fp-actions">
                    <button class="fp-btn-primary" @click="guardarCredito">Guardar</button>
                    <button class="fp-btn-ghost" @click="mostrarFormCredito = false; errorCredito = ''">Cancelar</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- SECCIÓN: OPINIONES -->
        <div v-else-if="activeSection === 'opiniones'" class="section-wrap">
          <div class="opinions-wrapper">
            <div v-if="opiniones.length > 0">
              <h2 style="font-size:16px; font-weight:500; margin-bottom:1rem;">Mis reseñas</h2>
              <div v-for="op in opiniones" :key="op.id" class="fp-row" style="align-items:flex-start; gap:12px; margin-bottom:.75rem; border:1px solid #eee; border-radius:10px; padding:12px;">
                <div style="flex:1;">
                  <div style="display:flex; align-items:center; gap:6px; margin-bottom:4px;">
                    <span style="font-size:13px; font-weight:500;">{{ op.titulo }}</span>
                    <span style="font-size:12px; color:#aaa;">· {{ op.fecha }}</span>
                  </div>
                  <div style="margin-bottom:4px;">
                    <span v-for="n in 5" :key="n" :style="{ fontSize: '14px', color: n <= op.estrellas ? '#f5a623' : '#ddd' }">★</span>
                  </div>
                  <p style="font-size:13px; color:#555;">{{ op.texto }}</p>
                </div>
                <button class="fp-delete-btn" @click="eliminarOpinion(op.id)">✕</button>
              </div>
            </div>
            <div v-else class="op-empty-state">
              <div class="op-empty-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
              </div>
              <h2 class="op-empty-title">¡Aún no has escrito reseñas!</h2>
              <p class="op-empty-subtitle">Tus opiniones ayudan a otros viajeros a tomar mejores decisiones.</p>
            </div>
            <button v-if="!mostrarFormOpinion" class="fp-add-btn" style="margin-top:1.25rem;" @click="mostrarFormOpinion = true">Escribir una reseña</button>
            <div v-if="mostrarFormOpinion" class="fp-form-container" style="margin-top:1rem;">
              <div class="fp-form-header"><h1 class="fp-form-title">Nueva reseña</h1></div>
              <div class="fp-form-body">
                <div class="fp-field"><label>Título</label><input v-model="formOpinion.titulo" type="text" placeholder="Ej. Excelente experiencia" /></div>
                <div class="fp-field">
                  <label>Calificación</label>
                  <div style="display:flex; gap:6px; margin-top:4px;">
                    <span v-for="n in 5" :key="n" style="font-size:24px; cursor:pointer; transition:.1s;" :style="{ color: n <= formOpinion.estrellas ? '#f5a623' : '#ddd' }" @click="formOpinion.estrellas = n">★</span>
                  </div>
                </div>
                <div class="fp-field">
                  <label>Comentario</label>
                  <textarea v-model="formOpinion.texto" rows="3" placeholder="Cuéntanos tu experiencia..." style="width:100%; padding:8px; border:1px solid #ddd; border-radius:8px; font-size:14px; resize:vertical;"></textarea>
                </div>
                <span v-if="errorOpinion" class="error">{{ errorOpinion }}</span>
                <div class="fp-actions">
                  <button class="fp-btn-primary" @click="guardarOpinion">Publicar</button>
                  <button class="fp-btn-ghost" @click="mostrarFormOpinion = false; errorOpinion = ''">Cancelar</button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- SECCIÓN: CUPONES -->
        <div v-else-if="activeSection === 'cupones'" class="section-wrap">
          <div class="cup-wrap">
            <div class="cup-header">
              <div>
                <p class="cup-eyebrow">Mi cuenta</p>
                <h1 class="cup-title">Cupones</h1>
                <a class="cup-link" href="#">Cómo usar los cupones
                  <svg width="10" height="10" viewBox="0 0 10 10" fill="none"><path d="M1.5 8.5L8.5 1.5M8.5 1.5H3.5M8.5 1.5V6.5" stroke="currentColor" stroke-width="1"/></svg>
                </a>
              </div>
            </div>
            <p class="cup-section-label">Cupones activos</p>
            <div v-if="cupones.length === 0" class="cup-empty">
              <div class="cup-icon-wrap">
                <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
                  <path d="M2 11L4.5 5H17.5L20 11" stroke="#2D9596" stroke-width="0.8"/>
                  <rect x="2" y="11" width="18" height="7" rx="1" stroke="#2D9596" stroke-width="0.8"/>
                  <circle cx="11" cy="11" r="1.5" stroke="#2D9596" stroke-width="0.8"/>
                  <line x1="11" y1="11" x2="11" y2="18" stroke="#2D9596" stroke-width="0.8" stroke-dasharray="1.5 1"/>
                </svg>
              </div>
              <div>
                <p class="cup-empty-title">No tienes cupones activos</p>
                <p class="cup-empty-sub">Los cupones disponibles aparecerán aquí automáticamente.</p>
              </div>
            </div>
            <div v-else class="cup-list">
              <div v-for="cupon in cupones" :key="cupon.id" class="cup-item">
                <div class="cup-item-icon">
                  <svg width="18" height="18" viewBox="0 0 22 22" fill="none">
                    <path d="M2 11L4.5 5H17.5L20 11" stroke="#2D9596" stroke-width="0.8"/>
                    <rect x="2" y="11" width="18" height="7" rx="1" stroke="#2D9596" stroke-width="0.8"/>
                  </svg>
                </div>
                <div class="cup-item-info">
                  <p class="cup-item-code">{{ cupon.codigo }}</p>
                  <p class="cup-item-desc">{{ cupon.descripcion }}</p>
                </div>
                <span class="cup-item-badge">{{ cupon.descuento }}</span>
              </div>
            </div>
            <div class="cup-divider"></div>
            <p class="cup-section-label" style="margin-bottom:0.5rem;">¿Tienes un código?</p>
            <p class="cup-sub-text">Ingresa tu código promocional para activar tu descuento.</p>
            <div class="cup-input-row">
              <input v-model="codigoCupon" class="cup-input" type="text" placeholder="Ej. PROMO2025" @keyup.enter="canjearCupon" />
              <button class="cup-cta" @click="canjearCupon" :disabled="!codigoCupon.trim()">Canjear</button>
            </div>
            <p v-if="mensajeCupon" class="cup-mensaje" :class="{ error: mensajeCuponError }">{{ mensajeCupon }}</p>
          </div>
        </div>

        <!-- FALLBACK -->
        <div v-else class="section-wrap empty-section">
          <h1 class="section-title">{{ navItems.find(n => n.key === activeSection)?.label }}</h1>
          <p class="empty-text">Próximamente. Estamos trabajando en esta sección para ofrecerte la mejor experiencia.</p>
        </div>

      </main>
    </div>
    <footer />
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import Header from '../components/Header.vue'
import footer from '../components/footer.vue'
import { apiGet, apiPut, apiDelete } from '../services/api'

const activeSection = ref('perfil')
const router = useRouter()

const mostrarModal  = ref(false)
const tipoModal     = ref('')
const guardando     = ref(false)
const guardadoOk    = ref(false)
const guardadoError = ref(false)

const modalTitles = {
  basico:        'Información básica',
  contacto:      'Datos de contacto',
  aeropuerto:    'Seguridad del aeropuerto',
  documentacion: 'Documentos de viaje',
  biometricos:   'Datos biográficos & Salud'
}

const navItems = [
  { key: 'perfil',         label: 'Perfil',                   sub: 'Ingresa tus datos personales y documentos de viaje', svg: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>` },
  { key: 'favoritos',      label: 'Mis Favoritos',            sub: 'Consulta tus hospedajes guardados',                  svg: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/></svg>` },
  { key: 'notificaciones', label: 'Notificaciones',            sub: 'Elige las notificaciones que quieres recibir',       svg: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 01-3.46 0"/></svg>` },
  { key: 'formas-pago',    label: 'Formas de pago',            sub: 'Consulta las formas de pago guardadas',              svg: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>` },
  { key: 'cupones',        label: 'Cupones',                   sub: 'Consulta los cupones disponibles',                   svg: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/></svg>` },
  { key: 'creditos',       label: 'Créditos',                  sub: 'Consulta los créditos de aerolínea activos',         svg: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/></svg>` },
  { key: 'opiniones',      label: 'Opiniones',                 sub: 'Lee las opiniones que has enviado',                  svg: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>` },
  { key: 'seguridad',      label: 'Seguridad y configuración', sub: 'Actualiza el correo o contraseña',                   svg: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>` },
  { key: 'ayuda',          label: 'Ayuda y comentarios',       sub: 'Obtén asistencia',                                   svg: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>` },
]

// ── Estado del perfil ─────────────────────────────────────────
const perfil = reactive({
  id_persona: null,
  nombre_completo: localStorage.getItem('user_name') || '',
  apellidos: '',
  num_viajero_conocido: '',
  num_dhs_trip: '',
  ubicacion_nombre: '',
  ciudad_nombre: '',
  pais_nombre: '',
  id_ubicacion: null,
  id_ciudad: null,
  id_pais: null,
  contacto_emergencia_nombre: '',
  contacto_emergencia_tel: '',
  email: localStorage.getItem('user_email') || '',
  telefono_numero: '',
  fecha_nacimiento: '',
  genero: '',
  descripcion_personal: '',
  puntos: 0,
  nivel_membresia: 'Blue',
  numero_miembro: '',
  photo: null,
  initial: '?',
  SANGRE: '',
  ESTATURA: '',
  PESO: '',
  OCUPACION: '',
  NACIONALIDAD: '',
  ESTADO_CIVIL: '',
  DOCUMENTACION: {
    NUMERO_DOCUMENTACION: '',
    FECHA_EMISION: '',
    FECHA_EXPIRACION: '',
    EMISOR: ''
  }
})

const formTemp = reactive({
  nombre_completo: '', apellidos: '', fecha_nacimiento: '', genero: '',
  descripcion_personal: '', ubicacion_nombre: '', contacto_emergencia_nombre: '',
  contacto_emergencia_tel: '', email: '', telefono_numero: '',
  num_viajero_conocido: '', num_dhs_trip: '', sangre: '', estatura: '',
  peso: '', ocupacion: '', nacionalidad: '', estado_civil: '',
  documento_numero: '', documento_emision: '', documento_expiracion: '', documento_emisor: '',
  id_pais: '', id_ciudad: '', id_ubicacion: ''
})

// ── Lógica de Favoritos ───────────────────────────────────────
const favoritos = ref([])
const cargandoFav = ref(false)

async function cambiarSeccion(key) {
  activeSection.value = key
  if (key === 'favoritos') {
    await fetchFavoritos()
  }
}

async function fetchFavoritos() {
  try {
    cargandoFav.value = true
    // Consultamos al endpoint GET /api/favoritos
    const data = await apiGet('/favoritos')
    // El backend ya devuelve los campos normalizados: 
    // id, nombre, ciudad, pais, descripcion, imagen, precio, tipo
    favoritos.value = data
  } catch (e) {
    console.error('Error al cargar favoritos:', e)
  } finally { cargandoFav.value = false }
}

async function quitarFavorito(id) {
  try {
    // Eliminamos desde el perfil usando el ID del hospedaje
    await apiDelete(`/favoritos/${id}`)
    favoritos.value = favoritos.value.filter(f => f.id !== id)
  } catch (e) { 
    alert('No se pudo quitar de favoritos. Intenta de nuevo.') 
  }
}
function irADetalle(id) { router.push(`/hospedaje/${id}`) }

const errores = reactive({})

const listaPaises         = ref([])
const listaCiudades       = ref([])
const listaUbicaciones    = ref([])
const cargandoPaises      = ref(false)
const cargandoCiudades    = ref(false)
const cargandoUbicaciones = ref(false)

async function fetchPaises() {
  if (listaPaises.value.length) return
  try {
    cargandoPaises.value = true
    listaPaises.value = await apiGet('/catalogos/paises')
  } catch (e) {
    console.error('Error cargando países:', e)
  } finally { cargandoPaises.value = false }
}

async function onPaisChange() {
  formTemp.id_ciudad     = ''
  formTemp.id_ubicacion  = ''
  listaCiudades.value    = []
  listaUbicaciones.value = []
  if (!formTemp.id_pais) return
  try {
    cargandoCiudades.value = true
    listaCiudades.value = await apiGet(`/catalogos/ciudades?id_pais=${formTemp.id_pais}`)
  } catch (e) {
    console.error('Error cargando ciudades:', e)
  } finally { cargandoCiudades.value = false }
}

async function onCiudadChange() {
  formTemp.id_ubicacion  = ''
  listaUbicaciones.value = []
  if (!formTemp.id_ciudad) return
  try {
    cargandoUbicaciones.value = true
    const idCiudad = parseInt(formTemp.id_ciudad) || formTemp.id_ciudad
    listaUbicaciones.value = await apiGet(`/catalogos/ubicaciones/${idCiudad}`)
  } catch (e) {
    console.error('Error cargando ubicaciones:', e)
  } finally { cargandoUbicaciones.value = false }
}

// ── Formas de pago (tabs) ─────────────────────────────────────
const formaPagoTabs     = ['Mi cuenta', 'Otros pasajeros']
const formaPagoTab      = ref('Mi cuenta')
const showPassengerForm = ref(false)

const iconoTarjeta = `<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><rect x="2" y="3" width="12" height="8" rx="1.5" stroke="#2D9596" stroke-width="1.3"/><path d="M2 6h12" stroke="#2D9596" stroke-width="1.3"/><path d="M5 11v2M11 11v2M3 13h10" stroke="#2D9596" stroke-width="1.2" stroke-linecap="round"/></svg>`

const formaPagoRowsExtras = [
  {
    label: 'Cuentas conectadas', value: '2 servicios vinculados', muted: false, badge: null,
    icon: `<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="6" r="2.5" stroke="#2D9596" stroke-width="1.3"/><path d="M3 13c0-2.76 2.24-5 5-5s5 2.24 5 5" stroke="#2D9596" stroke-width="1.3" stroke-linecap="round"/></svg>`
  },
  {
    label: 'Organizador de viajes', value: 'Sin itinerarios activos', muted: false, badge: null,
    icon: `<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M8 2l1.8 3.6L14 6.5l-3 2.9.7 4.1L8 11.4l-3.7 2.1.7-4.1-3-2.9 4.2-.9z" stroke="#2D9596" stroke-width="1.2" stroke-linejoin="round"/></svg>`
  },
]

// ── TARJETAS ──────────────────────────────────────────────────
// Campos que maneja la BD: TIPO, ULTIMOS4, NOMBRE_TITULAR,
// MES_EXP, ANO_EXP, CODIGO_POSTAL, GUARDADA
// El CVV nunca se guarda.
const tarjetas            = ref([])
const mostrarModalTarjeta = ref(false)
const guardandoTarjeta    = ref(false)
const cargandoTarjetas    = ref(false)
const errorCargaTarjetas  = ref('')

const formTarjeta = reactive({
  tipo:         'Visa',   // → BD: TIPO
  numero:       '',       // → BD: ULTIMOS4 (backend extrae slice(-4))
  nombre:       '',       // → BD: NOMBRE_TITULAR
  expiracion:   '',       // → BD: MES_EXP + ANO_EXP (backend hace split('/'))
  cvv:          '',       // ← NO se envía al backend, solo validación visual
  codigoPostal: '',       // → BD: CODIGO_POSTAL (varchar 10, nullable)
  guardar:      false     // → BD: GUARDADA (boolean, default false)
})
const errorTarjeta = ref('')

async function fetchTarjetas() {
  try {
    cargandoTarjetas.value   = true
    errorCargaTarjetas.value = ''
    // GET /api/metodos-pago → devuelve id, tipo, last4, nombre, expiracion, codigo_postal, guardada
    tarjetas.value = await apiGet('/metodos-pago')
  } catch (e) {
    console.error('Error cargando tarjetas:', e)
    errorCargaTarjetas.value = 'No se pudieron cargar tus tarjetas. Intenta de nuevo.'
  } finally {
    cargandoTarjetas.value = false
  }
}

function abrirModalTarjeta() {
  Object.assign(formTarjeta, {
    tipo: 'Visa', numero: '', nombre: '', expiracion: '',
    cvv: '', codigoPostal: '', guardar: false
  })
  errorTarjeta.value        = ''
  guardandoTarjeta.value    = false
  mostrarModalTarjeta.value = true
}

function cerrarModalTarjeta() { mostrarModalTarjeta.value = false }

async function guardarTarjeta() {
  // Validaciones front
  const num = formTarjeta.numero.replace(/\s/g, '')
  if (num.length < 13) {
    errorTarjeta.value = 'El número de tarjeta debe tener al menos 13 dígitos.'
    return
  }
  if (!formTarjeta.nombre.trim()) {
    errorTarjeta.value = 'El nombre en la tarjeta es requerido.'
    return
  }
  if (!formTarjeta.expiracion.match(/^\d{2}\/\d{2}$/)) {
    errorTarjeta.value = 'La fecha de vencimiento debe tener el formato MM/AA.'
    return
  }

  try {
    guardandoTarjeta.value = true
    errorTarjeta.value     = ''

    // POST /api/metodos-pago
    // El CVV (formTarjeta.cvv) NO se envía intencionalmente
    const nueva = await apiPost('/metodos-pago', {
      tipo:         formTarjeta.tipo,
      numero:       formTarjeta.numero,       // backend extrae ULTIMOS4
      nombre:       formTarjeta.nombre,       // → NOMBRE_TITULAR
      expiracion:   formTarjeta.expiracion,   // backend split → MES_EXP / ANO_EXP
      codigoPostal: formTarjeta.codigoPostal || null, // → CODIGO_POSTAL
      guardar:      formTarjeta.guardar       // → GUARDADA
    })

    tarjetas.value.unshift(nueva)
    cerrarModalTarjeta()
  } catch (e) {
    errorTarjeta.value = e?.message || 'Error al guardar la tarjeta. Intenta de nuevo.'
  } finally {
    guardandoTarjeta.value = false
  }
}

async function eliminarTarjeta(id) {
  if (!confirm('¿Eliminar esta tarjeta?')) return
  try {
    // DELETE /api/metodos-pago/:id
    await apiDelete(`/metodos-pago/${id}`)
    tarjetas.value = tarjetas.value.filter(t => t.id !== id)
  } catch (e) {
    alert('No se pudo eliminar la tarjeta. Intenta de nuevo.')
  }
}

// Actualiza el campo GUARDADA de una tarjeta sin borrarla
async function toggleGuardarTarjeta(tarjeta) {
  const nuevoValor = !tarjeta.guardada
  try {
    // PATCH /api/metodos-pago/:id/guardar
    await apiPut(`/metodos-pago/${tarjeta.id}/guardar`, { guardar: nuevoValor })
    // Actualiza el estado local sin recargar toda la lista
    const idx = tarjetas.value.findIndex(t => t.id === tarjeta.id)
    if (idx !== -1) tarjetas.value[idx].guardada = nuevoValor
  } catch (e) {
    alert('No se pudo actualizar la tarjeta. Intenta de nuevo.')
  }
}

function formatearNumeroTarjeta(e) {
  let v = e.target.value.replace(/\D/g, '').slice(0, 16)
  formTarjeta.numero = v.replace(/(.{4})/g, '$1 ').trim()
}

function formatearExpiracion(e) {
  let v = e.target.value.replace(/\D/g, '').slice(0, 4)
  if (v.length >= 2) v = v.slice(0, 2) + '/' + v.slice(2)
  formTarjeta.expiracion = v
}
// ── FIN TARJETAS ──────────────────────────────────────────────

// ── Pasajeros ─────────────────────────────────────────────────
const pasajerosGuardados = ref([])
const formPasajero       = reactive({ nombre: '', nombre2: '', apellidos: '', genero: '', fecha_nacimiento: '', telefono: '', telefono2: '' })
const errorPasajero      = ref('')

function guardarPasajero() {
  if (!formPasajero.nombre.trim() || !formPasajero.apellidos.trim()) {
    errorPasajero.value = 'Nombre y apellidos son requeridos.'
    return
  }
  pasajerosGuardados.value.push({ id: Date.now(), ...formPasajero })
  Object.assign(formPasajero, { nombre: '', nombre2: '', apellidos: '', genero: '', fecha_nacimiento: '', telefono: '', telefono2: '' })
  errorPasajero.value     = ''
  showPassengerForm.value = false
}
function eliminarPasajero(id) { pasajerosGuardados.value = pasajerosGuardados.value.filter(p => p.id !== id) }

// ── Notificaciones ────────────────────────────────────────────
const mostrarModalNotif = ref(false)
const notifModalTitulo  = ref('')
const notifModalKey     = ref('')
const canalesNotif = [
  { key: 'push',     label: 'Notificaciones push' },
  { key: 'email',    label: 'Correo electrónico' },
  { key: 'sms',      label: 'SMS' },
  { key: 'whatsapp', label: 'WhatsApp' },
]
const notifConfig = reactive({
  general: { push: true,  email: true,  sms: false, whatsapp: false },
  onekey:  { push: true,  email: false, sms: false, whatsapp: false },
  cuenta:  { push: false, email: true,  sms: false, whatsapp: false },
})
function abrirModalNotif(key, titulo) {
  notifModalKey.value     = key
  notifModalTitulo.value  = titulo
  mostrarModalNotif.value = true
}
function resumenNotif(key) {
  const activos = canalesNotif.filter(c => notifConfig[key][c.key]).map(c => c.label)
  return activos.length ? activos.join(', ') : 'Sin canales activos'
}

// ── Seguridad ─────────────────────────────────────────────────
const loginItems = ref([
  { id: 1, label: 'Correo electrónico',     value: localStorage.getItem('user_email') || '', type: 'email' },
  { id: 2, label: 'Número de celular',       value: '',                                        type: 'phone' },
  { id: 3, label: 'Cambia tu contraseña',    value: '',                                        type: 'password' },
  { id: 4, label: 'Cuentas conectadas',      value: '',                                        type: 'link' },
  { id: 5, label: 'Dispositivos conectados', value: '',                                        type: 'devices' },
])
const accountItems = ref([{ id: 6, label: 'Organizador de viajes' }])

const mostrarModalSeguridad     = ref(false)
const seguridadTipoModal        = ref('')
const seguridadModalTitulo      = ref('')
const seguridadModalLabel       = ref('')
const seguridadModalPlaceholder = ref('')
const seguridadTipoInput        = ref('text')
const seguridadValor            = ref('')
const seguridadNuevaPass        = ref('')
const errorSeguridad            = ref('')
const seguridadOk               = ref(false)

const seguridadConfig = {
  email:    { titulo: 'Cambiar correo electrónico', label: 'Correo electrónico actual', placeholder: 'tu@email.com',      tipo: 'email'    },
  phone:    { titulo: 'Cambiar número de celular',  label: 'Número de celular',         placeholder: '+1 809 000 0000',   tipo: 'tel'      },
  password: { titulo: 'Cambiar contraseña',         label: 'Contraseña actual',         placeholder: 'Contraseña actual', tipo: 'password' },
  link:     { titulo: 'Cuentas conectadas',         label: 'Cuenta',                    placeholder: '',                  tipo: 'text'     },
  devices:  { titulo: 'Dispositivos conectados',    label: 'Dispositivo',               placeholder: '',                  tipo: 'text'     },
}
function abrirModalSeguridad(item) {
  const cfg = seguridadConfig[item.type]
  if (!cfg) return
  seguridadTipoModal.value        = item.type
  seguridadModalTitulo.value      = cfg.titulo
  seguridadModalLabel.value       = cfg.label
  seguridadModalPlaceholder.value = cfg.placeholder
  seguridadTipoInput.value        = cfg.tipo
  seguridadValor.value            = ''
  seguridadNuevaPass.value        = ''
  errorSeguridad.value            = ''
  seguridadOk.value               = false
  mostrarModalSeguridad.value     = true
}
function cerrarModalSeguridad() { mostrarModalSeguridad.value = false }

function guardarSeguridad() {
  errorSeguridad.value = ''
  if (!seguridadValor.value.trim()) { errorSeguridad.value = 'Este campo es requerido.'; return }
  if (seguridadTipoModal.value === 'email' && (!seguridadValor.value.includes('@') || !seguridadValor.value.includes('.'))) {
    errorSeguridad.value = 'Ingresa un correo válido.'; return
  }
  if (seguridadTipoModal.value === 'password' && !seguridadNuevaPass.value.trim()) {
    errorSeguridad.value = 'Ingresa tu nueva contraseña.'; return
  }
  if (seguridadTipoModal.value === 'email') {
    loginItems.value[0].value = seguridadValor.value
    perfil.email              = seguridadValor.value
  } else if (seguridadTipoModal.value === 'phone') {
    loginItems.value[1].value = seguridadValor.value
    perfil.telefono_numero    = seguridadValor.value
  }
  seguridadOk.value = true
  setTimeout(() => cerrarModalSeguridad(), 1000)
}

function confirmarEliminarCuenta() {
  if (confirm('¿Estás seguro que deseas eliminar tu cuenta? Esta acción es permanente.')) {
    alert('Cuenta eliminada (acción pendiente de integración).')
  }
}

// ── Ayuda ─────────────────────────────────────────────────────
const mostrarFormComentario = ref(false)
const textoComentario       = ref('')
const comentarioEnviado     = ref(false)

const helpItems = [
  { id: 1, label: 'Iniciar chat',          iconHtml: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#265073" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>`, action: () => alert('Chat de soporte (pendiente de integración)') },
  { id: 2, label: 'Ir al centro de ayuda', iconHtml: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#265073" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3"/><path d="M12 17h.01"/></svg>`, action: () => window.open('https://help.example.com', '_blank') },
  { id: 3, label: 'Compartir comentarios', iconHtml: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#265073" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>`, action: () => { mostrarFormComentario.value = true } },
]

function enviarComentario() {
  if (!textoComentario.value.trim()) return
  comentarioEnviado.value = true
  setTimeout(() => { mostrarFormComentario.value = false; textoComentario.value = ''; comentarioEnviado.value = false }, 1500)
}

// ── Créditos ──────────────────────────────────────────────────
const creditos           = ref([])
const mostrarFormCredito = ref(false)
const formCredito        = reactive({ aerolinea: '', monto: '', vencimiento: '' })
const errorCredito       = ref('')

function guardarCredito() {
  if (!formCredito.aerolinea.trim() || !formCredito.monto || !formCredito.vencimiento) { errorCredito.value = 'Completa todos los campos.'; return }
  creditos.value.push({ id: Date.now(), ...formCredito })
  Object.assign(formCredito, { aerolinea: '', monto: '', vencimiento: '' })
  errorCredito.value = ''; mostrarFormCredito.value = false
}
function eliminarCredito(id) { creditos.value = creditos.value.filter(c => c.id !== id) }

// ── Opiniones ─────────────────────────────────────────────────
const opiniones          = ref([])
const mostrarFormOpinion = ref(false)
const formOpinion        = reactive({ titulo: '', texto: '', estrellas: 0 })
const errorOpinion       = ref('')

function guardarOpinion() {
  if (!formOpinion.titulo.trim() || !formOpinion.texto.trim() || formOpinion.estrellas === 0) { errorOpinion.value = 'Completa todos los campos y selecciona una calificación.'; return }
  opiniones.value.push({ id: Date.now(), titulo: formOpinion.titulo, texto: formOpinion.texto, estrellas: formOpinion.estrellas, fecha: new Date().toLocaleDateString('es-DO') })
  Object.assign(formOpinion, { titulo: '', texto: '', estrellas: 0 })
  errorOpinion.value = ''; mostrarFormOpinion.value = false
}
function eliminarOpinion(id) { opiniones.value = opiniones.value.filter(o => o.id !== id) }

// ── Cupones ───────────────────────────────────────────────────
const cupones           = ref([])
const codigoCupon       = ref('')
const mensajeCupon      = ref('')
const mensajeCuponError = ref(false)

const codigosValidos = {
  PROMO2025:  { descripcion: 'Descuento promocional 2025',  descuento: '10%'    },
  VERANO50:   { descripcion: 'RD$500 en vuelos nacionales', descuento: 'RD$500' },
  BIENVENIDO: { descripcion: '5% en tu primera compra',     descuento: '5%'     },
}
function canjearCupon() {
  if (!codigoCupon.value.trim()) return
  const codigo = codigoCupon.value.trim().toUpperCase()
  if (cupones.value.find(c => c.codigo === codigo)) {
    mensajeCupon.value = 'Este cupón ya está activo en tu cuenta.'; mensajeCuponError.value = true
  } else if (codigosValidos[codigo]) {
    cupones.value.push({ id: Date.now(), codigo, ...codigosValidos[codigo] })
    mensajeCupon.value = '¡Cupón canjeado exitosamente!'; mensajeCuponError.value = false; codigoCupon.value = ''
  } else {
    mensajeCupon.value = 'El código ingresado no es válido.'; mensajeCuponError.value = true
  }
  setTimeout(() => { mensajeCupon.value = '' }, 3000)
}

// ── Helpers ───────────────────────────────────────────────────
const fixPhoto = (url) => {
  if (!url) return ''
  if (url.includes('googleusercontent'))
    return /=s\d+/.test(url) ? url.replace(/=s\d+(-c)?/, '=s80-c') : url
  return url
}

const loadLocalData = () => {
  const photo  = localStorage.getItem('user_photo')
  const name   = localStorage.getItem('user_name')
  const stored = localStorage.getItem('user_initial')
  try {
    perfil.photo   = photo || null
    perfil.initial = stored ? decodeURIComponent(escape(stored)) : (name ? decodeURIComponent(escape(name)).charAt(0).toUpperCase() : '?')
  } catch { perfil.initial = name ? name.charAt(0).toUpperCase() : '?' }
}

function generoLabel(g) {
  return { M: 'Masculino', F: 'Femenino', O: 'Otro' }[g] || 'Sin información'
}

async function abrirModal(tipo) {
  tipoModal.value     = tipo
  guardadoOk.value    = false
  guardadoError.value = false
  Object.assign(formTemp, {
    nombre_completo: perfil.nombre_completo, apellidos: perfil.apellidos,
    fecha_nacimiento: perfil.fecha_nacimiento, genero: perfil.genero,
    descripcion_personal: perfil.descripcion_personal, ubicacion_nombre: perfil.ubicacion_nombre,
    contacto_emergencia_nombre: perfil.contacto_emergencia_nombre,
    contacto_emergencia_tel: perfil.contacto_emergencia_tel,
    email: perfil.email, telefono_numero: perfil.telefono_numero,
    num_viajero_conocido: perfil.num_viajero_conocido, num_dhs_trip: perfil.num_dhs_trip,
    sangre: perfil.SANGRE, estatura: perfil.ESTATURA, peso: perfil.PESO,
    ocupacion: perfil.OCUPACION, nacionalidad: perfil.NACIONALIDAD, estado_civil: perfil.ESTADO_CIVIL,
    documento_numero: perfil.DOCUMENTACION?.NUMERO_DOCUMENTACION,
    documento_emision: perfil.DOCUMENTACION?.FECHA_EMISION,
    documento_expiracion: perfil.DOCUMENTACION?.FECHA_EXPIRACION,
    documento_emisor: perfil.DOCUMENTACION?.EMISOR
  })
  Object.keys(errores).forEach(k => delete errores[k])
  if (tipo === 'basico') {
    formTemp.id_pais      = perfil.id_pais      || ''
    formTemp.id_ciudad    = perfil.id_ciudad    || ''
    formTemp.id_ubicacion = perfil.id_ubicacion || ''
    await fetchPaises()
    if (perfil.id_pais)   listaCiudades.value    = await apiGet(`/catalogos/ciudades?id_pais=${perfil.id_pais}`)
    if (perfil.id_ciudad) listaUbicaciones.value = await apiGet(`/catalogos/ubicaciones/${parseInt(perfil.id_ciudad) || perfil.id_ciudad}`)
  }
  mostrarModal.value = true
}
function cerrarModal() { mostrarModal.value = false }

function validar() {
  Object.keys(errores).forEach(k => delete errores[k])
  let valido = true
  if (tipoModal.value === 'basico' && !formTemp.nombre_completo?.trim()) {
    errores.nombre_completo = 'El nombre no puede estar vacío.'; valido = false
  }
  if (tipoModal.value === 'contacto') {
    const e = formTemp.email || ''
    if (!e.includes('@') || !e.includes('.')) { errores.email = 'Ingresa un correo electrónico válido.'; valido = false }
  }
  return valido
}

const payloadMap = {
  basico: () => ({
    nombre_completo: formTemp.nombre_completo, apellidos: formTemp.apellidos,
    fecha_nacimiento: formTemp.fecha_nacimiento, genero: formTemp.genero,
    descripcion_personal: formTemp.descripcion_personal,
    id_pais: formTemp.id_pais || null, id_ciudad: formTemp.id_ciudad || null, id_ubicacion: formTemp.id_ubicacion || null,
  }),
  contacto: () => ({
    email: formTemp.email, telefono_numero: formTemp.telefono_numero,
    contacto_emergencia_nombre: formTemp.contacto_emergencia_nombre,
    contacto_emergencia_tel: formTemp.contacto_emergencia_tel,
    ubicacion_nombre: formTemp.ubicacion_nombre,
  }),
  aeropuerto:    () => ({ num_viajero_conocido: formTemp.num_viajero_conocido, num_dhs_trip: formTemp.num_dhs_trip }),
  biometricos:   () => ({ sangre: formTemp.sangre, estatura: formTemp.estatura, peso: formTemp.peso, ocupacion: formTemp.ocupacion, nacionalidad: formTemp.nacionalidad, estado_civil: formTemp.estado_civil }),
  documentacion: () => ({ numero_documento: formTemp.documento_numero, fecha_emision: formTemp.documento_emision, fecha_expiracion: formTemp.documento_expiracion, emisor: formTemp.documento_emisor })
}

async function guardarCambios() {
  if (!validar()) return
  guardando.value = true; guardadoOk.value = false; guardadoError.value = false
  const payload = payloadMap[tipoModal.value]?.() ?? {}
  try {
    await apiPut('/perfil/profile/update', payload)
    actualizarEstadoLocal()
    guardadoOk.value = true
    setTimeout(() => cerrarModal(), 900)
  } catch (e) {
    console.error('Error al guardar:', e)
    guardadoError.value = true
  } finally { guardando.value = false }
}

function actualizarEstadoLocal() {
  const t = tipoModal.value
  if (t === 'basico') {
    perfil.nombre_completo = formTemp.nombre_completo; perfil.apellidos = formTemp.apellidos
    perfil.fecha_nacimiento = formTemp.fecha_nacimiento; perfil.genero = formTemp.genero
    perfil.descripcion_personal = formTemp.descripcion_personal
    perfil.id_pais = formTemp.id_pais || null; perfil.id_ciudad = formTemp.id_ciudad || null; perfil.id_ubicacion = formTemp.id_ubicacion || null
    const paisSel = listaPaises.value.find(p => p.ID_PAIS === formTemp.id_pais)
    if (paisSel) perfil.pais_nombre = paisSel.NOMBRE
  } else if (t === 'contacto') {
    perfil.email = formTemp.email; perfil.telefono_numero = formTemp.telefono_numero
    perfil.contacto_emergencia_nombre = formTemp.contacto_emergencia_nombre
    perfil.contacto_emergencia_tel = formTemp.contacto_emergencia_tel
    perfil.ubicacion_nombre = formTemp.ubicacion_nombre
    loginItems.value[0].value = formTemp.email
  } else if (t === 'aeropuerto') {
    perfil.num_viajero_conocido = formTemp.num_viajero_conocido; perfil.num_dhs_trip = formTemp.num_dhs_trip
} else if (t === 'biometricos') {
    perfil.SANGRE       = formTemp.sangre
    perfil.ESTATURA     = formTemp.estatura
    perfil.PESO         = formTemp.peso
    perfil.OCUPACION    = formTemp.ocupacion
    perfil.NACIONALIDAD = formTemp.nacionalidad
    perfil.ESTADO_CIVIL = formTemp.estado_civil
  } else if (t === 'documentacion') {
    perfil.DOCUMENTACION.NUMERO_DOCUMENTACION = formTemp.documento_numero
    perfil.DOCUMENTACION.FECHA_EMISION        = formTemp.documento_emision
    perfil.DOCUMENTACION.FECHA_EXPIRACION     = formTemp.documento_expiracion
    perfil.DOCUMENTACION.EMISOR               = formTemp.documento_emisor
  }
}

async function fetchUserData() {
  try {
    const data = await apiGet('/perfil/profile')
    const { DOCUMENTACION, ...rest } = data
    Object.assign(perfil, rest)

    if (data.nombre)       perfil.nombre_completo = data.nombre
    if (data.SANGRE)       perfil.SANGRE          = data.SANGRE
    if (data.ESTATURA)     perfil.ESTATURA        = data.ESTATURA
    if (data.PESO)         perfil.PESO            = data.PESO
    if (data.OCUPACION)    perfil.OCUPACION       = data.OCUPACION
    if (data.NACIONALIDAD) perfil.NACIONALIDAD    = data.NACIONALIDAD
    if (data.ESTADO_CIVIL) perfil.ESTADO_CIVIL    = data.ESTADO_CIVIL

    if (DOCUMENTACION) Object.assign(perfil.DOCUMENTACION, DOCUMENTACION)
    loginItems.value[0].value = perfil.email
  } catch (error) {
    console.error('Error cargando perfil:', error)
  }
}

onMounted(() => {
  loadLocalData()
  fetchUserData()
  fetchTarjetas()
})

function confirmarCerrarSesion() {
  if (confirm('¿Seguro que deseas cerrar sesión?')) { localStorage.clear(); location.href = '/login' }
}
</script>

<style scoped src="../assets/css/Perfil.css"></style>

<style scoped>
/* Estilos para la cuadrícula de favoritos dentro de Perfil */
.fav-status { padding: 40px 0; text-align: center; color: #666; font-size: 14px; }
.fav-empty-state {
  display: flex; flex-direction: column; align-items: center; justify-content: center;
  padding: 60px 20px; text-align: center; color: #555;
}
.fav-empty-icon { width: 60px; height: 60px; margin-bottom: 15px; opacity: 0.5; }
.fav-empty-state p { margin-bottom: 20px; font-size: 15px; }

.fav-grid {
  display: grid; grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 20px; margin-top: 10px;
}
.fav-card {
  background: #fff; border: 1px solid #eee; border-radius: 12px;
  overflow: hidden; cursor: pointer; transition: transform 0.2s, box-shadow 0.2s;
}
.fav-card:hover { transform: translateY(-4px); box-shadow: 0 10px 25px rgba(0,0,0,0.08); }

.fav-card-img { position: relative; height: 160px; width: 100%; }
.fav-card-img img { width: 100%; height: 100%; object-fit: cover; }
.btn-fav-remove {
  position: absolute; top: 10px; right: 10px; width: 28px; height: 28px;
  border-radius: 50%; border: none; background: rgba(255,255,255,0.9);
  color: #265073; display: flex; align-items: center; justify-content: center;
  cursor: pointer; font-size: 12px; transition: background 0.2s;
}
.btn-fav-remove:hover { background: #fff; color: #e05555; }

.fav-card-body { padding: 15px; display: flex; flex-direction: column; gap: 4px; }
.fav-tag {
  font-size: 10px; text-transform: uppercase; letter-spacing: 0.05em;
  color: #2D9596; font-weight: 700; margin-bottom: 2px;
}
.fav-name { font-size: 17px; font-weight: 600; color: #265073; margin: 0; line-height: 1.3; }
.fav-loc { font-size: 13px; color: #777; margin: 0; }
.fav-footer { margin-top: 8px; padding-top: 8px; border-top: 1px solid #f5f5f5; }
.fav-price { font-size: 15px; font-weight: 700; color: #265073; }
.fav-price small { font-size: 11px; color: #888; font-weight: 400; }

@media (max-width: 600px) {
  .fav-grid { grid-template-columns: 1fr; }
}
</style>