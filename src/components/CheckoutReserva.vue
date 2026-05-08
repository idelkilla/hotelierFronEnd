<template>
  <Teleport to="body">
    <Transition name="ck-slide">
      <div v-if="visible" class="ck-overlay" @click.self="$emit('cerrar')">
        <div class="ck-modal">
          <Toast ref="toastRef" />
          <!-- HEADER -->
          <div class="ck-header">
            <button class="ck-close" @click="$emit('cerrar')">
              <span class="material-symbols-outlined">close</span>
            </button>
            <span class="ck-header-title">Finalizar reserva</span>
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

          <!-- BODY -->
          <div class="ck-body">
            <!-- Columna izquierda -->
            <div class="ck-left">
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

              <Transition name="ck-fade" mode="out-in">
                <!-- PASO 0: Huésped -->
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
                      <AppSelect
                        v-model="form.codigoPais"
                        :options="opcionesCodigoPais"
                      />
                    </div>
                    <div class="ck-field" :class="{ error: errors.telefono }">
                      <label>Teléfono <span class="req">*</span></label>
                      <input
                        v-model="form.telefono"
                        type="tel"
                        placeholder="809-555-0000"
                        @input="formatearTelefono"
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

                <!-- PASO 1: Pago -->
                <section v-else-if="paso === 1" key="pago" class="ck-section">
                  <div class="ck-section-header">
                    <h3 class="ck-section-title">Detalles del pago</h3>
                    <span class="ck-secure">
                      <span class="material-symbols-outlined">lock</span>
                      Transacciones seguras
                    </span>
                  </div>

                  <div class="ck-metodos">
                    <label
                      v-for="m in metodos"
                      :key="m.id"
                      class="ck-metodo"
                      :class="{ active: form.metodo === m.id }"
                    >
                      <input type="radio" v-model="form.metodo" :value="m.id" />
                      <span class="ck-metodo-label">{{ m.nombre }}</span>
                      <span class="ck-metodo-logo" v-html="m.logo"></span>
                    </label>
                  </div>

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

                <!-- PASO 2: Protección -->
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
                            >Hasta el 100% del costo por cancelación o check-out
                            anticipado
                          </li>
                          <li>
                            <span class="material-symbols-outlined"
                              >check_circle</span
                            >Hasta $200,000 para gastos médicos por plan
                          </li>
                          <li>
                            <span class="material-symbols-outlined"
                              >check_circle</span
                            >Hasta $15,000 por plan por gastos derivados de un
                            retraso de viaje
                          </li>
                        </ul>
                      </div>
                    </div>

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
                            >Costos inesperados por cambios de última hora en el
                            viaje dentro de la cobertura
                          </li>
                          <li>
                            <span class="material-symbols-outlined"
                              >attach_money</span
                            >Gastos de bolsillo en hotel o comidas por retrasos
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

              <div v-if="errorGlobal" class="ck-error-global">
                <span class="material-symbols-outlined">error</span>
                {{ errorGlobal }}
              </div>
            </div>

            <!-- Sidebar derecho -->
            <aside class="ck-aside">
              <div class="ck-aside-hotel">
                <div class="ck-aside-img">
                  <img
                    v-if="habitacion?.IMAGENES?.length"
                    :src="habitacion.IMAGENES[0]"
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
                    {{
                      habitacion?.nombre_hospedaje ??
                      habitacion?.NOMBRE_HOSPEDAJE ??
                      '—'
                    }}
                  </p>
                  <p class="ck-aside-dir">
                    {{ habitacion?.direccion ?? habitacion?.DIRECCION ?? '' }}
                  </p>
                  <div
                    class="ck-aside-rating"
                    v-if="habitacion?.calificacion ?? habitacion?.CALIFICACION"
                  >
                    <span class="ck-rating-badge">{{
                      habitacion.calificacion ?? habitacion.CALIFICACION
                    }}</span>
                    <span>{{
                      habitacion.label_calificacion ?? 'Magnífica'
                    }}</span>
                    <span class="ck-aside-opiniones"
                      >{{
                        habitacion.opiniones ?? habitacion.OPINIONES
                      }}
                      opiniones</span
                    >
                  </div>
                </div>
              </div>

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
                  <p class="ck-aside-val">{{ nochesReal }}</p>
                </div>
              </div>

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

              <div class="ck-aside-precios">
                <h4 class="ck-aside-precios-title">Detalles del precio</h4>
                <div class="ck-precio-fila">
                  <span
                    >{{ nochesReal }} noche{{ nochesReal !== 1 ? 's' : '' }} ×
                    ${{
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
import AppSelect from './AppSelect.vue'
import Toast from './alert.vue'

const props = defineProps({
  visible: { type: Boolean, default: false },
  habitacion: { type: Object, default: null },
  fechaInicio: { type: String, default: '' },
  fechaFin: { type: String, default: '' },
  noches: { type: Number, default: 0 },
  tipoPago: { type: String, default: 'ahora' },
})

const emit = defineEmits(['cerrar', 'reservaConfirmada'])

const paso = ref(0)
const cargando = ref(false)
const toastRef = ref(null)
const errorGlobal = ref('')
const planProteccion = ref(null)

const pasos = ['Huésped', 'Pago', 'Protección']

const opcionesCodigoPais = [
  { value: '+1', label: '🇺🇸 USA +1' },
  { value: '+1-809', label: '🇩🇴 RD +1-809' },
  { value: '+52', label: '🇲🇽 MX +52' },
  { value: '+34', label: '🇪🇸 ES +34' },
  { value: '+57', label: '🇨🇴 CO +57' },
  { value: '+54', label: '🇦🇷 AR +54' },
]

const metodos = [
  {
    id: 'tarjeta',
    nombre: 'Tarjeta',
    logo: `<svg width="38" height="24" viewBox="0 0 38 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="38" height="24" rx="4" fill="#1A1F71"/>
      <text x="5" y="16" font-family="Arial" font-size="11" font-weight="700" fill="white" letter-spacing="0.5">VISA</text>
    </svg>`,
  },
  {
    id: 'paypal',
    nombre: 'PayPal',
    logo: `<svg width="72" height="20" viewBox="0 0 72 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <text x="0" y="15" font-family="Arial" font-size="15" font-weight="700" fill="#003087">Pay</text>
      <text x="26" y="15" font-family="Arial" font-size="15" font-weight="700" fill="#009CDE">Pal</text>
    </svg>`,
  },
  {
    id: 'affirm',
    nombre: 'Affirm',
    logo: `<svg width="62" height="20" viewBox="0 0 62 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="62" height="20" rx="4" fill="#060809"/>
      <text x="8" y="14" font-family="Arial" font-size="11" font-weight="700" fill="white" letter-spacing="0.3">affirm</text>
    </svg>`,
  },
  {
    id: 'applepay',
    nombre: 'Apple Pay',
    logo: `<svg width="52" height="24" viewBox="0 0 52 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="52" height="24" rx="4" fill="#000"/>
      <svg x="5" y="3" width="18" height="18" viewBox="0 0 814 1000">
        <path fill="white" d="M788.1 340.9c-5.8 4.5-108.2 62.2-108.2 190.5 0 148.4 130.3 200.9 134.2 202.2-.6 3.2-20.7 71.9-68.7 141.9-42.8 61.6-87.5 123.1-155.5 123.1s-85.5-39.5-164-39.5c-76 0-103.7 40.8-165.9 40.8s-105-57.8-155.5-127.4C46 790.7 0 663 0 541.8c0-207.5 135.4-317.3 269-317.3 70.1 0 128.4 46.4 172.5 46.4 42.8 0 109.6-49 192.1-49 30.8 0 134.2 2.6 198.3 99zM549.6 65.1c31.5-38.2 54.3-91.7 54.3-145.2 0-7.7-.6-15.4-2-22.4-51.7 2-112.9 34.3-149.8 77.1-28.9 33.1-56.6 86.6-56.6 140.8 0 8.3 1.3 16.6 2 19.2 3.2.6 8.3 1.3 13.4 1.3 46.4 0 103.1-31.5 138.7-70.8z"/>
      </svg>
      <text x="27" y="16" font-family="-apple-system, Arial" font-size="9" font-weight="600" fill="white">Pay</text>
    </svg>`,
  },
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
  idPlan: undefined,
})
const errors = ref({})

// ── Noches: usa prop si > 0, si no calcula desde fechas ──────────────────────
const nochesReal = computed(() => {
  if (props.noches && props.noches > 0) return props.noches
  if (!props.fechaInicio || !props.fechaFin) return 0
  const msDay = 1000 * 60 * 60 * 24
  const d1 = new Date(props.fechaInicio + 'T00:00:00')
  const d2 = new Date(props.fechaFin + 'T00:00:00')
  const diff = Math.round((d2 - d1) / msDay)
  return diff > 0 ? diff : 0
})

// ── Cálculos ─────────────────────────────────────────────────────────────────
const precioNoche = computed(() =>
  parseFloat(props.habitacion?.PRECIO_NOCHE ?? 0),
)
const subtotal = computed(() => precioNoche.value * nochesReal.value)
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
function formatearTelefono() {
  // Deja solo dígitos
  let digits = form.value.telefono.replace(/\D/g, '').slice(0, 10)

  // Aplica formato XXX-XXX-XXXX
  if (digits.length <= 3) {
    form.value.telefono = digits
  } else if (digits.length <= 6) {
    form.value.telefono = digits.slice(0, 3) + '-' + digits.slice(3)
  } else {
    form.value.telefono = digits.slice(0, 3) + '-' + digits.slice(3, 6) + '-' + digits.slice(6)
  }
}
function validarPaso1() {
  // Si no pagas con tarjeta, no validamos esos campos
  if (form.value.metodo !== 'tarjeta') return true

  ;['nombreTarjeta', 'numeroTarjeta', 'mesExp', 'cvv', 'codigoPostal'].forEach(
    validarCampo,
  )

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

function formatearTarjeta() {
  let v = form.value.tarjeta.numero.replace(/\D/g, '').slice(0, 16)
  form.value.tarjeta.numero = v.match(/.{1,4}/g)?.join(' ') ?? v
}
function formatearFechaExp() {
  let v = form.value.tarjeta.mes_exp.replace(/\D/g, '').slice(0, 4)
  if (v.length >= 3) v = v.slice(0, 2) + '/' + v.slice(2)
  form.value.tarjeta.mes_exp = v
  if (v.length === 5) {
    const [, a] = v.split('/')
    form.value.tarjeta.ano_exp = a
  }
}

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
      noches: nochesReal.value,
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
    let msg = err?.message ?? 'Ocurrió un error al procesar tu reserva. Intenta de nuevo.'
    
    if (msg.includes('Usuario no autenticado como cliente')) {
      msg = 'Tu cuenta no está configurada correctamente como cliente. Contacta a soporte.'
    }

    errorGlobal.value = msg
    toastRef.value?.show('error', msg)
  } finally {
    cargando.value = false
  }
}
</script>

<style scoped>@import '../assets/css/CheckoutReserva.css';</style>
