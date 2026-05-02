<template>
    <div class="ah-grid">

        <!-- Columna izquierda -->
        <div class="ah-col">

            <div class="ah-card">
                <div class="ah-card-title"><i class="fas fa-search"></i> Vincular Cliente Existente</div>
                <div class="ah-field">
                    <label>Buscar cliente por nombre o ID</label>
                    <input v-model="busqueda" type="text" placeholder="Escribe para buscar..." @input="buscarCliente" />
                </div>

                <!-- Resultados búsqueda -->
                <div v-if="resultados.length" class="ah-resultados">
                    <div v-for="c in resultados" :key="c.ID_CLIENTE"
                        :class="['ah-resultado-item', { selected: form.id_cliente === c.ID_CLIENTE }]"
                        @click="seleccionarCliente(c)">
                        <div class="ah-mini-avatar">{{ iniciales(c.NOMBRE) }}</div>
                        <div>
                            <div class="ah-r-nombre">{{ c.NOMBRE }}</div>
                            <div class="ah-r-sub">ID #{{ c.ID_CLIENTE }} · {{ c.CORREO }}</div>
                        </div>
                        <i v-if="form.id_cliente === c.ID_CLIENTE" class="fas fa-check-circle"
                            style="color:#265073;margin-left:auto"></i>
                    </div>
                </div>

                <!-- Cliente seleccionado -->
                <div v-if="clienteSeleccionado" class="ah-cliente-selected">
                    <div class="ah-mini-avatar" style="width:40px;height:40px;font-size:15px">
                        {{ iniciales(clienteSeleccionado.NOMBRE) }}
                    </div>
                    <div style="flex:1">
                        <div style="font-size:14px;font-weight:600;color:#0f172a">{{ clienteSeleccionado.NOMBRE }}</div>
                        <div style="font-size:12px;color:#94a3b8">Cliente #{{ clienteSeleccionado.ID_CLIENTE }} · {{
                            clienteSeleccionado.ESTADO_CLIENTE === 'A' ? 'Activo' : 'Inactivo' }}</div>
                    </div>
                    <span v-if="clienteSeleccionado.tiene_membresia"
                        style="font-size:11px;font-weight:600;background:#fef3c7;color:#92400e;padding:3px 8px;border-radius:12px">
                        Ya es miembro
                    </span>
                </div>
            </div>

            <div class="ah-card">
                <div class="ah-card-title"><i class="fas fa-star"></i> Datos de Membresía</div>
                <div class="ah-row">
                    <div class="ah-field">
                        <label>Número de miembro</label>
                        <input v-model="form.numero_miembro" type="text" placeholder="MEM-000001" maxlength="10" />
                    </div>
                    <div class="ah-field">
                        <label>Fecha de inicio</label>
                        <input v-model="form.fecha_inicio" type="date" />
                    </div>
                </div>
                <div class="ah-row">
                    <div class="ah-field">
                        <label>Nivel de membresía</label>
                        <AppSelect 
                            v-model="form.id_nivel"
                            :options="niveles.map(n => ({ value: n.ID_NIVEL, label: `${n.NOMBRE_NIVEL} (${n.PUNTOS_MINIMOS.toLocaleString()}+ pts)` }))"
                            placeholder="Seleccionar nivel..." />
                    </div>
                    <div class="ah-field">
                        <label>Puntos de fidelidad</label>
                        <input v-model.number="form.puntos_fidelidad" type="number" min="0" placeholder="0" />
                    </div>
                </div>
            </div>

        </div>

        <!-- Columna derecha: niveles disponibles -->
        <div class="ah-col">
            <div class="ah-card">
                <div class="ah-card-title"><i class="fas fa-trophy"></i> Niveles Disponibles</div>
                <div v-if="!niveles.length" class="ah-empty">Cargando niveles...</div>
                <div v-else style="display:flex;flex-direction:column;gap:8px">
                    <div v-for="n in niveles" :key="n.ID_NIVEL"
                        :class="['ah-nivel-item', { 'ah-nivel-active': form.id_nivel === n.ID_NIVEL }]"
                        @click="form.id_nivel = n.ID_NIVEL">
                        <div>
                            <div class="ah-nivel-nombre">{{ n.NOMBRE_NIVEL }}</div>
                            <div class="ah-nivel-pts">{{ n.PUNTOS_MINIMOS.toLocaleString() }} pts mínimos</div>
                            <div v-if="n.DESCRIPCION" class="ah-nivel-desc">{{ n.DESCRIPCION }}</div>
                        </div>
                        <span :class="['usr-badge', nivelBadge(n.NOMBRE_NIVEL)]">{{ n.NOMBRE_NIVEL }}</span>
                    </div>
                </div>
            </div>
        </div>

    </div>
</template>

<script setup>
import { reactive, ref, onMounted } from 'vue'
import AppSelect from './AppSelect.vue'

const emit = defineEmits(['alerta'])
const API_BASE = import.meta.env.VITE_API_URL || 'https://hotelierbackend-1.onrender.com/api'

const today = new Date().toISOString().slice(0, 10)

const form = reactive({
    id_cliente: null,
    numero_miembro: '',
    fecha_inicio: today,
    id_nivel: '',
    puntos_fidelidad: 0,
})

const busqueda = ref('')
const resultados = ref([])
const clienteSeleccionado = ref(null)
const niveles = ref([])

const apiFetch = async (path, options = {}) => {
    const token = localStorage.getItem('user_token')
    const headers = { 'Content-Type': 'application/json', ...options.headers }
    if (token) headers['Authorization'] = `Bearer ${token}`
    const res = await fetch(`${API_BASE}${path}`, { headers, ...options })
    if (!res.ok) { const e = await res.json().catch(() => ({})); throw new Error(e.message || `Error ${res.status}`) }
    return res.json()
}

onMounted(async () => {
    try {
        niveles.value = await apiFetch('/catalogos/niveles-membresia')
    } catch (e) {
        emit('alerta', 'Error cargando niveles: ' + e.message)
    }
})

let debounceTimer = null
const buscarCliente = () => {
    clearTimeout(debounceTimer)
    debounceTimer = setTimeout(async () => {
        if (!busqueda.value.trim()) { resultados.value = []; return }
        try {
            resultados.value = await apiFetch(`/clientes/buscar?q=${encodeURIComponent(busqueda.value)}`)
        } catch { }
    }, 350)
}

const seleccionarCliente = (c) => {
    form.id_cliente = c.ID_CLIENTE
    clienteSeleccionado.value = c
    resultados.value = []
    busqueda.value = c.NOMBRE
}

const iniciales = (nombre = '') =>
    nombre.split(' ').slice(0, 2).map(p => p[0]).join('').toUpperCase()

const nivelBadge = (nombre) => ({
    Bronze: 'badge-amber',
    Silver: 'badge-blue',
    Gold: 'badge-gold',
    Platinum: 'badge-purple',
}[nombre] || 'badge-gray')

const validar = () => {
    if (!form.id_cliente) return 'Selecciona un cliente.'
    if (!form.numero_miembro.trim()) return 'El número de miembro es requerido.'
    if (!form.fecha_inicio) return 'La fecha de inicio es requerida.'
    if (!form.id_nivel) return 'Selecciona un nivel de membresía.'
    if (clienteSeleccionado.value?.tiene_membresia) return 'Este cliente ya tiene membresía activa.'
    return null
}

const guardar = async () => {
    const error = validar()
    if (error) { emit('alerta', error); return }

    await apiFetch('/miembros', {
        method: 'POST',
        body: JSON.stringify({
            id_cliente: form.id_cliente,
            numero_miembro: form.numero_miembro,
            fecha_inicio: form.fecha_inicio,
            id_nivel: form.id_nivel,
            puntos_fidelidad: form.puntos_fidelidad,
        }),
    })
    emit('alerta', 'Membresía asignada exitosamente.', 'exito')
}

defineExpose({ guardar })
</script>

<style scoped>
@import '../assets/css/adminAgregarHotel.css';

.ah-resultados {
    display: flex;
    flex-direction: column;
    gap: 4px;
    margin-top: 8px;
    border: 1px solid #e2e8f0;
    border-radius: 8px;
    overflow: hidden;
}

.ah-resultado-item {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 10px 12px;
    cursor: pointer;
    transition: background 0.15s;
}

.ah-resultado-item:hover {
    background: #f8fafc;
}

.ah-resultado-item.selected {
    background: #f0f7ff;
}

.ah-mini-avatar {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    background: #EEEDFE;
    color: #3C3489;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 12px;
    font-weight: 700;
    flex-shrink: 0;
}

.ah-r-nombre {
    font-size: 13px;
    font-weight: 600;
    color: #0f172a;
}

.ah-r-sub {
    font-size: 11px;
    color: #94a3b8;
}

.ah-cliente-selected {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-top: 12px;
    background: #f0f7ff;
    border: 1px solid #bfdbfe;
    border-radius: 8px;
    padding: 10px 14px;
}

.ah-nivel-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 12px 14px;
    border: 1px solid #e2e8f0;
    border-radius: 9px;
    cursor: pointer;
    transition: all 0.15s;
}

.ah-nivel-item:hover {
    border-color: #265073;
    background: #f8fafc;
}

.ah-nivel-item.ah-nivel-active {
    border: 1.5px solid #265073;
    background: #f0f7ff;
}

.ah-nivel-nombre {
    font-size: 13px;
    font-weight: 600;
    color: #0f172a;
}

.ah-nivel-pts {
    font-size: 11px;
    color: #94a3b8;
}

.ah-nivel-desc {
    font-size: 11px;
    color: #64748b;
    margin-top: 2px;
}

/* Badges compartidos (duplicados para que funcionen sin el padre) */
.usr-badge {
    display: inline-flex;
    align-items: center;
    font-size: 11px;
    font-weight: 600;
    padding: 3px 9px;
    border-radius: 20px;
}

.badge-amber {
    background: #FAEEDA;
    color: #633806;
}

.badge-blue {
    background: #E6F1FB;
    color: #0C447C;
}

.badge-gold {
    background: #FAEEDA;
    color: #854F0B;
}

.badge-purple {
    background: #EEEDFE;
    color: #3C3489;
}

.badge-gray {
    background: #F1EFE8;
    color: #444441;
}
</style>