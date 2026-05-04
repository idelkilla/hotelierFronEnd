<template>
  <div class="ah-grid">

    <!-- Columna izquierda -->
    <div class="ah-col">

      <div class="ah-card">
        <div class="ah-card-title"><i class="fas fa-user"></i> Datos Personales</div>
        <div class="ah-row">
          <div class="ah-field">
            <label>Nombre completo</label>
            <input v-model="form.nombre_completo" type="text" placeholder="Nombre(s)" />
          </div>
          <div class="ah-field">
            <label>Apellidos</label>
            <input v-model="form.apellidos" type="text" placeholder="Apellidos" />
          </div>
        </div>
        <div class="ah-row">
          <div class="ah-field">
            <label>Género</label>
            <AppSelect v-model="form.genero" :options="[
              { value: 'M', label: 'Masculino' },
              { value: 'F', label: 'Femenino' }
            ]" placeholder="Seleccionar..." />
          </div>
          <div class="ah-field">
            <label>Fecha de nacimiento</label>
            <input v-model="form.fecha_nacimiento" type="date" />
          </div>
        </div>
        <div class="ah-field">
          <label>Estado del cliente</label>
          <AppSelect v-model="form.estado_cliente" :options="[
            { value: 'A', label: 'Activo' },
            { value: 'I', label: 'Inactivo' }
          ]" />
        </div>
        <div class="ah-field">
          <label>Descripción personal</label>
          <textarea v-model="form.descripcion_personal" rows="3"
            placeholder="Intereses, preferencias de viaje, notas especiales..."></textarea>
        </div>
      </div>

      <div class="ah-card">
        <div class="ah-card-title"><i class="fas fa-id-card"></i> Documentación</div>
        <div class="ah-row">
          <div class="ah-field">
            <label>Tipo de documento</label>
            <AppSelect v-model="form.id_tipo_documento" 
              :options="tiposDocumento.map(t => ({ value: t.ID_TIPO, label: t.TIPO }))"
              placeholder="Seleccionar..." />
          </div>
          <div class="ah-field">
            <label>Número</label>
            <input v-model="form.numero_documentacion" type="text" placeholder="001-0000000-0" maxlength="10" />
          </div>
        </div>
        <div class="ah-row">
          <div class="ah-field">
            <label>Fecha emisión</label>
            <input v-model="form.fecha_emision" type="date" />
          </div>
          <div class="ah-field">
            <label>Fecha expiración</label>
            <input v-model="form.fecha_expiracion" type="date" />
          </div>
        </div>
        <div class="ah-row">
          <div class="ah-field">
            <label>Núm. viajero conocido <small>(KTN)</small></label>
            <input v-model="form.num_viajero_conocido" type="text" placeholder="KTN-00000" />
          </div>
          <div class="ah-field">
            <label>Núm. DHS TRIP</label>
            <input v-model="form.num_dhs_trip" type="text" placeholder="Opcional" />
          </div>
        </div>
      </div>

    </div>

    <!-- Columna derecha -->
    <div class="ah-col">

      <div class="ah-card">
        <div class="ah-card-title"><i class="fas fa-key"></i> Cuenta de Acceso</div>
        <div class="ah-field">
          <label>Usuario</label>
          <input v-model="form.usuario" type="text" placeholder="usuario123" />
        </div>
        <div class="ah-field">
          <label>Correo electrónico</label>
          <input v-model="form.correo" type="email" placeholder="cliente@email.com" />
        </div>
        <div class="ah-field">
          <label>Google ID <span style="font-weight:400;color:#94a3b8">(si aplica)</span></label>
          <input v-model="form.google_id" type="text" placeholder="ID de Google OAuth" />
        </div>
        <div class="ah-field">
          <label>Contraseña</label>
          <input v-model="form.contrasena" type="password" placeholder="••••••••"
            :disabled="!!form.google_id" />
          <small v-if="form.google_id" style="color:#94a3b8">No requerida con Google OAuth.</small>
        </div>
      </div>

      <div class="ah-card">
        <div class="ah-card-title"><i class="fas fa-phone"></i> Teléfono</div>
        <div class="ah-field">
          <label>Número principal</label>
          <div class="ah-tel-row">
            <input v-model="form.codigo_pais" type="text" placeholder="+1" maxlength="5" style="width:64px" />
            <input v-model="form.numero_telefonico" type="text" placeholder="809-555-0000" />
          </div>
        </div>
        <div class="ah-field">
          <label>Tipo de teléfono</label>
          <AppSelect v-model="form.id_tipo_telefono"
            :options="tiposTelefono.map(t => ({ value: t.ID_TIPO, label: t.NOMBRE }))" />
        </div>
      </div>

      <div class="ah-card">
        <div class="ah-card-title"><i class="fas fa-calendar-check"></i> Registro</div>
        <div class="ah-field">
          <label>Fecha de registro</label>
          <input v-model="form.fecha_registro" type="date" />
        </div>
        <div class="ah-info-box">
          El cliente se creará sin membresía. Puedes asignársela desde la pestaña
          <strong>Miembro</strong> una vez guardado.
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { reactive, ref, onMounted } from 'vue'
import AppSelect from './AppSelect.vue'
import { apiFetch } from '../services/api'

const emit = defineEmits(['alerta'])

const today = new Date().toISOString().slice(0, 10)

const form = reactive({
  nombre_completo:      '',
  apellidos:            '',
  genero:               '',
  fecha_nacimiento:     '',
  estado_cliente:       'A',
  descripcion_personal: '',
  // Documentación
  id_tipo_documento:    '',
  numero_documentacion: '',
  fecha_emision:        '',
  fecha_expiracion:     '',
  num_viajero_conocido: '',
  num_dhs_trip:         '',
  // Cuenta
  usuario:              '',
  correo:               '',
  google_id:            '',
  contrasena:           '',
  // Teléfono
  codigo_pais:          '+1',
  numero_telefonico:    '',
  id_tipo_telefono:     '',
  // Registro
  fecha_registro:       today,
})

const tiposDocumento = ref([])
const tiposTelefono  = ref([])

onMounted(async () => {
  try {
    const [td, tt] = await Promise.all([
      apiFetch('/catalogos/tipos-documentacion'),
      apiFetch('/catalogos/tipos-telefono'),
    ])
    tiposDocumento.value = td
    tiposTelefono.value  = tt
  } catch (e) {
    emit('alerta', 'Error cargando catálogos del cliente: ' + e.message)
  }
})

const validar = () => {
  if (!form.nombre_completo.trim()) return 'El nombre completo es requerido.'
  if (!form.correo.trim())          return 'El correo electrónico es requerido.'
  if (!form.usuario.trim())         return 'El nombre de usuario es requerido.'
  if (!form.google_id && !form.contrasena) return 'Ingresa una contraseña o un Google ID.'
  return null
}

const guardar = async () => {
  const error = validar()
  if (error) { emit('alerta', error); return }

  await apiFetch('/clientes', {
    method: 'POST',
    body: JSON.stringify({
      persona: {
        nombre_completo:      form.nombre_completo,
        apellidos:            form.apellidos,
        num_viajero_conocido: form.num_viajero_conocido,
        num_dhs_trip:         form.num_dhs_trip,
      },
      cliente: {
        estado_cliente:       form.estado_cliente,
        fecha_registro:       form.fecha_registro,
        genero:               form.genero,
        fecha_nacimiento:     form.fecha_nacimiento,
        descripcion_personal: form.descripcion_personal,
      },
      documentacion: {
        id_tipo:              form.id_tipo_documento,
        numero_documentacion: form.numero_documentacion,
        fecha_emision:        form.fecha_emision,
        fecha_expiracion:     form.fecha_expiracion,
        emisor:               '',
      },
      cuenta: {
        usuario:    form.usuario,
        correo:     form.correo,
        google_id:  form.google_id || null,
        contrasena: form.contrasena || null,
      },
      telefono: {
        codigo_pais:       form.codigo_pais,
        numero_telefonico: form.numero_telefonico,
        id_tipo:           form.id_tipo_telefono,
        estado_telefono:   'A',
      },
    }),
  })
  emit('alerta', 'Cliente registrado exitosamente.', 'exito')
}

defineExpose({ guardar })
</script>

<style scoped>
@import '../assets/css/adminAgregarHotel.css';
.ah-tel-row { display: flex; gap: 8px; }
.ah-info-box {
  background: #f0f7ff; border: 1px solid #bfdbfe; border-radius: 8px;
  padding: 10px 14px; font-size: 12px; color: #265073; line-height: 1.5;
}
</style>