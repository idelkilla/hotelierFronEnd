<template>
  <Teleport to="body">
    <Transition name="ck-slide">
      <div v-if="visible" class="ck-overlay" @click.self="$emit('cerrar')">
        <div class="ck-modal">
          <!-- ══ HEADER ══════════════════════════════════════════════════ -->
          <div class="ck-header">
            <button class="ck-close" @click="$emit('cerrar')">
              <span class="material-symbols-outlined">close</span>
            </button>
            <span class="ck-header-title">Finalizar reserva</span>
            <!-- Stepper -->
            <div class="ck-steps">
              <div
                v-for="(s, i) in pasos"
                :key="i"
                class="ck-step"
                :class="{ active: paso === i, done: paso > i }"
              >
                <div class="ck-step-dot">
                  <span
                    v-if="paso > i"
                    class="material-symbols-outlined"
                    style="font-size: 13px"
                    >check</span
                  >
                  <span v-else>{{ i + 1 }}</span>
                </div>
                <span class="ck-step-label">{{ s }}</span>
              </div>
            </div>
          </div>

          <!-- ══ BODY ════════════════════════════════════════════════════ -->
          <div class="ck-body">
            <!-- ── Columna izquierda ─────────────────────────────────── -->
            <div class="ck-left">
              <!-- Política de cancelación -->
              <div class="ck-policy">
                <span class="material-symbols-outlined">event_available</span>
                <div>
                  <strong
                    >100% reembolsable antes del
                    {{ fechaLimiteFormateada }}</strong
                  >
                  <p>
                    Si tus planes cambian, puedes cancelar esta estancia y
                    obtener un reembolso total.
                  </p>
                </div>
              </div>

              <!-- ════ PASO 0: Huésped ════════════════════════════════ -->
              <Transition name="ck-fade" mode="out-in">
                <section v-if="paso === 0" key="huesped" class="ck-section">
                  <h3 class="ck-section-title">¿Quién hará el check-in?</h3>
                  <p class="ck-hint">
                    <span class="req">*</span> Campo obligatorio
                  </p>

                  <div class="ck-grid2">
                    <div class="ck-field" :class="{ error: errors.nombre }">
                      <label>Nombre <span class="req">*</span></label>
                      <input
                        v-model="form.nombre"
                        type="text"
                        placeholder="ej., Juan"
                        @blur="validarCampo('nombre')"
                      />
                      <span class="ck-error-msg" v-if="errors.nombre">{{
                        errors.nombre
                      }}</span>
                    </div>
                    <div class="ck-field" :class="{ error: errors.apellidos }">
                      <label>Apellidos <span class="req">*</span></label>
                      <input
                        v-model="form.apellidos"
                        type="text"
                        placeholder="ej., García"
                        @blur="validarCampo('apellidos')"
                      />
                      <span class="ck-error-msg" v-if="errors.apellidos">{{
                        errors.apellidos
                      }}</span>
                    </div>
                  </div>

                  <div class="ck-grid-tel">
                    <div class="ck-field">
                      <label>Código de país <span class="req">*</span></label>
                      <select v-model="form.codigoPais">
                        <option value="+1">🇺🇸 USA +1</option>
                        <option value="+1-809">🇩🇴 RD +1-809</option>
                        <option value="+52">🇲🇽 MX +52</option>
                        <option value="+34">🇪🇸 ES +34</option>
                        <option value="+57">🇨🇴 CO +57</option>
                        <option value="+54">🇦🇷 AR +54</option>
                      </select>
                    </div>
                    <div class="ck-field" :class="{ error: errors.telefono }">
                      <label>Teléfono <span class="req">*</span></label>
                      <input
                        v-model="form.telefono"
                        type="tel"
                        placeholder="809-555-0000"
                        @blur="validarCampo('telefono')"
                      />
                      <span class="ck-error-msg" v-if="errors.telefono">{{
                        errors.telefono
                      }}</span>
                    </div>
                  </div>

                  <div class="ck-nav">
                    <span></span>
                    <button class="ck-btn-primary" @click="irPaso(1)">
                      Continuar al pago
                      <span class="material-symbols-outlined"
                        >arrow_forward</span
                      >
                    </button>
                  </div>
                </section>

                <!-- ════ PASO 1: Pago ════════════════════════════════ -->
                <section v-else-if="paso === 1" key="pago" class="ck-section">
                  <div class="ck-section-header">
                    <h3 class="ck-section-title">Detalles del pago</h3>
                    <span class="ck-secure">
                      <span class="material-symbols-outlined">lock</span>
                      Transacciones seguras
                    </span>
                  </div>

                  <!-- Métodos de pago -->
                  <div class="ck-metodos">
                    <label
                      v-for="m in metodos"
                      :key="m.id"
                      class="ck-metodo"
                      :class="{ active: form.metodo === m.id }"
                    >
                      <input type="radio" v-model="form.metodo" :value="m.id" />
                      <span class="ck-metodo-label">{{ m.nombre }}</span>
                      <span class="ck-metodo-logo">{{ m.logo }}</span>
                    </label>
                  </div>

                  <!-- Formulario tarjeta -->
                  <div v-if="form.metodo === 'tarjeta'" class="ck-tarjeta">
                    <div class="ck-logos-tarjeta">
                      <span
                        v-for="l in logosTarjeta"
                        :key="l"
                        class="ck-logo-card"
                        >{{ l }}</span
                      >
                    </div>

                    <div
                      class="ck-field"
                      :class="{ error: errors.nombreTarjeta }"
                    >
                      <label
                        >Nombre que figura en la tarjeta
                        <span class="req">*</span></label
                      >
                      <input
                        v-model="form.tarjeta.nombre_titular"
                        type="text"
                        placeholder="Como aparece en la tarjeta"
                        @blur="validarCampo('nombreTarjeta')"
                      />
                      <span class="ck-error-msg" v-if="errors.nombreTarjeta">{{
                        errors.nombreTarjeta
                      }}</span>
                    </div>

                    <div
                      class="ck-field"
                      :class="{ error: errors.numeroTarjeta }"
                    >
                      <label
                        >Número de la tarjeta <span class="req">*</span></label
                      >
                      <div class="ck-input-icon">
                        <span class="material-symbols-outlined"
                          >credit_card</span
                        >
                        <input
                          v-model="form.tarjeta.numero"
                          type="text"
                          placeholder="0000 0000 0000 0000"
                          maxlength="19"
                          @input="formatearTarjeta"
                          @blur="validarCampo('numeroTarjeta')"
                        />
                      </div>
                      <span class="ck-error-msg" v-if="errors.numeroTarjeta">{{
                        errors.numeroTarjeta
                      }}</span>
                    </div>

                    <div class="ck-grid3">
                      <div class="ck-field" :class="{ error: errors.mesExp }">
                        <label
                          >Fecha de vencimiento
                          <span class="req">*</span></label
                        >
                        <input
                          v-model="form.tarjeta.mes_exp"
                          type="text"
                          placeholder="MM/AA"
                          maxlength="5"
                          @input="formatearFechaExp"
                          @blur="validarCampo('mesExp')"
                        />
                        <span class="ck-error-msg" v-if="errors.mesExp">{{
                          errors.mesExp
                        }}</span>
                      </div>
                      <div class="ck-field" :class="{ error: errors.cvv }">
                        <label
                          >Código de seguridad <span class="req">*</span></label
                        >
                        <div class="ck-input-icon">
                          <input
                            v-model="form.tarjeta.cvv"
                            type="password"
                            placeholder="CVV"
                            maxlength="4"
                            @blur="validarCampo('cvv')"
                          />
                          <span
                            class="material-symbols-outlined"
                            style="cursor: help"
                            title="3 o 4 dígitos al reverso de tu tarjeta"
                            >info</span
                          >
                        </div>
                        <span class="ck-error-msg" v-if="errors.cvv">{{
                          errors.cvv
                        }}</span>
                      </div>
                    </div>

                    <div
                      class="ck-field"
                      :class="{ error: errors.codigoPostal }"
                    >
                      <label>Código postal <span class="req">*</span></label>
                      <input
                        v-model="form.tarjeta.codigo_postal"
                        type="text"
                        placeholder="00000"
                        @blur="validarCampo('codigoPostal')"
                      />
                      <span class="ck-error-msg" v-if="errors.codigoPostal">{{
                        errors.codigoPostal
                      }}</span>
                    </div>

                    <label class="ck-checkbox">
                      <input type="checkbox" v-model="form.guardarTarjeta" />
                      <span class="ck-checkbox-box"></span>
                      Guardar esta tarjeta para utilizarla en el futuro
                    </label>
                  </div>

                  <!-- Otros métodos -->
                  <div v-else class="ck-metodo-alt">
                    <span class="material-symbols-outlined">open_in_new</span>
                    <p>
                      Serás redirigido a
                      {{
                        metodos.find((m) => m.id === form.metodo)?.nombre
                      }}
                      para completar el pago.
                    </p>
                  </div>

                  <div class="ck-nav">
                    <button class="ck-btn-ghost" @click="paso = 0">
                      <span class="material-symbols-outlined">arrow_back</span>
                      Atrás
                    </button>
                    <button class="ck-btn-primary" @click="irPaso(2)">
                      Continuar
                      <span class="material-symbols-outlined"
                        >arrow_forward</span
                      >
                    </button>
                  </div>
                </section>

                <!-- ════ PASO 2: Protección ══════════════════════════ -->
                <section
                  v-else-if="paso === 2"
                  key="proteccion"
                  class="ck-section"
                >
                  <div class="ck-recomendado-badge">Recomendado</div>
                  <h3 class="ck-section-title" style="margin-top: 8px">
                    Protege tu estancia
                  </h3>
                  <p class="ck-hint">
                    Selecciona una opción para continuar
                    <span class="req">*</span>
                  </p>

                  <div class="ck-proteccion-grid">
                    <!-- Con protección -->
                    <div
                      v-if="planProteccion"
                      class="ck-proteccion-card"
                      :class="{
                        selected: form.idPlan === planProteccion.ID_PLAN,
                      }"
                      @click="form.idPlan = planProteccion.ID_PLAN"
                    >
                      <div class="ck-proto-radio">
                        <span class="material-symbols-outlined">{{
                          form.idPlan === planProteccion.ID_PLAN
                            ? 'radio_button_checked'
                            : 'radio_button_unchecked'
                        }}</span>
                      </div>
                      <div>
                        <h4>{{ planProteccion.NOMBRE }}</h4>
                        <p class="ck-proto-precio">
                          ${{ planProteccion.PRECIO_POR_PERSONA }}
                          <span>por persona</span>
                        </p>
                        <p class="ck-proto-sub">
                          Obtén protección por motivos dentro de la cobertura:
                        </p>
                        <ul class="ck-proto-lista">
                          <li>
                            <span class="material-symbols-outlined"
                              >check_circle</span
                            >
                            Hasta el 100% del costo por cancelación o check-out
                            anticipado
                          </li>
                          <li>
                            <span class="material-symbols-outlined"
                              >check_circle</span
                            >
                            Hasta $200,000 para gastos médicos por plan
                          </li>
                          <li>
                            <span class="material-symbols-outlined"
                              >check_circle</span
                            >
                            Hasta $15,000 por plan por gastos derivados de un
                            retraso de viaje
                          </li>
                        </ul>
                      </div>
                    </div>

                    <!-- Sin protección -->
                    <div
                      class="ck-proteccion-card"
                      :class="{ selected: form.idPlan === null }"
                      @click="form.idPlan = null"
                    >
                      <div class="ck-proto-radio">
                        <span class="material-symbols-outlined">{{
                          form.idPlan === null
                            ? 'radio_button_checked'
                            : 'radio_button_unchecked'
                        }}</span>
                      </div>
                      <div>
                        <h4>Sin protección</h4>
                        <p class="ck-proto-noprecio">
                          Prefiero no proteger mi estancia de ${{
                            precioBase.toLocaleString()
                          }}.
                        </p>
                        <p class="ck-proto-sub" style="margin-top: 10px">
                          Podrías ser responsable de:
                        </p>
                        <ul class="ck-proto-lista ck-proto-lista--warn">
                          <li>
                            <span class="material-symbols-outlined"
                              >attach_money</span
                            >
                            Costos inesperados por cambios de última hora en el
                            viaje dentro de la cobertura
                          </li>
                          <li>
                            <span class="material-symbols-outlined"
                              >attach_money</span
                            >
                            Gastos de bolsillo en hotel o comidas por retrasos
                            en el viaje
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div class="ck-nav">
                    <button class="ck-btn-ghost" @click="paso = 1">
                      <span class="material-symbols-outlined">arrow_back</span>
                      Atrás
                    </button>
                    <button
                      class="ck-btn-primary"
                      :disabled="form.idPlan === undefined"
                      @click="confirmar"
                    >
                      <span
                        v-if="cargando"
                        class="material-symbols-outlined rotating"
                        >sync</span
                      >
                      <span v-else>Confirmar reserva</span>
                    </button>
                  </div>
                </section>
              </Transition>

              <!-- Error global -->
              <div v-if="errorGlobal" class="ck-error-global">
                <span class="material-symbols-outlined">error</span>
                {{ errorGlobal }}
              </div>
            </div>

            <!-- ── Sidebar derecho ────────────────────────────────────── -->
            <aside class="ck-aside">
              <!-- Imagen + nombre -->
              <div class="ck-aside-hotel">
                <div class="ck-aside-img">
                  <img
                    v-if="habitacion?.imagen_url"
                    :src="habitacion.imagen_url"
                    alt="Hotel"
                  />
                  <div v-else class="ck-aside-img-placeholder">
                    <span class="material-symbols-outlined">hotel</span>
                  </div>
                  <span v-if="habitacion?.vip" class="ck-vip-badge"
                    >VIP Access</span
                  >
                </div>
                <div class="ck-aside-info">
                  <p class="ck-aside-nombre">
                    {{ habitacion?.nombre_hospedaje }}
                  </p>
                  <p class="ck-aside-dir">{{ habitacion?.direccion }}</p>
                  <div class="ck-aside-rating" v-if="habitacion?.calificacion">
                    <span class="ck-rating-badge">{{
                      habitacion.calificacion
                    }}</span>
                    <span>{{
                      habitacion.label_calificacion ?? 'Magnífica'
                    }}</span>
                    <span class="ck-aside-opiniones"
                      >{{ habitacion.opiniones }} opiniones</span
                    >
                  </div>
                </div>
              </div>

              <!-- Fechas -->
              <div class="ck-aside-fechas">
                <div>
                  <p class="ck-aside-label">Check-in</p>
                  <p class="ck-aside-val">{{ fechaFormateada(fechaInicio) }}</p>
                  <p class="ck-aside-hora">
                    {{ habitacion?.checkin ?? '3:00 p.m.' }}
                  </p>
                </div>
                <div class="ck-aside-sep"></div>
                <div>
                  <p class="ck-aside-label">Check-out</p>
                  <p class="ck-aside-val">{{ fechaFormateada(fechaFin) }}</p>
                  <p class="ck-aside-hora">
                    {{ habitacion?.checkout ?? '11:00 a.m.' }}
                  </p>
                </div>
                <div class="ck-aside-sep"></div>
                <div>
                  <p class="ck-aside-label">Noches</p>
                  <p class="ck-aside-val">{{ noches }}</p>
                </div>
              </div>

              <!-- Tipo habitación + servicios -->
              <div class="ck-aside-hab" v-if="habitacion">
                <p class="ck-aside-tipo">
                  {{ habitacion.TIPO_HABITACION ?? habitacion.tipo_habitacion }}
                </p>
                <div
                  class="ck-aside-servicios"
                  v-if="habitacion.SERVICIOS?.length"
                >
                  <span
                    v-for="s in habitacion.SERVICIOS"
                    :key="s"
                    class="ck-servicio-tag"
                  >
                    <span class="material-symbols-outlined">check</span>{{ s }}
                  </span>
                </div>
              </div>

              <div class="ck-aside-divider"></div>

              <!-- Desglose de precios -->
              <div class="ck-aside-precios">
                <h4 class="ck-aside-precios-title">Detalles del precio</h4>
                <div class="ck-precio-fila">
                  <span
                    >{{ noches }} noche{{ noches !== 1 ? 's' : '' }} × ${{
                      Number(habitacion?.PRECIO_NOCHE).toLocaleString()
                    }}</span
                  >
                  <span>${{ subtotal.toLocaleString() }}</span>
                </div>
                <div class="ck-precio-fila ck-precio-impuesto">
                  <span>Impuestos y cargos</span>
                  <span
                    >${{
                      (montoImpuestos + montoCargos).toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                      })
                    }}</span
                  >
                </div>
                <div
                  class="ck-precio-fila"
                  v-if="form.idPlan && planProteccion"
                >
                  <span>Plan de protección</span>
                  <span>${{ planProteccion.PRECIO_POR_PERSONA }}</span>
                </div>
                <div class="ck-precio-fila" v-if="tipoPago === 'despues'">
                  <span>Recargo pago en propiedad (3%)</span>
                  <span
                    >+${{
                      recargoDespues.toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                      })
                    }}</span
                  >
                </div>
                <div class="ck-aside-divider"></div>
                <div class="ck-precio-fila ck-precio-total">
                  <span>Total</span>
                  <span
                    >${{
                      precioFinal.toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                      })
                    }}</span
                  >
                </div>
                <p class="ck-precio-moneda">
                  Las tarifas se muestran en USD ($).
                </p>
              </div>

              <!-- Disponibilidad -->
              <div
                class="ck-aside-aviso"
                v-if="
                  habitacion?.disponibles <= 5 && habitacion?.disponibles > 0
                "
              >
                <span class="material-symbols-outlined">hotel</span>
                Nos quedan {{ habitacion.disponibles }} habitaciones a este
                precio.
              </div>
            </aside>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { apiFetch } from '../services/api'

// ── Props ─────────────────────────────────────────────────────────────────────
const props = defineProps({
  visible: { type: Boolean, default: false },
  habitacion: { type: Object, default: null }, // objeto hab del grid
  fechaInicio: { type: String, default: '' },
  fechaFin: { type: String, default: '' },
  noches: { type: Number, default: 0 },
  tipoPago: { type: String, default: 'ahora' }, // 'ahora' | 'despues'
})

const emit = defineEmits(['cerrar', 'reservaConfirmada'])

// ── Estado ────────────────────────────────────────────────────────────────────
const paso = ref(0)
const cargando = ref(false)
const errorGlobal = ref('')
const planProteccion = ref(null)

const pasos = ['Huésped', 'Pago', 'Protección']

const metodos = [
  { id: 'tarjeta', nombre: 'Tarjeta', logo: '💳' },
  { id: 'paypal', nombre: 'PayPal', logo: '🅿️' },
  { id: 'affirm', nombre: 'Affirm', logo: '✦' },
  { id: 'applepay', nombre: 'Apple Pay', logo: '🍎' },
]

const logosTarjeta = ['AMEX', 'Diners', 'Discover', 'JCB', 'MC', 'VISA']

const form = ref({
  nombre: '',
  apellidos: '',
  codigoPais: '+1-809',
  telefono: '',
  metodo: 'tarjeta',
  guardarTarjeta: false,
  tarjeta: {
    nombre_titular: '',
    numero: '',
    mes_exp: '',
    cvv: '',
    codigo_postal: '',
    ano_exp: '',
  },
  idPlan: undefined, // undefined = sin seleccionar aún
})

const errors = ref({})

// ── Cálculos ──────────────────────────────────────────────────────────────────
const precioNoche = computed(() =>
  parseFloat(props.habitacion?.PRECIO_NOCHE ?? 0),
)
const subtotal = computed(() => precioNoche.value * props.noches)
const montoImpuestos = computed(() =>
  parseFloat((subtotal.value * 0.18).toFixed(2)),
)
const montoCargos = computed(() =>
  parseFloat((subtotal.value * 0.04).toFixed(2)),
)
const precioBase = computed(() =>
  parseFloat(
    (subtotal.value + montoImpuestos.value + montoCargos.value).toFixed(2),
  ),
)
const recargoDespues = computed(() =>
  props.tipoPago === 'despues'
    ? parseFloat((precioBase.value * 0.03).toFixed(2))
    : 0,
)
const costoProteccion = computed(() =>
  form.value.idPlan && planProteccion.value
    ? parseFloat(planProteccion.value.PRECIO_POR_PERSONA)
    : 0,
)
const precioFinal = computed(() =>
  parseFloat(
    (precioBase.value + recargoDespues.value + costoProteccion.value).toFixed(
      2,
    ),
  ),
)

// ── Fechas ────────────────────────────────────────────────────────────────────
const fechaLimiteFormateada = computed(() => {
  if (!props.fechaInicio) return ''
  const d = new Date(props.fechaInicio + 'T00:00:00')
  d.setDate(d.getDate() - 1)
  return d.toLocaleDateString('es-DO', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
})

function fechaFormateada(str) {
  if (!str) return ''
  const d = new Date(str + 'T00:00:00')
  return d.toLocaleDateString('es-DO', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

// ── Carga inicial ─────────────────────────────────────────────────────────────
onMounted(async () => {
  try {
    const planes = await apiFetch('/reservas/planes-proteccion')
    if (planes?.length) planProteccion.value = planes[0]
  } catch (e) {
    console.error('Error cargando planes:', e)
  }
})

watch(
  () => props.visible,
  (v) => {
    if (v) {
      paso.value = 0
      errorGlobal.value = ''
      errors.value = {}
    }
  },
)

// ── Validaciones ──────────────────────────────────────────────────────────────
function validarCampo(campo) {
  switch (campo) {
    case 'nombre':
      errors.value.nombre = form.value.nombre.trim()
        ? ''
        : 'El nombre es requerido'
      break
    case 'apellidos':
      errors.value.apellidos = form.value.apellidos.trim()
        ? ''
        : 'Los apellidos son requeridos'
      break
    case 'telefono':
      errors.value.telefono = /^\d{7,15}$/.test(
        form.value.telefono.replace(/\D/g, ''),
      )
        ? ''
        : 'Ingresa un teléfono válido'
      break
    case 'nombreTarjeta':
      errors.value.nombreTarjeta = form.value.tarjeta.nombre_titular.trim()
        ? ''
        : 'Requerido'
      break
    case 'numeroTarjeta':
      errors.value.numeroTarjeta =
        form.value.tarjeta.numero.replace(/\s/g, '').length >= 15
          ? ''
          : 'Número inválido'
      break
    case 'mesExp': {
      const [m, a] = form.value.tarjeta.mes_exp.split('/')
      errors.value.mesExp = m && a && +m >= 1 && +m <= 12 ? '' : 'Formato MM/AA'
      break
    }
    case 'cvv':
      errors.value.cvv = /^\d{3,4}$/.test(form.value.tarjeta.cvv)
        ? ''
        : 'CVV inválido'
      break
    case 'codigoPostal':
      errors.value.codigoPostal = form.value.tarjeta.codigo_postal.trim()
        ? ''
        : 'Requerido'
      break
  }
}

function validarPaso0() {
  ;['nombre', 'apellidos', 'telefono'].forEach(validarCampo)
  return (
    !errors.value.nombre && !errors.value.apellidos && !errors.value.telefono
  )
}

function validarPaso1() {
  if (form.value.metodo !== 'tarjeta')
    return true[
      ('nombreTarjeta', 'numeroTarjeta', 'mesExp', 'cvv', 'codigoPostal')
    ].forEach(validarCampo)
  return (
    !errors.value.nombreTarjeta &&
    !errors.value.numeroTarjeta &&
    !errors.value.mesExp &&
    !errors.value.cvv &&
    !errors.value.codigoPostal
  )
}

function irPaso(n) {
  errorGlobal.value = ''
  if (n === 1 && !validarPaso0()) return
  if (n === 2 && !validarPaso1()) return
  paso.value = n
}

// ── Formateo de inputs ────────────────────────────────────────────────────────
function formatearTarjeta() {
  let v = form.value.tarjeta.numero.replace(/\D/g, '').slice(0, 16)
  form.value.tarjeta.numero = v.match(/.{1,4}/g)?.join(' ') ?? v
}

function formatearFechaExp() {
  let v = form.value.tarjeta.mes_exp.replace(/\D/g, '').slice(0, 4)
  if (v.length >= 3) v = v.slice(0, 2) + '/' + v.slice(2)
  form.value.tarjeta.mes_exp = v
  if (v.length === 5) {
    const [m, a] = v.split('/')
    form.value.tarjeta.mes_exp = v
    form.value.tarjeta.ano_exp = a
  }
}

// ── Confirmar ─────────────────────────────────────────────────────────────────
async function confirmar() {
  if (form.value.idPlan === undefined) {
    errorGlobal.value = 'Selecciona una opción de protección para continuar.'
    return
  }
  cargando.value = true
  errorGlobal.value = ''
  try {
    const [mesExp, anoExp] = form.value.tarjeta.mes_exp.split('/')
    const payload = {
      id_habitacion: props.habitacion?.ID_HABITACION,
      fecha_inicio: props.fechaInicio,
      fecha_fin: props.fechaFin,
      noches: props.noches,
      tipo_pago: props.tipoPago,
      huesped: {
        nombre: form.value.nombre,
        apellidos: form.value.apellidos,
        codigo_pais: form.value.codigoPais,
        telefono: form.value.telefono,
      },
      pago: {
        metodo: form.value.metodo,
        guardar: form.value.guardarTarjeta,
        tarjeta:
          form.value.metodo === 'tarjeta'
            ? {
                nombre_titular: form.value.tarjeta.nombre_titular,
                numero: form.value.tarjeta.numero,
                mes_exp: mesExp,
                ano_exp: anoExp,
                codigo_postal: form.value.tarjeta.codigo_postal,
              }
            : null,
      },
      proteccion: { id_plan: form.value.idPlan },
    }

    const resp = await apiFetch('/reservas/checkout', {
      method: 'POST',
      body: JSON.stringify(payload),
    })

    emit('reservaConfirmada', resp)
  } catch (err) {
    errorGlobal.value =
      err?.message ??
      'Ocurrió un error al procesar tu reserva. Intenta de nuevo.'
  } finally {
    cargando.value = false
  }
}
</script>

<style scoped>
/* ── Variables ─────────────────────────────────────────────────────────────── */
:root {
  --azul: #113956;
  --azul-clr: #1e5276;
  --verde: #2a7a4b;
  --rojo: #c0392b;
}

/* ── Overlay ────────────────────────────────────────────────────────────────── */
.ck-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: flex-start;
  justify-content: center;
  z-index: 1100;
  padding: 20px 16px;
  overflow-y: auto;
}

/* ── Modal ──────────────────────────────────────────────────────────────────── */
.ck-modal {
  background: #fff;
  border-radius: 16px;
  width: 100%;
  max-width: 960px;
  box-shadow: 0 24px 80px rgba(0, 0, 0, 0.22);
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

/* ── Header ─────────────────────────────────────────────────────────────────── */
.ck-header {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px 24px;
  border-bottom: 1px solid #eee;
  background: #fafafa;
  flex-wrap: wrap;
}
.ck-close {
  background: none;
  border: none;
  cursor: pointer;
  color: #555;
  display: flex;
  align-items: center;
  padding: 6px;
  border-radius: 50%;
  transition: background 0.15s;
}
.ck-close:hover {
  background: #f0f0f0;
}
.ck-header-title {
  font-size: 15px;
  font-weight: 700;
  color: #113956;
}

/* Stepper */
.ck-steps {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-left: auto;
}
.ck-step {
  display: flex;
  align-items: center;
  gap: 6px;
}
.ck-step:not(:last-child)::after {
  content: '';
  width: 28px;
  height: 1px;
  background: #ddd;
  margin-left: 6px;
}
.ck-step-dot {
  width: 26px;
  height: 26px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 700;
  background: #e8e8e8;
  color: #888;
  transition: all 0.2s;
}
.ck-step.active .ck-step-dot {
  background: #113956;
  color: #fff;
}
.ck-step.done .ck-step-dot {
  background: #2a7a4b;
  color: #fff;
}
.ck-step-label {
  font-size: 12px;
  color: #888;
}
.ck-step.active .ck-step-label {
  color: #113956;
  font-weight: 600;
}
.ck-step.done .ck-step-label {
  color: #2a7a4b;
}

/* ── Body ───────────────────────────────────────────────────────────────────── */
.ck-body {
  display: grid;
  grid-template-columns: 1fr 340px;
  min-height: 0;
}

/* ── Left ───────────────────────────────────────────────────────────────────── */
.ck-left {
  padding: 24px;
  overflow-y: auto;
}

/* Política */
.ck-policy {
  display: flex;
  gap: 12px;
  align-items: flex-start;
  background: #f0f7ff;
  border-radius: 10px;
  padding: 14px 16px;
  margin-bottom: 22px;
  border: 1px solid #cde1f7;
}
.ck-policy .material-symbols-outlined {
  color: #113956;
  margin-top: 2px;
  font-size: 22px;
}
.ck-policy strong {
  font-size: 13px;
  color: #113956;
  display: block;
}
.ck-policy p {
  font-size: 12px;
  color: #555;
  margin: 2px 0 0;
}

/* Sección */
.ck-section {
  animation: fadeUp 0.2s ease;
}
.ck-section-title {
  font-size: 17px;
  font-weight: 700;
  color: #113956;
  margin: 0 0 4px;
}
.ck-section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 14px;
}
.ck-hint {
  font-size: 12px;
  color: #888;
  margin: 0 0 16px;
}
.req {
  color: #c0392b;
}

.ck-secure {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  color: #2a7a4b;
}
.ck-secure .material-symbols-outlined {
  font-size: 15px;
}

/* Grid campos */
.ck-grid2 {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 14px;
  margin-bottom: 14px;
}
.ck-grid-tel {
  display: grid;
  grid-template-columns: 180px 1fr;
  gap: 14px;
  margin-bottom: 14px;
}
.ck-grid3 {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 14px;
  margin-bottom: 14px;
}

/* Field */
.ck-field {
  display: flex;
  flex-direction: column;
  gap: 5px;
  margin-bottom: 14px;
}
.ck-field label {
  font-size: 13px;
  font-weight: 600;
  color: #333;
}
.ck-field input,
.ck-field select {
  border: 1.5px solid #ddd;
  border-radius: 8px;
  padding: 10px 12px;
  font-size: 14px;
  color: #333;
  outline: none;
  transition: border-color 0.15s;
  background: #fff;
}
.ck-field input:focus,
.ck-field select:focus {
  border-color: #113956;
}
.ck-field.error input,
.ck-field.error select {
  border-color: #c0392b;
}
.ck-error-msg {
  font-size: 11px;
  color: #c0392b;
}

.ck-input-icon {
  display: flex;
  align-items: center;
  border: 1.5px solid #ddd;
  border-radius: 8px;
  overflow: hidden;
  transition: border-color 0.15s;
}
.ck-input-icon:focus-within {
  border-color: #113956;
}
.ck-input-icon .material-symbols-outlined {
  padding: 0 10px;
  color: #888;
  font-size: 18px;
  flex-shrink: 0;
}
.ck-input-icon input {
  border: none;
  padding: 10px 10px 10px 0;
  outline: none;
  flex: 1;
  font-size: 14px;
}

/* Métodos de pago */
.ck-metodos {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 18px;
}
.ck-metodo {
  display: flex;
  align-items: center;
  gap: 12px;
  border: 1.5px solid #ddd;
  border-radius: 10px;
  padding: 12px 16px;
  cursor: pointer;
  transition: border-color 0.15s;
}
.ck-metodo input {
  display: none;
}
.ck-metodo.active {
  border-color: #113956;
  background: #f4f9ff;
}
.ck-metodo-label {
  font-size: 14px;
  color: #333;
  font-weight: 500;
  flex: 1;
}
.ck-metodo-logo {
  font-size: 18px;
}

/* Tarjeta */
.ck-tarjeta {
  padding: 16px;
  background: #f9f9f9;
  border-radius: 10px;
  margin-bottom: 16px;
}
.ck-logos-tarjeta {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
  margin-bottom: 14px;
}
.ck-logo-card {
  font-size: 9px;
  font-weight: 800;
  letter-spacing: 0.5px;
  padding: 3px 7px;
  border: 1px solid #ccc;
  border-radius: 4px;
  color: #444;
  background: #fff;
}

/* Checkbox */
.ck-checkbox {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  color: #555;
  cursor: pointer;
  margin-top: 4px;
}
.ck-checkbox input {
  display: none;
}
.ck-checkbox-box {
  width: 16px;
  height: 16px;
  border: 1.5px solid #bbb;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: all 0.15s;
  background: #fff;
}
.ck-checkbox input:checked + .ck-checkbox-box {
  background: #113956;
  border-color: #113956;
}
.ck-checkbox input:checked + .ck-checkbox-box::after {
  content: '✓';
  color: #fff;
  font-size: 10px;
  font-weight: 700;
}

/* Metodo alt */
.ck-metodo-alt {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 16px;
  background: #f9f9f9;
  border-radius: 10px;
  font-size: 13px;
  color: #666;
  margin-bottom: 16px;
}

/* Protección */
.ck-recomendado-badge {
  display: inline-block;
  background: #2a7a4b;
  color: #fff;
  font-size: 11px;
  font-weight: 700;
  padding: 3px 10px;
  border-radius: 4px;
  letter-spacing: 0.5px;
}
.ck-proteccion-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 14px;
  margin-top: 16px;
  margin-bottom: 20px;
}
.ck-proteccion-card {
  border: 1.5px solid #ddd;
  border-radius: 12px;
  padding: 16px;
  cursor: pointer;
  transition:
    border-color 0.15s,
    box-shadow 0.15s;
  display: flex;
  gap: 10px;
  align-items: flex-start;
}
.ck-proteccion-card:hover {
  border-color: #113956;
}
.ck-proteccion-card.selected {
  border-color: #113956;
  box-shadow: 0 0 0 2px rgba(17, 57, 86, 0.12);
}

.ck-proto-radio .material-symbols-outlined {
  color: #113956;
  font-size: 20px;
}
.ck-proteccion-card h4 {
  font-size: 13px;
  font-weight: 700;
  margin: 0 0 6px;
  color: #222;
}
.ck-proto-precio {
  font-size: 20px;
  font-weight: 800;
  color: #113956;
  margin: 0 0 8px;
}
.ck-proto-precio span {
  font-size: 12px;
  font-weight: 400;
  color: #888;
}
.ck-proto-noprecio {
  font-size: 12px;
  color: #666;
  margin: 0 0 8px;
}
.ck-proto-sub {
  font-size: 11px;
  font-weight: 600;
  color: #555;
  margin: 0 0 6px;
}
.ck-proto-lista {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.ck-proto-lista li {
  display: flex;
  align-items: flex-start;
  gap: 6px;
  font-size: 11px;
  color: #555;
  line-height: 1.4;
}
.ck-proto-lista .material-symbols-outlined {
  font-size: 14px;
  color: #2a7a4b;
  flex-shrink: 0;
  margin-top: 1px;
}
.ck-proto-lista--warn .material-symbols-outlined {
  color: #e67e22;
}

/* Navegación */
.ck-nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 20px;
}
.ck-btn-primary {
  display: flex;
  align-items: center;
  gap: 6px;
  background: #113956;
  color: #fff;
  border: none;
  padding: 11px 22px;
  border-radius: 9px;
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
  transition: background 0.2s;
}
.ck-btn-primary:hover:not(:disabled) {
  background: #1e5276;
}
.ck-btn-primary:disabled {
  background: #bbb;
  cursor: not-allowed;
}
.ck-btn-ghost {
  display: flex;
  align-items: center;
  gap: 6px;
  background: none;
  border: 1.5px solid #ddd;
  color: #555;
  padding: 10px 18px;
  border-radius: 9px;
  font-size: 14px;
  cursor: pointer;
  transition: border-color 0.15s;
}
.ck-btn-ghost:hover {
  border-color: #113956;
  color: #113956;
}

/* Error global */
.ck-error-global {
  display: flex;
  align-items: center;
  gap: 8px;
  background: #fdf0f0;
  border: 1px solid #f5c6c6;
  color: #c0392b;
  border-radius: 8px;
  padding: 12px 16px;
  font-size: 13px;
  margin-top: 16px;
}

/* ── Aside ───────────────────────────────────────────────────────────────────── */
.ck-aside {
  border-left: 1px solid #eee;
  padding: 24px 20px;
  background: #fafafa;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.ck-aside-hotel {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.ck-aside-img {
  position: relative;
}
.ck-aside-img img {
  width: 100%;
  height: 160px;
  object-fit: cover;
  border-radius: 10px;
}
.ck-aside-img-placeholder {
  width: 100%;
  height: 160px;
  background: linear-gradient(135deg, #e8f0fb, #c8daf0);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.ck-aside-img-placeholder .material-symbols-outlined {
  font-size: 48px;
  color: #6b9ec4;
}
.ck-vip-badge {
  position: absolute;
  top: 8px;
  left: 8px;
  background: #113956;
  color: #fff;
  font-size: 10px;
  font-weight: 700;
  padding: 3px 8px;
  border-radius: 4px;
  letter-spacing: 0.5px;
}

.ck-aside-nombre {
  font-size: 14px;
  font-weight: 700;
  color: #113956;
  margin: 0;
}
.ck-aside-dir {
  font-size: 12px;
  color: #888;
  margin: 2px 0 0;
}

.ck-aside-rating {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-top: 4px;
  font-size: 12px;
  color: #555;
}
.ck-rating-badge {
  background: #2a7a4b;
  color: #fff;
  font-size: 11px;
  font-weight: 700;
  padding: 2px 7px;
  border-radius: 4px;
}
.ck-aside-opiniones {
  color: #aaa;
}

.ck-aside-fechas {
  display: flex;
  gap: 12px;
  align-items: flex-start;
  background: #fff;
  border: 1px solid #eee;
  border-radius: 10px;
  padding: 12px 14px;
}
.ck-aside-sep {
  width: 1px;
  background: #eee;
  align-self: stretch;
}
.ck-aside-label {
  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: #aaa;
  margin: 0;
}
.ck-aside-val {
  font-size: 12px;
  font-weight: 700;
  color: #113956;
  margin: 2px 0;
}
.ck-aside-hora {
  font-size: 11px;
  color: #888;
  margin: 0;
}

.ck-aside-hab {
}
.ck-aside-tipo {
  font-size: 13px;
  font-weight: 700;
  color: #333;
  margin: 0 0 8px;
}
.ck-aside-servicios {
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.ck-servicio-tag {
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 12px;
  color: #2a7a4b;
}
.ck-servicio-tag .material-symbols-outlined {
  font-size: 14px;
}

.ck-aside-divider {
  border: none;
  border-top: 1px solid #eee;
  margin: 0;
}

.ck-aside-precios {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.ck-aside-precios-title {
  font-size: 14px;
  font-weight: 700;
  color: #222;
  margin: 0;
}
.ck-precio-fila {
  display: flex;
  justify-content: space-between;
  font-size: 13px;
  color: #555;
}
.ck-precio-impuesto {
  color: #888;
}
.ck-precio-total {
  font-size: 15px;
  font-weight: 800;
  color: #113956;
}
.ck-precio-moneda {
  font-size: 11px;
  color: #bbb;
  margin: 0;
}

.ck-aside-aviso {
  display: flex;
  align-items: center;
  gap: 8px;
  background: #fffbea;
  border: 1px solid #ffe082;
  border-radius: 8px;
  padding: 10px 12px;
  font-size: 12px;
  color: #b7891a;
}
.ck-aside-aviso .material-symbols-outlined {
  font-size: 16px;
}

/* ── Animaciones ────────────────────────────────────────────────────────────── */
@keyframes fadeUp {
  from {
    opacity: 0;
    transform: translateY(8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
@keyframes rotate {
  to {
    transform: rotate(360deg);
  }
}
.rotating {
  animation: rotate 1s linear infinite;
  display: inline-block;
}

.ck-fade-enter-active,
.ck-fade-leave-active {
  transition:
    opacity 0.18s,
    transform 0.18s;
}
.ck-fade-enter-from {
  opacity: 0;
  transform: translateX(12px);
}
.ck-fade-leave-to {
  opacity: 0;
  transform: translateX(-12px);
}

.ck-slide-enter-active,
.ck-slide-leave-active {
  transition: opacity 0.25s;
}
.ck-slide-enter-from .ck-modal {
  transform: translateY(30px);
  opacity: 0;
}
.ck-slide-enter-active .ck-modal {
  transition:
    transform 0.25s ease,
    opacity 0.25s ease;
}
.ck-slide-enter-from,
.ck-slide-leave-to {
  opacity: 0;
}

/* ── Responsive ─────────────────────────────────────────────────────────────── */
@media (max-width: 768px) {
  .ck-body {
    grid-template-columns: 1fr;
  }
  .ck-aside {
    border-left: none;
    border-top: 1px solid #eee;
    order: -1;
  }
  .ck-grid2 {
    grid-template-columns: 1fr;
  }
  .ck-grid-tel {
    grid-template-columns: 1fr;
  }
  .ck-proteccion-grid {
    grid-template-columns: 1fr;
  }
  .ck-steps {
    display: none;
  }
}
@media (max-width: 480px) {
  .ck-overlay {
    padding: 0;
  }
  .ck-modal {
    border-radius: 0;
    min-height: 100dvh;
  }
}
</style>
