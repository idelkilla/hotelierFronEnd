<template>
  <div class="ah-page">

    <!-- Header -->
    <div class="ah-header">
      <div>
        <h1>Agregar Nueva Propiedad</h1>
        <p>Completa los detalles para registrar el hospedaje.</p>
      </div>
      <div class="ah-header-actions">
        <button class="ah-btn-secondary" :disabled="guardando" @click="guardarBorrador">
          {{ guardando ? 'Guardando...' : 'Guardar Borrador' }}
        </button>
        <button class="ah-btn-primary" :disabled="publicando" @click="publicar">
          {{ publicando ? 'Publicando...' : 'Publicar Propiedad' }}
        </button>
      </div>
    </div>

    <!-- Alerta de error/éxito -->
    <div v-if="alerta.mensaje" :class="['ah-alerta', `ah-alerta--${alerta.tipo}`]">
      <i :class="alerta.tipo === 'error' ? 'fas fa-exclamation-circle' : 'fas fa-check-circle'"></i>
      {{ alerta.mensaje }}
      <button @click="alerta.mensaje = ''"><i class="fas fa-times"></i></button>
    </div>

    <div class="ah-grid">

      <!-- ── Columna izquierda ── -->
      <div class="ah-col">

        <!-- Información básica -->
        <div class="ah-card">
          <div class="ah-card-title">
            <i class="fas fa-info-circle"></i> Información Básica
          </div>

          <div class="ah-field">
            <label>Nombre del Hotel</label>
            <input v-model="form.nombre" type="text" placeholder="e.g. Grand Plaza Hotel & Resort" />
          </div>

          <div class="ah-field">
            <label>Tipo de Propiedad</label>
            <select v-model="form.id_tipo_hospedaje">
              <option value="">Seleccionar...</option>
              <option v-for="t in tiposHospedaje" :key="t.ID_TIPO" :value="t.ID_TIPO">
                {{ t.NOMBRE_TIPO }}
              </option>
            </select>
          </div>

          <div class="ah-field">
            <label>Descripción</label>
            <textarea v-model="form.descripcion" rows="4"
              placeholder="Describe las características únicas, ambiente y alrededores..."></textarea>
          </div>
        </div>

        <!-- Galería -->
        <div class="ah-card">
          <div class="ah-card-title">
            <i class="fas fa-images"></i> Galería de Imágenes
            <span class="ah-card-hint">Mínimo 5 fotos recomendadas</span>
          </div>

          <div class="ah-dropzone" @click="$refs.fileInput.click()"
            @dragover.prevent @drop.prevent="onDrop">
            <i class="fas fa-cloud-upload-alt"></i>
            <p>Arrastra y suelta tus imágenes aquí</p>
            <small>JPG, PNG y WEBP. Máximo 10MB</small>
            <button class="ah-btn-outline" type="button">Explorar Archivos</button>
            <input ref="fileInput" type="file" multiple accept="image/*"
              style="display:none" @change="onFileSelect" />
          </div>

          <div class="ah-gallery" v-if="imagenes.length">
            <div v-for="(img, i) in imagenes" :key="i" class="ah-thumb">
              <img :src="img.preview" :alt="img.alt_text || 'Imagen ' + (i+1)" />
              <!-- Campo alt text inline -->
              <input v-model="img.alt_text" placeholder="Texto alternativo" class="ah-alt-input" />
              <button class="ah-thumb-remove" @click="imagenes.splice(i, 1)">
                <i class="fas fa-times"></i>
              </button>
            </div>
            <div v-for="n in Math.max(0, 4 - imagenes.length)" :key="'empty-'+n"
              class="ah-thumb ah-thumb-empty">
              <i class="fas fa-image"></i>
            </div>
          </div>
        </div>

        <!-- Habitaciones -->
        <div class="ah-card">
          <div class="ah-card-title">
            <i class="fas fa-bed"></i> Configuración de Habitaciones y Precios
            <button class="ah-btn-add" @click="agregarHabitacion">
              <i class="fas fa-plus"></i> Agregar Tipo
            </button>
          </div>

          <table class="ah-table" v-if="habitaciones.length">
            <thead>
              <tr>
                <th>Tipo</th>
                <th>Adultos</th>
                <th>Niños</th>
                <th>Precio/Noche</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(hab, i) in habitaciones" :key="i">
                <td>
                  <select v-model="hab.id_tipo_habitacion">
                    <option value="">Tipo...</option>
                    <option v-for="t in tiposHabitacion" :key="t.ID_TIPO_HABITACION" :value="t.ID_TIPO_HABITACION">
                      {{ t.NOMBRE }}
                    </option>
                  </select>
                </td>
                <td><input type="number" v-model.number="hab.capacidad_adulto" min="1" max="10" /></td>
                <td><input type="number" v-model.number="hab.capacidad_ninos" min="0" max="6" /></td>
                <td>
                  <div class="ah-price">
                    <span>$</span>
                    <input type="number" v-model.number="hab.precio_noche" min="0" step="0.01" />
                  </div>
                </td>
                <td>
                  <button class="ah-icon-btn" @click="habitaciones.splice(i,1)">
                    <i class="fas fa-trash"></i>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
          <div v-else class="ah-empty">No hay habitaciones agregadas aún.</div>
        </div>

        <!-- Políticas -->
        <div class="ah-card">
          <div class="ah-card-title">
            <i class="fas fa-shield-alt"></i> Políticas
          </div>
          <div class="ah-row">
            <div class="ah-field">
              <label>Check-in desde</label>
              <input v-model="form.checkin" type="time" />
            </div>
            <div class="ah-field">
              <label>Check-out hasta</label>
              <input v-model="form.checkout" type="time" />
            </div>
          </div>
          <div class="ah-field">
            <label>Política de cancelación</label>
            <select v-model="form.cancelacion">
              <option value="flexible">Flexible (reembolso hasta 24h)</option>
              <option value="moderada">Moderada (reembolso hasta 5 días)</option>
              <option value="estricta">Estricta (sin reembolso)</option>
            </select>
          </div>
          <div class="ah-toggles">
            <label class="ah-toggle">
              <span>Se permiten mascotas</span>
              <div :class="{ on: form.mascotas }" class="ah-switch" @click="form.mascotas = !form.mascotas">
                <div class="ah-switch-thumb"></div>
              </div>
            </label>
            <label class="ah-toggle">
              <span>Se permite fumar</span>
              <div :class="{ on: form.fumar }" class="ah-switch" @click="form.fumar = !form.fumar">
                <div class="ah-switch-thumb"></div>
              </div>
            </label>
          </div>
        </div>

      </div>

      <!-- ── Columna derecha ── -->
      <div class="ah-col ah-col-right">

        <!-- Información del Proveedor -->
        <div class="ah-card">
          <div class="ah-card-title">
            <i class="fas fa-building"></i> Información del Proveedor
          </div>

          <div class="ah-field">
            <label>Nombre Legal / Razón Social</label>
            <input v-model="form.nombre_legal" type="text" placeholder="e.g. Inversiones Hoteleras S.A." />
          </div>

          <div class="ah-row">
            <div class="ah-field">
              <label>RNC</label>
              <input v-model="form.rnc" type="text" maxlength="12" placeholder="123456789" />
            </div>
            <div class="ah-field">
              <label>Tipo de Empresa</label>
              <select v-model="form.id_tipo_proveedor">
                <option value="">Seleccionar...</option>
                <option v-for="t in tiposProveedor" :key="t.ID_TIPO" :value="t.ID_TIPO">
                  {{ t.NOMBRE_TIPO }}
                </option>
              </select>
            </div>
          </div>
        </div>

        <!-- Ubicación -->
        <div class="ah-card">
          <div class="ah-card-title">
            <i class="fas fa-map-marker-alt"></i> Ubicación
          </div>

          <div class="ah-field">
            <label>País</label>
            <select v-model="form.id_pais" @change="cargarCiudades">
              <option value="">Seleccionar país...</option>
              <option v-for="p in paises" :key="p.ID_PAIS" :value="p.ID_PAIS">
                {{ p.NOMBRE }}
              </option>
            </select>
          </div>

          <div class="ah-row">
            <div class="ah-field">
              <label>Ciudad</label>
              <select v-model="form.id_ciudad" :disabled="!ciudades.length">
                <option value="">
                  {{ form.id_pais ? 'Seleccionar ciudad...' : 'Primero selecciona un país' }}
                </option>
                <option v-for="c in ciudades" :key="c.ID_CIUDAD" :value="c.ID_CIUDAD">
                  {{ c.NOMBRE }}
                </option>
              </select>
            </div>
          </div>

          <div class="ah-row">
            <div class="ah-field">
              <label>Latitud</label>
              <input type="number" v-model.number="form.latitud" step="0.00000001" placeholder="18.4861" />
            </div>
            <div class="ah-field">
              <label>Longitud</label>
              <input type="number" v-model.number="form.longitud" step="0.00000001" placeholder="-69.9312" />
            </div>
          </div>

          <div class="ah-field">
            <label>Nombre de Ubicación <small>(ej: Zona Colonial, Piantini)</small></label>
            <input v-model="form.nombre_ubicacion" type="text" placeholder="Nombre de la zona o sector" />
          </div>
        </div>

        <!-- Amenidades -->
        <div class="ah-card">
          <div class="ah-card-title">
            <i class="fas fa-concierge-bell"></i> Amenidades
          </div>
          <div v-if="cargandoServicios" class="ah-empty">Cargando servicios...</div>
          <div v-else class="ah-amenities">
            <label v-for="s in servicios" :key="s.ID_SERVICIO_INCLUIDO" class="ah-amenity">
              <input type="checkbox" :value="s.ID_SERVICIO_INCLUIDO" v-model="form.servicios_incluidos" />
              <span>{{ s.NOMBRE }}</span>
            </label>
          </div>
        </div>

      </div>
    </div>

    <!-- Footer -->
    <div class="ah-footer">
      <button class="ah-btn-secondary" @click="$router.back()">
        <i class="fas fa-arrow-left"></i> Cancelar
      </button>
      <button class="ah-btn-primary" :disabled="publicando" @click="publicar">
        {{ publicando ? 'Publicando...' : 'Completar y Publicar' }}
        <i class="fas fa-check"></i>
      </button>
    </div>

  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'

// ─── Configuración ───────────────────────────────────────────────
// Cambia esta URL base a la de tu backend
const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'

const router = useRouter()

// ─── Estado del formulario ───────────────────────────────────────
const form = reactive({
  // SERVICIO.NOMBRE + campos extra del hospedaje
  nombre:              '',
  descripcion:         '',

  // HOSPEDAJE.ID_TIPO → TIPO_HOSPEDAJE
  id_tipo_hospedaje:   '',

  // PROVEEDOR
  nombre_legal:        '',
  rnc:                 '',
  id_tipo_proveedor:   '',

  // UBICACION
  nombre_ubicacion:    '',
  latitud:             '',
  longitud:            '',
  id_ciudad:           '',

  // Auxiliar frontend (no se envía directamente)
  id_pais:             '',

  // HOSPEDAJE_SERVICIO (array de ID_SERVICIO_INCLUIDO)
  servicios_incluidos: [],

  // Políticas (campos extra que tu backend puede manejar)
  checkin:             '15:00',
  checkout:            '11:00',
  cancelacion:         'flexible',
  mascotas:            false,
  fumar:               false,
})

const imagenes     = ref([])   // [{ file, preview, alt_text }]
const habitaciones = ref([])   // [{ id_tipo_habitacion, capacidad_adulto, capacidad_ninos, precio_noche }]

// ─── Catálogos ───────────────────────────────────────────────────
const tiposHospedaje  = ref([])
const tiposHabitacion = ref([])
const tiposProveedor  = ref([])
const paises          = ref([])
const ciudades        = ref([])
const servicios       = ref([])

// ─── UI state ────────────────────────────────────────────────────
const publicando       = ref(false)
const guardando        = ref(false)
const cargandoServicios = ref(false)
const alerta = reactive({ mensaje: '', tipo: 'error' }) // tipo: 'error' | 'exito'

// ─── Helpers ─────────────────────────────────────────────────────
const mostrarAlerta = (mensaje, tipo = 'error') => {
  alerta.mensaje = mensaje
  alerta.tipo    = tipo
  if (tipo === 'exito') setTimeout(() => { alerta.mensaje = '' }, 4000)
}

const apiFetch = async (path, options = {}) => {
  const token = localStorage.getItem('user_token')
  const headers = { 'Content-Type': 'application/json', ...options.headers }
  if (token) headers['Authorization'] = `Bearer ${token}`

  const res = await fetch(`${API_BASE}${path}`, {
    headers,
    ...options,
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.message || `Error ${res.status}`)
  }
  return res.json()
}

// ─── Carga inicial de catálogos ──────────────────────────────────
onMounted(async () => {
  try {
    // Aseguramos que el orden de la desestructuración sea igual al de Promise.all
    const [resTipos, resHab, resPaises, resProv] = await Promise.all([
      apiFetch('/catalogos/tipos-hospedaje'),
      apiFetch('/catalogos/tipos-habitacion'),
      apiFetch('/catalogos/paises'),
      apiFetch('/catalogos/tipos-proveedor'),
    ])
    tiposHospedaje.value  = resTipos
    tiposHabitacion.value = resHab
    paises.value          = resPaises
    tiposProveedor.value  = resProv
  } catch (e) {
    mostrarAlerta('No se pudieron cargar los catálogos: ' + e.message)
  }

  // Servicios incluidos por separado para mostrar loading propio
  cargandoServicios.value = true
  try {
    servicios.value = await apiFetch('/catalogos/servicios-incluidos')
  } catch (e) {
    mostrarAlerta('No se pudieron cargar los servicios: ' + e.message)
  } finally {
    cargandoServicios.value = false
  }
})

// ─── Ciudades por país ───────────────────────────────────────────
const cargarCiudades = async () => {
  form.id_ciudad = ''
  ciudades.value = []
  if (!form.id_pais) return
  try {
    ciudades.value = await apiFetch(`/catalogos/ciudades?id_pais=${form.id_pais}`)
  } catch (e) {
    mostrarAlerta('No se pudieron cargar las ciudades: ' + e.message)
  }
}

// ─── Manejo de imágenes ──────────────────────────────────────────
const onFileSelect = (e) => {
  procesarArchivos(Array.from(e.target.files))
}
const onDrop = (e) => {
  procesarArchivos(Array.from(e.dataTransfer.files).filter(f => f.type.startsWith('image/')))
}
const procesarArchivos = (files) => {
  files.forEach(file => {
    if (file.size > 10 * 1024 * 1024) {
      mostrarAlerta(`"${file.name}" supera los 10MB permitidos.`)
      return
    }
    imagenes.value.push({ file, preview: URL.createObjectURL(file), alt_text: '' })
  })
}

// ─── Habitaciones ────────────────────────────────────────────────
const agregarHabitacion = () => {
  habitaciones.value.push({
    id_tipo_habitacion: '',  // → HABITACION.ID_TIPO_HABITACION
    capacidad_adulto:   2,   // → HABITACION.CAPACIDAD_ADULTO
    capacidad_ninos:    0,   // → HABITACION.CAPACIDAD_NINOS
    precio_noche:       0,   // → HABITACION.PRECIO_NOCHE
  })
}

// ─── Validación ──────────────────────────────────────────────────
const validar = () => {
  if (!form.nombre.trim())          return 'El nombre del hotel es requerido.'
  if (!form.nombre_legal.trim())    return 'El nombre legal del proveedor es requerido.'
  if (!form.rnc.trim())             return 'El RNC es requerido.'
  if (!form.id_tipo_proveedor)      return 'Selecciona el tipo de proveedor.'
  if (!form.id_tipo_hospedaje)      return 'Selecciona el tipo de propiedad.'
  if (!form.id_ciudad)              return 'Selecciona una ciudad.'
  if (!form.latitud || !form.longitud) return 'La ubicación (lat/lng) es requerida.'
  if (habitaciones.value.length === 0) return 'Agrega al menos un tipo de habitación.'
  for (const [i, hab] of habitaciones.value.entries()) {
    if (!hab.id_tipo_habitacion)    return `La habitación #${i + 1} no tiene tipo seleccionado.`
    if (hab.precio_noche <= 0)      return `La habitación #${i + 1} debe tener un precio mayor a 0.`
  }
  return null
}

// ─── Publicar ────────────────────────────────────────────────────
/**
 * Flujo:
 * 1. POST /hospedajes  → crea SERVICIO + HOSPEDAJE + UBICACION en el backend
 * 2. POST /hospedajes/:id/habitaciones  (bulk)
 * 3. POST /hospedajes/:id/imagenes      (multipart, una por una o bulk)
 *
 * Ajusta los endpoints a los que tu backend exponga.
 */
const publicar = async () => {
  const error = validar()
  if (error) { mostrarAlerta(error); return }

  publicando.value = true
  alerta.mensaje   = ''

  try {
    // 1. Crear el hospedaje principal
    //    El backend se encarga de insertar en SERVICIO + UBICACION + HOSPEDAJE + HOSPEDAJE_SERVICIO
    const payload = {
      // Datos del servicio/hospedaje
      nombre:             form.nombre,
      descripcion:        form.descripcion,
      id_tipo_hospedaje:  form.id_tipo_hospedaje,

      // Datos del Proveedor para el backend
      nombre_legal:       form.nombre_legal,
      rnc:                form.rnc,
      id_tipo_proveedor:  form.id_tipo_proveedor,

      // Políticas (tu backend decide cómo almacenarlas)
      checkin:            form.checkin,
      checkout:           form.checkout,
      cancelacion:        form.cancelacion,
      mascotas:           form.mascotas,
      fumar:              form.fumar,

      // Ubicación → UBICACION + HOSPEDAJE.ID_UBICACION
      ubicacion: {
        nombre:     form.nombre_ubicacion || form.nombre,
        latitud:    form.latitud,
        longitud:   form.longitud,
        id_ciudad:  form.id_ciudad,
      },

      // Amenidades → HOSPEDAJE_SERVICIO
      servicios_incluidos: form.servicios_incluidos,
    }

    const hospedaje = await apiFetch('/hospedajes', {
      method: 'POST',
      body:   JSON.stringify(payload),
    })
    const idHospedaje = hospedaje.ID_HOSPEDAJE || hospedaje.id

    // 2. Crear habitaciones → HABITACION (bulk)
    if (habitaciones.value.length) {
      await apiFetch(`/hospedajes/${idHospedaje}/habitaciones`, {
        method: 'POST',
        body:   JSON.stringify(
          habitaciones.value.map(h => ({
            id_tipo_habitacion: h.id_tipo_habitacion,  // → HABITACION.ID_TIPO_HABITACION
            capacidad_adulto:   h.capacidad_adulto,    // → HABITACION.CAPACIDAD_ADULTO
            capacidad_ninos:    h.capacidad_ninos,     // → HABITACION.CAPACIDAD_NINOS
            precio_noche:       h.precio_noche,        // → HABITACION.PRECIO_NOCHE
          }))
        ),
      })
    }

    // 3. Subir imágenes → IMAGEN_HOSPEDAJE
    for (const [orden, img] of imagenes.value.entries()) {
      const token = localStorage.getItem('user_token')
      const fd = new FormData()
      fd.append('imagen',    img.file)
      fd.append('orden',     orden)              // → IMAGEN_HOSPEDAJE.ORDEN
      fd.append('alt_text',  img.alt_text || '') // → IMAGEN_HOSPEDAJE.ALT_TEXT
      await fetch(`${API_BASE}/hospedajes/${idHospedaje}/imagenes`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body:   fd,
        // No pongas Content-Type aquí; el browser lo setea con el boundary
      })
    }

    mostrarAlerta('¡Propiedad publicada exitosamente!', 'exito')
    setTimeout(() => router.push(`/hospedajes/${idHospedaje}`), 1500)

  } catch (e) {
    mostrarAlerta('Error al publicar: ' + e.message)
  } finally {
    publicando.value = false
  }
}

// ─── Guardar borrador ────────────────────────────────────────────
const guardarBorrador = async () => {
  if (!form.nombre.trim()) { mostrarAlerta('Escribe al menos el nombre para guardar el borrador.'); return }
  guardando.value = true
  try {
    await apiFetch('/hospedajes/borrador', {
      method: 'POST',
      body:   JSON.stringify({ ...form, habitaciones: habitaciones.value }),
    })
    mostrarAlerta('Borrador guardado.', 'exito')
  } catch (e) {
    mostrarAlerta('No se pudo guardar el borrador: ' + e.message)
  } finally {
    guardando.value = false
  }
}
</script>

<style scoped>
@import '../assets/css/adminAgregarHotel.css';
</style>