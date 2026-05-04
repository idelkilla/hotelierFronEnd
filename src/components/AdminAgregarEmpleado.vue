<template>
  <div class="ah-grid">
    <!-- ── Columna izquierda ── -->
    <div class="ah-col">
      <!-- Datos personales -->
      <div class="ah-card">
        <div class="ah-card-title">
          <i class="fas fa-user"></i> Datos Personales
        </div>
        <div class="ah-row">
          <div class="ah-field">
            <label>Nombre completo</label>
            <input
              v-model="form.nombre_completo"
              type="text"
              placeholder="Nombre(s)"
            />
          </div>
          <div class="ah-field">
            <label>Segundo nombre</label>
            <input
              v-model="form.segundo_nombre"
              type="text"
              placeholder="Opcional"
            />
          </div>
        </div>
        <div class="ah-row">
          <div class="ah-field">
            <label>Apellidos</label>
            <input
              v-model="form.apellidos"
              type="text"
              placeholder="Apellido paterno y materno"
            />
          </div>
          <div class="ah-field">
            <label>Género</label>
            <AppSelect 
              v-model="form.tipo_sexo" 
              :options="[
                { value: 'Masculino', label: 'Masculino' },
                { value: 'Femenino', label: 'Femenino' },
                { value: 'No binario', label: 'No binario' }
              ]" placeholder="Seleccionar..." />
          </div>
        </div>
        <div class="ah-row ah-row-3">
          <div class="ah-field">
            <label>Fecha de nacimiento</label>
            <input v-model="form.fecha_nacimiento" type="date" />
          </div>
          <div class="ah-field">
            <label>Tipo de sangre</label>
            <AppSelect 
              v-model="form.sangre" 
              :options="['A+','A-','B+','B-','AB+','AB-','O+','O-'].map(s => ({ value: s, label: s }))" />
          </div>
          <div class="ah-field">
            <label>Estado civil</label>
            <AppSelect 
              v-model="form.id_estado_civil"
              :options="estadosCiviles.map(e => ({ value: e.ID_ESTADO_CIVIL, label: e.NOMBRE_ESTADO }))"
              placeholder="Seleccionar..." />
          </div>
        </div>
        <div class="ah-row">
          <div class="ah-field">
            <label>Estatura (cm)</label>
            <input
              v-model="form.estatura"
              type="text"
              placeholder="175"
              maxlength="5"
            />
          </div>
          <div class="ah-field">
            <label>Peso (kg)</label>
            <input
              v-model="form.peso"
              type="text"
              placeholder="70"
              maxlength="5"
            />
          </div>
        </div>
        <div class="ah-row">
          <div class="ah-field">
            <label>Contacto de emergencia</label>
            <input
              v-model="form.contacto_emergencia_nombre"
              type="text"
              placeholder="Nombre del contacto"
            />
          </div>
          <div class="ah-field">
            <label>Tel. emergencia</label>
            <input
              v-model="form.contacto_emergencia_tel"
              type="text"
              placeholder="809-000-0000"
            />
          </div>
        </div>
      </div>

      <!-- Documentación -->
      <div class="ah-card">
        <div class="ah-card-title">
          <i class="fas fa-id-card"></i> Documentación
        </div>
        <div class="ah-row">
          <div class="ah-field">
            <label>Tipo de documento</label>
            <AppSelect 
              v-model="form.id_tipo_documento"
              :options="tiposDocumento.map(t => ({ value: t.ID_TIPO, label: t.TIPO }))"
              placeholder="Seleccionar..." />
          </div>
          <div class="ah-field">
            <label>Número</label>
            <input
              v-model="form.numero_documentacion"
              type="text"
              placeholder="001-0000000-0"
              maxlength="10"
            />
          </div>
        </div>
        <div class="ah-row ah-row-3">
          <div class="ah-field">
            <label>Emisor</label>
            <input v-model="form.emisor" type="text" placeholder="JCE" />
          </div>
          <div class="ah-field">
            <label>Fecha emisión</label>
            <input v-model="form.fecha_emision" type="date" />
          </div>
          <div class="ah-field">
            <label>Fecha expiración</label>
            <input v-model="form.fecha_expiracion" type="date" />
          </div>
        </div>
      </div>

      <!-- Datos de empleo -->
      <div class="ah-card">
        <div class="ah-card-title">
          <i class="fas fa-briefcase"></i> Datos de Empleo
        </div>
        <div class="ah-row">
          <div class="ah-field">
            <label>Fecha de contratación</label>
            <input v-model="form.fecha_contratacion" type="date" />
          </div>
          <div class="ah-field">
            <label>Puesto</label>
            <AppSelect 
              v-model="form.id_puesto"
              :options="puestos.map(p => ({ value: p.ID_PUESTO, label: p.NOMBRE_PUESTO }))"
              placeholder="Seleccionar puesto..." />
          </div>
        </div>
        <div class="ah-row">
          <div class="ah-field">
            <label>Sueldo base (RD$)</label>
            <input
              v-model.number="form.sueldo"
              type="number"
              min="0"
              step="500"
              placeholder="45000"
            />
          </div>
          <div class="ah-field">
            <label>Turno</label>
            <AppSelect 
              v-model="form.turno"
              :options="[
                { value: 'Matutino', label: 'Matutino' },
                { value: 'Vespertino', label: 'Vespertino' },
                { value: 'Nocturno', label: 'Nocturno' }
              ]" />
          </div>
        </div>
      </div>

      <!-- Idiomas -->
      <div class="ah-card">
        <div class="ah-card-title">
          <i class="fas fa-language"></i> Idiomas
          <button class="ah-btn-add" @click="agregarIdioma">
            <i class="fas fa-plus"></i> Agregar
          </button>
        </div>
        <div v-if="!form.idiomas.length" class="ah-empty">
          Sin idiomas agregados.
        </div>
        <div v-else class="ah-idioma-list">
          <div v-for="(id, i) in form.idiomas" :key="i" class="ah-idioma-row">
            <AppSelect 
              v-model="id.id_idioma"
              :options="idiomas.map(l => ({ value: l.ID_IDIOMA, label: l.NOMBRE_IDIOMA }))"
              placeholder="Idioma..." />
            <AppSelect 
              v-model="id.nivel"
              :options="[
                { value: 'Nativo', label: 'Nativo' },
                { value: 'Avanzado', label: 'Avanzado' },
                { value: 'Intermedio', label: 'Intermedio' },
                { value: 'Básico', label: 'Básico' }
              ]" />
            <button class="ah-icon-btn" @click="form.idiomas.splice(i,1)">
              <i class="fas fa-trash"></i>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- ── Columna derecha ── -->
    <div class="ah-col">
      <!-- Cuenta de acceso -->
      <div class="ah-card">
        <div class="ah-card-title">
          <i class="fas fa-key"></i> Cuenta de Acceso
        </div>
        <div class="ah-field">
          <label>Usuario</label>
          <input
            v-model="form.usuario"
            type="text"
            placeholder="ej. c.mendez"
          />
        </div>
        <div class="ah-field">
          <label>Correo electrónico</label>
          <input
            v-model="form.correo"
            type="email"
            placeholder="correo@hotelier.com"
          />
        </div>
        <div class="ah-field">
          <label>Contraseña temporal</label>
          <input
            v-model="form.contrasena"
            type="password"
            placeholder="••••••••"
          />
        </div>
      </div>

      <!-- Teléfono -->
      <div class="ah-card">
        <div class="ah-card-title"><i class="fas fa-phone"></i> Contacto</div>
        <div class="ah-field">
          <label>Teléfono principal</label>
          <div class="ah-tel-row">
            <input
              v-model="form.codigo_pais"
              type="text"
              placeholder="+1"
              maxlength="5"
              style="width: 64px"
            />
            <input
              v-model="form.numero_telefonico"
              type="text"
              placeholder="809-555-0000"
            />
          </div>
        </div>
        <div class="ah-field">
          <label>Tipo de teléfono</label>
          <AppSelect 
            v-model="form.id_tipo_telefono"
            :options="tiposTelefono.map(t => ({ value: t.ID_TIPO, label: t.NOMBRE }))"
            placeholder="Seleccionar..." />
        </div>
      </div>

      <!-- Correos adicionales -->
      <div class="ah-card">
        <div class="ah-card-title">
          <i class="fas fa-envelope"></i> Correos Adicionales
          <button class="ah-btn-add" @click="agregarCorreo">
            <i class="fas fa-plus"></i> Agregar
          </button>
        </div>
        <div v-if="!form.correos.length" class="ah-empty">
          Sin correos adicionales.
        </div>
        <div v-else class="ah-idioma-list">
          <div v-for="(c, i) in form.correos" :key="i" class="ah-idioma-row">
            <input
              v-model="c.correo"
              type="email"
              placeholder="correo@ejemplo.com"
              style="flex: 2"
            />
            <AppSelect 
              v-model="c.id_tipo"
              :options="tiposCorreo.map(t => ({ value: t.ID_TIPO, label: t.NOMBRE }))"
              placeholder="Tipo..." />
            <button class="ah-icon-btn" @click="form.correos.splice(i,1)">
              <i class="fas fa-trash"></i>
            </button>
          </div>
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

  const form = reactive({
    nombre_completo: '',
    segundo_nombre: '',
    apellidos: '',
    tipo_sexo: '',
    fecha_nacimiento: '',
    sangre: 'O+',
    estatura: '',
    peso: '',
    id_estado_civil: '',
    contacto_emergencia_nombre: '',
    contacto_emergencia_tel: '',
    // Documentación
    id_tipo_documento: '',
    numero_documentacion: '',
    emisor: '',
    fecha_emision: '',
    fecha_expiracion: '',
    // Empleo
    fecha_contratacion: '',
    id_puesto: '',
    sueldo: 0,
    turno: 'Matutino',
    // Cuenta
    usuario: '',
    correo: '',
    contrasena: '',
    // Teléfono
    codigo_pais: '+1',
    numero_telefonico: '',
    id_tipo_telefono: '',
    // Idiomas y correos adicionales
    idiomas: [],
    correos: [],
  })

  const puestos = ref([])
  const idiomas = ref([])
  const estadosCiviles = ref([])
  const tiposDocumento = ref([])
  const tiposTelefono = ref([])
  const tiposCorreo = ref([])

  onMounted(async () => {
    try {
      const [p, id, ec, td, tt, tc] = await Promise.all([
        apiFetch('/catalogos/puestos'),
        apiFetch('/catalogos/idiomas'),
        apiFetch('/catalogos/estados-civiles'),
        apiFetch('/catalogos/tipos-documentacion'),
        apiFetch('/catalogos/tipos-telefono'),
        apiFetch('/catalogos/tipos-correo'),
      ])
      puestos.value = p
      idiomas.value = id
      estadosCiviles.value = ec
      tiposDocumento.value = td
      tiposTelefono.value = tt
      tiposCorreo.value = tc
    } catch (e) {
      emit('alerta', 'Error cargando catálogos del empleado: ' + e.message)
    }
  })

  const agregarIdioma = () =>
    form.idiomas.push({ id_idioma: '', nivel: 'Avanzado' })
  const agregarCorreo = () =>
    form.correos.push({ correo: '', id_tipo: '', estado_correo: 'A' })

  const validar = () => {
    if (!form.nombre_completo.trim()) return 'El nombre completo es requerido.'
    if (!form.apellidos.trim()) return 'Los apellidos son requeridos.'
    if (!form.correo.trim()) return 'El correo electrónico es requerido.'
    if (!form.usuario.trim()) return 'El nombre de usuario es requerido.'
    if (!form.contrasena.trim()) return 'La contraseña es requerida.'
    if (!form.id_puesto) return 'Selecciona un puesto.'
    if (!form.fecha_contratacion)
      return 'La fecha de contratación es requerida.'
    return null
  }

  const guardar = async () => {
    const error = validar()
    if (error) {
      emit('alerta', error)
      return
    }

    await apiFetch('/empleados', {
      method: 'POST',
      body: JSON.stringify({
        persona: {
          nombre_completo: form.nombre_completo,
          segundo_nombre: form.segundo_nombre,
          apellidos: form.apellidos,
          contacto_emergencia_nombre: form.contacto_emergencia_nombre,
          contacto_emergencia_tel: form.contacto_emergencia_tel,
        },
        datos_biograficos: {
          fecha_nacimiento: form.fecha_nacimiento,
          tipo_sexo: form.tipo_sexo,
          sangre: form.sangre,
          estatura: form.estatura,
          peso: form.peso,
          id_estado_civil: form.id_estado_civil,
        },
        documentacion: {
          id_tipo: form.id_tipo_documento,
          numero_documentacion: form.numero_documentacion,
          emisor: form.emisor,
          fecha_emision: form.fecha_emision,
          fecha_expiracion: form.fecha_expiracion,
        },
        empleo: {
          fecha_contratacion: form.fecha_contratacion,
          id_puesto: form.id_puesto,
          sueldo: form.sueldo,
          turno: form.turno,
        },
        cuenta: {
          usuario: form.usuario,
          correo: form.correo,
          contrasena: form.contrasena,
        },
        telefono: {
          codigo_pais: form.codigo_pais,
          numero_telefonico: form.numero_telefonico,
          id_tipo: form.id_tipo_telefono,
          estado_telefono: 'A',
        },
        idiomas: form.idiomas,
        correos: form.correos,
      }),
    })
    emit('alerta', 'Empleado registrado exitosamente.', 'exito')
  }

  defineExpose({ guardar })
</script>

<style scoped>
  @import '../assets/css/adminAgregarHotel.css';

  .ah-idioma-list {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }
  .ah-idioma-row {
    display: flex;
    gap: 8px;
    align-items: center;
  }
  .ah-idioma-row select,
  .ah-idioma-row input {
    flex: 1;
    border: 1px solid #e2e8f0;
    border-radius: 7px;
    padding: 7px 9px;
    font-size: 13px;
    color: #0f172a;
    background: #fff;
    font-family: inherit;
    outline: none;
  }
  .ah-idioma-row select:focus,
  .ah-idioma-row input:focus {
    border-color: #265073;
  }
  .ah-tel-row {
    display: flex;
    gap: 8px;
  }
  .ah-row-3 {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
</style>
