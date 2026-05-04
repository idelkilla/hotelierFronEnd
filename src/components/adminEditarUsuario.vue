<template>
  <div class="ah-grid" style="padding: 24px">

    <!-- Columna izquierda -->
    <div class="ah-col">

      <!-- Datos personales -->
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
            <label>Correo electrónico</label>
            <input v-model="form.correo" type="email" placeholder="correo@ejemplo.com" />
          </div>
          <div class="ah-field">
            <label>Usuario</label>
            <input v-model="form.usuario" type="text" placeholder="usuario123" />
          </div>
        </div>

        <!-- Campos extra para Empleado -->
        <template v-if="tipo === 'empleado'">
          <div class="ah-row">
            <div class="ah-field">
              <label>Puesto</label>
              <AppSelect 
                v-model="form.id_puesto"
                :options="catalogos.puestos.map(p => ({ value: p.ID_PUESTO, label: p.NOMBRE_PUESTO }))"
                placeholder="Seleccionar..." />
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
          <div class="ah-row">
            <div class="ah-field">
              <label>Sueldo base (RD$)</label>
              <input v-model.number="form.sueldo" type="number" min="0" step="500" placeholder="45000" />
            </div>
            <div class="ah-field">
              <label>Fecha de contratación</label>
              <input v-model="form.fecha_contratacion" type="date" />
            </div>
          </div>
        </template>

        <!-- Campos extra para Cliente -->
        <template v-if="tipo === 'cliente'">
          <div class="ah-row">
            <div class="ah-field">
              <label>Género</label>
              <AppSelect 
                v-model="form.genero"
                :options="[
                  { value: 'M', label: 'Masculino' },
                  { value: 'F', label: 'Femenino' }
                ]" placeholder="Seleccionar..." />
            </div>
            <div class="ah-field">
              <label>Estado</label>
              <AppSelect 
                v-model="form.estado_cliente"
                :options="[
                  { value: 'A', label: 'Activo' },
                  { value: 'I', label: 'Inactivo' }
                ]" />
            </div>
          </div>
          <div class="ah-field">
            <label>Descripción personal</label>
            <textarea v-model="form.descripcion_personal" rows="3"
              placeholder="Intereses, preferencias de viaje..."></textarea>
          </div>
        </template>

        <!-- Campos extra para Miembro -->
        <template v-if="tipo === 'miembro'">
          <div class="ah-row">
            <div class="ah-field">
              <label>Número de miembro</label>
              <input v-model="form.numero_miembro" type="text" placeholder="MEM-000001" />
            </div>
            <div class="ah-field">
              <label>Nivel de membresía</label>
              <AppSelect 
                v-model="form.id_nivel"
                :options="catalogos.nivelMembresia.map(n => ({ value: n.ID_NIVEL, label: n.NOMBRE_NIVEL }))"
                placeholder="Seleccionar..." />
            </div>
          </div>
          <div class="ah-row">
            <div class="ah-field">
              <label>Puntos de fidelidad</label>
              <input v-model.number="form.puntos_fidelidad" type="number" min="0" placeholder="0" />
            </div>
            <div class="ah-field">
              <label>Fecha de inicio</label>
              <input v-model="form.fecha_inicio" type="date" />
            </div>
          </div>
        </template>
      </div>

      <!-- Teléfono -->
      <div class="ah-card">
        <div class="ah-card-title"><i class="fas fa-phone"></i> Contacto</div>
        <div class="ah-field">
          <label>Teléfono</label>
          <div class="ah-tel-row">
            <input v-model="form.codigo_pais" type="text" placeholder="+1" maxlength="5" style="width:64px" />
            <input v-model="form.numero_telefonico" type="text" placeholder="809-555-0000" />
          </div>
        </div>
      </div>
    </div>

    <!-- Columna derecha -->
    <div class="ah-col">

      <!-- Seguridad -->
      <div class="ah-card">
        <div class="ah-card-title"><i class="fas fa-lock"></i> Seguridad</div>
        <div class="ah-field">
          <label>Nueva contraseña <span style="color:#94a3b8;font-weight:400">(dejar vacío para no cambiar)</span></label>
          <input v-model="form.nueva_contrasena" type="password" placeholder="••••••••" />
        </div>
      </div>

      <!-- Información -->
      <div class="ah-card">
        <div class="ah-card-title"><i class="fas fa-info-circle"></i> Información del Registro</div>
        <div class="ah-info-row">
          <span class="ah-info-label">Tipo</span>
          <span :class="['usr-badge', tipoBadge]">{{ props.usuario.tipo }}</span>
        </div>
        <div class="ah-info-row">
          <span class="ah-info-label">ID</span>
          <span class="ah-info-value">#{{ props.usuario.id }}</span>
        </div>
        <div class="ah-info-row">
          <span class="ah-info-label">Estado</span>
          <span :class="['usr-badge', props.usuario.estado === 'A' ? 'badge-activo' : 'badge-inactivo']">
            {{ props.usuario.estado === 'A' ? 'Activo' : 'Inactivo' }}
          </span>
        </div>
        <div v-if="props.usuario.nivel_membresia" class="ah-info-row">
          <span class="ah-info-label">Membresía</span>
          <span :class="['usr-badge', nivelBadge(props.usuario.nivel_membresia)]">
            {{ props.usuario.nivel_membresia }}
          </span>
        </div>
      </div>

      <!-- Zona peligrosa -->
      <div class="ah-card ah-card--danger">
        <div class="ah-card-title" style="color:#b91c1c"><i class="fas fa-exclamation-triangle"></i> Zona Peligrosa</div>
        <p style="font-size:13px;color:#64748b;margin:0 0 14px">
          Esta acción eliminará el registro de forma permanente y no se puede deshacer.
        </p>
        <button class="ah-btn-danger" :disabled="eliminando" @click="confirmarEliminar">
          <i class="fas fa-trash"></i> {{ eliminando ? 'Eliminando...' : 'Eliminar usuario' }}
        </button>
      </div>
    </div>

    <!-- Botones de acción (fila completa) -->
    <div class="ah-actions-row">
      <button class="usr-btn-secondary" @click="resetForm">
        <i class="fas fa-undo"></i> Descartar cambios
      </button>
      <button class="usr-btn-primary" :disabled="guardando" @click="guardar">
        <i class="fas fa-save"></i> {{ guardando ? 'Guardando...' : 'Guardar cambios' }}
      </button>
    </div>

    <!-- Modal de confirmación -->
    <Teleport to="body">
      <div v-if="showConfirm" class="ah-overlay" @click.self="showConfirm = false">
        <div class="ah-confirm-modal">
          <div class="ah-confirm-icon"><i class="fas fa-exclamation-triangle"></i></div>
          <h3>¿Eliminar usuario?</h3>
          <p>Esta acción no se puede deshacer. El registro será eliminado permanentemente.</p>
          <div class="ah-confirm-actions">
            <button class="usr-btn-secondary" @click="showConfirm = false">Cancelar</button>
            <button class="ah-btn-danger" @click="eliminar">Sí, eliminar</button>
          </div>
        </div>
      </div>
    </Teleport>

  </div>
</template>

<script setup>
import { reactive, ref, computed, onMounted } from 'vue'
import AppSelect from './AppSelect.vue'

const props = defineProps({
  usuario: { type: Object, required: true },
  catalogos: { type: Object, default: () => ({ puestos: [], nivelMembresia: [] }) },
})

const emit = defineEmits(['guardado', 'eliminado', 'alerta'])

const API_BASE = import.meta.env.VITE_API_URL || 'https://hotelierbackend-1.onrender.com/api'

const guardando  = ref(false)
const eliminando = ref(false)
const showConfirm = ref(false)

// Tipo normalizado
const tipo = computed(() => props.usuario.tipo?.toLowerCase() || '')

// Form inicializado con los datos actuales del usuario
const buildForm = () => ({
  nombre_completo:     props.usuario.nombre_completo || props.usuario.nombre || '',
  apellidos:           props.usuario.apellidos        || '',
  correo:              props.usuario.correo           || '',
  usuario:             props.usuario.usuario          || '',
  codigo_pais:         props.usuario.codigo_pais      || '+1',
  numero_telefonico:   props.usuario.numero_telefonico|| '',
  nueva_contrasena:    '',
  // Empleado
  id_puesto:           props.usuario.id_puesto        || '',
  turno:               props.usuario.turno            || 'Matutino',
  sueldo:              props.usuario.sueldo           || 0,
  fecha_contratacion:  props.usuario.fecha_contratacion || '',
  // Cliente
  genero:              props.usuario.genero           || '',
  estado_cliente:      props.usuario.estado           || 'A',
  descripcion_personal:props.usuario.descripcion_personal || '',
  // Miembro
  numero_miembro:      props.usuario.numero_miembro   || '',
  id_nivel:            props.usuario.id_nivel         || '',
  puntos_fidelidad:    props.usuario.puntos_fidelidad || 0,
  fecha_inicio:        props.usuario.fecha_inicio     || '',
})

const form = reactive(buildForm())

const resetForm = () => Object.assign(form, buildForm())

// Badges
const tipoBadge = computed(() =>
  ({ empleado: 'badge-empleado', cliente: 'badge-cliente', miembro: 'badge-miembro' })[tipo.value] || ''
)

const nivelBadge = (nivel) =>
  ({ Bronze: 'badge-amber', Silver: 'badge-blue', Gold: 'badge-gold', Platinum: 'badge-purple' })[nivel] || 'badge-gray'

import { apiFetch } from '../services/api'

// Guardar
const guardar = async () => {
  if (!form.nombre_completo.trim()) return emit('alerta', 'El nombre completo es requerido.')
  if (!form.correo.trim())          return emit('alerta', 'El correo es requerido.')

  guardando.value = true
  try {
    const body = {
      tipo:              tipo.value, // ← debe estar aquí
      nombre_completo:   form.nombre_completo,
      apellidos:         form.apellidos,
      correo:            form.correo,
      usuario:           form.usuario,
      codigo_pais:       form.codigo_pais,
      numero_telefonico: form.numero_telefonico,
      ...(form.nueva_contrasena ? { contrasena: form.nueva_contrasena } : {}),
    }

    if (tipo.value === 'empleado') {
      Object.assign(body, {
        id_puesto: form.id_puesto,
        turno: form.turno,
        sueldo: form.sueldo,
        fecha_contratacion: form.fecha_contratacion,
      })
    } else if (tipo.value === 'cliente') {
      Object.assign(body, {
        genero: form.genero,
        estado_cliente: form.estado_cliente,
        descripcion_personal: form.descripcion_personal,
      })
    } else if (tipo.value === 'miembro') {
      Object.assign(body, {
        numero_miembro: form.numero_miembro,
        id_nivel: form.id_nivel,
        puntos_fidelidad: form.puntos_fidelidad,
        fecha_inicio: form.fecha_inicio,
      })
    }

    await apiFetch(`/usuarios/${props.usuario.id}`, { method: 'PUT', body: JSON.stringify(body) })
    emit('guardado')
  } catch (e) {
    emit('alerta', 'Error al guardar: ' + e.message)
  } finally {
    guardando.value = false
  }
}

// Eliminar
const confirmarEliminar = () => { showConfirm.value = true }

const eliminar = async () => {
  showConfirm.value = false
  eliminando.value = true
  try {
    await apiFetch(`/usuarios/${props.usuario.id}`, { method: 'DELETE' })
    emit('eliminado')
  } catch (e) {
    emit('alerta', 'Error al eliminar: ' + e.message)
  } finally {
    eliminando.value = false
  }
}
</script>

<style scoped>
@import '../assets/css/adminAgregarHotel.css';

.ah-tel-row { display: flex; gap: 8px; }

.ah-actions-row {
  grid-column: 1 / -1;
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  padding-top: 8px;
  border-top: 1px solid #e8ecf4;
}

.ah-info-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 0;
  border-bottom: 1px solid #f1f5f9;
  font-size: 13px;
}
.ah-info-row:last-child { border-bottom: none; }
.ah-info-label { color: #64748b; font-weight: 500; }
.ah-info-value { color: #0f172a; font-weight: 600; }

.ah-card--danger { border: 1px solid #fca5a5 !important; }

.ah-btn-danger {
  background: #fef2f2;
  color: #b91c1c;
  border: 1px solid #fca5a5;
  padding: 9px 18px;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 7px;
  transition: all 0.2s;
}
.ah-btn-danger:hover:not(:disabled) {
  background: #fee2e2;
  border-color: #ef4444;
}
.ah-btn-danger:disabled { opacity: 0.6; cursor: not-allowed; }

/* Botones reutilizados del padre */
.usr-btn-primary {
  background: #265073; color: #fff; border: none;
  padding: 10px 20px; border-radius: 8px;
  font-size: 13px; font-weight: 600; cursor: pointer;
  display: flex; align-items: center; gap: 6px;
  transition: background 0.2s;
}
.usr-btn-primary:hover:not(:disabled) { background: #1e3f5a; }
.usr-btn-primary:disabled { opacity: 0.6; cursor: not-allowed; }
.usr-btn-secondary {
  background: #fff; color: #475569;
  border: 1px solid #e2e8f0; padding: 10px 20px;
  border-radius: 8px; font-size: 13px; font-weight: 600;
  cursor: pointer; transition: all 0.2s;
  display: flex; align-items: center; gap: 6px;
}
.usr-btn-secondary:hover { background: #f8fafc; }

/* Badges (copiados para funcionar sin padre) */
.usr-badge { display:inline-flex;align-items:center;font-size:11px;font-weight:600;padding:3px 9px;border-radius:20px; }
.badge-empleado { background:#e6f1fb;color:#0c447c; }
.badge-cliente  { background:#eeedfe;color:#3c3489; }
.badge-miembro  { background:#e1f5ee;color:#085041; }
.badge-activo   { background:#f0fdf4;color:#15803d; }
.badge-inactivo { background:#fef2f2;color:#b91c1c; }
.badge-amber    { background:#faeeda;color:#633806; }
.badge-blue     { background:#e6f1fb;color:#0c447c; }
.badge-gold     { background:#faeeda;color:#854f0b; }
.badge-purple   { background:#eeedfe;color:#3c3489; }
.badge-gray     { background:#f1efe8;color:#444441; }

/* Modal */
.ah-overlay {
  position: fixed; inset: 0; background: rgba(0,0,0,0.4);
  display: flex; align-items: center; justify-content: center; z-index: 1000;
}
.ah-confirm-modal {
  background: #fff; border-radius: 14px; padding: 32px 28px;
  max-width: 400px; width: 90%; text-align: center;
  box-shadow: 0 20px 60px rgba(0,0,0,0.18);
}
.ah-confirm-icon {
  font-size: 36px; color: #f59e0b; margin-bottom: 12px;
}
.ah-confirm-modal h3 {
  font-size: 18px; font-weight: 700; color: #0f172a; margin: 0 0 8px;
}
.ah-confirm-modal p {
  font-size: 13px; color: #64748b; margin: 0 0 24px; line-height: 1.5;
}
.ah-confirm-actions {
  display: flex; gap: 10px; justify-content: center;
}
</style>