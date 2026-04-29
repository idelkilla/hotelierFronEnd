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
            @click="activeSection = item.key"
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

        <!-- MODAL -->
        <transition name="modal-fade">
          <div v-if="mostrarModal" class="modal-overlay" @click.self="cerrarModal">
            <div class="modal-box">
              <div class="modal-header">
                <h3>{{ modalTitles[tipoModal] }}</h3>
                <button class="modal-close" @click="cerrarModal">✕</button>
              </div>

              <!-- BÁSICO -->
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
                    <label>País / Región</label>
                    <input v-model="formTemp.ubicacion_nombre" type="text" placeholder="Tu país" />
                  </div>
                </div>
                <div class="form-field">
                  <label>Descripción personal</label>
                  <input v-model="formTemp.descripcion_personal" type="text" placeholder="Cuéntanos sobre ti..." />
                </div>
              </template>

              <!-- CONTACTO -->
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

              <!-- AEROPUERTO -->
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

              <!-- DOCUMENTACIÓN -->
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

              <!-- BIOMÉTRICOS -->
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

              <div v-if="guardando" class="save-status saving">Guardando...</div>
              <div v-if="guardadoOk" class="save-status ok">✓ Cambios guardados</div>
              <div v-if="guardadoError" class="save-status err">✗ Error al guardar. Intenta de nuevo.</div>

              <button class="btn-confirm" :disabled="guardando" @click="guardarCambios">
                {{ guardando ? 'Guardando...' : 'Guardar cambios' }}
              </button>
            </div>
          </div>
        </transition>

        <!-- SECCIÓN PERFIL -->
        <div v-if="activeSection === 'perfil'" class="section-wrap">
          <h1 class="section-title">{{ perfil.nombre_completo || 'Mi Perfil' }}</h1>

          <!-- Información básica -->
          <div class="info-block">
            <div class="info-block-header">
              <div>
                <h2>Información básica</h2>
                <p class="info-desc">Asegúrate de que estos datos coincidan con tu identificación oficial, por ejemplo, el pasaporte o la licencia de conducir.</p>
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
                <span class="cell-value" :class="{ muted: !perfil.ubicacion_nombre }">{{ perfil.ubicacion_nombre || 'Sin información' }}</span>
              </div>
            </div>
          </div>

          <!-- Datos de contacto -->
          <div class="info-block">
            <div class="info-block-header">
              <div>
                <h2>Datos de contacto</h2>
                <p class="info-desc">Proporciona la siguiente información para iniciar sesión y recibir alertas sobre la actividad de tu cuenta y actualizaciones sobre viajes.</p>
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

          <!-- Más detalles -->
          <div class="info-block">
            <div class="info-block-header">
              <div>
                <h2>Más detalles</h2>
                <p class="info-desc">Agiliza tu reservación al guardar de manera segura información indispensable de tu viaje.</p>
              </div>
            </div>
            <div class="details-grid">
              <button class="detail-card" @click="abrirModal('aeropuerto')">
                <div class="detail-card-text">
                  <span class="detail-title">Seguridad del aeropuerto</span>
                  <span class="detail-sub">Números de TSA PreCheck y DHS TRIP (Redress)</span>
                </div>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"/></svg>
              </button>
              <button class="detail-card" @click="abrirModal('documentacion')">
                <div class="detail-card-text">
                  <span class="detail-title">Documentos de viaje</span>
                  <span class="detail-sub">{{ perfil.DOCUMENTACION?.NUMERO_DOCUMENTACION ? 'Pasaporte registrado' : 'Pasaporte / ID' }}</span>
                </div>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"/></svg>
              </button>
              <button class="detail-card" @click="abrirModal('biometricos')">
                <div class="detail-card-text">
                  <span class="detail-title">Datos biográficos & Salud</span>
                  <span class="detail-sub">Tipo de sangre, estatura, peso, ocupación</span>
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

          <!-- Personas adicionales -->
          <div class="info-block">
            <div class="info-block-header">
              <div>
                <h2>Personas adicionales</h2>
                <p class="info-desc">Guarda los perfiles de tus familiares, amigos o compañeros que suelen viajar contigo para agilizar tus reservaciones.</p>
              </div>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="18 15 12 9 6 15"/></svg>
            </div>
            <button class="btn-add-person">Agregar persona adicional</button>
          </div>
        </div>

        <!-- OTRAS SECCIONES -->
        <div v-else class="section-wrap empty-section">
          <h1 class="section-title">{{ navItems.find(n => n.key === activeSection)?.label }}</h1>
          <p class="empty-text">Próximamente. Estamos trabajando en esta sección para ofrecerte la mejor experiencia.</p>
        </div>

      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import Header from '../components/Header.vue'

const API_URL = import.meta.env.VITE_API_URL || 'https://hotelierbackend-1.onrender.com'
const activeSection = ref('perfil')
const mostrarModal   = ref(false)
const tipoModal      = ref('')
const guardando      = ref(false)
const guardadoOk     = ref(false)
const guardadoError  = ref(false)

const modalTitles = {
  basico:         'Información básica',
  contacto:       'Datos de contacto',
  aeropuerto:     'Seguridad del aeropuerto',
  documentacion:  'Documentos de viaje',
  biometricos:    'Datos biográficos & Salud'
}

// ── Nav items with inline SVGs ────────────────────────────────────────────────
const navItems = [
  {
    key: 'perfil',
    label: 'Perfil',
    sub: 'Ingresa tus datos personales y documentos de viaje',
    svg: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>`
  },
  {
    key: 'notificaciones',
    label: 'Notificaciones',
    sub: 'Elige las notificaciones que quieres recibir',
    svg: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 01-3.46 0"/></svg>`
  },
  {
    key: 'formas-pago',
    label: 'Formas de pago',
    sub: 'Consulta las formas de pago guardadas',
    svg: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>`
  },
  {
    key: 'cupones',
    label: 'Cupones',
    sub: 'Consulta los cupones disponibles',
    svg: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/></svg>`
  },
  {
    key: 'creditos',
    label: 'Créditos',
    sub: 'Consulta los créditos de aerolínea activos',
    svg: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/></svg>`
  },
  {
    key: 'opiniones',
    label: 'Opiniones',
    sub: 'Lee las opiniones que has enviado',
    svg: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>`
  },
  {
    key: 'seguridad',
    label: 'Seguridad y configuración',
    sub: 'Actualiza el correo o contraseña',
    svg: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>`
  },
  {
    key: 'ayuda',
    label: 'Ayuda y comentarios',
    sub: 'Obtén asistencia',
    svg: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>`
  },
]

// ── Reactive profile state (matches backend response shape exactly) ────────────
const perfil = reactive({
  id_persona: null,
  nombre_completo: localStorage.getItem('user_name') || '',
  apellidos: '',
  num_viajero_conocido: '',
  num_dhs_trip: '',
  ubicacion_nombre: '',
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
  nombre_completo: '',
  apellidos: '',
  fecha_nacimiento: '',
  genero: '',
  descripcion_personal: '',
  ubicacion_nombre: '',
  contacto_emergencia_nombre: '',
  contacto_emergencia_tel: '',
  email: '',
  telefono_numero: '',
  num_viajero_conocido: '',
  num_dhs_trip: '',
  sangre: '',
  estatura: '',
  peso: '',
  ocupacion: '',
  nacionalidad: '',
  estado_civil: '',
  documento_numero: '',
  documento_emision: '',
  documento_expiracion: '',
  documento_emisor: ''
})

const errores = reactive({})

// ── Helpers ───────────────────────────────────────────────────────────────────
const fixEncoding = (str) => {
  if (!str) return str
  try { return decodeURIComponent(escape(str)) } catch { return str }
}

const fixPhoto = (url) => {
  if (!url) return ''
  if (url.includes('googleusercontent'))
    return /=s\d+/.test(url) ? url.replace(/=s\d+(-c)?/, '=s80-c') : url
  return url
}

const loadLocalData = () => {
  const photo = localStorage.getItem('user_photo')
  const name = fixEncoding(localStorage.getItem('user_name'))
  const initialStored = fixEncoding(localStorage.getItem('user_initial'))
  perfil.photo = photo || null
  perfil.initial = initialStored || (name ? name.charAt(0).toUpperCase() : '?')
}

function generoLabel(g) {
  return { M: 'Masculino', F: 'Femenino', O: 'Otro' }[g] || 'Sin información'
}

function abrirModal(tipo) {
  tipoModal.value = tipo
  guardadoOk.value = false
  guardadoError.value = false

  Object.assign(formTemp, {
    nombre_completo:            perfil.nombre_completo,
    apellidos:                  perfil.apellidos,
    fecha_nacimiento:           perfil.fecha_nacimiento,
    genero:                     perfil.genero,
    descripcion_personal:       perfil.descripcion_personal,
    ubicacion_nombre:           perfil.ubicacion_nombre,
    contacto_emergencia_nombre: perfil.contacto_emergencia_nombre,
    contacto_emergencia_tel:    perfil.contacto_emergencia_tel,
    email:                      perfil.email,
    telefono_numero:            perfil.telefono_numero,
    num_viajero_conocido:       perfil.num_viajero_conocido,
    num_dhs_trip:               perfil.num_dhs_trip,
    sangre:                     perfil.SANGRE,
    estatura:                   perfil.ESTATURA,
    peso:                       perfil.PESO,
    ocupacion:                  perfil.OCUPACION,
    nacionalidad:               perfil.NACIONALIDAD,
    estado_civil:               perfil.ESTADO_CIVIL,
    documento_numero:           perfil.DOCUMENTACION?.NUMERO_DOCUMENTACION,
    documento_emision:          perfil.DOCUMENTACION?.FECHA_EMISION,
    documento_expiracion:       perfil.DOCUMENTACION?.FECHA_EXPIRACION,
    documento_emisor:           perfil.DOCUMENTACION?.EMISOR
  })

  Object.keys(errores).forEach(k => delete errores[k])
  mostrarModal.value = true
}

function cerrarModal() {
  mostrarModal.value = false
}

function validar() {
  Object.keys(errores).forEach(k => delete errores[k])
  let valido = true
  if (tipoModal.value === 'basico' && !formTemp.nombre_completo?.trim()) {
    errores.nombre_completo = 'El nombre no puede estar vacío.'
    valido = false
  }
  if (tipoModal.value === 'contacto') {
    const e = formTemp.email || ''
    if (!e.includes('@') || !e.includes('.')) {
      errores.email = 'Ingresa un correo electrónico válido.'
      valido = false
    }
  }
  return valido
}

// Payload builders per section
const payloadMap = {
  basico: () => ({
    nombre_completo:      formTemp.nombre_completo,
    apellidos:            formTemp.apellidos,
    fecha_nacimiento:     formTemp.fecha_nacimiento,
    genero:               formTemp.genero,
    descripcion_personal: formTemp.descripcion_personal,
    ubicacion_nombre:     formTemp.ubicacion_nombre
  }),
  contacto: () => ({
    email:                      formTemp.email,
    telefono_numero:            formTemp.telefono_numero,
    contacto_emergencia_nombre: formTemp.contacto_emergencia_nombre,
    contacto_emergencia_tel:    formTemp.contacto_emergencia_tel,
    ubicacion_nombre:           formTemp.ubicacion_nombre
  }),
  aeropuerto: () => ({
    num_viajero_conocido: formTemp.num_viajero_conocido,
    num_dhs_trip:         formTemp.num_dhs_trip
  }),
  biometricos: () => ({
    sangre:      formTemp.sangre,
    estatura:    formTemp.estatura,
    peso:        formTemp.peso,
    ocupacion:   formTemp.ocupacion,
    nacionalidad: formTemp.nacionalidad,
    estado_civil: formTemp.estado_civil
  }),
  documentacion: () => ({
    numero_documento: formTemp.documento_numero,
    fecha_emision:    formTemp.documento_emision,
    fecha_expiracion: formTemp.documento_expiracion,
    emisor:           formTemp.documento_emisor
  })
}

async function guardarCambios() {
  if (!validar()) return

  guardando.value = true
  guardadoOk.value = false
  guardadoError.value = false

  const token = localStorage.getItem('user_token')
  const payload = payloadMap[tipoModal.value]?.() ?? {}

  try {
    const res = await fetch(`${API_URL}/api/user/profile/update`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(payload)
    })

    if (res.ok) {
      actualizarEstadoLocal()
      guardadoOk.value = true
      setTimeout(() => cerrarModal(), 900)
    } else {
      guardadoError.value = true
    }
  } catch (e) {
    console.error('Error al guardar:', e)
    guardadoError.value = true
  } finally {
    guardando.value = false
  }
}

function actualizarEstadoLocal() {
  const t = tipoModal.value
  if (t === 'basico') {
    perfil.nombre_completo      = formTemp.nombre_completo
    perfil.apellidos            = formTemp.apellidos
    perfil.fecha_nacimiento     = formTemp.fecha_nacimiento
    perfil.genero               = formTemp.genero
    perfil.descripcion_personal = formTemp.descripcion_personal
    perfil.ubicacion_nombre     = formTemp.ubicacion_nombre
  } else if (t === 'contacto') {
    perfil.email                      = formTemp.email
    perfil.telefono_numero            = formTemp.telefono_numero
    perfil.contacto_emergencia_nombre = formTemp.contacto_emergencia_nombre
    perfil.contacto_emergencia_tel    = formTemp.contacto_emergencia_tel
    perfil.ubicacion_nombre           = formTemp.ubicacion_nombre
  } else if (t === 'aeropuerto') {
    perfil.num_viajero_conocido = formTemp.num_viajero_conocido
    perfil.num_dhs_trip         = formTemp.num_dhs_trip
  } else if (t === 'biometricos') {
    perfil.SANGRE      = formTemp.sangre
    perfil.ESTATURA    = formTemp.estatura
    perfil.PESO        = formTemp.peso
    perfil.OCUPACION   = formTemp.ocupacion
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
  const token = localStorage.getItem('user_token')
  if (!token) return
  try {
    const response = await fetch(`${API_URL}/api/user/profile`, {
      headers: { 'Authorization': `Bearer ${token}` }
    })
    if (response.ok) {
      const data = await response.json()
      const { DOCUMENTACION, ...rest } = data
      // Mapeo manual por si el backend devuelve nombres distintos
      Object.assign(perfil, rest)
      if (data.nombre) perfil.nombre_completo = data.nombre // fallback
      if (DOCUMENTACION) Object.assign(perfil.DOCUMENTACION, DOCUMENTACION)
    }
  } catch (error) {
    console.error('Error cargando perfil:', error)
  }
}

onMounted(() => {
  loadLocalData()
  fetchUserData()
})

function confirmarCerrarSesion() {
  if (confirm('¿Seguro que deseas cerrar sesión?')) {
    localStorage.clear()
    location.href = '/login'
  }
}
</script>

<style scoped src="../assets/css/Perfil.css"></style>