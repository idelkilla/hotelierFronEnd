<template>
  <div class="reserva-wrapper">
    <Header />

    <div class="reserva-contenido">

      <div class="reserva-resumen">
        <div class="resumen-card">
          <div class="resumen-header">
            <span class="avion-icon">✈</span>
            <div>
              <div class="resumen-ruta">{{ route.query.origen }} → {{ route.query.destino }}</div>
              <div class="resumen-aerolinea">{{ route.query.aerolinea }}</div>
            </div>
            <div class="resumen-precio-wrap">
              <span class="resumen-precio">${{ Number(route.query.precio).toLocaleString() }}</span>
              <span class="resumen-precio-tipo">por pasajero</span>
            </div>
          </div>
          <div class="resumen-horario">
            <div class="resumen-hora-item">
              <span class="hora-label">Salida</span>
              <span class="hora-val">{{ route.query.salida }}</span>
            </div>
            <div class="resumen-linea">
              <span class="linea"></span>
              <span class="punto"></span>
              <span class="linea"></span>
            </div>
            <div class="resumen-hora-item">
              <span class="hora-label">Llegada</span>
              <span class="hora-val">{{ route.query.llegada }}</span>
            </div>
          </div>
          <div class="resumen-tags">
            <span class="tag">✔ Equipaje de mano incluido</span>
            <span class="tag">✔ Cancelación flexible</span>
          </div>
        </div>
      </div>

      <div class="reserva-form-wrap">
        <h2 class="form-titulo">Datos del pasajero</h2>

        <div class="form-seccion">
          <h3 class="seccion-titulo">Información personal</h3>
          <div class="form-grid">
            <div class="form-field">
              <label>Nombre</label>
              <input v-model="form.nombre" type="text" placeholder="Ej: Juan" />
            </div>
            <div class="form-field">
              <label>Apellido</label>
              <input v-model="form.apellido" type="text" placeholder="Ej: Pérez" />
            </div>
            <div class="form-field">
              <label>Fecha de nacimiento</label>
              <input v-model="form.fechaNacimiento" type="date" />
            </div>
            <div class="form-field">
              <label>Nacionalidad</label>
              <input v-model="form.nacionalidad" type="text" placeholder="Ej: Dominicana" />
            </div>
            <div class="form-field full">
              <label>Número de pasaporte</label>
              <input v-model="form.pasaporte" type="text" placeholder="Ej: AB123456" />
            </div>
          </div>
        </div>

        <div class="form-seccion">
          <h3 class="seccion-titulo">Contacto</h3>
          <div class="form-grid">
            <div class="form-field full">
              <label>Correo electrónico</label>
              <input v-model="form.email" type="email" placeholder="correo@ejemplo.com" />
            </div>
            <div class="form-field">
              <label>Teléfono</label>
              <input v-model="form.telefono" type="tel" placeholder="+1 809 000 0000" />
            </div>
            <div class="form-field">
              <label>País de residencia</label>
              <input v-model="form.pais" type="text" placeholder="Ej: República Dominicana" />
            </div>
          </div>
        </div>

        <div class="form-seccion">
          <h3 class="seccion-titulo">Pago</h3>
          <div class="form-grid">
            <div class="form-field full">
              <label>Número de tarjeta</label>
              <input v-model="form.tarjeta" type="text" placeholder="0000 0000 0000 0000" maxlength="19" @input="formatarTarjeta" />
            </div>
            <div class="form-field">
              <label>Fecha de vencimiento</label>
              <input v-model="form.vencimiento" type="text" placeholder="MM/AA" maxlength="5" />
            </div>
            <div class="form-field">
              <label>CVV</label>
              <input v-model="form.cvv" type="text" placeholder="123" maxlength="3" />
            </div>
            <div class="form-field full">
              <label>Nombre en la tarjeta</label>
              <input v-model="form.nombreTarjeta" type="text" placeholder="Como aparece en la tarjeta" />
            </div>
          </div>
        </div>

        <div class="reserva-total">
          <div class="total-info">
            <span class="total-label">Total a pagar</span>
            <span class="total-precio">${{ Number(route.query.precio).toLocaleString() }}</span>
          </div>
          <button class="btn-confirmar" @click="confirmarReserva">Confirmar reserva</button>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import Header from '@/components/Header.vue';

const route = useRoute();
const router = useRouter();

const form = ref({
  nombre: '', apellido: '', fechaNacimiento: '', nacionalidad: '',
  pasaporte: '', email: '', telefono: '', pais: '',
  tarjeta: '', vencimiento: '', cvv: '', nombreTarjeta: '',
});

const formatarTarjeta = () => {
  form.value.tarjeta = form.value.tarjeta
    .replace(/\D/g, '')
    .replace(/(.{4})/g, '$1 ')
    .trim();
};

const confirmarReserva = () => {
  alert('¡Reserva confirmada! Te enviamos los detalles a tu correo.');
  router.push('/');
};
</script>

<style scoped>
.reserva-wrapper { background: #f8fafc; min-height: 100vh; width: 100%; }

.reserva-contenido {
  max-width: 1000px;
  margin: 0 auto;
  padding: 100px 20px 40px;
  display: grid;
  grid-template-columns: 300px 1fr;
  gap: 28px;
  align-items: flex-start;
}

.reserva-resumen { position: sticky; top: 90px; }
.resumen-card { background: #fff; border: 1px solid #e2e8f0; border-radius: 14px; padding: 20px; display: flex; flex-direction: column; gap: 16px; }
.resumen-header { display: flex; align-items: flex-start; gap: 12px; }
.avion-icon { font-size: 22px; color: #113955; flex-shrink: 0; margin-top: 2px; }
.resumen-ruta { font-size: 15px; font-weight: 700; color: #113955; }
.resumen-aerolinea { font-size: 12px; color: #6b7280; margin-top: 2px; }
.resumen-precio-wrap { margin-left: auto; text-align: right; }
.resumen-precio { display: block; font-size: 22px; font-weight: 700; color: #113955; }
.resumen-precio-tipo { font-size: 11px; color: #6b7280; }

.resumen-horario { display: flex; align-items: center; gap: 8px; background: #f8fafc; border-radius: 10px; padding: 12px; }
.resumen-hora-item { display: flex; flex-direction: column; align-items: center; gap: 2px; }
.hora-label { font-size: 11px; color: #6b7280; }
.hora-val { font-size: 14px; font-weight: 600; color: #113955; }
.resumen-linea { flex: 1; display: flex; align-items: center; }
.linea { flex: 1; height: 1.5px; background: #94a3b8; }
.punto { width: 7px; height: 7px; border-radius: 50%; background: #94a3b8; flex-shrink: 0; }

.resumen-tags { display: flex; flex-direction: column; gap: 4px; }
.tag { font-size: 12px; color: #27ae60; }

.reserva-form-wrap { background: #fff; border: 1px solid #e2e8f0; border-radius: 14px; padding: 28px; display: flex; flex-direction: column; gap: 28px; }
.form-titulo { font-size: 20px; font-weight: 700; color: #113955; margin: 0; }
.form-seccion { display: flex; flex-direction: column; gap: 14px; }
.seccion-titulo { font-size: 14px; font-weight: 600; color: #113955; padding-bottom: 8px; border-bottom: 1px solid #e2e8f0; margin: 0; }
.form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
.form-field { display: flex; flex-direction: column; gap: 6px; }
.form-field.full { grid-column: 1 / -1; }
.form-field label { font-size: 12px; font-weight: 500; color: #374151; }
.form-field input { border: 1px solid #e2e8f0; border-radius: 8px; padding: 10px 14px; font-size: 14px; color: #113955; outline: none; transition: border-color 0.2s; background: #fff; }
.form-field input:focus { border-color: #113955; }
.form-field input::placeholder { color: #9ca3af; }

.reserva-total { display: flex; align-items: center; justify-content: space-between; background: #113955; border-radius: 12px; padding: 18px 24px; gap: 16px; }
.total-info { display: flex; flex-direction: column; gap: 2px; }
.total-label { font-size: 12px; color: #94a3b8; }
.total-precio { font-size: 26px; font-weight: 700; color: #fff; }
.btn-confirmar { background: #fff; color: #113955; border: none; border-radius: 500px; padding: 13px 32px; font-size: 15px; font-weight: 700; cursor: pointer; white-space: nowrap; transition: background 0.2s, transform 0.1s; }
.btn-confirmar:hover { background: #e2e8f0; transform: scale(1.02); }
</style>