<template>
  <div class="login-page">
    <form class="modern-form" @submit.prevent="handleResetPassword">
      <h2 class="form-title">Resetear Contraseña</h2>

      <div v-if="tokenValid" class="form-body">
        <div class="input-group">
          <label class="label">Nueva Contraseña</label>
          <div class="input-wrapper">
            <svg fill="none" viewBox="0 0 24 24" class="input-icon">
              <path
                stroke-width="1.5"
                stroke="currentColor"
                d="M12 10V14M8 6H16C17.1046 6 18 6.89543 18 8V16C18 17.1046 17.1046 18 16 18H8C6.89543 18 6 17.1046 6 16V8C6 6.89543 6.89543 6 8 6Z"
              />
            </svg>
            <input
              v-model="newPassword"
              required
              placeholder="Nueva contraseña"
              class="form-input"
              :type="showPassword ? 'text' : 'password'"
            />
            <button
              class="password-toggle"
              type="button"
              @click="showPassword = !showPassword"
            >
              <svg v-if="!showPassword" fill="none" viewBox="0 0 24 24" class="eye-icon">
                <path
                  stroke-width="1.5"
                  stroke="currentColor"
                  d="M2 12C2 12 5 5 12 5C19 5 22 12 22 12C22 12 19 19 12 19C5 19 2 12 2 12Z"
                />
                <circle stroke-width="1.5" stroke="currentColor" r="3" cy="12" cx="12" />
              </svg>
              <svg v-else fill="none" viewBox="0 0 24 24" class="eye-icon">
                <path stroke-width="1.5" stroke="currentColor" stroke-linecap="round" d="M3 3L21 21"/>
                <circle stroke-width="1.5" stroke="currentColor" r="3" cy="12" cx="12" opacity="0.5"/>
              </svg>
            </button>
          </div>
        </div>

        <div class="input-group">
          <label class="label">Confirmar Contraseña</label>
          <div class="input-wrapper">
            <svg fill="none" viewBox="0 0 24 24" class="input-icon">
              <path
                stroke-width="1.5"
                stroke="currentColor"
                d="M12 10V14M8 6H16C17.1046 6 18 6.89543 18 8V16C18 17.1046 17.1046 18 16 18H8C6.89543 18 6 17.1046 6 16V8C6 6.89543 6.89543 6 8 6Z"
              />
            </svg>
            <input
              v-model="confirmPassword"
              required
              placeholder="Confirmar contraseña"
              class="form-input"
              :type="showPassword ? 'text' : 'password'"
            />
          </div>
        </div>

        <p v-if="error" class="error-message">{{ error }}</p>
        <p v-if="success" class="success-message">{{ success }}</p>
      </div>

      <div v-else class="form-body">
        <p v-if="loading" class="help-text">Verificando token...</p>
        <p v-else-if="tokenError" class="error-message">{{ tokenError }}</p>
      </div>

      <button
        v-if="tokenValid"
        class="submit-button"
        type="submit"
        :disabled="isLoading"
      >
        <span class="button-text">{{ isLoading ? 'Actualizando...' : 'Actualizar Contraseña' }}</span>
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
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { apiGet, apiPost } from '../services/api'

const router = useRouter()
const route = useRoute()

const newPassword = ref('')
const confirmPassword = ref('')
const showPassword = ref(false)
const isLoading = ref(false)
const error = ref(null)
const success = ref(null)
const tokenValid = ref(false)
const loading = ref(true)
const tokenError = ref(null)

const token = route.query.token

const verifyToken = async () => {
  try {
    if (!token) {
      throw new Error('Token no encontrado')
    }

    await apiGet(`/auth/verify-reset-token/${token}`)

    tokenValid.value = true
  } catch (err) {
    tokenError.value = err.message
  } finally {
    loading.value = false
  }
}

const handleResetPassword = async () => {
  error.value = null
  success.value = null

  // Validaciones
  if (newPassword.value.length < 6) {
    error.value = '**La contraseña debe tener al menos 6 caracteres**'
    return
  }

  if (newPassword.value !== confirmPassword.value) {
    error.value = '**Las contraseñas no coinciden**'
    return
  }

  isLoading.value = true

  try {
    await apiPost('/auth/reset-password', {
      token,
      newPassword: newPassword.value,
      confirmPassword: confirmPassword.value
    })

    success.value = '✅ Contraseña actualizada. Redirigiendo...'
    setTimeout(() => router.push('/login'), 2000)
  } catch (err) {
    error.value = err.message
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  verifyToken()
})
</script>

<style src="../assets/css/styles.css"></style>

<style scoped>
.label {
  display: block;
  margin-bottom: 8px;
  color: #374151;
  font-weight: 500;
}

.help-text {
  text-align: center;
  color: #6b7280;
}

.success-message {
  color: #10b981;
  padding: 8px;
  background-color: #ecfdf5;
  border-radius: 4px;
  margin-top: 8px;
}

.error-message {
  color: #ef4444;
  padding: 8px;
  background-color: #fee2e2;
  border-radius: 4px;
  margin-top: 8px;
}

.password-toggle {
  background: none;
  border: none;
  cursor: pointer;
  padding: 5px;
  color: #6b7280;
}

.eye-icon {
  width: 20px;
  height: 20px;
}
</style>
