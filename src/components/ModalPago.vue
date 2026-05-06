<template>
  <Teleport to="body">
    <Transition name="modal-fade">
      <div class="modal-overlay" v-if="visible" @click.self="$emit('cerrar')">
        <div class="modal-box">
          <!-- Header -->
          <div class="modal-header">
            <button class="modal-close" @click="$emit('cerrar')">
              <span class="material-symbols-outlined">close</span>
            </button>
            <h3 class="modal-titulo">Indica cuándo prefieres pagar</h3>
            <p class="modal-reembolso">
              <span class="material-symbols-outlined">check_circle</span>
              Totalmente reembolsable antes del
              {{ fechaLimiteFormateada }}
            </p>
          </div>

          <!-- Opciones -->
          <div class="modal-opciones">
            <!-- Pagar ahora -->
            <div
              class="opcion-card"
              :class="{ selected: seleccion === 'ahora' }"
              @click="seleccion = 'ahora'"
            >
              <div class="opcion-radio">
                <span
                  class="material-symbols-outlined"
                  v-if="seleccion === 'ahora'"
                  >radio_button_checked</span
                >
                <span class="material-symbols-outlined" v-else
                  >radio_button_unchecked</span
                >
              </div>
              <div class="opcion-contenido">
                <h4 class="opcion-titulo">Paga el monto total ahora</h4>
                <ul class="opcion-lista">
                  <li>Puedes usar un cupón válido</li>
                  <li>Más formas de pago: crédito o débito y PayPal</li>
                </ul>
                <div class="opcion-precio">
                  <span class="precio-noche"
                    >${{
                      Number(habitacion?.PRECIO_NOCHE).toLocaleString()
                    }}/noche</span
                  >
                  <span class="precio-total" v-if="noches > 0">
                    ${{
                      (
                        Number(habitacion?.PRECIO_NOCHE) * noches
                      ).toLocaleString()
                    }}
                    en total
                  </span>
                  <span class="precio-nota">Total con impuestos y cargos</span>
                </div>
              </div>
            </div>

            <!-- Pagar después -->
            <div
              class="opcion-card"
              :class="{ selected: seleccion === 'despues' }"
              @click="seleccion = 'despues'"
            >
              <div class="opcion-radio">
                <span
                  class="material-symbols-outlined"
                  v-if="seleccion === 'despues'"
                  >radio_button_checked</span
                >
                <span class="material-symbols-outlined" v-else
                  >radio_button_unchecked</span
                >
              </div>
              <div class="opcion-contenido">
                <h4 class="opcion-titulo">Paga después, durante la estancia</h4>
                <ul class="opcion-lista">
                  <li>
                    Paga a la propiedad directamente en la moneda de su
                    preferencia (USD)
                  </li>
                </ul>
                <div class="opcion-precio">
                  <span class="precio-noche">
                    ${{
                      (Number(habitacion?.PRECIO_NOCHE) * 1.03).toLocaleString(
                        undefined,
                        { minimumFractionDigits: 0, maximumFractionDigits: 0 },
                      )
                    }}/noche
                  </span>
                  <span class="precio-total" v-if="noches > 0">
                    ${{
                      (
                        Number(habitacion?.PRECIO_NOCHE) *
                        1.03 *
                        noches
                      ).toLocaleString(undefined, {
                        minimumFractionDigits: 0,
                        maximumFractionDigits: 0,
                      })
                    }}
                    en total
                  </span>
                  <span class="precio-nota">Total con impuestos y cargos</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Botón confirmar -->
          <div class="modal-footer">
            <p class="modal-aviso" v-if="seleccion === 'ahora'">
              Aún no se te cobrará nada hasta confirmar.
            </p>
            <p class="modal-aviso" v-else-if="seleccion === 'despues'">
              No se te cobrará hasta que te hospedes.
            </p>
            <button
              class="btn-confirmar"
              :disabled="!seleccion"
              @click="confirmar"
            >
              {{
                seleccion === 'ahora'
                  ? 'Pagar ahora'
                  : seleccion === 'despues'
                    ? 'Pagar después'
                    : 'Selecciona una opción'
              }}
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  visible: { type: Boolean, default: false },
  habitacion: { type: Object, default: null },
  noches: { type: Number, default: 0 },
  fechaLimite: { type: String, default: '' }, // ej: "2025-05-07"
})

const emit = defineEmits(['cerrar', 'confirmar'])

const seleccion = ref('')

const fechaLimiteFormateada = computed(() => {
  if (!props.fechaLimite) return ''
  const d = new Date(props.fechaLimite + 'T00:00:00')
  return d.toLocaleDateString('es-DO', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
  })
})

function confirmar() {
  if (!seleccion.value) return
  emit('confirmar', {
    habitacion: props.habitacion,
    tipoPago: seleccion.value,
  })
  seleccion.value = ''
}
</script>

<style scoped>
/* ── Overlay ── */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.45);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 16px;
}

/* ── Box ── */
.modal-box {
  background: #fff;
  border-radius: 16px;
  width: 100%;
  max-width: 680px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.2);
  overflow: hidden;
}

/* ── Header ── */
.modal-header {
  padding: 20px 24px 16px;
  border-bottom: 1px solid #eee;
  position: relative;
}

.modal-close {
  position: absolute;
  top: 16px;
  left: 16px;
  background: none;
  border: none;
  cursor: pointer;
  color: #555;
  display: flex;
  align-items: center;
  padding: 4px;
  border-radius: 50%;
  transition: background 0.15s;
}
.modal-close:hover {
  background: #f0f0f0;
}

.modal-titulo {
  font-size: 17px;
  font-weight: 700;
  color: #1a1a1a;
  text-align: center;
  margin: 0 0 10px;
}

.modal-reembolso {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  font-size: 13px;
  color: #2a7a4b;
  margin: 0;
}
.modal-reembolso .material-symbols-outlined {
  font-size: 16px;
}

/* ── Opciones ── */
.modal-opciones {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  padding: 20px 24px;
}

@media (max-width: 560px) {
  .modal-opciones {
    grid-template-columns: 1fr;
  }
}

.opcion-card {
  border: 1.5px solid #ddd;
  border-radius: 12px;
  padding: 16px;
  cursor: pointer;
  transition:
    border-color 0.15s,
    box-shadow 0.15s;
  display: flex;
  flex-direction: column;
  gap: 10px;
  position: relative;
}
.opcion-card:hover {
  border-color: #113956;
}
.opcion-card.selected {
  border-color: #113956;
  box-shadow: 0 0 0 2px rgba(17, 57, 86, 0.15);
}

.opcion-radio {
  display: flex;
  align-items: center;
}
.opcion-radio .material-symbols-outlined {
  font-size: 20px;
  color: #113956;
}

.opcion-contenido {
  display: flex;
  flex-direction: column;
  gap: 8px;
  flex: 1;
}

.opcion-titulo {
  font-size: 14px;
  font-weight: 700;
  color: #1a1a1a;
  margin: 0;
}

.opcion-lista {
  padding-left: 16px;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.opcion-lista li {
  font-size: 13px;
  color: #555;
  line-height: 1.4;
}

.opcion-precio {
  margin-top: auto;
  display: flex;
  flex-direction: column;
  gap: 2px;
}
.precio-noche {
  font-size: 15px;
  font-weight: 700;
  color: #113956;
}
.precio-total {
  font-size: 13px;
  font-weight: 600;
  color: #1a1a1a;
}
.precio-nota {
  font-size: 11px;
  color: #999;
}

/* ── Footer ── */
.modal-footer {
  padding: 16px 24px 22px;
  border-top: 1px solid #eee;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
}

.modal-aviso {
  font-size: 12px;
  color: #888;
  margin: 0;
  text-align: center;
}

.btn-confirmar {
  width: 100%;
  max-width: 360px;
  background: #113956;
  color: #fff;
  border: none;
  padding: 13px;
  border-radius: 10px;
  font-size: 15px;
  font-weight: 700;
  cursor: pointer;
  transition: background 0.2s;
}
.btn-confirmar:hover:not(:disabled) {
  background: #1e5276;
}
.btn-confirmar:disabled {
  background: #ccc;
  cursor: not-allowed;
}

/* ── Transición ── */
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.2s ease;
}
.modal-fade-enter-active .modal-box,
.modal-fade-leave-active .modal-box {
  transition: transform 0.2s ease;
}
.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}
.modal-fade-enter-from .modal-box {
  transform: translateY(20px) scale(0.97);
}
</style>
