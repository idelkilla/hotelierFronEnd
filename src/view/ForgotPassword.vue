<template>
  <div class="login-page">
    <form class="modern-form" @submit.prevent="handleForgotPassword">
      <h2 class="form-title">Recuperar Contraseña</h2>

      <div class="form-body">
        <p class="help-text">Ingresa tu correo y te enviaremos un enlace para resetear tu contraseña.</p>

        <div class="input-group">
          <div class="input-wrapper">
            <svg fill="none" viewBox="0 0 24 24" class="input-icon">
              <path
                stroke-width="1.5"
                stroke="currentColor"
                d="M3 8L10.8906 13.2604C11.5624 13.7083 12.4376 13.7083 13.1094 13.2604L21 8M5 19H19C20.1046 19 21 18.1046 21 17V7C21 5.89543 20.1046 5 19 5H5C3.89543 5 3 5.89543 3 7V17C3 18.1046 3.89543 19 5 19Z"
              />
            </svg>
            <input
              v-model="email"
              required
              placeholder="Usuario o Correo Electrónico"
              class="form-input"
              :class="{ 'input-error': error }"
              type="email"
            />
          </div>
          <p v-if="error" class="error-message">{{ error }}</p>
          <p v-if="success" class="success-message">{{ success }}</p>
        </div>
      </div>

      <button class="submit-button" type="submit" :disabled="isLoading">
        <span class="button-text">{{ isLoading ? 'Enviando...' : 'Enviar Enlace' }}</span>
        <div class="button-glow"></div>
      </button>

      <div class="form-footer">
        <router-link to="/login" class="login-link">
          <span class="abajo">← Volver al inicio de sesión</span>
        </router-link>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const API_URL = import.meta.env.VITE_API_URL || 'https://hotelierbackend-1.onrender.com'
const router = useRouter()

const email = ref('')
const isLoading = ref(false)
const error = ref(null)
const success = ref(null)

const handleForgotPassword = async () => {
  error.value = null
  success.value = null
  isLoading.value = true

  try {
    const response = await fetch(`${API_URL}/api/auth/forgot-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: email.value })
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.message || 'Error al procesar solicitud')
    }

    success.value = '✅ Enlace enviado. Revisa tu correo en 2 minutos.'
    email.value = ''

    // Redirigir después de 3 segundos
    setTimeout(() => router.push('/login'), 3000)
  } catch (err) {
    error.value = err.message || 'Error desconocido'
  } finally {
    isLoading.value = false
  }
}
</script>

<style src="../assets/css/styles.css"></style>

<style scoped>
.help-text {
  text-align: center;
  color: #6b7280;
  margin-bottom: 20px;
  font-size: 0.95rem;
}

.success-message {
  color: #10b981;
  font-size: 0.9rem;
  margin-top: 8px;
  padding: 8px;
  background-color: #ecfdf5;
  border-radius: 4px;
}

.error-message {
  color: #ef4444;
  font-size: 0.9rem;
  margin-top: 8px;
}

.input-error {
  border-color: #ef4444 !important;
}
</style>
